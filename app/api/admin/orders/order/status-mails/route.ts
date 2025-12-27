import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { Resend } from "resend";
import { withPermissions } from "@/lib/auth-middleware";

const resend = new Resend(process.env.RESEND_API_KEY!);

const STATUS_PRIORITY: Record<string, number> = {
    APPROVED: 1,
    READY_FOR_DISPATCH: 2,
    DISPATCHED: 3,
    AT_DESTINATION: 4,
    DELIVERED: 5,
    CANCELLED: 99,
};

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

            if (status == "PENDING") {
                return NextResponse.json(
                    { error: "Cannot send email for PENDING status" },
                    { status: 400 }
                );
            }

            const order = await prisma.order.findUnique({
                where: { id: orderId },
                include: {
                    client: true,
                    orderItems: { include: { product: true } },
                    bundleOrderItems: { include: { bundle: true, product: true } },
                    emails: true,
                },
            });

            if (!order) {
                return NextResponse.json({ error: "Order not found" }, { status: 404 });
            }

            if (!order.isMailSent) {
                return NextResponse.json(
                    { error: "Can't send email for this order before order creation mail" },
                    { status: 400 }
                );
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
        const warehouseEmail = "ops@fitplaysolutions.com";
        const ownerEmail = "vaibhav@fitplaysolutions.com";
        const ccEmails = [ownerEmail]

            let recipients: string[] = [];
            let subject = "";
            let html = "";

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


            if (!clientEmail) {
                return NextResponse.json(
                    { error: "Client email not found" },
                    { status: 400 }
                );
            }

            switch (status) {
                case "APPROVED":
                    recipients = [clientEmail, warehouseEmail];
                    subject = `Order ${order.id} Approved`;
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

            html = `
        <h2>Order Status Update: ${status.replace(/_/g, " ")}</h2>
        <p>Your order has been updated to <b>${status.replace(/_/g, " ")}</b> status.</p>
        <h3>Order Details</h3>
      ${orderTable}
    `;

            // Send email
            await resend.emails.send({
                from: "orders@fitplaysolutions.com",
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