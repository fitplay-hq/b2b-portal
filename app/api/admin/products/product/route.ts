import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { withPermissions } from "@/lib/auth-middleware";

// Removed auto-generated schemas as we're handling validation manually
// to properly support category relationships

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
      
      // Manual validation instead of relying on auto-generated schema
      // which might not handle the complex category relationships properly
      if (!body.name || !body.sku || body.availableStock === undefined) {
        return NextResponse.json(
          { error: "Missing required fields: name, sku, or availableStock" },
          { status: 400 },
        );
      }

      // Create initial inventory log entry for the starting stock
      const initialStock = body.availableStock || 0;
      const initialLogEntry = initialStock > 0 
        ? `${new Date().toISOString()} | Added ${initialStock} units | Reason: NEW_PURCHASE`
        : null;

      // Handle category relationships properly
      const categoryData: any = {};
      
      // If categoryId is provided, use the new category relationship
      if (body.categoryId) {
        categoryData.category = { connect: { id: body.categoryId } };
      }
      
      // If categories (enum) is provided and it's a legacy category, set both
      if (body.categories) {
        const legacyCategories = ['stationery', 'accessories', 'funAndStickers', 'drinkware', 'apparel', 'travelAndTech', 'books', 'welcomeKit'];
        if (legacyCategories.includes(body.categories)) {
          categoryData.categories = body.categories;
        }
        
        // Try to find matching ProductCategory by name for backward compatibility
        if (!body.categoryId) {
          try {
            const existingCategory = await prisma.productCategory.findFirst({
              where: { name: body.categories }
            });
            if (existingCategory) {
              categoryData.category = { connect: { id: existingCategory.id } };
            }
          } catch {
            // Continue without category relationship if not found
            console.warn("Could not find category:", body.categories);
          }
        }
      }

      const productData = {
        name: body.name,
        sku: body.sku,
        description: body.description || "",
        categories : body.categories,
        price: body.price ? parseInt(body.price.toString()) : null,
        availableStock: body.availableStock,
        images: body.images || [],
        inventoryLogs: initialLogEntry ? [initialLogEntry] : [],
        brand: body.brand,
        avgRating: body.avgRating,
        noOfReviews: body.noOfReviews,
        inventoryUpdateReason: body.inventoryUpdateReason,
        ...categoryData,
        // Handle company relationships
        ...(body.companies && Array.isArray(body.companies) 
          ? { companies: { connect: body.companies.map((c: any) => ({ id: c.id || c })) } }
          : body.companies && body.companies.connect 
          ? { companies: body.companies }
          : {}
        ),
      };

      console.log("Creating product with data:", JSON.stringify(productData, null, 2));

      const product = await prisma.product.create({
        data: productData,
        include: {
          companies: true,
          category: true,
        }
      });

      return NextResponse.json(product, { status: 201 });
    } catch (error: unknown) {
      console.error("Product creation error:", error);
      const errorMessage = error instanceof Error ? error.message : "Something went wrong";
      return NextResponse.json(
        { error: errorMessage },
        { status: 500 },
      );
    }
  }, "products", "create");
}

export async function PATCH(req: NextRequest) {
  return withPermissions(req, async () => {
    try {
      const body = await req.json();

      if (!body.id) {
        return NextResponse.json(
          { error: "product ID not supplied" },
          { status: 400 }
        )
      }

      // Handle category relationships properly for updates
      const categoryData: Record<string, any> = {};
      
      // If categoryId is provided, use the new category relationship
      if (body.categoryId) {
        categoryData.category = { connect: { id: body.categoryId } };
      } else if (body.categoryId === null) {
        categoryData.category = { disconnect: true };
      }
      
      // If categories (enum) is provided and it's a legacy category, set it
      if (body.categories) {
        const legacyCategories = ['stationery', 'accessories', 'funAndStickers', 'drinkware', 'apparel', 'travelAndTech', 'books', 'welcomeKit'];
        if (legacyCategories.includes(body.categories)) {
          categoryData.categories = body.categories;
        }
        
        // Try to find matching ProductCategory by name for backward compatibility
        if (!body.categoryId) {
          try {
            const existingCategory = await prisma.productCategory.findFirst({
              where: { name: body.categories }
            });
            if (existingCategory) {
              categoryData.category = { connect: { id: existingCategory.id } };
            }
          } catch (e) {
            // Continue without category relationship if not found
            console.warn("Could not find category:", body.categories);
          }
        }
      } else if (body.categories === null) {
        categoryData.categories = null;
      }

      const updateData = {
        ...(body.name && { name: body.name }),
        ...(body.sku && { sku: body.sku }),
        ...(body.categories && { categories: body.categories }),
        ...(body.description !== undefined && { description: body.description }),
        ...(body.price !== undefined && { price: body.price ? parseInt(body.price.toString()) : null }),
        // Remove availableStock from updates - use inventory management instead
        // ...(body.availableStock !== undefined && { availableStock: body.availableStock }),
        ...(body.images && { images: body.images }),
        ...(body.brand !== undefined && { brand: body.brand }),
        ...(body.avgRating !== undefined && { avgRating: body.avgRating }),
        ...(body.noOfReviews !== undefined && { noOfReviews: body.noOfReviews }),
        ...(body.inventoryUpdateReason && { inventoryUpdateReason: body.inventoryUpdateReason }),
        ...categoryData,
        // Handle company relationships - only update if companies is explicitly provided
        ...(body.companies !== undefined && Array.isArray(body.companies) 
          ? { companies: { set: body.companies.map((c: any) => ({ id: c.id || c })) } }
          : body.companies && typeof body.companies === 'object' && body.companies.set 
          ? { companies: body.companies }
          : {} // Don't modify company relationships if not provided
        ),
      };


      const product = await prisma.product.update({
        where: { id: body.id.toString() },
        data: updateData,
        include: {
          companies: true,
          category: true,
        }
      });

      return NextResponse.json(product);
    } catch (error: unknown) {
      console.error("Product update error:", error);
      const errorMessage = error instanceof Error ? error.message : "Something went wrong";
      return NextResponse.json(
        { error: errorMessage },
        { status: 500 },
      );
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
