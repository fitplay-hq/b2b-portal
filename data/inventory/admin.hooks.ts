import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export interface InventoryLogEntry {
  id: string;
  date: string;
  productName: string;
  sku: string;
  change: string;
  reason: string;
  remarks: string;
  user: string;
  role: string;
  productId: string;
  currentStock: number;
}

export interface InventoryLogsResponse {
  logs: InventoryLogEntry[];
  pagination: {
    page: number;
    limit: number;
    totalLogs: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
  filters: {
    search?: string;
    dateFrom?: string;
    dateTo?: string;
    productName?: string;
    sku?: string;
    reason?: string;
  };
  sorting: {
    sortBy: string;
    sortOrder: string;
  };
}

export interface InventoryLogsFilters {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  search?: string;
  dateFrom?: string;
  dateTo?: string;
  productName?: string;
  sku?: string;
  reason?: string;
}

export function useInventoryLogs(filters?: InventoryLogsFilters) {
  const queryParams = new URLSearchParams();
  
  if (filters?.page) queryParams.set("page", filters.page.toString());
  if (filters?.limit) queryParams.set("limit", filters.limit.toString());
  if (filters?.sortBy) queryParams.set("sortBy", filters.sortBy);
  if (filters?.sortOrder) queryParams.set("sortOrder", filters.sortOrder);
  if (filters?.search) queryParams.set("search", filters.search);
  if (filters?.dateFrom) queryParams.set("dateFrom", filters.dateFrom);
  if (filters?.dateTo) queryParams.set("dateTo", filters.dateTo);
  if (filters?.productName) queryParams.set("productName", filters.productName);
  if (filters?.sku) queryParams.set("sku", filters.sku);
  if (filters?.reason) queryParams.set("reason", filters.reason);

  const url = `/api/admin/inventory/logs?${queryParams.toString()}`;
  
  const { data, error, isLoading, mutate } = useSWR<InventoryLogsResponse>(
    url,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
    }
  );

  return {
    logs: data?.logs || [],
    pagination: data?.pagination,
    filters: data?.filters,
    sorting: data?.sorting,
    error,
    isLoading,
    mutate,
  };
}

// Hook for product-specific inventory logs
export function useProductInventoryLogs(productId: string) {
  const { data, error, isLoading, mutate } = useSWR<{ inventoryLogs: string[]; availableStock: number }>(
    productId ? `/api/admin/products/product/inventory?productId=${productId}` : null,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
    }
  );

  // Parse the logs similar to the global endpoint
  const parsedLogs: InventoryLogEntry[] = [];
  
  if (data?.inventoryLogs) {
    data.inventoryLogs.forEach((logString, index) => {
      try {
        const parts = logString.split(" | ");
        if (parts.length >= 3) {
          const date = parts[0];
          const changeInfo = parts[1];
          const reasonInfo = parts[2];
          
          const changeMatch = changeInfo.match(/(Added|Removed)\s+(\d+)\s+units/);
          const change = changeMatch ? 
            `${changeMatch[1] === 'Added' ? '+' : '-'}${changeMatch[2]}` : 
            changeInfo;
          
          const reasonMatch = reasonInfo.match(/Reason:\s*(.+)/);
          const extractedReason = reasonMatch ? reasonMatch[1] : reasonInfo;
          
          parsedLogs.push({
            id: `${productId}-${index}`,
            date: date,
            productName: "", // Will be filled by the component
            sku: "", // Will be filled by the component
            change: change,
            reason: extractedReason,
            remarks: "",
            user: "Admin",
            role: "ADMIN",
            productId: productId,
            currentStock: data?.availableStock || 0,
          });
        }
      } catch (error) {
        console.error("Error parsing log entry:", logString, error);
      }
    });
  }

  // Sort logs by date in descending order (latest first, Z-A)
  const sortedLogs = parsedLogs.sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    
    // Handle invalid dates by putting them at the end
    if (isNaN(dateA.getTime()) && isNaN(dateB.getTime())) return 0;
    if (isNaN(dateA.getTime())) return 1;
    if (isNaN(dateB.getTime())) return -1;
    
    return dateB.getTime() - dateA.getTime(); // Descending order (latest first)
  });

  return {
    logs: sortedLogs,
    error,
    isLoading,
    mutate,
  };
}