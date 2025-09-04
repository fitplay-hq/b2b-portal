import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ImageWithFallback } from "@/components/image";
import { Product } from "@/lib/generated/prisma";
import { Edit, Trash2 } from "lucide-react";
import { getHumanFriendlyCategoryName } from "./product-filters";

interface ProductItemProps {
  product: Product;
  onEdit: (product: Product) => void;
  onDelete: (productId: string) => void;
}

export function ProductItem({ product, onEdit, onDelete }: ProductItemProps) {
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
            <Badge variant="secondary">
              {getHumanFriendlyCategoryName(product.categories)}
            </Badge>
            {product.availableStock === 0 && (
              <Badge variant="destructive">Out of Stock</Badge>
            )}
            {product.availableStock > 0 && product.availableStock < 50 && (
              <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100/80">
                Low Stock
              </Badge>
            )}
          </div>
          <p className="text-sm text-muted-foreground">
            SKU: {product.sku} • Stock: {product.availableStock}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" onClick={() => onEdit(product)}>
          <Edit className="h-4 w-4 md:mr-2" />
          <span className="hidden md:inline">Edit</span>
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onDelete(product.id)}
          className="text-destructive hover:text-destructive"
        >
          <Trash2 className="h-4 w-4 md:mr-2" />
          <span className="hidden md:inline">Delete</span>
        </Button>
      </div>
    </div>
  );
}
