"use client";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Package } from "lucide-react";

interface Product {
  id: string;
  name: string;
  sku: string;
  categories: string;
  availableStock: number;
}

interface ProductAccessSummaryProps {
  selectedProducts: string[];
  products: Product[];
  title?: string;
  description?: string;
}

export function ProductAccessSummary({
  selectedProducts,
  products,
  title = "Client-Specific Product Access Summary",
  description = "Products exclusively assigned to this client",
}: ProductAccessSummaryProps) {
  const selectedProductCount = selectedProducts.length;
  const totalProducts = products.length;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package className="h-5 w-5" />
          {title}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Products Selected</CardTitle>
                <CardDescription>
                  Client can access {selectedProductCount} of {totalProducts}{" "}
                  products
                </CardDescription>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-3xl font-bold text-primary">
                  {selectedProductCount}
                </span>
                <span className="text-sm text-muted-foreground">
                  /{totalProducts}
                </span>
              </div>
            </div>
          </CardHeader>
        </Card>

        <h4 className="text-sm font-medium mb-2">Selected Categories:</h4>
        <div className="flex flex-wrap gap-2">
          {Array.from(
            new Set(
              products
                .filter((product) => selectedProducts.includes(product.id))
                .map((product) => product.categories)
            )
          ).map((category) => (
            <Badge key={category} variant="secondary" className="capitalize">
              {category
                ? category.replace(/([A-Z])/g, " $1").trim()
                : "No Category"}
            </Badge>
          ))}
        </div>

        <p className="text-sm text-muted-foreground mt-4">
          Configure detailed product access in the section below
        </p>
      </CardContent>
    </Card>
  );
}
