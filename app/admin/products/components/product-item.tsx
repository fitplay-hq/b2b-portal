import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ImageWithFallback } from "@/components/image";
import { Product, ProductCategory, Company } from "@/lib/generated/prisma";
import { Edit, Trash2, Package } from "lucide-react";
import { getHumanFriendlyCategoryName } from "./product-filters";
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
    <div className="flex items-center justify-between p-4 border rounded-lg">
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 flex-shrink-0">
          <ImageWithFallback
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover rounded"
          />
        </div>
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-medium">{product.name}</h3>
            {product.brand && (
              <Badge variant="outline">
                {product.brand}
              </Badge>
            )}
            <Badge variant="secondary">
              {product.category?.displayName || 
               (product.category?.name ? getHumanFriendlyCategoryName(product.category.name) : null) ||
               (product.categories ? getHumanFriendlyCategoryName(product.categories) : null) ||
               "Uncategorized"}
            </Badge>
            {product.subCategory && (
              <Badge variant="secondary" className="text-xs">
                {product.subCategory.name}
              </Badge>
            )}
            {product.availableStock === 0 && (
              <Badge variant="destructive">Out of Stock</Badge>
            )}
            {product.availableStock > 0 && product.minStockThreshold && product.availableStock < product.minStockThreshold && (
              <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100/80">
                Low Stock
              </Badge>
            )}
          </div>
          <p className="text-sm text-muted-foreground">
            SKU: {product.sku} • <span className="font-semibold text-foreground">Stock: {product.availableStock}</span>
            {product.price && (
              <>
                {" • "}
                Price: ₹{product.price}
              </>
            )}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        {actions.products.edit && (
          <Button variant="outline" size="sm" onClick={() => onEdit(product)}>
            <Edit className="h-4 w-4 md:mr-2" />
            <span className="hidden md:inline">Edit</span>
          </Button>
        )}
        {actions.inventory?.edit && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => onManageInventory(product)}
          >
            <Package className="h-4 w-4 md:mr-2" />
            <span className="hidden md:inline">Inventory</span>
          </Button>
        )}
        {actions.products.delete && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => onDelete(product.id)}
            className="text-destructive hover:text-destructive"
          >
            <Trash2 className="h-4 w-4 md:mr-2" />
            <span className="hidden md:inline">Delete</span>
          </Button>
        )}
      </div>
    </div>
  );
}
