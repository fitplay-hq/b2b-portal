import { auth } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma"
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server"
import { Resend } from "resend";

const resendApiKey = process.env.RESEND_API_KEY;

if (!resendApiKey) {
  throw new Error("Missing Resend API key");
}

const resend = new Resend(resendApiKey);

let toggleTracker = true;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { deliveryAddress, items, consigneeName, consigneePhone, consigneeEmail, city, state, pincode, modeOfDelivery } = body

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

    const year = new Date().getFullYear();

    const lastOrder = await prisma.order.findFirst({
      where: {
        id: {
          startsWith: `GH-FP${year}-`,
        },
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

    const order = await prisma.order.create({
      data: {
        id: orderId,
        clientId,
        consigneeName,
        consigneePhone,
        consigneeEmail,
        city,
        state,
        pincode,
        modeOfDelivery,
        deliveryAddress,
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
    const clientEmail = session?.user?.email;

    if (!adminEmail) {
      throw new Error("Missing admin email");
    }

     await Promise.all([
      resend.emails.send({
        from: "aditya@fitplaysolutions.com",
        to: clientEmail,
        cc: ["adinarang10@gmail.com"],
        subject: "New Order Awaiting Approval",
        html: `
          <h2>New Dispatch Order</h2>
          <p>A new order <b>${order.id}</b> has been created by ${session.user?.name || "Unknown Client"}.</p>
          
          <h3>Consignee Details</h3>
          <p><b>Name:</b> ${consigneeName}</p>
          <p><b>Phone:</b> ${consigneePhone}</p>
          <p><b>Email:</b> ${consigneeEmail}</p>
          <p><b>Mode of Delivery:</b> ${modeOfDelivery}</p>
          
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
    console.error("Error creating order:", error);
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(auth);

    if (!session || !session?.user?.email) {
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