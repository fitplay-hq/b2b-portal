import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { withPermissions } from "@/lib/auth-middleware";
import { min } from "date-fns";

// Removed auto-generated schemas as we're handling validation manually
// to properly support category relationships

async function validateCategoryMapping(
  categoryId?: string,
  subCategoryId?: string
) {
  if (!categoryId && !subCategoryId) return;

  if (!categoryId || !subCategoryId) {
    throw new Error("Both categoryId and subCategoryId are required together");
  }

  const valid = await prisma.subCategory.findFirst({
    where: {
      id: subCategoryId,
      categoryId: categoryId,
    },
  });

  if (!valid) {
    throw new Error("Invalid category / subcategory mapping");
  }
}


export async function GET(req: NextRequest) {
  return withPermissions(req, async () => {
    try {
      const id = req.nextUrl.searchParams.get("id");
      if (!id) {
        return NextResponse.json(
          { error: "Invalid Product ID" },
          { status: 400 },
        );
      }
      const product = await prisma.product.findUnique({
        where: { id: id },
        include: {
          companies: true,
          category: true,
          subCategory: true,
        },
      });
      if (!product) {
        return NextResponse.json({ error: "Product not found" }, { status: 404 });
      }
      return NextResponse.json(product);
    } catch (error: unknown) {
      return NextResponse.json(
        { error: (error as Error).message || "Something went wrong" },
        { status: 500 },
      );
    }
  }, "products", "view");
}

export async function POST(req: NextRequest) {
  return withPermissions(req, async () => {
    try {
      const body = await req.json();

      if (!body.name || !body.sku || body.availableStock === undefined) {
        return NextResponse.json(
          { error: "Missing required fields" },
          { status: 400 }
        );
      }

      await validateCategoryMapping(body.categoryId, body.subCategoryId);

      const initialStock = body.availableStock || 0;
      const initialLogEntry = initialStock > 0
        ? `${new Date().toISOString()} | Added ${initialStock} units | Reason: NEW_PURCHASE | Updated stock: ${initialStock} | Remarks: `
        : null;

      const product = await prisma.product.create({
        data: {
          name: body.name,
          sku: body.sku,
          description: body.description || "",
          price: body.price ? parseInt(body.price.toString()) : null,
          availableStock: body.availableStock,
          minStockThreshold: body.minStockThreshold,
          images: body.images || [],
          inventoryLogs: initialLog,
          inventoryUpdateReason: body.inventoryUpdateReason,
          brand: body.brand,
          avgRating: body.avgRating,
          noOfReviews: body.noOfReviews,

          category: { connect: { id: body.categoryId } },
          subCategory: { connect: { id: body.subCategoryId } },

          ...(Array.isArray(body.companies)
            ? { companies: { connect: body.companies.map((c: any) => ({ id: c.id || c })) } }
            : {}),
        },
        include: {
          companies: true,
          category: true,
          subCategory: true,
        },
      });

      return NextResponse.json(product, { status: 201 });
    } catch (e: any) {
      return NextResponse.json({ error: e.message }, { status: 500 });
    }
  }, "products", "create");
}


export async function PATCH(req: NextRequest) {
  return withPermissions(req, async () => {
    try {
      const body = await req.json();

      if (!body.id) {
        return NextResponse.json(
          { error: "Product ID required" },
          { status: 400 }
        );
      }

      await validateCategoryMapping(body.categoryId, body.subCategoryId);

      const updateData: any = {
        ...(body.name && { name: body.name }),
        ...(body.sku && { sku: body.sku }),
        ...(body.description !== undefined && { description: body.description }),
        ...(body.price !== undefined && { price: body.price ? parseInt(body.price) : null }),
        ...(body.minStockThreshold !== undefined && { minStockThreshold: body.minStockThreshold }),
        ...(body.images && { images: body.images }),
        ...(body.brand !== undefined && { brand: body.brand }),
        ...(body.avgRating !== undefined && { avgRating: body.avgRating }),
        ...(body.noOfReviews !== undefined && { noOfReviews: body.noOfReviews }),
        ...(body.inventoryUpdateReason && { inventoryUpdateReason: body.inventoryUpdateReason }),
      };

      if (body.categoryId && body.subCategoryId) {
        updateData.category = { connect: { id: body.categoryId } };
        updateData.subCategory = { connect: { id: body.subCategoryId } };
      }

      if (Array.isArray(body.companies)) {
        updateData.companies = {
          set: body.companies.map((c: any) => ({ id: c.id || c })),
        };
      }

      const product = await prisma.product.update({
        where: { id: body.id },
        data: updateData,
        include: {
          companies: true,
          category: true,
          subCategory: true,
        },
      });

      return NextResponse.json(product);
    } catch (e: any) {
      return NextResponse.json({ error: e.message }, { status: 500 });
    }
  }, "products", "edit");
}


export async function DELETE(req: NextRequest) {
  return withPermissions(req, async () => {
    try {
      const id = req.nextUrl.searchParams.get("id");
      if (!id) {
        return NextResponse.json(
          { error: "Invalid Product ID" },
          { status: 400 },
        );
      }

      await prisma.product.delete({
        where: { id: id },
      });

      return NextResponse.json({ message: "Product deleted successfully" });
    } catch (error: unknown) {
      return NextResponse.json(
        { error: (error as Error).message || "Something went wrong" },
        { status: 500 },
      );
    }
  }, "products", "delete");
}
