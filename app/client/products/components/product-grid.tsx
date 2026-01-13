import { Product, Category } from "@/lib/generated/prisma";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { ProductCard } from "./product-card";
import { SortOption } from "@/hooks/use-product-filters";

interface ProductGridProps {
  products: Product[];
  allProducts: Product[];
  getCartQuantity: (productId: string) => number;
  onAddToCartClick: (product: Product) => void;
  onIncrementQuantity?: (productId: string) => void;
  onDecrementQuantity?: (productId: string) => void;
  onClearCart?: (productId: string) => void;
  onClearFilters: () => void;
  selectedSort: SortOption | undefined;
  isShowPrice?: boolean;
}

export function ProductGrid({
  products,
  allProducts,
  getCartQuantity,
  onAddToCartClick,
  onIncrementQuantity,
  onDecrementQuantity,
  onClearCart,
  onClearFilters,
  selectedSort,
  isShowPrice = false,
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

  // If not sorting by subcategory or products come from filtered set, show normal grid
  if (selectedSort !== "subcategory" || products.length !== allProducts.length) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 md:gap-6">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            cartQuantity={getCartQuantity(product.id)}
            onAddToCartClick={onAddToCartClick}
            onIncrementQuantity={onIncrementQuantity}
            onDecrementQuantity={onDecrementQuantity}
            onClearCart={onClearCart}
            isShowPrice={isShowPrice}
          />
        ))}
      </div>
    );
  }

  // Group products by subcategory when showing all subcategories
  const groupedProducts = products.reduce((acc, product) => {
    const subCategory = (product as any).subCategory?.name;
    if (!subCategory) {
      return acc;
    }
    if (!acc[subCategory]) {
      acc[subCategory] = [];
    }
    acc[subCategory].push(product);
    return acc;
  }, {} as Record<string, Product[]>);

  return (
    <div className="space-y-8">
      {Object.entries(groupedProducts).map(([subCategory, subCategoryProducts]) => (
        <div key={subCategory} className="space-y-4">
          <h3 className="text-2xl font-semibold capitalize">
            {subCategory}
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 md:gap-6">
            {subCategoryProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                cartQuantity={getCartQuantity(product.id)}
                onAddToCartClick={onAddToCartClick}
                onIncrementQuantity={onIncrementQuantity}
                onDecrementQuantity={onDecrementQuantity}
                onClearCart={onClearCart}
                isShowPrice={isShowPrice}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
