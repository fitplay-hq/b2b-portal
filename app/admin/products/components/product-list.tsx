import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Product } from "@/lib/generated/prisma";
import { ProductItem } from "./product-item";
import { EmptyState } from "./empty-state";
import { SortOption } from "@/hooks/use-product-filters";

type ProductWithCategory = Product & { 
  category?: { 
    displayName: string; 
    name: string; 
    id: string; 
  } 
};

interface ProductListProps {
  products: ProductWithCategory[];
  allProducts: ProductWithCategory[];
  onEdit: (product: ProductWithCategory) => void;
  onDelete: (productId: string) => void;
  onManageInventory: (product: ProductWithCategory) => void;
  hasProductsInitially: boolean;
  selectedSort: SortOption | undefined;
}

export function ProductList({
  products,
  allProducts,
  selectedSort,
  onEdit,
  onDelete,
  onManageInventory,
  hasProductsInitially,
}: ProductListProps) {
  // If not "All Categories" or filtered, show normal list
  if (selectedSort !== "category" || products.length !== allProducts.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Products ({products.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {products.length > 0 ? (
              products.map((product) => (
                <ProductItem
                  key={product.id}
                  product={product}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  onManageInventory={onManageInventory}
                />
              ))
            ) : (
              <EmptyState
                message={
                  hasProductsInitially
                    ? "Try adjusting your search or filter criteria"
                    : "Add your first product to get started"
                }
              />
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  // Group products by category when showing all categories
  const groupedProducts = products.reduce((acc, product) => {
    // Prioritize relationship-based category, fallback to enum
    const categoryKey = product.category?.displayName || product.categories || 'Uncategorized';
    if (!acc[categoryKey]) {
      acc[categoryKey] = [];
    }
    acc[categoryKey].push(product);
    return acc;
  }, {} as Record<string, Product[]>);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Products ({products.length})</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {Object.entries(groupedProducts).map(
            ([category, categoryProducts]) => (
              <div key={category} className="space-y-4">
                <div className="border-b pb-2 mb-4">
                  <h3 className="text-lg font-semibold">
                    {category === 'Uncategorized' ? category : category}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    ({categoryProducts.length} items)
                  </p>
                </div>
                {categoryProducts.map((product) => (
                  <ProductItem
                    key={product.id}
                    product={product}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    onManageInventory={onManageInventory}
                  />
                ))}
              </div>
            )
          )}
        </div>
      </CardContent>
    </Card>
  );
}
