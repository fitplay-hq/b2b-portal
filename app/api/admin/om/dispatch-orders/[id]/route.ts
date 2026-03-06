import { NextRequest, NextResponse } from "next/server";
import { checkPermission } from "@/lib/auth-middleware";
import { RESOURCES } from "@/lib/utils";
import prisma from "@/lib/prisma";
import { handleApiError } from "@/lib/api-errors";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
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
      where: { id: params.id },
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

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
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
      where: { id: params.id },
    });

    return NextResponse.json({
      success: true,
      message: "Dispatch order deleted",
    });
  } catch (error: unknown) {
    return handleApiError(error);
  }
}
