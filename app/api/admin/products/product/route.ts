import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { withPermissions } from "@/lib/auth-middleware";

import {
  ProductCreateInputObjectSchema,
  ProductUpdateInputObjectSchema,
} from "@/prisma/generated/schemas";

export async function GET(req: NextRequest) {
  return withPermissions(req, async () => {
    try {
      const id = req.nextUrl.searchParams.get("id");
      if (!id) {
        return NextResponse.json(
          { error: "Invalid Product ID" },
          { status: 400 },
        );
      }
      const product = await prisma.product.findUnique({
        where: { id: id },
      });
      if (!product) {
        return NextResponse.json({ error: "Product not found" }, { status: 404 });
      }
      return NextResponse.json(product);
    } catch (error: unknown) {
      return NextResponse.json(
        { error: (error as Error).message || "Something went wrong" },
        { status: 500 },
      );
    }
  }, "products", "view");
}

export async function POST(req: NextRequest) {
  return withPermissions(req, async () => {
    try {
      const body = await req.json();
      const result = ProductCreateInputObjectSchema.safeParse(body);

      if (!result.success) {
        return NextResponse.json(
          { error: result.error.format() },
          { status: 400 },
        );
      }

      // Create initial inventory log entry for the starting stock
      const initialStock = result.data.availableStock || 0;
      const initialLogEntry = initialStock > 0 
        ? `${new Date().toISOString()} | Added ${initialStock} units | Reason: NEW_PURCHASE`
        : null;

      const product = await prisma.product.create({
        data: {
          ...result.data,
          inventoryLogs: initialLogEntry ? [initialLogEntry] : [],
        },
      });

      return NextResponse.json(product, { status: 201 });
    } catch (error: unknown) {
      return NextResponse.json(
        { error: (error as Error).message || "Something went wrong" },
        { status: 500 },
      );
    }
  }, "products", "create");
}

export async function PATCH(req: NextRequest) {
  return withPermissions(req, async () => {
    try {
      const body = await req.json();
      const result = ProductUpdateInputObjectSchema.safeParse(body);

      if (!result.success) {
        return NextResponse.json(
          { error: result.error.format() },
          { status: 400 },
        );
      }

      if (!result.data.id) {
        return NextResponse.json(
          { error: "product ID not supplied" },
          { status: 400 }
        )
      }

      const product = await prisma.product.update({
        where: { id: result.data.id.toString() },
        data: result.data,
      });

      return NextResponse.json(product);
    } catch (error: unknown) {
      return NextResponse.json(
        { error: (error as Error).message || "Something went wrong" },
        { status: 500 },
      );
    }
  }, "products", "edit");
}

export async function DELETE(req: NextRequest) {
  return withPermissions(req, async () => {
    try {
      const id = req.nextUrl.searchParams.get("id");
      if (!id) {
        return NextResponse.json(
          { error: "Invalid Product ID" },
          { status: 400 },
        );
      }

      await prisma.product.delete({
        where: { id: id },
      });

      return NextResponse.json({ message: "Product deleted successfully" });
    } catch (error: unknown) {
      return NextResponse.json(
        { error: (error as Error).message || "Something went wrong" },
        { status: 500 },
      );
    }
  }, "products", "delete");
}
