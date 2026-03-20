import { NextRequest, NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";
import { checkPermission } from "@/lib/auth-middleware";
import { RESOURCES } from "@/lib/utils";
import prisma from "@/lib/prisma";
import { handleApiError } from "@/lib/api-errors";
import { OMPurchaseOrderUpdateSchema } from "@/lib/validations/om";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const permissionCheck = await checkPermission(RESOURCES.ORDERS, "view");
    if (!permissionCheck.success) {
      return NextResponse.json(
        { error: permissionCheck.error },
        {
          status:
            permissionCheck.error === "Authentication required" ? 401 : 403,
        },
      );
    }

    const purchaseOrder = await prisma.oMPurchaseOrder.findUnique({
      where: { id },
      include: {
        client: true,
        deliveryLocations: true,
        items: {
          include: {
            product: { include: { brands: true } },
            OMBrand: true,
            dispatchItems: true,
          },
        },
        dispatchOrders: {
          include: {
            logisticsPartner: true,
            items: true,
          },
        },
      },
    });

    if (!purchaseOrder) {
      return NextResponse.json(
        { error: "Purchase Order not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(purchaseOrder);
  } catch (error: unknown) {
    return handleApiError(error);
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const permissionCheck = await checkPermission(RESOURCES.ORDERS, "delete");
    if (!permissionCheck.success) {
      return NextResponse.json(
        { error: permissionCheck.error },
        {
          status:
            permissionCheck.error === "Authentication required" ? 401 : 403,
        },
      );
    }

    const dispatchesCount = await prisma.oMDispatchOrder.count({
      where: { purchaseOrderId: id },
    });

    if (dispatchesCount > 0) {
      return NextResponse.json(
        { error: "Cannot delete Purchase Order with active dispatches" },
        { status: 400 },
      );
    }

    await prisma.oMPurchaseOrder.delete({
      where: { id },
    });

    revalidateTag("om-clients", "max");
    revalidateTag("om-dashboard", "max");
    revalidateTag("om-purchase-orders", "max");
    revalidateTag("om-dispatch-orders", "max");
    revalidateTag("om-delivery-locations", "max");

    revalidatePath("/admin/order-management/purchase-orders");
    revalidatePath("/admin/dashboard");

    return NextResponse.json({
      success: true,
      message: "Purchase order deleted",
    });
  } catch (error: unknown) {
    return handleApiError(error);
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const permissionCheck = await checkPermission(RESOURCES.ORDERS, "update");
    if (!permissionCheck.success) {
      return NextResponse.json(
        { error: permissionCheck.error },
        {
          status:
            permissionCheck.error === "Authentication required" ? 401 : 403,
        },
      );
    }

    const { items, ...updates } = await req.json();

    const existingPO = await prisma.oMPurchaseOrder.findUnique({
      where: { id },
      include: { items: { include: { dispatchItems: true } } },
    });

    if (!existingPO) {
      return NextResponse.json(
        { error: "Purchase Order not found" },
        { status: 404 },
      );
    }

    if (items && Array.isArray(items)) {
      for (const updatedItem of items) {
        if (!updatedItem.id) continue;
        const existingItem = existingPO.items.find(
          (i) => i.id === updatedItem.id,
        );
        if (
          existingItem &&
          updatedItem.rate !== undefined &&
          existingItem.rate !== updatedItem.rate
        ) {
          const totalDispatched = existingItem.dispatchItems.reduce(
            (acc, d) => acc + d.quantity,
            0,
          );
          if (totalDispatched > 0) {
            // Placeholder since specific OMActionLog model was omitted per user request
            console.warn(
              `[PO Protection] Item ${existingItem.id} rate updated from ${existingItem.rate} to ${updatedItem.rate} while having ${totalDispatched} items dispatched.`,
            );
          }
        }
      }
    }

    revalidateTag("om-clients", "max");
    revalidateTag("om-dashboard", "max");
    revalidateTag("om-purchase-orders", "max");
    revalidateTag("om-dispatch-orders", "max");
    revalidateTag("om-delivery-locations", "max");

    revalidatePath("/admin/order-management/purchase-orders");
    revalidatePath("/admin/dashboard");

    return NextResponse.json({
      success: true,
      message: "PO rate validation logic applied.",
    });
  } catch (error: unknown) {
    return handleApiError(error);
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const permissionCheck = await checkPermission(RESOURCES.ORDERS, "update");
    if (!permissionCheck.success) {
      return NextResponse.json(
        { error: permissionCheck.error },
        {
          status:
            permissionCheck.error === "Authentication required" ? 401 : 403,
        },
      );
    }

    const body = await req.json();
    const validatedData = OMPurchaseOrderUpdateSchema.parse(body);

    const existingPO = await prisma.oMPurchaseOrder.findUnique({
      where: { id },
      include: { items: true },
    });
    if (!existingPO) {
      return NextResponse.json(
        { error: "Purchase Order not found" },
        { status: 404 },
      );
    }

    const {
      clientId,
      deliveryLocationIds,
      estimateNumber,
      estimateDate,
      poNumber,
      poDate,
      poReceivedDate,
      status,
      items,
    } = validatedData;

    const effectiveStatus = poNumber
      ? (status ?? "CONFIRMED")
      : (status ?? "DRAFT");

    let totalGst = 0;
    let grandTotal = 0;
    let totalQuantity = existingPO.totalQuantity || 0;
    let totalDispatched = existingPO.dispatchedQuantity || 0;

    let processedItemsToCreate: any[] = [];
    let processedItemsToUpdate: any[] = [];
    let itemsToDelete: string[] = [];

    if (items) {
      totalGst = 0;
      grandTotal = 0;
      totalQuantity = 0;
      totalDispatched = 0;

      const existingItemsMap = new Map();
      for (const item of existingPO.items) {
        existingItemsMap.set(item.productId, item);
      }

      const itemsToKeepByProductId = new Set();

      for (const item of items) {
        const existingItem = existingItemsMap.get(item.productId);
        const amount = item.quantity * item.rate;
        const gstAmount = amount * (item.gstPercentage / 100);
        const totalAmount = amount + gstAmount;

        totalGst += gstAmount;
        grandTotal += totalAmount;
        totalQuantity += item.quantity;
        itemsToKeepByProductId.add(item.productId);

        if (existingItem) {
          const dispQty = existingItem.dispatchedQuantity || 0;
          if (item.quantity < dispQty) {
            return NextResponse.json(
              { error: `Cannot reduce quantity of an item below its already dispatched quantity (${dispQty}).` },
              { status: 400 }
            );
          }
          totalDispatched += dispQty;
          processedItemsToUpdate.push({
            where: { id: existingItem.id },
            data: {
              quantity: item.quantity,
              rate: item.rate,
              amount,
              gstPercentage: item.gstPercentage,
              gstAmount,
              totalAmount,
              brandId: item.brandId || null,
              description: item.description || null,
              remainingQuantity: item.quantity - dispQty
            }
          });
        } else {
          processedItemsToCreate.push({
            productId: item.productId,
            quantity: item.quantity,
            rate: item.rate,
            amount,
            gstPercentage: item.gstPercentage,
            gstAmount,
            totalAmount,
            brandId: item.brandId || null,
            description: item.description || null,
            dispatchedQuantity: 0,
            remainingQuantity: item.quantity
          });
        }
      }

      for (const item of existingPO.items) {
        if (!itemsToKeepByProductId.has(item.productId)) {
          if ((item.dispatchedQuantity || 0) > 0) {
            return NextResponse.json(
              { error: `Cannot delete an item that has already been partially or fully dispatched.` },
              { status: 400 }
            );
          }
          itemsToDelete.push(item.id);
        }
      }
    }

    const purchaseOrder = await prisma.$transaction(async (tx) => {
      if (items) {
        if (itemsToDelete.length > 0) {
          await tx.oMPurchaseOrderItem.deleteMany({
            where: { id: { in: itemsToDelete } },
          });
        }
        for (const updateOp of processedItemsToUpdate) {
          await tx.oMPurchaseOrderItem.update(updateOp);
        }
      }

      return tx.oMPurchaseOrder.update({
        where: { id },
        data: {
          ...(clientId !== undefined && { clientId }),
          ...(deliveryLocationIds !== undefined && {
            deliveryLocations: {
              set: deliveryLocationIds.map((locId: string) => ({ id: locId })),
            },
          }),
          estimateNumber: estimateNumber ?? null,
          estimateDate: estimateDate ? new Date(estimateDate) : null,
          poNumber: poNumber ?? null,
          poDate: poDate ? new Date(poDate) : null,
          poReceivedDate: poReceivedDate ? new Date(poReceivedDate) : null,
          status: effectiveStatus,
          totalGst: items ? totalGst : undefined,
          grandTotal: items ? grandTotal : undefined,
          totalQuantity: items ? totalQuantity : undefined,
          dispatchedQuantity: items ? totalDispatched : undefined,
          remainingQuantity: items ? (totalQuantity - totalDispatched) : undefined,
          ...(items && processedItemsToCreate.length > 0 && {
            items: { create: processedItemsToCreate },
          }),
        },
        include: {
          items: true,
          client: true,
          deliveryLocations: true,
        },
      });
    });

    revalidateTag("om-clients", "max");
    revalidateTag("om-dashboard", "max");
    revalidateTag("om-purchase-orders", "max");
    revalidateTag("om-dispatch-orders", "max");
    revalidateTag("om-delivery-locations", "max");

    revalidatePath("/admin/order-management/purchase-orders");
    revalidatePath("/admin/dashboard");

    return NextResponse.json({
      message: "Purchase Order updated successfully",
      data: purchaseOrder,
    });
  } catch (error: unknown) {
    return handleApiError(error);
  }
}
