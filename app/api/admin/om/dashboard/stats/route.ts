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

    const totalOrders = await prisma.oMPurchaseOrder.count();

    const allItems = await prisma.oMPurchaseOrderItem.findMany({
      select: {
        quantity: true,
        dispatchItems: {
          select: {
            quantity: true,
          },
        },
      },
    });

    let totalOrdered = 0;
    let totalDispatched = 0;

    for (const item of allItems) {
      totalOrdered += item.quantity;
      for (const dItem of item.dispatchItems) {
        totalDispatched += dItem.quantity;
      }
    }

    const fulfillmentRate =
      totalOrdered > 0 ? (totalDispatched / totalOrdered) * 100 : 0;

    const totalRevenueResult = await prisma.oMPurchaseOrder.aggregate({
      _sum: {
        grandTotal: true,
      },
    });

    const totalRevenue = totalRevenueResult._sum.grandTotal || 0;

    return NextResponse.json({
      totalOrders,
      fulfillmentRate: Math.round(fulfillmentRate * 100) / 100,
      totalRevenue,
    });
  } catch (error: unknown) {
    return handleApiError(error);
  }
}
