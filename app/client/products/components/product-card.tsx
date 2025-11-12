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
import { useCategories } from "@/hooks/use-category-management";

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
  const { categories } = useCategories();
  
  const getCategoryDisplayName = (categoryName: string) => {
    const category = categories.find(c => c.name === categoryName);
    return category?.displayName || categoryName;
  };

  return (
    <Card className="flex flex-col p-0">
      <CardHeader className="p-0">
        <div className="aspect-square relative">
          <ImageWithFallback
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover rounded-t-lg"
          />
          {!isInStock && (
            <div className="absolute inset-0 bg-background/70 flex items-center justify-center">
              <Badge variant="destructive">Out of Stock</Badge>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="px-4 flex-grow">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-base leading-tight">
            {product.name}
          </CardTitle>
          <Badge variant="secondary" className="text-xs shrink-0">
            {getCategoryDisplayName(product.categories)}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground mt-2">SKU: {product.sku}</p>
        <div className="flex items-end justify-between mt-4">
          <div className="flex flex-col gap-1">
            <p className="text-sm text-muted-foreground">
              Stock: {product.availableStock}
            </p>
            {product.price && (
              <p className="text-sm font-medium">Price: ₹{product.price}</p>
            )}
          </div>
          {cartQuantity > 0 && (
            <p className="text-xs font-semibold text-blue-600">
              {cartQuantity} in cart
            </p>
          )}
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button
          onClick={() => onAddToCartClick(product)}
          disabled={!isInStock}
          className="w-full"
        >
          <ShoppingCart className="h-4 w-4 mr-2" />
          {isInStock ? "Add to Cart" : "Out of Stock"}
        </Button>
      </CardFooter>
    </Card>
  );
}
