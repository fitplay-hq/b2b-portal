"use client";

import { useState, useEffect } from "react";
import { X, ShoppingCart, Eye } from "lucide-react";
import { Product } from "@/lib/generated/prisma";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface SimpleCartPopupProps {
  isVisible: boolean;
  onClose: () => void;
  product: Product;
  quantity: number;
  totalCartItems: number;
}

export function SimpleCartPopup({ 
  isVisible, 
  onClose, 
  product, 
  quantity, 
  totalCartItems 
}: SimpleCartPopupProps) {
  const router = useRouter();

  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, 5000); // Auto-hide after 5 seconds
      
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  return (
    <div className="fixed top-4 right-4 z-50 bg-white border border-green-200 rounded-lg shadow-lg p-4 max-w-sm animate-in slide-in-from-top-2">
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-2 text-green-600">
          <ShoppingCart className="h-5 w-5" />
          <span className="font-semibold">Added to Cart!</span>
        </div>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
      
      <div className="mt-3 space-y-3">
        <div className="flex items-start space-x-3">
          <div className="w-12 h-12 bg-gray-100 rounded-md flex items-center justify-center">
            <Eye className="h-6 w-6 text-gray-400" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              {product.name}
            </p>
            <p className="text-sm text-gray-500">
              Qty: {quantity} • ₹{product.price}
            </p>
          </div>
        </div>
        
        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
          <span className="text-sm text-gray-600">
            {totalCartItems} item{totalCartItems !== 1 ? 's' : ''} in cart
          </span>
          <div className="space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push('/client/cart')}
            >
              View Cart
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}