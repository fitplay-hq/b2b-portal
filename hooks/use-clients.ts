import useSWR from 'swr';
import { OMClient } from '@/types/order-management';
import { toast } from 'sonner';

const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || 'Failed to fetch clients');
  }
  return res.json();
};

export function useClients() {
  const { data, error, isLoading, mutate } = useSWR<OMClient[]>(
    '/api/admin/om/clients',
    fetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 30000,
      onError: (err) => {
        console.error('Error fetching clients:', err);
        toast.error('Failed to load clients');
      },
    }
  );

  return {
    clients: data || [],
    isLoading,
    isError: error,
    mutate,
  };
}
