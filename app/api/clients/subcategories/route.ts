import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/app/api/auth/[...nextauth]/route";

export async function GET(req: NextRequest) {
    try {
        const session = await getServerSession(auth);

        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const client = await prisma.client.findUnique({
            where: { id: session.user.id },
            select: { companyID: true },
        });

        if (!client) {
            return NextResponse.json({ error: "Client not found" }, { status: 404 });
        }

        const categories = await prisma.subCategory.findMany({
            where: {
                products: {
                    some: {
                        OR: [
                            {
                                clients: {
                                    some: {
                                        clientId: session.user.id,
                                    },
                                },
                            },
                        ],
                    },
                },
            },
            select: {
                id: true,
                name: true,
                categoryId: true,
                shortCode: true,
                category: true
            },
        });

        return NextResponse.json(categories);
    } catch (error) {
        console.error("Error fetching client categories:", error);
        return NextResponse.json(
            { error: "Failed to fetch categories" },
            { status: 500 }
        );
    }
}
