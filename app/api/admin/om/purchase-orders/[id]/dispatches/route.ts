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

    const purchaseOrder = await prisma.oMPurchaseOrder.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!purchaseOrder) {
      return NextResponse.json(
        { error: "Purchase Order not found" },
        { status: 404 },
      );
    }

    const dispatches = await prisma.oMDispatchOrder.findMany({
      where: { purchaseOrderId: id },
      include: {
        logisticsPartner: true,
        items: {
          include: {
            purchaseOrderItem: {
              include: { product: true },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ data: dispatches });
  } catch (error: unknown) {
    return handleApiError(error);
  }
}
