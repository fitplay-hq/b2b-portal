import { NextRequest, NextResponse } from "next/server";
import { checkPermission } from "@/lib/auth-middleware";
import { RESOURCES } from "@/lib/utils";
import prisma from "@/lib/prisma";
import { handleApiError } from "@/lib/api-errors";
import { getOMDashboardData } from "@/lib/om-data";

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
    const params: any = {
      query: searchParams.get("q") || "",
      fromDate: searchParams.get("fromDate") || undefined,
      toDate: searchParams.get("toDate") || undefined,
      clientName: searchParams.get("clientName") || undefined,
      itemName: searchParams.get("itemName") || undefined,
      brandName: searchParams.get("brandName") || undefined,
      poNumber: searchParams.get("poNumber") || undefined,
      invoiceNumber: searchParams.get("invoiceNumber") || undefined,
      logisticsPartnerId: searchParams.get("logisticsPartnerId") || undefined,
      locationId: searchParams.get("locationId") || undefined,
      statuses: searchParams.getAll("status"),
      sku: searchParams.get("sku") || undefined,
      docketNumber: searchParams.get("docketNumber") || undefined,
      minAmount: searchParams.get("minAmount") || undefined,
      maxAmount: searchParams.get("maxAmount") || undefined,
      gstPercentage: searchParams.get("gstPercentage") || undefined,
      timeRange: searchParams.get("timeRange") || "all",
    };

    const { pos } = await getOMDashboardData(params);

    return NextResponse.json({ results: pos });
  } catch (error: unknown) {
    return handleApiError(error);
  }
}
