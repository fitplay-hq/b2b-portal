import { NextRequest, NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";
import { checkPermission } from "@/lib/auth-middleware";
import { RESOURCES } from "@/lib/utils";
import prisma from "@/lib/prisma";
import { handleApiError } from "@/lib/api-errors";
import {
  OMDispatchOrderCreateSchema,
  OMDispatchOrderUpdateSchema,
} from "@/lib/validations/om";

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

    const dispatchOrder = await prisma.oMDispatchOrder.findUnique({
      where: { id },
      include: {
        purchaseOrder: {
          include: {
            client: true,
            deliveryLocations: true,
          },
        },
        deliveryLocation: true,
        logisticsPartner: true,
        items: {
          include: {
            purchaseOrderItem: {
              include: {
                product: true,
              },
            },
          },
        },
        shipmentBoxes: {
          include: {
            contents: {
              include: {
                dispatchOrderItem: {
                  include: {
                    purchaseOrderItem: {
                      include: {
                        product: true,
                      },
                    },
                  },
                },
              },
            },
          },
          orderBy: { createdAt: "asc" },
        },
      },
    });

    if (!dispatchOrder) {
      return NextResponse.json(
        { error: "Dispatch Order not found" },
        { status: 404 },
      );
    }

    // Map shipmentBoxes to match the frontend interface OMShipmentBox safely
    const formattedDispatch = {
      ...dispatchOrder,
      shipmentBoxes: (dispatchOrder.shipmentBoxes || []).map((box: any) => ({
        boxId: box.id,
        boxNumber: box.boxLabel || `Box ${box.id.slice(0, 4)}`,
        length: box.length,
        width: box.width,
        height: box.height,
        weight: box.weight,
        numberOfBoxes: box.numberOfBoxes,
        contents: (box.contents || []).map((c: any) => ({
          contentId: c.id,
          itemId: c.dispatchOrderItem?.purchaseOrderItemId || "unknown",
          itemName: c.dispatchOrderItem?.purchaseOrderItem?.product?.name || "Unknown Item",
          quantity: c.quantityPerBox,
          dispatchOrderItemId: c.dispatchOrderItemId,
        })),
      })),
    };

    return NextResponse.json(formattedDispatch);
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

    const body = await req.json();

    // Use Zod validation
    const validatedData = OMDispatchOrderUpdateSchema.parse(body);

    const {
      invoiceNumber,
      invoiceDate,
      logisticsPartnerId,
      docketNumber,
      expectedDeliveryDate,
      dispatchDate,
      deliveryDate,
      deliveryLocationId,
      status,
      items,
      shipmentBoxes,
    } = validatedData;

    // Validate that invoice date is not before PO date
    if (invoiceDate) {
      let poId = validatedData.purchaseOrderId;
      if (!poId) {
        const existingDispatch = await prisma.oMDispatchOrder.findUnique({
          where: { id },
          select: { purchaseOrderId: true },
        });
        if (existingDispatch) poId = existingDispatch.purchaseOrderId;
      }

      if (poId) {
        const purchaseOrder = await prisma.oMPurchaseOrder.findUnique({
          where: { id: poId },
          select: { poDate: true },
        });

        if (purchaseOrder?.poDate) {
          const invDateObj = new Date(invoiceDate);
          const poDateObj = new Date(purchaseOrder.poDate);
          // Normalize dates to start of day for accurate comparison if time isn't critical
          if (invDateObj < poDateObj) {
            return NextResponse.json(
              { error: "Invoice Date cannot be earlier than the Purchase Order Date." },
              { status: 400 },
            );
          }
        }
      }
    }

    // We use a transaction because we need to delete old items and create new ones
    const updatedDispatch = await prisma.$transaction(async (tx) => {
      // 1. Delete existing items for this dispatch
      await tx.oMDispatchOrderItem.deleteMany({
        where: { dispatchOrderId: id },
      });

      // 2. Update the main dispatch order and create new items
      const dispatch = await tx.oMDispatchOrder.update({
        where: { id },
        data: {
          invoiceNumber: invoiceNumber ? invoiceNumber.trim() : null,
          invoiceDate: invoiceDate ? new Date(invoiceDate) : null,
          logisticsPartnerId: logisticsPartnerId || null,
          docketNumber,
          expectedDeliveryDate: expectedDeliveryDate ? new Date(expectedDeliveryDate) : null,
          dispatchDate: dispatchDate ? new Date(dispatchDate) : null,
          deliveryDate: deliveryDate ? new Date(deliveryDate) : null,
          deliveryLocationId: deliveryLocationId || null,
          status,
          items: {
            create: (items || []).map((item: any) => ({
              purchaseOrderItemId: item.purchaseOrderItemId || item.poLineItemId,
              quantity: item.quantity || item.dispatchQty,
              rate: item.rate,
              amount: item.amount,
              gstPercentage: item.gstPercentage,
              gstAmount: item.gstAmount,
              totalAmount: item.totalAmount,
            })),
          },
        },
        include: {
          items: true,
        },
      });

      // 3. Update Shipment Boxes
      // First, delete existing boxes (and contents will be deleted via cascade)
      await tx.oMShipmentBox.deleteMany({
        where: { dispatchOrderId: id },
      });

      if (shipmentBoxes && shipmentBoxes.length > 0) {
        for (const box of shipmentBoxes) {
          const createdBox = await tx.oMShipmentBox.create({
            data: {
              dispatchOrderId: dispatch.id,
              boxLabel: box.boxNumber?.toString() || "1",
              length: box.length,
              width: box.width,
              height: box.height,
              weight: box.weight || 0,
              numberOfBoxes: box.numberOfBoxes,
            },
          });

          if (box.contents) {
            for (const content of box.contents) {
              const dispatchItem = dispatch.items.find(
                (di) => di.purchaseOrderItemId === content.itemId,
              );

              if (dispatchItem) {
                await tx.oMShipmentBoxContent.create({
                  data: {
                    shipmentBoxId: createdBox.id,
                    dispatchOrderItemId: dispatchItem.id,
                    quantityPerBox: content.quantity,
                  },
                });
              }
            }
          }
        }
      }

      return dispatch;
    });

    revalidateTag("om-dispatch-orders", "max");
    revalidateTag("om-purchase-orders", "max");
    revalidateTag("om-dashboard", "max");

    revalidatePath("/admin/order-management/dispatches");
    revalidatePath("/admin/order-management/purchase-orders");
    revalidatePath("/admin/dashboard");

    return NextResponse.json(updatedDispatch);
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
    const { status } = body;

    // Validate status value
    const validStatuses = [
      "PENDING", "APPROVED", "READY_FOR_DISPATCH",
      "DISPATCHED", "AT_DESTINATION", "DELIVERED", "CANCELLED",
    ];
    if (!status || !validStatuses.includes(status)) {
      return NextResponse.json(
        { error: "Invalid status value" },
        { status: 400 },
      );
    }

    const updatedDispatch = await prisma.oMDispatchOrder.update({
      where: { id },
      data: { status },
    });

    revalidateTag("om-dispatch-orders", "max");
    revalidateTag("om-purchase-orders", "max");
    revalidateTag("om-dashboard", "max");

    revalidatePath("/admin/order-management/dispatches");
    revalidatePath("/admin/order-management/purchase-orders");
    revalidatePath("/admin/dashboard");

    return NextResponse.json(updatedDispatch);
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

    // Logic to revert PO status might be complex if deleting a dispatch
    // For now, simple delete or handle status reversion
    await prisma.oMDispatchOrder.delete({
      where: { id },
    });

    // @ts-expect-error: Next.js revalidateTag argument count mismatch
    revalidateTag("om-dispatch-orders");
    // @ts-expect-error: Next.js revalidateTag argument count mismatch
    revalidateTag("om-purchase-orders");
    // @ts-expect-error: Next.js revalidateTag argument count mismatch
    revalidateTag("om-dashboard");

    revalidatePath("/admin/order-management/dispatches");
    revalidatePath("/admin/order-management/purchase-orders");
    revalidatePath("/admin/dashboard");

    return NextResponse.json({
      success: true,
      message: "Dispatch order deleted",
    });
  } catch (error: unknown) {
    return handleApiError(error);
  }
}
