import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { withPermissions } from "@/lib/auth-middleware";
import { Resend } from "resend";
import { Princess_Sofia } from "next/font/google";
import { updateOrder } from "@/data/order/admin.actions";
const resendApiKey = process.env.RESEND_API_KEY;

if (!resendApiKey) {
  throw new Error("Missing Resend API key");
}

const resend = new Resend(resendApiKey);

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
          numberOfBundles: true,
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
          bundleOrderItems: {
            select: {
              id: true,
              quantity: true,
              price: true,
              productId: true,
              bundleId: true,
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
              bundle: {
                select: {
                  id: true,
                  price: true,
                  items: {
                    select: {
                      id: true,
                      productId: true,
                      bundleProductQuantity: true,
                      price: true,
                      product: {
                        select: {
                          id: true,
                          name: true,
                          images: true,
                          sku: true,
                          price: true
                        }
                      }
                    }
                  }
                }
              }
            }
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

// Send bundleOrderItems as part of the request body from frontend in the following format:
// bundleOrderItems: [
//   {
//     productId: string;
//     quantity: number;
//     price: number;
//    bundleProductQuantity: number;
//   }
// ]

// items are simple order items and bundleOrderItems are items inside a bundle

export async function POST(req: NextRequest) {
  return withPermissions(req, async () => {
    try {
      const body = await req.json();
      console.log('Order creation request body:', JSON.stringify(body, null, 2));

      const {
        clientEmail,
        deliveryAddress,
        items,
        bundleOrderItems,
        numberOfBundles,
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

      console.log('Extracted data:', {
        clientEmail,
        itemsCount: items?.length || 0,
        bundleOrderItemsCount: bundleOrderItems?.length || 0,
        numberOfBundles
      });

      if (!clientEmail) {
        console.log('Validation failed: Client email is required');
        return NextResponse.json({ error: "Client email is required" }, { status: 400 });
      }

      const client = await prisma.client.findUnique({
        where: { email: clientEmail },
        select: { id: true, companyID: true },
      });

      console.log('Client lookup result:', { client });

      if (!client?.id) {
        console.log('Validation failed: Client not found');
        return NextResponse.json({ error: "Client not found" }, { status: 404 });
      }

      if (!client.companyID) {
        console.log('Validation failed: Client has no associated company');
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
      const bundleOrderItemsId = bundleOrderItems.map((item: any) => item.productId);

      // fetch individual items price and stock
      const itemsPrice = await prisma.product.findMany({
        where: { id: { in: itemsId } },
        select: { id: true, price: true, availableStock: true },
      });

      // get bundle items price and stock
      const bundleOrderItemsPrice = await prisma.product.findMany({
        where: { id: { in: bundleOrderItemsId } },
        select: { id: true, price: true, availableStock: true },
      });

      // individual items validation
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

      // bundle items validation
      for (const item of bundleOrderItems) {
        const product = bundleOrderItemsPrice.find((p) => p.id === item.productId);

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

      if (items.length === 0 && bundleOrderItems.length === 0) {
        console.log('Validation failed: At least one order item is required', {
          itemsLength: items.length,
          bundleOrderItemsLength: bundleOrderItems.length
        });
        return NextResponse.json({ error: "At least one order item is required" }, { status: 400 });
      }

      const totalItemsAmount = items.reduce((sum: number, item: any) => {
        const product = itemsPrice.find((p) => p.id === item.productId);
        const price = item.price || product?.price || 0;
        return sum + item.quantity * price;
      }, 0);

      const totalBundleItemsAmount = bundleOrderItems.reduce((sum: number, item: any) => {
        const product = bundleOrderItemsPrice.find((p) => p.id === item.productId);
        const price = item.price || product?.price || 0;
        return sum + item.quantity * price;
      }, 0);

      const totalAmount = totalItemsAmount + totalBundleItemsAmount;

      if (totalAmount < 0) {
        return NextResponse.json({ error: "Total amount cannot be negative" }, { status: 400 });
      }

      // create a bundle only if there are bundle items
      let bundles: any[] = [];

      if (bundleOrderItems.length > 0) {
        const bundleGroups = bundleOrderItems.reduce((groups: any, item: any) => {
          const groupId = item.bundleGroupId || "default-bundle";

          if (!groups[groupId]) {
            groups[groupId] = {
              items: [],
              numberOfBundles: item.numberOfBundles ?? 1,
            };
          }

          groups[groupId].items.push(item);
          return groups;
        }, {});

        for (const [groupId, groupData] of Object.entries(bundleGroups)) {
          const { items, numberOfBundles } = groupData as any;

          const newBundle = await prisma.bundle.create({
            data: {
              numberOfBundles,
            },
          });

          bundles.push({
            bundle: newBundle,
            items,
            numberOfBundles,
            groupId,
          });
        }
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
            orderItems: items.length > 0 ? {
              create: items.map((item: any) => ({
                productId: item.productId,
                quantity: item.quantity,
                price: item.price ?? 0,
              })),
            } : undefined,
            numberOfBundles,
          },
          include: {
            orderItems: true,
            bundleOrderItems: true
          },
        });

        if (bundles.length > 0) {
          for (const bundleGroup of bundles) {
            const { bundle, items } = bundleGroup;

            await tx.bundleOrderItem.createMany({
              data: items.map((item: any) => ({
                orderId: orderId,
                bundleId: bundle.id,
                productId: item.productId,
                quantity: item.quantity,
                price: item.price ?? 0,
              })),
            });
          }
        }

        if (bundles.length > 0) {
          for (const bundleGroup of bundles) {
            const { bundle, items } = bundleGroup;

            await tx.bundleItem.createMany({
              data: items.map((item: any) => ({
                bundleId: bundle.id,
                productId: item.productId,
                bundleProductQuantity: item.bundleProductQuantity,
                price: item.price ?? 0,
              })),
            });
          }
        }


        for (const bundleGroup of bundles) {
          const { bundle, items, numberOfBundles } = bundleGroup;

          const bundlePrice =
            items.reduce((sum: number, item: any) => {
              return sum + item.bundleProductQuantity * item.price;
            }, 0) * numberOfBundles;

          await tx.bundle.update({
            where: { id: bundle.id },
            data: {
              orderId: newOrder.id,
              price: bundlePrice,
              numberOfBundles,
            },
          });
        }


        // Update stock for all items (regular and bundle)
        const allItemsToUpdate = [
          ...items.map((item: any) => ({ ...item, type: 'regular' })),
          ...bundles.flatMap((bundleGroup: any) => 
            bundleGroup.items.map((item: any) => ({ ...item, type: 'bundle' }))
          ),
        ];

        for (const item of allItemsToUpdate) {
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

        const updatedProducts = await prisma.product.findMany({
          where: {
            id: { in: [...itemsId, ...bundleOrderItemsId] },
          },
          select: {
            name: true,
            availableStock: true,
            minStockThreshold: true,
          },
        });

        // Send stock alert emails if below threshold
        const adminEmail = process.env.ADMIN_EMAIL || "";
        const ownerEmail = process.env.OWNER_EMAIL || "vaibhav@fitplaysolutions.com";
        updatedProducts.forEach(async (productData) => {
          if (productData && productData.minStockThreshold) {
            if (productData.availableStock < productData.minStockThreshold) {
              const mail = await resend.emails.send({
                from: "no-reply@fitplaysolutions.com",
                to: [adminEmail],
                cc: ownerEmail,
                subject: `Stock Alert: Product ${productData.name} below minimum threshold`,
                html: `<p>Dear Admin,</p>
<p>The stock for product <strong>${productData.name}</strong> has fallen below the minimum threshold.</p>
<ul>
  <li>Current Stock: ${productData.availableStock}</li>
  <li>Minimum Threshold: ${productData.minStockThreshold}</li>
</ul>`,
              });
            }
          }
        });

        return newOrder;
      });
      return NextResponse.json(order);
    } catch (error) {
      console.error("Error creating order:", error);
      console.error("Error details:", {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
        name: error instanceof Error ? error.name : undefined
      });
      return NextResponse.json({
        error: "Failed to create order",
        details: error instanceof Error ? error.message : 'Unknown error'
      }, { status: 500 });
    }
  }, "orders", "create");
}
