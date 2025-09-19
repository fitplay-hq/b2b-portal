import { auth } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

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

    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
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
      note = "",
      deliveryReference = "",
      packagingInstructions = "",
    } = body;

    if (!clientEmail) {
      return NextResponse.json({ error: "Client email is required" }, { status: 400 });
    }

    const client = await prisma.client.findUnique({
      where: { email: clientEmail },
      select: { id: true, companyID: true },
    });

    if (!client?.id || !client.companyID) {
      return NextResponse.json({ error: "Client or company not found" }, { status: 404 });
    }

    const company = await prisma.company.findUnique({
      where: { id: client.companyID },
      select: { name: true },
    });

    const year = new Date().getFullYear();
    const startOrder = company?.name?.toUpperCase().replace(/\s+/g, "").slice(0, 2);

    const lastOrder = await prisma.order.findFirst({
      where: {
        id: { startsWith: `${startOrder}-FP${year}-` },
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

    const orderId = `${startOrder}-FP${year}-${String(nextSequence).padStart(3, "0")}`;
    const totalAmount = items.reduce(
      (sum: number, item: any) => sum + (item.price ?? 0) * item.quantity,
      0
    );

    const order = await prisma.$transaction(async (tx) => {
      const newOrder = await tx.order.create({
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

    return NextResponse.json(order);
  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
  }
}
