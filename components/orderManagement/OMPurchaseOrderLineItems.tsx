"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Trash2, Loader2, Search } from "lucide-react";
import { OMNewItemDialog } from "./OMNewItemDialog";
import { OMBrand, OMProduct } from "@/types/order-management";
import { SearchableSelect } from "@/components/ui/combobox";
import { useState } from "react";
import { toast } from "sonner";
import { OMNewBrandDialog } from "./OMNewBrandDialog";

export interface LineItem {
  tempId: string;
  id?: string;
  productId: string;
  itemName: string;
  quantity: number;
  rate: number;
  amount: number;
  gstPercentage: number;
  gstAmount: number;
  totalAmount: number;
  brandId: string;
  description: string;
}

interface OMPurchaseOrderLineItemsProps {
  lineItems: LineItem[];
  products: OMProduct[];
  brands: OMBrand[];
  onAddLineItem: () => void;
  onRemoveLineItem: (tempId: string) => void;
  onUpdateLineItem: (
    tempId: string,
    field: keyof LineItem,
    value: any,
    productOverride?: Partial<OMProduct>,
  ) => void;
  onNewItemAdded: (tempId: string, product: OMProduct) => void;
  onNewBrandAdded: (tempId: string, brand: OMBrand) => void;
}

export function OMPurchaseOrderLineItems({
  lineItems,
  products,
  brands,
  onAddLineItem,
  onRemoveLineItem,
  onUpdateLineItem,
  onNewItemAdded,
  onNewBrandAdded,
}: OMPurchaseOrderLineItemsProps) {
  const productOptions = products.map((p) => ({ value: p.id, label: p.name }));

  const handleProductChange = (tempId: string, productId: string) => {
    const product = products.find((p) => p.id === productId);
    if (product) {
      // Find associated brands for this product
      const productBrands = product.brands || [];

      // Update basic product info (rate, GST)
      onUpdateLineItem(tempId, "productId", productId);

      // If there's only one brand, auto-select it
      if (productBrands.length === 1) {
        onUpdateLineItem(tempId, "brandId", productBrands[0].id);
      } else {
        // Clear brand if multiple or zero brands exist, requiring user choice
        onUpdateLineItem(tempId, "brandId", "");
      }
    } else {
      onUpdateLineItem(tempId, "productId", productId);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-card p-4 rounded-xl border shadow-sm">
        <div>
          <h3 className="text-lg font-semibold text-foreground">
            Item Line Entries
          </h3>
          <p className="text-sm text-muted-foreground">
            Add products to your purchase order
          </p>
        </div>
        <Button type="button" onClick={onAddLineItem} size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Add Item
        </Button>
      </div>

      {/* Mobile View: Stacked Cards */}
      <div className="md:hidden space-y-4">
        {lineItems.length === 0 ? (
          <div className="text-center py-12 bg-card rounded-xl border border-dashed text-muted-foreground">
            <p>No items added.</p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onAddLineItem}
              className="mt-2"
            >
              <Plus className="h-4 w-4 mr-1" /> Add First Item
            </Button>
          </div>
        ) : (
          lineItems.map((item) => {
            const selectedProduct = products.find(
              (p) => p.id === item.productId,
            );
            const filteredBrandOptions =
              selectedProduct?.brands?.map((b) => ({
                value: b.id,
                label: b.name,
              })) || [];

            return (
              <div
                key={item.tempId}
                className="bg-card p-4 rounded-xl border shadow-sm space-y-4 relative"
              >
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => onRemoveLineItem(item.tempId)}
                  className="absolute top-2 right-2 text-destructive h-8 w-8 p-0"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>

                <div className="space-y-2">
                  <Label>Item</Label>
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <SearchableSelect
                        options={productOptions}
                        value={item.productId}
                        onValueChange={(val) =>
                          handleProductChange(item.tempId, val)
                        }
                        placeholder="Select item"
                        searchPlaceholder="Search items..."
                      />
                    </div>
                    <OMNewItemDialog
                      brands={brands}
                      onItemAdded={(product) =>
                        onNewItemAdded(item.tempId, product)
                      }
                      trigger={
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="h-10 w-10 p-0 border"
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      }
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Brand</Label>
                    <SearchableSelect
                      options={filteredBrandOptions}
                      value={item.brandId}
                      onValueChange={(val) =>
                        onUpdateLineItem(item.tempId, "brandId", val)
                      }
                      placeholder="Brand"
                      disabled={
                        !item.productId || filteredBrandOptions.length === 0
                      }
                    />
                    <OMNewBrandDialog
                      productId={item.productId}
                      currentBrandIds={selectedProduct?.brands?.map(
                        (b) => b.id,
                      )}
                      onBrandAdded={(brand) =>
                        onNewBrandAdded(item.tempId, brand)
                      }
                      trigger={
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="h-10 w-10 p-0 border"
                          disabled={!item.productId}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      }
                    />
                  </div>
                  <div className="space-y-2 w-30">
                    <Label>Qty</Label>
                    <Input
                      placeholder="0"
                      type="number"
                      min="0"
                      value={item.quantity || ""}
                      onChange={(e) =>
                        onUpdateLineItem(
                          item.tempId,
                          "quantity",
                          e.target.value === ""
                            ? 0
                            : parseInt(e.target.value) || 0,
                        )
                      }
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Description</Label>
                  <Input
                    value={item.description}
                    onChange={(e) =>
                      onUpdateLineItem(
                        item.tempId,
                        "description",
                        e.target.value,
                      )
                    }
                    placeholder="Description"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Rate</Label>
                    <Input
                      placeholder="0"
                      type="number"
                      min="0"
                      step="0.01"
                      value={item.rate || ""}
                      onChange={(e) =>
                        onUpdateLineItem(
                          item.tempId,
                          "rate",
                          e.target.value === ""
                            ? 0
                            : parseFloat(e.target.value) || 0,
                        )
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>GST %</Label>
                    <Select
                      value={item.gstPercentage.toString()}
                      onValueChange={(val) =>
                        onUpdateLineItem(
                          item.tempId,
                          "gstPercentage",
                          parseFloat(val),
                        )
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0">0%</SelectItem>
                        <SelectItem value="5">5%</SelectItem>
                        <SelectItem value="18">18%</SelectItem>
                        <SelectItem value="28">28%</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="pt-2 border-t flex justify-between items-center text-sm">
                  <div className="text-muted-foreground">
                    GST: ₹{item.gstAmount.toLocaleString("en-IN")}
                  </div>
                  <div className="font-bold text-primary">
                    Total: ₹{item.totalAmount.toLocaleString("en-IN")}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Desktop View: Table */}
      <div className="hidden md:block overflow-x-auto rounded-xl border bg-card shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50 hover:bg-muted/50">
              <TableHead className="min-w-50">Item</TableHead>
              <TableHead className="min-w-36">Brand</TableHead>
              <TableHead className="min-w-40">Description</TableHead>
              <TableHead className="w-29">Qty</TableHead>
              <TableHead className="w-29">Rate</TableHead>
              <TableHead className="w-25">Amount</TableHead>
              <TableHead className="w-25">GST %</TableHead>
              <TableHead className="w-30">GST Amt</TableHead>
              <TableHead className="w-25">Total</TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {lineItems.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={10}
                  className="text-center py-12 text-muted-foreground"
                >
                  <div className="flex flex-col items-center gap-2">
                    <p>No items added. Click "Add Item" to start.</p>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={onAddLineItem}
                      className="mt-2"
                    >
                      <Plus className="h-4 w-4 mr-1" /> Add First Item
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              lineItems.map((item) => {
                const selectedProduct = products.find(
                  (p) => p.id === item.productId,
                );
                const filteredBrandOptions =
                  selectedProduct?.brands?.map((b) => ({
                    value: b.id,
                    label: b.name,
                  })) || [];

                return (
                  <TableRow key={item.tempId} className="group">
                    <TableCell className="p-3">
                      <div className="flex gap-1 items-center">
                        <div className="min-w-20 flex-1">
                          <SearchableSelect
                            options={productOptions}
                            value={item.productId}
                            onValueChange={(val) =>
                              handleProductChange(item.tempId, val)
                            }
                            placeholder="Select item"
                            searchPlaceholder="Search items..."
                          />
                        </div>
                        <OMNewItemDialog
                          brands={brands}
                          onItemAdded={(product) =>
                            onNewItemAdded(item.tempId, product)
                          }
                          trigger={
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="h-10 w-10 p-0 hover:bg-muted"
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          }
                        />
                      </div>
                    </TableCell>
                    <TableCell className="p-3">
                      <div className="flex gap-1 items-center">
                        <div className="min-w-10 flex-1">
                          <SearchableSelect
                            options={filteredBrandOptions}
                            value={item.brandId}
                            onValueChange={(val) =>
                              onUpdateLineItem(item.tempId, "brandId", val)
                            }
                            placeholder={
                              item.productId
                                ? "Select Brand"
                                : "Select Item First"
                            }
                            searchPlaceholder="Search brands..."
                            disabled={
                              !item.productId ||
                              filteredBrandOptions.length === 0
                            }
                          />
                        </div>
                        <OMNewBrandDialog
                          productId={item.productId}
                          currentBrandIds={selectedProduct?.brands?.map(
                            (b) => b.id,
                          )}
                          onBrandAdded={(brand) =>
                            onNewBrandAdded(item.tempId, brand)
                          }
                          trigger={
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="h-10 w-10 p-0 hover:bg-muted pr-0"
                              disabled={!item.productId}
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          }
                        />
                      </div>
                    </TableCell>
                    <TableCell className="p-3">
                      <Input
                        value={item.description}
                        onChange={(e) =>
                          onUpdateLineItem(
                            item.tempId,
                            "description",
                            e.target.value,
                          )
                        }
                        placeholder="Description"
                        className="min-w-32"
                      />
                    </TableCell>
                    <TableCell className="p-3">
                      <Input
                        type="number"
                        min="0"
                        value={item.quantity || ""}
                        onChange={(e) =>
                          onUpdateLineItem(
                            item.tempId,
                            "quantity",
                            e.target.value === ""
                              ? 0
                              : parseInt(e.target.value) || 0,
                          )
                        }
                        className="font-medium w-20"
                      />
                    </TableCell>
                    <TableCell className="p-3">
                      <Input
                        type="number"
                        min="0"
                        step="0.1"
                        value={item.rate || ""}
                        onChange={(e) =>
                          onUpdateLineItem(
                            item.tempId,
                            "rate",
                            e.target.value === ""
                              ? 0
                              : parseFloat(e.target.value) || 0,
                          )
                        }
                        className="font-medium w-20"
                      />
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      ₹
                      {item.amount.toLocaleString("en-IN", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </TableCell>
                    <TableCell className="p-3">
                      <Select
                        value={item.gstPercentage.toString()}
                        onValueChange={(val) =>
                          onUpdateLineItem(
                            item.tempId,
                            "gstPercentage",
                            parseFloat(val),
                          )
                        }
                      >
                        <SelectTrigger className="font-medium">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="0">0%</SelectItem>
                          <SelectItem value="5">5%</SelectItem>
                          <SelectItem value="18">18%</SelectItem>
                          <SelectItem value="28">28%</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell className="text-right font-medium text-muted-foreground p-3">
                      ₹
                      {item.gstAmount.toLocaleString("en-IN", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </TableCell>
                    <TableCell className="text-right font-bold text-primary p-3">
                      ₹
                      {item.totalAmount.toLocaleString("en-IN", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </TableCell>
                    <TableCell className="pl-0">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => onRemoveLineItem(item.tempId)}
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
