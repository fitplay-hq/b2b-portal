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

  // Group products by category
  const groupedProducts = products.reduce((groups, product) => {
    const category = product.category?.displayName || product.category?.name || 'Uncategorized';
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(product);
    return groups;
  }, {} as Record<string, ProductWithRelations[]>);

  // Sort categories alphabetically, but put "Uncategorized" last
  const sortedCategories = Object.keys(groupedProducts).sort((a, b) => {
    if (a === 'Uncategorized') return 1;
    if (b === 'Uncategorized') return -1;
    return a.localeCompare(b);
  });

  return (
    <div className="space-y-6">
      {sortedCategories.map((category) => (
        <div key={category}>
          <div className="flex items-center gap-2 mb-4 pb-2 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">{category}</h3>
            <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-sm font-medium">
              {groupedProducts[category].length}
            </span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {groupedProducts[category].map((product) => (
              <AdminProductCard
                key={product.id}
                product={product}
                onEdit={onEdit}
                onDelete={onDelete}
                onManageInventory={onManageInventory}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}