import { NextRequest, NextResponse } from "next/server";
import { checkPermission } from "@/lib/auth-middleware";
import { RESOURCES } from "@/lib/utils";
import prisma from "@/lib/prisma";
import { handleApiError } from "@/lib/api-errors";
import { OMProductCreateSchema } from "@/lib/validations/om";

export async function GET(req: NextRequest) {
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

    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";
    const sortBy = searchParams.get("sortBy") || "name";
    const sortOrder = searchParams.get("sortOrder") || "asc";

    const allowedSortFields = [
      "name",
      "sku",
      "price",
      "createdAt",
      "updatedAt",
    ];
    const safeSortBy = allowedSortFields.includes(sortBy) ? sortBy : "name";
    const safeSortOrder = sortOrder === "desc" ? "desc" : "asc";

    const whereClause: any = { isActive: true };
    if (search) {
      whereClause.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { sku: { contains: search, mode: "insensitive" } },
      ];
    }

    const products = await prisma.oMProduct.findMany({
      where: whereClause,
      include: {
        brands: true,
        purchaseOrderItems: {
          select: { quantity: true },
        },
      },
      orderBy: {
        [safeSortBy]: safeSortOrder,
      },
    });

    const result = products.map(({ purchaseOrderItems, ...rest }) => ({
      ...rest,
      totalOrdered: purchaseOrderItems.reduce(
        (sum, item) => sum + item.quantity,
        0,
      ),
    }));

    return NextResponse.json(result);
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
    const validatedData = OMProductCreateSchema.parse(body);
    const { brandIds, code, category, ...prismaData } = validatedData;
    void code;
    void category;

    const product = await prisma.oMProduct.create({
      data: {
        ...prismaData,
        sku: prismaData.sku ? prismaData.sku.trim() : null,
        description: prismaData.description ? prismaData.description.trim() : null,
        price: prismaData.price ?? null,
        ...(brandIds && brandIds.length > 0
          ? {
              brands: {
                connect: brandIds.map((id: string) => ({ id })),
              },
            }
          : {}),
      },
      include: {
        brands: true,
      },
    });

    return NextResponse.json(
      {
        message: "Product created successfully",
        id: product.id,
        data: product,
      },
      { status: 201 },
    );
  } catch (error: unknown) {
    return handleApiError(error);
  }
}
