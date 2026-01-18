"use client";

import { useState, useMemo, useEffect } from "react";
import Layout from "@/components/layout";
import PageGuard from "@/components/page-guard";
import { InventoryLogsTable } from "@/components/inventory-logs-table";
import { useInventoryLogs, InventoryLogsFilters } from "@/data/inventory/admin.hooks";
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

export default function InventoryLogsPage() {
  const { RESOURCES } = usePermissions();
  const { exportData, exportLoading } = useInventoryExport();
  
  const [filters, setFilters] = useState<InventoryLogsFilters>({
    page: 1,
    limit: 20,
    sortBy: "date",
    sortOrder: "desc",
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [advancedFilters, setAdvancedFilters] = useState({
    dateFrom: "",
    dateTo: "",
    productName: "",
    sku: "",
    reason: "",
  });

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
    const cleanFilters = Object.fromEntries(
      Object.entries(newFilters).filter(([, value]) => value !== "")
    );
    
    setAdvancedFilters(prev => ({ ...prev, ...newFilters }));
    
    setFilters(prev => ({
      ...prev,
      ...cleanFilters,
      page: 1, // Reset to first page when filters change
    }));
  };

  const resetFilters = () => {
    setFilters({
      page: 1,
      limit: 20,
      sortBy: "date",
      sortOrder: "desc",
    });
    setAdvancedFilters({
      dateFrom: "",
      dateTo: "",
      productName: "",
      sku: "",
      reason: "",
    });
    setSearchTerm(""); // Clear search as well
  };

  // Get active filters for display (excluding search)
  const getActiveFilters = () => {
    const activeFilters = [];
    
    // Don't include search in active filters - it's for instant filtering
    
    if (advancedFilters.dateFrom) {
      activeFilters.push({
        key: 'dateFrom',
        label: 'From Date',
        value: new Date(advancedFilters.dateFrom).toLocaleDateString('en-GB'),
        icon: Calendar
      });
    }
    
    if (advancedFilters.dateTo) {
      activeFilters.push({
        key: 'dateTo',
        label: 'To Date',
        value: new Date(advancedFilters.dateTo).toLocaleDateString('en-GB'),
        icon: Calendar
      });
    }
    
    if (advancedFilters.productName) {
      activeFilters.push({
        key: 'productName',
        label: 'Product',
        value: advancedFilters.productName,
        icon: Package
      });
    }
    
    if (advancedFilters.sku) {
      activeFilters.push({
        key: 'sku',
        label: 'SKU',
        value: advancedFilters.sku,
        icon: Package
      });
    }
    
    if (advancedFilters.reason) {
      activeFilters.push({
        key: 'reason',
        label: 'Reason',
        value: advancedFilters.reason,
        icon: FileText
      });
    }
    
    return activeFilters;
  };

  const removeFilter = (filterKey: string) => {
    // Update advanced filters state
    const updatedAdvancedFilters = { ...advancedFilters, [filterKey]: '' };
    setAdvancedFilters(updatedAdvancedFilters);
    
    // Update main filters state to trigger API call
    setFilters(prev => ({
      ...prev,
      [filterKey]: '', // Set to empty string to ensure object reference changes
      page: 1, // Reset to first page
    }));
  };

  const handleExport = async (format: 'xlsx' | 'pdf') => {
    // Use searchTerm directly to capture the current search value
    // (debouncedSearch might not have updated yet if user just typed)
    const currentSearch = searchTerm || debouncedSearch;
    
    // Convert current filters to export format matching /api/inventoryLogs expectations
    const exportFilters = {
      dateFrom: advancedFilters.dateFrom || undefined,
      dateTo: advancedFilters.dateTo || undefined,
      search: currentSearch || undefined,
      reason: advancedFilters.reason || undefined,
      // The /api/inventoryLogs endpoint uses different filter names than admin hooks
      productId: undefined, // We don't have direct product ID filter in the UI
      period: !advancedFilters.dateFrom && !advancedFilters.dateTo ? 'all' : undefined,
    };

    console.log('Admin Export Filters:', exportFilters);
    // Toast notifications are handled inside the exportData function
    await exportData(format, exportFilters);
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
              <div className="flex gap-2">
                <Button
                  variant="outline" 
                  size="sm" 
                  onClick={resetFilters}
                  disabled={getActiveFilters().length === 0}
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
          {getActiveFilters().length > 0 ? (
            <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200 shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4 text-blue-600" />
                    <span className="text-sm font-medium text-blue-900">
                      Active Filters ({getActiveFilters().length})
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={resetFilters}
                    className="h-6 px-2 text-xs text-blue-700 hover:text-blue-900 hover:bg-blue-100"
                  >
                    Clear All
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {getActiveFilters().map((filter) => {
                    const IconComponent = filter.icon;
                    return (
                      <Badge
                        key={filter.key}
                        variant="secondary"
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-blue-200 text-blue-800 hover:bg-blue-50 group cursor-pointer transition-all"
                      >
                        <IconComponent className="h-3 w-3" />
                        <span className="text-xs font-medium">{filter.label}:</span>
                        <span className="text-xs max-w-32 truncate">{filter.value}</span>
                        <button
                          onClick={() => removeFilter(filter.key)}
                          className="ml-1 opacity-60 hover:opacity-100 transition-opacity"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    );
                  })}
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <div className="text-xs text-blue-600">
                    Showing {logs?.length || 0} results with applied filters
                  </div>
                  <div className="text-xs text-blue-500">
                    Showing filtered results
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="bg-gradient-to-r from-gray-50 to-slate-50 border-gray-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4 text-gray-500" />
                    <span className="text-sm font-medium text-gray-700">
                      No Filters Applied
                    </span>
                  </div>
                  <div className="text-xs text-gray-500">
                    Showing all logs
                  </div>
                </div>
                <div className="mt-2 text-xs text-gray-600">
                  🔍 Use the search bar or click &quot;Filters&quot; in the table below to narrow down results by date, product, or reason
                </div>
              </CardContent>
            </Card>
          )}

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
              activeFilters={getActiveFilters()}
              currentFilters={advancedFilters}
            />
          </div>
        </div>
      </Layout>
    </PageGuard>
  );
}