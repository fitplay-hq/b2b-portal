import { Product, Category } from "@/lib/generated/prisma";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { ProductCard } from "./product-card";

interface ProductGridProps {
  products: Product[];
  allProducts: Product[];
  selectedCategory: string;
  getCartQuantity: (productId: string) => number;
  onAddToCartClick: (product: Product) => void;
  onClearFilters: () => void;
}

export function ProductGrid({
  products,
  allProducts,
  selectedCategory,
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

  // If not "All Categories" or products come from filtered set, show normal grid
  if (
    selectedCategory !== "All Categories" ||
    products.length !== allProducts.length
  ) {
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

  // Group products by category when showing all categories
  const groupedProducts = products.reduce((acc, product) => {
    const category = product.categories;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(product);
    return acc;
  }, {} as Record<Category, Product[]>);

  return (
    <div className="space-y-8">
      {Object.entries(groupedProducts).map(([category, categoryProducts]) => (
        <div key={category} className="space-y-4">
          <h3 className="text-2xl font-semibold capitalize">
            {category.replace(/([a-z])([A-Z])/g, "$1 $2").toLowerCase()}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {categoryProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                cartQuantity={getCartQuantity(product.id)}
                onAddToCartClick={onAddToCartClick}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
