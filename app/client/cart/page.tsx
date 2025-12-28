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
  Package,
  Search,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { CartItem, getStoredData, setStoredData } from "@/lib/mockData";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useProducts } from "@/data/product/client.hooks";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";

export default function ClientCart() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  // Bundle-related state
  const [showBundleDialog, setShowBundleDialog] = useState(false);
  const [bundleProducts, setBundleProducts] = useState<{product: any, quantity: number}[]>([]);
  const [numberOfBundles, setNumberOfBundles] = useState(1);
  const [bundleSearchTerm, setBundleSearchTerm] = useState("");

  const { products, isLoading: isProductsLoading } = useProducts();

  useEffect(() => {
    const cart = getStoredData<CartItem[]>(
      `fitplay_cart_${session?.user?.id}`,
      []
    );
    setCartItems(cart);
  }, [session?.user?.id]);
  console.log({ cartItems });

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
        ? {
            ...item,
            quantity: Math.min(newQuantity, item.product.availableStock),
          }
        : item
    );
    console.log({ updatedCart });
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

  // Bundle handling functions
  const bundleSearchResults = products?.filter(
    (p) => {
      if (!bundleSearchTerm.trim()) return true; // Show all products when no search term
      return p.name.toLowerCase().includes(bundleSearchTerm.trim().toLowerCase()) ||
             (p.sku ? p.sku.toLowerCase().includes(bundleSearchTerm.trim().toLowerCase()) : false);
    }
  ) || [];

  const handleBundleProductToggle = (product: any, selected: boolean) => {
    if (selected) {
      const exists = bundleProducts.some((p) => p.product.id === product.id);
      if (!exists) {
        setBundleProducts((prev) => [...prev, { product, quantity: 1 }]);
      }
    } else {
      setBundleProducts((prev) => prev.filter((p) => p.product.id !== product.id));
    }
  };

  const handleUpdateBundleProduct = (productId: string, quantity: number) => {
    setBundleProducts((prev) =>
      prev.map((p) => (p.product.id === productId ? { ...p, quantity } : p))
    );
  };

  const handleRemoveBundleProduct = (productId: string) => {
    setBundleProducts((prev) => prev.filter((p) => p.product.id !== productId));
  };

  const handleAddBundle = () => {
    if (bundleProducts.length === 0) {
      toast.error("Select at least one product for the bundle");
      return;
    }

    // Create bundle items with proper bundle metadata
    const bundleItems: CartItem[] = bundleProducts.map((bundleProduct) => ({
      product: bundleProduct.product,
      quantity: bundleProduct.quantity * numberOfBundles,
      isBundleItem: true,
      bundleQuantity: bundleProduct.quantity,
      bundleCount: numberOfBundles,
    }));

    // Add bundle items to cart
    const updatedCart = [...cartItems];
    bundleItems.forEach((bundleItem) => {
      const existingIndex = updatedCart.findIndex(
        (item) => item.product.id === bundleItem.product.id
      );
      if (existingIndex >= 0) {
        // If item already exists, add to its quantity
        updatedCart[existingIndex].quantity += bundleItem.quantity;
        // If it wasn't a bundle item before, make it one now
        if (!updatedCart[existingIndex].isBundleItem) {
          updatedCart[existingIndex].isBundleItem = true;
          updatedCart[existingIndex].bundleQuantity = bundleItem.bundleQuantity;
          updatedCart[existingIndex].bundleCount = bundleItem.bundleCount;
        }
      } else {
        updatedCart.push(bundleItem);
      }
    });
    updateCart(updatedCart);

    // Reset bundle state
    setBundleProducts([]);
    setNumberOfBundles(1);
    setBundleSearchTerm("");
    setShowBundleDialog(false);

    toast.success(`Added ${numberOfBundles} bundle(s) to cart`);
  };

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
                <div className="flex gap-2 justify-center">
                  <Button asChild>
                    <Link href="/client/products">Browse Products</Link>
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setShowBundleDialog(true)}
                    className="flex items-center gap-2"
                  >
                    <Package className="h-4 w-4" />
                    Create Bundle
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Bundle Creation Dialog */}
        <Dialog open={showBundleDialog} onOpenChange={setShowBundleDialog}>
          <DialogContent className="sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create Product Bundle</DialogTitle>
              <DialogDescription>
                Create a bundle of products that will be packaged together. Example: 2 notebooks + 1 pen per package.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              {/* Bundle Products Search */}
              <div>
                <Label>Search Products for Bundle</Label>
                <div className="relative mt-1">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by product name or SKU..."
                    value={bundleSearchTerm}
                    onChange={(e) => setBundleSearchTerm(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>

              {/* Bundle Products List */}
              <div className="border rounded-md max-h-48 overflow-y-auto">
                {bundleSearchResults.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    {bundleSearchTerm ? `No products found matching "${bundleSearchTerm}"` : "No products available"}
                  </p>
                ) : (
                  <div className="divide-y">
                    {bundleSearchResults.map((product) => {
                      const isSelected = bundleProducts.some((p) => p.product.id === product.id);
                      return (
                        <div
                          key={product.id}
                          className={`flex items-center justify-between p-3 hover:bg-muted/50 cursor-pointer ${
                            isSelected ? "bg-blue-50" : ""
                          }`}
                          onClick={() => handleBundleProductToggle(product, !isSelected)}
                        >
                          <div className="flex items-center gap-3">
                            <Checkbox checked={isSelected} onChange={() => {}} />
                            <div>
                              <p className="text-sm font-medium">{product.name}</p>
                              <p className="text-xs text-muted-foreground">SKU: {product.sku || "N/A"}</p>
                            </div>
                          </div>
                          {isSelected && (
                            <Badge variant="secondary" className="text-xs">
                              Selected
                            </Badge>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Selected Bundle Products */}
              {bundleProducts.length > 0 && (
                <div>
                  <Label className="text-sm font-medium">Bundle Contents ({bundleProducts.length} products)</Label>
                  <div className="border rounded-md mt-2 max-h-32 overflow-y-auto">
                    {bundleProducts.map((product) => (
                      <div key={product.product.id} className="flex items-center justify-between p-3 border-b last:border-b-0">
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-medium">{product.product.name}</span>
                          <div className="flex items-center gap-1">
                            <Label className="text-xs">Qty per bundle:</Label>
                            <Input
                              type="number"
                              min="1"
                              value={product.quantity}
                              onChange={(e) => handleUpdateBundleProduct(product.product.id, parseInt(e.target.value) || 1)}
                              className="w-16 h-6 text-xs"
                            />
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveBundleProduct(product.product.id)}
                          className="h-6 w-6 p-0"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Number of Bundles */}
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <Label>Number of Bundles</Label>
                  <Input
                    type="number"
                    min="1"
                    value={numberOfBundles}
                    onChange={(e) => setNumberOfBundles(parseInt(e.target.value) || 1)}
                    className="mt-1"
                  />
                </div>
                <div className="text-sm text-muted-foreground">
                  Total items needed: {bundleProducts.reduce((sum, p) => sum + (p.quantity * numberOfBundles), 0)}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowBundleDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddBundle} disabled={bundleProducts.length === 0}>
                Add Bundle to Cart
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </Layout>
    );
  }

  return (
    <Layout title="Shopping Cart" isClient>
      <div className="max-w-6xl mx-auto space-y-4 sm:space-y-6 px-2 sm:px-0">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" asChild className="text-xs sm:text-sm">
                <Link href="/client/products">
                  <ArrowLeft className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                  Continue Shopping
                </Link>
              </Button>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowBundleDialog(true)}
                className="flex items-center gap-2 w-full sm:w-auto text-xs sm:text-sm"
              >
                <Package className="h-3 w-3 sm:h-4 sm:w-4" />
                Create Bundle
              </Button>
              <Button variant="outline" size="sm" onClick={clearCart} className="w-full sm:w-auto text-xs sm:text-sm">
                <Trash2 className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                Clear Cart
              </Button>
            </div>
          </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
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
                        src={item.product.images[0]}
                        alt={item.product.name}
                        className="w-full h-full object-cover rounded"
                      />
                    </div>

                    <div className="flex-1 space-y-2">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-medium">{item.product.name}</h3>
                            {item.isBundleItem && (
                              <Badge variant="secondary" className="text-xs bg-purple-100 text-purple-800">
                                Bundle Item
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            SKU: {item.product.sku}
                          </p>
                          {item.product.price && (
                            <p className="text-sm font-medium">
                              Price: ₹{item.product.price}
                            </p>
                          )}
                          <p className="text-sm font-medium">
                            {item.isBundleItem ? (
                              `${item.bundleQuantity} per bundle × ${item.bundleCount} bundles = ${item.quantity} total`
                            ) : (
                              'Individual product'
                            )}
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
                            onClick={() => {
                              console.log(item.product.id, item.quantity);
                              updateQuantity(
                                item.product.id,
                                item.quantity - 1
                              );
                            }}
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
                            max={item.product.availableStock}
                          />
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              updateQuantity(item.product.id, item.quantity + 1)
                            }
                            disabled={
                              item.quantity >= item.product.availableStock
                            }
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>

                        <div className="text-right">
                          <p className="font-medium">Qty: {item.quantity}</p>
                          {item.product.price && (
                            <p className="font-medium">
                              Total: ₹
                              {(item.product.price * item.quantity).toFixed(2)}
                            </p>
                          )}
                          <p className="text-xs text-muted-foreground">
                            Stock: {item.product.availableStock}
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
                    <div
                      key={item.product.id}
                      className="flex justify-between text-sm"
                    >
                      <div>
                        <span>{item.product.name}</span>
                        {item.product.price && (
                          <div className="text-xs text-muted-foreground">
                            ₹{item.product.price} x {item.quantity} = ₹
                            {(item.product.price * item.quantity).toFixed(2)}
                          </div>
                        )}
                      </div>
                      <span>Qty: {item.quantity}</span>
                    </div>
                  ))}
                  <div className="border-t pt-2">
                    <div className="flex justify-between font-medium">
                      <span>Total Items</span>
                      <span>
                        {cartItems.reduce(
                          (sum, item) => sum + item.quantity,
                          0
                        )}
                      </span>
                    </div>
                    {(() => {
                      const totalAmount = cartItems.reduce(
                        (sum, item) =>
                          sum +
                          (item.product.price
                            ? item.product.price * item.quantity
                            : 0),
                        0
                      );
                      return totalAmount > 0 ? (
                        <div className="flex justify-between font-medium">
                          <span>Total Amount</span>
                          <span>₹{totalAmount.toFixed(2)}</span>
                        </div>
                      ) : null;
                    })()}
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

      {/* Bundle Creation Dialog */}
      <Dialog open={showBundleDialog} onOpenChange={setShowBundleDialog}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create Product Bundle</DialogTitle>
            <DialogDescription>
              Create a bundle of products that will be packaged together. Example: 2 notebooks + 1 pen per package.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Bundle Products Search */}
            <div>
              <Label>Search Products for Bundle</Label>
              <div className="relative mt-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by product name or SKU..."
                  value={bundleSearchTerm}
                  onChange={(e) => setBundleSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>

            {/* Bundle Products List */}
            <div className="border rounded-md max-h-48 overflow-y-auto">
              {bundleSearchTerm.trim() !== "" ? (
                bundleSearchResults.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No products found matching "{bundleSearchTerm}"
                  </p>
                ) : (
                  <div className="divide-y">
                    {bundleSearchResults.map((product) => {
                      const isSelected = bundleProducts.some((p) => p.product.id === product.id);
                      return (
                        <div
                          key={product.id}
                          className={`flex items-center justify-between p-3 hover:bg-muted/50 cursor-pointer ${
                            isSelected ? "bg-blue-50" : ""
                          }`}
                          onClick={() => handleBundleProductToggle(product, !isSelected)}
                        >
                          <div className="flex items-center gap-3">
                            <Checkbox checked={isSelected} onChange={() => {}} />
                            <div>
                              <p className="text-sm font-medium">{product.name}</p>
                              <p className="text-xs text-muted-foreground">SKU: {product.sku || "N/A"}</p>
                            </div>
                          </div>
                          {isSelected && (
                            <Badge variant="secondary" className="text-xs">
                              Selected
                            </Badge>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )
              ) : (
                products && products.length > 0 ? (
                  <div className="divide-y">
                    {products.map((product) => {
                      const isSelected = bundleProducts.some((p) => p.product.id === product.id);
                      return (
                        <div
                          key={product.id}
                          className={`flex items-center justify-between p-3 hover:bg-muted/50 cursor-pointer ${
                            isSelected ? "bg-blue-50" : ""
                          }`}
                          onClick={() => handleBundleProductToggle(product, !isSelected)}
                        >
                          <div className="flex items-center gap-3">
                            <Checkbox checked={isSelected} onChange={() => {}} />
                            <div>
                              <p className="text-sm font-medium">{product.name}</p>
                              <p className="text-xs text-muted-foreground">SKU: {product.sku || "N/A"}</p>
                            </div>
                          </div>
                          {isSelected && (
                            <Badge variant="secondary" className="text-xs">
                              Selected
                            </Badge>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    {isProductsLoading ? "Loading products..." : "No products available"}
                  </p>
                )
              )}
            </div>

            {/* Selected Bundle Products */}
            {bundleProducts.length > 0 && (
              <div>
                <Label className="text-sm font-medium">Bundle Contents ({bundleProducts.length} products)</Label>
                <div className="border rounded-md mt-2 max-h-32 overflow-y-auto">
                  {bundleProducts.map((product) => (
                    <div key={product.product.id} className="flex items-center justify-between p-3 border-b last:border-b-0">
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-medium">{product.product.name}</span>
                        <div className="flex items-center gap-1">
                          <Label className="text-xs">Qty per bundle:</Label>
                          <Input
                            type="number"
                            min="1"
                            value={product.quantity}
                            onChange={(e) => handleUpdateBundleProduct(product.product.id, parseInt(e.target.value) || 1)}
                            className="w-16 h-6 text-xs"
                          />
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveBundleProduct(product.product.id)}
                        className="h-6 w-6 p-0"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Number of Bundles */}
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <Label>Number of Bundles</Label>
                <Input
                  type="number"
                  min="1"
                  value={numberOfBundles}
                  onChange={(e) => setNumberOfBundles(parseInt(e.target.value) || 1)}
                  className="mt-1"
                />
              </div>
              <div className="text-sm text-muted-foreground">
                Total items needed: {bundleProducts.reduce((sum, p) => sum + (p.quantity * numberOfBundles), 0)}
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShowBundleDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddBundle} disabled={bundleProducts.length === 0}>
              Add Bundle to Cart
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </Layout>
  );
}
