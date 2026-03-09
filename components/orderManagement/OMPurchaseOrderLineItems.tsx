"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Item Line Entries</h3>
        <Button type="button" onClick={onAddLineItem} size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Add Item
        </Button>
      </div>
      <div className="overflow-x-auto border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="min-w-[200px]">Item</TableHead>
              <TableHead className="min-w-[150px]">Brand</TableHead>
              <TableHead className="min-w-[200px]">Description</TableHead>
              <TableHead className="w-[100px]">Qty</TableHead>
              <TableHead className="w-[120px]">Rate</TableHead>
              <TableHead className="w-[100px]">Amount</TableHead>
              <TableHead className="w-[100px]">GST %</TableHead>
              <TableHead className="w-[100px]">GST Amt</TableHead>
              <TableHead className="w-[100px]">Total</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {lineItems.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={10}
                  className="text-center py-8 text-muted-foreground"
                >
                  No items added. Click "Add Item" to start.
                </TableCell>
              </TableRow>
            ) : (
              lineItems.map((item) => (
                <TableRow key={item.tempId}>
                  <TableCell>
                    <div className="flex gap-1 items-center">
                      <div className="flex-1 min-w-[150px]">
                        <SearchableSelect
                          options={productOptions}
                          value={item.productId}
                          onValueChange={(val) =>
                            onUpdateLineItem(item.tempId, "productId", val)
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
                            className="h-8 w-8 p-0"
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        }
                      />
                    </div>
                  </TableCell>
                  <TableCell>
                    <SearchableSelect
                      options={brandOptions}
                      value={item.brandId}
                      onValueChange={(val) =>
                        onUpdateLineItem(item.tempId, "brandId", val)
                      }
                      placeholder="Brand"
                      searchPlaceholder="Search brands..."
                    />
                  </TableCell>
                  <TableCell>
                    <Textarea
                      value={item.description}
                      onChange={(e) =>
                        onUpdateLineItem(
                          item.tempId,
                          "description",
                          e.target.value,
                        )
                      }
                      placeholder="Item description"
                      className="min-h-10 h-10 py-2 resize-none"
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      value={item.quantity}
                      onChange={(e) =>
                        onUpdateLineItem(
                          item.tempId,
                          "quantity",
                          parseFloat(e.target.value) || 0,
                        )
                      }
                      className="h-9 px-2"
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      value={item.rate}
                      onChange={(e) =>
                        onUpdateLineItem(
                          item.tempId,
                          "rate",
                          parseFloat(e.target.value) || 0,
                        )
                      }
                      className="h-9 px-2"
                    />
                  </TableCell>
                  <TableCell className="text-sm font-medium">
                    ₹
                    {item.amount.toLocaleString("en-IN", {
                      minimumFractionDigits: 2,
                    })}
                  </TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      value={item.gstPercentage}
                      onChange={(e) =>
                        onUpdateLineItem(
                          item.tempId,
                          "gstPercentage",
                          parseFloat(e.target.value) || 0,
                        )
                      }
                      className="h-9 px-2"
                    />
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    ₹
                    {item.gstAmount.toLocaleString("en-IN", {
                      minimumFractionDigits: 2,
                    })}
                  </TableCell>
                  <TableCell className="text-sm font-bold text-primary">
                    ₹
                    {item.totalAmount.toLocaleString("en-IN", {
                      minimumFractionDigits: 2,
                    })}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onRemoveLineItem(item.tempId)}
                      className="text-destructive hover:text-destructive h-8 w-8 p-0"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
