"use client";

import React, { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar, Loader2, Package, Plus, Search, X } from "lucide-react";
import { useProducts } from "@/data/product/admin.hooks";
import { useClients } from "@/data/client/admin.hooks";
import { useCreateOrder } from "@/data/order/admin.hooks";
import type { Product, $Enums } from "@/lib/generated/prisma";
import { toast } from "sonner";

type Modes = $Enums.Modes;

interface CreateDispatchOrderDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

interface SelectedProduct extends Product {
  quantity: number;
}

export function CreateDispatchOrderDialog({ isOpen, onClose }: CreateDispatchOrderDialogProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedClientEmail, setSelectedClientEmail] = useState("");
  const [requiredByDate, setRequiredByDate] = useState("");
  const [modeOfDelivery, setModeOfDelivery] = useState<Modes>("AIR");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [pincode, setPincode] = useState("");
  const [consigneeName, setConsigneeName] = useState("");
  const [consigneePhone, setConsigneePhone] = useState("");
  const [consigneeEmail, setConsigneeEmail] = useState("");
  const [deliveryReference, setDeliveryReference] = useState("");
  const [packagingInstructions, setPackagingInstructions] = useState("");
  const [note, setNote] = useState("");
  const [selectedProducts, setSelectedProducts] = useState<SelectedProduct[]>([]);

  const { products, isLoading: isProductsLoading } = useProducts();
  const { clients, isLoading: isClientsLoading } = useClients();
  const { createOrder, isCreating } = useCreateOrder();

  const searchResults = useMemo(() => {
    if (!products) return [] as Product[];
    const term = searchTerm.trim().toLowerCase();
    if (!term) return [] as Product[];
    return products.filter((p) =>
      p.name.toLowerCase().includes(term) || (p.sku ? p.sku.toLowerCase().includes(term) : false)
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
    setSelectedProducts((prev) => prev.map((p) => (p.id === productId ? { ...p, quantity } : p)));
  };

  const handleRemoveProduct = (productId: string) => {
    setSelectedProducts((prev) => prev.filter((p) => p.id !== productId));
  };

  const resetAndClose = () => {
    setSearchTerm("");
    setSelectedClientEmail("");
    setRequiredByDate("");
    setModeOfDelivery("AIR");
    setDeliveryAddress("");
    setCity("");
    setState("");
    setPincode("");
    setConsigneeName("");
    setConsigneePhone("");
    setConsigneeEmail("");
    setDeliveryReference("");
    setPackagingInstructions("");
    setNote("");
    setSelectedProducts([]);
    onClose();
  };

  const handleCreate = async () => {
    if (!selectedClientEmail) return toast.error("Select a client");
    if (!consigneeName || !consigneePhone) return toast.error("Provide consignee details");
    if (!deliveryAddress || !city || !state || !pincode) return toast.error("Provide full address");
    if (!requiredByDate) return toast.error("Select required by date");
    if (selectedProducts.length === 0) return toast.error("Select at least one product");
    if (selectedProducts.some((p) => !p.quantity || p.quantity <= 0)) return toast.error("Invalid quantities");

    try {
      await createOrder({
        clientEmail: selectedClientEmail,
        deliveryAddress,
        items: selectedProducts.map((p) => ({ productId: p.id, quantity: p.quantity, price: p.price ?? 0 })),
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
      toast.success("Dispatch order created");
      resetAndClose();
    } catch (error) {
      toast.error("Failed to create dispatch order");
      console.error("Create dispatch order error:", error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={resetAndClose}>
      <DialogContent className="sm:max-w-6xl max-h-[95vh] flex flex-col overflow-hidden">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Create Dispatch Order
          </DialogTitle>
          <DialogDescription>Select client, products and dispatch details</DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4 min-h-0 flex-1 overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 min-h-0 flex-1 overflow-hidden">
            <div className="space-y-3">
              <Label>Client</Label>
              <Select value={selectedClientEmail} onValueChange={setSelectedClientEmail}>
                <SelectTrigger>
                  <SelectValue placeholder={isClientsLoading ? "Loading clients..." : "Select client"} />
                </SelectTrigger>
                <SelectContent>
                  {(clients || []).map((c) => (
                    <SelectItem key={c.id} value={c.email} className="capitalize">
                      {c.companyName || c.name} ({c.email})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <div className="grid grid-cols-1 gap-2">
                <div>
                  <Label>Consignee Name</Label>
                  <Input value={consigneeName} onChange={(e) => setConsigneeName(e.target.value)} />
                </div>
                <div>
                  <Label>Consignee Phone</Label>
                  <Input value={consigneePhone} onChange={(e) => setConsigneePhone(e.target.value)} />
                </div>
                <div>
                  <Label>Consignee Email (optional)</Label>
                  <Input type="email" value={consigneeEmail} onChange={(e) => setConsigneeEmail(e.target.value)} />
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-1 gap-2">
                <div>
                  <Label>Delivery Address</Label>
                  <Input value={deliveryAddress} onChange={(e) => setDeliveryAddress(e.target.value)} />
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <Label>City</Label>
                    <Input value={city} onChange={(e) => setCity(e.target.value)} />
                  </div>
                  <div>
                    <Label>State</Label>
                    <Input value={state} onChange={(e) => setState(e.target.value)} />
                  </div>
                  <div>
                    <Label>Pincode</Label>
                    <Input value={pincode} onChange={(e) => setPincode(e.target.value)} />
                  </div>
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-1 gap-2">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label>Required By</Label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input type="date" className="pl-9" value={requiredByDate} onChange={(e) => setRequiredByDate(e.target.value)} />
                    </div>
                  </div>
                  <div>
                    <Label>Mode of Delivery</Label>
                    <Select value={modeOfDelivery} onValueChange={(v: Modes) => setModeOfDelivery(v)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="AIR">Air</SelectItem>
                        <SelectItem value="SURFACE">Surface</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label>Delivery Reference (optional)</Label>
                  <Input value={deliveryReference} onChange={(e) => setDeliveryReference(e.target.value)} />
                </div>
                <div>
                  <Label>Packaging Instructions (optional)</Label>
                  <Input value={packagingInstructions} onChange={(e) => setPackagingInstructions(e.target.value)} />
                </div>
                <div>
                  <Label>Note (optional)</Label>
                  <Input value={note} onChange={(e) => setNote(e.target.value)} />
                </div>
              </div>
            </div>

            <div className="lg:col-span-2 flex flex-col gap-3 min-h-0 overflow-hidden">
              <div className="flex-shrink-0">
                <Label>Search Products</Label>
                <div className="relative mt-1">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Start typing to search by product name or SKU..."
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

              {searchTerm && (
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-between mb-2">
                    <Label className="text-sm font-medium">Search Results ({searchResults.length})</Label>
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
                  <div className="border rounded-md max-h-64 overflow-y-auto">
                    {searchResults.length === 0 ? (
                      <p className="text-sm text-muted-foreground text-center py-4">No products found matching &quot;{searchTerm}&quot;</p>
                    ) : (
                      <div className="divide-y">
                        {searchResults.map((product) => {
                          const isSelected = selectedProducts.some((p) => p.id === product.id);
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
              )}

              <div className="flex-1 min-h-0">
                <div className="flex items-center justify-between mb-2">
                  <Label className="text-sm font-medium">Selected Products ({selectedProducts.length})</Label>
                  {selectedProducts.length > 0 && (
                    <Button variant="ghost" size="sm" onClick={() => setSelectedProducts([])} className="text-xs h-7">
                      Clear All
                    </Button>
                  )}
                </div>

                {selectedProducts.length === 0 ? (
                  <div className="border rounded-md p-8 text-center">
                    <Package className="h-8 w-8 mx-auto mb-2 text-muted-foreground/50" />
                    <p className="text-sm text-muted-foreground">Search for products above and select them to add to the order</p>
                  </div>
                ) : (
                  <div className="border rounded-md overflow-hidden max-h-96 overflow-y-auto">
                    <div>
                      {selectedProducts.map((product, index) => (
                        <div key={product.id} className="border-b last:border-b-0 p-4">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <span className="text-xs font-medium text-muted-foreground">#{index + 1}</span>
                              <div>
                                <p className="text-sm font-medium">{product.name}</p>
                                <p className="text-xs text-muted-foreground">Available: {product.availableStock} units</p>
                              </div>
                            </div>
                            <Button variant="ghost" size="sm" onClick={() => handleRemoveProduct(product.id)} className="h-6 w-6 p-0 hover:bg-red-100 hover:text-red-600">
                              <X className="h-3 w-3" />
                            </Button>
                          </div>

                          <div className="flex items-center gap-3 flex-wrap">
                            <div className="flex items-center gap-2">
                              <Label className="text-xs text-muted-foreground">Qty:</Label>
                              <Input
                                type="number"
                                min="1"
                                value={product.quantity}
                                onChange={(e) => handleUpdateProduct(product.id, parseInt(e.target.value) || 0)}
                                className="w-24 h-8 text-xs"
                              />
                            </div>
                            <div className="text-xs text-muted-foreground ml-auto">
                              Will dispatch: <span className="font-medium">{product.quantity}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <Separator className="flex-shrink-0" />

          <div className="flex justify-end gap-2 flex-shrink-0">
            <Button variant="outline" onClick={resetAndClose} disabled={isCreating}>Cancel</Button>
            <Button onClick={handleCreate} disabled={isCreating || selectedProducts.length === 0}>
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
      </DialogContent>
    </Dialog>
  );
}


