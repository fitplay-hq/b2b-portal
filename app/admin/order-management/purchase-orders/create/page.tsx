"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Layout from "@/components/layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Trash2, Save, Loader2, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { formatDateForApi } from "@/lib/utils";
import { getFinancialYearString } from "@/lib/utils/financial-year";
import { OMClientForm } from "@/components/orderManagement/OMClientForm";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { SearchableSelect } from "@/components/ui/combobox";
import type {
  OMClient,
  OMDeliveryLocation,
  OMProduct,
  OMBrand,
} from "@/types/order-management";

interface LineItem {
  tempId: string;
  productId: string;
  itemName: string;
  quantity: number;
  rate: number;
  amount: number;
  gstPercentage: number;
  gstAmount: number;
  totalAmount: number;
  brandId: string;
  description: string;
}

function LoadingSkeleton() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-64" />
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Array.from({ length: 7 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-10 w-full" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-40" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-32 w-full" />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-36" />
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-5 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function OMCreatePurchaseOrder() {
  const router = useRouter();

  const fyPrefix = `FP/${getFinancialYearString()}/`;
  const [clientId, setClientId] = useState("");
  const [locationId, setLocationId] = useState("");
  const [estimateNumber, setEstimateNumber] = useState("");
  const [estimateDate, setEstimateDate] = useState("");
  const [poNumber, setPoNumber] = useState("");
  const [poDate, setPoDate] = useState("");
  const [poReceivedDate, setPoReceivedDate] = useState("");

  const [clients, setClients] = useState<OMClient[]>([]);
  const [locations, setLocations] = useState<OMDeliveryLocation[]>([]);
  const [products, setProducts] = useState<OMProduct[]>([]);
  const [brands, setBrands] = useState<OMBrand[]>([]);
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [lineItems, setLineItems] = useState<LineItem[]>([]);
  const [nextTempId, setNextTempId] = useState(1);

  const [showNewClientDialog, setShowNewClientDialog] = useState(false);
  const [newClientData, setNewClientData] = useState({
    name: "",
    contactPerson: "",
    email: "",
    phone: "",
    billingAddress: "",
    gstNumber: "",
    notes: "",
  });
  const [isAddingClient, setIsAddingClient] = useState(false);

  const [showNewLocationDialog, setShowNewLocationDialog] = useState(false);
  const [newLocationName, setNewLocationName] = useState("");
  const [isAddingLocation, setIsAddingLocation] = useState(false);

  const [showNewItemDialog, setShowNewItemDialog] = useState(false);
  const [newItemName, setNewItemName] = useState("");
  const [newItemRate, setNewItemRate] = useState("");
  const [newItemBrandId, setNewItemBrandId] = useState("");
  const [newItemGstPct, setNewItemGstPct] = useState("0");
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [activeRowTempId, setActiveRowTempId] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsDataLoading(true);
      try {
        const [clientsRes, locationsRes, productsRes, brandsRes] =
          await Promise.all([
            fetch("/api/admin/om/clients"),
            fetch("/api/admin/om/delivery-locations"),
            fetch("/api/admin/om/products"),
            fetch("/api/admin/om/brands"),
          ]);

        if (clientsRes.ok) setClients(await clientsRes.json());
        if (locationsRes.ok) setLocations(await locationsRes.json());
        if (productsRes.ok) setProducts(await productsRes.json());
        if (brandsRes.ok) setBrands(await brandsRes.json());
      } catch (err) {
        console.error("Error fetching master data:", err);
        toast.error("Failed to load form data");
      } finally {
        setIsDataLoading(false);
      }
    };

    fetchData();
  }, []);

  const clientOptions = clients.map((c) => ({ value: c.id, label: c.name }));
  const locationOptions = locations.map((l) => ({
    value: l.id,
    label: l.name,
  }));
  const productOptions = products.map((p) => ({ value: p.id, label: p.name }));
  const brandOptions = brands.map((b) => ({ value: b.id, label: b.name }));

  const addLineItem = () => {
    const newItem: LineItem = {
      tempId: `temp-${nextTempId}`,
      productId: "",
      itemName: "",
      quantity: 1,
      rate: 0,
      amount: 0,
      gstPercentage: 18,
      gstAmount: 0,
      totalAmount: 0,
      brandId: "",
      description: "",
    };
    setLineItems([...lineItems, newItem]);
    setNextTempId(nextTempId + 1);
  };

  const removeLineItem = (tempId: string) => {
    setLineItems(lineItems.filter((item) => item.tempId !== tempId));
  };

  const updateLineItem = (
    tempId: string,
    field: keyof LineItem,
    value: string | number,
    productOverride?: Partial<OMProduct>,
  ) => {
    setLineItems((prevItems) =>
      prevItems.map((item) => {
        if (item.tempId !== tempId) return item;

        const updated = { ...item, [field]: value };

        if (field === "productId") {
          const selectedProduct =
            productOverride || products.find((p) => p.id === value);
          if (selectedProduct) {
            updated.itemName = selectedProduct.name || "";
            updated.rate = selectedProduct.price || 0;
            updated.gstPercentage = selectedProduct.defaultGstPct || 18;
            updated.brandId =
              selectedProduct.brandId || selectedProduct.OMBrand?.id || "";
          }
        }

        updated.amount = updated.quantity * updated.rate;
        updated.gstAmount = (updated.amount * updated.gstPercentage) / 100;
        updated.totalAmount = updated.amount + updated.gstAmount;

        return updated;
      }),
    );
  };

  const totalQuantity = lineItems.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = lineItems.reduce((sum, item) => sum + item.amount, 0);
  const totalGst = lineItems.reduce((sum, item) => sum + item.gstAmount, 0);
  const grandTotal = subtotal + totalGst;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!clientId || lineItems.length === 0) {
      toast.error("Please select a client and add at least one item");
      return;
    }

    if (
      lineItems.some(
        (item) => !item.productId || item.quantity <= 0 || item.rate <= 0,
      )
    ) {
      toast.error("Please complete all line item details");
      return;
    }

    let finalEstimateNumber = estimateNumber;
    if (!finalEstimateNumber || finalEstimateNumber.trim() === "") {
      const rand = String(Math.floor(Math.random() * 900) + 100);
      finalEstimateNumber = fyPrefix + rand;
    } else {
      finalEstimateNumber = fyPrefix + estimateNumber;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        clientId,
        locationId: locationId || null,
        estimateNumber: finalEstimateNumber || null,
        estimateDate: estimateDate ? formatDateForApi(estimateDate) : null,
        poNumber: poNumber || null,
        poDate: poDate ? formatDateForApi(poDate) : null,
        poReceivedDate: poReceivedDate
          ? formatDateForApi(poReceivedDate)
          : null,
        items: lineItems.map(({ tempId: _t, itemName: _n, ...rest }) => rest),
      };

      const res = await fetch("/api/admin/om/purchase-orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        toast.success("Purchase Order created successfully");
        router.push("/admin/order-management/purchase-orders");
      } else {
        const err = await res.json();
        toast.error(err.error || "Failed to create Purchase Order");
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddNewClient = async () => {
    if (!newClientData.name.trim()) {
      toast.error("Please enter client name");
      return;
    }
    setIsAddingClient(true);
    try {
      const res = await fetch("/api/admin/om/clients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newClientData),
      });
      if (res.ok) {
        const data = await res.json();
        const newClient = data.data;
        const newClientId = data.id || newClient.id;

        setClients((prev) => [...prev, newClient]);

        setTimeout(() => {
          setClientId(newClientId);
        }, 100);

        toast.success("Client added successfully");
        setShowNewClientDialog(false);
        setNewClientData({
          name: "",
          contactPerson: "",
          email: "",
          phone: "",
          billingAddress: "",
          gstNumber: "",
          notes: "",
        });
      }
    } catch {
      toast.error("Failed to add client");
    } finally {
      setIsAddingClient(false);
    }
  };

  const handleAddNewLocation = async () => {
    if (!newLocationName.trim()) {
      toast.error("Please enter location name");
      return;
    }
    setIsAddingLocation(true);
    try {
      const res = await fetch("/api/admin/om/delivery-locations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newLocationName }),
      });
      if (res.ok) {
        const data = await res.json();
        const newLocation = data.data;
        const newLocationId = data.id || newLocation.id;

        setLocations((prev) => [...prev, newLocation]);

        setTimeout(() => {
          setLocationId(newLocationId);
        }, 100);

        toast.success("Location added successfully");
        setShowNewLocationDialog(false);
        setNewLocationName("");
      }
    } catch {
      toast.error("Failed to add location");
    } finally {
      setIsAddingLocation(false);
    }
  };

  const handleAddNewItem = async () => {
    if (!newItemName.trim()) {
      toast.error("Please enter item name");
      return;
    }
    setIsAddingItem(true);
    try {
      const res = await fetch("/api/admin/om/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newItemName,
          price: newItemRate ? parseFloat(newItemRate) : undefined,
          brandId: newItemBrandId || null,
          defaultGstPct: parseFloat(newItemGstPct),
        }),
      });
      if (res.ok) {
        const data = await res.json();
        const newProduct = data.data;
        const newProductId = data.id || newProduct.id;

        setProducts((prev) => [...prev, newProduct]);

        if (activeRowTempId) {
          setTimeout(() => {
            updateLineItem(
              activeRowTempId,
              "productId",
              newProductId,
              newProduct,
            );
          }, 100);
        }

        toast.success("Item added successfully");
        setShowNewItemDialog(false);
        setNewItemName("");
        setNewItemRate("");
        setNewItemBrandId("");
        setNewItemGstPct("0");
        setActiveRowTempId(null);
      }
    } catch {
      toast.error("Failed to add item");
    } finally {
      setIsAddingItem(false);
    }
  };

  return (
    <Layout isClient={false}>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() =>
              router.push("/admin/order-management/purchase-orders")
            }
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-semibold">Create Purchase Order</h1>
            <p className="text-muted-foreground">
              Create a new purchase order for a client
            </p>
          </div>
        </div>

        {isDataLoading ? (
          <LoadingSkeleton />
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Client & Reference Information */}
            <Card>
              <CardHeader>
                <CardTitle>Client & Reference Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Client Name *</Label>
                    <div className="flex gap-2">
                      <div className="flex-1">
                        <SearchableSelect
                          options={clientOptions}
                          value={clientId}
                          onValueChange={setClientId}
                          placeholder="Select client"
                          searchPlaceholder="Search clients..."
                        />
                      </div>
                      <Dialog
                        open={showNewClientDialog}
                        onOpenChange={setShowNewClientDialog}
                      >
                        <DialogTrigger asChild>
                          <Button type="button" variant="outline">
                            <Plus className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Add New Client</DialogTitle>
                          </DialogHeader>
                          <div className="pt-4">
                            <OMClientForm
                              formData={newClientData}
                              onChange={setNewClientData}
                              onSubmit={handleAddNewClient}
                              isSubmitting={isAddingClient}
                            />
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Delivery Location</Label>
                    <div className="flex gap-2">
                      <div className="flex-1">
                        <SearchableSelect
                          options={locationOptions}
                          value={locationId}
                          onValueChange={setLocationId}
                          placeholder="Select location"
                          searchPlaceholder="Search locations..."
                        />
                      </div>
                      <Dialog
                        open={showNewLocationDialog}
                        onOpenChange={setShowNewLocationDialog}
                      >
                        <DialogTrigger asChild>
                          <Button type="button" variant="outline">
                            <Plus className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Add New Location</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4 pt-4">
                            <div className="space-y-2">
                              <Label>Location Name</Label>
                              <Input
                                value={newLocationName}
                                onChange={(e) =>
                                  setNewLocationName(e.target.value)
                                }
                                placeholder="Enter location name"
                              />
                            </div>
                            <Button
                              type="button"
                              onClick={handleAddNewLocation}
                              disabled={isAddingLocation}
                            >
                              {isAddingLocation && (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              )}
                              Add Location
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>FitPlay Estimate Number</Label>
                    <div className="flex items-center border rounded-md px-3 bg-muted/30 focus-within:ring-1 focus-within:ring-ring">
                      <p className="text-sm font-medium text-muted-foreground whitespace-nowrap pr-2 border-r">
                        {fyPrefix}
                      </p>
                      <Input
                        value={estimateNumber}
                        onChange={(e) => setEstimateNumber(e.target.value)}
                        placeholder="Number"
                        className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 h-10 px-2"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>FitPlay Estimate Date</Label>
                    <Input
                      type="date"
                      value={estimateDate}
                      onChange={(e) => setEstimateDate(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>PO Number</Label>
                    <Input
                      value={poNumber}
                      onChange={(e) => setPoNumber(e.target.value)}
                      placeholder="Enter PO number"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>PO Date</Label>
                    <Input
                      type="date"
                      value={poDate}
                      onChange={(e) => setPoDate(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>PO Received Date</Label>
                    <Input
                      type="date"
                      value={poReceivedDate}
                      onChange={(e) => setPoReceivedDate(e.target.value)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Item Line Entries */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Item Line Entries</CardTitle>
                <Button type="button" onClick={addLineItem} size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Item
                </Button>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="min-w-50">Item</TableHead>
                        <TableHead className="min-w-36">Brand</TableHead>
                        <TableHead className="min-w-40">Description</TableHead>
                        <TableHead className="w-29">Qty</TableHead>
                        <TableHead className="w-29">Rate</TableHead>
                        <TableHead className="w-25">Amount</TableHead>
                        <TableHead className="w-25">GST %</TableHead>
                        <TableHead className="w-25">GST Amt</TableHead>
                        <TableHead className="w-25">Total</TableHead>
                        <TableHead className="w-12"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {lineItems.length === 0 ? (
                        <TableRow>
                          <TableCell
                            colSpan={10}
                            className="text-center py-8 text-muted-foreground"
                          >
                            No items added. Click &quot;Add Item&quot; to start.
                          </TableCell>
                        </TableRow>
                      ) : (
                        lineItems.map((item) => (
                          <TableRow key={item.tempId}>
                            <TableCell>
                              <div className="flex gap-1">
                                <div className="min-w-40">
                                  <SearchableSelect
                                    options={productOptions}
                                    value={item.productId}
                                    onValueChange={(val) =>
                                      updateLineItem(
                                        item.tempId,
                                        "productId",
                                        val,
                                      )
                                    }
                                    placeholder="Select item"
                                    searchPlaceholder="Search items..."
                                  />
                                </div>
                                <Dialog
                                  open={showNewItemDialog}
                                  onOpenChange={(open) => {
                                    setShowNewItemDialog(open);
                                    if (!open) setActiveRowTempId(null);
                                  }}
                                >
                                  <DialogTrigger asChild>
                                    <Button
                                      type="button"
                                      variant="ghost"
                                      size="sm"
                                      onClick={() =>
                                        setActiveRowTempId(item.tempId)
                                      }
                                    >
                                      <Plus className="h-4 w-4" />
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent>
                                    <DialogHeader>
                                      <DialogTitle>Add New Item</DialogTitle>
                                    </DialogHeader>
                                    <div className="space-y-4 pt-4">
                                      <div className="space-y-2">
                                        <Label>Item Name *</Label>
                                        <Input
                                          value={newItemName}
                                          onChange={(e) =>
                                            setNewItemName(e.target.value)
                                          }
                                          placeholder="Enter item name"
                                        />
                                      </div>
                                      <div className="space-y-2">
                                        <Label>Brand</Label>
                                        <Select
                                          value={newItemBrandId}
                                          onValueChange={(val) =>
                                            setNewItemBrandId(
                                              val === "none" ? "" : val,
                                            )
                                          }
                                        >
                                          <SelectTrigger>
                                            <SelectValue placeholder="Select brand" />
                                          </SelectTrigger>
                                          <SelectContent>
                                            <SelectItem value="none">
                                              No Brand
                                            </SelectItem>
                                            {brands.map((b) => (
                                              <SelectItem
                                                key={b.id}
                                                value={b.id}
                                              >
                                                {b.name}
                                              </SelectItem>
                                            ))}
                                          </SelectContent>
                                        </Select>
                                      </div>
                                      <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                          <Label>Default Rate</Label>
                                          <Input
                                            type="number"
                                            value={newItemRate}
                                            onChange={(e) =>
                                              setNewItemRate(e.target.value)
                                            }
                                            placeholder="0"
                                          />
                                        </div>
                                        <div className="space-y-2">
                                          <Label>Default GST %</Label>
                                          <Select
                                            value={newItemGstPct}
                                            onValueChange={setNewItemGstPct}
                                          >
                                            <SelectTrigger>
                                              <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                              <SelectItem value="0">
                                                0%
                                              </SelectItem>
                                              <SelectItem value="5">
                                                5%
                                              </SelectItem>
                                              <SelectItem value="18">
                                                18%
                                              </SelectItem>
                                              <SelectItem value="28">
                                                28%
                                              </SelectItem>
                                            </SelectContent>
                                          </Select>
                                        </div>
                                      </div>
                                      <Button
                                        type="button"
                                        onClick={handleAddNewItem}
                                        disabled={isAddingItem}
                                      >
                                        {isAddingItem && (
                                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        )}
                                        Add Item
                                      </Button>
                                    </div>
                                  </DialogContent>
                                </Dialog>
                              </div>
                            </TableCell>
                            <TableCell>
                              <SearchableSelect
                                options={brandOptions}
                                value={item.brandId}
                                onValueChange={(val) =>
                                  updateLineItem(item.tempId, "brandId", val)
                                }
                                placeholder="Brand"
                                searchPlaceholder="Search brands..."
                              />
                            </TableCell>
                            <TableCell>
                              <Input
                                value={item.description}
                                onChange={(e) =>
                                  updateLineItem(
                                    item.tempId,
                                    "description",
                                    e.target.value,
                                  )
                                }
                                placeholder="Description"
                                className="min-w-32"
                              />
                            </TableCell>
                            <TableCell>
                              <Input
                                type="number"
                                min="1"
                                value={item.quantity || ""}
                                onChange={(e) =>
                                  updateLineItem(
                                    item.tempId,
                                    "quantity",
                                    e.target.value === ""
                                      ? 0
                                      : parseInt(e.target.value),
                                  )
                                }
                              />
                            </TableCell>
                            <TableCell>
                              <Input
                                type="number"
                                min="0"
                                step="0.01"
                                value={item.rate || ""}
                                onChange={(e) =>
                                  updateLineItem(
                                    item.tempId,
                                    "rate",
                                    e.target.value === ""
                                      ? 0
                                      : parseFloat(e.target.value),
                                  )
                                }
                              />
                            </TableCell>
                            <TableCell className="text-right font-medium">
                              ₹
                              {item.amount.toLocaleString("en-IN", {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              })}
                            </TableCell>
                            <TableCell>
                              <Select
                                value={item.gstPercentage.toString()}
                                onValueChange={(val) =>
                                  updateLineItem(
                                    item.tempId,
                                    "gstPercentage",
                                    parseFloat(val),
                                  )
                                }
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="0">0%</SelectItem>
                                  <SelectItem value="5">5%</SelectItem>
                                  <SelectItem value="18">18%</SelectItem>
                                  <SelectItem value="28">28%</SelectItem>
                                </SelectContent>
                              </Select>
                            </TableCell>
                            <TableCell className="text-right font-medium">
                              ₹
                              {item.gstAmount.toLocaleString("en-IN", {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              })}
                            </TableCell>
                            <TableCell className="text-right font-medium">
                              ₹
                              {item.totalAmount.toLocaleString("en-IN", {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              })}
                            </TableCell>
                            <TableCell>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => removeLineItem(item.tempId)}
                              >
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>

            {/* Order Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      Total Quantity:
                    </span>
                    <span className="font-medium">{totalQuantity}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal:</span>
                    <span className="font-medium">
                      ₹
                      {subtotal.toLocaleString("en-IN", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total GST:</span>
                    <span className="font-medium">
                      ₹
                      {totalGst.toLocaleString("en-IN", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </span>
                  </div>
                  <div className="flex justify-between pt-2 border-t">
                    <span className="font-semibold">Grand Total:</span>
                    <span className="font-semibold text-lg">
                      ₹
                      {grandTotal.toLocaleString("en-IN", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() =>
                  router.push("/admin/order-management/purchase-orders")
                }
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Save className="h-4 w-4 mr-2" />
                )}
                {isSubmitting ? "Creating..." : "Create Purchase Order"}
              </Button>
            </div>
          </form>
        )}
      </div>
    </Layout>
  );
}
