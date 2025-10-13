import { useProducts } from '@/data/product/admin.hooks';
import { useOrders } from '@/data/order/admin.hooks';
import { useClients } from '@/data/client/admin.hooks';
import { usePermissions } from '@/hooks/use-permissions';

export function useDashboardData() {
  const { pageAccess } = usePermissions();
  
  // Always call hooks but filter data based on permissions
  const { products, error: productsError, isLoading: productsLoading } = useProducts();
  const { orders, error: ordersError, isLoading: ordersLoading } = useOrders();
  const { clients, error: clientsError, isLoading: clientsLoading } = useClients();

  // Only include loading states for resources user has access to
  const isLoading = 
    (pageAccess.products && productsLoading) || 
    (pageAccess.orders && ordersLoading) || 
    (pageAccess.clients && clientsLoading);
  
  // Only include errors for resources user has access to  
  const error = 
    (pageAccess.products && productsError) || 
    (pageAccess.orders && ordersError) || 
    (pageAccess.clients && clientsError);

  return {
    data: {
      products: pageAccess.products ? (products || []) : [],
      orders: pageAccess.orders ? (orders || []) : [],
      clients: pageAccess.clients ? (clients || []) : [],
    },
    isLoading,
    error,
  };
}
