// app/api/products/bulk/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { v4 as uuidv4 } from "uuid";
import { Prisma } from "@/lib/generated/prisma";
import { getServerSession } from "next-auth";
import { auth } from "../../auth/[...nextauth]/route";

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
    const body = await req.json();

    const session = await getServerSession(auth);
    if (!session || !session?.user || session?.user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

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

    const productsData: Prisma.ProductCreateInput[] = parsedProducts.map((p) => ({
      id: uuidv4(),
      ...p, // ✅ Spread validated product data
    }));

    const products = await prisma.product.createMany({
      data: productsData,
      skipDuplicates: true, // skips if same sku already exists
    });

    return NextResponse.json(
      { message: "Products added successfully", count: products.count },
      { status: 201 },
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Something went wrong" },
      { status: 500 },
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(auth);
    if (!session || !session?.user || session?.user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const products = await prisma.product.findMany();
    return NextResponse.json(products);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Something went wrong" },
      { status: 500 },
    );
  }
}


// api for bulk inventory update
export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();

    const session = await getServerSession(auth);
    if (!session || !session.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!Array.isArray(body)) {
      return NextResponse.json(
        { error: "Expected an array of inventory updates" },
        { status: 400 },
      );
    }

    const updates = body.map((p, idx) => {
      const result = InventoryUpdateSchema.safeParse(p);
      if (!result.success) {
        throw new Error(
          `Validation error at index ${idx}: ${JSON.stringify(
            result.error.format(),
          )}`,
        );
      }
      return result.data;
    });

    const updatedProducts = await Promise.all(
      updates.map(async ({ productId, quantity, direction, inventoryUpdateReason }) => {
        return prisma.product.update({
          where: { id: productId },
          data: {
            availableStock: {
              [direction === "incr" ? "increment" : "decrement"]: quantity,
            },
            inventoryUpdateReason: inventoryUpdateReason,
          },
        });
      })
    );

    return NextResponse.json({ success: true, updatedProducts, message: "Inventories of the listed products updated successfully" }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Something went wrong" },
      { status: 500 },
    );
  }
}