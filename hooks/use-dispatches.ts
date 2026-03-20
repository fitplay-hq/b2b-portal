import useSWR, { SWRConfiguration } from 'swr';
import { useMemo } from 'react';
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

export function useDispatches(options: SWRConfiguration = {}) {
  const { data, error, isLoading, mutate } = useSWR<{ data: OMDispatchOrder[] }>(
    '/api/admin/om/dispatch-orders?limit=1000', // Fetch more for client-side sorting/filtering
    fetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 30000,
      ...options,
      onError: (err) => {
        console.error('Error fetching dispatches:', err);
        toast.error('Failed to load dispatches');
      },
    }
  );

  return useMemo(() => ({
    dispatches: data?.data || [],
    isLoading,
    isError: error,
    mutate,
  }), [data, error, isLoading, mutate]);
}
