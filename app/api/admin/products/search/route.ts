import { auth } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const { searchParams } = req.nextUrl;
    const query = searchParams.get("query");

    try {
        const session = await getServerSession(auth);

        if (!session || !session?.user || session?.user?.role !== "ADMIN") {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }
        const products = await prisma.product.findMany({
            include: {
                category: true, // Include the category relationship
                companies: true, // Keep existing includes
            },
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