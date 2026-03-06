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
        product: true,
        dispatchItems: true,
      },
    });

    const itemSummary: Record<
      string,
      {
        productId: string;
        productName: string;
        sku: string;
        totalOrderedQuantity: number;
        totalDispatchedQuantity: number;
        totalAmount: number;
      }
    > = {};

    for (const item of items) {
      const productId = item.productId;
      const productName = item.product.name;
      const sku = item.product.sku || "N/A";

      if (!itemSummary[productId]) {
        itemSummary[productId] = {
          productId,
          productName,
          sku,
          totalOrderedQuantity: 0,
          totalDispatchedQuantity: 0,
          totalAmount: 0,
        };
      }

      const dispatchedQty = item.dispatchItems.reduce(
        (acc, dispatchItem) => acc + dispatchItem.quantity,
        0,
      );

      itemSummary[productId].totalOrderedQuantity += item.quantity;
      itemSummary[productId].totalDispatchedQuantity += dispatchedQty;
      itemSummary[productId].totalAmount += item.totalAmount;
    }

    return NextResponse.json(Object.values(itemSummary));
  } catch (error: unknown) {
    return handleApiError(error);
  }
}
