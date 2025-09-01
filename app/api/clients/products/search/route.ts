import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const { searchParams } = req.nextUrl;
    const query = searchParams.get("query");

    try {
        const session = await getServerSession();
        
            if (!session || !session?.user?.email) {
              return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
              );
            }
        const products = await prisma.product.findMany({
            where: {
                name: {
                    contains: query || "",
                    mode: "insensitive",
                },
            }
        });

        if (products.length === 0) {
            return NextResponse.json(
                {
                    products: [],
                    message: "No products found",
                    status: 200
                },
            );
        }
    } catch (error) {
        return new Response(JSON.stringify({ error: "Failed to fetch products" }), {
            headers: { "Content-Type": "application/json" },
            status: 500,
        });
    }
}