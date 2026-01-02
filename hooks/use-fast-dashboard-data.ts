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
      // Aggressive caching for dashboard data
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      // Cache for 2 minutes
      dedupingInterval: 2 * 60 * 1000,
    }
  );

  return {
    data: data || { products: [], orders: [], clients: [], permissions: {} },
    isLoading: !isInitialized || isLoading,
    error,
  };
}