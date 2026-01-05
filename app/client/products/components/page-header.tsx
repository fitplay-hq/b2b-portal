import { RefreshCw, ShoppingCart, Download, FileSpreadsheet, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface PageHeaderProps {
  totalCartItems: number;
  onRefresh?: () => void;
  isRefreshing?: boolean;
  searchTerm?: string;
  selectedCategory?: string;
}

export function PageHeader({ totalCartItems, onRefresh, isRefreshing, searchTerm, selectedCategory }: PageHeaderProps) {
  const [isAnimating, setIsAnimating] = useState(false);
  const [previousCount, setPreviousCount] = useState(totalCartItems);
  const [isExporting, setIsExporting] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (totalCartItems > previousCount) {
      setIsAnimating(true);
      const timer = setTimeout(() => setIsAnimating(false), 600);
      return () => clearTimeout(timer);
    }
    setPreviousCount(totalCartItems);
  }, [totalCartItems, previousCount]);

  const handleCartClick = () => {
    router.push('/client/cart');
  };

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

        <button
          onClick={handleCartClick}
          className="relative flex items-center gap-3 px-4 py-2 hover:bg-primary/5 rounded-lg transition-colors group"
        >
          <div className="relative">
            <ShoppingCart className={`h-6 w-6 text-primary transition-all duration-300 group-hover:text-primary/80 ${
              isAnimating ? 'scale-125 animate-bounce' : 'scale-100'
            }`} />
            {totalCartItems > 0 && (
              <div className={`absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold shadow-lg transition-all duration-300 ${
                isAnimating ? 'scale-125 animate-pulse' : 'scale-100'
              }`}>
                {totalCartItems > 99 ? '99+' : totalCartItems}
              </div>
            )}
          </div>
          <div className="flex flex-col items-start">
            <span className="font-semibold text-primary group-hover:text-primary/80 transition-colors">
              {totalCartItems} item{totalCartItems !== 1 ? "s" : ""}
            </span>
            <span className="text-xs text-muted-foreground group-hover:text-muted-foreground/80">
              View Cart
            </span>
          </div>
        </button>
      </div>
    </div>
  );
}
