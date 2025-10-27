"use client";

import { useState } from "react";
import Layout from "@/components/layout";
import PageGuard from "@/components/page-guard";
import { InventoryLogsTable } from "@/components/inventory-logs-table";
import { useInventoryLogs, InventoryLogsFilters } from "@/data/inventory/admin.hooks";
import { usePermissions } from "@/hooks/use-permissions";
import { useDebouncedSearch } from "@/hooks/use-debounced-search";

export default function InventoryLogsPage() {
  const { RESOURCES } = usePermissions();
  
  const [filters, setFilters] = useState<InventoryLogsFilters>({
    page: 1,
    limit: 20,
    sortBy: "date",
    sortOrder: "desc",
  });

  // Debounced search hook
  const { searchValue, handleSearch } = useDebouncedSearch((searchTerm: string) => {
    setFilters(prev => ({ 
      ...prev, 
      search: searchTerm || undefined, 
      page: 1 
    }));
  }, 500); // 500ms delay

  const { logs, pagination, error, isLoading } = useInventoryLogs(filters);

  const handlePageChange = (page: number) => {
    setFilters(prev => ({ ...prev, page }));
  };

  const handleSortChange = (sortBy: string, sortOrder: "asc" | "desc") => {
    setFilters(prev => ({ ...prev, sortBy, sortOrder, page: 1 }));
  };

  const handleFilterChange = (newFilters: Record<string, string>) => {
    const cleanFilters = Object.fromEntries(
      Object.entries(newFilters).filter(([, value]) => value !== "")
    );
    
    setFilters(prev => ({
      ...prev,
      ...cleanFilters,
      page: 1, // Reset to first page when filters change
    }));
  };

  if (error) {
    return (
      <Layout isClient={false}>
        <div className="text-center text-destructive">
          Failed to load inventory logs. Please try again later.
        </div>
      </Layout>
    );
  }

  return (
    <PageGuard resource={RESOURCES.INVENTORY} action="view">
      <Layout isClient={false}>
        <div className="flex flex-col gap-6">
          <div className="shrink-0">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold">Inventory Logs</h1>
                <p className="text-muted-foreground">
                  Complete history of all inventory movements across all products
                </p>
              </div>
            </div>
          </div>

          <div className="flex-1">
            <InventoryLogsTable
              logs={logs}
              isLoading={isLoading}
              pagination={pagination}
              onPageChange={handlePageChange}
              onSortChange={handleSortChange}
              onSearch={handleSearch}
              onFilterChange={handleFilterChange}
              currentSort={{ 
                sortBy: filters.sortBy || "date", 
                sortOrder: filters.sortOrder || "desc" 
              }}
              showFilters={true}
              title="All Inventory Movements"
              description="Track every inventory change across your entire product catalog"
              searchValue={searchValue}
            />
          </div>
        </div>
      </Layout>
    </PageGuard>
  );
}