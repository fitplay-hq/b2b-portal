import { useMemo } from 'react';
import useSWR from 'swr';

interface AnalyticsFilters {
  dateFrom?: string;
  dateTo?: string;
  clientId?: string;
  companyId?: string;
  status?: string;
  period?: '7d' | '30d' | '90d';
}

interface AnalyticsData {
  overview: {
    totalOrders: number;
    totalRevenue: number;
    averageOrderValue: number;
    totalProducts: number;
    lowStockProducts: number;
  };
  ordersByStatus: Record<string, number>;
  revenueOverTime: Array<{
    date: string;
    revenue: number;
    formattedDate: string;
  }>;
  topClients: Array<{
    name: string;
    revenue: number;
    orderCount: number;
  }>;
  topProducts: Array<{
    name: string;
    quantity: number;
    revenue: number;
  }>;
  inventoryStatus: {
    inStock: number;
    lowStock: number;
    outOfStock: number;
  };
  categoryDistribution: Record<string, number>;
  rawData: {
    orders: Array<any>;
    inventory: Array<any>;
  };
}

const fetcher = async (url: string) => {
  console.log('Fetching analytics data from:', url);
  const res = await fetch(url);
  
  if (!res.ok) {
    console.error('Analytics API error:', res.status, res.statusText);
    throw new Error(`Failed to fetch analytics: ${res.status} ${res.statusText}`);
  }
  
  const data = await res.json();
  console.log('Analytics data received:', data);
  return data;
};

export function useAnalytics(filters: AnalyticsFilters = {}) {
  // Build query string from filters
  const queryParams = useMemo(() => {
    const params = new URLSearchParams();
    
    if (filters.dateFrom) params.set('dateFrom', filters.dateFrom);
    if (filters.dateTo) params.set('dateTo', filters.dateTo);
    if (filters.clientId) params.set('clientId', filters.clientId);
    if (filters.companyId) params.set('companyId', filters.companyId);
    if (filters.status) params.set('status', filters.status);
    if (filters.period) params.set('period', filters.period);
    
    return params.toString();
  }, [filters]);

  const apiUrl = `/api/admin/analytics${queryParams ? `?${queryParams}` : ''}`;

  const {
    data,
    error,
    isLoading,
    mutate
  } = useSWR<AnalyticsData>(apiUrl, fetcher, {
    refreshInterval: 5 * 60 * 1000, // Refresh every 5 minutes
    revalidateOnFocus: false,
    dedupingInterval: 30 * 1000, // Dedupe requests for 30 seconds
  });

  // Export function
  const exportData = async (type: 'orders' | 'inventory', format: 'xlsx' | 'pdf' = 'xlsx') => {
    try {
      const exportParams = new URLSearchParams();
      exportParams.set('type', type);
      
      if (filters.dateFrom) exportParams.set('dateFrom', filters.dateFrom);
      if (filters.dateTo) exportParams.set('dateTo', filters.dateTo);
      if (filters.clientId) exportParams.set('clientId', filters.clientId);
      if (filters.companyId) exportParams.set('companyId', filters.companyId);
      if (filters.status) exportParams.set('status', filters.status);

      // Choose the appropriate endpoint based on format
      const exportUrl = format === 'pdf' 
        ? `/api/admin/analytics/export/pdf?${exportParams.toString()}`
        : `/api/admin/analytics/export?${exportParams.toString()}`;
      
      // Create a temporary link to download the file
      const response = await fetch(exportUrl);
      if (!response.ok) {
        throw new Error('Export failed');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      
      // Get filename from response headers or create default
      const contentDisposition = response.headers.get('Content-Disposition');
      const filename = contentDisposition
        ? contentDisposition.split('filename=')[1]?.replace(/"/g, '')
        : `${type}_export_${new Date().toISOString().split('T')[0]}.${format}`;
      
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      return { success: true };
    } catch (error) {
      console.error('Export error:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Export failed' };
    }
  };

  // Refresh data manually
  const refreshData = () => mutate();

  return {
    data,
    error,
    isLoading,
    exportData,
    refreshData,
  };
}

export type { AnalyticsFilters, AnalyticsData };