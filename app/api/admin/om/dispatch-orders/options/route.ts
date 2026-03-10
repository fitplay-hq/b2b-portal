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

    const dispatches = await prisma.oMDispatchOrder.findMany({
      where: {
        invoiceNumber: { not: null },
      },
      select: {
        invoiceNumber: true,
      },
      distinct: ["invoiceNumber"],
      orderBy: { invoiceNumber: "asc" },
    });

    return NextResponse.json(
      dispatches
        .filter((d) => d.invoiceNumber)
        .map((d) => ({
          value: d.invoiceNumber,
          label: d.invoiceNumber,
        })),
    );
  } catch (error: unknown) {
    return handleApiError(error);
  }
}
