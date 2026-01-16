"use client";

import Layout from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

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
  Building2,
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
  
  // Inline bundle selection state
  const [selectedForBundle, setSelectedForBundle] = React.useState<Set<string>>(new Set());
  const [bundleQuantities, setBundleQuantities] = React.useState<{ [key: string]: number }>({});
  const [inlineBundleCount, setInlineBundleCount] = React.useState(1);

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

  const [clientSearchOpen, setClientSearchOpen] = React.useState(false);
  const [clientSearchTerm, setClientSearchTerm] = React.useState("");
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

  const filteredClients = React.useMemo(() => {
    if (!clients) return [];
    if (!clientSearchTerm.trim()) return clients;
    
    const term = clientSearchTerm.toLowerCase().trim();
    return clients.filter(client => 
      client.name.toLowerCase().includes(term) ||
      client.email.toLowerCase().includes(term) ||
      (client.company?.name || client.companyName || "").toLowerCase().includes(term)
    );
  }, [clients, clientSearchTerm]);

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

  const getTotalBundledQuantity = (productId: string) => {
  return selectedProducts
    .filter(p => p.id === productId && p.isBundleItem)
    .reduce((sum, p) => sum + p.quantity, 0);
};


  const handleAddBundle = () => {
  if (bundleProducts.length === 0) {
    toast.error("Select at least one product for the bundle");
    return;
  }

  // 🔒 VALIDATION (same as client)
  for (const bp of bundleProducts) {
    const individual = selectedProducts.find(
      p => p.id === bp.id && !p.isBundleItem
    );

    if (!individual) {
      toast.error(`${bp.name} is not added as an individual product`);
      return;
    }

    const alreadyBundled = getTotalBundledQuantity(bp.id);
    const neededNow = bp.quantity * numberOfBundles;
    const totalNeeded = alreadyBundled + neededNow;

    if (totalNeeded > individual.quantity) {
      toast.error(
        `Not enough ${bp.name}. Need ${totalNeeded} (bundles) but only ${individual.quantity} selected`
      );
      return;
    }
  }

  const bundleGroupId = `admin-bundle-${Date.now()}-${Math.random()
    .toString(36)
    .slice(2)}`;

  const bundleItems: SelectedProduct[] = bundleProducts.map(bp => ({
    ...bp,
    quantity: bp.quantity * numberOfBundles,
    bundleProductQuantity: bp.quantity,
    isBundleItem: true,
    bundleGroupId,
  }));

  setSelectedProducts(prev => [...prev, ...bundleItems]);

  toast.success(`Added ${numberOfBundles} bundle(s)`);

  setBundleProducts([]);
  setNumberOfBundles(1);
  setBundleSearchTerm("");
  setShowBundleDialog(false);
};

  // Inline bundle handlers
  const handleBundleSelection = (productId: string, checked: boolean) => {
    const newSelected = new Set(selectedForBundle);
    if (checked) {
      newSelected.add(productId);
      // Initialize quantity to 1 if not set or if less than 1
      setBundleQuantities(prev => {
        if (!prev[productId] || prev[productId] < 1) {
          return { ...prev, [productId]: 1 };
        }
        return prev;
      });
    } else {
      newSelected.delete(productId);
      // Clean up bundle quantity when unchecked
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

  const selectedItems = selectedProducts.filter(
    p => selectedForBundle.has(p.id) && !p.isBundleItem
  );

  // 🔒 VALIDATION (same as client)
  for (const item of selectedItems) {
    const bundleQty = bundleQuantities[item.id] || 1;
    const neededNow = bundleQty * inlineBundleCount;
    const alreadyBundled = getTotalBundledQuantity(item.id);
    const totalNeeded = alreadyBundled + neededNow;

    if (totalNeeded > item.quantity) {
      toast.error(
        `Not enough ${item.name}. Need ${totalNeeded} total (${alreadyBundled} already bundled), but only ${item.quantity} selected`
      );
      return;
    }
  }

  const bundleGroupId = `admin-bundle-${Date.now()}-${Math.random()
    .toString(36)
    .slice(2)}`;

  const bundleItems: SelectedProduct[] = selectedItems.map(item => {
    const bundleQty = bundleQuantities[item.id] || 1;
    return {
      ...item,
      quantity: bundleQty * inlineBundleCount,
      bundleProductQuantity: bundleQty,
      isBundleItem: true,
      bundleGroupId,
    };
  });

  setSelectedProducts(prev => [...prev, ...bundleItems]);

  toast.success(`Added ${inlineBundleCount} bundle(s)`);

  setSelectedForBundle(new Set());
  setBundleQuantities({});
  setInlineBundleCount(1);
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

      // Calculate bundled quantities per product
      const bundledQuantityByProduct = new Map<string, number>();
      for (const bundleItem of bundleItems) {
        const currentQty = bundledQuantityByProduct.get(bundleItem.id) || 0;
        bundledQuantityByProduct.set(bundleItem.id, currentQty + bundleItem.quantity);
      }

      // Adjust regular items by subtracting bundled quantities
      // This ensures stock is only reduced once for the total quantity
      const adjustedRegularItems = regularItems
        .map((item) => {
          const bundledQty = bundledQuantityByProduct.get(item.id) || 0;
          const adjustedQty = item.quantity - bundledQty;
          return { ...item, quantity: adjustedQty };
        })
        .filter((item) => item.quantity > 0); // Only include items with remaining quantity

      console.log('Order creation data:', {
        selectedProducts,
        regularItems,
        adjustedRegularItems,
        bundleItems,
        bundledQuantityByProduct: Object.fromEntries(bundledQuantityByProduct),
        uniqueBundleGroups: [...new Set(bundleItems.map(item => item.bundleGroupId).filter(Boolean))].length
      });

      // Calculate number of bundles from unique bundle groups
      const uniqueBundleGroups = new Set(bundleItems.map(item => item.bundleGroupId).filter(Boolean));
      const numberOfBundles = uniqueBundleGroups.size;

      const order = await createOrder({
        clientEmail: selectedClientEmail,
        deliveryAddress,
        items: adjustedRegularItems.map((p) => ({
          productId: p.id,
          quantity: p.quantity,
          price: p.price ?? 0,
        })),
        bundleOrderItems: bundleItems.map((p) => ({
          productId: p.id,
          quantity: p.quantity,
          price: p.price ?? 0,
          bundleProductQuantity: p.bundleProductQuantity,
          bundleGroupId: p.bundleGroupId,
          numberOfBundles: p.bundleProductQuantity && p.quantity ? p.quantity / p.bundleProductQuantity : 1,
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
                <Label>Client *</Label>
                <Popover open={clientSearchOpen} onOpenChange={setClientSearchOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={clientSearchOpen}
                      className="w-full justify-between h-auto min-h-[60px] text-left"
                    >
                      {selectedClientEmail && clients ? (() => {
                        const selectedClient = clients.find(c => c.email === selectedClientEmail);
                        if (!selectedClient) return "Select client";
                        return (
                          <div className="flex flex-col gap-1 py-1.5 text-left w-full pr-4">
                            <div className="font-medium text-sm truncate">{selectedClient.name}</div>
                            <div className="flex flex-col gap-1 text-xs text-muted-foreground">
                              {(selectedClient.company?.name || selectedClient.companyName) && (
                                <div className="flex items-center gap-1.5">
                                  <Building2 className="h-3 w-3 shrink-0" />
                                  <span className="truncate">{selectedClient.company?.name || selectedClient.companyName}</span>
                                </div>
                              )}
                              <div className="flex items-center gap-1.5">
                                <Mail className="h-3 w-3 shrink-0" />
                                <span className="truncate">{selectedClient.email}</span>
                              </div>
                            </div>
                          </div>
                        );
                      })() : (
                        <span className="text-muted-foreground">
                          {isClientsLoading ? "Loading clients..." : "Select client"}
                        </span>
                      )}
                      <Search className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[600px] p-0" align="start">
                    <div className="p-2">
                      <Input
                        placeholder="Search by client name, company, or email..."
                        value={clientSearchTerm}
                        onChange={(e) => setClientSearchTerm(e.target.value)}
                        className="mb-2"
                      />
                    </div>
                    <div className="max-h-[300px] overflow-y-auto">
                      {filteredClients.length === 0 ? (
                        <div className="p-4 text-center text-sm text-muted-foreground">
                          {clientSearchTerm ? `No clients found matching "${clientSearchTerm}"` : "No clients available"}
                        </div>
                      ) : (
                        filteredClients.map((client) => (
                          <div className="flex items-center gap-3 p-3 hover:bg-muted cursor-pointer border-b last:border-b-0">
                            <div className="flex-1">
                              <div className="flex items-center gap-3">
                                <span className="font-medium text-sm">{client.name}</span>
                                {(client.company?.name || client.companyName) && (
                                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                    <Building2 className="h-3.5 w-3.5" />
                                    <span>{client.company?.name || client.companyName}</span>
                                  </div>
                                )}
                                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                  <Mail className="h-3.5 w-3.5" />
                                  <span>{client.email}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </PopoverContent>
                </Popover>
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
                  <Label>Consignee Name *</Label>
                  <Input
                    value={consigneeName}
                    onChange={(e) => setConsigneeName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Consignee Phone *</Label>
                  <Input
                    value={consigneePhone}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '');
                      setConsigneePhone(value);
                    }}
                    maxLength={10}
                    placeholder="Enter 10-digit phone number"
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
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, '');
                        handlePincodeChange(value);
                      }}
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
                    min={new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' })}
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
              <CardTitle>Products</CardTitle>
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
                  <div className="space-y-4">
                    {(() => {
                      // Separate individual items and bundle items
                      const individualItems = selectedProducts.filter(item => !item.isBundleItem);
                      const bundleItems = selectedProducts.filter(item => item.isBundleItem);
                      
                      // Group bundle items by bundleGroupId
                      const bundleGroups = bundleItems.reduce((groups: { [key: string]: SelectedProduct[] }, item) => {
                        const groupId = item.bundleGroupId || 'default';
                        if (!groups[groupId]) groups[groupId] = [];
                        groups[groupId].push(item);
                        return groups;
                      }, {});

                      return (
                        <>
                          {/* Individual Items */}
                          {individualItems.length > 0 && (
                            <div className="border rounded-md overflow-hidden">
                              {individualItems.map((product, index) => (
                                <div key={product.id} className="border-b last:border-b-0 p-4">
                                  <div className="flex items-start gap-3 mb-3">
                                    <div className="w-16 h-16 flex-shrink-0 border rounded overflow-hidden">
                                      <img
                                        src={product.images[0] || '/placeholder.png'}
                                        alt={product.name}
                                        className="w-full h-full object-cover"
                                      />
                                    </div>
                                    <div className="flex-1">
                                      <div className="flex items-start justify-between">
                                        <div>
                                          <div className="flex items-center gap-2">
                                            <span className="text-xs font-medium text-muted-foreground">#{index + 1}</span>
                                            <p className="text-sm font-medium">{product.name}</p>
                                          </div>
                                          <p className="text-xs text-muted-foreground">SKU: {product.sku}</p>
                                          <p className="text-xs text-muted-foreground">Available: {product.availableStock} units</p>
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
                                    </div>
                                  </div>

                                  <div className="flex items-center gap-3 flex-wrap">
                                    <div className="flex items-center gap-2">
                                      <Label className="text-xs text-muted-foreground">Qty:</Label>
                                      <div className="flex items-center gap-1">
                                        <Button type="button" variant="outline" size="sm" className="h-8 w-8 p-0"
                                          onClick={() => handleUpdateProduct(product.id, Math.max(1, product.quantity - 1))}>-</Button>
                                        <Input type="number" min="1" max={product.availableStock} value={product.quantity}
                                          onChange={(e) => handleUpdateProduct(product.id, Math.min(product.availableStock, parseInt(e.target.value) || 0))}
                                          className="w-20 h-8 text-xs text-center" />
                                        <Button type="button" variant="outline" size="sm" className="h-8 w-8 p-0"
                                          onClick={() => handleUpdateProduct(product.id, Math.min(product.availableStock, product.quantity + 1))}>+</Button>
                                      </div>
                                    </div>
                                    <div className="flex items-center gap-2 ml-auto">
                                      <div className="flex gap-1">
                                        {[1, 5, 10].map(qty => (
                                          <Button key={qty} type="button" variant="ghost" size="sm" className="h-6 px-2 text-xs"
                                            onClick={() => handleUpdateProduct(product.id, Math.min(product.availableStock, qty))}
                                            disabled={qty > product.availableStock}>{qty}</Button>
                                        ))}
                                      </div>
                                      <div className="text-xs text-muted-foreground">
                                        Will dispatch: <span className="font-medium">{product.quantity}</span>
                                      </div>
                                    </div>
                                  </div>

                                  {/* Bundle Selection Checkbox */}
                                  <div className="flex items-center gap-2 pt-3 mt-3 border-t border-dashed">
                                    <Checkbox 
                                      id={`bundle-${product.id}`}
                                      checked={selectedForBundle.has(product.id)}
                                      onCheckedChange={(checked) => handleBundleSelection(product.id, checked as boolean)}
                                    />
                                    <Label htmlFor={`bundle-${product.id}`} className="text-sm text-muted-foreground cursor-pointer">
                                      Add to Bundle
                                    </Label>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}

                          {/* Bundle Groups */}
                          {Object.entries(bundleGroups).map(([groupId, items], bundleIndex) => {
                            const bundleCount = items[0]?.bundleProductQuantity && items[0]?.quantity 
                              ? items[0].quantity / items[0].bundleProductQuantity 
                              : 1;
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
                                  {items.map((product, itemIndex) => (
                                    <div key={`${product.id}-${itemIndex}`} className="flex gap-3 p-3 border border-blue-200 bg-white rounded-lg">
                                      <div className="w-16 h-16 flex-shrink-0 border rounded overflow-hidden">
                                        <img
                                          src={product.images[0] || '/placeholder.png'}
                                          alt={product.name}
                                          className="w-full h-full object-cover"
                                        />
                                      </div>
                                      <div className="flex-1">
                                        <div className="flex items-start justify-between">
                                          <div>
                                            <div className="flex items-center gap-2">
                                              <p className="text-sm font-medium">{product.name}</p>
                                              <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-800">Bundle Item</Badge>
                                            </div>
                                            <p className="text-xs text-muted-foreground">SKU: {product.sku}</p>
                                            {/* <p className="text-xs text-blue-700 font-medium">
                                              {product.bundleProductQuantity} per bundle × {product.quantity / product.bundleProductQuantity} bundles = {product.quantity} total
                                            </p> */}
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
                                        <div className="flex items-center gap-2 mt-2">
                                          <Label className="text-xs text-muted-foreground">Qty:</Label>
                                          <div className="flex items-center gap-1">
                                            <Button type="button" variant="outline" size="sm" className="h-7 w-7 p-0"
                                              onClick={() => handleUpdateProduct(product.id, Math.max(1, product.quantity - 1))}>-</Button>
                                            <Input type="number" min="1" max={product.availableStock} value={product.quantity}
                                              onChange={(e) => handleUpdateProduct(product.id, Math.min(product.availableStock, parseInt(e.target.value) || 0))}
                                              className="w-16 h-7 text-xs text-center" />
                                            <Button type="button" variant="outline" size="sm" className="h-7 w-7 p-0"
                                              onClick={() => handleUpdateProduct(product.id, Math.min(product.availableStock, product.quantity + 1))}>+</Button>
                                          </div>
                                          <span className="text-xs text-muted-foreground ml-2">Stock: {product.availableStock}</span>
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
                  </div>
                )}

                {/* Inline Bundle Creation UI */}
                {selectedForBundle.size > 0 && (
                  <div className="border-2 border-dashed border-blue-300 rounded-lg p-4 bg-blue-50/20 mt-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Package className="h-5 w-5 text-blue-600" />
                      <h4 className="font-semibold text-blue-900">Create Bundle</h4>
                      <Badge variant="outline" className="bg-white text-blue-700 border-blue-300">
                        {selectedForBundle.size} items selected
                      </Badge>
                    </div>
                    <div className="space-y-3">
                      {/* Selected Products */}
                      {selectedProducts.filter(item => selectedForBundle.has(item.id) && !item.isBundleItem).map(item => (
                        <div key={item.id} className="flex items-center justify-between p-3 bg-white rounded border border-blue-200">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 flex-shrink-0 border rounded overflow-hidden">
                              <img src={item.images[0] || '/placeholder.png'} alt={item.name} className="w-full h-full object-cover" />
                            </div>
                            <div>
                              <p className="font-medium text-sm">{item.name}</p>
                              <p className="text-xs text-muted-foreground">Available in selection: {item.quantity}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Label className="text-xs text-muted-foreground">Qty per bundle:</Label>
                            <Input
                              type="number"
                              min="1"
                              max={item.quantity}
                              value={bundleQuantities[item.id] || 1}
                              onChange={(e) => handleBundleQuantityChange(item.id, parseInt(e.target.value) || 1)}
                              className="w-16 h-8 text-center text-xs"
                            />
                          </div>
                        </div>
                      ))}
                      
                      {/* Bundle Configuration */}
                      <div className="flex items-center justify-between p-3 bg-blue-100 rounded border border-blue-300">
                        <div className="flex items-center gap-2">
                          <Label className="font-medium text-blue-900">Number of Bundles:</Label>
                          <Input
                            type="number"
                            min="1"
                            value={inlineBundleCount}
                            onChange={(e) => setInlineBundleCount(parseInt(e.target.value) || 1)}
                            className="w-20 h-8 text-center bg-white"
                          />
                        </div>
                        <div className="text-sm text-blue-700">
                          Total items needed: {Array.from(selectedForBundle).reduce((sum, productId) => {
                            const qty = bundleQuantities[productId] || 1;
                            return sum + (qty * inlineBundleCount);
                          }, 0)}
                        </div>
                      </div>
                      
                      {/* Bundle Actions */}
                      <div className="flex gap-2">
                        <Button onClick={addInlineBundle} className="bg-blue-600 hover:bg-blue-700 text-white">
                          <Package className="h-4 w-4 mr-2" />
                          Add Bundle
                        </Button>
                        <Button variant="outline" onClick={() => { setSelectedForBundle(new Set()); setBundleQuantities({}); setInlineBundleCount(1); }}
                          className="border-blue-300 text-blue-700 hover:bg-blue-50">
                          Clear Selection
                        </Button>
                      </div>
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
