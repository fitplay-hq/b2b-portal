import { auth } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(req: NextRequest) {
    try {
        const session = await getServerSession(auth);

        if (!session || !session?.user || session?.user?.role !== "ADMIN") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const { productId, quantity, reason, direction } = body;
        //direction: 1 for addition, -1 for subtraction
        if (!productId || typeof quantity !== "number" || quantity < 0 || !reason || typeof direction !== "number") {
            return NextResponse.json(
                { error: "Invalid product ID, quantity or reason" },
                { status: 400 },
            );
        }

        // Update the product inventory
        const productData = await prisma.product.update({
            where: { id: productId },
            data: {
                availableStock: direction === 1 ? { increment: quantity } : { decrement: quantity },
                inventoryUpdateReason: reason
            },
        });

        return NextResponse.json(
            {
                data: productData,
                message: "Product inventory updated successfully"
            },
            {
                status: 200,
            }
        );

    } catch (error: any) {
        return NextResponse.json(
            { error: error.message || "Something went wrong couldn't update stocks" },
            { status: 500 },
        );
    }
}