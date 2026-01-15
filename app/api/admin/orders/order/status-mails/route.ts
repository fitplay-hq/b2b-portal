import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { Resend } from "resend";
import { withPermissions } from "@/lib/auth-middleware";

const resend = new Resend(process.env.RESEND_API_KEY!);

const STATUS_PRIORITY: Record<string, number> = {
    PENDING: 0,
    APPROVED: 1,
    READY_FOR_DISPATCH: 2,
    DISPATCHED: 3,
    AT_DESTINATION: 4,
    DELIVERED: 5,
    CANCELLED: 99,
};

let toggleTracker = true;

export async function POST(req: NextRequest) {
    return withPermissions(req, async () => {
        try {
            const { orderId, status } = await req.json();

            if (!orderId || !status) {
                return NextResponse.json(
                    { error: "Missing parameters" },
                    { status: 400 }
                );
            }

            const order = await prisma.order.findUnique({
                where: { id: orderId },
                include: {
                    client: true,
                    orderItems: { include: { product: true } },
                    bundleOrderItems: { include: { bundle: true, product: true } },
                    bundles: { include: { items: { include: { product: true } } } },
                    emails: true,
                },
            });

            if (!order) {
                return NextResponse.json({ error: "Order not found" }, { status: 404 });
            }

            const sentStatuses = order.emails.map((e) => e.purpose);
            console.log("Sent statuses for order:", sentStatuses);

            // ❌ Prevent duplicate or backward transitions
            if (sentStatuses.includes(status)) {
                return NextResponse.json(
                    { error: "Email already sent for this status" },
                    { status: 400 }
                );
            }

            // ❌ Prevent sending after cancellation
            if (sentStatuses.includes("CANCELLED")) {
                return NextResponse.json(
                    { error: "Order already cancelled" },
                    { status: 400 }
                );
            }

            const highestSent = sentStatuses.length > 0 ? Math.max(
                -1,
                ...sentStatuses.map((s) => STATUS_PRIORITY[s])
            ) : -1;

            const currentIndex = STATUS_PRIORITY[status];

            if (currentIndex < highestSent) {
                return NextResponse.json(
                    { error: "Invalid status sequence" },
                    { status: 400 }
                );
            }

            // ------------------ BUILD EMAIL ------------------

            const clientEmail = order.client?.email;
            const adminEmail = process.env.ADMIN_EMAIL!;
            const warehouseEmail = process.env.ENVIRONMENT === "development" ? process.env.WAREHOUSE_EMAIL! : "ops@fitplaysolutions.com";
            const ownerEmail = process.env.OWNER_EMAIL || "vaibhav@fitplaysolutions.com";
            const ccEmails = [ownerEmail];

            const client = await prisma.client.findUnique({
                where: { email: clientEmail }
            })

            let recipients: string[] = [];
            let subject = "";
            let html = "";
            let reqByDate = "";

            const productMap = new Map<string, {
                name: string;
                quantity: number;
                bundles: Set<number>;
            }>();

            order.orderItems.forEach((item) => {
                if (!productMap.has(item.productId)) {
                    productMap.set(item.productId, {
                        name: item.product.name,
                        quantity: 0,
                        bundles: new Set(),
                    });
                }
                productMap.get(item.productId)!.quantity += item.quantity;
            });

            order.bundleOrderItems.forEach((item) => {
                if (!productMap.has(item.productId)) {
                    productMap.set(item.productId, {
                        name: item.product.name,
                        quantity: 0,
                        bundles: new Set(),
                    });
                }
                productMap.get(item.productId)!.quantity += item.quantity;

                const bundleIndex =
                    order.bundles.findIndex((b) => b.id === item.bundleId) + 1;

                if (bundleIndex > 0) {
                    productMap.get(item.productId)!.bundles.add(bundleIndex);
                }
            });

            const orderTable = `
<table border="1" cellpadding="8" cellspacing="0"
  style="border-collapse: collapse; width: 100%; margin-top: 16px;">
  <thead>
    <tr>
      <th align="left">Product</th>
      <th align="center">Quantity</th>
    </tr>
  </thead>
  <tbody>
    ${Array.from(productMap.values())
                    .map(({ name, quantity, bundles }) => {
                        const bundleLabel =
                            bundles.size > 0
                                ? ` (Bundle - ${Array.from(bundles).join(", ")})`
                                : "";

                        return `
          <tr>
            <td>${name}${bundleLabel}</td>
            <td align="center">${quantity}</td>
          </tr>
        `;
                    })
                    .join("")}
  </tbody>
</table>
`;


            if (!clientEmail) {
                return NextResponse.json(
                    { error: "Client email not found" },
                    { status: 400 }
                );
            }

            switch (status) {
                case "PENDING":
                    recipients = [clientEmail, adminEmail];
                    subject = "New Order Awaiting Approval";
                    break;

                case "APPROVED":
                    recipients = [clientEmail, warehouseEmail];
                    subject = `Order ${order.id} Approved`;
                    reqByDate = order.requiredByDate ? new Date(order.requiredByDate).toLocaleDateString() : "N/A";
                    break;

                case "READY_FOR_DISPATCH":
                    recipients = [adminEmail];
                    subject = `Order ${order.id} Ready for Dispatch`;
                    break;

                case "DISPATCHED":
                    recipients = [clientEmail, adminEmail, warehouseEmail];
                    subject = `Order ${order.id} Dispatched`;
                    break;

                case "AT_DESTINATION":
                    recipients = [clientEmail, adminEmail, warehouseEmail];
                    subject = `Order ${order.id} Reached Destination`;
                    break;

                case "DELIVERED":
                    recipients = [clientEmail, adminEmail, warehouseEmail];
                    subject = `Order ${order.id} Delivered`;
                    break;

                case "CANCELLED":
                    recipients = [clientEmail, adminEmail, warehouseEmail];
                    subject = `Order ${order.id} Cancelled`;
                    break;
            }
            // Req by date -> Approval(order creation) and confirmation(approve)

            const footerMessage = toggleTracker
                ? "Please reply confirmation to this new dispatch order."
                : "Please reply confirmation to this new dispatch order mail.";
            toggleTracker = !toggleTracker;

            html = status === 'PENDING' ? `
          <h2>New Dispatch Order</h2>
          <p>A new order has been created for ${client?.name || "Unknown User"}.</p>
          
          <h3>Consignee Details</h3>
          <p><b>Name:</b> ${order.consigneeName}</p>
          <p><b>Phone:</b> ${order.consigneePhone}</p>
          <p><b>Email:</b> ${order.consigneeEmail}</p>
          <p><b>Mode of Delivery:</b> ${order.modeOfDelivery}</p>
          <p><b>Delivery Reference:</b> ${order.deliveryReference}</p>
          <p><b>Additional Note:</b> ${order.note}</p>
          <p><b>Packaging Instructions:</b> ${order.packagingInstructions}</p>
          <p><b>Required By:</b> ${new Date(order.requiredByDate).toLocaleDateString()}</p>

          <h3>Delivery Address</h3>
          <p>${order.deliveryAddress}, ${order.city}, ${order.state}, ${order.pincode}</p>

          <h3>Order Summary</h3>
          ${orderTable}

          ${order.bundleOrderItems.length > 0 ? `
            <h3>Bundle Breakdown:</h3>
            ${order.bundles
                        .map((bundle, index) => `
    <div style="margin-bottom:16px;">
      <p><b>Bundle - ${index + 1}</b></p>
      ${bundle.numberOfBundles ? `<p><b>Number of Bundles:</b> ${bundle.numberOfBundles}</p>` : ""}

      <table border="1" cellpadding="6" cellspacing="0"
        style="border-collapse:collapse;width:100%;margin-top:8px;">
        <thead>
          <tr>
            <th align="left">Product</th>
            <th align="center">Quantity (per bundle)</th>
          </tr>
        </thead>
        <tbody>
          ${bundle.items
                                .map(item => `
              <tr>
                <td>${item.product?.name || "Unknown Product"}</td>
                <td align="center">${item.bundleProductQuantity ?? 0}</td>
              </tr>
            `)
                                .join("")}
        </tbody>
      </table>
    </div>
  `)
                        .join("")}


    `: ""}

          <p>${footerMessage}</p>
          <p style="display: none;">&#8203;</p>
        `
                : `
        <h2>Order Status Update: ${status.replace(/_/g, " ")}</h2>
        <p>Your order has been updated to <b>${status.replace(/_/g, " ")}</b> status.</p>
        <h3>Consignee Details</h3>
          <p><b>Name:</b> ${order.consigneeName}</p>
          <p><b>Phone:</b> ${order.consigneePhone}</p>
          <p><b>Email:</b> ${order.consigneeEmail}</p>
          <p><b>Mode of Delivery:</b> ${order.modeOfDelivery}</p>
          <p><b>Delivery Reference:</b> ${order.deliveryReference}</p>
          ${reqByDate ? `<p><b>Required By:</b> ${reqByDate}</p>` : ""}
          
          <h3>Delivery Address</h3>
          <p>${order.deliveryAddress}, ${order.city}, ${order.state}, ${order.pincode}</p>
        <h3>Order Details</h3>
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
    `: ""}`

            // Send email
            await resend.emails.send({
                from: process.env.ENVIRONMENT === "development" ? process.env.FROM_EMAIL! : "orders@fitplaysolutions.com",
                to: recipients,
                cc: ccEmails,
                subject,
                html,
            });

            // Save email record
            await prisma.orderEmail.create({
                data: {
                    orderId: order.id,
                    purpose: status,
                    isSent: true,
                    sentAt: new Date(),
                },
            });

            return NextResponse.json({ success: true });
        } catch (err) {
            console.error("Email send error:", err);
            return NextResponse.json(
                { error: "Internal Server Error" },
                { status: 500 }
            );
        }
    }, "orders", "edit");
}

// fetch all status emails for all orders (for 1 order check history/route.ts)
export async function GET(req: NextRequest) {
    return withPermissions(req, async () => {
        try {
            const emails = await prisma.orderEmail.findMany({
                orderBy: { createdAt: "desc" },
            });

            return NextResponse.json(emails);
        } catch (err) {
            console.error("Error fetching emails:", err);
            return NextResponse.json(
                { error: "Internal Server Error" },
                { status: 500 }
            );
        }
    }, "orders", "view");
}