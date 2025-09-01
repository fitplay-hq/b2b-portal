import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const { searchParams } = req.nextUrl;
    const query = searchParams.get("query");

    try {
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