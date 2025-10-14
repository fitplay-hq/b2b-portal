import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { withPermissions } from "@/lib/auth-middleware";

let toggleTracker = true;
const resend = new Resend(process.env.RESEND_API_KEY!);

export async function POST(req: NextRequest) {
  return withPermissions(req, async () => {
    try {
      // Get session for user info in email
      const { getServerSession } = await import("next-auth");
      const { auth } = await import("@/app/api/auth/[...nextauth]/route");
      const session = await getServerSession(auth);

    const body = await req.json();
    const { orderId, clientEmail } = body;

    if (!orderId || !clientEmail) {
      return NextResponse.json({ error: "Order ID and Client Email are required" }, { status: 400 });
    }

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        orderItems: { include: { product: true } },
      },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

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

    const footerMessage = toggleTracker
      ? "Please reply confirmation to this new dispatch order."
      : "Please reply confirmation to this new dispatch order mail.";

    toggleTracker = !toggleTracker;

    const adminEmail = process.env.ADMIN_EMAIL!;
    const ccEmail = process.env.CC_EMAIL_1!;

    const mail =await resend.emails.send({
      from: adminEmail,
      to: clientEmail,
      cc: [ccEmail],
      subject: "New Order Awaiting Approval",
      html: `
          <h2>New Dispatch Order</h2>
          <p>A new order <b>${order.id}</b> has been created by ${session?.user?.name || "Unknown User"}.</p>
          
          <h3>Consignee Details</h3>
          <p><b>Name:</b> ${order.consigneeName}</p>
          <p><b>Phone:</b> ${order.consigneePhone}</p>
          <p><b>Email:</b> ${order.consigneeEmail}</p>
          <p><b>Mode of Delivery:</b> ${order.modeOfDelivery}</p>
          <p><b>Required By:</b> ${new Date(order.requiredByDate).toLocaleDateString()}</p>

          <h3>Delivery Address</h3>
          <p>${order.deliveryAddress}, ${order.city}, ${order.state}, ${order.pincode}</p>

          <h3>Order Summary</h3>
          ${orderTable}

          <p>${footerMessage}</p>
          <p style="display: none;">&#8203;</p>
        `,
    });

    if (mail) {
      await prisma.order.update({
        where: { id: orderId },
        data: { isMailSent: true },
      });
    }


      return NextResponse.json({ success: true });
    } catch (error) {
      console.error("Error sending email:", error);
      return NextResponse.json({ error: "Failed to send mail" }, { status: 500 });
    }
  }, "orders", "edit");
}