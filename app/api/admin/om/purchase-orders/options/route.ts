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

    const pos = await prisma.oMPurchaseOrder.findMany({
      where: {
        poNumber: { not: null },
      },
      select: {
        poNumber: true,
      },
      distinct: ["poNumber"],
      orderBy: { poNumber: "asc" },
    });

    return NextResponse.json(
      pos
        .filter((po) => po.poNumber)
        .map((po) => ({
          value: po.poNumber,
          label: po.poNumber,
        })),
    );
  } catch (error: unknown) {
    return handleApiError(error);
  }
}
