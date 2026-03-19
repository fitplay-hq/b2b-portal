"use client";

import { memo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MultiSearchableSelect } from "@/components/ui/combobox";
import { Loader2 } from "lucide-react";

interface ItemFormProps {
  formData: any;
  setFormData: (data: any) => void;
  brandOptions: any[];
  isSubmitting: boolean;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  isEdit?: boolean;
}

export const ItemForm = memo(function ItemForm({
  formData,
  setFormData,
  brandOptions,
  isSubmitting,
  onSubmit,
  onCancel,
  isEdit = false,
}: ItemFormProps) {
  const brands = brandOptions; // Map options to local brands if needed

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-sm font-medium border-b pb-2">
          Item Information
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">Item Name *</Label>
            <Input
              id="name"
              required
              value={formData.name}
              onChange={(e) => {
                const newName = e.target.value;
                setFormData((prev: any) => ({
                  ...prev,
                  name: newName,
                }));
              }}
              placeholder="Enter item name"
            />
          </div>
          <div className="space-y-2 col-span-2">
            <Label>Brands</Label>
            <MultiSearchableSelect
              options={brandOptions}
              value={formData.brandIds}
              onValueChange={(val) =>
                setFormData({
                  ...formData,
                  brandIds: val,
                })
              }
              placeholder="Select brands"
              searchPlaceholder="Search brands..."
            />
          </div>
          <div className="col-span-2 space-y-2">
            <div
              className={`flex items-center border rounded-md overflow-hidden h-10 ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 ${formData.skuNotApplicable ? "bg-muted opacity-50 pointer-events-none" : "bg-muted/50"}`}
            >
              <div className="px-3 h-full flex items-center bg-muted text-xs font-mono font-bold border-r">
                FP
              </div>
              <div className="px-1 text-muted-foreground">-</div>
              <div className="px-2 h-full flex items-center bg-muted text-xs font-mono min-w-[3ch] justify-center border-x">
                {brandOptions
                  .find((b) => formData.brandIds.includes(b.value))
                  ?.label.replace(/[^a-zA-Z0-9]/g, "")
                  .substring(0, 3)
                  .toUpperCase() || "NIL"}
              </div>
              <div className="px-1 text-muted-foreground">-</div>
              <input
                className="px-2 h-full w-16 flex items-center bg-background text-xs font-mono text-center outline-none border-x focus:bg-accent disabled:bg-muted"
                value={formData.skuProductPart}
                disabled={formData.skuNotApplicable}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    skuProductPart: e.target.value
                      .replace(/[^a-zA-Z0-9]/g, "")
                      .toUpperCase()
                      .substring(0, 6),
                    isPrdManuallyEdited: true,
                  })
                }
                placeholder="PRD"
              />
              <div className="px-1 text-muted-foreground">-</div>
              <input
                className="px-3 h-full flex-1 min-w-0 bg-background text-xs font-mono font-bold text-primary outline-none focus:bg-accent disabled:bg-muted"
                value={formData.code}
                disabled={formData.skuNotApplicable}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    code: e.target.value
                      .replace(/[^a-zA-Z0-9]/g, "")
                      .toUpperCase(),
                  })
                }
                placeholder="SUFFIX"
              />
            </div>
            <div className="flex items-center space-x-2 ml-1">
              <Checkbox
                id="skuNotApplicable"
                checked={formData.skuNotApplicable}
                onCheckedChange={(checked) =>
                  setFormData({
                    ...formData,
                    skuNotApplicable: !!checked,
                  })
                }
              />
              <Label
                htmlFor="skuNotApplicable"
                className="text-[10px] font-normal cursor-pointer"
              >
                SKU is not applicable
              </Label>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="price">Default Rate (₹)</Label>
            <Input
              id="price"
              type="number"
              step="0.01"
              value={formData.price}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  price: e.target.value,
                })
              }
              placeholder="Enter default rate"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="defaultGstPct">Default GST %</Label>
            <Select
              value={formData.defaultGstPct}
              onValueChange={(value) =>
                setFormData({ ...formData, defaultGstPct: value })
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
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) =>
            setFormData({
              ...formData,
              description: e.target.value,
            })
          }
          placeholder="Enter item description"
          className="min-h-20"
        />
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting && (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          )}
          {isEdit ? "Update Item" : "Add Item"}
        </Button>
      </div>
    </form>
  );
});
