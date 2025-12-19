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

export async function PATCH(req: NextRequest) {
  try {
    const session = await getServerSession(auth);

    if (!session || !session?.user || session?.user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { productId, quantity, reason, direction, remarks } = body;
    // direction: 1 for addition, -1 for subtraction

    if (!productId || typeof quantity !== "number" || quantity < 0 || !reason || typeof direction !== "number") {
      return NextResponse.json(
        { error: "Invalid product ID, quantity or reason" },
        { status: 400 }
      );
    }

    const product = await prisma.product.findUnique({
      where: { id: productId },
      select: { availableStock: true },
    });

    if (!product) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    const newStock = direction === 1
      ? product.availableStock + quantity
      : product.availableStock - quantity;

    // Construct inventory log entry
    const logEntry = `${new Date().toISOString()} | ${direction === 1 ? "Added" : "Removed"} ${quantity} units | Reason: ${reason} | Updated stock: ${newStock} | Remarks: ${remarks || "N/A"}`;

    // Update product inventory + log reason
    const productData = await prisma.product.update({
      where: { id: productId },
      data: {
        availableStock:
          direction === 1
            ? { increment: quantity }
            : { decrement: quantity },
        inventoryUpdateReason: reason,
        inventoryLogs: { push: logEntry }, // 👈 add this line to push logs
      },
      select: {
        name: true,
        availableStock: true,
        minStockThreshold: true,
      },
    });

    const adminEmail = process.env.ADMIN_EMAIL || "";
    const ownerEmail = process.env.OWNER_EMAIL || "vaibhav@fitplaysolutions.com";
    if (productData.minStockThreshold) {
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

    return NextResponse.json(
      {
        data: productData,
        message: "Product inventory updated successfully",
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        error:
          error.message ||
          "Something went wrong, couldn't update stocks",
      },
      { status: 500 }
    );
  }
}


// get inventory logs for a product
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(auth);

    if (!session || !session?.user || session?.user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const productId = req.nextUrl.searchParams.get("productId");

    if (!productId) {
      return NextResponse.json(
        { error: "Product ID is required" },
        { status: 400 }
      );
    }

    const product = await prisma.product.findUnique({
      where: { id: productId },
      select: {
        inventoryLogs: true,
        availableStock: true,
      },
    });

    if (!product) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      inventoryLogs: product.inventoryLogs,
      availableStock: product.availableStock,
    }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      {
        error:
          error.message ||
          "Something went wrong, couldn't fetch inventory logs",
      },
      { status: 500 }
    );
  }
}