import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ImageWithFallback } from "@/components/image";
import { Minus, Plus } from "lucide-react";
import { useQuantityDialog } from "@/hooks/use-quantity-dialog";
import { Product } from "@/lib/generated/prisma";

interface QuantityDialogProps {
  dialog: ReturnType<typeof useQuantityDialog>;
  onConfirm: (product: Product, quantity: number) => void;
}

export function QuantityDialog({ dialog, onConfirm }: QuantityDialogProps) {
  const {
    isOpen,
    setIsOpen,
    selectedProduct,
    quantity,
    inputValue,
    updateQuantity,
    handleInputChange,
    validateInput,
    isValidQuantity,
    closeDialog,
  } = dialog;

  if (!selectedProduct) return null;

  const handleConfirm = () => {
    if (!isValidQuantity()) return;
    onConfirm(selectedProduct, quantity);
    closeDialog();
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Select Quantity</DialogTitle>
        </DialogHeader>
        <div className="flex gap-4 items-center">
          <ImageWithFallback
            src={selectedProduct.images[0]}
            alt={selectedProduct.name}
            className="w-20 h-20 object-cover rounded"
          />
          <div>
            <h3 className="font-medium">{selectedProduct.name}</h3>
            <p className="text-sm text-muted-foreground">
              {selectedProduct.availableStock} in stock
            </p>
          </div>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="quantity">Quantity</Label>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => updateQuantity(-1)}
              disabled={quantity <= 1}
            >
              <Minus className="h-4 w-4" />
            </Button>
            <Input
              id="quantity"
              type="number"
              value={inputValue}
              className={`w-20 text-center ${!isValidQuantity() ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
              onChange={(e) => handleInputChange(e.target.value)}
              onBlur={validateInput}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  validateInput();
                  e.currentTarget.blur();
                }
              }}
            />
            <Button
              variant="outline"
              size="icon"
              onClick={() => updateQuantity(1)}
              disabled={quantity >= selectedProduct.availableStock}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-sm font-semibold">Quantity: {quantity}</p>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={closeDialog}>
            Cancel
          </Button>
          <Button onClick={handleConfirm} disabled={!isValidQuantity()}>
            Add to Cart
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
