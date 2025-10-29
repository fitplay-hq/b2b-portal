import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { withPermissions } from "@/lib/auth-middleware";
import { uploadShippingLabelToUploadThing } from "@/lib/uploadPDF";

export async function PATCH(req: NextRequest) {
  return withPermissions(req, async () => {
    try {
      const { orderId, status, consignmentNumber, deliveryService } = await req.json();

      if (!orderId) {
        return NextResponse.json({ error: "Order ID is required" }, { status: 400 });
      }

      const order = await prisma.order.findUnique({
        where: { id: orderId },
        include: {
          orderItems: { include: { product: true } },
          client: { include: { company: true } },
        },
      });

      if (!order) {
        return NextResponse.json({ error: "Order not found" }, { status: 404 });
      }

      let updatedOrder;

      if (status === "DISPATCHED") {
        if (!consignmentNumber || !deliveryService) {
          return NextResponse.json(
            { error: "Consignment number and delivery service are required for dispatch" },
            { status: 400 }
          );
        }

        updatedOrder = await prisma.order.update({
          where: { id: orderId },
          data: { status, consignmentNumber, deliveryService },
        });
      } 
      else if (status === "READY_FOR_DISPATCH") {
        // Generate and upload shipping label
        const pdfUrl = await uploadShippingLabelToUploadThing(order);

        // Update order with shipping label URL
        updatedOrder = await prisma.order.update({
          where: { id: orderId },
          data: {
            status,
            shippingLabelUrl: pdfUrl,
          },
        });
      } 
      else {
        updatedOrder = await prisma.order.update({
          where: { id: orderId },
          data: { status: status || "PENDING" },
        });
      }

      if (status === "CANCELLED") {
        for (const item of order.orderItems) {
          await prisma.product.update({
            where: { id: item.productId },
            data: { availableStock: item.product.availableStock + item.quantity },
          });
        }
      }

      return NextResponse.json(
        { order: updatedOrder, message: "Order updated successfully" },
        { status: 200 }
      );
    } catch (error) {
      console.error("Error updating order:", error);
      return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
  }, "orders", "edit");
}
