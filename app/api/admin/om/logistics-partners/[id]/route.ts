import { NextRequest, NextResponse } from "next/server";
import { checkPermission } from "@/lib/auth-middleware";
import { RESOURCES } from "@/lib/utils";
import prisma from "@/lib/prisma";
import { handleApiError } from "@/lib/api-errors";
import { OMLogisticsPartnerUpdateSchema } from "@/lib/validations/om";
import { revalidatePath, revalidateTag } from "next/cache";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const permissionCheck = await checkPermission(
      RESOURCES.COMPANIES,
      "update",
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
    const validatedData = OMLogisticsPartnerUpdateSchema.parse(body);

    const logisticsPartner = await prisma.oMLogisticsPartner.update({
      where: { id },
      data: validatedData,
    });

    revalidateTag("om-logistics-partners", "max");
    revalidatePath("/admin/order-management/logistics-partners");

    return NextResponse.json(
      {
        message: "Logistics Partner updated successfully",
        data: logisticsPartner,
      },
      { status: 200 },
    );
  } catch (error: unknown) {
    return handleApiError(error);
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const permissionCheck = await checkPermission(
      RESOURCES.COMPANIES,
      "delete",
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

    await prisma.oMLogisticsPartner.delete({
      where: { id },
    });

    revalidateTag("om-logistics-partners", "max");
    revalidatePath("/admin/order-management/logistics-partners");

    return NextResponse.json(
      { message: "Logistics Partner deleted successfully" },
      { status: 200 },
    );
  } catch (error: unknown) {
    return handleApiError(error);
  }
}
