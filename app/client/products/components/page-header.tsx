import { RefreshCw, Download, FileSpreadsheet, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import { toast } from "sonner";

interface PageHeaderProps {
  totalCartItems: number;
  onRefresh?: () => void;
  isRefreshing?: boolean;
  searchTerm?: string;
  selectedCategory?: string;
  stockStatus?: string;
  sortBy?: string;
}

export function PageHeader({ totalCartItems, onRefresh, isRefreshing, searchTerm, selectedCategory, stockStatus, sortBy }: PageHeaderProps) {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async (format: 'xlsx' | 'pdf') => {
    try {
      setIsExporting(true);
      toast.info(`Preparing ${format.toUpperCase()} export...`);

      // Build query params with filters
      const params = new URLSearchParams({
        type: 'inventory',
        format: format
      });
      
      if (searchTerm && searchTerm.trim()) {
        params.append('search', searchTerm.trim());
      }
      
      if (selectedCategory && selectedCategory !== 'All Categories') {
        params.append('category', selectedCategory);
      }
      
      if (stockStatus && stockStatus !== 'all') {
        params.append('stockStatus', stockStatus);
      }
      
      if (sortBy) {
        params.append('sortBy', sortBy);
      }

      const response = await fetch(`/api/admin/analytics/export?${params.toString()}`);
      
      if (!response.ok) {
        throw new Error('Export failed');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `products_export_${new Date().toISOString().split('T')[0]}.${format === 'xlsx' ? 'xlsx' : 'pdf'}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast.success(`${format.toUpperCase()} exported successfully!`);
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Failed to export data');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold">Product Catalog</h1>
        <p className="text-muted-foreground">
          Browse and order from our complete product range
        </p>
      </div>
      <div className="flex items-center gap-4">
        {onRefresh && (
          <Button
            variant="outline"
            size="sm"
            onClick={onRefresh}
            disabled={isRefreshing}
            className="gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        )}
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              disabled={isExporting}
              className="gap-2"
            >
              <Download className={`h-4 w-4 ${isExporting ? 'animate-bounce' : ''}`} />
              Export
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => handleExport('xlsx')} disabled={isExporting}>
              <FileSpreadsheet className="h-4 w-4 mr-2 text-green-600" />
              Export as Excel
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleExport('pdf')} disabled={isExporting}>
              <FileText className="h-4 w-4 mr-2 text-red-600" />
              Export as PDF
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <div className="text-sm text-muted-foreground">
          {totalCartItems} item{totalCartItems !== 1 ? "s" : ""}
        </div>
      </div>
    </div>
  );
}
