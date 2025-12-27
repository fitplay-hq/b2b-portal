import { NextRequest, NextResponse } from "next/server";
import { withPermissions } from "@/lib/auth-middleware";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  return withPermissions(req, async () => {
    try {
      const resolvedParams = await params;
      const clientId = resolvedParams.id;

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

      // Get all available products (not just company products)
      const allAvailableProducts = await prisma.product.findMany({
        include: {
          category: true
        }
      });

      // Format response with assigned products and available products
      const assignedProducts = clientProducts.map(cp => cp.product);
      const companyProducts = client.company.products;
      const assignedProductIds = new Set(assignedProducts.map(p => p.id));

      return NextResponse.json({
        assignedProducts, // Client-specific products only
        companyProducts, // Products assigned to the company level
        availableProducts: allAvailableProducts, // All products that can be assigned
        assignedProductIds: Array.from(assignedProductIds),
        totalAssigned: assignedProducts.length,
        totalCompanyProducts: companyProducts.length,
        totalAvailable: allAvailableProducts.length,
        // Clear separation: assignedProducts are ONLY for this client
        // companyProducts are shared across all clients in the company
      });

    } catch (error) {
      console.error("Error fetching client products:", error);
      return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 }
      );
    }
  }, "clients", "view");
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  return withPermissions(req, async () => {
    try {
      const resolvedParams = await params;
      const clientId = resolvedParams.id;
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
        console.log(`[ClientProducts] Assigning products to client ${clientId}:`, productIds);
        
        // Get client's company
        const clientWithCompany = await prisma.client.findUnique({
          where: { id: clientId },
          include: { company: true }
        });

        if (!clientWithCompany?.company) {
          return NextResponse.json(
            { error: "Client must be associated with a company" },
            { status: 400 }
          );
        }

        console.log(`[ClientProducts] Client found with company: ${clientWithCompany.company.name}`);

        // FIXED: Only assign products to client, NOT to company
        // Client-specific products should remain client-specific
        const clientAssignments = productIds.map(productId => ({
          clientId,
          productId,
          createdAt: new Date(),
          updatedAt: new Date()
        }));

        console.log(`[ClientProducts] Creating assignments:`, clientAssignments);

        // Use createMany with skipDuplicates to handle existing relationships
        const createResult = await prisma.clientProduct.createMany({
          data: clientAssignments,
          skipDuplicates: true
        });

        console.log(`[ClientProducts] Assignment result:`, createResult);

        return NextResponse.json({
          message: `Successfully assigned ${productIds.length} products to client only`,
          assignedCount: productIds.length,
          actuallyCreated: createResult.count
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
  }, "clients", "update");
}