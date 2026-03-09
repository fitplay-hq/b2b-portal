import { NextRequest, NextResponse } from "next/server";
import { checkPermission } from "@/lib/auth-middleware";
import { RESOURCES } from "@/lib/utils";
import prisma from "@/lib/prisma";
import { handleApiError } from "@/lib/api-errors";
import { OMBrandCreateSchema } from "@/lib/validations/om";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const permissionCheck = await checkPermission(RESOURCES.PRODUCTS, "delete");
    if (!permissionCheck.success) {
      return NextResponse.json(
        { error: permissionCheck.error },
        {
          status:
            permissionCheck.error === "Authentication required" ? 401 : 403,
        },
      );
    }

    const productCount = await prisma.oMProduct.count({
      where: { brands: { some: { id } }, isActive: true },
    });

    const poItemCount = await prisma.oMPurchaseOrderItem.count({
      where: { brandId: id },
    });

    if (productCount > 0 || poItemCount > 0) {
      const reasons = [];
      if (productCount > 0) reasons.push(`${productCount} active product(s)`);
      if (poItemCount > 0)
        reasons.push(`${poItemCount} purchase order item(s)`);

      return NextResponse.json(
        {
          error: `Cannot delete brand: ${reasons.join(" and ")} are using it.`,
        },
        { status: 409 },
      );
    }

    await prisma.oMBrand.delete({ where: { id } });

    return NextResponse.json(
      { message: "Brand deleted successfully" },
      { status: 200 },
    );
  } catch (error: unknown) {
    return handleApiError(error);
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const permissionCheck = await checkPermission(RESOURCES.PRODUCTS, "update");
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
    const validatedData = OMBrandCreateSchema.parse(body);

    const brand = await prisma.oMBrand.update({
      where: { id },
      data: {
        name: validatedData.name,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json(
      { message: "Brand updated successfully", data: brand },
      { status: 200 },
    );
  } catch (error: unknown) {
    return handleApiError(error);
  }
}
