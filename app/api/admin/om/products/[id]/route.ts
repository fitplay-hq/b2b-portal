import { NextRequest, NextResponse } from "next/server";
import { checkPermission } from "@/lib/auth-middleware";
import { RESOURCES } from "@/lib/utils";
import prisma from "@/lib/prisma";
import { handleApiError } from "@/lib/api-errors";
import { OMProductUpdateSchema } from "@/lib/validations/om";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
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
    const validatedData = OMProductUpdateSchema.parse(body);

    const product = await prisma.oMProduct.update({
      where: { id: params.id },
      data: validatedData,
    });

    return NextResponse.json(
      { message: "Product updated successfully", data: product },
      { status: 200 },
    );
  } catch (error: unknown) {
    return handleApiError(error);
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
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

    await prisma.oMProduct.delete({
      where: { id: params.id },
    });

    return NextResponse.json(
      { message: "Product deleted successfully" },
      { status: 200 },
    );
  } catch (error: unknown) {
    return handleApiError(error);
  }
}
