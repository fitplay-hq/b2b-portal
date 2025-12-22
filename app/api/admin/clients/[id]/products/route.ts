import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const clientId = params.id;

    if (!clientId) {
      return NextResponse.json(
        { error: "Client ID is required" },
        { status: 400 }
      );
    }

    // Get client's current product assignments
    const clientProducts = await prisma.clientProduct.findMany({
      where: {
        clientId: clientId
      },
      include: {
        product: {
          include: {
            category: true
          }
        }
      }
    });

    // Get client's company to show available products
    const client = await prisma.client.findUnique({
      where: { id: clientId },
      include: {
        company: {
          include: {
            products: {
              include: {
                category: true
              }
            }
          }
        }
      }
    });

    if (!client || !client.company) {
      return NextResponse.json(
        { error: "Client or company not found" },
        { status: 404 }
      );
    }

    // Format response with assigned products and available products from company
    const assignedProducts = clientProducts.map(cp => cp.product);
    const availableProducts = client.company.products;
    const assignedProductIds = new Set(assignedProducts.map(p => p.id));

    return NextResponse.json({
      assignedProducts,
      availableProducts,
      assignedProductIds: Array.from(assignedProductIds),
      totalAssigned: assignedProducts.length,
      totalAvailable: availableProducts.length
    });

  } catch (error) {
    console.error("Error fetching client products:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const clientId = params.id;
    const { productIds, action } = await req.json();

    if (!clientId || !productIds || !Array.isArray(productIds) || !action) {
      return NextResponse.json(
        { error: "Client ID, product IDs array, and action are required" },
        { status: 400 }
      );
    }

    if (!["assign", "unassign"].includes(action)) {
      return NextResponse.json(
        { error: "Action must be either 'assign' or 'unassign'" },
        { status: 400 }
      );
    }

    // Verify client exists
    const client = await prisma.client.findUnique({
      where: { id: clientId }
    });

    if (!client) {
      return NextResponse.json(
        { error: "Client not found" },
        { status: 404 }
      );
    }

    if (action === "assign") {
      // Assign products to client
      const assignments = productIds.map(productId => ({
        clientId,
        productId,
        createdAt: new Date(),
        updatedAt: new Date()
      }));

      // Use createMany with skipDuplicates to handle existing relationships
      await prisma.clientProduct.createMany({
        data: assignments,
        skipDuplicates: true
      });

      return NextResponse.json({
        message: `Successfully assigned ${productIds.length} products to client`,
        assignedCount: productIds.length
      });

    } else if (action === "unassign") {
      // Remove products from client
      const deleteResult = await prisma.clientProduct.deleteMany({
        where: {
          clientId,
          productId: {
            in: productIds
          }
        }
      });

      return NextResponse.json({
        message: `Successfully removed ${deleteResult.count} products from client`,
        removedCount: deleteResult.count
      });
    }

  } catch (error) {
    console.error("Error managing client products:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const clientId = params.id;
    const { productIds } = await req.json();

    if (!clientId || !productIds || !Array.isArray(productIds)) {
      return NextResponse.json(
        { error: "Client ID and product IDs array are required" },
        { status: 400 }
      );
    }

    // Verify client exists
    const client = await prisma.client.findUnique({
      where: { id: clientId }
    });

    if (!client) {
      return NextResponse.json(
        { error: "Client not found" },
        { status: 404 }
      );
    }

    // Transaction to replace all client product assignments
    await prisma.$transaction(async (tx) => {
      // Remove all existing assignments
      await tx.clientProduct.deleteMany({
        where: { clientId }
      });

      // Add new assignments if any products provided
      if (productIds.length > 0) {
        const assignments = productIds.map(productId => ({
          clientId,
          productId,
          createdAt: new Date(),
          updatedAt: new Date()
        }));

        await tx.clientProduct.createMany({
          data: assignments
        });
      }
    });

    return NextResponse.json({
      message: `Successfully updated client product assignments`,
      assignedCount: productIds.length
    });

  } catch (error) {
    console.error("Error updating client products:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}