import useSWR from 'swr';
import { Product } from '@/lib/generated/prisma';
import { PurchaseOrder, Client } from '@/lib/mockData';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function useDashboardData() {
  const { data: products, error: productsError } = useSWR<Product[]>('/api/admin/products', fetcher);
  const { data: orders, error: ordersError } = useSWR<PurchaseOrder[]>('/api/admin/orders', fetcher);
  const { data: clients, error: clientsError } = useSWR<Client[]>('/api/admin/clients', fetcher);

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
