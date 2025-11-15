import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { withPermissions } from "@/lib/auth-middleware";

export async function PATCH(req: NextRequest) {
  return withPermissions(req, async (req) => {
    try {

    const body = await req.json();
    const { productId, quantity, reason, direction } = body;
    // direction: 1 for addition, -1 for subtraction

    if (!productId || typeof quantity !== "number" || quantity < 0 || !reason || typeof direction !== "number") {
      return NextResponse.json(
        { error: "Invalid product ID, quantity or reason" },
        { status: 400 }
      );
    }

    // Construct inventory log entry
    const logEntry = `${new Date().toISOString()} | ${direction === 1 ? "Added" : "Removed"} ${quantity} units | Reason: ${reason}`;

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
    });

    return NextResponse.json(
      {
        data: productData,
        message: "Product inventory updated successfully",
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    return NextResponse.json(
      {
        error:
          (error as Error).message ||
          "Something went wrong, couldn't update stocks",
      },
      { status: 500 }
    );
  }
  }, "products", "edit");
}


// get inventory logs for a product
export async function GET(req: NextRequest) {
  return withPermissions(req, async (req) => {
    try {

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
  } catch (error: unknown) {
    return NextResponse.json(
      {
        error:
          (error as Error).message ||
          "Something went wrong, couldn't fetch inventory logs",
      },
      { status: 500 }
    );
  }
  }, "products", "view");
}