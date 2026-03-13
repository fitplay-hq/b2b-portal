import useSWR from 'swr';
import { OMDispatchOrder } from '@/types/order-management';
import { toast } from 'sonner';

const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || 'Failed to fetch dispatches');
  }
  return res.json();
};

export function useDispatches() {
  const { data, error, isLoading, mutate } = useSWR<{ data: OMDispatchOrder[]; meta: any }>(
    '/api/admin/om/dispatch-orders',
    fetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 30000,
      onError: (err) => {
        console.error('Error fetching dispatches:', err);
        toast.error('Failed to load dispatches');
      },
    }
  );

  return {
    dispatches: data?.data || [],
    meta: data?.meta,
    isLoading,
    isError: error,
    mutate,
  };
}
