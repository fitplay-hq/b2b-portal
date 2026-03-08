"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
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
import { OMClientForm } from "@/components/orderManagement/OMClientForm";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type {
  OMPoStatus,
  OMClient,
  OMDeliveryLocation,
  OMProduct,
  OMPurchaseOrderItem,
} from "@/types/order-management";

interface LineItem {
  tempId: string;
  id?: string; // Existing item ID
  productId: string;
  itemName: string;
  quantity: number;
  rate: number;
  amount: number;
  gstPercentage: number;
  gstAmount: number;
  totalAmount: number;
}

export default function OMEditPurchaseOrder() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  // Form state
  const [clientId, setClientId] = useState("");
  const [locationId, setLocationId] = useState("");
  const [estimateNumber, setEstimateNumber] = useState("");
  const [estimateDate, setEstimateDate] = useState("");
  const [poNumber, setPoNumber] = useState("");
  const [poDate, setPoDate] = useState("");
  const [poReceivedDate, setPoReceivedDate] = useState("");
  const [status, setStatus] = useState<OMPoStatus>("DRAFT");

  // Master data
  const [clients, setClients] = useState<OMClient[]>([]);
  const [locations, setLocations] = useState<OMDeliveryLocation[]>([]);
  const [products, setProducts] = useState<OMProduct[]>([]);
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Line items
  const [lineItems, setLineItems] = useState<LineItem[]>([]);
  const [nextTempId, setNextTempId] = useState(1);

  // New master dialog states
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
  const [isAddingItem, setIsAddingItem] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsDataLoading(true);
      try {
        const [clientsRes, locationsRes, productsRes, poRes] =
          await Promise.all([
            fetch("/api/admin/om/clients"),
            fetch("/api/admin/om/delivery-locations"),
            fetch("/api/admin/om/products"),
            fetch(`/api/admin/om/purchase-orders/${id}`),
          ]);

        if (clientsRes.ok) setClients(await clientsRes.json());
        if (locationsRes.ok) setLocations(await locationsRes.json());
        if (productsRes.ok) setProducts(await productsRes.json());

        if (poRes.ok) {
          const poData = await poRes.json();
          setClientId(poData.clientId);
          setLocationId(poData.locationId);
          setEstimateNumber(poData.estimateNumber || "");
          setEstimateDate(poData.estimateDate?.split("T")[0] || "");
          setPoNumber(poData.poNumber || "");
          setPoDate(poData.poDate?.split("T")[0] || "");
          setPoReceivedDate(poData.poReceivedDate?.split("T")[0] || "");
          setStatus(poData.status);

          if (poData.items) {
            setLineItems(
              poData.items.map((item: OMPurchaseOrderItem, idx: number) => ({
                tempId: `existing-${idx}`,
                id: item.id,
                productId: item.productId,
                itemName: item.product?.name || "Unknown",
                quantity: item.quantity,
                rate: item.rate,
                amount: item.amount,
                gstPercentage: item.gstPercentage,
                gstAmount: item.gstAmount,
                totalAmount: item.totalAmount,
              })),
            );
            setNextTempId(poData.items.length + 1);
          }
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        toast.error("Failed to load details");
      } finally {
        setIsDataLoading(false);
      }
    };

    if (id) fetchData();
  }, [id]);

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
  ) => {
    setLineItems(
      lineItems.map((item) => {
        if (item.tempId !== tempId) return item;

        const updated = { ...item, [field]: value };

        if (field === "productId") {
          const selectedProduct = products.find((p) => p.id === value);
          if (selectedProduct) {
            updated.itemName = selectedProduct.name;
            updated.rate = selectedProduct.price || 0;
            updated.gstPercentage = selectedProduct.defaultGstPct || 18;
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

    // Validation - Only Client and Items are strictly required now
    if (!clientId || lineItems.length === 0) {
      toast.error("Please fill required fields (Client and at least one item)");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        clientId,
        locationId: locationId || null,
        estimateNumber: estimateNumber || null,
        estimateDate: estimateDate ? formatDateForApi(estimateDate) : null,
        poNumber: poNumber || null,
        poDate: poDate ? formatDateForApi(poDate) : null,
        poReceivedDate: poReceivedDate
          ? formatDateForApi(poReceivedDate)
          : null,
        status,
        items: lineItems.map(({ tempId, itemName, ...rest }) => rest),
      };

      const res = await fetch(`/api/admin/om/purchase-orders/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        toast.success("Purchase Order updated successfully");
        router.push(`/admin/order-management/purchase-orders/${id}`);
      } else {
        const err = await res.json();
        toast.error(err.error || "Failed to update PO");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error updating Purchase Order");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddNewClient = async () => {
    if (!newClientData.name.trim()) return;
    setIsAddingClient(true);
    try {
      const res = await fetch("/api/admin/om/clients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newClientData),
      });
      if (res.ok) {
        const data = await res.json();
        setClients([...clients, data.data]);
        setClientId(data.id);
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
    } finally {
      setIsAddingClient(false);
    }
  };

  const handleAddNewLocation = async () => {
    if (!newLocationName.trim()) return;
    setIsAddingLocation(true);
    try {
      const res = await fetch("/api/admin/om/delivery-locations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newLocationName }),
      });
      if (res.ok) {
        const data = await res.json();
        setLocations([...locations, data.data]);
        setLocationId(data.id);
        setShowNewLocationDialog(false);
        setNewLocationName("");
      }
    } finally {
      setIsAddingLocation(false);
    }
  };

  const handleAddNewItem = async () => {
    if (!newItemName.trim()) return;
    setIsAddingItem(true);
    try {
      const res = await fetch("/api/admin/om/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newItemName,
          price: newItemRate ? parseFloat(newItemRate) : undefined,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setProducts([...products, data.data]);
        setShowNewItemDialog(false);
        setNewItemName("");
        setNewItemRate("");
      }
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
            <h1 className="text-2xl font-semibold">Edit Purchase Order</h1>
            <p className="text-muted-foreground">
              Update purchase order details and items
            </p>
          </div>
        </div>

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
                    <Select
                      value={clientId}
                      onValueChange={setClientId}
                      disabled={isDataLoading}
                    >
                      <SelectTrigger className="flex-1">
                        <SelectValue
                          placeholder={
                            isDataLoading
                              ? "Loading clients..."
                              : "Select client"
                          }
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {clients.map((client) => (
                          <SelectItem key={client.id} value={client.id}>
                            {client.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
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
                    <Select
                      value={locationId}
                      onValueChange={setLocationId}
                      disabled={isDataLoading}
                    >
                      <SelectTrigger className="flex-1">
                        <SelectValue
                          placeholder={
                            isDataLoading
                              ? "Loading locations..."
                              : "Select location"
                          }
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {locations.map((location) => (
                          <SelectItem key={location.id} value={location.id}>
                            {location.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
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
                  <Input
                    value={estimateNumber}
                    onChange={(e) => setEstimateNumber(e.target.value)}
                    placeholder="FP/YY-YY/SequentialNumber"
                  />
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

                <div className="space-y-2">
                  <Label>Status (Auto)</Label>
                  <div className="h-10 px-3 py-2 rounded-md border bg-muted flex items-center">
                    {poNumber ? "CONFIRMED" : "DRAFT"}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Status is automatically set to CONFIRMED once PO Number is
                    added.
                  </p>
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
                      <TableHead className="min-w-60">Item</TableHead>
                      <TableHead className="w-32">Qty</TableHead>
                      <TableHead className="w-29">Rate</TableHead>
                      <TableHead className="w-25">Amount</TableHead>
                      <TableHead className="w-25">GST %</TableHead>
                      <TableHead className="w-25">GST Amt</TableHead>
                      <TableHead className="w-25">Total</TableHead>
                      <TableHead className="w-12.5"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {lineItems.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={8}
                          className="text-center py-8 text-muted-foreground"
                        >
                          No items added. Click "Add Item" to start.
                        </TableCell>
                      </TableRow>
                    ) : (
                      lineItems.map((item) => (
                        <TableRow key={item.tempId}>
                          <TableCell>
                            <div className="flex gap-2">
                              <Select
                                value={item.productId}
                                onValueChange={(val) =>
                                  updateLineItem(item.tempId, "productId", val)
                                }
                              >
                                <SelectTrigger className="min-w-45">
                                  <SelectValue placeholder="Select item" />
                                </SelectTrigger>
                                <SelectContent>
                                  {products.map((p) => (
                                    <SelectItem key={p.id} value={p.id}>
                                      {p.name}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <Dialog
                                open={showNewItemDialog}
                                onOpenChange={setShowNewItemDialog}
                              >
                                <DialogTrigger asChild>
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
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
                                      <Label>Item Name</Label>
                                      <Input
                                        value={newItemName}
                                        onChange={(e) =>
                                          setNewItemName(e.target.value)
                                        }
                                        placeholder="Enter item name"
                                      />
                                    </div>
                                    <div className="space-y-2">
                                      <Label>Default Rate (optional)</Label>
                                      <Input
                                        type="number"
                                        value={newItemRate}
                                        onChange={(e) =>
                                          setNewItemRate(e.target.value)
                                        }
                                        placeholder="0"
                                      />
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
                            <Input
                              type="number"
                              min="1"
                              value={item.quantity}
                              onChange={(e) =>
                                updateLineItem(
                                  item.tempId,
                                  "quantity",
                                  parseInt(e.target.value) || 0,
                                )
                              }
                            />
                          </TableCell>
                          <TableCell>
                            <Input
                              type="number"
                              min="0"
                              step="0.01"
                              value={item.rate}
                              onChange={(e) =>
                                updateLineItem(
                                  item.tempId,
                                  "rate",
                                  parseFloat(e.target.value) || 0,
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
                  <span className="text-muted-foreground">Total Quantity:</span>
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
              {isSubmitting ? "Updating..." : "Update Purchase Order"}
            </Button>
          </div>
        </form>
      </div>
    </Layout>
  );
}
