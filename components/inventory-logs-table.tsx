"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  ArrowUpDown, 
  ArrowUp, 
  ArrowDown, 
  ChevronLeft, 
  ChevronRight,
  Filter
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
  onFilterChange?: (filters: Record<string, string>) => void;
  currentSort?: { sortBy: string; sortOrder: "asc" | "desc" };
  showFilters?: boolean;
  title?: string;
  description?: string;
  searchValue?: string; // Controlled search value
}

export function InventoryLogsTable({
  logs,
  isLoading,
  pagination,
  onPageChange,
  onSortChange,
  onSearch,
  onFilterChange,
  currentSort = { sortBy: "date", sortOrder: "desc" },
  showFilters = true,
  title = "Inventory Logs",
  description = "Complete history of all inventory movements",
  searchValue = "",
}: InventoryLogsTableProps) {
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [filters, setFilters] = useState({
    dateFrom: "",
    dateTo: "",
    productName: "",
    sku: "",
    reason: "",
  });

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

  const handleFilterChange = useCallback((key: string, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    
    // Clear existing timeout
    if (filterTimeoutRef.current) {
      clearTimeout(filterTimeoutRef.current);
    }
    
    // Debounce filter changes to prevent rapid API calls
    filterTimeoutRef.current = setTimeout(() => {
      onFilterChange?.(newFilters);
    }, 300);
  }, [filters, onFilterChange]);

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
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            >
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
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
                className="pl-8"
              />
            </div>

            {showAdvancedFilters && (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 p-4 border rounded-lg bg-muted/20">
                <div>
                  <label className="text-sm font-medium mb-1 block">From Date</label>
                  <Input
                    key="dateFrom"
                    type="date"
                    value={filters.dateFrom}
                    onChange={(e) => handleFilterChange("dateFrom", e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">To Date</label>
                  <Input
                    key="dateTo"
                    type="date"
                    value={filters.dateTo}
                    onChange={(e) => handleFilterChange("dateTo", e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Product Name</label>
                  <Input
                    key="productName"
                    placeholder="Filter by product"
                    value={filters.productName}
                    onChange={(e) => handleFilterChange("productName", e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">SKU</label>
                  <Input
                    key="sku"
                    placeholder="Filter by SKU"
                    value={filters.sku}
                    onChange={(e) => handleFilterChange("sku", e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Reason</label>
                  <Input
                    key="reason"
                    placeholder="Filter by reason"
                    value={filters.reason}
                    onChange={(e) => handleFilterChange("reason", e.target.value)}
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {/* Table */}
        <div className="rounded-md border">
          <table className="w-full">
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
                        <span className="font-medium text-green-600">
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
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-muted-foreground">
                    No inventory logs found. Try adjusting your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
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