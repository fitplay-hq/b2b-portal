import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { withPermissions } from "@/lib/auth-middleware";
import { uploadShippingLabelToUploadThing } from "@/lib/uploadPDF";
import { Resend } from "resend";
import { getServerSession } from "next-auth";

const resend = new Resend(process.env.RESEND_API_KEY!);

export async function PATCH(req: NextRequest) {
  return withPermissions(req, async () => {
    try {
      const { orderId, status, consignmentNumber, deliveryService, awb } = await req.json();

      console.log("Status update request:", { orderId, status, consignmentNumber, deliveryService });

      const session = await getServerSession();

      if (!orderId) {
        return NextResponse.json({ error: "Order ID is required" }, { status: 400 });
      }

      const order = await prisma.order.findUnique({
        where: { id: orderId },
        include: {
          orderItems: { include: { product: true } },
          bundleOrderItems: { include: { bundle: true, product: true } },
          client: { include: { company: true } },
        },
      });

      if (!order) {
        return NextResponse.json({ error: "Order not found" }, { status: 404 });
      }

      const currentStatus = order.status;
      console.log("Status transition:", { from: currentStatus, to: status });

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
      } else if (status === "READY_FOR_DISPATCH") {
        console.log("Generating shipping label for order:", orderId);
        const pdfUrl = await uploadShippingLabelToUploadThing(order);

        updatedOrder = await prisma.order.update({
          where: { id: orderId },
          data: {
            status,
            shippingLabelUrl: pdfUrl,
          },
        });
      } else {
        updatedOrder = await prisma.order.update({
          where: { id: orderId },
          data: { status: status || "PENDING" },
        });
      }

      if (status === "CANCELLED" && (currentStatus === "PENDING" || currentStatus === "APPROVED" || currentStatus === "READY_FOR_DISPATCH")) {
        console.log("Restoring inventory for cancelled order:", orderId);
        for (const item of [...order.orderItems, ...order.bundleOrderItems]) {
          const currentProduct = await prisma.product.findUnique({ where: { id: item.productId } });
          if (!currentProduct) continue;
          const newStock = currentProduct.availableStock + item.quantity;
          const logEntry = `${new Date().toISOString()} | Added ${item.quantity} units | Reason: RETURN_FROM_PREVIOUS_DISPATCH | Updated stock: ${newStock} | Remarks: `;
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

      return NextResponse.json({ order: updatedOrder, message: "Order updated successfully" }, { status: 200 });
    } catch (error) {
      console.error("Error updating order:", error);
      return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
  }, "orders", "edit");
}
