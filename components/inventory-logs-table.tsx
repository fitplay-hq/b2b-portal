"use client";

import { useState, useCallback, useRef, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Search, 
  ArrowUpDown, 
  ArrowUp, 
  ArrowDown, 
  ChevronLeft, 
  ChevronRight,
  Filter,
  RotateCcw,
  Loader2
} from "lucide-react";
import { InventoryLogEntry } from "@/data/inventory/admin.hooks";
interface InventoryLogsTableProps {
  logs: InventoryLogEntry[];
  isLoading: boolean;
  pagination?: {
    page: number;
    limit: number;
    totalLogs: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
  onPageChange?: (page: number) => void;
  onSortChange?: (sortBy: string, sortOrder: "asc" | "desc") => void;
  onSearch?: (search: string) => void;
  onImmediateSearch?: (search: string) => void;
  onFilterChange?: (filters: Record<string, string>) => void;
  currentSort?: { sortBy: string; sortOrder: "asc" | "desc" };
  showFilters?: boolean;
  title?: string;
  description?: string;
  searchValue?: string; // Controlled search value
  onResetFilters?: () => void;
  activeFilters?: Array<{
    key: string;
    label: string;
    value: string;
    icon: React.ComponentType<{ className?: string }>;
  }>;
  currentFilters?: {
    dateFrom: string;
    dateTo: string;
    productName: string;
    sku: string;
    reason: string;
  };
}

export function InventoryLogsTable({
  logs,
  isLoading,
  pagination,
  onPageChange,
  onSortChange,
  onSearch,
  onImmediateSearch,
  onFilterChange,
  currentSort = { sortBy: "date", sortOrder: "desc" },
  showFilters = true,
  title = "Inventory Logs",
  description = "Complete history of all inventory movements",
  searchValue = "",
  onResetFilters,
  activeFilters = [],
  currentFilters,
}: InventoryLogsTableProps) {
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [localFilters, setLocalFilters] = useState({
    dateFrom: "",
    dateTo: "",
    productName: "",
    sku: "",
    reason: "",
  });
  
  // Sync local filters with current filters from parent
  useEffect(() => {
    if (currentFilters) {
      setLocalFilters(currentFilters);
    }
  }, [currentFilters]);
  
  // Use currentFilters for display when available (ensures sync with parent), otherwise localFilters
  const displayFilters = currentFilters || localFilters;
  const filters = useMemo(() => currentFilters || localFilters, [currentFilters, localFilters]);

  const handleSearch = (value: string) => {
    onSearch?.(value); // This will now be debounced from the parent
  };

  const handleSort = (column: string) => {
    if (!onSortChange) return;
    
    const newSortOrder = 
      currentSort.sortBy === column && currentSort.sortOrder === "asc" 
        ? "desc" 
        : "asc";
    
    onSortChange(column, newSortOrder);
  };

  const getSortIcon = (column: string) => {
    if (currentSort.sortBy !== column) {
      return <ArrowUpDown className="h-4 w-4 opacity-50" />;
    }
    return currentSort.sortOrder === "asc" 
      ? <ArrowUp className="h-4 w-4" />
      : <ArrowDown className="h-4 w-4" />;
  };

  const filterTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [isFilteringLoading, setIsFilteringLoading] = useState(false);

  const handleFilterChange = useCallback((key: string, value: string, immediate = false) => {
    // Always update local filters immediately for instant UI response
    setLocalFilters(prev => ({ ...prev, [key]: value }));
    
    const newFilters = { ...filters, [key]: value };
    
    // Clear existing timeout
    if (filterTimeoutRef.current) {
      clearTimeout(filterTimeoutRef.current);
    }
    
    // If immediate, apply filter right away (for Enter key or blur)
    if (immediate) {
      setIsFilteringLoading(false);
      onFilterChange?.(newFilters);
      return;
    }
    
    // For text inputs, use longer debounce delay
    const isTextInput = ['productName', 'sku'].includes(key);
    const debounceDelay = isTextInput ? 2500 : 300; // 2.5s for text, 300ms for dates
    
    // Show loading state for text inputs
    if (isTextInput && value.length > 0) {
      setIsFilteringLoading(true);
    }
    
    // Debounce filter changes to prevent rapid API calls
    filterTimeoutRef.current = setTimeout(() => {
      setIsFilteringLoading(false);
      onFilterChange?.(newFilters);
    }, debounceDelay);
  }, [filters, onFilterChange]);

  const handleKeyPress = (key: string, value: string, e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleFilterChange(key, value, true); // Apply immediately on Enter
    }
  };

