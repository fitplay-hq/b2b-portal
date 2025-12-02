import { RefreshCw, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PageHeaderProps {
  totalCartItems: number;
  onRefresh?: () => void;
  isRefreshing?: boolean;
}

export function PageHeader({ totalCartItems, onRefresh, isRefreshing }: PageHeaderProps) {
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
        <div className="flex items-center gap-2 font-medium">
          <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          <span>
            {totalCartItems} item{totalCartItems !== 1 ? "s" : ""} in cart
          </span>
        </div>
      </div>
    </div>
  );
}
