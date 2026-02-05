import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "../../auth/[...nextauth]/route";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(auth);

    if (!session || !session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // get client info
    const client = await prisma.client.findUnique({
      where: { email: session.user.email },
      select: { id: true, companyID: true },
    });

    

   

    if (!client || !client.companyID) {
      return NextResponse.json(
        { error: "Client does not belong to any company" },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(req.url);
    const sortBy = searchParams.get("sortBy") || "name";
    const sortOrder = searchParams.get("sortOrder") || "asc";

    const allowedSortFields = ["name", "availableStock", "createdAt", "updatedAt"];
    const safeSortBy = allowedSortFields.includes(sortBy) ? sortBy : "name";
    const safeSortOrder = sortOrder === "desc" ? "desc" : "asc";

    // Get client with isShowPrice
    const clientWithPriceFlag = await prisma.client.findUnique({
      where: { email: session.user.email },
      select: { isShowPrice: true },
    });

    // Check if client has specific product assignments
    const clientProducts = await prisma.clientProduct.findMany({
      where: {
        clientId: client.id,
      },
      include: {
        product: {
          include: {
            companies: true,
            category: true,
            subCategory: true,
          },
        },
      },
      orderBy: {
        product: {
          [safeSortBy]: safeSortOrder,
        },
      },
    });

    let products;
    if (clientProducts && clientProducts.length > 0) {
      // Client has specific product assignments - use those
      products = clientProducts.map(cp => cp.product);
    } else {
      // Fallback to company-level products if no specific assignments
      products = await prisma.product.findMany({
        where: {
          companies: {
            some: {
              id: client.companyID,
            },
          },
        },
        include: {
          companies: true,
          category: true,
          subCategory: true,
        },
        orderBy: {
          [safeSortBy]: safeSortOrder,
        },
      });
    }

    // Conditionally include price based on client's isShowPrice setting
    const productsWithConditionalPrice = products.map(product => {
      if (clientWithPriceFlag?.isShowPrice) {
        return product;
      } else {
        // Remove price from response
        const { price, ...productWithoutPrice } = product;
        return productWithoutPrice;
      }
    });

    const response = NextResponse.json(productsWithConditionalPrice);
    
    // Add cache headers to prevent stale data
    response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
    return response;
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Something went wrong" },
      { status: 500 }
    );
  }
}
