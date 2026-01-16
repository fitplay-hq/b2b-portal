"use client";

import { InventoryLogsTable } from "@/components/inventory-logs-table";
import { useProductInventoryLogs } from "@/data/inventory/admin.hooks";
import type { Product } from "@/lib/generated/prisma";

interface InventoryHistoryProps {
  product: Product;
}

export function InventoryHistory({ product }: InventoryHistoryProps) {
  const { logs, isLoading, error } = useProductInventoryLogs(product.id);

  // Enhance logs with product information
  const enhancedLogs = logs.map(log => ({
    ...log,
    productName: product.name,
    sku: product.sku || '',
  }));

  if (error) {
    return (
      <div className="text-center text-destructive p-4">
        Failed to load inventory history. Please try again later.
      </div>
    );
  }

  return (
    <InventoryLogsTable
      logs={enhancedLogs}
      isLoading={isLoading}
      pagination={{
        page: 1,
        limit: logs.length,
        totalLogs: logs.length,
        totalPages: 1,
        hasNext: false,
        hasPrev: false,
      }}
      showFilters={false} // Product-specific view doesn't need all filters
      title={`Inventory History - ${product.name}`}
      description={`Complete inventory movement history for ${product.sku}`}
      currentSort={{ sortBy: "date", sortOrder: "desc" }} // Ensure latest changes show first
    />
  );
}