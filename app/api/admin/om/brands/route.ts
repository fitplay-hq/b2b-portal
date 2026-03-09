import { NextRequest, NextResponse } from "next/server";
import { checkPermission } from "@/lib/auth-middleware";
import { RESOURCES } from "@/lib/utils";
import prisma from "@/lib/prisma";
import { handleApiError } from "@/lib/api-errors";
import { OMBrandCreateSchema } from "@/lib/validations/om";

export async function GET(_req: NextRequest) {
  try {
    const permissionCheck = await checkPermission(RESOURCES.PRODUCTS, "view");
    if (!permissionCheck.success) {
      return NextResponse.json(
        { error: permissionCheck.error },
        {
          status:
            permissionCheck.error === "Authentication required" ? 401 : 403,
        },
      );
    }

    const brands = await prisma.oMBrand.findMany({
      orderBy: { name: "asc" },
    });

    return NextResponse.json(brands);
  } catch (error: unknown) {
    return handleApiError(error);
  }
}

export async function POST(req: NextRequest) {
  try {
    const permissionCheck = await checkPermission(RESOURCES.PRODUCTS, "create");
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

    const id = validatedData.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

    const existing = await prisma.oMBrand.findUnique({ where: { id } });
    if (existing) {
      return NextResponse.json(
        { error: "A brand with a similar name already exists" },
        { status: 409 },
      );
    }

    const brand = await prisma.oMBrand.create({
      data: {
        id,
        name: validatedData.name,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json(
      { message: "Brand created successfully", id: brand.id, data: brand },
      { status: 201 },
    );
  } catch (error: unknown) {
    return handleApiError(error);
  }
}
