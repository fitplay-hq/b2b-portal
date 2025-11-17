import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { withPermissions } from "@/lib/auth-middleware";
import { uploadShippingLabelToUploadThing } from "@/lib/uploadPDF";

export async function PATCH(req: NextRequest) {
  return withPermissions(req, async () => {
    try {
      const { orderId, status, consignmentNumber, deliveryService } = await req.json();

      console.log("Status update request:", { orderId, status, consignmentNumber, deliveryService });

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

      // Handle inventory changes based on status transitions
      const currentStatus = order.status;
      console.log("Status transition:", { from: currentStatus, to: status });

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
        console.log("Generating shipping label for order:", orderId);
        const pdfUrl = await uploadShippingLabelToUploadThing(order);

        // DO NOT update inventory here - inventory should only be updated when order is APPROVED
        // This status change happens after APPROVED, so inventory was already reduced

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

      // Handle inventory restoration when cancelling an approved/ready order
      if (status === "CANCELLED" && (currentStatus === "APPROVED" || currentStatus === "READY_FOR_DISPATCH")) {
        console.log("Restoring inventory for cancelled order:", orderId);
        for (const item of order.orderItems) {
          const currentProduct = await prisma.product.findUnique({
            where: { id: item.productId },
          });

          if (currentProduct) {
            const newStock = currentProduct.availableStock + item.quantity;
            const logEntry = `${new Date().toISOString()} | Added ${item.quantity} units | Reason: RETURN_FROM_PREVIOUS_DISPATCH`;

            await prisma.product.update({
              where: { id: item.productId },
              data: {
                availableStock: newStock,
                inventoryLogs: {
                  push: logEntry,
                },
              },
            });
          }
        }
      }

      // Handle inventory reduction only when approving a new order for the FIRST time
      // Only reduce inventory when transitioning from PENDING or CANCELLED to APPROVED
      if (status === "APPROVED" && (currentStatus === "PENDING" || currentStatus === "CANCELLED")) {
        console.log("Creating new order inventory logs for:", orderId);
        for (const item of order.orderItems) {
          const currentProduct = await prisma.product.findUnique({
            where: { id: item.productId },
          });

          if (currentProduct) {
            const newStock = Math.max(0, currentProduct.availableStock - item.quantity);
            const logEntry = `${new Date().toISOString()} | Removed ${item.quantity} units | Reason: NEW_ORDER`;

            await prisma.product.update({
              where: { id: item.productId },
              data: {
                availableStock: newStock,
                inventoryLogs: {
                  push: logEntry,
                },
              },
            });
          }
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
