"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Trash2 } from "lucide-react";
import { SearchableSelect } from "@/components/ui/combobox";
import { OMNewItemDialog } from "./OMNewItemDialog";
import { OMBrand, OMProduct } from "@/types/order-management";

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
}

export function OMPurchaseOrderLineItems({
  lineItems,
  products,
  brands,
  onAddLineItem,
  onRemoveLineItem,
  onUpdateLineItem,
  onNewItemAdded,
}: OMPurchaseOrderLineItemsProps) {
  const productOptions = products.map((p) => ({ value: p.id, label: p.name }));
  const brandOptions = brands.map((b) => ({ value: b.id, label: b.name }));

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-card p-4 rounded-xl border shadow-sm">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Order Items</h3>
          <p className="text-sm text-muted-foreground">
            Add products to your purchase order
          </p>
        </div>
        <Button type="button" onClick={onAddLineItem}>
          <Plus className="h-4 w-4 mr-2" />
          Add Item
        </Button>
      </div>

      <div className="space-y-4">
        {lineItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 border-2 border-dashed rounded-xl bg-card text-center">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <Plus className="h-6 w-6 text-primary" />
            </div>
            <h4 className="text-lg font-medium text-foreground mb-1">
              No items added
            </h4>
            <p className="text-sm text-muted-foreground mb-4 max-w-sm">
              Start building your purchase order by adding items. You can select
              existing products or create new ones.
            </p>
            <Button type="button" onClick={onAddLineItem} variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Add First Item
            </Button>
          </div>
        ) : (
          lineItems.map((item, index) => (
            <div
              key={item.tempId}
              className="relative rounded-xl border bg-card p-6 shadow-sm transition-all hover:shadow-md group"
            >
              <div className="absolute right-4 top-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                  onClick={() => onRemoveLineItem(item.tempId)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>

              <div className="flex items-center gap-3 mb-6 pb-4 border-b">
                <div className="h-8 w-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-bold">
                  {index + 1}
                </div>
                <h4 className="font-semibold text-foreground">Item Details</h4>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-x-8 gap-y-6">
                {/* ROW 1: Item, Brand, Description */}
                <div className="lg:col-span-4 space-y-2">
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Product
                  </label>
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <SearchableSelect
                        options={productOptions}
                        value={item.productId}
                        onValueChange={(val) =>
                          onUpdateLineItem(item.tempId, "productId", val)
                        }
                        placeholder="Select item..."
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
                          variant="outline"
                          size="icon"
                          className="shrink-0 bg-secondary/50"
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      }
                    />
                  </div>
                </div>

                <div className="lg:col-span-3 space-y-2">
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Brand
                  </label>
                  <SearchableSelect
                    options={brandOptions}
                    value={item.brandId}
                    onValueChange={(val) =>
                      onUpdateLineItem(item.tempId, "brandId", val)
                    }
                    placeholder="Select brand..."
                  />
                </div>

                <div className="lg:col-span-5 space-y-2">
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Description
                  </label>
                  <Textarea
                    value={item.description}
                    onChange={(e) =>
                      onUpdateLineItem(
                        item.tempId,
                        "description",
                        e.target.value,
                      )
                    }
                    placeholder="Additional details or specifications..."
                    className="min-h-10 h-10 py-2 resize-none"
                  />
                </div>

                {/* ROW 2: Numbers & Totals */}
                <div className="lg:col-span-2 space-y-2">
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Qty
                  </label>
                  <Input
                    type="number"
                    value={item.quantity}
                    onChange={(e) =>
                      onUpdateLineItem(
                        item.tempId,
                        "quantity",
                        parseFloat(e.target.value),
                      )
                    }
                    placeholder="0"
                    className="font-medium"
                    min="0"
                  />
                </div>

                <div className="lg:col-span-2 space-y-2">
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Rate (₹)
                  </label>
                  <Input
                    type="number"
                    value={item.rate}
                    onChange={(e) =>
                      onUpdateLineItem(
                        item.tempId,
                        "rate",
                        parseFloat(e.target.value),
                      )
                    }
                    placeholder="0"
                    className="font-medium"
                    min="0"
                  />
                </div>

                <div className="lg:col-span-2 space-y-2">
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    GST (%)
                  </label>
                  <Select
                    value={
                      item.gstPercentage !== null
                        ? item.gstPercentage.toString()
                        : "0"
                    }
                    onValueChange={(value) =>
                      onUpdateLineItem(
                        item.tempId,
                        "gstPercentage",
                        parseFloat(value) || 0,
                      )
                    }
                  >
                    <SelectTrigger className="font-medium bg-background">
                      <SelectValue placeholder="0%" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">0%</SelectItem>
                      <SelectItem value="5">5%</SelectItem>
                      <SelectItem value="18">18%</SelectItem>
                      <SelectItem value="28">28%</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="lg:col-span-6">
                  <div className="h-full bg-muted/20 rounded-xl p-4 flex items-center justify-between border">
                    <div className="flex gap-8">
                      <div>
                        <div className="text-xs font-medium text-muted-foreground mb-1">
                          Net Amount
                        </div>
                        <div className="font-semibold text-foreground">
                          ₹
                          {item.amount.toLocaleString("en-IN", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs font-medium text-muted-foreground mb-1">
                          GST Amount
                        </div>
                        <div className="font-semibold text-foreground">
                          ₹
                          {item.gstAmount.toLocaleString("en-IN", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </div>
                      </div>
                    </div>
                    <div className="text-right pl-6 border-l border-border/50">
                      <div className="text-xs font-bold text-primary mb-1 uppercase tracking-wider">
                        Total
                      </div>
                      <div className="text-xl font-bold text-primary">
                        ₹
                        {item.totalAmount.toLocaleString("en-IN", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
