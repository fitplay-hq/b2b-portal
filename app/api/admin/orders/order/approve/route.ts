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
      return NextResponse.json(
        { error: "Order ID is required" },
        { status: 400 }
      );
    }

    // ✅ Get order with its items + products
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        orderItems: {
          include: { product: true },
        },
      },
    });

    if (!order) {
      return NextResponse.json(
        { error: "Order not found" },
        { status: 404 }
      );
    }
    const updatedOrder = await prisma.$transaction(async (tx) => {
      // 1. Approve order
      const approvedOrder = await tx.order.update({
        where: { id: orderId },
        data: { status: "APPROVED" },
      });

      // 2. Reduce stock for each product
      for (const item of order.orderItems) {
        await tx.product.update({
          where: { id: item.productId },
          data: {
            availableStock: {
              decrement: item.quantity,
            },
          },
        });
      }

      return approvedOrder;
    });

    return NextResponse.json(
      {
        order: updatedOrder,
        message: "Order approved and stock updated successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error approving order:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
