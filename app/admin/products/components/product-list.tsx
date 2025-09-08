import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Product } from "@/lib/generated/prisma";
import { ProductItem } from "./product-item";
import { EmptyState } from "./empty-state";

interface ProductListProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (productId: string) => void;
  onManageInventory: (product: Product) => void;
  hasProductsInitially: boolean;
}

export function ProductList({
  products,
  onEdit,
  onDelete,
  onManageInventory,
  hasProductsInitially,
}: ProductListProps) {
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
