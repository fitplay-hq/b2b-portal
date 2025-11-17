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
    const body = await req.json();
    const { 
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
    } = body;

    const session = await getServerSession(auth);

    if (!session || !session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const client = await prisma.client.findUnique({
      where: { email: session.user.email },
      select: { id: true, companyID: true },
    });

    if (!client?.id || !client.companyID) {
      return NextResponse.json({ error: "Client or company not found" }, { status: 404 });
    }

    const company = await prisma.company.findUnique({
      where: { id: client.companyID },
      select: { name: true },
    });

    if (!company?.name) {
      return NextResponse.json({ error: "Company not found" }, { status: 404 });
    }

    // Generate order ID
    const year = new Date().getFullYear();
    const startOrder = company.name.split(" ")[0].toUpperCase();

    const lastOrder = await prisma.order.findFirst({
      where: {
        id: { startsWith: `FP-${startOrder}${year}-` },
        clientId: client.id,
      },
      orderBy: { createdAt: "desc" },
    });

    let nextSequence = 1;
    if (lastOrder) {
      const parts = lastOrder.id.split("-");
      const lastSeq = parseInt(parts[parts.length - 1], 10);
      if (!isNaN(lastSeq)) nextSequence = lastSeq + 1;
    }

    const itemsId = items.map((item: any) => item.productId);

    const itemsPrice = await prisma.product.findMany({
      where: { id: { in: itemsId } },
      select: { id: true, price: true, availableStock: true },
    });

    // Validate stock and inject prices if missing
    for (const item of items) {
      const product = itemsPrice.find((p) => p.id === item.productId);
      if (!product) {
        return NextResponse.json({ error: `Product with ID ${item.productId} not found` }, { status: 404 });
      }
      if (product.availableStock < item.quantity) {
        return NextResponse.json({ error: `Insufficient stock for product ID ${item.productId}` }, { status: 400 });
      }
      if (!item.price) item.price = product.price;
    }

    if (items.length === 0) {
      return NextResponse.json({ error: "At least one order item is required" }, { status: 400 });
    }

    const totalAmount = itemsPrice.reduce((sum, product) => {
      const item = items.find((i: any) => i.productId === product.id);
      return sum + (item?.quantity || 0) * (product.price || 0);
    }, 0);

    if (!totalAmount || totalAmount <= 0) {
      return NextResponse.json({ error: "Total amount must be greater than zero" }, { status: 400 });
    }

    let orderId = "";

    while (true) {
      orderId = `FP-${startOrder}${year}-${String(nextSequence).padStart(3, "0")}`;
      const existingOrder = await prisma.order.findUnique({
        where: { id: orderId },
      });
      if (!existingOrder) break;
      nextSequence++;
    }

    // Create order WITHOUT updating inventory - inventory is updated only on approval
    const order = await prisma.order.create({
      data: {
        id: orderId,
        clientId: client.id,
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
        totalAmount,
        orderItems: {
          create: items.map((item: any) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price ?? 0,
          })),
        },
      },
      include: { orderItems: true },
    });

    // ⬇️ your existing mail logic stays unchanged below
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
          ${products.map(
            (item) => `
              <tr>
                <td>${item.name}</td>
                <td align="center">${order.orderItems.find(i => i.productId === item.id)?.quantity}</td>
              </tr>
            `
          ).join("")}
        </tbody>
      </table>
    `;

    const footerMessage = toggleTracker
      ? "Please reply confirmation to this new dispatch order."
      : "Please reply confirmation to this new dispatch order mail.";
    toggleTracker = !toggleTracker;

    const adminEmail = process.env.ADMIN_EMAIL;
    const clientEmail = session?.user?.email;
    const ccEmail = process.env.CC_EMAIL_1;

    if (!adminEmail) throw new Error("Missing admin email");
    if (!ccEmail) throw new Error("Missing CC email");

    const mail = await resend.emails.send({
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
    });

    if (mail) {
      await prisma.order.update({
        where: { id: orderId },
        data: { isMailSent: true },
      });
    }

    return NextResponse.json(order);
  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
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
                images: true,
                price: true
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
