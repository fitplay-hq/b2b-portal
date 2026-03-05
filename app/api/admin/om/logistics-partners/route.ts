import { NextRequest, NextResponse } from "next/server";
import { checkPermission } from "@/lib/auth-middleware";
import { RESOURCES } from "@/lib/utils";
import prisma from "@/lib/prisma";
import { handleApiError } from "@/lib/api-errors";
import { OMLogisticsPartnerCreateSchema } from "@/lib/validations/om";

export async function GET(req: NextRequest) {
  try {
    const permissionCheck = await checkPermission(RESOURCES.COMPANIES, "view");
    if (!permissionCheck.success) {
      return NextResponse.json(
        { error: permissionCheck.error },
        {
          status:
            permissionCheck.error === "Authentication required" ? 401 : 403,
        },
      );
    }

    const logisticsPartners = await prisma.oMLogisticsPartner.findMany({
      orderBy: { name: "asc" },
    });

    return NextResponse.json(logisticsPartners);
  } catch (error: unknown) {
    return handleApiError(error);
  }
}

export async function POST(req: NextRequest) {
  try {
    const permissionCheck = await checkPermission(
      RESOURCES.COMPANIES,
      "create",
    );
    if (!permissionCheck.success) {
      return NextResponse.json(
        { error: permissionCheck.error },
        {
          status:
            permissionCheck.error === "Authentication required" ? 401 : 403,
        },
      );
    }

    const body = await req.json();
    const validatedData = OMLogisticsPartnerCreateSchema.parse(body);

    const logisticsPartner = await prisma.oMLogisticsPartner.create({
      data: validatedData,
    });

    return NextResponse.json(
      {
        message: "Logistics Partner created successfully",
        id: logisticsPartner.id,
        data: logisticsPartner,
      },
      { status: 201 },
    );
  } catch (error: unknown) {
    return handleApiError(error);
  }
}
