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

// Extended Product type that includes the category relationship
type ProductWithRelations = Product & {
  category?: ProductCategory | null;
  subCategory?: { name: string; shortCode: string } | null;
  companies?: Company[];
};

// Function to convert enum values to human-friendly names
const getHumanFriendlyCategoryName = (category: string): string => {
  const friendlyNames: Record<string, string> = {
    stationery: "Stationery",
    accessories: "Accessories",
    funAndStickers: "Fun & Stickers",
    drinkware: "Drinkware",
    apparel: "Apparel",
    travelAndTech: "Travel & Tech",
    books: "Books",
    welcomeKit: "Welcome Kit",
  };

  if (friendlyNames[category]) {
    return friendlyNames[category];
  }

  return category
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/([A-Z])([A-Z][a-z])/g, "$1 $2")
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
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
      <CardContent className="p-3 flex-grow flex flex-col">
        <div className="flex flex-col gap-2 flex-grow">
          <div className="min-h-0">
            <CardTitle className="text-sm leading-tight mb-1 overflow-hidden">
              <span className="block truncate" title={product.name}>{product.name}</span>
            </CardTitle>
            <Badge variant="secondary" className="text-xs w-fit mb-1">
              {getHumanFriendlyCategoryName(product.categories && product.categories[0]
                ? product.categories[0]
                : "Uncategorized")}
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
          <Button
            onClick={() => onEdit(product)}
            variant="outline"
            size="sm"
            className="flex-1 text-xs h-8"
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            onClick={() => onManageInventory(product)}
            variant="outline"
            size="sm"
            className="flex-1 text-xs h-8"
          >
            <Package className="h-4 w-4" />
          </Button>
          <Button
            onClick={() => onDelete(product.id)}
            variant="outline"
            size="sm"
            className="flex-1 text-xs h-8 text-destructive hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}