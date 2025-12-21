import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export interface ClientInventoryLogEntry {
  productId: string;
  productName: string;
  sku: string;
  timestamp: string;
  action: string;
  reason: string | null;
  changeAmount: number;
  changeDirection: "Added" | "Removed" | null;
  finalStock: number;
  raw: string;
  remarks?: string;
  minStockThreshold?: number;
}

export interface ClientInventoryLogsResponse {
  count: number;
  logs: ClientInventoryLogEntry[];
}

export interface ClientInventoryLogsFilters {
  productId?: string;
  reason?: string;
  search?: string;
  dateFrom?: string;
  dateTo?: string;
  period?: string;
}

export function useClientInventoryLogs(filters?: ClientInventoryLogsFilters) {
  const queryParams = new URLSearchParams();
  
  if (filters?.productId) queryParams.set("productId", filters.productId);
  if (filters?.reason) queryParams.set("reason", filters.reason);
  if (filters?.search) queryParams.set("search", filters.search);
  if (filters?.dateFrom) queryParams.set("dateFrom", filters.dateFrom);
  if (filters?.dateTo) queryParams.set("dateTo", filters.dateTo);
  if (filters?.period) queryParams.set("period", filters.period);

  const url = `/api/inventoryLogs?${queryParams.toString()}`;
  
  const { data, error, isLoading, mutate } = useSWR<ClientInventoryLogsResponse>(
    url,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
    }
  );

  return {
    logs: data?.logs || [],
    count: data?.count || 0,
    error,
    isLoading,
    mutate,
  };
}