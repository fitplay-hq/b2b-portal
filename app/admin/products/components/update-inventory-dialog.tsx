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
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { $Enums, Product } from "@/lib/generated/prisma";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Package, Minus, Plus } from "lucide-react";
import { useUpdateInventory } from "@/data/product/admin.hooks";
import { toast } from "sonner";

interface UpdateInventoryDialogProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

export function UpdateInventoryDialog({
  product,
  isOpen,
  onClose,
}: UpdateInventoryDialogProps) {
  const [quantity, setQuantity] = useState<string>("");
  const [direction, setDirection] = useState<"add" | "subtract">("add");
  const [reason, setReason] = useState<string>("");

  const { updateInventory, isUpdatingInventory } = useUpdateInventory();

  const handleSubmit = async () => {
    if (!product || !quantity.trim()) {
      toast.error("Please fill in the quantity field");
      return;
    }

    const qty = parseInt(quantity);
    if (qty <= 0) {
      toast.error("Quantity must be greater than 0");
      return;
    }

    // If subtracting, check if there's enough stock
    if (direction === "subtract" && qty > (product.availableStock || 0)) {
      toast.error("Cannot subtract more than available stock");
      return;
    }

    try {
      await updateInventory({
        productId: product.id,
        quantity: qty,
        reason,
        direction: direction === "add" ? 1 : -1,
      });

      toast.success(
        `Stock ${direction === "add" ? "added" : "removed"} successfully`
      );
      handleClose();
    } catch (error) {
      toast.error("Failed to update inventory");
    }
  };

  const handleClose = () => {
    setQuantity("");
    setDirection("add");
    setReason("");
    onClose();
  };

  if (!product) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Update Inventory
          </DialogTitle>
          <DialogDescription>
            Manage stock for <strong>{product.name}</strong>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Current Stock Display */}
          <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
            <span className="font-medium">Current Stock:</span>
            <Badge
              variant={
                product.availableStock === 0
                  ? "destructive"
                  : product.availableStock < 50
                  ? "secondary"
                  : "default"
              }
            >
              {product.availableStock}{" "}
              {product.availableStock === 1 ? "unit" : "units"}
            </Badge>
          </div>

          {/* Direction Selection */}
          <div className="space-y-3">
            <Label>Action</Label>
            <Select
              value={direction}
              onValueChange={(value: "add" | "subtract") => setDirection(value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="add">
                  <div className="flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    Add Stock
                  </div>
                </SelectItem>
                <SelectItem value="subtract">
                  <div className="flex items-center gap-2">
                    <Minus className="h-4 w-4" />
                    Remove Stock
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Quantity Input */}
          <div className="space-y-2">
            <Label htmlFor="quantity">Quantity *</Label>
            <Input
              id="quantity"
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder="Enter quantity"
              required
            />
          </div>

          {/* Reason Input */}
          <div className="space-y-2">
            <Label htmlFor="reason">Reason *</Label>
            <Select value={reason} onValueChange={setReason}>
              <SelectTrigger>
                <SelectValue placeholder="Select a inventory update reason" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="NEW_PURCHASE">
                  New Purchase - Adding new stock from purchase
                </SelectItem>
                <SelectItem value="PHYSICAL_STOCK_CHECK">
                  Physical Stock Check - Adjusting after manual count
                </SelectItem>
                <SelectItem value="RETURN_FROM_PREVIOUS_DISPATCH">
                  Return from Previous Dispatch - Items returned to stock
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Preview */}
          {quantity && direction && reason && (
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800">
                {direction === "add" ? "Will add" : "Will remove"} {quantity}{" "}
                {parseInt(quantity) === 1 ? "unit" : "units"}
                {direction === "add" ? " to" : " from"} inventory
              </p>
              <p className="text-sm font-medium text-blue-900">
                New stock:{" "}
                {direction === "add"
                  ? (product.availableStock || 0) + parseInt(quantity)
                  : (product.availableStock || 0) - parseInt(quantity)}{" "}
                units
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={isUpdatingInventory}>
              {isUpdatingInventory ? "Updating..." : "Update Inventory"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
