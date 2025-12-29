import { Product } from "@/lib/generated/prisma";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
  CardTitle,
} from "@/components/ui/card";
import { ImageWithFallback } from "@/components/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { $Enums } from "@/lib/generated/prisma";

// Function to convert enum values to human-friendly names
const getHumanFriendlyCategoryName = (category: string): string => {
  // Use the actual enum values from Prisma with friendly names
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

  // Check if we have a specific friendly name for this category
  if (friendlyNames[category]) {
    return friendlyNames[category];
  }

  // Fallback: Handle unknown categories
  // Convert camelCase to Title Case by splitting on capital letters
  return category
    .replace(/([a-z])([A-Z])/g, "$1 $2") // Add space between lowercase and uppercase
    .replace(/([A-Z])([A-Z][a-z])/g, "$1 $2") // Handle consecutive uppercase letters
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

interface ProductCardProps {
  product: Product;
  cartQuantity: number;
  onAddToCartClick: (product: Product) => void;
}

export function ProductCard({
  product,
  cartQuantity,
  onAddToCartClick,
}: ProductCardProps) {
  const isInStock = product.availableStock > 0;

  return (
    <Card className="flex flex-col h-full overflow-hidden">
      <CardHeader className="p-0">
        <div className="aspect-square relative">
          <ImageWithFallback
            src={`${product.images[0]}?v=${product.updatedAt || Date.now()}`}
            alt={product.name}
            className="w-full h-full object-cover rounded-t-lg"
          />
          {!isInStock && (
            <div className="absolute inset-0 bg-background/70 flex items-center justify-center">
              <Badge variant="destructive" className="text-xs">Out of Stock</Badge>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-3 flex-grow flex flex-col">
        <div className="flex flex-col gap-2 flex-grow">
          <div className="min-h-0">
            <CardTitle className="text-sm sm:text-base leading-tight mb-1 overflow-hidden">
              <span className="block truncate">{product.name}</span>
            </CardTitle>
            <Badge variant="secondary" className="text-xs w-fit">
              {getHumanFriendlyCategoryName(product.categories && product.categories[0]
                ? product.categories[0]
                : "Uncategorized")}
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground">SKU: {product.sku}</p>
          <div className="flex flex-col gap-1 mt-auto">
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground">
                Stock: {product.availableStock}
              </p>
              {cartQuantity > 0 && (
                <p className="text-xs font-semibold text-blue-600">
                  {cartQuantity} in cart
                </p>
              )}
            </div>
            {product.price && (
              <p className="text-sm font-medium">₹{product.price}</p>
            )}
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-3 pt-0">
        <Button
          onClick={() => onAddToCartClick(product)}
          disabled={!isInStock}
          className="w-full text-sm h-8 sm:h-9"
          size="sm"
        >
          <ShoppingCart className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
          {isInStock ? "Add to Cart" : "Out of Stock"}
        </Button>
      </CardFooter>
    </Card>
  );
}
