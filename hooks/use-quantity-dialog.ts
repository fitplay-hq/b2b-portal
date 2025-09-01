// /app/products/hooks/useQuantityDialog.ts
import { useState } from "react";
import { Product } from "@/lib/generated/prisma";

export function useQuantityDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);

  const openDialog = (product: Product) => {
    setSelectedProduct(product);
    setQuantity(1);
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
    if (newQuantity >= 1 && newQuantity <= selectedProduct.availableStock) {
      setQuantity(newQuantity);
    }
  };

  const handleManualQuantityChange = (value: number) => {
    if (!selectedProduct) return;
    const newQuantity = Math.max(1, Math.min(value, selectedProduct.availableStock));
    setQuantity(newQuantity);
  }

  return {
    isOpen,
    selectedProduct,
    quantity,
    openDialog,
    closeDialog,
    updateQuantity,
    handleManualQuantityChange,
    setIsOpen, // Pass through for the Dialog's onOpenChange
  };
}