import { auth } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma"
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server"
import {Resend} from "resend";

const resendApiKey = process.env.RESEND_API_KEY;

if (!resendApiKey) {
    throw new Error("Missing Resend API key");
}

const resend = new Resend(resendApiKey);

export async function POST(req: NextRequest) {
    const body = await req.json()
    const { deliveryAddress, items, totalAmount } = body

    const session = await getServerSession(auth);
    
    if (!session || !session?.user?.email) {
        return NextResponse.json(
            { error: "Unauthorized" },
            { status: 401 }
        );
    }
    const clientId = session?.user?.id;

    if (!clientId) {
        return NextResponse.json(
            { error: "Client ID missing" },
            { status: 401 }
        );
    }

    const order = await prisma.order.create({
        data: {
            clientId,
            deliveryAddress,
            totalAmount,
            orderItems: {
                create: items.map((item: any) => ({
                    productId: item.productId,
                    quantity: item.quantity,
                    price: item.price
                }))
            }
        },
        include: { orderItems: true }
    })

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
            <th align="right">Price</th>
          </tr>
        </thead>
        <tbody>
          ${products
            .map(
              (item) => `
            <tr>
              <td>${item.name}</td>
              <td align="center">${order.orderItems.find(i => i.productId === item.id)?.quantity}</td>
              <td align="right">₹${item.price}</td>
            </tr>
          `
            )
            .join("")}
          <tr>
            <td colspan="2" align="right"><strong>Total</strong></td>
            <td align="right"><strong>₹${order.totalAmount}</strong></td>
          </tr>
        </tbody>
      </table>
    `;

    const adminEmail = process.env.ADMIN_EMAIL;
    const clientEmail = session?.user?.email;

    if (!adminEmail) {
        throw new Error("Missing admin email");
    }

    await Promise.all([
      resend.emails.send({
        from: "orders@fitplaysolutions.com",
        to: clientEmail,
        subject: "Order Created Successfully",
        html: `
          <h2>Order Confirmation</h2>
          <p>Hello ${session.user?.name || "Client"},</p>
          <p>Your order <b>${order.id}</b> has been created successfully.</p>
          <p>Delivery Address: ${deliveryAddress}</p>
          ${orderTable}
        `,
      }),
      resend.emails.send({
        from: "orders@fitplaysolutions.com",
        to: adminEmail,
        subject: "New Order Awaiting Approval",
        html: `
          <h2>New Dispatch Order</h2>
          <p>A new order <b>${order.id}</b> has been created by ${
          session.user?.name || "Unknown Client"
        }.</p>
          <p>Delivery Address: ${deliveryAddress}</p>
          ${orderTable}
          <p>Please review and approve for dispatch.</p>
        `,
      }),
    ])

    return NextResponse.json(order)
}
