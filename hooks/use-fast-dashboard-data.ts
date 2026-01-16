import useSWR from 'swr';
import { useFastPermissions } from '@/contexts/fast-permission-context';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function useFastDashboardData() {
  const { isAdmin, isInitialized } = useFastPermissions();
  
  const { data, error, isLoading } = useSWR(
    // Only fetch if permissions are initialized to avoid unnecessary calls
    isInitialized ? '/api/admin/dashboard' : null,
    fetcher,
    {
      // Temporarily enable revalidation to get updated data
      revalidateIfStale: true,
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
      dedupingInterval: 0, // Disable deduping to force fresh requests
    }
  );

  return {
    data: data || { products: [], orders: [], clients: [], permissions: {} },
    isLoading: !isInitialized || isLoading,
    error,
  };
}