"use client";

import { useState, useMemo } from "react";
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
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search } from "lucide-react";
import { useCategoryManagement } from "@/hooks/use-category-management";
import { useSubcategoryManagement } from "@/hooks/use-subcategory-management";

interface Product {
  id: string;
  name: string;
  sku: string;
  categories: string;
  availableStock: number;
  categoryId?: string | null;
  subCategoryId?: string | null;
  category?: {
    id: string;
    name: string;
    displayName: string;
  } | null;
  subCategory?: {
    id: string;
    name: string;
  } | null;
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
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("all");
  const [selectedSubcategoryId, setSelectedSubcategoryId] = useState<string>("all");

  const { categories } = useCategoryManagement();
  const { subcategories, getSubcategoriesByCategory } = useSubcategoryManagement();

  // Filter subcategories based on selected category
  const availableSubcategories = useMemo(() => {
    if (selectedCategoryId === "all") return subcategories || [];
    return getSubcategoriesByCategory(selectedCategoryId) || [];
  }, [selectedCategoryId, subcategories, getSubcategoriesByCategory]);

  // Filter products based on search and filters
  const filteredProducts = useMemo(() => {
    let filtered = products;

    // Apply search filter
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter((product) => {
        const matchesName = product.name.toLowerCase().includes(search);
        const matchesSku = product.sku.toLowerCase().includes(search);
        const matchesStock = product.availableStock.toString().includes(search);
        const matchesCategory = product.category?.name.toLowerCase().includes(search) ||
                                product.category?.displayName.toLowerCase().includes(search);
        const matchesSubcategory = product.subCategory?.name.toLowerCase().includes(search);
        return matchesName || matchesSku || matchesStock || matchesCategory || matchesSubcategory;
      });
    }

    // Apply category filter
    if (selectedCategoryId !== "all") {
      filtered = filtered.filter((product) => product.categoryId === selectedCategoryId);
    }

    // Apply subcategory filter
    if (selectedSubcategoryId !== "all") {
      filtered = filtered.filter((product) => product.subCategoryId === selectedSubcategoryId);
    }

    return filtered;
  }, [products, searchTerm, selectedCategoryId, selectedSubcategoryId]);

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
        <div className="mb-4 flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by product name, SKU, stock, category, or subcategory..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={selectedCategoryId} onValueChange={(value) => {
            setSelectedCategoryId(value);
            setSelectedSubcategoryId("all"); // Reset subcategory when category changes
          }}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories?.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.displayName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={selectedSubcategoryId} onValueChange={setSelectedSubcategoryId}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Filter by subcategory" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Subcategories</SelectItem>
              {availableSubcategories.map((subcategory) => (
                <SelectItem key={subcategory.id} value={subcategory.id}>
                  {subcategory.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="rounded-md border">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr className="border-b">
                <th className="text-left p-4 font-medium">Select</th>
                <th className="text-left p-4 font-medium">Product Name</th>
                <th className="text-left p-4 font-medium">SKU</th>
                <th className="text-left p-4 font-medium">Category</th>
                <th className="text-left p-4 font-medium">Subcategory</th>
                <th className="text-left p-4 font-medium">Stock</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => (
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
                      {product.category?.displayName || product.category?.name || "No Category"}
                    </Badge>
                  </td>
                  <td className="p-4">
                    {product.subCategory ? (
                      <Badge variant="secondary" className="capitalize">
                        {product.subCategory.name}
                      </Badge>
                    ) : (
                      <span className="text-sm text-muted-foreground">-</span>
                    )}
                  </td>
                  <td className="p-4 text-sm">
                    {product.availableStock || 0} units
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-4 flex justify-between text-sm text-muted-foreground">
          <span>{selectedProductCount} of {totalProducts} products selected</span>
          {(searchTerm || selectedCategoryId !== "all" || selectedSubcategoryId !== "all") && (
            <span>Showing {filteredProducts.length} of {totalProducts} products</span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
