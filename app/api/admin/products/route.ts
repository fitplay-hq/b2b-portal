// app/api/products/bulk/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { v4 as uuidv4 } from "uuid";
import { Prisma } from "@/lib/generated/prisma";
import { getServerSession } from "next-auth";
import { auth } from "../../auth/[...nextauth]/route";

// Import the auto-generated Zod schema
import { ProductCreateInputObjectSchema } from "@/prisma/generated/schemas";

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
