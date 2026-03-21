"use client";

import { useState, useMemo, useEffect } from "react";
import Layout from "@/components/layout";
import PageGuard from "@/components/page-guard";
import { InventoryLogsTable } from "@/components/inventory-logs-table";
import { useInventoryLogs, InventoryLogsFilters } from "@/data/inventory/admin.hooks";
import { useCompanies } from "@/data/company/admin.hooks";
import { usePermissions } from "@/hooks/use-permissions";
import { useInventoryExport } from "@/hooks/use-inventory-export";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { 
  RotateCcw, 
  X, 
  Filter, 
  Calendar, 
  Package, 
  FileText, 
  Download, 
  ChevronDown, 
  FileSpreadsheet 
} from "lucide-react";
import { useOMFilters } from "@/hooks/use-om-filters";
import { OMActiveFilters } from "@/components/orderManagement/shared/OMActiveFilters";

export default function InventoryLogsPage() {
  const { RESOURCES } = usePermissions();
  const { exportData, exportLoading } = useInventoryExport();
  const { companies } = useCompanies();
  
  const [filters, setFilters] = useState<InventoryLogsFilters>({
    page: 1,
    limit: 20,
    sortBy: "date",
    sortOrder: "desc",
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const { filters: advancedFilters, setFilters: setAdvancedFilters, resetFilters: resetAdvancedFilters, activeFilters, removeFilter: removeAdvancedFilter } = useOMFilters({
    initialFilters: {
      dateFrom: "",
      dateTo: "",
      productName: "",
      sku: "",
      reason: "",
      companyId: "",
    },
    labels: {
      dateFrom: "From Date",
      dateTo: "To Date",
      productName: "Product",
      sku: "SKU",
      reason: "Reason",
      companyId: "Company",
    },
    valueLabels: {
      dateFrom: (val) => new Date(val).toLocaleDateString('en-GB'),
      dateTo: (val) => new Date(val).toLocaleDateString('en-GB'),
      companyId: (val) => companies?.find((c: any) => c.id === val)?.name || val,
    }
  });

  const activeFiltersWithIcons = useMemo(() => {
    return activeFilters.map((f) => ({
      ...f,
      icon: f.key.includes("date") ? Calendar : f.key === "reason" ? FileText : Package,
    }));
  }, [activeFilters]);

  // Debounce search term for API call - waits 500ms after user stops typing
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Fetch logs with debounced search - searches across all pages
  const { logs: allLogs, pagination, error, isLoading } = useInventoryLogs({
    ...filters,
    search: debouncedSearch || undefined, // Use debounced search for API
  });

  // Client-side filtering with useMemo for instant visual feedback while typing
  const logs = useMemo(() => {
    if (!allLogs) return [];
    
    let filtered = allLogs;
    const lowercasedTerm = searchTerm.toLowerCase();

    // Apply instant search filter for immediate feedback
    if (lowercasedTerm && lowercasedTerm !== debouncedSearch.toLowerCase()) {
      // Only do client-side filtering if user is still typing (searchTerm differs from debouncedSearch)
      filtered = filtered.filter(log => {
        return (
          log.productName.toLowerCase().includes(lowercasedTerm) ||
          log.sku.toLowerCase().includes(lowercasedTerm) ||
          log.reason.toLowerCase().includes(lowercasedTerm) ||
          log.change.toLowerCase().includes(lowercasedTerm) ||
          log.currentStock.toString().includes(lowercasedTerm) ||
          log.remarks.toLowerCase().includes(lowercasedTerm) ||
          log.user.toLowerCase().includes(lowercasedTerm)
        );
      });
    }

    return filtered;
  }, [allLogs, searchTerm, debouncedSearch]);

  const handlePageChange = (page: number) => {
    setFilters(prev => ({ ...prev, page }));
  };

  const handleSortChange = (sortBy: string, sortOrder: "asc" | "desc") => {
    setFilters(prev => ({ ...prev, sortBy, sortOrder, page: 1 }));
  };

  const handleFilterChange = (newFilters: Record<string, string>) => {
    setAdvancedFilters(prev => ({ ...prev, ...newFilters }));
    setFilters(prev => ({ ...prev, page: 1 }));
  };

  const resetFilters = () => {
    setFilters({
      page: 1,
      limit: 20,
      sortBy: "date",
      sortOrder: "desc",
    });
    resetAdvancedFilters();
    setSearchTerm("");
  };

  const handleExport = async (format: 'xlsx' | 'pdf') => {
    const currentSearch = searchTerm || debouncedSearch;
    const exportFilters = {
      ...advancedFilters,
      search: currentSearch || undefined,
      period: !advancedFilters.dateFrom && !advancedFilters.dateTo ? 'all' : undefined,
    };
    await exportData(format, exportFilters);
  };

  if (error) {
    return (
      <div className="text-center text-destructive">
        Failed to load inventory logs. Please try again later.
      </div>
    );
  }

  return (
    <PageGuard resource={RESOURCES.INVENTORY} action="view">
      <div className="flex flex-col gap-6">
          <div className="shrink-0">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold">Inventory Logs</h1>
                <p className="text-muted-foreground">
                  Complete history of all inventory movements across all products
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline" 
                  size="sm" 
                  onClick={resetFilters}
                  disabled={activeFilters.length === 0}
                >
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Reset Filters
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      disabled={!!exportLoading}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      {exportLoading ? 'Exporting...' : 'Export Data'}
                      <ChevronDown className="h-4 w-4 ml-2" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleExport('xlsx')}>
                      <FileSpreadsheet className="h-4 w-4 mr-2" />
                      Export as Excel
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleExport('pdf')}>
                      <FileText className="h-4 w-4 mr-2" />
                      Export as PDF
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>

          {/* Active Filters Display */}
          <div className="-mt-4">
            <OMActiveFilters
              activeFilters={activeFilters}
              onRemove={removeAdvancedFilter}
              onClearAll={resetFilters}
            />
          </div>

          <div className="flex-1">
            <InventoryLogsTable
              logs={logs}
              isLoading={isLoading}
              pagination={pagination}
              onPageChange={handlePageChange}
              onSortChange={handleSortChange}
              onSearch={setSearchTerm}
              onImmediateSearch={setSearchTerm}
              onFilterChange={handleFilterChange}
              currentSort={{ 
                sortBy: filters.sortBy || "date", 
                sortOrder: filters.sortOrder || "desc" 
              }}
              showFilters={true}
              title="All Inventory Movements"
              description="Track every inventory change across your entire product catalog"
              searchValue={searchTerm}
              onResetFilters={resetFilters}
              activeFilters={activeFiltersWithIcons}
              currentFilters={advancedFilters}
              companies={companies}
            />
          </div>
        </div>
      </PageGuard>
  );
}