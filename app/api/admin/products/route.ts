// app/api/products/bulk/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { v4 as uuidv4 } from "uuid";
import { $Enums, Category } from "@/lib/generated/prisma";
import { getServerSession } from "next-auth";
import { auth } from "../../auth/[...nextauth]/route";

interface Product {
  id: string;
  name: string;
  images: string[];
  price: number;
  sku: string;
  availableStock: number;
  description: string;
  specification: Record<string, any>;
  categories: Category;
  avgRating: number;
  noOfReviews: number;
  brand: string;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const session = await getServerSession(auth);
    console.log("Session:", session);

    if (!session || !session?.user || session?.user?.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    if (!Array.isArray(body)) {
      return NextResponse.json(
        { error: "Expected an array of products" },
        { status: 400 }
      );
    }

    const productsData: Product[] = body.map((p) => ({
      id: uuidv4(),
      name: p.name,
      images: p.images ?? [],
      price: p.price,
      sku: p.sku,
      availableStock: p.availableStock,
      description: p.description,
      specification: p.specification ?? {},
      categories: p.categories,
      avgRating: p.avgRating ?? 0,
      noOfReviews: p.noOfReviews ?? 0,
      brand: p.brand,
    }));

    const products = await prisma.product.createMany({
      data: productsData,
      skipDuplicates: true, // skips if same sku already exists
    });

    return NextResponse.json(
      { message: "Products added successfully", count: products.count },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Something went wrong" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(auth);

    if (!session || !session?.user || session?.user?.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }
    const products = await prisma.product.findMany();
    return NextResponse.json(products);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Something went wrong" },
      { status: 500 }
    );
  }
}
