import useSWR from 'swr';
import { OMLogisticsPartner } from '@/types/order-management';
import { toast } from 'sonner';

const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || 'Failed to fetch logistics partners');
  }
  return res.json();
};

export function useLogisticsPartners() {
  const { data, error, isLoading, mutate } = useSWR<OMLogisticsPartner[]>(
    '/api/admin/om/logistics-partners',
    fetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 30000,
      onError: (err) => {
        console.error('Error fetching logistics partners:', err);
        toast.error('Failed to load logistics partners');
      },
    }
  );

  return {
    partners: data || [],
    isLoading,
    isError: error,
    mutate,
  };
}
