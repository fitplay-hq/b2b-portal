import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth-middleware';
import prisma from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Simple data check
    const orderCount = await prisma.order.count();
    const productCount = await prisma.product.count();
    const clientCount = await prisma.client.count();
    
    // Check orders by date ranges
    const now = new Date();
    const last30Days = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const last90Days = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
    
    const ordersLast30Days = await prisma.order.count({
      where: { createdAt: { gte: last30Days } }
    });
    
    const ordersLast90Days = await prisma.order.count({
      where: { createdAt: { gte: last90Days } }
    });
    
    // Sample orders (all time)
    const sampleOrders = await prisma.order.findMany({
      take: 5,
      include: {
        client: { select: { name: true } },
        orderItems: { 
          include: { 
            product: { select: { name: true } } 
          } 
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    // Sample products
    const sampleProducts = await prisma.product.findMany({
      take: 3,
      select: {
        name: true,
        price: true,
        availableStock: true,
        categories: true
      }
    });

    return NextResponse.json({
      counts: {
        orders: orderCount,
        products: productCount,
        clients: clientCount,
        ordersLast30Days,
        ordersLast90Days
      },
      dateRanges: {
        now: now.toISOString(),
        last30Days: last30Days.toISOString(),
        last90Days: last90Days.toISOString()
      },
      sampleOrders: sampleOrders.map(order => ({
        id: order.id,
        totalAmount: order.totalAmount,
        status: order.status,
        clientName: order.client?.name,
        itemsCount: order.orderItems.length,
        createdAt: order.createdAt
      })),
      sampleProducts
    });

  } catch (error) {
    console.error('Debug API Error:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}