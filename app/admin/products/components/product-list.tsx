import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Product, Category } from "@/lib/generated/prisma";
import { ProductItem } from "./product-item";
import { EmptyState } from "./empty-state";

interface ProductListProps {
  products: Product[];
  allProducts: Product[];
  selectedCategory: string;
  onEdit: (product: Product) => void;
  onDelete: (productId: string) => void;
  onManageInventory: (product: Product) => void;
  hasProductsInitially: boolean;
}

export function ProductList({
  products,
  allProducts,
  selectedCategory,
  onEdit,
  onDelete,
  onManageInventory,
  hasProductsInitially,
}: ProductListProps) {
  // If not "All Categories" or filtered, show normal list
  if (
    selectedCategory !== "All Categories" ||
    products.length !== allProducts.length
  ) {
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
    const category = product.categories;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(product);
    return acc;
  }, {} as Record<Category, Product[]>);

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
                  <h3 className="text-lg font-semibold capitalize">
                    {category.replace(/([a-z])([A-Z])/g, "$1 $2").toLowerCase()}
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
