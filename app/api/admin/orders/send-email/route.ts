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
                    client: true,
                    orderItems: { include: { product: true } },
                    bundleOrderItems: { include: { bundle: true, product: true } },
                    bundles: { include: { items: { include: { product: true } } } },
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
          ${order.bundleOrderItems
            .map(
              (item) => `
            <tr>
              <td>${item.product.name} (Bundle)</td>
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
    const ownerEmail = process.env.OWNER_EMAIL || "vaibhav@fitplaysolutions.com";
    const fromEmail = process.env.ENVIRONMENT === "development" ? process.env.FROM_EMAIL! : "orders@fitplaysolutions.com";

    const mail =await resend.emails.send({
      from: fromEmail,
      to: clientEmail,
      cc: [adminEmail, ownerEmail],
      subject: "New Order Awaiting Approval",
      html: `
          <h2>New Dispatch Order</h2>
          <p>A new order has been created by ${session?.user?.name || "Unknown User"}.</p>
          
          <h3>Consignee Details</h3>
          <p><b>Name:</b> ${order.consigneeName}</p>
          <p><b>Phone:</b> ${order.consigneePhone}</p>
          <p><b>Email:</b> ${order.consigneeEmail}</p>
          <p><b>Mode of Delivery:</b> ${order.modeOfDelivery}</p>
          <p><b>Delivery Reference:</b> ${order.deliveryReference}</p>
          <p><b>Required By:</b> ${new Date(order.requiredByDate).toLocaleDateString('en-GB')}</p>

          <h3>Delivery Address</h3>
          <p>${order.deliveryAddress}, ${order.city}, ${order.state}, ${order.pincode}</p>

          <h3>Order Summary</h3>
          ${orderTable}

          ${order.bundleOrderItems.length > 0 ? `
      <h3>Bundle Breakdown:</h3>
    ${order.bundles.map(bundle => `
        <div style="margin-bottom:12px;">
            <table border="1" cellpadding="6" cellspacing="0" style="border-collapse:collapse;width:100%;margin-top:8px;">
                <thead>
                    <tr>
                        <th align="left">Product</th>
                        <th align="center">Quantity</th>
                    </tr>
                </thead>
                <tbody>
                    ${bundle.items.map(item => `
                        <tr>
                            <td>${item.product?.name || 'Unknown Product'}</td>
                            <td align="center">${item.bundleProductQuantity ?? 0}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `).join('')}
      <p><b> Number of Bundles:</b> ${order.numberOfBundles}</p>
    `: ""}

          <p>${footerMessage}</p>
          <p style="display: none;">&#8203;</p>
        `,
    });

    if (mail) {
      // Create email history record
      await prisma.orderEmail.create({
        data: {
          orderId: order.id,
          purpose: "PENDING", // Initial email sent when order is created
          isSent: true,
          sentAt: new Date(),
        },
      });

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