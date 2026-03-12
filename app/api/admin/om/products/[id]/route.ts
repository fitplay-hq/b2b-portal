import { NextRequest, NextResponse } from "next/server";
import { checkPermission } from "@/lib/auth-middleware";
import { RESOURCES } from "@/lib/utils";
import prisma from "@/lib/prisma";
import { handleApiError } from "@/lib/api-errors";
import { OMProductUpdateSchema } from "@/lib/validations/om";

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
    const validatedData = OMProductUpdateSchema.parse(body);
    const { brandIds, code, category, ...prismaData } = validatedData;
    void code;
    void category;

    const updateData: any = { ...prismaData };
    if (prismaData.sku !== undefined) {
      updateData.sku = prismaData.sku ? prismaData.sku.trim() : null;
    }
    if (prismaData.description !== undefined) {
      updateData.description = prismaData.description ? prismaData.description.trim() : null;
    }
    if (prismaData.price !== undefined) {
      updateData.price = prismaData.price ?? null;
    }

    const product = await prisma.oMProduct.update({
      where: { id },
      data: {
        ...updateData,
        ...(brandIds !== undefined
          ? {
              brands: {
                set: brandIds.map((id: string) => ({ id })),
              },
            }
          : {}),
      },
      include: {
        brands: true,
      },
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

    // Try hard delete first, or check for references
    try {
      await prisma.oMProduct.delete({
        where: { id },
      });
      return NextResponse.json(
        { message: "Product deleted successfully" },
        { status: 200 },
      );
    } catch (dbError: any) {
      // P2003 or P2014 are reference errors in Prisma
      if (dbError.code === "P2003" || dbError.code === "P2014") {
        await prisma.oMProduct.update({
          where: { id },
          data: { isActive: false },
        });
        return NextResponse.json(
          {
            message:
              "Product is referenced in historical orders. It has been archived instead of deleted.",
            archived: true,
          },
          { status: 200 },
        );
      }
      throw dbError;
    }
  } catch (error: unknown) {
    return handleApiError(error);
  }
}
