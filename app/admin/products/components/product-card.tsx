import { Product, ProductCategory, Company } from "@/lib/generated/prisma";
import {
  Card,
  CardContent,
  CardFooter,
  CardTitle,
} from "@/components/ui/card";
import { ImageWithFallback } from "@/components/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, Package } from "lucide-react";
import { $Enums } from "@/lib/generated/prisma";
import { usePermissions } from "@/hooks/use-permissions";

// Extended Product type that includes the category relationship
type ProductWithRelations = Product & {
  category?: ProductCategory | null;
  subCategory?: { name: string; shortCode: string } | null;
  companies?: Company[];
};

interface AdminProductCardProps {
  product: ProductWithRelations;
  onEdit: (product: ProductWithRelations) => void;
  onDelete: (productId: string) => void;
  onManageInventory: (product: ProductWithRelations) => void;
}

export function AdminProductCard({
  product,
  onEdit,
  onDelete,
  onManageInventory,
}: AdminProductCardProps) {
  const { actions } = usePermissions();
  const isLowStock = product.minStockThreshold && product.availableStock <= product.minStockThreshold;
  const isOutOfStock = product.availableStock === 0;

  return (
    <Card className="flex flex-col h-full overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200 p-0">
      <div className="relative h-48 w-full overflow-hidden">
        <ImageWithFallback
          src={`${product.images[0]}?v=${product.updatedAt || Date.now()}`}
          alt={product.name}
          className="w-full h-full object-cover object-center rounded-t-lg"
        />
        {isOutOfStock && (
          <div className="absolute inset-0 bg-background/70 flex items-center justify-center">
            <Badge variant="destructive" className="text-xs">Out of Stock</Badge>
          </div>
        )}
        {isLowStock && !isOutOfStock && (
          <div className="absolute top-2 right-2">
            <Badge variant="outline" className="text-xs bg-yellow-100 text-yellow-800 border-yellow-300">
              Low Stock
            </Badge>
          </div>
        )}
      </div>
      <CardContent className="px-3 pb-3 pt-0 flex-grow flex flex-col">
        <div className="flex flex-col gap-1 flex-grow">
          <div className="min-h-0">
            <CardTitle className="text-sm leading-tight mb-1">
              <span className="block line-clamp-2" title={product.name}>{product.name}</span>
            </CardTitle>
            <Badge variant="secondary" className="text-xs w-fit mb-1">
              {product.category?.displayName || product.category?.name || "Uncategorized"}
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground truncate">SKU: {product.sku}</p>
          <div className="flex flex-col gap-1 mt-auto">
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground">
                Stock: {product.availableStock}
              </p>
              {product.minStockThreshold && (
                <p className="text-xs text-muted-foreground">
                  Min: {product.minStockThreshold}
                </p>
              )}
            </div>
            {product.price && (
              <p className="text-sm font-medium text-primary">₹{product.price}</p>
            )}
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground">
                Created: {new Date(product.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-3 pt-0">
        <div className="flex gap-1 w-full">
          {actions.products.edit && (
            <Button
              onClick={() => onEdit(product)}
              variant="outline"
              size="sm"
              className="flex-1 text-xs h-8"
            >
              <Edit className="h-4 w-4" />
            </Button>
          )}
          {actions.inventory?.edit && (
            <Button
              onClick={() => onManageInventory(product)}
              variant="outline"
              size="sm"
              className="flex-1 text-xs h-8"
            >
              <Package className="h-4 w-4" />
            </Button>
          )}
          {actions.products.delete && (
            <Button
              onClick={() => onDelete(product.id)}
              variant="outline"
              size="sm"
              className="flex-1 text-xs h-8 text-destructive hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
}