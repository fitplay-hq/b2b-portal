import { NextRequest, NextResponse } from "next/server";
import { checkPermission } from "@/lib/auth-middleware";
import { RESOURCES } from "@/lib/utils";
import prisma from "@/lib/prisma";
import { handleApiError } from "@/lib/api-errors";
import { OMLogisticsPartnerCreateSchema } from "@/lib/validations/om";
import { revalidatePath, revalidateTag } from "next/cache";
import { getOMLogisticsPartners } from "@/lib/om-data";

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

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "50");

    const result = await getOMLogisticsPartners({ page, limit });

    return NextResponse.json(result);
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

    revalidateTag("om-logistics-partners", "max");
    revalidatePath("/admin/order-management/logistics-partners");

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
