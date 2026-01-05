import { useState, useEffect, useMemo, useCallback } from "react";
import { Product } from "@/lib/generated/prisma";
import { getStoredData, setStoredData } from "@/lib/mockData";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export interface CartItem {
  product: Product;
  quantity: number;
}

export function useCart(userId: string | undefined) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const cartKey = useMemo(() => `fitplay_cart_${userId}`, [userId]);
  const router = useRouter();

  useEffect(() => {
    if (userId) {
      const storedCart = getStoredData<CartItem[]>(cartKey, []);
      setCartItems(storedCart);
    }

    // Listen for storage changes (when cart is updated in another component or tab)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === cartKey && e.newValue) {
        try {
          const updatedCart = JSON.parse(e.newValue);
          setCartItems(updatedCart);
        } catch (error) {
          console.error('Error parsing cart data:', error);
        }
      }
    };

    // Listen for custom cart update events
    const handleCartUpdate = (e: CustomEvent) => {
      if (e.detail?.cartKey === cartKey && e.detail?.cart) {
        setCartItems(e.detail.cart);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('cartUpdated' as any, handleCartUpdate);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('cartUpdated' as any, handleCartUpdate);
    };
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
    
    // Dispatch custom event to notify other components
    window.dispatchEvent(new CustomEvent('cartUpdated', { 
      detail: { cartKey, cart: updatedCart } 
    }));

    toast.success(`${quantity} x ${product.name} added to cart`, {
      action: {
        label: "Go to Cart",
        onClick: () => router.push('/client/cart')
      },
      duration: 4000
    });
  }, [cartItems, userId, cartKey, router]);

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