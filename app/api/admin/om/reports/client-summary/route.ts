import { NextRequest, NextResponse } from "next/server";
import { checkPermission } from "@/lib/auth-middleware";
import { RESOURCES } from "@/lib/utils";
import prisma from "@/lib/prisma";
import { handleApiError } from "@/lib/api-errors";

export async function GET(req: NextRequest) {
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

    const items = await prisma.oMPurchaseOrderItem.findMany({
      include: {
        purchaseOrder: {
          include: {
            client: true,
          },
        },
        dispatchItems: true,
      },
    });

    const clientSummary: Record<
      string,
      {
        clientId: string;
        clientName: string;
        totalOrderedQuantity: number;
        totalDispatchedQuantity: number;
        totalAmount: number;
      }
    > = {};

    for (const item of items) {
      const clientId = item.purchaseOrder.clientId;
      const clientName = item.purchaseOrder.client.name;

      if (!clientSummary[clientId]) {
        clientSummary[clientId] = {
          clientId,
          clientName,
          totalOrderedQuantity: 0,
          totalDispatchedQuantity: 0,
          totalAmount: 0,
        };
      }

      const dispatchedQty = item.dispatchItems.reduce(
        (acc, dispatchItem) => acc + dispatchItem.quantity,
        0,
      );

      clientSummary[clientId].totalOrderedQuantity += item.quantity;
      clientSummary[clientId].totalDispatchedQuantity += dispatchedQty;
      clientSummary[clientId].totalAmount += item.totalAmount;
    }

    return NextResponse.json(Object.values(clientSummary));
  } catch (error: unknown) {
    return handleApiError(error);
  }
}