  const handleBlur = (key: string, value: string) => {
    // Apply filter immediately when user leaves the input field
    if (value.length > 0) {
      handleFilterChange(key, value, true);
    }
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (filterTimeoutRef.current) {
        clearTimeout(filterTimeoutRef.current);
      }
    };
  }, []);

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false
      });
    } catch {
      return dateString;
    }
  };

  const getChangeVariant = (change: string) => {
    if (change.startsWith('+')) return "default";
    if (change.startsWith('-')) return "destructive";
    return "outline";
  };

  const formatReason = (reason: string) => {
    return reason.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>{title}</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">{description}</p>
          </div>
          {showFilters && (
            <div className="flex gap-2">
              {onResetFilters && activeFilters.length > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onResetFilters}
                >
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Reset
                </Button>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              >
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent>
        {/* Search and Advanced Filters */}
        {showFilters && (
          <div className="space-y-4 mb-6">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by product name, SKU, or reason..."
                value={searchValue}
                onChange={(e) => handleSearch(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    onImmediateSearch?.(searchValue);
                  }
                }}
                className="pl-8"
              />
              {isLoading && (
                <Loader2 className="absolute right-2 top-2.5 h-4 w-4 animate-spin text-muted-foreground" />
              )}
            </div>

            {showAdvancedFilters && (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 p-4 border rounded-lg bg-muted/20">
                <div>
                  <label className="text-sm font-medium mb-1 block">From Date</label>
                  <Input
                    key="dateFrom"
                    type="date"
                    value={displayFilters.dateFrom}
                    onChange={(e) => handleFilterChange("dateFrom", e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">To Date</label>
                  <Input
                    key="dateTo"
                    type="date"
                    value={displayFilters.dateTo}
                    onChange={(e) => handleFilterChange("dateTo", e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Product Name</label>
                  <div className="relative">
                    <Input
                      key="productName"
                      placeholder="Filter by product... (2.5s auto, Enter instant)"
                      value={displayFilters.productName}
                      onChange={(e) => handleFilterChange("productName", e.target.value)}
                      onKeyPress={(e) => handleKeyPress("productName", displayFilters.productName, e)}
                      onBlur={() => handleBlur("productName", displayFilters.productName)}
                      className="pr-8"
                    />
                    {isFilteringLoading && displayFilters.productName && (
                      <Loader2 className="absolute right-2 top-2.5 h-4 w-4 animate-spin text-muted-foreground" />
                    )}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">SKU</label>
                  <div className="relative">
                    <Input
                      key="sku"
                      placeholder="Filter by SKU... (2.5s auto, Enter instant)"
                      value={displayFilters.sku}
                      onChange={(e) => handleFilterChange("sku", e.target.value)}
                      onKeyPress={(e) => handleKeyPress("sku", displayFilters.sku, e)}
                      onBlur={() => handleBlur("sku", displayFilters.sku)}
                      className="pr-8"
                    />
                    {isFilteringLoading && displayFilters.sku && (
                      <Loader2 className="absolute right-2 top-2.5 h-4 w-4 animate-spin text-muted-foreground" />
                    )}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Reason</label>
                  <Select
                    value={displayFilters.reason || "all"}
                    onValueChange={(value) => {
                      const reasonValue = value === "all" ? "" : value;
                      handleFilterChange("reason", reasonValue);
                      handleApplyFilter("reason", reasonValue);
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All Reasons" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Reasons</SelectItem>
                      <SelectItem value="NEW_PURCHASE">New Purchase</SelectItem>
                      <SelectItem value="PHYSICAL_STOCK_CHECK">Physical Stock Check</SelectItem>
                      <SelectItem value="RETURN_FROM_PREVIOUS_DISPATCH">Return From Previous Dispatch</SelectItem>
                      <SelectItem value="NEW_ORDER">New Order</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            {/* Reset Filters Button */}
            {showAdvancedFilters && (
              <div className="flex justify-end">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    // Call parent reset function to clear all filters
                    onResetFilters?.();
                  }}
                  className="flex items-center gap-2"
                >
                  <RotateCcw className="h-4 w-4" />
                  Reset Filters
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Log count display */}
        <div className="mb-4 text-sm text-muted-foreground">
          Showing {logs?.length || 0} out of {pagination?.totalLogs || 0} logs
        </div>

        {/* Table */}
        <div className="rounded-md border overflow-x-auto">
          <div className="min-w-[1200px]">
            <table className="w-full">{/* Set minimum width to prevent cramping */}
            <thead className="bg-muted/50">
              <tr className="border-b">
                <th className="text-left p-4 font-medium">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleSort("date")}
                    className="h-auto p-0 font-medium"
                  >
                    Date
                    {getSortIcon("date")}
                  </Button>
                </th>
                <th className="text-left p-4 font-medium">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleSort("productName")}
                    className="h-auto p-0 font-medium"
                  >
                    Product Name
                    {getSortIcon("productName")}
                  </Button>
                </th>
                <th className="text-left p-4 font-medium">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleSort("sku")}
                    className="h-auto p-0 font-medium"
                  >
                    SKU
                    {getSortIcon("sku")}
                  </Button>
                </th>
                <th className="text-left p-4 font-medium">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleSort("change")}
                    className="h-auto p-0 font-medium"
                  >
                    Change
                    {getSortIcon("change")}
                  </Button>
                </th>
                <th className="text-left p-4 font-medium">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleSort("currentStock")}
                    className="h-auto p-0 font-medium"
                  >
                    Updated Stock
                    {getSortIcon("currentStock")}
                  </Button>
                </th>
                <th className="text-left p-4 font-medium">Reason</th>
                <th className="text-left p-4 font-medium">User</th>
                <th className="text-left p-4 font-medium">Role</th>
                <th className="text-left p-4 font-medium">Remarks</th>
              </tr>
            </thead>
            <tbody>
              {logs.length > 0 ? (
                logs.map((log) => (
                  <tr key={log.id} className="border-b hover:bg-muted/50">
                    <td className="p-4 text-sm">
                      {formatDate(log.date)}
                    </td>
                    <td className="p-4">
                      <div className="font-medium">{log.productName}</div>
                    </td>
                    <td className="p-4 text-sm text-muted-foreground">
                      {log.sku}
                    </td>
                    <td className="p-4">
                      <Badge variant={getChangeVariant(log.change)}>
                        {log.change}
                      </Badge>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <span className={`font-medium ${
                          log.minStockThreshold && log.currentStock < log.minStockThreshold 
                            ? "text-red-600" 
                            : "text-green-600"
                        }`}>
                          {log.currentStock}
                        </span>
                        <span className="text-xs text-muted-foreground">units</span>
                      </div>
                    </td>
                    <td className="p-4 text-sm">
                      <Badge variant="outline" className="capitalize">
                        {formatReason(log.reason)}
                      </Badge>
                    </td>
                    <td className="p-4 text-sm">{log.user}</td>
                    <td className="p-4 text-sm">
                      <Badge variant="secondary">{log.role}</Badge>
                    </td>
                    <td className="p-4 text-sm">
                      <div className="max-w-32 truncate" title={log.remarks || "No remarks"}>
                        {log.remarks || <span className="text-muted-foreground italic">No remarks</span>}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-muted-foreground">
                    No inventory logs found. Try adjusting your filters.
                  </td>
                </tr>
              )}
            </tbody>
            </table>
          </div>
        </div>        {/* Pagination */}
        {pagination && pagination.totalPages > 1 && (
          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-muted-foreground">
              Showing {Math.min((pagination.page - 1) * pagination.limit + 1, pagination.totalLogs)} to{" "}
              {Math.min(pagination.page * pagination.limit, pagination.totalLogs)} of{" "}
              {pagination.totalLogs} entries
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onPageChange?.(pagination.page - 1)}
                disabled={!pagination.hasPrev}
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>
              <div className="flex items-center space-x-1">
                {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                  const pageNumber = Math.max(1, pagination.page - 2) + i;
                  if (pageNumber > pagination.totalPages) return null;
                  
                  return (
                    <Button
                      key={pageNumber}
                      variant={pageNumber === pagination.page ? "default" : "outline"}
                      size="sm"
                      onClick={() => onPageChange?.(pageNumber)}
                    >
                      {pageNumber}
                    </Button>
                  );
                })}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onPageChange?.(pagination.page + 1)}
                disabled={!pagination.hasNext}
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}