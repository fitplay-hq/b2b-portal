import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { auth } from '@/app/api/auth/[...nextauth]/route';
import prisma from '@/lib/prisma';
import { hasPermission } from '@/lib/utils';
import { RESOURCES, PERMISSIONS } from '@/lib/utils';

/**
 * GET /api/admin/analytics
 * Get analytics data with filtering and date range support
 */
export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(auth);

        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Allow all authenticated users to access analytics for now
        // TODO: Re-implement proper permission checks later
        console.log('✅ Analytics API - User authenticated:', {
            role: session.user.role,
            id: session.user.id
        });

        const { searchParams } = new URL(request.url);
        const dateFrom = searchParams.get('dateFrom');
        const dateTo = searchParams.get('dateTo');
        const clientId = searchParams.get('clientId');
        const status = searchParams.get('status');
        const period = searchParams.get('period') || '30d'; // Default to 30 days
        const inventoryCategoryId = searchParams.get('categoryId');
        const stockStatus = searchParams.get('stockStatus');
        // IN_STOCK | LOW_STOCK | OUT_OF_STOCK


        let companyId;

        // Build date filter
        const dateFilter: { gte?: Date; lte?: Date } = {};
        if (dateFrom) {
            dateFilter.gte = new Date(dateFrom);
        }
        if (dateTo) {
            dateFilter.lte = new Date(dateTo);
        }

        // If no specific dates, use period
        if (!dateFrom && !dateTo) {
            const now = new Date();
            const daysBack = period === '7d' ? 7 : period === '30d' ? 30 : period === '90d' ? 90 : 30;
            dateFilter.gte = new Date(now.getTime() - daysBack * 24 * 60 * 60 * 1000);
            console.log(`Using ${daysBack} day filter from:`, dateFilter.gte);
        }

        // Build order filters
        const orderFilters: any = {
            createdAt: dateFilter,
            clientId: session.user.role === 'CLIENT' ? session.user.id : undefined
        };

        if (clientId) {
            orderFilters.clientId = clientId;
        }
        if (status) {
            orderFilters.status = status;
        }

        if (session.user.role === 'CLIENT') {
            const client = await prisma.client.findUnique({
                where: { id: session.user.id },
                select: { companyID: true }
            });
            companyId = client?.companyID;
            orderFilters.client = {
                companyID: companyId
            };
        }

        // Get orders data
        const orders = await prisma.order.findMany({
            where: orderFilters,
            include: {
                client: {
                    select: { id: true, name: true }
                },
                orderItems: {
                    include: {
                        product: {
                            select: {
                                id: true,
                                name: true,
                                category: { select: { displayName: true } }
                            }
                        }
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        });

        // Debug logging (temporarily disabled)
        // console.log('Analytics API Debug:', { orderCount: orders.length, dateFilter });

        // Get inventory data
        const inventoryWhere: any = {
            createdAt: dateFilter,
        };

        if (inventoryCategoryId) {
            inventoryWhere.categoryId = inventoryCategoryId;
        }

        if (session.user.role === 'CLIENT') {
            inventoryWhere.OR = [
                // Company products
                companyId
                    ? {
                        companies: {
                            some: { id: companyId }
                        }
                    }
                    : undefined,

                // Client-specific products
                {
                    clients: {
                        some: {
                            clientId: session.user.id
                        }
                    }
                }
            ].filter(Boolean);
        }



        const inventory = await prisma.product.findMany({
            where: inventoryWhere,
            include: {
                category: {
                    select: { id: true, name: true, displayName: true }
                },
                companies: {
                    select: { id: true, name: true }
                }
            }
        });

        const filteredInventory = inventory.filter(product => {
            const threshold = product.minStockThreshold;

            if (stockStatus === 'OUT_OF_STOCK') {
                return product.availableStock === 0;
            }

            if (stockStatus === 'LOW_STOCK') {
                return threshold !== null &&
                    product.availableStock > 0 &&
                    product.availableStock < threshold;
            }

            if (stockStatus === 'IN_STOCK') {
                return threshold === null ||
                    product.availableStock > threshold;
            }

            return true;
        });



        // console.log('Inventory found:', inventory.length);

        // Calculate analytics metrics
        const analytics = {
            overview: {
                totalOrders: orders.length,
                totalRevenue: orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0),
                averageOrderValue: orders.length > 0
                    ? orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0) / orders.length
                    : 0,
                totalProducts: filteredInventory.length,

                lowStockProducts: filteredInventory.filter(p =>
                    p.minStockThreshold !== null &&
                    p.availableStock > 0 &&
                    p.availableStock < p.minStockThreshold
                ).length,

            },

            // Orders by status
            ordersByStatus: orders.reduce((acc: Record<string, number>, order) => {
                acc[order.status] = (acc[order.status] || 0) + 1;
                return acc;
            }, {}),

            // Revenue over time (daily)
            revenueOverTime: session.user.role !== 'CLIENT' ? generateTimeSeriesData(orders as any) : [],

            // Top clients by revenue

            topClients: session.user.role !== 'CLIENT' ? getTopClients(orders as any) : [],

            // Top products by quantity sold
            topProducts: getTopProducts(orders as any),

            // Inventory status
            inventoryStatus: {
                inStock: filteredInventory.filter(p =>
                    p.minStockThreshold === null ||
                    p.availableStock > p.minStockThreshold
                ).length,

                lowStock: filteredInventory.filter(p =>
                    p.minStockThreshold !== null &&
                    p.availableStock > 0 &&
                    p.availableStock < p.minStockThreshold
                ).length,

                outOfStock: filteredInventory.filter(p =>
                    p.availableStock === 0
                ).length,
            },


            // Category distribution
            categoryDistribution: filteredInventory.reduce(
                (acc: Record<string, number>, product) => {
                    const categoryName = product.category?.displayName || 'UNCATEGORIZED';
                    acc[categoryName] = (acc[categoryName] || 0) + 1;
                    return acc;
                },
                {}
            ),


            // Raw data for exports
            rawData: {
                orders: (orders as any).map((order: any) => ({
                    id: order.id,
                    clientName: order.client?.name,
                    status: order.status,
                    totalAmount: order.totalAmount,
                    createdAt: order.createdAt,
                    itemCount: order.orderItems?.length || 0,
                })),
                inventory: filteredInventory.map(product => ({
                    id: product.id,
                    name: product.name,
                    category: product.category?.displayName || null,
                    stockQuantity: product.availableStock,
                    unitPrice: product.price,
                    companyNames: product.companies.map(c => c.name).join(', '),
                }))

            }
        };

        return NextResponse.json(analytics);

    } catch (err) {
        console.error("Analytics™ ERROR:", err);
        return NextResponse.json({ error: String(err), message: "Failed to get analytics data" }, { status: 500, });
    }
}

