"use client";

import { useState } from "react";
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
import { Plus, Trash2, Save } from "lucide-react";
import { omClients, omItems } from "../../_mock/omMockData";
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
  itemId: string;
  itemName: string;
  quantity: number;
  rate: number;
  amount: number;
  gstPercent: number;
  gstAmount: number;
  totalAmount: number;
}

export default function OMCreatePurchaseOrder() {
  const router = useRouter();

  // Form state
  const [clientId, setClientId] = useState("");
  const [deliveryLocation, setDeliveryLocation] = useState("");
  const [deliveryLocations] = useState([
    "Mumbai",
    "Delhi",
    "Bangalore",
    "Noida",
    "Chennai",
    "Pune",
    "Hyderabad",
    "Kolkata",
  ]);
  const [estimateNumber, setEstimateNumber] = useState("");
  const [estimateDate, setEstimateDate] = useState("");
  const [poNumber, setPoNumber] = useState("");
  const [poDate, setPoDate] = useState("");
  const [poReceivedDate, setPoReceivedDate] = useState("");
  const [status, setStatus] = useState<"Draft" | "Confirmed">("Confirmed");

  // Line items
  const [lineItems, setLineItems] = useState<LineItem[]>([]);
  const [nextTempId, setNextTempId] = useState(1);

  // New client dialog
  const [showNewClientDialog, setShowNewClientDialog] = useState(false);
  const [newClientName, setNewClientName] = useState("");

  // New location dialog
  const [showNewLocationDialog, setShowNewLocationDialog] = useState(false);
  const [newLocationName, setNewLocationName] = useState("");

  // New item dialog
  const [showNewItemDialog, setShowNewItemDialog] = useState(false);
  const [newItemName, setNewItemName] = useState("");
  const [newItemRate, setNewItemRate] = useState("");

  const addLineItem = () => {
    const newItem: LineItem = {
      tempId: `temp-${nextTempId}`,
      itemId: "",
      itemName: "",
      quantity: 1,
      rate: 0,
      amount: 0,
      gstPercent: 18,
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
        if (field === "itemId") {
          const selectedItem = omItems.find((i) => i.id === value);
          if (selectedItem) {
            updated.itemName = selectedItem.name;
            updated.rate = selectedItem.defaultRate || 0;
            updated.gstPercent = selectedItem.defaultGst;
          }
        }

        // Recalculate amounts
        updated.amount = updated.quantity * updated.rate;
        updated.gstAmount = (updated.amount * updated.gstPercent) / 100;
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!clientId || !estimateNumber || !poNumber || lineItems.length === 0) {
      toast.error("Please fill all required fields and add at least one item");
      return;
    }

    if (
      lineItems.some(
        (item) => !item.itemId || item.quantity <= 0 || item.rate <= 0,
      )
    ) {
      toast.error("Please complete all line item details");
      return;
    }

    // In a real app, this would save to backend
    toast.success("Purchase Order created successfully");
    router.push("/admin/order-management/purchase-orders");
  };

  const handleAddNewClient = () => {
    if (!newClientName.trim()) {
      toast.error("Please enter client name");
      return;
    }
    toast.success("Client added successfully (mock)");
    setShowNewClientDialog(false);
    setNewClientName("");
  };

  const handleAddNewLocation = () => {
    if (!newLocationName.trim()) {
      toast.error("Please enter location name");
      return;
    }
    toast.success("Location added successfully (mock)");
    setShowNewLocationDialog(false);
    setNewLocationName("");
  };

  const handleAddNewItem = () => {
    if (!newItemName.trim()) {
      toast.error("Please enter item name");
      return;
    }
    toast.success("Item added successfully (mock)");
    setShowNewItemDialog(false);
    setNewItemName("");
    setNewItemRate("");
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
                  <Select value={clientId} onValueChange={setClientId}>
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="Select client" />
                    </SelectTrigger>
                    <SelectContent>
                      {omClients.map((client) => (
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
                        <Button type="button" onClick={handleAddNewClient}>
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
                    value={deliveryLocation}
                    onValueChange={setDeliveryLocation}
                  >
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="Select location" />
                    </SelectTrigger>
                    <SelectContent>
                      {deliveryLocations.map((location) => (
                        <SelectItem key={location} value={location}>
                          {location}
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
                        <Button type="button" onClick={handleAddNewLocation}>
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
                <Label>Status</Label>
                <Select
                  value={status}
                  onValueChange={(val: "Draft" | "Confirmed") => setStatus(val)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Draft">Draft</SelectItem>
                    <SelectItem value="Confirmed">Confirmed</SelectItem>
                  </SelectContent>
                </Select>
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
                              value={item.itemId}
                              onValueChange={(val) =>
                                updateLineItem(item.tempId, "itemId", val)
                              }
                            >
                              <SelectTrigger className="min-w-[180px]">
                                <SelectValue placeholder="Select item" />
                              </SelectTrigger>
                              <SelectContent>
                                {omItems.map((omItem) => (
                                  <SelectItem key={omItem.id} value={omItem.id}>
                                    {omItem.name}
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
                                  >
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
                          })}
                        </TableCell>
                        <TableCell>
                          <Select
                            value={item.gstPercent.toString()}
                            onValueChange={(val) =>
                              updateLineItem(
                                item.tempId,
                                "gstPercent",
                                parseInt(val),
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
                          })}
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          ₹
                          {item.totalAmount.toLocaleString("en-IN", {
                            minimumFractionDigits: 2,
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
                  })}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total GST:</span>
                <span className="font-medium">
                  ₹
                  {totalGst.toLocaleString("en-IN", {
                    minimumFractionDigits: 2,
                  })}
                </span>
              </div>
              <div className="flex justify-between pt-2 border-t">
                <span className="font-semibold">Grand Total:</span>
                <span className="font-semibold text-lg">
                  ₹
                  {grandTotal.toLocaleString("en-IN", {
                    minimumFractionDigits: 2,
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
          <Button type="submit">
            <Save className="h-4 w-4 mr-2" />
            Create Purchase Order
          </Button>
        </div>
      </form>
    </Layout>
  );
}
