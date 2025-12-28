"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";

interface Product {
  id: string;
  name: string;
  sku: string;
  categories: string;
  availableStock: number;
}

interface ProductSelectionTableProps {
  selectedProducts: string[];
  products: Product[];
  onProductToggle: (productId: string) => void;
  onClearAll: () => void;
  onSelectAll: () => void;
  title?: string;
  description?: string;
}

export function ProductSelectionTable({
  selectedProducts,
  products,
  onProductToggle,
  onClearAll,
  onSelectAll,
  title = "Client-Specific Product Access",
  description = "Select products that this specific client should have access to (separate from company-wide products)",
}: ProductSelectionTableProps) {
  const selectedProductCount = selectedProducts.length;
  const totalProducts = products.length;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onClearAll}
            >
              Clear All
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onSelectAll}
            >
              Select All
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr className="border-b">
                <th className="text-left p-4 font-medium">Select</th>
                <th className="text-left p-4 font-medium">Product Name</th>
                <th className="text-left p-4 font-medium">SKU</th>
                <th className="text-left p-4 font-medium">Category</th>
                <th className="text-left p-4 font-medium">Stock</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} className="border-b hover:bg-muted/50">
                  <td className="p-4">
                    <Checkbox
                      checked={selectedProducts.includes(product.id)}
                      onCheckedChange={() => onProductToggle(product.id)}
                    />
                  </td>
                  <td className="p-4 font-medium">{product.name}</td>
                  <td className="p-4 text-sm text-muted-foreground">
                    {product.sku}
                  </td>
                  <td className="p-4">
                    <Badge variant="outline" className="capitalize">
                      {product.categories
                        ? product.categories.replace(/([A-Z])/g, " $1").trim()
                        : "No Category"}
                    </Badge>
                  </td>
                  <td className="p-4 text-sm">
                    {product.availableStock || 0} units
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-4 text-sm text-muted-foreground">
          {selectedProductCount} of {totalProducts} products selected
        </div>
      </CardContent>
    </Card>
  );
}
