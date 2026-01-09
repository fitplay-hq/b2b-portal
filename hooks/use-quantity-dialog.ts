// /app/products/hooks/useQuantityDialog.ts
import { useState } from "react";
import { Product } from "@/lib/generated/prisma";
import { toast } from "sonner";

export function useQuantityDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [inputValue, setInputValue] = useState("1");

  const openDialog = (product: Product) => {
    setSelectedProduct(product);
    setQuantity(1);
    setInputValue("1");
    setIsOpen(true);
  };
  
  const closeDialog = () => {
    setIsOpen(false);
    // Delay resetting product to avoid UI flicker during closing animation
    setTimeout(() => setSelectedProduct(null), 300);
  };

  const updateQuantity = (delta: number) => {
    if (!selectedProduct) return;
    const newQuantity = quantity + delta;
    
    if (newQuantity > selectedProduct.availableStock) {
      toast.error(`Not enough stock available!`, {
        description: `Only ${selectedProduct.availableStock} items available`
      });
      return;
    }
    
    if (newQuantity >= 1 && newQuantity <= selectedProduct.availableStock) {
      setQuantity(newQuantity);
      setInputValue(newQuantity.toString());
    }
  };

  const handleManualQuantityChange = (value: number) => {
    if (!selectedProduct) return;
    
    // Only show toast if trying to exceed, not when at max
    if (value > selectedProduct.availableStock) {
      toast.error(`Not enough stock available!`, {
      });
    }
    
    const newQuantity = Math.max(1, Math.min(value, selectedProduct.availableStock));
    setQuantity(newQuantity);
    setInputValue(newQuantity.toString());
  }

  const handleInputChange = (value: string) => {
    // Always update input value to show what user is typing
    setInputValue(value);
    
    // Update quantity if valid number
    if (value === '' || value === '0') {
      return; // Don't update quantity yet, will validate on blur
    }
    
    const numValue = parseInt(value);
    if (!isNaN(numValue) && numValue > 0) {
      const clampedValue = Math.min(numValue, selectedProduct?.availableStock || 1);
      setQuantity(clampedValue);
      
      // Show toast if exceeded
      if (numValue > (selectedProduct?.availableStock || 1)) {
        toast.error(`Not enough stock available!`);
      }
    }
  }

  const validateInput = () => {
    if (!selectedProduct) return;
    
    const numValue = parseInt(inputValue) || 1;
    const clampedValue = Math.max(1, Math.min(numValue, selectedProduct.availableStock));
    setQuantity(clampedValue);
    setInputValue(clampedValue.toString());
  }

  const isValidQuantity = () => {
    const numValue = parseInt(inputValue);
    return !isNaN(numValue) && numValue > 0 && numValue <= (selectedProduct?.availableStock || 0);
  }

  return {
    isOpen,
    selectedProduct,
    quantity,
    inputValue,
    openDialog,
    closeDialog,
    updateQuantity,
    handleManualQuantityChange,
    handleInputChange,
    validateInput,
    isValidQuantity,
    setIsOpen, // Pass through for the Dialog's onOpenChange
  };
}