import { auth } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
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
    console.log('Client order creation request body:', JSON.stringify(body, null, 2));
    const {
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

    // Basic validation
    if (!consigneeName || !consigneePhone || !consigneeEmail || !city || !state || !pincode || !requiredByDate || !modeOfDelivery || !deliveryAddress) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const session = await getServerSession(auth);

    if (!session || !session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const client = await prisma.client.findUnique({
      where: { id: session.user.id },
      select: { id: true, companyID: true },
    });

    if (!client?.id || !client.companyID) {
      return NextResponse.json(
        { error: "Client or company not found" },
        { status: 404 }
      );
    }

    const company = await prisma.company.findUnique({
      where: { id: client.companyID },
      select: { name: true },
    });

    if (!company?.name) {
      return NextResponse.json({ error: "Company not found" }, { status: 404 });
    }

    const year = new Date().getFullYear();
    const startOrder = company.name.split(" ")[0].toUpperCase();
    
    // Validate startOrder
    if (!startOrder || startOrder.length === 0) {
      console.error("Invalid company name for order ID generation:", company.name);
      return NextResponse.json(
        { error: "Invalid company configuration for order creation" },
        { status: 400 }
      );
    }

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

    const itemsId = items.map((item: any) => item.productId).filter(Boolean);
    const bundleItemsId = bundleOrderItems.map((item: any) => item.productId).filter(Boolean);

    const itemsPrice = await prisma.product.findMany({
      where: { id: { in: itemsId } },
      select: { id: true, price: true, availableStock: true },
    });

    const bundleItemsPrice = await prisma.product.findMany({
      where: { id: { in: bundleItemsId } },
      select: { id: true, price: true, availableStock: true },
    });

    // Validate bundle items and merge prices
    for (const item of bundleOrderItems) {
      const product = bundleItemsPrice.find((p) => p.id === item.productId);
      if (!product) {
        return NextResponse.json(
          {
            error: `Product with ID ${item.productId} not found in bundle items`,
          },
          { status: 404 }
        );
      }
      if (product.availableStock < item.quantity) {
        return NextResponse.json(
          {
            error: `Insufficient stock for product ID ${item.productId} in bundle items`,
          },
          { status: 400 }
        );
      }
      if (!item.price) item.price = product.price;
    }

    // Validate simple items and merge prices

    for (const item of items) {
      const product = itemsPrice.find((p) => p.id === item.productId);
      if (!product) {
        return NextResponse.json(
          { error: `Product with ID ${item.productId} not found` },
          { status: 404 }
        );
      }
      if (product.availableStock < item.quantity) {
        return NextResponse.json(
          { error: `Insufficient stock for product ID ${item.productId}` },
          { status: 400 }
        );
      }
      if (!item.price) item.price = product.price;
    }

    if (items.length === 0 && bundleOrderItems.length === 0) {
      return NextResponse.json(
        { error: "At least one order item is required" },
        { status: 400 }
      );
    }

    const totalItemsAmount = itemsPrice.reduce((sum, product) => {
      const item = items.find((i: any) => i.productId === product.id);
      return sum + (item?.quantity || 0) * (product.price || 0);
    }, 0);

    const totalBundleItemsAmount = bundleItemsPrice.reduce((sum, product) => {
      const item = bundleOrderItems.find(
        (i: any) => i.productId === product.id
      );
      return sum + (item?.quantity || 0) * (product.price || 0);
    }, 0);

    const totalAmount = totalItemsAmount + totalBundleItemsAmount;

    if (!totalAmount || totalAmount <= 0) {
      return NextResponse.json(
        { error: "Total amount must be greater than zero" },
        { status: 400 }
      );
    }

    // Create separate bundles for each bundle group
    let bundles: any[] = [];
    if (bundleOrderItems.length > 0) {
      // Create multiple bundles based on numberOfBundles
      // Each bundle will contain a subset of the items
      const itemsPerBundle = Math.floor(bundleOrderItems.length / (numberOfBundles || 1));
      let remainingItems = bundleOrderItems.length % (numberOfBundles || 1);
      
      let currentIndex = 0;
      for (let i = 0; i < (numberOfBundles || 1); i++) {
        const itemsInThisBundle = itemsPerBundle + (remainingItems > 0 ? 1 : 0);
        if (remainingItems > 0) remainingItems--;
        
        const bundleItems = bundleOrderItems.slice(currentIndex, currentIndex + itemsInThisBundle);
        currentIndex += itemsInThisBundle;
        
        if (bundleItems.length > 0) {
          const newBundle = await prisma.bundle.create({
            data: {},
          });
          bundles.push(newBundle);
        }
      }
    }

    let orderId = "";
    let attempts = 0;
    while (true) {
      orderId = `FP-${startOrder}${year}-${String(nextSequence).padStart(
        3,
        "0"
      )}`;
      const existingOrder = await prisma.order.findUnique({
        where: { id: orderId },
      });
      if (!existingOrder) break;
      nextSequence++;
      attempts++;
      
      // Prevent infinite loop
      if (attempts > 1000) {
        console.error("Failed to generate unique order ID after 1000 attempts");
        return NextResponse.json(
          { error: "Unable to generate unique order ID" },
          { status: 500 }
        );
      }
    }
    
    // Final validation
    if (!orderId || orderId.length === 0) {
      console.error("Order ID generation failed", { startOrder, year, nextSequence });
      return NextResponse.json(
        { error: "Order ID generation failed" },
        { status: 500 }
      );
    }
    
    console.log("Generated order ID:", orderId);

    // --------------------------
    // 🔥 Create order without transaction to avoid serverless timeouts
    // --------------------------
    
    // Create the main order first
    const newOrder = await prisma.order.create({
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
        numberOfBundles: numberOfBundles,
      },
    });

    // Create order items
    if (items.length > 0) {
      await prisma.orderItem.createMany({
        data: items.map((item: any) => ({
          orderId: newOrder.id,
          productId: item.productId,
          quantity: item.quantity,
          price: item.price ?? 0,
        })),
      });
    }

    // Create bundle order items for each bundle
    if (bundleOrderItems.length > 0 && bundles.length > 0) {
      // Distribute bundleOrderItems across the created bundles
      const itemsPerBundle = Math.floor(bundleOrderItems.length / bundles.length);
      let remainingItems = bundleOrderItems.length % bundles.length;
      
      let currentIndex = 0;
      for (let bundleIdx = 0; bundleIdx < bundles.length; bundleIdx++) {
        const bundle = bundles[bundleIdx];
        const itemsInThisBundle = itemsPerBundle + (remainingItems > 0 ? 1 : 0);
        if (remainingItems > 0) remainingItems--;
        
        const bundleItems = bundleOrderItems.slice(currentIndex, currentIndex + itemsInThisBundle);
        currentIndex += itemsInThisBundle;
        
        if (bundleItems.length > 0) {
          await prisma.bundleOrderItem.createMany({
            data: bundleItems.map((item: any) => ({
              orderId: newOrder.id,
              bundleId: bundle.id,
              productId: item.productId,
              quantity: item.quantity,
              price: item.price ?? 0,
            })),
          });
        }
      }
    }

    // Update each bundle with its price and orderId
    if (bundles.length > 0) {
      const itemsPerBundle = Math.floor(bundleOrderItems.length / bundles.length);
      let remainingItems = bundleOrderItems.length % bundles.length;
      
      let currentIndex = 0;
      for (let bundleIdx = 0; bundleIdx < bundles.length; bundleIdx++) {
        const bundle = bundles[bundleIdx];
        const itemsInThisBundle = itemsPerBundle + (remainingItems > 0 ? 1 : 0);
        if (remainingItems > 0) remainingItems--;
        
        const bundleItems = bundleOrderItems.slice(currentIndex, currentIndex + itemsInThisBundle);
        currentIndex += itemsInThisBundle;
        
        // Calculate price for this specific bundle
        const thisBundlePrice = bundleItems.reduce((sum: number, item: any) => {
          return sum + item.bundleProductQuantity * item.price;
        }, 0);
        
        await prisma.bundle.update({
          where: { id: bundle.id },
          data: {
            orderId: newOrder.id,
            price: thisBundlePrice,
          },
        });
      }
    }
    
    // Create bundle items separately for each bundle
    if (bundleOrderItems.length > 0 && bundles.length > 0) {
      const itemsPerBundle = Math.floor(bundleOrderItems.length / bundles.length);
      let remainingItems = bundleOrderItems.length % bundles.length;
      
      let currentIndex = 0;
      for (let bundleIdx = 0; bundleIdx < bundles.length; bundleIdx++) {
        const bundle = bundles[bundleIdx];
        const itemsInThisBundle = itemsPerBundle + (remainingItems > 0 ? 1 : 0);
        if (remainingItems > 0) remainingItems--;
        
        const bundleItems = bundleOrderItems.slice(currentIndex, currentIndex + itemsInThisBundle);
        currentIndex += itemsInThisBundle;
        
        if (bundleItems.length > 0) {
          try {
            await prisma.bundleItem.createMany({
              data: bundleItems.map((item: any) => ({
                bundleId: bundle.id,
                productId: item.productId,
                bundleProductQuantity: item.bundleProductQuantity,
                price: item.price ?? 0,
              })),
            });
          } catch (bundleItemError) {
            console.error(`Error creating bundle items for bundle ${bundle.id}:`, bundleItemError);
          }
        }
      }
    }

    // Update stock for regular items
    for (const item of items) {
      await prisma.product.update({
        where: { id: item.productId },
        data: {
          availableStock: { decrement: item.quantity },
          inventoryUpdateReason: "NEW_ORDER",
          inventoryLogs: {
            push: `${new Date().toISOString()} | Removed ${item.quantity} units | Reason: NEW_ORDER | Order: ${orderId}`,
          },
        },
      });
    }

    // Update stock for bundle items
    for (const item of bundleOrderItems) {
      await prisma.product.update({
        where: { id: item.productId },
        data: {
          availableStock: { decrement: item.quantity },
          inventoryUpdateReason: "NEW_ORDER",
          inventoryLogs: {
            push: `${new Date().toISOString()} | Removed ${item.quantity} units | Reason: NEW_ORDER | Order: ${orderId}`,
          },
        },
      });
    }

    // Check updated products for stock alerts
    const updatedProducts = await prisma.product.findMany({
      where: {
        id: { in: itemsId },
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

    // Get the complete order with all relations for email
    const order = await prisma.order.findUnique({
      where: { id: newOrder.id },
      include: {
        orderItems: { include: { product: true } },
        bundleOrderItems: { include: { product: true } },
        bundles: { include: { items: { include: { product: true } } } },
      },
    });

    if (!order) {
      return NextResponse.json({ error: "Order created but could not be retrieved" }, { status: 500 });
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

    const clientEmail = session?.user?.email;

    if (!adminEmail) throw new Error("Missing admin email");

    const mail = await resend.emails.send({
      from: process.env.ENVIRONMENT === "development" ? process.env.FROM_EMAIL! : "orders@fitplaysolutions.com",
      to: [clientEmail, adminEmail],
      cc: [ownerEmail],
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
          <p><b>Required By:</b> ${new Date(order.requiredByDate).toLocaleDateString()}</p>

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
      await prisma.order.update({
        where: { id: orderId },
        data: { isMailSent: true },
      });

      // Create email history record
      await prisma.orderEmail.create({
        data: {
          orderId: order.id,
          purpose: "PENDING",
          isSent: true,
          sentAt: new Date(),
        },
      });
    }

    return NextResponse.json(order);
  } catch (error) {
    console.error("Error creating order:", error);
    // Log more detailed error information
    if (error instanceof Error) {
      console.error("Error message:", error.message);
      console.error("Error stack:", error.stack);
    }
    return NextResponse.json(
      { error: "Failed to create order", details: error instanceof Error ? error.message : "Unknown error" },
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
      return NextResponse.json(
        { error: "Order ID is required" },
        { status: 400 }
      );
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
                price: true,
              },
            },
          },
        },
        bundleOrderItems: {
          include: {
            bundle: true
          }
        },
      },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json(order);
  } catch (error) {
    console.error("Error fetching order:", error);
    return NextResponse.json(
      { error: "Failed to fetch order" },
      { status: 500 }
    );
  }
}
