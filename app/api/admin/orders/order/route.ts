import { auth } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

let toggleTracker = true;
const resendApiKey = process.env.RESEND_API_KEY;
if (!resendApiKey) {
    throw new Error("Missing Resend API key");
}

const resend = new Resend(resendApiKey);

export async function GET(req: NextRequest) {
    try {
        const session = await getServerSession(auth);

        if (!session || !session?.user || session?.user?.role !== "ADMIN") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const orderId = req.nextUrl.searchParams.get("id");

        if (!orderId) {
            return NextResponse.json({ error: "Order ID is required" }, { status: 400 });
        }

        const order = await prisma.order.findUnique({
            where: { id: orderId },
            include: {
                orderItems: {
                    include: {
                        product: {
                            select: {
                                id: true,
                                name: true,
                                images: true
                            }
                        }
                    }
                }
            }
        });

        if (!order) {
            return NextResponse.json({ error: "Order not found" }, { status: 404 });
        }

        return NextResponse.json(order);
    } catch (error) {
        console.error("Error fetching order:", error);
        return NextResponse.json({ error: "Failed to fetch order" }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(auth);

        if (!session || !session?.user || session?.user?.role !== "ADMIN") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json()
        const {
            clientEmail,
            deliveryAddress,
            items,
            consigneeName,
            consigneePhone,
            consigneeEmail,
            city,
            state,
            pincode,
            requiredByDate,
            modeOfDelivery,
            note = '',
            deliveryReference = '',
            packagingInstructions = ''
        } = body

        if (!clientEmail) {
            return NextResponse.json({ error: "Client email is required" }, { status: 400 });
        }
        const clientId = await prisma.client.findUnique({
            where: { email: clientEmail },
            select: { id: true }
        })

        if (!clientId) {
            return NextResponse.json({ error: "Client not found" }, { status: 404 });
        }

        const year = new Date().getFullYear();

        const lastOrder = await prisma.order.findFirst({
            where: {
                id: {
                    startsWith: `GH-FP${year}-`,
                },
                clientId: clientId.id,
            },
            orderBy: {
                createdAt: "desc",
            },
        });

        let nextSequence = 1;
        if (lastOrder) {
            const parts = lastOrder.id.split("-");
            const lastSeq = parseInt(parts[parts.length - 1], 10);

            if (!isNaN(lastSeq)) {
                nextSequence = lastSeq + 1;
            }
        }

        const orderId = `GH-FP${year}-${String(nextSequence).padStart(3, "0")}`;

        const order = await prisma.$transaction(async (tx) => {
            const newOrder = await tx.order.create({
                data: {
                    id: orderId,
                    clientId: clientId.id,
                    consigneeName,
                    consigneePhone,
                    consigneeEmail,
                    city,
                    state,
                    pincode,
                    requiredByDate,
                    modeOfDelivery,
                    deliveryAddress,
                    deliveryReference,
                    packagingInstructions,
                    note,
                    totalAmount: 0,
                    orderItems: {
                        create: items.map((item: any) => ({
                            productId: item.productId,
                            quantity: item.quantity,
                            price: item.price ?? 0,
                        }))
                    }
                },
                include: { orderItems: true }
            });

            // ✅ Reduce stock here instead of approval
            for (const item of newOrder.orderItems) {
                await tx.product.update({
                    where: { id: item.productId },
                    data: {
                        availableStock: {
                            decrement: item.quantity,
                        },
                    },
                });
            }
            return newOrder;
        });

        const products = await prisma.product.findMany({
            where: {
                id: {
                    in: order.orderItems.map(item => item.productId)
                }
            }
        });

        const orderTable = `
      <table border="1" cellpadding="8" cellspacing="0" style="border-collapse: collapse; width: 100%; margin-top: 16px;">
        <thead>
          <tr>
            <th align="left">Product</th>
            <th align="center">Quantity</th>
          </tr>
        </thead>
        <tbody>
          ${products
                .map(
                    (item) => `
            <tr>
              <td>${item.name}</td>
              <td align="center">${order.orderItems.find(i => i.productId === item.id)?.quantity}</td>
            </tr>
          `
                )
                .join("")}
        </tbody>
      </table>
    `;

        const footerMessage = toggleTracker ? "Please reply confirmation to this new dispatch order."
            : "Please reply confirmation to this new dispatch order mail.";

        toggleTracker = !toggleTracker;

        const adminEmail = process.env.ADMIN_EMAIL;
        const ccEmail = process.env.CC_EMAIL_1;

        if (!adminEmail) {
            throw new Error("Missing admin email");
        }

        if (!ccEmail) {
            throw new Error("Missing CC email");
        }

        await Promise.all([
            resend.emails.send({
                from: adminEmail,
                to: clientEmail,
                cc: [ccEmail],
                subject: "New Order Awaiting Approval",
                html: `
          <h2>New Dispatch Order</h2>
          <p>A new order <b>${order.id}</b> has been created by ${session.user?.name || "Unknown Client"}.</p>
          
          <h3>Consignee Details</h3>
          <p><b>Name:</b> ${consigneeName}</p>
          <p><b>Phone:</b> ${consigneePhone}</p>
          <p><b>Email:</b> ${consigneeEmail}</p>
          <p><b>Mode of Delivery:</b> ${modeOfDelivery}</p>
          <p><b>Required By:</b> ${new Date(requiredByDate).toLocaleDateString()}</p>

          <h3>Delivery Address</h3>
          <p>${deliveryAddress}, ${city}, ${state}, ${pincode}</p>

          <h3>Order Summary</h3>
          ${orderTable}

          <p>${footerMessage}</p>
          <p style="display: none;">&#8203;</p>
        `,
            }),
        ])

        return NextResponse.json(order)

    } catch (error) {
        console.error("Error fetching order:", error);
        return NextResponse.json({ error: "Failed to create an order" }, { status: 500 });
    }
}
