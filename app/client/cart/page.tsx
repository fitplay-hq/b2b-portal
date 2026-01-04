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
  
  // New inline bundle state
  const [selectedForBundle, setSelectedForBundle] = useState<Set<string>>(new Set());
  const [bundleQuantities, setBundleQuantities] = useState<{[productId: string]: number}>({});
  const [inlineBundleCount, setInlineBundleCount] = useState(1);

  const { products, isLoading: isProductsLoading } = useProducts();

  useEffect(() => {
    const cart = getStoredData<CartItem[]>(
      `fitplay_cart_${session?.user?.id}`,
      []
    );
    setCartItems(cart);
  }, [session?.user?.id]);
  
  // Clean up bundle selections when cart changes
  useEffect(() => {
    const individualProductIds = cartItems
      .filter(item => !item.isBundleItem)
      .map(item => item.product.id);
    
    // Remove any selected items that are no longer individual items
    const newSelected = new Set(Array.from(selectedForBundle).filter(id => 
      individualProductIds.includes(id)
    ));
    
    if (newSelected.size !== selectedForBundle.size) {
      setSelectedForBundle(newSelected);
      // Also clean up bundle quantities for removed items
      setBundleQuantities(prev => {
        const updated = { ...prev };
        Object.keys(updated).forEach(key => {
          if (!individualProductIds.includes(key)) {
            delete updated[key];
          }
        });
        return updated;
      });
    }
  }, [cartItems, selectedForBundle]);
  
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
    (p: any) => {
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

    // Generate unique bundle group ID for this bundle
    const bundleGroupId = `bundle-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    // Create bundle items with proper bundle metadata
    const bundleItems: CartItem[] = bundleProducts.map((bundleProduct) => ({
      product: bundleProduct.product,
      quantity: bundleProduct.quantity * numberOfBundles,
      isBundleItem: true,
      bundleQuantity: bundleProduct.quantity,
      bundleCount: numberOfBundles,
      bundleGroupId: bundleGroupId,
    }));

    // Add bundle items to cart
    const updatedCart = [...cartItems];
    bundleItems.forEach((bundleItem) => {
      const existingIndex = updatedCart.findIndex(
        (item) => item.product.id === bundleItem.product.id && item.bundleGroupId === bundleItem.bundleGroupId
      );
      if (existingIndex >= 0) {
        // If item with same bundleGroupId already exists, add to its quantity
        updatedCart[existingIndex].quantity += bundleItem.quantity;
      } else {
        // Check if this product exists as individual item or in another bundle
        const existingProductIndex = updatedCart.findIndex(
          (item) => item.product.id === bundleItem.product.id
        );
        if (existingProductIndex >= 0) {
          // Add as separate bundle item (don't merge with existing)
          updatedCart.push(bundleItem);
        } else {
          updatedCart.push(bundleItem);
        }
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
  
  // Inline bundle functions
  const handleBundleSelection = (productId: string, selected: boolean) => {
    // Only allow selection of individual (non-bundle) items
    const cartItem = cartItems.find(item => item.product.id === productId);
    if (cartItem && cartItem.isBundleItem) {
      return; // Don't allow bundle items to be selected for bundling
    }
    
    const newSelected = new Set(selectedForBundle);
    if (selected) {
      newSelected.add(productId);
      // Set default bundle quantity to current cart quantity
      if (cartItem) {
        setBundleQuantities(prev => ({ ...prev, [productId]: cartItem.quantity }));
      }
    } else {
      newSelected.delete(productId);
      setBundleQuantities(prev => {
        const updated = { ...prev };
        delete updated[productId];
        return updated;
      });
    }
    setSelectedForBundle(newSelected);
  };
  
  const handleBundleQuantityChange = (productId: string, quantity: number) => {
    setBundleQuantities(prev => ({ ...prev, [productId]: Math.max(1, quantity) }));
  };
  
  const addInlineBundle = () => {
    if (selectedForBundle.size === 0) {
      toast.error("Select at least one product for the bundle");
      return;
    }
    
    const selectedItems = cartItems.filter(item => selectedForBundle.has(item.product.id));
    const updatedCart = [...cartItems];
    
    // Reduce quantities from individual items and add bundle
    selectedItems.forEach(item => {
      const bundleQty = bundleQuantities[item.product.id] || 1;
      const totalBundleItems = bundleQty * inlineBundleCount;
      
      // Find the item in cart and reduce its quantity
      const cartIndex = updatedCart.findIndex(cartItem => cartItem.product.id === item.product.id);
      if (cartIndex >= 0) {
        if (updatedCart[cartIndex].quantity >= totalBundleItems) {
          updatedCart[cartIndex].quantity -= totalBundleItems;
          
          // If quantity becomes 0, remove the item
          if (updatedCart[cartIndex].quantity === 0) {
            updatedCart.splice(cartIndex, 1);
          }
        } else {
          toast.error(`Not enough ${item.product.name} in cart for bundle`);
          return;
        }
      }
    });
    
    // Add bundle items
    // Generate unique bundle group ID for this bundle
    const bundleGroupId = `bundle-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    selectedItems.forEach(item => {
      const bundleQty = bundleQuantities[item.product.id] || 1;
      const totalBundleItems = bundleQty * inlineBundleCount;
      
      const bundleItem: CartItem = {
        product: item.product,
        quantity: totalBundleItems,
        isBundleItem: true,
        bundleQuantity: bundleQty,
        bundleCount: inlineBundleCount,
        bundleGroupId: bundleGroupId, // Add unique bundle group ID
      };
      
      // Check if bundle item already exists with same bundleGroupId
      const existingBundleIndex = updatedCart.findIndex(
        (cartItem) => cartItem.product.id === item.product.id && cartItem.isBundleItem && cartItem.bundleGroupId === bundleGroupId
      );
      
      if (existingBundleIndex >= 0) {
        updatedCart[existingBundleIndex].quantity += totalBundleItems;
      } else {
        updatedCart.push(bundleItem);
      }
    });
    
    updateCart(updatedCart);
    
    // Reset inline bundle state
    setSelectedForBundle(new Set());
    setBundleQuantities({});
    setInlineBundleCount(1);
    
    toast.success(`Added ${inlineBundleCount} bundle(s) to cart`);
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
                {(() => {
                  // Separate individual items and bundle items
                  const individualItems = cartItems.filter(item => !item.isBundleItem);
                  const bundleItems = cartItems.filter(item => item.isBundleItem);
                  
                  // Group bundle items by bundleGroupId
                  const bundleGroups = bundleItems.reduce((groups: { [key: string]: typeof cartItems }, item) => {
                    const groupId = item.bundleGroupId || 'default';
                    if (!groups[groupId]) {
                      groups[groupId] = [];
                    }
                    groups[groupId].push(item);
                    return groups;
                  }, {});

                  return (
                    <>
                      {/* Individual Items */}
                      {individualItems.map((item) => (
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
                                </div>
                                <p className="text-sm text-muted-foreground">
                                  SKU: {item.product.sku}
                                </p>
                                {item.product.price && (
                                  <p className="text-sm font-medium">
                                    Price: ₹{item.product.price}
                                  </p>
                                )}
                                <p className="text-sm font-medium">Individual product</p>
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
                                  onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
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
                                  onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                                  disabled={item.quantity >= item.product.availableStock}
                                >
                                  <Plus className="h-3 w-3" />
                                </Button>
                              </div>

                              <div className="text-right">
                                <p className="font-medium">Qty: {item.quantity}</p>
                                {item.product.price && (
                                  <p className="font-medium">
                                    Total: ₹{(item.product.price * item.quantity).toFixed(2)}
                                  </p>
                                )}
                                <p className="text-xs text-muted-foreground">
                                  Stock: {item.product.availableStock}
                                </p>
                              </div>
                            </div>
                            
                            {/* Bundle Selection - Only for individual items */}
                            <div className="flex items-center gap-2 pt-2 border-t border-dashed">
                              <Checkbox 
                                id={`bundle-${item.product.id}`}
                                checked={selectedForBundle.has(item.product.id)}
                                onCheckedChange={(checked) => handleBundleSelection(item.product.id, checked as boolean)}
                              />
                              <Label htmlFor={`bundle-${item.product.id}`} className="text-sm text-muted-foreground cursor-pointer">
                                Add to Bundle
                              </Label>
                            </div>
                          </div>
                        </div>
                      ))}

                      {/* Bundle Groups */}
                      {Object.entries(bundleGroups).map(([groupId, items], bundleIndex) => {
                        const bundleCount = items[0]?.bundleCount || 1;
                        return (
                        <div key={groupId} className="border-2 border-blue-200 rounded-lg p-4 bg-blue-50/30">
                          {/* Bundle Header */}
                          <div className="flex items-center justify-between mb-3 pb-2 border-b-2 border-blue-300">
                            <div className="flex items-center gap-2">
                              <Package className="h-5 w-5 text-blue-600" />
                              <h4 className="font-semibold text-blue-900">Bundle {bundleIndex + 1}</h4>
                              <Badge className="bg-blue-600 text-white">
                                {items.length} items • {bundleCount} bundle{bundleCount > 1 ? 's' : ''}
                              </Badge>
                            </div>
                          </div>

                          {/* Bundle Items */}
                          <div className="space-y-3">
                            {items.map((item) => (
                              <div
                                key={item.product.id}
                                className="flex gap-4 p-3 border border-blue-200 bg-white rounded-lg"
                              >
                                <div className="w-16 h-16 flex-shrink-0">
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
                                        <h3 className="font-medium text-sm">{item.product.name}</h3>
                                        <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-800">
                                          Bundle Item
                                        </Badge>
                                      </div>
                                      <p className="text-xs text-muted-foreground">
                                        SKU: {item.product.sku}
                                      </p>
                                      {item.product.price && (
                                        <p className="text-xs font-medium">
                                          Price: ₹{item.product.price}
                                        </p>
                                      )}
                                      <p className="text-xs font-medium text-blue-700">
                                        {item.bundleQuantity} per bundle × {item.bundleCount} bundles = {item.quantity} total
                                      </p>
                                    </div>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => removeItem(item.product.id)}
                                      className="text-destructive hover:text-destructive"
                                    >
                                      <Trash2 className="h-3 w-3" />
                                    </Button>
                                  </div>

                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
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
                                        className="w-16 text-center h-8"
                                        min="1"
                                        max={item.product.availableStock}
                                      />
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                                        disabled={item.quantity >= item.product.availableStock}
                                      >
                                        <Plus className="h-3 w-3" />
                                      </Button>
                                    </div>

                                    <div className="text-right">
                                      <p className="font-medium text-sm">Qty: {item.quantity}</p>
                                      {item.product.price && (
                                        <p className="font-medium text-sm">
                                          Total: ₹{(item.product.price * item.quantity).toFixed(2)}
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
                          </div>
                        </div>
                      );
                      })}
                    </>
                  );
                })()}
              </CardContent>
            </Card>
            
            {/* Inline Bundle Creation UI */}
            {selectedForBundle.size > 0 && (
              <Card className="border-2 border-dashed border-gray-200 bg-white shadow-sm">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2">
                    <Package className="h-5 w-5 text-gray-600" />
                    <CardTitle className="text-lg text-gray-800">Create Bundle</CardTitle>
                    <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-300">
                      {selectedForBundle.size} items selected
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Selected Products */}
                  <div className="space-y-2">
                    {cartItems
                      .filter(item => selectedForBundle.has(item.product.id) && !item.isBundleItem)
                      .map(item => (
                        <div key={item.product.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 flex-shrink-0">
                              <ImageWithFallback
                                src={item.product.images[0]}
                                alt={item.product.name}
                                className="w-full h-full object-cover rounded"
                              />
                            </div>
                            <div>
                              <p className="font-medium text-sm">{item.product.name}</p>
                              <p className="text-xs text-muted-foreground">Available in cart: {item.quantity}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Label className="text-xs text-muted-foreground">Qty per bundle:</Label>
                            <Input
                              type="number"
                              min="1"
                              max={item.quantity}
                              value={bundleQuantities[item.product.id] || 1}
                              onChange={(e) => handleBundleQuantityChange(item.product.id, parseInt(e.target.value) || 1)}
                              className="w-16 h-8 text-center"
                            />
                          </div>
                        </div>
                      ))
                    }
                  </div>
                  
                  {/* Bundle Configuration */}
                  <div className="flex items-center justify-between p-3 bg-gray-100 rounded-lg border border-gray-200">
                    <div className="flex items-center gap-2">
                      <Label className="font-medium text-gray-800">Number of Bundles:</Label>
                      <Input
                        type="number"
                        min="1"
                        value={inlineBundleCount}
                        onChange={(e) => setInlineBundleCount(parseInt(e.target.value) || 1)}
                        className="w-20 h-8 text-center"
                      />
                    </div>
                    <div className="text-sm text-gray-700">
                      Total items needed: {Array.from(selectedForBundle).reduce((sum, productId) => {
                        const qty = bundleQuantities[productId] || 1;
                        const item = cartItems.find(item => item.product.id === productId && !item.isBundleItem);
                        return item ? sum + (qty * inlineBundleCount) : sum;
                      }, 0)}
                    </div>
                  </div>
                  
                  {/* Bundle Actions */}
                  <div className="flex gap-2 pt-2">
                    <Button 
                      onClick={addInlineBundle}
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      <Package className="h-4 w-4 mr-2" />
                      Add Bundle to Cart
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        setSelectedForBundle(new Set());
                        setBundleQuantities({});
                        setInlineBundleCount(1);
                      }}
                      className="border-gray-300 text-gray-700 hover:bg-gray-50"
                    >
                      Clear Selection
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
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
