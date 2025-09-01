import { useState, useEffect, useMemo, useCallback } from "react";
import { Product } from "@/lib/generated/prisma";
import { getStoredData, setStoredData } from "@/lib/mockData";
import { toast } from "sonner";

export interface CartItem {
  product: Product;
  quantity: number;
}

export function useCart(userId: string | undefined) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const cartKey = useMemo(() => `fitplay_cart_${userId}`, [userId]);

  useEffect(() => {
    if (userId) {
      const storedCart = getStoredData<CartItem[]>(cartKey, []);
      setCartItems(storedCart);
    }
  }, [userId, cartKey]);

  const addToCart = useCallback((product: Product, quantity: number) => {
    if (!userId) {
      toast.error("You must be logged in to add items to the cart.");
      return;
    }

    const updatedCart = [...cartItems];
    const existingItemIndex = updatedCart.findIndex(item => item.product.id === product.id);

    if (existingItemIndex > -1) {
      updatedCart[existingItemIndex].quantity += quantity;
    } else {
      updatedCart.push({ product, quantity });
    }

    setCartItems(updatedCart);
    setStoredData(cartKey, updatedCart);
    toast.success(`${quantity} x ${product.name} added to cart`);
  }, [cartItems, userId, cartKey]);

  const getCartQuantity = useCallback((productId: string) => {
    return cartItems.find(item => item.product.id === productId)?.quantity || 0;
  }, [cartItems]);

  const totalCartItems = useMemo(() => {
    return cartItems.reduce((sum, item) => sum + item.quantity, 0);
  }, [cartItems]);

  return {
    cartItems,
    addToCart,
    getCartQuantity,
    totalCartItems,
  };
}