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

    const { orderId, status, consignmentNumber, deliveryService } = await req.json();

    if (!orderId) {
      return NextResponse.json(
        { error: "Order ID is required" },
        { status: 400 }
      );
    }

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

    let updatedOrder;

    if (status === "DISPATCHED") {
      if (!consignmentNumber || !deliveryService) {
        return NextResponse.json(
          { error: "Consignment number and delivery service are required for dispatch status" },
          { status: 400 }
        );
      }
      updatedOrder = await prisma.order.update({
        where: { id: orderId },
        data: {
          status,
          consignmentNumber,
          deliveryService,
        },
      });
    } else {
      updatedOrder = await prisma.order.update({
        where: { id: orderId },
        data: { status: status || "PENDING" },
      });
    }

    return NextResponse.json(
      {
        order: updatedOrder,
        message: "Order Updated successfully",
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
