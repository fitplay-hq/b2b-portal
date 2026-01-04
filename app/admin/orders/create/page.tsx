"use client";

import Layout from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import {
  Calendar,
  Loader2,
  Plus,
  Search,
  X,
  ArrowLeft,
  Mail,
  CheckCircle,
  ShoppingCart,
  Package,
} from "lucide-react";
import { useProducts } from "@/data/product/admin.hooks";
import { useClients } from "@/data/client/admin.hooks";
import { useCreateOrder, useSendOrderEmail } from "@/data/order/admin.hooks";
import type { Product, $Enums } from "@/lib/generated/prisma";
import Link from "next/link";
import React from "react";
import { toast } from "sonner";
import { usePincodeLookup } from "@/hooks/use-pincode-lookup";

type Modes = $Enums.Modes;

interface SelectedProduct extends Product {
  quantity: number;
  bundleProductQuantity?: number; // Added for bundle products
  isBundleItem?: boolean; // Flag to indicate if this is a bundle item
  bundleGroupId?: string; // Unique identifier for each bundle group
}

interface CreatedOrder {
  id: string;
  isMailSent?: boolean;
}

export default function CreateDispatchOrderPage() {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [selectedClientEmail, setSelectedClientEmail] = React.useState("");
  const [requiredByDate, setRequiredByDate] = React.useState("");
  const [modeOfDelivery, setModeOfDelivery] = React.useState<Modes>("AIR");
  const [deliveryAddress, setDeliveryAddress] = React.useState("");
  const [city, setCity] = React.useState("");
  const [state, setState] = React.useState("");
  const [pincode, setPincode] = React.useState("");
  const [manuallyEditedFields, setManuallyEditedFields] = React.useState<{city: boolean, state: boolean}>({city: false, state: false});
  const [consigneeName, setConsigneeName] = React.useState("");
  const [consigneePhone, setConsigneePhone] = React.useState("");
  const [consigneeEmail, setConsigneeEmail] = React.useState("");
  const [deliveryReference, setDeliveryReference] = React.useState("");
  const [packagingInstructions, setPackagingInstructions] = React.useState("");
  const [note, setNote] = React.useState("");
  const [selectedProducts, setSelectedProducts] = React.useState<
    SelectedProduct[]
  >([]);

  // Bundle-related state
  const [showBundleDialog, setShowBundleDialog] = React.useState(false);
  const [bundleProducts, setBundleProducts] = React.useState<SelectedProduct[]>([]);
  const [numberOfBundles, setNumberOfBundles] = React.useState(1);
  const [bundleSearchTerm, setBundleSearchTerm] = React.useState("");

  const { products, isLoading: isProductsLoading } = useProducts();
  const { clients, isLoading: isClientsLoading } = useClients();
  const { createOrder, isCreating } = useCreateOrder();
  const { sendOrderEmail, isSending } = useSendOrderEmail();
  const {
    data: pincodeData,
    isLoading: isPincodeLoading,
    error: pincodeError,
    lookupPincode,
    clearError,
  } = usePincodeLookup();

  const [showEmailDialog, setShowEmailDialog] = React.useState(false);
  const [createdOrder, setCreatedOrder] = React.useState<CreatedOrder | null>(null);

  React.useEffect(() => {
    if (pincodeData && pincodeData.success) {
      // Only auto-fill if the fields haven't been manually edited since the last pincode lookup
      if (!manuallyEditedFields.city) {
        setCity(pincodeData.city);
      }
      if (!manuallyEditedFields.state) {
        setState(pincodeData.state);
      }
    }
  }, [pincodeData, manuallyEditedFields]);

  const handlePincodeChange = React.useCallback(
    (value: string) => {
      setPincode(value);
      clearError();

      if (value.length === 6 && /^\d{6}$/.test(value)) {
        // Reset manual edit flags when looking up a new pincode
        setManuallyEditedFields({city: false, state: false});
        lookupPincode(value);
      } else if (value.length !== 6) {
        setCity("");
        setState("");
        setManuallyEditedFields({city: false, state: false});
      }
    },
    [lookupPincode, clearError]
  );

  const searchResults = React.useMemo(() => {
    if (!products) return [] as Product[];
    const term = searchTerm.trim().toLowerCase();
    if (!term) {
      // Return empty array when no search term - no prefilled list
      return [];
    }
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(term) ||
        (p.sku ? p.sku.toLowerCase().includes(term) : false)
    );
  }, [products, searchTerm]);

  const handleProductToggle = (product: Product, selected: boolean) => {
    if (selected) {
      const exists = selectedProducts.some((p) => p.id === product.id);
      if (!exists) {
        setSelectedProducts((prev) => [...prev, { ...product, quantity: 1 }]);
      }
    } else {
      setSelectedProducts((prev) => prev.filter((p) => p.id !== product.id));
    }
  };

  const handleUpdateProduct = (productId: string, quantity: number) => {
    setSelectedProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, quantity } : p))
    );
  };

  const handleRemoveProduct = (productId: string) => {
    setSelectedProducts((prev) => prev.filter((p) => p.id !== productId));
  };

  // Bundle handling functions
  const bundleSearchResults = React.useMemo(() => {
    if (!products) return [] as Product[];
    const term = bundleSearchTerm.trim().toLowerCase();
    if (!term) return [];
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(term) ||
        (p.sku ? p.sku.toLowerCase().includes(term) : false)
    );
  }, [products, bundleSearchTerm]);

  const handleBundleProductToggle = (product: Product, selected: boolean) => {
    if (selected) {
      const exists = bundleProducts.some((p) => p.id === product.id);
      if (!exists) {
        setBundleProducts((prev) => [...prev, { ...product, quantity: 1 }]);
      }
    } else {
      setBundleProducts((prev) => prev.filter((p) => p.id !== product.id));
    }
  };

  const handleUpdateBundleProduct = (productId: string, quantity: number) => {
    setBundleProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, quantity } : p))
    );
  };

  const handleRemoveBundleProduct = (productId: string) => {
    setBundleProducts((prev) => prev.filter((p) => p.id !== productId));
  };

  const handleAddBundle = () => {
    if (bundleProducts.length === 0) {
      toast.error("Select at least one product for the bundle");
      return;
    }
    if (bundleProducts.some((p) => !p.quantity || p.quantity <= 0)) {
      toast.error("Invalid quantities in bundle");
      return;
    }
    if (numberOfBundles <= 0) {
      toast.error("Number of bundles must be greater than 0");
      return;
    }

    // Generate unique bundle group ID for this bundle
    const bundleGroupId = `admin-bundle-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    // Add bundle items to selected products with total quantity
    const bundleItems = bundleProducts.map((product) => ({
      ...product,
      quantity: product.quantity * numberOfBundles, // Total quantity needed
      bundleProductQuantity: product.quantity, // Quantity per bundle
      isBundleItem: true,
      bundleGroupId: bundleGroupId,
    }));

    setSelectedProducts((prev) => [...prev, ...bundleItems]);
    toast.success(`Added bundle with ${bundleProducts.length} products × ${numberOfBundles} bundles`);

    // Reset bundle state
    setBundleProducts([]);
    setNumberOfBundles(1);
    setBundleSearchTerm("");
    setShowBundleDialog(false);
  };

  const handleCreate = async () => {
    if (!selectedClientEmail) return toast.error("Select a client");
    if (!consigneeName || !consigneePhone)
      return toast.error("Provide consignee details");
    if (!deliveryAddress || !city || !state || !pincode)
      return toast.error("Provide full address");
    if (!requiredByDate) return toast.error("Select required by date");
    if (selectedProducts.length === 0)
      return toast.error("Select at least one product");
    if (selectedProducts.some((p) => !p.quantity || p.quantity <= 0))
      return toast.error("Invalid quantities");

    try {
      // Separate regular items from bundle items
      const regularItems = selectedProducts.filter(p => !p.isBundleItem);
      const bundleItems = selectedProducts.filter(p => p.isBundleItem);

      console.log('Order creation data:', {
        selectedProducts,
        regularItems,
        bundleItems,
        uniqueBundleGroups: [...new Set(bundleItems.map(item => item.bundleGroupId).filter(Boolean))].length
      });

      // Calculate number of bundles from unique bundle groups
      const uniqueBundleGroups = new Set(bundleItems.map(item => item.bundleGroupId).filter(Boolean));
      const numberOfBundles = uniqueBundleGroups.size;

      const order = await createOrder({
        clientEmail: selectedClientEmail,
        deliveryAddress,
        items: regularItems.map((p) => ({
          productId: p.id,
          quantity: p.quantity,
          price: p.price ?? 0,
        })),
        bundleOrderItems: bundleItems.map((p) => ({
          productId: p.id,
          quantity: p.quantity,
          price: p.price ?? 0,
          bundleProductQuantity: p.bundleProductQuantity,
          bundleGroupId: p.bundleGroupId, // Include bundleGroupId
        })),
        numberOfBundles,
        consigneeName,
        consigneePhone,
        consigneeEmail,
        city,
        state,
        pincode,
        requiredByDate: new Date(requiredByDate).toISOString(),
        modeOfDelivery,
        note,
        deliveryReference,
        packagingInstructions,
      });
      setCreatedOrder(order);
      setShowEmailDialog(true);
      toast.success("Dispatch order created");
    } catch {
      toast.error("Failed to create dispatch order");
    }
  };

  const handleSendEmail = async () => {
    if (!createdOrder) return;
    try {
      await sendOrderEmail({
        orderId: createdOrder.id,
        clientEmail: selectedClientEmail,
      });
      toast.success("Email sent successfully");
      setShowEmailDialog(false);
      window.location.href = "/admin/orders";
    } catch {
      toast.error("Failed to send email");
    }
  };

  const handleCloseDialog = () => {
    setShowEmailDialog(false);
    window.location.href = "/admin/orders";
  };

  return (
    <Layout isClient={false}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Create Dispatch Order</h1>
          <p className="text-muted-foreground">
            Fill order details and pick products
          </p>
        </div>
        <Button asChild variant="outline">
          <Link href="/admin/orders">
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to Orders
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-1 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Client</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <Label>Client</Label>
                <Select
                  value={selectedClientEmail}
                  onValueChange={setSelectedClientEmail}
                >
                  <SelectTrigger>
                    <SelectValue
                      placeholder={
                        isClientsLoading
                          ? "Loading clients..."
                          : "Select client"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {(clients || []).map((c) => (
                      <SelectItem
                        key={c.id}
                        value={c.email}
                        className="capitalize"
                      >
                        {c.companyName || c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Consignee Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-1 gap-2">
                <div className="space-y-2">
                  <Label>Consignee Name</Label>
                  <Input
                    value={consigneeName}
                    onChange={(e) => setConsigneeName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Consignee Phone</Label>
                  <Input
                    value={consigneePhone}
                    onChange={(e) => setConsigneePhone(e.target.value)}
                    maxLength={10}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Consignee Email (optional)</Label>
                  <Input
                    type="email"
                    value={consigneeEmail}
                    onChange={(e) => setConsigneeEmail(e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Delivery Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <Label>Delivery Address *</Label>
                <Textarea
                  rows={4}
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                />
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div className="space-y-2">
                  <Label>Pincode *</Label>
                  <div className="relative">
                    <Input
                      value={pincode}
                      onChange={(e) => handlePincodeChange(e.target.value)}
                      placeholder="Enter 6-digit pincode"
                      maxLength={6}
                      className={pincodeError ? "border-red-500" : ""}
                    />
                    {isPincodeLoading && (
                      <Loader2 className="absolute right-3 top-3 h-4 w-4 animate-spin text-muted-foreground" />
                    )}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>City *</Label>
                  <Input
                    value={city}
                    onChange={(e) => {
                      setCity(e.target.value);
                      setManuallyEditedFields(prev => ({...prev, city: true}));
                    }}
                    placeholder="Auto-filled from pincode"
                  />
                </div>
                <div className="space-y-2">
                  <Label>State *</Label>
                  <Input
                    value={state}
                    onChange={(e) => {
                      setState(e.target.value);
                      setManuallyEditedFields(prev => ({...prev, state: true}));
                    }}
                    placeholder="Auto-filled from pincode"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Required By Date *</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="date"
                    className="pl-9"
                    value={requiredByDate}
                    onChange={(e) => setRequiredByDate(e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Packaging Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <Label>Mode of Delivery *</Label>
                <Select
                  value={modeOfDelivery}
                  onValueChange={(v: Modes) => setModeOfDelivery(v)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="SURFACE">Surface</SelectItem>
                    <SelectItem value="AIR">Air</SelectItem>
                    <SelectItem value="HAND_DELIVERY">Hand Delivery</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Additional Notes (Optional)</Label>
                <Textarea
                  rows={3}
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Order Reference</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Label>Delivery Reference (optional)</Label>
              <Input
                value={deliveryReference}
                onChange={(e) => setDeliveryReference(e.target.value)}
                placeholder="Any order reference for future use"
              />
              <Label>Packaging Instructions (optional)</Label>
              <Input
                value={packagingInstructions}
                onChange={(e) => setPackagingInstructions(e.target.value)}
              />
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Products</CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowBundleDialog(true)}
                  className="flex items-center gap-2"
                >
                  <Package className="h-4 w-4" />
                  Create Bundle
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <Label>Search Products</Label>
                <div className="relative mt-1">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Start typing to search by product name or SKU... (⏎ to select first result, ⎋ to clear)"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9 pr-8"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && searchResults.length > 0) {
                        const firstResult = searchResults[0];
                        const isSelected = selectedProducts.some(p => p.id === firstResult.id);
                        handleProductToggle(firstResult, !isSelected);
                        toast.success(`${isSelected ? 'Removed' : 'Added'} ${firstResult.name}`);
                      } else if (e.key === 'Escape') {
                        setSearchTerm("");
                      }
                    }}
                  />
                  {searchTerm && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute right-1 top-1 h-6 w-6 p-0 hover:bg-gray-100"
                      onClick={() => setSearchTerm("")}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  )}
                  {isProductsLoading && (
                    <Loader2 className="absolute right-3 top-3 h-4 w-4 animate-spin text-muted-foreground" />
                  )}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label className="text-sm font-medium">
                    {searchTerm 
                      ? `Search Results (${searchResults.length})` 
                      : `Search for Products`
                    }
                  </Label>
                  {searchResults.length > 0 && (
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 text-xs px-3 bg-green-50 hover:bg-green-100 border-green-200 text-green-700"
                        onClick={() => {
                          let addedCount = 0;
                          searchResults.forEach(product => {
                            const isSelected = selectedProducts.some(p => p.id === product.id);
                            if (!isSelected) {
                              handleProductToggle(product, true);
                              addedCount++;
                            }
                          });
                          toast.success(`Added ${addedCount} product(s) to order`);
                        }}
                      >
                        ✓ Select All ({searchResults.length})
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 text-xs px-3 bg-red-50 hover:bg-red-100 border-red-200 text-red-700"
                        onClick={() => {
                          let removedCount = 0;
                          searchResults.forEach(product => {
                            const isSelected = selectedProducts.some(p => p.id === product.id);
                            if (isSelected) {
                              handleProductToggle(product, false);
                              removedCount++;
                            }
                          });
                          if (removedCount > 0) {
                            toast.success(`Removed ${removedCount} product(s) from order`);
                          }
                        }}
                      >
                        ✕ Deselect All
                      </Button>
                    </div>
                  )}
                </div>
                <div className="border rounded-md max-h-96 overflow-y-auto">
                  {searchResults.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-8">
                      {searchTerm ? `No products found matching "${searchTerm}"` : "Start typing to search for products..."}
                    </p>
                  ) : (
                    <div className="divide-y">
                      {searchResults.map((product) => {
                        const isSelected = selectedProducts.some(
                          (p) => p.id === product.id
                        );
                        return (
                          <div
                            key={product.id}
                            className={`flex items-center justify-between p-4 hover:bg-muted/50 cursor-pointer transition-all duration-200 border-l-4 ${
                              isSelected 
                                ? "bg-blue-50 border-l-blue-500 shadow-sm" 
                                : "border-l-transparent hover:border-l-gray-200"
                            }`}
                            onClick={() => {
                              handleProductToggle(product, !isSelected);
                              toast.success(`${isSelected ? 'Removed' : 'Added'} ${product.name}`, {
                                duration: 1000,
                              });
                            }}
                          >
                            <div className="flex items-center gap-4 min-w-0 flex-1">
                              <div className={`rounded-md p-1 ${isSelected ? 'bg-blue-100' : 'bg-gray-100'}`}>
                                <Checkbox
                                  checked={isSelected}
                                  onChange={() => {}}
                                  className="data-[state=checked]:bg-blue-600"
                                />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                  <p className="text-sm font-semibold truncate text-gray-900">
                                    {product.name}
                                  </p>
                                  {isSelected && (
                                    <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-800 font-medium">
                                      ✓ Selected
                                    </Badge>
                                  )}
                                </div>
                                <div className="flex items-center gap-3 mt-1">
                                  <span className="text-xs text-gray-600 font-medium">
                                    SKU: {product.sku || "N/A"}
                                  </span>
                                  <span className="text-xs">•</span>
                                  <span className="text-xs">
                                    Stock:{" "}
                                    <span className={`font-semibold ${
                                      product.availableStock === 0 
                                        ? "text-red-600" 
                                        : product.availableStock < 10 
                                          ? "text-orange-600" 
                                          : "text-green-600"
                                    }`}>
                                      {product.availableStock} units
                                    </span>
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center">
                              {isSelected ? (
                                <div className="text-blue-600">
                                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                  </svg>
                                </div>
                              ) : (
                                <div className="text-gray-400 hover:text-gray-600">
                                  <Plus className="w-5 h-5" />
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-3">
                  <Label className="text-base font-semibold text-gray-900">
                    Selected Products ({selectedProducts.length})
                  </Label>
                  {selectedProducts.length > 0 && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedProducts([])}
                      className="text-xs h-8 bg-red-50 hover:bg-red-100 border-red-200 text-red-700"
                    >
                      ✕ Clear All
                    </Button>
                  )}
                </div>
                {selectedProducts.length === 0 ? (
                  <div className="border rounded-md p-8 text-center">
                    <ShoppingCart className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                    <p className="text-sm text-muted-foreground">
                      Search and select products above to add them to this order
                    </p>
                  </div>
                ) : (
                  <div className="border rounded-md overflow-hidden max-h-96 overflow-y-auto">
                    <div>
                      {selectedProducts.map((product, index) => (
                        <div
                          key={`${product.id}-${index}`}
                          className={`border-b last:border-b-0 p-4 ${
                            product.isBundleItem ? "bg-purple-50 border-purple-200" : ""
                          }`}
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <span className="text-xs font-medium text-muted-foreground">
                                #{index + 1}
                              </span>
                              <div>
                                <div className="flex items-center gap-2">
                                  <p className="text-sm font-medium">
                                    {product.name}
                                  </p>
                                  {product.isBundleItem && (
                                    <Badge variant="secondary" className="text-xs bg-purple-100 text-purple-800">
                                      Bundle Item
                                    </Badge>
                                  )}
                                </div>
                                <p className="text-xs text-muted-foreground">
                                  Available: {product.availableStock} units
                                </p>
                                {product.isBundleItem && (
                                  <p className="text-xs text-purple-600 font-medium">
                                    {product.bundleProductQuantity} per bundle × {product.quantity / product.bundleProductQuantity} bundles = {product.quantity} total
                                  </p>
                                )}
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRemoveProduct(product.id)}
                              className="h-6 w-6 p-0 hover:bg-red-100 hover:text-red-600"
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>

                          <div className="flex items-center gap-3 flex-wrap">
                            <div className="flex items-center gap-2">
                              <Label className="text-xs text-muted-foreground">
                                Qty:
                              </Label>
                              <div className="flex items-center gap-1">
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  className="h-8 w-8 p-0"
                                  onClick={() => {
                                    const newQty = Math.max(1, product.quantity - 1);
                                    handleUpdateProduct(product.id, newQty);
                                  }}
                                >
                                  -
                                </Button>
                                <Input
                                  type="number"
                                  min="1"
                                  max={product.availableStock}
                                  value={product.quantity}
                                  onChange={(e) =>
                                    handleUpdateProduct(
                                      product.id,
                                      Math.min(product.availableStock, parseInt(e.target.value) || 0)
                                    )
                                  }
                                  className="w-20 h-8 text-xs text-center"
                                />
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  className="h-8 w-8 p-0"
                                  onClick={() => {
                                    const newQty = Math.min(product.availableStock, product.quantity + 1);
                                    handleUpdateProduct(product.id, newQty);
                                  }}
                                >
                                  +
                                </Button>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 ml-auto">
                              <div className="flex gap-1">
                                {[1, 5, 10].map(qty => (
                                  <Button
                                    key={qty}
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    className="h-6 px-2 text-xs"
                                    onClick={() => handleUpdateProduct(product.id, Math.min(product.availableStock, qty))}
                                    disabled={qty > product.availableStock}
                                  >
                                    {qty}
                                  </Button>
                                ))}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                Will dispatch:{" "}
                                <span className="font-medium">
                                  {product.quantity}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-2">
            <Button asChild variant="outline" disabled={isCreating}>
              <Link href="/admin/orders">Cancel</Link>
            </Button>
            <Button
              onClick={handleCreate}
              disabled={isCreating || selectedProducts.length === 0}
            >
              {isCreating ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Order
                </>
              )}
            </Button>
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
            {bundleSearchTerm && (
              <div className="border rounded-md max-h-48 overflow-y-auto">
                {bundleSearchResults.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No products found matching "{bundleSearchTerm}"
                  </p>
                ) : (
                  <div className="divide-y">
                    {bundleSearchResults.map((product) => {
                      const isSelected = bundleProducts.some((p) => p.id === product.id);
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
            )}

            {/* Selected Bundle Products */}
            {bundleProducts.length > 0 && (
              <div>
                <Label className="text-sm font-medium">Bundle Contents ({bundleProducts.length} products)</Label>
                <div className="border rounded-md mt-2 max-h-32 overflow-y-auto">
                  {bundleProducts.map((product) => (
                    <div key={product.id} className="flex items-center justify-between p-3 border-b last:border-b-0">
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-medium">{product.name}</span>
                        <div className="flex items-center gap-1">
                          <Label className="text-xs">Qty per bundle:</Label>
                          <Input
                            type="number"
                            min="1"
                            value={product.quantity}
                            onChange={(e) => handleUpdateBundleProduct(product.id, parseInt(e.target.value) || 1)}
                            className="w-16 h-6 text-xs"
                          />
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveBundleProduct(product.id)}
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
              Add Bundle to Order
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showEmailDialog} onOpenChange={setShowEmailDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Order Created Successfully</DialogTitle>
            <DialogDescription>
              The order has been created. Would you like to send an email notification to the client?
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={handleCloseDialog}>
              Skip
            </Button>
            <Button
              onClick={handleSendEmail}
              disabled={isSending || createdOrder?.isMailSent}
            >
              {createdOrder?.isMailSent ? (
                <>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Mail Sent
                </>
              ) : isSending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Mail className="mr-2 h-4 w-4" />
                  Send Email
                </>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </Layout>
  );
}
