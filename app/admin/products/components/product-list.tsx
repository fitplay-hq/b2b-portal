import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Product, ProductCategory, Company } from "@/lib/generated/prisma";
import { ProductItem } from "./product-item";
import { EmptyState } from "./empty-state";
import { SortOption } from "@/hooks/use-product-filters";

// Extended Product type that includes the category relationship
type ProductWithRelations = Product & {
  category?: ProductCategory | null;
  subCategory?: { name: string; shortCode: string } | null;
  companies?: Company[];
};

interface ProductListProps {
  products: ProductWithRelations[];
  allProducts: ProductWithRelations[];
  onEdit: (product: ProductWithRelations) => void;
  onDelete: (productId: string) => void;
  onManageInventory: (product: ProductWithRelations) => void;
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
    // Prioritize the new category relationship, fall back to enum, then "Uncategorized"
    const categoryName = product.category?.displayName || 
                        product.category?.name || 
                        product.categories || 
                        "Uncategorized";
    
    if (!acc[categoryName]) {
      acc[categoryName] = [];
    }
    acc[categoryName].push(product);
    return acc;
  }, {} as Record<string, ProductWithRelations[]>);

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
                    {category === "Uncategorized" ? category : 
                     category.includes(" ") ? category : 
                     category.replace(/([a-z])([A-Z])/g, "$1 $2").toLowerCase()}
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
