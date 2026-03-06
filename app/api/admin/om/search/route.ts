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

    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q") || "";

    const whereClause: any = query
      ? {
          OR: [
            { poNumber: { contains: query, mode: "insensitive" } },
            { client: { name: { contains: query, mode: "insensitive" } } },
            {
              dispatchOrders: {
                some: {
                  invoiceNumber: { contains: query, mode: "insensitive" },
                },
              },
            },
            {
              items: {
                some: {
                  product: { sku: { contains: query, mode: "insensitive" } },
                },
              },
            },
            {
              items: {
                some: {
                  product: { name: { contains: query, mode: "insensitive" } },
                },
              },
            },
          ],
        }
      : {};

    const purchaseOrders = await prisma.oMPurchaseOrder.findMany({
      where: whereClause,
      include: {
        client: true,
        deliveryLocation: true,
        items: {
          include: {
            product: true,
            dispatchItems: true,
          },
        },
        dispatchOrders: true,
      },
      take: query ? 20 : 50,
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ results: purchaseOrders });
  } catch (error: unknown) {
    return handleApiError(error);
  }
}
