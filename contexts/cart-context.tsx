"use client";

import { createContext, useContext, ReactNode } from "react";
import { useCart } from "@/hooks/use-cart";
import { useSession } from "next-auth/react";

interface CartContextType {
  totalCartItems: number;
  addToCart: (product: any, quantity: number) => void;
  getCartQuantity: (productId: string) => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const { data: session } = useSession();
  const userId = session?.user?.id || "1";
  const cart = useCart(userId);

  return (
    <CartContext.Provider value={cart}>
      {children}
    </CartContext.Provider>
  );
}

export function useCartContext() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCartContext must be used within a CartProvider");
  }
  return context;
}
