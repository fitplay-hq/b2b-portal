import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { withPermissions } from "@/lib/auth-middleware";

export async function GET(req: NextRequest) {
  return withPermissions(req, async () => {
    try {

        const orderId = req.nextUrl.searchParams.get("id");

        if (!orderId) {
            return NextResponse.json({ error: "Order ID is required" }, { status: 400 });
        }

        const order = await prisma.order.findUnique({
            where: { id: orderId },
            select: {
                id: true,
                totalAmount: true,
                consigneeName: true,
                consigneePhone: true,
                consigneeEmail: true,
                deliveryAddress: true,
                city: true,
                state: true,
                pincode: true,
                modeOfDelivery: true,
                deliveryReference: true,
                packagingInstructions: true,
                note: true,
                shippingLabelUrl: true,
                status: true,
                consignmentNumber: true,
                deliveryService: true,
                isMailSent: true,
                clientId: true,
                createdAt: true,
                updatedAt: true,
                orderItems: {
                    select: {
                        id: true,
                        quantity: true,
                        price: true,
                        productId: true,
                        orderId: true,
                        product: {
                            select: {
                                id: true,
                                name: true,
                                images: true,
                                sku: true,
                                price: true
                            },
                        },
                    },
                },
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
  }, "orders", "view");
}

export async function POST(req: NextRequest) {
  return withPermissions(req, async () => {
    try {
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

      if (!client?.id) {
        return NextResponse.json({ error: "Client not found" }, { status: 404 });
      }

      if (!client.companyID) {
        return NextResponse.json({ error: "Client has no associated company" }, { status: 400 });
      }

      const company = await prisma.company.findUnique({
        where: { id: client.companyID },
        select: { name: true },
      });

      if (!company) {
        return NextResponse.json({ error: "Company not found" }, { status: 404 });
      }

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

      for (const item of items) {
        const product = itemsPrice.find((p) => p.id === item.productId);

        if (!product) {
          return NextResponse.json({ error: `Product with ID ${item.productId} not found` }, { status: 404 });
        }
        if (product.availableStock < item.quantity) {
          return NextResponse.json({ error: `Insufficient stock for product ID ${item.productId}` }, { status: 400 });
        }

        if (!item.price || item.price === 0) {
          item.price = product.price ?? 0;
        }
      }

      if (items.length === 0) {
        return NextResponse.json({ error: "At least one order item is required" }, { status: 400 });
      }

      const totalAmount = items.reduce((sum: number, item: any) => {
        const product = itemsPrice.find((p) => p.id === item.productId);
        const price = item.price || product?.price || 0;
        return sum + item.quantity * price;
      }, 0);

      if (totalAmount < 0) {
        return NextResponse.json({ error: "Total amount cannot be negative" }, { status: 400 });
      }

      let orderId = "";
      while (true) {
        orderId = `FP-${startOrder}${year}-${String(nextSequence).padStart(3, "0")}`;
        const existingOrder = await prisma.order.findUnique({ where: { id: orderId } });
        if (!existingOrder) break;
        nextSequence++;
      }

      // --------------------------
      // 🔥 MAIN CHANGE: Use a transaction to create order + update inventory
      // --------------------------
      const order = await prisma.$transaction(async (tx) => {

        // Create order
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

        // Update stock
        for (const item of items) {

          const itemStock = await tx.product.findUnique({
            where: { id: item.productId },
            select: { availableStock: true },
          });

          if (!itemStock) {
            throw new Error(`Product with ID ${item.productId} not found during stock update`);
          }
          await tx.product.update({
            where: { id: item.productId },
            data: {
              availableStock: { decrement: item.quantity },
              inventoryUpdateReason: "NEW_ORDER",
              inventoryLogs: {
                push: `${new Date().toISOString()} | Removed ${item.quantity} units | Reason: NEW_ORDER | Updated stock: ${itemStock.availableStock - item.quantity} | Remarks: `,
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
  }, "orders", "create");
}
