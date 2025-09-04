import { useProducts } from '@/data/product/admin.hooks';
import { useOrders } from '@/data/order/admin.hooks';
import { useClients } from '@/data/client/admin.hooks';

export function useDashboardData() {
  const { products, error: productsError, isLoading: productsLoading } = useProducts()
  const { orders, error: ordersError, isLoading: ordersLoading } = useOrders()
  const { clients, error: clientsError, isLoading: clientsLoading } = useClients()

  const isLoading = productsLoading || ordersLoading || clientsLoading;
  const error = productsError || ordersError || clientsError;

  return {
    data: {
      products: products || [],
      orders: orders || [],
      clients: clients || [],
    },
    isLoading,
    error,
  };
}
