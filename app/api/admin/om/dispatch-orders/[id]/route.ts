import { NextRequest, NextResponse } from "next/server";
import { checkPermission } from "@/lib/auth-middleware";
import { RESOURCES } from "@/lib/utils";
import prisma from "@/lib/prisma";
import { handleApiError } from "@/lib/api-errors";

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
            deliveryLocation: true,
          },
        },
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
      },
    });

    if (!dispatchOrder) {
      return NextResponse.json(
        { error: "Dispatch Order not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(dispatchOrder);
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
    const {
      invoiceNumber,
      invoiceDate,
      logisticsPartnerId,
      docketNumber,
      expectedDeliveryDate,
      status,
      items,
    } = body;

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
          invoiceNumber,
          invoiceDate: new Date(invoiceDate),
          logisticsPartnerId,
          docketNumber,
          expectedDeliveryDate: new Date(expectedDeliveryDate),
          status,
          items: {
            create: items.map((item: any) => ({
              purchaseOrderItemId: item.poLineItemId,
              quantity: item.dispatchQty,
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

      return dispatch;
    });

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

    return NextResponse.json({
      success: true,
      message: "Dispatch order deleted",
    });
  } catch (error: unknown) {
    return handleApiError(error);
  }
}
