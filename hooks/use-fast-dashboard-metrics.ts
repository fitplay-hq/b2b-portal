import { useMemo } from 'react';
import { useFastDashboardData } from './use-fast-dashboard-data';

export function useFastDashboardMetrics() {
  const { data, isLoading, error } = useFastDashboardData();
  const { orders, products, clients } = data;

  return useMemo(() => {
    if (isLoading || error) {
      return {
        metrics: null,
        isLoading,
        error
      };
    }

    const totalOrders = orders.length;
    const pendingOrders = orders.filter((o: any) => o.status === 'PENDING').length;
    const approvedOrders = orders.filter((o: any) => o.status === 'APPROVED').length;
    const rejectedOrders = orders.filter((o: any) => o.status === 'CANCELLED').length;

    const totalProducts = products.length;
    const lowStockProducts = products.filter((p: any) => 
      p.minStockThreshold && p.availableStock <= p.minStockThreshold && p.availableStock > 0
    ).length;
    const activeClients = clients.length;

    // Get recent orders (already sorted by createdAt desc in API)
    const recentOrders = orders.slice(0, 5);

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
        allOrders: orders, // For chart calculations
      },
      isLoading,
      error
    };
  }, [data, isLoading, error, orders, products, clients]);
}