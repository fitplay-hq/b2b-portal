"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Loader2 } from "lucide-react";
import { MultiSearchableSelect } from "@/components/ui/combobox";
import { toast } from "sonner";
import { OMBrand, OMProduct } from "@/types/order-management";

interface OMNewItemDialogProps {
  brands: OMBrand[];
  onItemAdded: (product: OMProduct) => void;
  trigger?: React.ReactNode;
}

function skuProductPart(productName: string): string {
  return productName
    .replace(/[^a-zA-Z0-9]/g, "")
    .substring(0, 3)
    .toUpperCase();
}

export function OMNewItemDialog({
  brands,
  onItemAdded,
  trigger,
}: OMNewItemDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState("");
  const [rate, setRate] = useState("");
  const [brandIds, setBrandIds] = useState<string[]>([]);
  const [gstPct, setGstPct] = useState("0");
  const [description, setDescription] = useState("");
  const [code, setCode] = useState("");
  const [skuProductPartState, setSkuProductPartState] = useState("");
  const [isPrdManuallyEdited, setIsPrdManuallyEdited] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const brandOptions = brands.map((b) => ({ value: b.id, label: b.name }));

  const handleSubmit = async () => {
    if (!name.trim()) return;

    const selectedBrandNames = brands
      .filter((b) => brandIds.includes(b.id))
      .map((b) => b.name);

    const brandPart =
      selectedBrandNames.length > 0
        ? selectedBrandNames[0]
            .replace(/[^a-zA-Z0-9]/g, "")
            .substring(0, 3)
            .toUpperCase()
        : "NIL";
    const productPart = skuProductPartState.trim() || skuProductPart(name);
    const codePart = code.trim();

    if (!codePart) {
      toast.error("Item code suffix is required for SKU");
      return;
    }

    const finalSku = `FP-${brandPart}-${productPart}-${codePart}`;

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/admin/om/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          sku: finalSku,
          code: codePart,
          price: rate ? parseFloat(rate) : undefined,
          brandIds,
          defaultGstPct: parseFloat(gstPct),
          description: description || null,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        onItemAdded(data.data);
        toast.success("Item added successfully");
        setIsOpen(false);
        resetForm();
      } else {
        const err = await res.json();
        toast.error(err.error || "Failed to add item");
      }
    } catch {
      toast.error("Failed to add item");
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setName("");
    setRate("");
    setBrandIds([]);
    setGstPct("0");
    setDescription("");
    setCode("");
    setSkuProductPartState("");
    setIsPrdManuallyEdited(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button type="button" variant="outline" size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add New Item
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New Item</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label>Item Name *</Label>
            <Input
              value={name}
              onChange={(e) => {
                const newName = e.target.value;
                setName(newName);
                if (!isPrdManuallyEdited) {
                  setSkuProductPartState(skuProductPart(newName));
                }
              }}
              placeholder="Enter item name"
            />
          </div>
          <div className="space-y-2">
            <Label>Brands</Label>
            <MultiSearchableSelect
              options={brandOptions}
              value={brandIds}
              onValueChange={setBrandIds}
              placeholder="Select brands"
              searchPlaceholder="Search brands..."
            />
          </div>
          <div className="col-span-2 space-y-2">
            <Label>SKU (Merged Editor)</Label>
            <div className="flex items-center border rounded-md overflow-hidden bg-muted/50 h-10 ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
              <div className="px-3 h-full flex items-center bg-muted text-xs font-mono font-bold border-r">
                FP
              </div>
              <div className="px-1 text-muted-foreground">-</div>
              <div className="px-2 h-full flex items-center bg-muted text-xs font-mono min-w-[3ch] justify-center border-x">
                {brandIds.length > 0
                  ? brands
                      .find((b) => b.id === brandIds[0])
                      ?.name.replace(/[^a-zA-Z0-9]/g, "")
                      .substring(0, 3)
                      .toUpperCase()
                  : "NIL"}
              </div>
              <div className="px-1 text-muted-foreground">-</div>
              <input
                className="px-2 h-full w-16 flex items-center bg-background text-xs font-mono text-center outline-none border-x focus:bg-accent"
                value={skuProductPartState}
                onChange={(e) => {
                  setSkuProductPartState(
                    e.target.value
                      .replace(/[^a-zA-Z0-9]/g, "")
                      .toUpperCase()
                      .substring(0, 6),
                  );
                  setIsPrdManuallyEdited(true);
                }}
                placeholder="PRD"
              />
              <div className="px-1 text-muted-foreground">-</div>
              <input
                className="px-3 h-full flex-1 min-w-0 bg-background text-xs font-mono font-bold text-primary outline-none focus:bg-accent"
                value={code}
                onChange={(e) =>
                  setCode(
                    e.target.value.replace(/[^a-zA-Z0-9]/g, "").toUpperCase(),
                  )
                }
                placeholder="SUFFIX"
              />
            </div>
            <p className="text-[10px] text-muted-foreground">
              Format: FP-[BRAND]-[PRODUCT]-[SUFFIX]. Product & Suffix are
              editable.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Default Rate</Label>
              <Input
                type="number"
                value={rate}
                onChange={(e) => setRate(e.target.value)}
                placeholder="0"
              />
            </div>
            <div className="space-y-2">
              <Label>Default GST %</Label>
              <Input
                type="number"
                value={gstPct}
                onChange={(e) => setGstPct(e.target.value)}
                placeholder="0"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter item description"
              rows={3}
            />
          </div>
          <Button
            type="button"
            className="w-full"
            onClick={handleSubmit}
            disabled={isSubmitting || !name.trim() || !code.trim()}
          >
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Add Item
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
