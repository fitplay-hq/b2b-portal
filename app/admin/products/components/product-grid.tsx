import { Product, ProductCategory, Company } from "@/lib/generated/prisma";
import { AdminProductCard } from "./product-card";

// Extended Product type that includes the category relationship
type ProductWithRelations = Product & {
  category?: ProductCategory | null;
  subCategory?: { name: string; shortCode: string } | null;
  companies?: Company[];
};

interface AdminProductGridProps {
  products: ProductWithRelations[];
  onEdit: (product: ProductWithRelations) => void;
  onDelete: (productId: string) => void;
  onManageInventory: (product: ProductWithRelations) => void;
}

export function AdminProductGrid({
  products,
  onEdit,
  onDelete,
  onManageInventory,
}: AdminProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="flex items-center justify-center p-8 text-muted-foreground">
        <p>No products found</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
      {products.map((product) => (
        <AdminProductCard
          key={product.id}
          product={product}
          onEdit={onEdit}
          onDelete={onDelete}
          onManageInventory={onManageInventory}
        />
      ))}
    </div>
  );
}