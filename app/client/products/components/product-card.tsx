import { Product } from "@/lib/generated/prisma";
import {
  Card,
  CardContent,
  CardFooter,
  CardTitle,
} from "@/components/ui/card";
import { ImageWithFallback } from "@/components/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Minus, Plus, X } from "lucide-react";
import { useSession } from "next-auth/react";
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
  onIncrementQuantity?: (productId: string) => void;
  onDecrementQuantity?: (productId: string) => void;
  onClearCart?: (productId: string) => void;
  isShowPrice?: boolean;
}

export function ProductCard({
  product,
  cartQuantity,
  onAddToCartClick,
  onIncrementQuantity,
  onDecrementQuantity,
  onClearCart,
  isShowPrice = false,
}: ProductCardProps) {
  const isInStock = product.availableStock > 0;
   const { data: session, status } = useSession();
   const user = session?.user;
  const DEMO_EMAIL = "demo.github@fitplaysolutions.com";
const isDemoUser = user?.email === DEMO_EMAIL;


  return (
    <Card className="flex flex-col h-full overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200 p-0">
      <div className="relative h-48 w-full overflow-hidden">
        <ImageWithFallback
          src={`${product.images[0]}?v=${product.updatedAt || Date.now()}`}
          alt={product.name}
          className="w-full h-full object-cover object-center rounded-t-lg"
        />
        {!isInStock && (
          <div className="absolute inset-0 bg-background/70 flex items-center justify-center">
            <Badge variant="destructive" className="text-xs">Out of Stock</Badge>
          </div>
        )}
      </div>
      <CardContent className="px-3 pb-3 pt-0 flex-grow flex flex-col">
        <div className="flex flex-col gap-1 flex-grow">
          <div className="min-h-0">
            <CardTitle className="text-sm leading-tight mb-1 overflow-hidden">
              <span className="block line-clamp-2" title={product.name}>{product.name}</span>
            </CardTitle>
            <Badge variant="secondary" className="text-xs w-fit mb-1">
              {(product as any).subCategory?.name || "Uncategorized"}
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground truncate">SKU: {product.sku}</p>
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
            {isShowPrice && product.price && (
              <p className="text-sm font-medium text-primary">₹{product.price}</p>
            )}
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground">
                Created: {new Date(product.createdAt).toLocaleDateString('en-GB')}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
      {!isDemoUser && (
      <CardFooter className="p-3 pt-0">
        {cartQuantity > 0 ? (
          <div className="w-full flex items-center gap-2">
            <div className="flex-1 border rounded-md overflow-hidden flex items-stretch">
              <button
                onClick={() => onDecrementQuantity?.(product.id)}
                className="flex-1 py-2 hover:bg-muted transition-colors border-r flex items-center justify-center"
              >
                <Minus className="h-4 w-4" />
              </button>
              <div className="flex-1 py-2 flex items-center justify-center font-semibold text-sm border-r">
                {cartQuantity}
              </div>
              <button
                onClick={() => onIncrementQuantity?.(product.id)}
                disabled={!isInStock}
                className="flex-1 py-2 hover:bg-muted transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
            <button
              onClick={() => onClearCart?.(product.id)}
              className="p-2 rounded-md border hover:bg-destructive hover:text-destructive-foreground transition-colors"
              title="Remove from cart"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        ) : (
          <Button
            onClick={() => onAddToCartClick(product)}
            disabled={!isInStock}
            className="w-full text-sm h-8"
            size="sm"
          >
            <ShoppingCart className="h-3 w-3 mr-2" />
            {isInStock ? "Add to Cart" : "Out of Stock"}
          </Button>
        )}
      </CardFooter>
      )
}
    </Card>
  );
}
