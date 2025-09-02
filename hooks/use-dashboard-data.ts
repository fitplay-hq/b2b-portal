import { useProducts } from '@/data/product/admin.hooks';
import { useOrders } from '@/data/order/admin.hooks';
import { useClients } from '@/data/client/admin.hooks';

export function useDashboardData() {
  const { products, error: productsError } = useProducts()
  const { orders, error: ordersError } = useOrders()
  const { clients, error: clientsError } = useClients()

  const isLoading = !products && !orders && !clients;
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
