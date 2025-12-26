import { auth } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

// POST - Assign products to a company
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(auth);
    if (!session || (session.user?.role !== "ADMIN" && session.user?.role !== "SYSTEM_USER"))
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { companyId, productIds } = await req.json();

    if (!companyId || !Array.isArray(productIds) || productIds.length === 0)
      return NextResponse.json({ error: "companyId and productIds are required" }, { status: 400 });

    // Validate that company exists
    const company = await prisma.company.findUnique({
      where: { id: companyId }
    });

    if (!company) {
      return NextResponse.json({ error: "Company not found" }, { status: 404 });
    }

    // Validate that all products exist
    const existingProducts = await prisma.product.findMany({
      where: {
        id: { in: productIds }
      },
      select: { id: true }
    });

    const existingProductIds = existingProducts.map(p => p.id);
    const invalidProductIds = productIds.filter(id => !existingProductIds.includes(id));

    if (invalidProductIds.length > 0) {
      return NextResponse.json({
        error: `Invalid product IDs: ${invalidProductIds.join(', ')}`
      }, { status: 400 });
    }

    const updatedCompany = await prisma.company.update({
      where: { id: companyId },
      data: {
        products: {
          connect: productIds.map((id: string) => ({ id }))
        }
      },
      include: { products: true }
    });

    return NextResponse.json({
      data: updatedCompany,
      message: `Successfully assigned ${productIds.length} product(s) to company`
    });
  } catch (err: any) {
    console.error("Error assigning products to company:", err);
    return NextResponse.json({ error: err.message || "Failed to assign products to company" }, { status: 500 });
  }
}
export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(auth);
    if (!session || (session.user?.role !== "ADMIN" && session.user?.role !== "SYSTEM_USER"))
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // Check if this is a removeAll request (JSON body) or specific product removal (query params)
    const contentType = req.headers.get("content-type");
    const isRemoveAll = contentType?.includes("application/json");

    let companyId: string;
    let productIds: string[] = [];
    let removeAll = false;

    if (isRemoveAll) {
      // Handle removeAll request
      const body = await req.json();
      companyId = body.companyId;
      removeAll = body.removeAll || false;
    } else {
      // Handle specific product removal
      companyId = req.nextUrl.searchParams.get("companyId") || "";
      productIds = req.nextUrl.searchParams.getAll("productIds");
    }

    if (!companyId)
      return NextResponse.json({ error: "companyId is required" }, { status: 400 });

    // Validate that company exists
    const company = await prisma.company.findUnique({
      where: { id: companyId },
      include: { products: true }
    });

    if (!company) {
      return NextResponse.json({ error: "Company not found" }, { status: 404 });
    }

    let updatedCompany;
    let message = "";

    if (removeAll) {
      // Remove all products from company
      updatedCompany = await prisma.company.update({
        where: { id: companyId },
        data: {
          products: {
            set: [] // This removes all product connections
          }
        },
        include: { products: true }
      });

      // Get the count of products that were removed
      const initialProductCount = company.products?.length || 0;
      message = `Successfully removed all ${initialProductCount} product(s) from company`;
    } else {
      // Remove specific products
      if (productIds.length === 0)
        return NextResponse.json({ error: "productIds are required for specific removal" }, { status: 400 });

      // Validate that all products exist
      const existingProducts = await prisma.product.findMany({
        where: {
          id: { in: productIds }
        },
        select: { id: true }
      });

      const existingProductIds = existingProducts.map(p => p.id);
      const validProductIds = productIds.filter(id => existingProductIds.includes(id));
      const invalidProductIds = productIds.filter(id => !existingProductIds.includes(id));

      // If some products don't exist, we'll still try to disconnect the valid ones
      // but warn about the invalid ones
      if (invalidProductIds.length > 0) {
        console.warn(`Attempted to disconnect non-existent products: ${invalidProductIds.join(', ')}`);
      }

      if (validProductIds.length === 0) {
        return NextResponse.json({
          error: "None of the specified products exist"
        }, { status: 400 });
      }

      updatedCompany = await prisma.company.update({
        where: { id: companyId },
        data: {
          products: {
            disconnect: validProductIds.map((id) => ({ id }))
          }
        },
        include: { products: true }
      });

      message = validProductIds.length === productIds.length
        ? `Successfully removed ${validProductIds.length} product(s) from company`
        : `Successfully removed ${validProductIds.length} product(s) from company. ${invalidProductIds.length} product(s) were not found.`;
    }

    return NextResponse.json({
      data: updatedCompany,
      message,
      removedAll: removeAll
    });
  } catch (err: any) {
    console.error("Error removing products from company:", err);
    return NextResponse.json({ error: err.message || "Failed to remove products from company" }, { status: 500 });
  }
}

// GET - Get all products of a company
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(auth);
    if (!session || (session.user?.role !== "ADMIN" && session.user?.role !== "SYSTEM_USER"))
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const companyId = req.nextUrl.searchParams.get("companyId");
    if (!companyId)
      return NextResponse.json({ error: "companyId is required" }, { status: 400 });

    const company = await prisma.company.findUnique({
      where: { id: companyId },
      include: {
        products: {
          orderBy: { name: 'asc' }
        }
      }
    });

    if (!company)
      return NextResponse.json({ error: "Company not found" }, { status: 404 });

    return NextResponse.json({
      data: company.products,
      message: `Found ${company.products.length} product(s) for company`
    });
  } catch (err: any) {
    console.error("Error fetching company products:", err);
    return NextResponse.json({ error: err.message || "Failed to fetch company products" }, { status: 500 });
  }
}
