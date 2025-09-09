import { useMemo } from 'react';
import { Product } from '@/lib/generated/prisma';
import { PurchaseOrder, Client } from '@/lib/mockData';
import { useDashboardData } from './use-dashboard-data';

export function useDashboardMetrics() {
  const { data, isLoading, error } = useDashboardData();

  const { orders, products, clients } = data

  return useMemo(() => {
    if (isLoading || error) {
      return {
        data: null,
        isLoading,
        error
      }
    }

    const totalOrders = orders.length;
    const pendingOrders = orders.filter((o) => o.status === 'PENDING').length;
    const approvedOrders = orders.filter((o) => o.status === 'APPROVED').length;
    const rejectedOrders = orders.filter((o) => o.status === 'CANCELLED').length;

    const totalProducts = products.length;

    const lowStockProducts = products.filter((p) => p.availableStock < 50).length;
    const activeClients = clients.length;

    const recentOrders = [...orders]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5);

    const completionRate = totalOrders > 0 ? (approvedOrders / totalOrders) * 100 : 0;
    
    return {
      metrics: {
        totalOrders,
        pendingOrders,
        approvedOrders,
        rejectedOrders,
        totalProducts,
        lowStockProducts,
        activeClients,
        recentOrders,
        completionRate,
      },
      isLoading,
      error
    };
  }, [products, orders, clients]);
}