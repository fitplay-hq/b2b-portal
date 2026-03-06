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
import { Plus, Trash2, Save, Loader2 } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

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
}

export default function OMCreatePurchaseOrder() {
  const router = useRouter();

  // Form state
  const [clientId, setClientId] = useState("");
  const [locationId, setLocationId] = useState("");
  const [estimateNumber, setEstimateNumber] = useState("");
  const [estimateDate, setEstimateDate] = useState("");
  const [poNumber, setPoNumber] = useState("");
  const [poDate, setPoDate] = useState("");
  const [poReceivedDate, setPoReceivedDate] = useState("");
  const [status, setStatus] = useState<"DRAFT" | "CONFIRMED">("CONFIRMED");

  // Master data
  const [clients, setClients] = useState<any[]>([]);
  const [locations, setLocations] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Line items
  const [lineItems, setLineItems] = useState<LineItem[]>([]);
  const [nextTempId, setNextTempId] = useState(1);

  // New client dialog
  const [showNewClientDialog, setShowNewClientDialog] = useState(false);
  const [newClientName, setNewClientName] = useState("");
  const [isAddingClient, setIsAddingClient] = useState(false);

  // New location dialog
  const [showNewLocationDialog, setShowNewLocationDialog] = useState(false);
  const [newLocationName, setNewLocationName] = useState("");
  const [isAddingLocation, setIsAddingLocation] = useState(false);

  // New item dialog
  const [showNewItemDialog, setShowNewItemDialog] = useState(false);
  const [newItemName, setNewItemName] = useState("");
  const [newItemRate, setNewItemRate] = useState("");
  const [isAddingItem, setIsAddingItem] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsDataLoading(true);
      try {
        const [clientsRes, locationsRes, productsRes] = await Promise.all([
          fetch("/api/admin/om/clients"),
          fetch("/api/admin/om/delivery-locations"),
          fetch("/api/admin/om/products"),
        ]);

        if (clientsRes.ok) setClients(await clientsRes.json());
        if (locationsRes.ok) setLocations(await locationsRes.json());
        if (productsRes.ok) setProducts(await productsRes.json());
      } catch (err) {
        console.error("Error fetching master data:", err);
        toast.error("Failed to load form data");
      } finally {
        setIsDataLoading(false);
      }
    };

    fetchData();
  }, []);

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
    value: any,
  ) => {
    setLineItems(
      lineItems.map((item) => {
        if (item.tempId !== tempId) return item;

        const updated = { ...item, [field]: value };

        // Handle item selection
        if (field === "productId") {
          const selectedProduct = products.find((p) => p.id === value);
          if (selectedProduct) {
            updated.itemName = selectedProduct.name;
            updated.rate = selectedProduct.price || 0;
            updated.gstPercentage = selectedProduct.defaultGstPct || 18;
          }
        }

        // Recalculate amounts
        updated.amount = updated.quantity * updated.rate;
        updated.gstAmount = (updated.amount * updated.gstPercentage) / 100;
        updated.totalAmount = updated.amount + updated.gstAmount;

        return updated;
      }),
    );
  };

  // Calculate totals
  const totalQuantity = lineItems.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = lineItems.reduce((sum, item) => sum + item.amount, 0);
  const totalGst = lineItems.reduce((sum, item) => sum + item.gstAmount, 0);
  const grandTotal = subtotal + totalGst;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (
      !clientId ||
      !locationId ||
      !estimateNumber ||
      !poNumber ||
      lineItems.length === 0
    ) {
      toast.error("Please fill all required fields and add at least one item");
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

    setIsSubmitting(true);
    try {
      const payload = {
        clientId,
        locationId,
        estimateNumber,
        estimateDate,
        poNumber,
        poDate,
        poReceivedDate,
        status,
        items: lineItems.map(({ tempId, itemName, ...rest }) => rest),
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
        toast.error(err.error || "Failed to create PO");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error creating Purchase Order");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddNewClient = async () => {
    if (!newClientName.trim()) {
      toast.error("Please enter client name");
      return;
    }
    setIsAddingClient(true);
    try {
      const res = await fetch("/api/admin/om/clients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newClientName }),
      });
      if (res.ok) {
        const data = await res.json();
        setClients([...clients, data.data]);
        setClientId(data.id);
        toast.success("Client added successfully");
        setShowNewClientDialog(false);
        setNewClientName("");
      }
    } catch (err) {
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
        setLocations([...locations, data.data]);
        setLocationId(data.id);
        toast.success("Location added successfully");
        setShowNewLocationDialog(false);
        setNewLocationName("");
      }
    } catch (err) {
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
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setProducts([...products, data.data]);
        toast.success("Item added successfully");
        setShowNewItemDialog(false);
        setNewItemName("");
        setNewItemRate("");
      }
    } catch (err) {
      toast.error("Failed to add item");
    } finally {
      setIsAddingItem(false);
    }
  };

  return (
    <Layout isClient={false}>
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
                          isDataLoading ? "Loading clients..." : "Select client"
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
                      <div className="space-y-4 pt-4">
                        <div className="space-y-2">
                          <Label>Client Name</Label>
                          <Input
                            value={newClientName}
                            onChange={(e) => setNewClientName(e.target.value)}
                            placeholder="Enter client name"
                          />
                        </div>
                        <Button
                          type="button"
                          onClick={handleAddNewClient}
                          disabled={isAddingClient}
                        >
                          {isAddingClient && (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          )}
                          Add Client
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Delivery Location *</Label>
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
                            onChange={(e) => setNewLocationName(e.target.value)}
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
                <Label>FitPlay Estimate Number *</Label>
                <Input
                  value={estimateNumber}
                  onChange={(e) => setEstimateNumber(e.target.value)}
                  placeholder="FP/YY-YY/SequentialNumber"
                />
              </div>

              <div className="space-y-2">
                <Label>FitPlay Estimate Date *</Label>
                <Input
                  type="date"
                  value={estimateDate}
                  onChange={(e) => setEstimateDate(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>PO Number *</Label>
                <Input
                  value={poNumber}
                  onChange={(e) => setPoNumber(e.target.value)}
                  placeholder="Enter PO number"
                />
              </div>

              <div className="space-y-2">
                <Label>PO Date *</Label>
                <Input
                  type="date"
                  value={poDate}
                  onChange={(e) => setPoDate(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>PO Received Date *</Label>
                <Input
                  type="date"
                  value={poReceivedDate}
                  onChange={(e) => setPoReceivedDate(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium mb-1.5">Status</p>
                <div className="flex bg-muted p-1 rounded-md">
                  <button
                    type="button"
                    onClick={() => setStatus("DRAFT")}
                    className={`flex-1 text-xs py-1.5 rounded-sm transition-all ${status === "DRAFT" ? "bg-background shadow-sm font-medium" : "text-muted-foreground"}`}
                  >
                    Draft
                  </button>
                  <button
                    type="button"
                    onClick={() => setStatus("CONFIRMED")}
                    className={`flex-1 text-xs py-1.5 rounded-sm transition-all ${status === "CONFIRMED" ? "bg-background shadow-sm font-medium" : "text-muted-foreground"}`}
                  >
                    Confirmed
                  </button>
                </div>
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
                    <TableHead className="min-w-[200px]">Item</TableHead>
                    <TableHead className="w-[100px]">Qty</TableHead>
                    <TableHead className="w-[120px]">Rate</TableHead>
                    <TableHead className="w-[120px]">Amount</TableHead>
                    <TableHead className="w-[100px]">GST %</TableHead>
                    <TableHead className="w-[120px]">GST Amt</TableHead>
                    <TableHead className="w-[120px]">Total</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
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
                              <SelectTrigger className="min-w-[180px]">
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
                                <Button type="button" variant="ghost" size="sm">
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
            {isSubmitting ? "Creating..." : "Create Purchase Order"}
          </Button>
        </div>
      </form>
    </Layout>
  );
}
