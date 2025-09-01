import { Product } from "@/lib/generated/prisma";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { ProductCard } from "./product-card";

interface ProductGridProps {
  products: Product[];
  getCartQuantity: (productId: string) => number;
  onAddToCartClick: (product: Product) => void;
  onClearFilters: () => void;
}

export function ProductGrid({
  products,
  getCartQuantity,
  onAddToCartClick,
  onClearFilters,
}: ProductGridProps) {
  if (products.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <div className="space-y-2">
            <h3 className="text-lg font-medium">No products found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search terms or category filter
            </p>
            <Button variant="outline" onClick={onClearFilters}>
              Clear Filters
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          cartQuantity={getCartQuantity(product.id)}
          onAddToCartClick={onAddToCartClick}
        />
      ))}
    </div>
  );
}
