"use client";

import { useState } from "react";
import Layout from "@/components/layout";
import { ClientInventoryLogsTable } from "@/components/client-inventory-logs-table";
import { useClientInventoryLogs, ClientInventoryLogsFilters } from "@/data/inventory/client.hooks";
import { usePermissions } from "@/hooks/use-permissions";
import { useDebouncedSearch } from "@/hooks/use-debounced-search";
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
  FileSpreadsheet,
  Package2
} from "lucide-react";

export default function ClientInventoryLogsPage() {
  const { exportData, exportLoading } = useInventoryExport();
  
  const [filters, setFilters] = useState<ClientInventoryLogsFilters>({
    period: "30d",
  });

  const [advancedFilters, setAdvancedFilters] = useState({
    dateFrom: "",
    dateTo: "",
    productId: "",
    reason: "",
  });

  // Debounced search hook with 2.5 second delay for automatic search
  const { searchValue, handleSearch } = useDebouncedSearch((searchTerm: string) => {
    setFilters(prev => ({ 
      ...prev, 
      search: searchTerm || undefined
    }));
  }, 2500);

  // Immediate search function for Enter key
  const handleImmediateSearch = (searchTerm: string) => {
    setFilters(prev => ({ 
      ...prev, 
      search: searchTerm || undefined
    }));
  };

  const { logs, count, error, isLoading } = useClientInventoryLogs(filters);

  const handleFilterChange = (newFilters: Record<string, string>) => {
    const cleanFilters = Object.fromEntries(
      Object.entries(newFilters).filter(([, value]) => value !== "")
    );
    
    setAdvancedFilters(prev => ({ ...prev, ...newFilters }));
    
    setFilters(prev => ({
      ...prev,
      ...cleanFilters,
    }));
  };

  const resetFilters = () => {
    setFilters({
      period: "30d",
    });
    setAdvancedFilters({
      dateFrom: "",
      dateTo: "",
      productId: "",
      reason: "",
    });
    handleSearch("");
  };

  const getActiveFilters = () => {
    const activeFilters = [];
    
    if (searchValue) {
      activeFilters.push({
        key: 'search',
        label: 'Search',
        value: searchValue,
        icon: FileText
      });
    }
    
    if (advancedFilters.dateFrom) {
      activeFilters.push({
        key: 'dateFrom',
        label: 'From Date',
        value: new Date(advancedFilters.dateFrom).toLocaleDateString(),
        icon: Calendar
      });
    }
    
    if (advancedFilters.dateTo) {
      activeFilters.push({
        key: 'dateTo',
        label: 'To Date',
        value: new Date(advancedFilters.dateTo).toLocaleDateString(),
        icon: Calendar
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
    if (filterKey === 'search') {
      handleSearch("");
    } else {
      // Update advanced filters state
      const updatedAdvancedFilters = { ...advancedFilters, [filterKey]: '' };
      setAdvancedFilters(updatedAdvancedFilters);
      
      // Update main filters state to trigger API call
      setFilters(prev => {
        const newFilters = { ...prev };
        delete newFilters[filterKey as keyof typeof newFilters];
        return newFilters;
      });
    }
  };

  const handleExport = async (format: 'xlsx' | 'pdf') => {
    // Convert current filters to export format matching /api/inventoryLogs expectations
    const exportFilters = {
      dateFrom: advancedFilters.dateFrom || undefined,
      dateTo: advancedFilters.dateTo || undefined,
      search: searchValue || undefined,
      reason: advancedFilters.reason || undefined,
      period: !advancedFilters.dateFrom && !advancedFilters.dateTo ? filters.period : undefined,
    };

    console.log('Starting client inventory export:', { format, exportFilters });
    await exportData(format, exportFilters);
  };

  if (error) {
    return (
      <Layout isClient={true}>
        <div className="text-center text-destructive p-8">
          Failed to load inventory logs: {error.message}
        </div>
      </Layout>
    );
  }

  return (
    <Layout isClient={true}>
        <div className="flex flex-col h-full px-2 sm:px-0">
          <div className="mb-4 sm:mb-6">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-4 sm:mb-6">
              <div className="min-w-0 flex-1">
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight flex items-center gap-2">
                  <Package2 className="h-6 w-6 sm:h-8 sm:w-8" />
                  My Inventory Logs
                </h1>
                <p className="text-sm sm:text-base text-muted-foreground">
                  Track changes to your assigned product inventory
                </p>
              </div>
              
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="outline" 
                      disabled={exportLoading !== null}
                      className="flex items-center gap-2 w-full sm:w-auto text-xs sm:text-sm"
                    >
                      {exportLoading ? (
                        <>
                          <div className="h-3 w-3 sm:h-4 sm:w-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
                          Exporting...
                        </>
                      ) : (
                        <>
                          <Download className="h-3 w-3 sm:h-4 sm:w-4" />
                          Export
                          <ChevronDown className="h-3 w-3 sm:h-4 sm:w-4" />
                        </>
                      )}
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
            <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200 shadow-sm mb-6">
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
              </CardContent>
            </Card>
          ) : (
            <Card className="bg-gradient-to-r from-gray-50 to-gray-100 border-gray-200 shadow-sm mb-6">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4 text-gray-500" />
                    <span className="text-sm font-medium text-gray-700">
                      No Filters Applied
                    </span>
                  </div>
                  <div className="text-xs text-gray-500">
                    Showing {count} inventory logs (last 30 days)
                  </div>
                </div>
                <div className="mt-2 text-xs text-gray-600">
                  🔍 Use the search bar or filters to narrow down results by date, product, or reason
                </div>
              </CardContent>
            </Card>
          )}

          <div className="flex-1">
            <ClientInventoryLogsTable
              logs={logs}
              isLoading={isLoading}
              onSearch={handleSearch}
              onImmediateSearch={handleImmediateSearch}
              onFilterChange={handleFilterChange}
              showFilters={true}
              title="My Inventory Movements"
              description="Track changes to products you manage"
              searchValue={searchValue}
              onResetFilters={resetFilters}
              activeFilters={getActiveFilters()}
              currentFilters={advancedFilters}
            />
          </div>
        </div>
      </Layout>
  );
}