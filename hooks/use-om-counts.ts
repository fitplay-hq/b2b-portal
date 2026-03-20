import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then(res => res.json());

export type OMCountKey = 
  | 'brands'
  | 'clients'
  | 'deliveryLocations'
  | 'locations'
  | 'dispatches'
  | 'products'
  | 'items'
  | 'logisticsPartners'
  | 'purchaseOrders';

export function useOMCounts(key: OMCountKey) {
  const { data, error, isLoading, mutate } = useSWR<{ [K in OMCountKey]?: number }>(
    `/api/admin/om/counts?key=${key}`,
    fetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 60000, // Cache for 1 minute
    }
  );

  return {
    count: data ? data[key] : undefined,
    isLoading,
    isError: error,
    mutate,
  };
}
