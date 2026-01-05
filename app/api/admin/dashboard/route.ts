import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { auth } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession(auth);
    
    if (!session?.user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    // Get user permissions from session
    const userPermissions = session.user.permissions || [];
    const isAdmin = session.user.role === 'ADMIN';
    const isSystemAdmin = session.user.role === 'SYSTEM_USER' && 
                         session.user.systemRole?.toLowerCase().includes('admin');
    const hasAdminRights = isAdmin || isSystemAdmin;

    // Helper to check if user has access to a resource
    const hasAccess = (resource: string) => {
      if (hasAdminRights) return true;
      return userPermissions.some((p: any) => 
        p.resource?.toLowerCase() === resource.toLowerCase() && 
        ['view', 'read', 'access'].includes(p.action?.toLowerCase() || '')
      );
    };

    // Fetch data in parallel for maximum speed
    const [products, orders, clients] = await Promise.all([
      // Products
      hasAccess('products') ? prisma.product.findMany({
        select: {
          id: true,
          name: true,
          availableStock: true,
          createdAt: true,
          updatedAt: true,
        },
        orderBy: {
          name: 'asc'
        }
      }) : Promise.resolve([]),
      
      // Orders  
      hasAccess('orders') ? prisma.order.findMany({
        select: {
          id: true,
          status: true,
          createdAt: true,
          updatedAt: true,
          client: {
            select: {
              id: true,
              name: true,
              companyName: true,
              company: {
                select: {
                  name: true
                }
              }
            }
          },
          orderItems: {
            select: {
              quantity: true,
              product: {
                select: {
                  name: true
                }
              }
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        },
        take: 50 // Limit for dashboard performance
      }) : Promise.resolve([]),
      
      // Clients
      hasAccess('clients') ? prisma.client.findMany({
        select: {
          id: true,
          name: true,
          email: true,
          companyName: true,
          createdAt: true,
          company: {
            select: {
              name: true
            }
          }
        },
        orderBy: {
          name: 'asc'
        }
      }) : Promise.resolve([])
    ]);

    return NextResponse.json({
      products,
      orders,
      clients,
      permissions: {
        products: hasAccess('products'),
        orders: hasAccess('orders'),
        clients: hasAccess('clients'),
        companies: hasAccess('companies'),
        inventory: hasAccess('inventory'),
      }
    });

  } catch (error) {
    console.error("Dashboard API Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch dashboard data" },
      { status: 500 }
    );
  }
}