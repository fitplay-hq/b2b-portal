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
    const clientName = searchParams.get("clientName");
    const type = searchParams.get("type") || "invoice";

    if (type === "docket") {
      const where: any = {
        docketNumber: { not: null, notIn: [""] },
      };

      if (clientName) {
        where.purchaseOrder = { client: { name: clientName } };
      }

      const dispatches = await prisma.oMDispatchOrder.findMany({
        where,
        select: {
          docketNumber: true,
        },
        distinct: ["docketNumber"],
        orderBy: { docketNumber: "asc" },
        take: 50,
      });

      return NextResponse.json(
        dispatches
          .filter((d) => d.docketNumber)
          .map((d) => ({
            value: d.docketNumber,
            label: d.docketNumber,
          })),
      );
    }

    // Default to invoice
    const where: any = {
      invoiceNumber: { not: null, notIn: [""] },
    };

    if (clientName) {
      where.purchaseOrder = { client: { name: clientName } };
    }

    const dispatches = await prisma.oMDispatchOrder.findMany({
      where,
      select: {
        invoiceNumber: true,
      },
      distinct: ["invoiceNumber"],
      orderBy: { invoiceNumber: "asc" },
      take: 50,
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
