"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Package, Plus, Minus, Search, Loader2, X } from "lucide-react";
import { toast } from "sonner";
import { useProducts, useBulkInventory } from "@/data/product/admin.hooks";
import type { Product } from "@/lib/generated/prisma";

// Simple debounce hook
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

// Import React for useState and useEffect
import React from "react";

interface BulkInventoryDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

interface SelectedProduct extends Product {
  quantity: number;
  direction: "add" | "subtract";
  reason:
    | "NEW_PURCHASE"
    | "PHYSICAL_STOCK_CHECK"
    | "RETURN_FROM_PREVIOUS_DISPATCH";
}

export function BulkInventoryDialog({
  isOpen,
  onClose,
}: BulkInventoryDialogProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProducts, setSelectedProducts] = useState<SelectedProduct[]>(
    []
  );

  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const { products, isLoading: isSearching } = useProducts();
  const { updateBulkInventory, isBulkUpdating } = useBulkInventory();

  // Filter products based on search term
  const searchResults = React.useMemo(() => {
    if (!products) return [];
    const term = debouncedSearchTerm.trim().toLowerCase();
    if (!term) {
      // Show top 20 products by available stock when no search term
      return products
        .filter(p => p.availableStock > 0)
        .sort((a, b) => b.availableStock - a.availableStock)
        .slice(0, 20);
    }
    return products.filter(
      (product) =>
        product.name.toLowerCase().includes(term) ||
        product.sku?.toLowerCase().includes(term)
    );
  }, [products, debouncedSearchTerm]);

  const handleProductSelect = (product: Product, selected: boolean) => {
    if (selected) {
      const newSelectedProduct: SelectedProduct = {
        ...product,
        quantity: 1,
        direction: "add",
        reason: "PHYSICAL_STOCK_CHECK",
      };
      setSelectedProducts((prev) => [...prev, newSelectedProduct]);
    } else {
      setSelectedProducts((prev) => prev.filter((p) => p.id !== product.id));
    }
  };

  const handleUpdateProduct = (
    productId: string,
    updates: Partial<SelectedProduct>
  ) => {
    setSelectedProducts((prev) =>
      prev.map((product) =>
        product.id === productId ? { ...product, ...updates } : product
      )
    );
  };

  const handleRemoveProduct = (productId: string) => {
    setSelectedProducts((prev) => prev.filter((p) => p.id !== productId));
  };

  const handleBulkUpdate = async () => {
    if (selectedProducts.length === 0) {
      toast.error("Please select at least one product to update");
      return;
    }

    // Validate all products have valid data
    const invalidProducts = selectedProducts.filter(
      (product) => !product.quantity || product.quantity <= 0
    );

    if (invalidProducts.length > 0) {
      toast.error("All products must have a valid quantity greater than 0");
      return;
    }

    try {
      const inventoryUpdates = selectedProducts.map((product) => ({
        productId: product.id,
        quantity: product.quantity,
        direction: (product.direction === "add" ? "incr" : "dec") as
          | "incr"
          | "dec",
        inventoryUpdateReason: product.reason,
      }));

      await updateBulkInventory(inventoryUpdates);

      toast.success(
        `Successfully updated inventory for ${selectedProducts.length} product(s)`
      );
      setSelectedProducts([]);
      onClose();
    } catch (error) {
      toast.error("Failed to update inventory");
      console.error("Bulk inventory update error:", error);
    }
  };

  const handleClose = () => {
    setSelectedProducts([]);
    setSearchTerm("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-5xl max-h-[95vh] flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Bulk Inventory Update
          </DialogTitle>
          <DialogDescription>
            Search and select products to update their inventory in bulk
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4 min-h-0 flex-1">
          {/* Search Section */}
          <div className="flex-shrink-0">
            <Label htmlFor="search" className="text-sm font-medium">
              Search Products
            </Label>
            <div className="relative mt-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="search"
                placeholder="Search by product name or SKU... (⏎ to select first result, ⎋ to clear)"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 pr-8"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && searchResults.length > 0) {
                    const firstResult = searchResults[0];
                    const isSelected = selectedProducts.some(p => p.id === firstResult.id);
                    handleProductSelect(firstResult, !isSelected);
                    toast.success(`${isSelected ? 'Removed' : 'Added'} ${firstResult.name}`);
                  } else if (e.key === 'Escape') {
                    setSearchTerm("");
                  }
                }}
              />
              {searchTerm && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute right-1 top-1 h-6 w-6 p-0 hover:bg-gray-100"
                  onClick={() => setSearchTerm("")}
                >
                  <X className="h-3 w-3" />
                </Button>
              )}
              {isSearching && (
                <Loader2 className="absolute right-3 top-3 h-4 w-4 animate-spin text-muted-foreground" />
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 min-h-0">
            {/* Search Results - Compact List */}
            <div className="flex-shrink-0">
              <div className="flex items-center justify-between mb-2">
                <Label className="text-sm font-medium">
                  {debouncedSearchTerm 
                    ? `Search Results (${searchResults.length})` 
                    : `Popular Products by Stock (${searchResults.length})`
                  }
                </Label>
                {searchResults.length > 0 && (
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 text-xs px-3 bg-green-50 hover:bg-green-100 border-green-200 text-green-700"
                      onClick={() => {
                        let addedCount = 0;
                        searchResults.forEach(product => {
                          const isSelected = selectedProducts.some(p => p.id === product.id);
                          if (!isSelected) {
                            handleProductSelect(product, true);
                            addedCount++;
                          }
                        });
                        toast.success(`Added ${addedCount} product(s) to bulk update`);
                      }}
                    >
                      ✓ Select All ({searchResults.length})
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 text-xs px-3 bg-red-50 hover:bg-red-100 border-red-200 text-red-700"
                      onClick={() => {
                        let removedCount = 0;
                        searchResults.forEach(product => {
                          const isSelected = selectedProducts.some(p => p.id === product.id);
                          if (isSelected) {
                            handleProductSelect(product, false);
                            removedCount++;
                          }
                        });
                        if (removedCount > 0) {
                          toast.success(`Removed ${removedCount} product(s) from selection`);
                        }
                      }}
                    >
                      ✕ Deselect All
                    </Button>
                  </div>
                )}
              </div>
              <div className="border rounded-md">
                {searchResults.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    {debouncedSearchTerm ? `No products found matching "${debouncedSearchTerm}"` : "No products available"}
                  </p>
                ) : (
                  <div className="divide-y">
                    {searchResults.slice(0, 20).map((product) => {
                      const isSelected = selectedProducts.some(
                        (p) => p.id === product.id
                      );
                      return (
                        <div
                          key={product.id}
                          className={`flex items-center justify-between p-4 hover:bg-muted/50 cursor-pointer transition-all duration-200 border-l-4 ${
                            isSelected 
                              ? "bg-blue-50 border-l-blue-500 shadow-sm" 
                              : "border-l-transparent hover:border-l-gray-200"
                          }`}
                          onClick={() => {
                            handleProductSelect(product, !isSelected);
                            toast.success(`${isSelected ? 'Removed' : 'Added'} ${product.name}`, {
                              duration: 1000,
                            });
                          }}
                        >
                          <div className="flex items-center gap-4 min-w-0 flex-1">
                            <div className={`rounded-md p-1 ${isSelected ? 'bg-blue-100' : 'bg-gray-100'}`}>
                              <Checkbox
                                checked={isSelected}
                                onChange={() => {}}
                                className="data-[state=checked]:bg-blue-600"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <p className="text-sm font-semibold truncate text-gray-900">
                                  {product.name}
                                </p>
                                {isSelected && (
                                  <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-800 font-medium">
                                    ✓ Selected
                                  </Badge>
                                )}
                              </div>
                              <div className="flex items-center gap-3 mt-1">
                                <span className="text-xs text-gray-600 font-medium">
                                  SKU: {product.sku || "N/A"}
                                </span>
                                <span className="text-xs">•</span>
                                <span className="text-xs">
                                  Stock:{" "}
                                  <span className={`font-semibold ${
                                    product.availableStock === 0 
                                      ? "text-red-600" 
                                      : product.availableStock < 10 
                                        ? "text-orange-600" 
                                        : "text-green-600"
                                  }`}>
                                    {product.availableStock} units
                                  </span>
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center">
                            {isSelected ? (
                              <div className="text-blue-600">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                              </div>
                            ) : (
                              <div className="text-gray-400 hover:text-gray-600">
                                <Plus className="w-5 h-5" />
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Selected Products - Compact Grid */}
            <div className="flex-1 min-h-0">
              <div className="flex items-center justify-between mb-3">
                <Label className="text-base font-semibold text-gray-900">
                  Selected Products ({selectedProducts.length})
                </Label>
                {selectedProducts.length > 0 && (
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        // Quick set all to "Add 1 unit" for stock checks
                        setSelectedProducts(prev => 
                          prev.map(p => ({ ...p, direction: "add", quantity: 1, reason: "PHYSICAL_STOCK_CHECK" }))
                        );
                        toast.success("Set all to: Add 1 unit (Stock Check)");
                      }}
                      className="text-xs h-8 bg-green-50 hover:bg-green-100 border-green-200 text-green-700"
                    >
                      Quick: +1 Stock Check
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedProducts([])}
                      className="text-xs h-8 bg-red-50 hover:bg-red-100 border-red-200 text-red-700"
                    >
                      ✕ Clear All
                    </Button>
                  </div>
                )}
              </div>

              {selectedProducts.length === 0 ? (
                <div className="border rounded-md p-8 text-center">
                  <p className="text-sm text-muted-foreground">
                    Search for products above and select them to add to your
                    inventory update list
                  </p>
                </div>
              ) : (
                <div className="border rounded-md overflow-hidden">
                  <div>
                    {selectedProducts.map((product, index) => (
                      <div
                        key={product.id}
                        className="border-b last:border-b-0 p-4"
                      >
                        {/* Product Header */}
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-3">
                              <span className="text-xs font-medium text-muted-foreground">
                                #{index + 1}
                              </span>
                              <div>
                                <p className="text-sm font-medium">
                                  {product.name}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  Current: {product.availableStock} units
                                </p>
                              </div>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveProduct(product.id)}
                            className="h-6 w-6 p-0 hover:bg-red-100 hover:text-red-600"
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>

                        {/* Configuration Row - Improved */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                          {/* Direction */}
                          <div className="space-y-1">
                            <Label className="text-xs font-medium text-gray-700">Action</Label>
                            <Select
                              value={product.direction}
                              onValueChange={(value: "add" | "subtract") =>
                                handleUpdateProduct(product.id, {
                                  direction: value,
                                })
                              }
                            >
                              <SelectTrigger className="h-9 text-sm">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="add" className="text-sm">
                                  <Plus className="h-4 w-4 mr-2 inline text-green-600" />
                                  Add Stock
                                </SelectItem>
                                <SelectItem value="subtract" className="text-sm">
                                  <Minus className="h-4 w-4 mr-2 inline text-red-600" />
                                  Remove Stock
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          {/* Quantity */}
                          <div className="space-y-1">
                            <Label className="text-xs font-medium text-gray-700">Quantity</Label>
                            <div className="flex items-center gap-1">
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                className="h-9 w-9 p-0"
                                onClick={() => handleUpdateProduct(product.id, { quantity: Math.max(1, product.quantity - 1) })}
                              >
                                <Minus className="h-3 w-3" />
                              </Button>
                              <Input
                                type="number"
                                min="1"
                                value={product.quantity}
                                onChange={(e) =>
                                  handleUpdateProduct(product.id, {
                                    quantity: parseInt(e.target.value) || 1,
                                  })
                                }
                                className="h-9 text-center text-sm font-medium"
                              />
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                className="h-9 w-9 p-0"
                                onClick={() => handleUpdateProduct(product.id, { quantity: product.quantity + 1 })}
                              >
                                <Plus className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>

                          {/* Reason */}
                          <div className="space-y-1">
                            <Label className="text-xs font-medium text-gray-700">Reason</Label>
                            <Select
                              value={product.reason}
                              onValueChange={(
                                value:
                                  | "NEW_PURCHASE"
                                  | "PHYSICAL_STOCK_CHECK"
                                  | "RETURN_FROM_PREVIOUS_DISPATCH"
                              ) =>
                                handleUpdateProduct(product.id, {
                                  reason: value,
                                })
                              }
                            >
                              <SelectTrigger className="h-9 text-sm">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="NEW_PURCHASE" className="text-sm">
                                  📦 New Purchase
                                </SelectItem>
                                <SelectItem value="PHYSICAL_STOCK_CHECK" className="text-sm">
                                  📋 Physical Count
                                </SelectItem>
                                <SelectItem value="RETURN_FROM_PREVIOUS_DISPATCH" className="text-sm">
                                  📥 Return/Refund
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          {/* Preview */}
                          <div className="space-y-1">
                            <Label className="text-xs font-medium text-gray-700">New Stock</Label>
                            <div className={`h-9 px-3 rounded-md border flex items-center justify-center font-semibold text-sm ${
                              product.direction === "add" ? "bg-green-50 border-green-200 text-green-700" : "bg-red-50 border-red-200 text-red-700"
                            }`}>
                              {product.availableStock} → {" "}
                              {product.direction === "add"
                                ? product.availableStock + product.quantity
                                : Math.max(0, product.availableStock - product.quantity)
                              }
                            </div>
                          </div>
                        </div>

                        {/* Quick Action Buttons */}
                        <div className="flex gap-2 mt-3 pt-3 border-t border-gray-100">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="text-xs h-7 bg-blue-50 hover:bg-blue-100 border-blue-200 text-blue-700"
                            onClick={() => handleUpdateProduct(product.id, { quantity: 1, direction: "add", reason: "PHYSICAL_STOCK_CHECK" })}
                          >
                            Quick: +1 Stock Check
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="text-xs h-7 bg-green-50 hover:bg-green-100 border-green-200 text-green-700"
                            onClick={() => handleUpdateProduct(product.id, { quantity: 5, direction: "add", reason: "NEW_PURCHASE" })}
                          >
                            Quick: +5 Purchase
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="text-xs h-7 bg-orange-50 hover:bg-orange-100 border-orange-200 text-orange-700"
                            onClick={() => handleUpdateProduct(product.id, { quantity: 10, direction: "add", reason: "NEW_PURCHASE" })}
                          >
                            Quick: +10 Purchase
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <Separator className="flex-shrink-0" />

          {/* Action Buttons */}
          <div className="flex justify-end gap-2 flex-shrink-0">
            <Button
              variant="outline"
              onClick={handleClose}
              disabled={isBulkUpdating}
            >
              Cancel
            </Button>
            <Button
              onClick={handleBulkUpdate}
              disabled={isBulkUpdating || selectedProducts.length === 0}
            >
              {isBulkUpdating ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  Update {selectedProducts.length} Product
                  {selectedProducts.length !== 1 ? "s" : ""}
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
