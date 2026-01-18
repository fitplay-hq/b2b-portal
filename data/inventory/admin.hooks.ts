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
  minStockThreshold?: number;
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
      dedupingInterval: 0, // Disable deduping to ensure fresh requests
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

  // Parse the logs with calculated historical stock
  const parsedLogs: InventoryLogEntry[] = [];
  
  if (data?.inventoryLogs && data.inventoryLogs.length > 0) {
    // Parse all logs first
    const productLogs: Array<{
      index: number;
      date: string;
      changeInfo: string;
      reasonInfo: string;
      changeAmount: number;
      changeDirection: 'Added' | 'Removed';
      remarks?: string;
    }> = [];

    data.inventoryLogs.forEach((logString, index) => {
      try {
        const parts = logString.split(" | ");
        if (parts.length >= 3) {
          const date = parts[0];
          const changeInfo = parts[1];
          const reasonInfo = parts[2];
          const remarksInfo = parts[4] || "";
          const remarksMatch = remarksInfo.match(/Remarks:\s*(.+)/);
          const remarks = remarksMatch ? remarksMatch[1].trim() : "";
          
          const changeMatch = changeInfo.match(/(Added|Removed)\s+(\d+)\s+units/);
          if (changeMatch) {
            productLogs.push({
              index,
              date,
              changeInfo,
              reasonInfo,
              changeAmount: parseInt(changeMatch[2]),
              changeDirection: changeMatch[1] as 'Added' | 'Removed',
              remarks: remarks === "N/A" ? "" : remarks
            });
          }
        }
      } catch (error) {
        console.error("Error parsing log entry:", logString, error);
      }
    });

    // Sort logs by date (oldest first) to calculate historical stock correctly
    productLogs.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    // Calculate historical stock for each log entry
    // First, calculate what the stock was before all changes
    let stockAfterAllChanges = data?.availableStock || 0;
    for (let i = productLogs.length - 1; i >= 0; i--) {
      const log = productLogs[i];
      if (log.changeDirection === 'Added') {
        stockAfterAllChanges -= log.changeAmount;
      } else {
        stockAfterAllChanges += log.changeAmount;
      }
    }

    // Now calculate the stock after each change going forward
    let runningStock = stockAfterAllChanges;
    productLogs.forEach((log) => {
      // Apply the change first
      if (log.changeDirection === 'Added') {
        runningStock += log.changeAmount;
      } else {
        runningStock -= log.changeAmount;
      }

      // Extract formatted data
      const change = `${log.changeDirection === 'Added' ? '+' : '-'}${log.changeAmount}`;
      const reasonMatch = log.reasonInfo.match(/Reason:\s*(.+)/);
      const extractedReason = reasonMatch ? reasonMatch[1] : log.reasonInfo;
      
      parsedLogs.push({
        id: `${productId}-${log.index}`,
        date: log.date,
        productName: "", // Will be filled by the component
        sku: "", // Will be filled by the component
        change: change,
        reason: extractedReason,
        remarks: log.remarks || "",
        user: "Admin",
        role: "ADMIN",
        productId: productId,
        currentStock: runningStock, // This is now the stock AFTER this change
      });
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