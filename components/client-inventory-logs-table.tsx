"use client";

import { useState, useCallback, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
  Minus
} from "lucide-react";
import { ClientInventoryLogEntry } from "@/data/inventory/client.hooks";
import { cn } from "@/lib/utils";

interface ClientInventoryLogsTableProps {
  logs: ClientInventoryLogEntry[];
  isLoading: boolean;
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
  isLoading,
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
  
  const displayFilters = localFilters;
  const filters = useMemo(() => currentFilters || localFilters, [currentFilters, localFilters]);

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
    onFilterChange?.(displayFilters);
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
    
    const lowerReason = reason.toLowerCase();
    if (lowerReason.includes("sale") || lowerReason.includes("sold")) {
      return "default";
    } else if (lowerReason.includes("restock") || lowerReason.includes("add")) {
      return "secondary";
    } else if (lowerReason.includes("damaged") || lowerReason.includes("return")) {
      return "destructive";
    }
    return "outline";
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
                      value={displayFilters.dateFrom}
                      onChange={(e) => setLocalFilters(prev => ({ ...prev, dateFrom: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Date To</label>
                    <Input
                      type="date"
                      value={displayFilters.dateTo}
                      onChange={(e) => setLocalFilters(prev => ({ ...prev, dateTo: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Reason</label>
                    <Input
                      placeholder="e.g., Sale, Restock, Damaged"
                      value={displayFilters.reason}
                      onChange={(e) => setLocalFilters(prev => ({ ...prev, reason: e.target.value }))}
                    />
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

        <div className="rounded-md border">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="text-left p-4 font-medium">Date & Time</th>
                  <th className="text-left p-4 font-medium">Product</th>
                  <th className="text-left p-4 font-medium">Change</th>
                  <th className="text-left p-4 font-medium">Final Stock</th>
                  <th className="text-left p-4 font-medium">Reason</th>
                  <th className="text-left p-4 font-medium">Action</th>
                </tr>
              </thead>
              <tbody>
                {logs.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-8 text-muted-foreground">
                      <Package2 className="h-12 w-12 mx-auto mb-2 opacity-50" />
                      <div>No inventory logs found</div>
                      <div className="text-sm mt-1">
                        {activeFilters.length > 0 
                          ? "Try adjusting your filters"
                          : "Inventory changes will appear here when they occur"
                        }
                      </div>
                    </td>
                  </tr>
                ) : (
                  logs.map((log, index) => (
                    <tr key={`${log.productId}-${log.timestamp}-${index}`} className="border-b hover:bg-muted/30">
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{formatDate(log.timestamp)}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <div>
                          <div className="font-medium">{log.productName}</div>
                          <div className="text-sm text-muted-foreground">SKU: {log.sku}</div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="font-mono text-sm">
                          {formatChange(log)}
                        </div>
                      </td>
                      <td className="p-4">
                        <Badge variant="outline" className="font-mono">
                          {log.finalStock}
                        </Badge>
                      </td>
                      <td className="p-4">
                        {log.reason ? (
                          <Badge variant={getReasonBadgeColor(log.reason)}>
                            {log.reason}
                          </Badge>
                        ) : (
                          <span className="text-muted-foreground text-sm">-</span>
                        )}
                      </td>
                      <td className="p-4">
                        <div className="text-sm text-muted-foreground max-w-xs truncate">
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

        {logs.length > 0 && (
          <div className="flex justify-between items-center mt-4 text-sm text-muted-foreground">
            <div>
              Showing {logs.length} inventory log{logs.length !== 1 ? 's' : ''}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}