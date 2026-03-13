import useSWR from 'swr';
import { OMDeliveryLocation } from '@/types/order-management';
import { toast } from 'sonner';

const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || 'Failed to fetch delivery locations');
  }
  return res.json();
};

export function useDeliveryLocations() {
  const { data, error, isLoading, mutate } = useSWR<OMDeliveryLocation[]>(
    '/api/admin/om/delivery-locations',
    fetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 30000,
      onError: (err) => {
        console.error('Error fetching delivery locations:', err);
        toast.error('Failed to load delivery locations');
      },
    }
  );

  return {
    locations: data || [],
    isLoading,
    isError: error,
    mutate,
  };
}
