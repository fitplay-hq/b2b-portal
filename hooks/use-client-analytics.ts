import { useMemo } from 'react';
import { useOrders } from '@/data/order/client.hooks';
import { useProducts } from '@/data/product/client.hooks';

export function useClientAnalytics() {
  const { orders, isLoading: ordersLoading, error: ordersError } = useOrders();
  const { products, isLoading: productsLoading, error: productsError } = useProducts();

  return useMemo(() => {
    const isLoading = ordersLoading || productsLoading;
    const error = ordersError || productsError;

    if (isLoading || error) {
      return {
        data: null,
        isLoading,
        error
      };
    }

    // Order Analytics
    const totalOrders = orders?.length || 0;
    const pendingOrders = orders?.filter((o) => o.status === 'PENDING').length || 0;
    const approvedOrders = orders?.filter((o) => o.status === 'APPROVED').length || 0;
    const deliveredOrders = orders?.filter((o) => o.status === 'DELIVERED').length || 0;
    const dispatchedOrders = orders?.filter((o) => o.status === 'DISPATCHED').length || 0;
    const cancelledOrders = orders?.filter((o) => o.status === 'CANCELLED' || o.status === 'REJECTED').length || 0;

    // Product Analytics
    const totalProducts = products?.length || 0;
    const availableProducts = products?.filter((p) => p.availableStock > 0).length || 0;
    const lowStockProducts = products?.filter((p) => p.availableStock < 10).length || 0;

    // Recent Orders (last 5)
    const recentOrders = orders
      ?.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5) || [];

    // Order Status Distribution for Chart
    const orderStatusDistribution = [
      { name: 'Pending', value: pendingOrders, color: '#f59e0b' },
      { name: 'Approved', value: approvedOrders, color: '#3b82f6' },
      { name: 'Dispatched', value: dispatchedOrders, color: '#8b5cf6' },
      { name: 'Delivered', value: deliveredOrders, color: '#10b981' },
      { name: 'Cancelled', value: cancelledOrders, color: '#ef4444' },
    ].filter(item => item.value > 0);

    // Monthly Order Trends (last 6 months)
    const monthlyTrends = [];
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthName = date.toLocaleDateString('en-US', { month: 'short' });
      const monthYear = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
      const monthOrders = orders?.filter((order) => {
        const orderDate = new Date(order.createdAt);
        return orderDate.getMonth() === date.getMonth() && 
               orderDate.getFullYear() === date.getFullYear();
      }).length || 0;
      
      monthlyTrends.push({
        month: monthName,
        fullDate: monthYear,
        orders: monthOrders,
        delivered: orders?.filter((order) => {
          const orderDate = new Date(order.createdAt);
          return orderDate.getMonth() === date.getMonth() && 
                 orderDate.getFullYear() === date.getFullYear() &&
                 order.status === 'DELIVERED';
        }).length || 0
      });
    }

    // Order Value Trends (if prices are available)
    const orderValueTrends = monthlyTrends.map(trend => ({
      ...trend,
      value: orders?.filter((order) => {
        const orderDate = new Date(order.createdAt);
        const trendDate = new Date(trend.fullDate);
        return orderDate.getMonth() === trendDate.getMonth() && 
               orderDate.getFullYear() === trendDate.getFullYear();
      }).reduce((sum, order) => sum + order.totalAmount, 0) || 0
    }));

    // Performance Metrics
    const deliveryRate = totalOrders > 0 ? (deliveredOrders / totalOrders) * 100 : 0;
    const approvalRate = totalOrders > 0 ? (approvedOrders / totalOrders) * 100 : 0;

    return {
      data: {
        // Order metrics
        totalOrders,
        pendingOrders,
        approvedOrders,
        deliveredOrders,
        dispatchedOrders,
        
        // Product metrics
        totalProducts,
        availableProducts,
        lowStockProducts,
        
        // Charts data
        orderStatusDistribution,
        monthlyTrends,
        orderValueTrends,
        
        // Performance
        deliveryRate,
        approvalRate,
        
        // Lists
        recentOrders,
        allOrders: orders || [],
        allProducts: products || []
      },
      isLoading,
      error
    };
  }, [orders, products, ordersLoading, productsLoading, ordersError, productsError]);
}