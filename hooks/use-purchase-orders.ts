import useSWR from 'swr';
import { OMPurchaseOrder } from '@/types/order-management';
import { toast } from 'sonner';

const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || 'Failed to fetch purchase orders');
  }
  return res.json();
};

export function usePurchaseOrders() {
  const { data, error, isLoading, mutate } = useSWR<{ data: OMPurchaseOrder[] }>(
    '/api/admin/om/purchase-orders?limit=1000', // Fetch all for client-side sorting/filtering
    fetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 30000,
      onError: (err) => {
        console.error('Error fetching purchase orders:', err);
        toast.error('Failed to load purchase orders');
      },
    }
  );

  return {
    purchaseOrders: data?.data || [],
    isLoading,
    isError: error,
    mutate,
  };
}
