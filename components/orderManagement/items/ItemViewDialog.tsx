"use client";

import { memo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";

interface ItemViewDialogProps {
  item: any | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onEdit: (item: any) => void;
}

export const ItemViewDialog = memo(function ItemViewDialog({
  item,
  isOpen,
  onOpenChange,
  onEdit,
}: ItemViewDialogProps) {
  if (!item) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>View Item Details</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">Item Name</Label>
              <div className="font-medium text-sm">{item.name}</div>
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">Brands</Label>
              <div className="flex flex-wrap gap-1">
                {item.brands?.map((b: any) => (
                  <Badge key={b.id} variant="secondary" className="text-[10px]">
                    {b.name}
                  </Badge>
                )) || "-"}
              </div>
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">SKU</Label>
              <div className="font-mono text-xs">{item.sku || "N/A"}</div>
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">Rate</Label>
              <div className="text-sm">{item.price ? `₹${item.price.toLocaleString("en-IN")}` : "N/A"}</div>
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">Default GST</Label>
              <div className="text-sm">{item.defaultGstPct}%</div>
            </div>
          </div>

          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">Description</Label>
            <div className="text-sm border p-3 rounded-md bg-muted/30 whitespace-pre-wrap min-h-[60px]">
              {item.description || "No description provided."}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Close
            </Button>
            <Button
              onClick={() => {
                onOpenChange(false);
                onEdit(item);
              }}
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit Item
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
});
