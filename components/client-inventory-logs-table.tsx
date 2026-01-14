"use client";

import { useState, useCallback, useMemo } from "react";
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
  Filter,
  RotateCcw,
  Loader2,
  Package2,
  Calendar,
  FileText,
  TrendingUp,
  TrendingDown,
  Minus,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { ClientInventoryLogEntry } from "@/data/inventory/client.hooks";
import { cn } from "@/lib/utils";

interface ClientInventoryLogsTableProps {
  logs: ClientInventoryLogEntry[];
  totalCount?: number;
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
  onSearch?: (search: string) => void;
  onImmediateSearch?: (search: string) => void;
  onFilterChange?: (filters: Record<string, string>) => void;
  showFilters?: boolean;
  title?: string;
  description?: string;
  searchValue?: string;
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
    productId: string;
    reason: string;
  };
}

export function ClientInventoryLogsTable({
  logs,
  totalCount,
  isLoading,
  pagination,
  onPageChange,
  onSearch,
  onImmediateSearch,
  onFilterChange,
  showFilters = true,
  title = "My Inventory Logs",
  description = "Track changes to your assigned product inventory",
  searchValue = "",
  onResetFilters,
  activeFilters = [],
  currentFilters,
}: ClientInventoryLogsTableProps) {
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [localFilters, setLocalFilters] = useState({
    dateFrom: "",
    dateTo: "",
    productId: "",
    reason: "",
  });

  const handleSearch = (value: string) => {
    onSearch?.(value);
  };

  const handleKeyPress = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const target = e.target as HTMLInputElement;
      onImmediateSearch?.(target.value);
    }
  }, [onImmediateSearch]);

  const handleFilterApply = () => {
    onFilterChange?.(localFilters);
    setShowAdvancedFilters(false);
  };

  const handleFilterReset = () => {
    setLocalFilters({
      dateFrom: "",
      dateTo: "",
      productId: "",
      reason: "",
    });
    onResetFilters?.();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatChange = (log: ClientInventoryLogEntry) => {
    const { changeDirection, changeAmount } = log;
    
    if (changeDirection === "Added") {
      return (
        <span className="flex items-center gap-1 text-green-600">
          <TrendingUp className="h-3 w-3" />
          +{changeAmount}
        </span>
      );
    } else if (changeDirection === "Removed") {
      return (
        <span className="flex items-center gap-1 text-red-600">
          <TrendingDown className="h-3 w-3" />
          -{changeAmount}
        </span>
      );
    } else {
      return (
        <span className="flex items-center gap-1 text-gray-500">
          <Minus className="h-3 w-3" />
          {changeAmount}
        </span>
      );
    }
  };

  const getReasonBadgeColor = (reason: string | null) => {
    if (!reason) return "secondary";
    return "secondary";
  };

  const formatReason = (reason: string | null) => {
    if (!reason) return "-";
    return reason.replace(/_/g, " ");
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package2 className="h-5 w-5" />
            {title}
          </CardTitle>
          <p className="text-sm text-muted-foreground">{description}</p>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center items-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Package2 className="h-5 w-5" />
              {title}
            </CardTitle>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {showFilters && (
          <div className="mb-6">
            <div className="flex flex-col sm:flex-row gap-4 items-center">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search by product name, SKU, or reason..."
                  value={searchValue}
                  onChange={(e) => handleSearch(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                  className="flex items-center gap-2"
                >
                  <Filter className="h-4 w-4" />
                  Filters
                </Button>
                {activeFilters.length > 0 && (
                  <Button
                    variant="ghost"
                    onClick={handleFilterReset}
                    size="sm"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <RotateCcw className="h-4 w-4 mr-1" />
                    Reset
                  </Button>
                )}
              </div>
            </div>

            {showAdvancedFilters && (
              <div className="mt-4 p-4 bg-muted/50 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Date From</label>
                    <Input
                      type="date"
                      value={localFilters.dateFrom}
                      onChange={(e) => setLocalFilters(prev => ({ ...prev, dateFrom: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Date To</label>
                    <Input
                      type="date"
                      value={localFilters.dateTo}
                      onChange={(e) => setLocalFilters(prev => ({ ...prev, dateTo: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Reason</label>
                    <Select 
                      value={localFilters.reason || undefined} 
                      onValueChange={(value) => setLocalFilters(prev => ({ ...prev, reason: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select reason" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="NEW_PURCHASE">New Purchase</SelectItem>
                        <SelectItem value="PHYSICAL_STOCK_CHECK">Physical Stock Check</SelectItem>
                        <SelectItem value="RETURN_FROM_PREVIOUS_DISPATCH">Return from Dispatch</SelectItem>
                        <SelectItem value="NEW_ORDER">New Order</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex justify-end gap-2 mt-4">
                  <Button
                    variant="outline"
                    onClick={() => setShowAdvancedFilters(false)}
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleFilterApply}>
                    Apply Filters
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Log count display */}
        <div className="mb-4 text-sm text-muted-foreground">
          Showing {logs.length} {pagination ? `of ${pagination.totalLogs}` : totalCount ? `of ${totalCount}` : ''} log{logs.length !== 1 ? 's' : ''}
        </div>

        <div className="rounded-md border">
          <div className="overflow-x-auto -mx-4 sm:mx-0">
            <div className="inline-block min-w-full align-middle">
              <table className="min-w-full divide-y divide-border">
                <thead>
                  <tr className="bg-muted/50">
                    <th className="text-left px-2 py-3 sm:px-4 font-medium text-xs sm:text-sm whitespace-nowrap">Date</th>
                    <th className="text-left px-2 py-3 sm:px-4 font-medium text-xs sm:text-sm whitespace-nowrap min-w-[140px]">Product</th>
                    <th className="text-left px-2 py-3 sm:px-4 font-medium text-xs sm:text-sm whitespace-nowrap">Change</th>
                    <th className="text-left px-2 py-3 sm:px-4 font-medium text-xs sm:text-sm whitespace-nowrap">Stock</th>
                    <th className="text-left px-2 py-3 sm:px-4 font-medium text-xs sm:text-sm whitespace-nowrap max-w-[200px]">Reason</th>
                    <th className="text-left px-2 py-3 sm:px-4 font-medium text-xs sm:text-sm whitespace-nowrap min-w-[120px]">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {logs.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center py-8 text-muted-foreground px-4">
                        <Package2 className="h-12 w-12 mx-auto mb-2 opacity-50" />
                        <div className="text-sm">No inventory logs found</div>
                        <div className="text-xs mt-1">
                          {activeFilters.length > 0 
                            ? "Try adjusting your filters"
                            : "Inventory changes will appear here when they occur"
                          }
                        </div>
                      </td>
                    </tr>
                  ) : (
                    logs.map((log, index) => (
                      <tr key={`${log.productId}-${log.timestamp}-${index}`} className="hover:bg-muted/30">
                        <td className="px-2 py-3 sm:px-4">
                          <div className="flex items-center gap-2 text-xs sm:text-sm whitespace-nowrap">
                            <Calendar className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground hidden sm:inline" />
                            <span>
                              {new Date(log.timestamp).toLocaleString('en-US', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </span>
                          </div>
                        </td>
                        <td className="px-2 py-3 sm:px-4">
                          <div className="min-w-[140px]">
                            <div className="font-medium text-xs sm:text-sm leading-tight">{log.productName}</div>
                            <div className="text-[10px] sm:text-xs text-muted-foreground mt-0.5">{log.sku}</div>
                          </div>
                        </td>
                        <td className="px-2 py-3 sm:px-4">
                          <div className="font-mono text-xs sm:text-sm whitespace-nowrap">
                            {formatChange(log)}
                          </div>
                        </td>
                        <td className="px-2 py-3 sm:px-4">
                          <Badge 
                            variant="outline" 
                            className={`font-mono text-[10px] sm:text-xs px-1.5 py-0.5 ${
                              log.minStockThreshold && log.finalStock < log.minStockThreshold 
                                ? "text-red-600 border-red-600" 
                                : ""
                            }`}
                          >
                            {log.finalStock}
                          </Badge>
                        </td>
                        <td className="px-2 py-3 sm:px-4 max-w-[200px]">
                          {log.reason ? (
                            <Badge variant={getReasonBadgeColor(log.reason)} className="text-[10px] sm:text-xs px-1.5 py-0.5 whitespace-nowrap">
                              {formatReason(log.reason)}
                            </Badge>
                          ) : (
                            <span className="text-muted-foreground text-xs sm:text-sm">-</span>
                          )}
                        </td>
                        <td className="px-2 py-3 sm:px-4">
                          <div className="text-xs sm:text-sm text-muted-foreground max-w-[160px] truncate">
                            {log.action}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Pagination */}
        {pagination && pagination.totalPages > 1 && (
          <div className="mt-4 flex justify-end border-t pt-4">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onPageChange?.(pagination.page - 1)}
                disabled={!pagination.hasPrev}
                className="h-8"
              >
                <ChevronLeft className="h-4 w-4" />
                <span className="hidden sm:inline">Previous</span>
              </Button>
              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(pagination.totalPages, 5) }, (_, i) => {
                  let pageNum;
                  if (pagination.totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (pagination.page <= 3) {
                    pageNum = i + 1;
                  } else if (pagination.page >= pagination.totalPages - 2) {
                    pageNum = pagination.totalPages - 4 + i;
                  } else {
                    pageNum = pagination.page - 2 + i;
                  }
                  return (
                    <Button
                      key={pageNum}
                      variant={pagination.page === pageNum ? "default" : "outline"}
                      size="sm"
                      onClick={() => onPageChange?.(pageNum)}
                      className="w-8 h-8 p-0 text-xs"
                    >
                      {pageNum}
                    </Button>
                  );
                })}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onPageChange?.(pagination.page + 1)}
                disabled={!pagination.hasNext}
                className="h-8"
              >
                <span className="hidden sm:inline">Next</span>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}