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
        for (const item of order.orderItems) {
          const currentProduct = await prisma.product.findUnique({ where: { id: item.productId } });
          if (!currentProduct) continue;
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

      const adminEmail = process.env.ADMIN_EMAIL!;
      const ownerEmail = process.env.OWNER_EMAIL ?? "vaibhav@fitplaysolutions.com";
      const clientEmail = order.client?.email ?? adminEmail;

      const orderTable = `
        <table border="1" cellpadding="8" cellspacing="0" style="border-collapse: collapse; width: 100%; margin-top: 16px;">
        <thead>
          <tr>
            <th align="left">Product</th>
            <th align="center">Quantity</th>
          </tr>
        </thead>
        <tbody>
          ${order.orderItems
            .map(
              (item) => `
            <tr>
              <td>${item.product.name}</td>
              <td align="center">${item.quantity}</td>
            </tr>
          `
            )
            .join("")}
        </tbody>
      </table>
      `;

      

      const warehouseEmail = "ops@fitplaysolutions.com"; 

      let subject = "";
      let footerMessage = "";
      let htmlBody = "";
      let toEmails: string[] = [];
      const ccEmails: string[] = [ownerEmail];

      if (status === "APPROVED") {
        toEmails = [clientEmail];
        if (warehouseEmail) toEmails.push(warehouseEmail);
        subject = `Order ${order.id} Approved`;
        footerMessage = "Your order has been approved and will be processed soon.";
        htmlBody = `
          <h2>Order Approved</h2>
          <p>Order <b>${order.id}</b> has been approved by ${session?.user?.name ?? "System"}.</p>
          <h3>Consignee Details</h3>
          <p><b>Name:</b> ${order.consigneeName}</p>
          <p><b>Phone:</b> ${order.consigneePhone}</p>
          <p><b>Email:</b> ${order.consigneeEmail}</p>
          <h3>Delivery Address</h3>
          <p>${order.deliveryAddress}, ${order.city}, ${order.state}, ${order.pincode}</p>
          <h3>Order Summary</h3>
          ${orderTable}
          <p>${footerMessage}</p>
        `;
      } else if (status === "READY_FOR_DISPATCH") {
        toEmails = [adminEmail];
        subject = `Order ${order.id} Ready for Dispatch`;
        footerMessage = "The warehouse team has marked your order ready for dispatch.";
        htmlBody = `
          <h2>Ready for Dispatch</h2>
          <p>Order <b>${order.id}</b> is ready for dispatch. Shipping label URL: ${updatedOrder.shippingLabelUrl ?? "N/A"}</p>
          <h3>Order Summary</h3>
          ${orderTable}
          <p>${footerMessage}</p>
        `;
      } else if (status === "DISPATCHED") {
        toEmails = [clientEmail];
        if (adminEmail && !toEmails.includes(adminEmail)) toEmails.push(adminEmail);
        if (warehouseEmail && !toEmails.includes(warehouseEmail)) toEmails.push(warehouseEmail);
        subject = `Order ${order.id} Dispatched`;
        footerMessage = "Your order is on the way.";
        htmlBody = `
          <h2>Order Dispatched</h2>
          <p>Order <b>${order.id}</b> has been dispatched.</p>
          <p><b>Mode of Delivery:</b> ${order.modeOfDelivery}</p>
          <p><b>Consignment Number:</b> ${consignmentNumber}</p>
          <p><b>Courier:</b> ${deliveryService}</p>
          <p><b>Estimated Delivery (EDD):</b> ${updatedOrder.requiredByDate ? new Date(updatedOrder.requiredByDate).toLocaleDateString() : "N/A"}</p>
          <h3>Order Summary</h3>
          ${orderTable}
          <p>${footerMessage}</p>
        `;
      } else if (status === "AT_DESTINATION") {
        toEmails = [clientEmail];
        if (adminEmail && !toEmails.includes(adminEmail)) toEmails.push(adminEmail);
        if (warehouseEmail && !toEmails.includes(warehouseEmail)) toEmails.push(warehouseEmail);
        subject = `Order ${order.id} Reached Destination`;
        footerMessage = "Your shipment has arrived in the destination city.";
        htmlBody = `
          <h2>Order at Destination</h2>
          <p>Order <b>${order.id}</b> has reached the destination city.</p>
          <h3>Order Summary</h3>
          ${orderTable}
          <p>${footerMessage}</p>
        `;
      } else if (status === "DELIVERED") {
        toEmails = [clientEmail];
        if (adminEmail && !toEmails.includes(adminEmail)) toEmails.push(adminEmail);
        if (warehouseEmail && !toEmails.includes(warehouseEmail)) toEmails.push(warehouseEmail);
        subject = `Order ${order.id} Delivered`;
        footerMessage = "Your order has been successfully delivered.";
        htmlBody = `
          <h2>Order Delivered</h2>
          <p>Order <b>${order.id}</b> has been delivered to the final address.</p>
          <h3>Order Summary</h3>
          ${orderTable}
          <p>${footerMessage}</p>
        `;
      } else if (status === "CANCELLED") {
        toEmails = [clientEmail];
        if (adminEmail && !toEmails.includes(adminEmail)) toEmails.push(adminEmail);
        if (warehouseEmail && !toEmails.includes(warehouseEmail)) toEmails.push(warehouseEmail);
        subject = `Order ${order.id} Cancelled`;
        footerMessage = "Your order has been cancelled and inventory (if reserved) has been restored where applicable.";
        htmlBody = `
          <h2>Order Cancelled</h2>
          <p>Order <b>${order.id}</b> has been cancelled.</p>
          <h3>Order Summary</h3>
          ${orderTable}
          <p>${footerMessage}</p>
        `;
      }
      

      if (status && status !== "PENDING" && subject && htmlBody && toEmails.length > 0) {
        try {
          await resend.emails.send({
            from: "orders@fitplaysolutions.com",
            to: toEmails,
            cc: ccEmails,
            subject,
            html: htmlBody + `<p style="display:none">&#8203;</p>`,
          });
        } catch (err) {
          console.error("Error sending email via Resend:", err);
        }
      }

      return NextResponse.json({ order: updatedOrder, message: "Order updated successfully" }, { status: 200 });
    } catch (error) {
      console.error("Error updating order:", error);
      return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
  }, "orders", "edit");
}
