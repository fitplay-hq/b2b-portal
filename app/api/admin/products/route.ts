// app/api/products/bulk/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { v4 as uuidv4 } from "uuid";
import { Prisma, Product } from "@/lib/generated/prisma";
import { checkPermission } from "@/lib/auth-middleware";
import { RESOURCES } from "@/lib/utils";
import { Resend } from "resend";

const resendApiKey = process.env.RESEND_API_KEY;

if (!resendApiKey) {
  throw new Error("Missing Resend API key");
}

const resend = new Resend(resendApiKey);

// Import the auto-generated Zod schema
import z from "zod";
import { ProductCreateInputObjectSchema } from "@/lib/generated/zod/schemas/objects";
const InventoryUpdateSchema = z.object({
  productId: z.string().uuid(),
  quantity: z.number().positive(),
  direction: z.enum(["incr", "dec"]),
  inventoryUpdateReason: z.enum(["NEW_PURCHASE", "PHYSICAL_STOCK_CHECK", "RETURN_FROM_PREVIOUS_DISPATCH", "NEW_ORDER"]),
  remarks: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    // Check permissions
    const permissionCheck = await checkPermission(RESOURCES.PRODUCTS, 'create');
    if (!permissionCheck.success) {
      return NextResponse.json(
        { error: permissionCheck.error },
        { status: permissionCheck.error === 'Authentication required' ? 401 : 403 }
      );
    }

    const body = await req.json();

    if (!Array.isArray(body)) {
      return NextResponse.json(
        { error: "Expected an array of products" },
        { status: 400 },
      );
    }

    // ✅ Validate each product with the Zod schema
    const parsedProducts = body.map((p, idx) => {
      const result = ProductCreateInputObjectSchema.safeParse(p);
      if (!result.success) {
        throw new Error(
          `Validation error in product at index ${idx}: ${JSON.stringify(
            result.error.format(),
          )}`,
        );
      }
      return result.data;
    });

    const productsData: Prisma.ProductCreateInput[] = parsedProducts.map((p) => {
      const initialStock = p.availableStock || 0;
      const initialLogEntry = initialStock > 0
        ? `${new Date().toISOString()} | Added ${initialStock} units | Reason: NEW_PURCHASE | Updated stock: ${initialStock}`
        : null;

      return {
        id: uuidv4(),
        ...p, // ✅ Spread validated product data
        inventoryLogs: initialLogEntry ? [initialLogEntry] : [],
      };
    });

    const products = await prisma.product.createMany({
      data: productsData,
      skipDuplicates: true, // skips if same sku already exists
    });

    return NextResponse.json(
      { message: "Products added successfully", count: products.count },
      { status: 201 },
    );
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Something went wrong";
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 },
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    // Check permissions
    const permissionCheck = await checkPermission(RESOURCES.PRODUCTS, 'view');
    if (!permissionCheck.success) {
      return NextResponse.json(
        { error: permissionCheck.error },
        { status: permissionCheck.error === 'Authentication required' ? 401 : 403 }
      );
    }

    const { searchParams } = new URL(req.url);
    const sortBy = searchParams.get("sortBy") || "name";
    const sortOrder = searchParams.get("sortOrder") || "asc";

    // Define allowed sort fields for security
    const allowedSortFields = ["name", "availableStock", "createdAt", "updatedAt"];
    const safeSortBy = allowedSortFields.includes(sortBy) ? sortBy : "name";
    const safeSortOrder = sortOrder === "desc" ? "desc" : "asc";

    const products = await prisma.product.findMany({
      include: {
        companies: true,
        category: true, // Include the category relationship
      },
      orderBy: {
        [safeSortBy]: safeSortOrder,
      },
    });

    return NextResponse.json(products);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Something went wrong";
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 },
    );
  }
}


// api for bulk inventory update
export async function PATCH(req: NextRequest) {
  try {
    // Check permissions
    const permissionCheck = await checkPermission(RESOURCES.PRODUCTS, "update");
    if (!permissionCheck.success) {
      return NextResponse.json(
        { error: permissionCheck.error },
        {
          status:
            permissionCheck.error === "Authentication required" ? 401 : 403,
        }
      );
    }

    const body = await req.json();

    if (!Array.isArray(body)) {
      return NextResponse.json(
        { error: "Expected an array of inventory updates" },
        { status: 400 }
      );
    }

    const updates = body.map((p, idx) => {
      const result = InventoryUpdateSchema.safeParse(p);
      if (!result.success) {
        throw new Error(
          `Validation error at index ${idx}: ${JSON.stringify(
            result.error.format()
          )}`
        );
      }
      return result.data;
    });

    const updatedProducts = await Promise.all(
      updates.map(async ({ productId, quantity, direction, inventoryUpdateReason, remarks }) => {

        const product = await prisma.product.findUnique({
          where: { id: productId },
          select: {
            availableStock: true,
            minStockThreshold: true,
            name: true
          },
        });

        if (!product) {
          throw new Error(`Product with ID ${productId} not found`);
        }

        const newStock = direction === "incr"
          ? product.availableStock + quantity
          : product.availableStock - quantity;
        // Create a log entry for this update
        const logEntry = `${new Date().toISOString()} | ${direction === "incr" ? "Added" : "Removed"
          } ${quantity} units | Reason: ${inventoryUpdateReason} | Updated stock: ${newStock} | Remarks: ${remarks || "N/A"}`; // Then work on client side APIs for remarks and minStock threshold
        // Update the product inventory and push the log
        return await prisma.product.update({
          where: { id: productId },
          data: {
            availableStock: {
              [direction === "incr" ? "increment" : "decrement"]: quantity,
            },
            inventoryUpdateReason: inventoryUpdateReason,
            inventoryLogs: { push: logEntry }, // 👈 new line to store logs
          },
          select: {
            name: true,
            availableStock: true,
            minStockThreshold: true,
          },
        });
      })
    );

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

  return NextResponse.json(
      {
        success: true,
        updatedProducts,
        message:
          "Inventories of the listed products updated successfully",
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Something went wrong";
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
