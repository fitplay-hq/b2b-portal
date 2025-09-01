import { useMemo } from 'react';
import { Product } from '@/lib/generated/prisma';
import { PurchaseOrder, Client } from '@/lib/mockData';

interface DashboardData {
  products: Product[];
  orders: PurchaseOrder[];
  clients: Client[];
}

export function useDashboardMetrics({ products, orders, clients }: DashboardData) {
  return useMemo(() => {
    const totalOrders = orders.length;
    const pendingOrders = orders.filter((o) => o.status === 'pending').length;
    const approvedOrders = orders.filter((o) => o.status === 'approved').length;
    const completedOrders = orders.filter((o) => o.status === 'completed').length;

    const totalRevenue = orders
      .filter((o) => o.status !== 'cancelled')
      .reduce((sum, order) => sum + order.total, 0);

    const lowStockProducts = products.filter((p) => p.availableStock < 50).length;
    const activeClients = clients.filter((c) => c.status === 'active').length;

    const recentOrders = [...orders]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5);

    const completionRate = totalOrders > 0 ? (completedOrders / totalOrders) * 100 : 0;
    
    return {
      totalOrders,
      pendingOrders,
      approvedOrders,
      completedOrders,
      totalRevenue,
      lowStockProducts,
      activeClients,
      recentOrders,
      completionRate,
    };
  }, [products, orders, clients]);
}