/**
 * Generate time series data for revenue over time
 */
function generateTimeSeriesData(orders: { createdAt: Date; totalAmount: number }[]) {
    const dailyRevenue: { [key: string]: number } = {};

    orders.forEach(order => {
        const date = new Date(order.createdAt).toISOString().split('T')[0];
        dailyRevenue[date] = (dailyRevenue[date] || 0) + (order.totalAmount || 0);
    });

    // Convert to array format expected by charts
    return Object.entries(dailyRevenue)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([date, revenue]) => ({
            date,
            revenue,
            formattedDate: new Date(date).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric'
            })
        }));
}

/**
 * Get top clients by revenue
 */
function getTopClients(orders: { client: { id: string; name: string } | null; totalAmount: number }[]) {
    const clientRevenue: { [key: string]: { name: string; revenue: number; orderCount: number } } = {};

    orders.forEach(order => {
        if (order.client) {
            const clientId = order.client.id;
            if (!clientRevenue[clientId]) {
                clientRevenue[clientId] = {
                    name: order.client.name,
                    revenue: 0,
                    orderCount: 0
                };
            }
            clientRevenue[clientId].revenue += order.totalAmount || 0;
            clientRevenue[clientId].orderCount += 1;
        }
    });

    return Object.values(clientRevenue)
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 10);
}

/**
 * Get top products by quantity sold
 */
function getTopProducts(orders: { orderItems: { product: { id: string; name: string }; quantity: number; price: number }[] }[]) {
    const productSales: { [key: string]: { name: string; quantity: number; revenue: number } } = {};

    orders.forEach(order => {
        order.orderItems.forEach((item) => {
            if (item.product) {
                const productId = item.product.id;
                if (!productSales[productId]) {
                    productSales[productId] = {
                        name: item.product.name,
                        quantity: 0,
                        revenue: 0
                    };
                }
                productSales[productId].quantity += item.quantity;
                productSales[productId].revenue += (item.quantity * item.price);
            }
        });
    });

    return Object.values(productSales)
        .sort((a, b) => b.quantity - a.quantity)
        .slice(0, 10);
}