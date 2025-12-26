import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    const emails = await prisma.orderEmail.findMany({
        where: { orderId: params.id },
        orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(emails);
}
