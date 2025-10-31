import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { withPermissions } from "@/lib/auth-middleware";
import { uploadShippingLabelToUploadThing } from "@/lib/uploadPDF";

export async function POST(req: NextRequest) {
  return withPermissions(req, async () => {
    try {
      const { orderId } = await req.json();

      console.log("Regenerate shipping label request:", { orderId });

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

      // Check if order status allows regeneration
      const allowedStatuses = ["READY_FOR_DISPATCH", "DISPATCHED", "AT_DESTINATION", "DELIVERED"];
      if (!allowedStatuses.includes(order.status)) {
        return NextResponse.json(
          { error: `Cannot regenerate label for order with status: ${order.status}. Allowed statuses: ${allowedStatuses.join(", ")}` },
          { status: 400 }
        );
      }

      console.log(`Regenerating shipping label for order ${orderId} with status ${order.status}`);

      // Generate and upload new shipping label
      console.log("Starting PDF generation...");
      const pdfUrl = await uploadShippingLabelToUploadThing(order);
      console.log("PDF generated and uploaded successfully:", pdfUrl);

      // Update order with new shipping label URL
      console.log("Updating order with new shipping label URL...");
      const updatedOrder = await prisma.order.update({
        where: { id: orderId },
        data: {
          shippingLabelUrl: pdfUrl,
        },
      });
      console.log("Order updated successfully");

      return NextResponse.json(
        { 
          order: updatedOrder, 
          shippingLabelUrl: pdfUrl,
          message: "Shipping label regenerated successfully" 
        },
        { status: 200 }
      );
    } catch (error) {
      console.error("Error regenerating shipping label:", error);
      return NextResponse.json(
        { error: "Failed to regenerate shipping label" }, 
        { status: 500 }
      );
    }
  }, "orders", "edit");
}