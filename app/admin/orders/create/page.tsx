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
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import {
  Calendar,
  Loader2,
  Package,
  Plus,
  Search,
  X,
  ArrowLeft,
  Mail,
  CheckCircle,
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
  const [consigneeName, setConsigneeName] = React.useState("");
  const [consigneePhone, setConsigneePhone] = React.useState("");
  const [consigneeEmail, setConsigneeEmail] = React.useState("");
  const [deliveryReference, setDeliveryReference] = React.useState("");
  const [packagingInstructions, setPackagingInstructions] = React.useState("");
  const [note, setNote] = React.useState("");
  const [selectedProducts, setSelectedProducts] = React.useState<
    SelectedProduct[]
  >([]);

  const { products, isLoading: isProductsLoading } = useProducts();
  const { clients, isLoading: isClientsLoading } = useClients();
  const { createOrder, isCreating } = useCreateOrder();
  const { sendOrderEmail, isSending } = useSendOrderEmail();
  const { data: pincodeData, isLoading: isPincodeLoading, error: pincodeError, lookupPincode, clearError } = usePincodeLookup();

  const [showEmailDialog, setShowEmailDialog] = React.useState(false);
  const [createdOrder, setCreatedOrder] = React.useState<any>(null);

  React.useEffect(() => {
    if (pincodeData && pincodeData.success) {
      setCity(pincodeData.city);
      setState(pincodeData.state);
    }
  }, [pincodeData]);

  const handlePincodeChange = React.useCallback((value: string) => {
    setPincode(value);
    clearError();
    
    if (value.length === 6 && /^\d{6}$/.test(value)) {
      lookupPincode(value);
    } else if (value.length !== 6) {
      setCity('');
      setState('');
    }
  }, [lookupPincode, clearError]);

  const searchResults = React.useMemo(() => {
    if (!products) return [] as Product[];
    const term = searchTerm.trim().toLowerCase();
    if (!term) return [] as Product[];
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
      const order = await createOrder({
        clientEmail: selectedClientEmail,
        deliveryAddress,
        items: selectedProducts.map((p) => ({
          productId: p.id,
          quantity: p.quantity,
          price: p.price ?? 0,
        })),
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
    } catch (e) {
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
    } catch (error) {
      toast.error("Failed to send email");
    }
  };

  const handleCloseDialog = () => {
    setShowEmailDialog(false);
    window.location.href = "/admin/orders";
  };

  return (
    <Layout title="Create Dispatch Order" isClient={false}>
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

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-1 space-y-6">
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
                        {c.companyName || c.name} ({c.email})
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
                  <Label>City *</Label>
                  <Input
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>State *</Label>
                  <Input
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Pincode *</Label>
                  <div className="relative">
                    <Input
                      value={pincode}
                      onChange={(e) => handlePincodeChange(e.target.value)}
                      placeholder="Enter 6-digit pincode"
                      maxLength={6}
                      className={pincodeError ? 'border-red-500' : ''}
                    />
                    {isPincodeLoading && (
                      <Loader2 className="absolute right-3 top-3 h-4 w-4 animate-spin text-muted-foreground" />
                    )}
                  </div>
                  
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

        <div className="xl:col-span-2 space-y-6">
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
                    placeholder="Search by product name or SKU..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9"
                  />
                  {isProductsLoading && (
                    <Loader2 className="absolute right-3 top-3 h-4 w-4 animate-spin text-muted-foreground" />
                  )}
                </div>
              </div>

              {searchTerm && (
                <div>
                  <Label className="text-sm font-medium mb-2 block">
                    Search Results ({searchResults.length})
                  </Label>
                  <div className="border rounded-md">
                    {searchResults.length === 0 ? (
                      <p className="text-sm text-muted-foreground text-center py-4">
                        No products found
                      </p>
                    ) : (
                      <div className="divide-y">
                        {searchResults.slice(0, 40).map((product) => {
                          const isSelected = selectedProducts.some(
                            (p) => p.id === product.id
                          );
                          return (
                            <div
                              key={product.id}
                              className={`flex items-center justify-between p-3 hover:bg-muted cursor-pointer ${
                                isSelected ? "bg-blue-50 border-blue-200" : ""
                              }`}
                              onClick={() =>
                                handleProductToggle(product, !isSelected)
                              }
                            >
                              <div className="flex items-center gap-3 min-w-0 flex-1">
                                <Checkbox
                                  checked={isSelected}
                                  onChange={() => {}}
                                />
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium truncate">
                                    {product.name}
                                  </p>
                                  <p className="text-xs text-muted-foreground">
                                    SKU: {product.sku || "N/A"} • Stock:{" "}
                                    {product.availableStock}
                                  </p>
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
                </div>
              )}

              <div>
                <Label className="text-sm font-medium mb-2 block">
                  Selected Products ({selectedProducts.length})
                </Label>
                {selectedProducts.length === 0 ? (
                  <div className="border rounded-md p-8 text-center">
                    <p className="text-sm text-muted-foreground">
                      Search and select products to add them to this order
                    </p>
                  </div>
                ) : (
                  <div className="border rounded-md overflow-hidden">
                    <div>
                      {selectedProducts.map((product, index) => (
                        <div
                          key={product.id}
                          className="border-b last:border-b-0 p-4"
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <span className="text-xs font-medium text-muted-foreground">
                                #{index + 1}
                              </span>
                              <div>
                                <p className="text-sm font-medium">
                                  {product.name}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  Available: {product.availableStock} units
                                </p>
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
                              <Input
                                type="number"
                                min="1"
                                value={product.quantity}
                                onChange={(e) =>
                                  handleUpdateProduct(
                                    product.id,
                                    parseInt(e.target.value) || 0
                                  )
                                }
                                className="w-24 h-8 text-xs"
                              />
                            </div>
                            <div className="text-xs text-muted-foreground ml-auto">
                              Will dispatch:{" "}
                              <span className="font-medium">
                                {product.quantity}
                              </span>
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

      <Dialog open={showEmailDialog} onOpenChange={setShowEmailDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Order Created Successfully</DialogTitle>
            <DialogDescription>
              Order {createdOrder?.id} has been created. Would you like to send
              an email notification to the client?
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
