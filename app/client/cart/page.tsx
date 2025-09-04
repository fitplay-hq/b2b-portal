"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Layout from "@/components/layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ImageWithFallback } from "@/components/image";
import {
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  ArrowLeft,
  FileText,
  ArrowRight,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { CartItem, getStoredData, setStoredData } from "@/lib/mockData";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function ClientCart() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  useEffect(() => {
    const cart = getStoredData<CartItem[]>(
      `fitplay_cart_${session?.user?.id}`,
      []
    );
    setCartItems(cart);
  }, [session?.user?.id]);

  const updateCart = (updatedCart: CartItem[]) => {
    setCartItems(updatedCart);
    setStoredData(`fitplay_cart_${session?.user?.id}`, updatedCart);
  };

  const updateQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(productId);
      return;
    }

    const updatedCart = cartItems.map((item) =>
      item.product.id === productId
        ? { ...item, quantity: Math.min(newQuantity, item.product.stock) }
        : item
    );
    updateCart(updatedCart);
  };

  const removeItem = (productId: string) => {
    const updatedCart = cartItems.filter(
      (item) => item.product.id !== productId
    );
    updateCart(updatedCart);
    toast.success("Item removed from cart");
  };

  const clearCart = () => {
    updateCart([]);
    toast.success("Cart cleared");
  };

  const calculateSubtotal = () => {
    return cartItems.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0
    );
  };

  const subtotal = calculateSubtotal();
  const total = subtotal;

  // Handle authentication
  if (status === "loading") {
    return (
      <Layout title="Shopping Cart" isClient>
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </Layout>
    );
  }

  if (status === "unauthenticated" || !session?.user) {
    return (
      <Layout title="Shopping Cart" isClient>
        <div className="text-center py-8">
          <p className="text-muted-foreground">
            Please sign in to view your cart
          </p>
        </div>
      </Layout>
    );
  }

  if (cartItems.length === 0) {
    return (
      <Layout title="Shopping Cart" isClient>
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardContent className="p-8 text-center">
              <div className="space-y-4">
                <ShoppingBag className="h-16 w-16 text-muted-foreground mx-auto" />
                <h2 className="text-xl font-semibold">Your cart is empty</h2>
                <p className="text-muted-foreground">
                  Start shopping to add items to your cart
                </p>
                <Button asChild>
                  <Link href="/client/products">Browse Products</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Shopping Cart" isClient>
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/client/products">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Continue Shopping
              </Link>
            </Button>
          </div>
          <Button variant="outline" size="sm" onClick={clearCart}>
            <Trash2 className="h-4 w-4 mr-2" />
            Clear Cart
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Cart Items ({cartItems.length})</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {cartItems.map((item) => (
                  <div
                    key={item.product.id}
                    className="flex gap-4 p-4 border rounded-lg"
                  >
                    <div className="w-20 h-20 flex-shrink-0">
                      <ImageWithFallback
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-full h-full object-cover rounded"
                      />
                    </div>

                    <div className="flex-1 space-y-2">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-medium">{item.product.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            SKU: {item.product.sku}
                          </p>
                          <p className="text-sm font-medium">
                            ₹{item.product.price.toFixed(2)} each
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeItem(item.product.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              updateQuantity(item.product.id, item.quantity - 1)
                            }
                            disabled={item.quantity <= 1}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <Input
                            type="number"
                            value={item.quantity}
                            onChange={(e) => {
                              const value = parseInt(e.target.value) || 1;
                              updateQuantity(item.product.id, value);
                            }}
                            className="w-16 text-center"
                            min="1"
                            max={item.product.stock}
                          />
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              updateQuantity(item.product.id, item.quantity + 1)
                            }
                            disabled={item.quantity >= item.product.stock}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>

                        <div className="text-right">
                          <p className="font-medium">
                            ₹{(item.product.price * item.quantity).toFixed(2)}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {item.product.stock - item.quantity} remaining
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Order Summary & Checkout Form */}
          <div className="space-y-4">
            {/* Order Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  {cartItems.map((item) => (
                    <div className="flex justify-between text-sm">
                      <span>{item.product.name}</span>
                      <span>₹{item.product.price}</span>
                    </div>
                  ))}
                  <div className="border-t pt-2">
                    <div className="flex justify-between font-medium">
                      <span>Total</span>
                      <span>₹{total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <Button
                  className="w-full"
                  size="lg"
                  onClick={() => router.push("/client/checkout")}
                >
                  <ArrowRight className="h-4 w-4 mr-2" />
                  Next
                </Button>

                <div className="text-xs text-muted-foreground text-center">
                  <p>This will generate a Dispatch Order for approval</p>
                  <p>Payment terms as per existing agreement</p>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Need Help?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-xs text-muted-foreground">
                  Questions about products or bulk pricing? Contact your sales
                  representative.
                </p>
                <Button variant="outline" size="sm" className="w-full">
                  Contact Sales
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}
