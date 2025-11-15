// app/api/products/bulk/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { v4 as uuidv4 } from "uuid";
import { Prisma } from "@/lib/generated/prisma";
import { checkPermission } from "@/lib/auth-middleware";
import { RESOURCES } from "@/lib/utils";

// Import the auto-generated Zod schema
import { ProductCreateInputObjectSchema } from "@/prisma/generated/schemas";
import z from "zod";
const InventoryUpdateSchema = z.object({
  productId: z.string().uuid(),
  quantity: z.number().positive(),
  direction: z.enum(["incr", "dec"]),
  inventoryUpdateReason: z.enum(["NEW_PURCHASE", "PHYSICAL_STOCK_CHECK", "RETURN_FROM_PREVIOUS_DISPATCH"]),
});

export async function POST(req: NextRequest) {
  try {
    // Check permissions
    const permissionCheck = await checkPermission(RESOURCES.PRODUCTS, 'create');
    if (!permissionCheck.success) {
      return NextResponse.json(
        { error: permissionCheck.error },
        { status: permissionCheck.error === 'Authentication required' ? 401 : 403 }
      );
    }

    const body = await req.json();

    if (!Array.isArray(body)) {
      return NextResponse.json(
        { error: "Expected an array of products" },
        { status: 400 },
      );
    }

    // ✅ Validate each product with the Zod schema
    const parsedProducts = body.map((p, idx) => {
      const result = ProductCreateInputObjectSchema.safeParse(p);
      if (!result.success) {
        throw new Error(
          `Validation error in product at index ${idx}: ${JSON.stringify(
            result.error.format(),
          )}`,
        );
      }
      return result.data;
    });

    const productsData: Prisma.ProductCreateInput[] = parsedProducts.map((p) => {
      const initialStock = p.availableStock || 0;
      const initialLogEntry = initialStock > 0 
        ? `${new Date().toISOString()} | Added ${initialStock} units | Reason: NEW_PURCHASE`
        : null;

      return {
        id: uuidv4(),
        ...p, // ✅ Spread validated product data
        inventoryLogs: initialLogEntry ? [initialLogEntry] : [],
      };
    });

    const products = await prisma.product.createMany({
      data: productsData,
      skipDuplicates: true, // skips if same sku already exists
    });

    return NextResponse.json(
      { message: "Products added successfully", count: products.count },
      { status: 201 },
    );
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Something went wrong";
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 },
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    // Check permissions
    const permissionCheck = await checkPermission(RESOURCES.PRODUCTS, 'view');
    if (!permissionCheck.success) {
      return NextResponse.json(
        { error: permissionCheck.error },
        { status: permissionCheck.error === 'Authentication required' ? 401 : 403 }
      );
    }

    const { searchParams } = new URL(req.url);
    const sortBy = searchParams.get("sortBy") || "name";
    const sortOrder = searchParams.get("sortOrder") || "asc";

    // Define allowed sort fields for security
    const allowedSortFields = ["name", "availableStock", "createdAt", "updatedAt"];
    const safeSortBy = allowedSortFields.includes(sortBy) ? sortBy : "name";
    const safeSortOrder = sortOrder === "desc" ? "desc" : "asc";

    const products = await prisma.product.findMany({
      include: {
        companies: true,
        category: true, // Include the category relationship
      },
      orderBy: {
        [safeSortBy]: safeSortOrder,
      },
    });
    return NextResponse.json(products);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Something went wrong";
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 },
    );
  }
}


// api for bulk inventory update
export async function PATCH(req: NextRequest) {
  try {
    // Check permissions
    const permissionCheck = await checkPermission(RESOURCES.PRODUCTS, "update");
    if (!permissionCheck.success) {
      return NextResponse.json(
        { error: permissionCheck.error },
        {
          status:
            permissionCheck.error === "Authentication required" ? 401 : 403,
        }
      );
    }

    const body = await req.json();

    if (!Array.isArray(body)) {
      return NextResponse.json(
        { error: "Expected an array of inventory updates" },
        { status: 400 }
      );
    }

    const updates = body.map((p, idx) => {
      const result = InventoryUpdateSchema.safeParse(p);
      if (!result.success) {
        throw new Error(
          `Validation error at index ${idx}: ${JSON.stringify(
            result.error.format()
          )}`
        );
      }
      return result.data;
    });

    const updatedProducts = await Promise.all(
      updates.map(async ({ productId, quantity, direction, inventoryUpdateReason }) => {
        // Create a log entry for this update
        const logEntry = `${new Date().toISOString()} | ${
          direction === "incr" ? "Added" : "Removed"
        } ${quantity} units | Reason: ${inventoryUpdateReason}`;

        // Update the product inventory and push the log
        return prisma.product.update({
          where: { id: productId },
          data: {
            availableStock: {
              [direction === "incr" ? "increment" : "decrement"]: quantity,
            },
            inventoryUpdateReason: inventoryUpdateReason,
            inventoryLogs: { push: logEntry }, // 👈 new line to store logs
          },
        });
      })
    );

    return NextResponse.json(
      {
        success: true,
        updatedProducts,
        message:
          "Inventories of the listed products updated successfully",
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Something went wrong";
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
