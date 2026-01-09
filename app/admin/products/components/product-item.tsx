import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ImageWithFallback } from "@/components/image";
import { Product, ProductCategory, Company } from "@/lib/generated/prisma";
import { Edit, Trash2, Package } from "lucide-react";
import { usePermissions } from "@/hooks/use-permissions";

// Extended Product type that includes the category relationship
type ProductWithRelations = Product & {
  category?: ProductCategory | null;
  subCategory?: { name: string; shortCode: string } | null;
  companies?: Company[];
};

interface ProductItemProps {
  product: ProductWithRelations;
  onEdit: (product: ProductWithRelations) => void;
  onDelete: (productId: string) => void;
  onManageInventory: (product: ProductWithRelations) => void;
}

export function ProductItem({
  product,
  onEdit,
  onDelete,
  onManageInventory,
}: ProductItemProps) {
  const { actions } = usePermissions();
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 p-3 sm:p-4 border rounded-lg">
      <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
        <div className="w-12 h-12 sm:w-16 sm:h-16 flex-shrink-0">
          <ImageWithFallback
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover rounded"
          />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1 sm:gap-2 flex-wrap mb-1">
            <h3 className="font-medium text-sm sm:text-base truncate">{product.name}</h3>
            {product.brand && (
              <Badge variant="outline" className="text-xs">
                {product.brand}
              </Badge>
            )}
            <Badge variant="secondary" className="text-xs">
              {product.category?.displayName || product.category?.name || "Uncategorized"}
            </Badge>
            {product.availableStock === 0 && (
              <Badge variant="destructive" className="text-xs">Out of Stock</Badge>
            )}
            {product.availableStock > 0 && product.minStockThreshold && product.availableStock < product.minStockThreshold && (
              <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100/80 text-xs">
                Low Stock
              </Badge>
            )}
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 text-xs sm:text-sm text-muted-foreground">
            <span className="truncate">SKU: {product.sku}</span>
            <div className="flex items-center gap-2 sm:gap-4">
              <span className="font-semibold text-foreground whitespace-nowrap">
                Stock: {product.availableStock}
              </span>
              {product.price && (
                <span className="whitespace-nowrap">
                  Price: ₹{product.price}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-1 sm:gap-2 w-full sm:w-auto">
        {actions.products.edit && (
          <Button variant="outline" size="sm" onClick={() => onEdit(product)} className="flex-1 sm:flex-initial text-xs sm:text-sm">
            <Edit className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-2" />
            <span className="hidden sm:inline">Edit</span>
          </Button>
        )}
        {actions.inventory?.edit && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => onManageInventory(product)}
            className="flex-1 sm:flex-initial text-xs sm:text-sm"
          >
            <Package className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-2" />
            <span className="hidden sm:inline">Inventory</span>
          </Button>
        )}
        {actions.products.delete && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => onDelete(product.id)}
            className="flex-1 sm:flex-initial text-destructive hover:text-destructive text-xs sm:text-sm"
          >
            <Trash2 className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-2" />
            <span className="hidden sm:inline">Delete</span>
          </Button>
        )}
      </div>
    </div>
  );
}
