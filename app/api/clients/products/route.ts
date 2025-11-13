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
      select: { companyID: true },
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

    const products = await prisma.product.findMany({
      include: {
        category: true, // Include the category relationship
        companies: true, // Keep existing includes
      },
      where: {
        companies: {
          some: {
            id: client.companyID,
          },
        },
      },
      orderBy: {
        [safeSortBy]: safeSortOrder,
      },
    });

    // Conditionally include price based on client's isShowPrice setting
    const productsWithConditionalPrice = products.map(product => {
      if (clientWithPriceFlag?.isShowPrice) {
        return product;
      } else {
        // Remove price from response
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { price, ...productWithoutPrice } = product;
        return productWithoutPrice;
      }
    });

    return NextResponse.json(productsWithConditionalPrice);
  } catch (error: unknown) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Something went wrong" },
      { status: 500 }
    );
  }
}
