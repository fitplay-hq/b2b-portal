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

        const { orderId } = await req.json();

        if (!orderId) {
            return NextResponse.json({ error: "Order ID is required" }, { status: 400 });
        }

        await prisma.order.update({
            where: { id: orderId },
            data: { status: "APPROVED" },
        });

        const order = await prisma.order.findUnique({
            where: { id: orderId },
        });

        return NextResponse.json({ 
            order,
            message: "Order approved successfully" 
        }, { status: 200 });

    } catch (error) {
        console.error("Error approving order:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}