import { ShoppingCart } from "lucide-react";

interface PageHeaderProps {
  totalCartItems: number;
}

export function PageHeader({ totalCartItems }: PageHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold">Product Catalog</h1>
        <p className="text-muted-foreground">
          Browse and order from our complete product range
        </p>
      </div>
      <div className="flex items-center gap-2 font-medium">
        <ShoppingCart className="h-4 w-4 text-muted-foreground" />
        <span>
          {totalCartItems} item{totalCartItems !== 1 ? "s" : ""} in cart
        </span>
      </div>
    </div>
  );
}
