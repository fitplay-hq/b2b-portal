"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
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
import { Plus, Save, AlertCircle } from "lucide-react";
import {
  omPurchaseOrders,
  omLogisticsPartners,
  getDispatchedQuantity,
  getRemainingQuantity,
} from "../../_mock/omMockData";
import { toast } from "sonner";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface DispatchLineItem {
  tempId: string;
  poLineItemId: string;
  itemId: string;
  itemName: string;
  remainingQty: number;
  dispatchQty: number;
  rate: number;
  amount: number;
  gstPercent: number;
  gstAmount: number;
  totalAmount: number;
}

function CreateDispatchForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const preSelectedPoId = searchParams.get("poId");

  // Form state
  const [poId, setPoId] = useState(preSelectedPoId || "");
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [invoiceDate, setInvoiceDate] = useState("");
  const [logisticsPartnerId, setLogisticsPartnerId] = useState("");
  const [trackingNumber, setTrackingNumber] = useState("");
  const [expectedDeliveryDate, setExpectedDeliveryDate] = useState("");
  const [status, setStatus] = useState<"Created" | "Dispatched">("Dispatched");

  // Line items
  const [lineItems, setLineItems] = useState<DispatchLineItem[]>([]);
  const [nextTempId, setNextTempId] = useState(1);

  // Selected PO details
  const selectedPO = poId
    ? omPurchaseOrders.find((po) => po.id === poId)
    : null;

  // New logistics partner dialog
  const [showNewLogisticsDialog, setShowNewLogisticsDialog] = useState(false);
  const [newLogisticsName, setNewLogisticsName] = useState("");

  // When PO is selected, populate available items
  useEffect(() => {
    if (selectedPO) {
      const availableItems = selectedPO.lineItems
        .map((item) => {
          const remaining = getRemainingQuantity(
            selectedPO.id,
            item.id,
            item.quantity,
          );
          return {
            ...item,
            remaining,
          };
        })
        .filter((item) => item.remaining > 0);

      // Initialize line items with available items
      const newLineItems: DispatchLineItem[] = availableItems.map((item) => ({
        tempId: `temp-${nextTempId + availableItems.indexOf(item)}`,
        poLineItemId: item.id,
        itemId: item.itemId,
        itemName: item.itemName,
        remainingQty: item.remaining,
        dispatchQty: 0,
        rate: item.rate,
        amount: 0,
        gstPercent: item.gstPercent,
        gstAmount: 0,
        totalAmount: 0,
      }));

      setLineItems(newLineItems);
      setNextTempId(nextTempId + availableItems.length);
    } else {
      setLineItems([]);
    }
  }, [poId]);

  const updateLineItem = (
    tempId: string,
    field: keyof DispatchLineItem,
    value: any,
  ) => {
    setLineItems(
      lineItems.map((item) => {
        if (item.tempId !== tempId) return item;

        const updated = { ...item, [field]: value };

        // Validate dispatch quantity
        if (field === "dispatchQty") {
          const qty = parseInt(value) || 0;
          if (qty > item.remainingQty) {
            toast.error(
              `Cannot dispatch more than remaining quantity (${item.remainingQty})`,
            );
            updated.dispatchQty = item.remainingQty;
          } else if (qty < 0) {
            updated.dispatchQty = 0;
          } else {
            updated.dispatchQty = qty;
          }
        }

        // Recalculate amounts
        updated.amount = updated.dispatchQty * updated.rate;
        updated.gstAmount = (updated.amount * updated.gstPercent) / 100;
        updated.totalAmount = updated.amount + updated.gstAmount;

        return updated;
      }),
    );
  };

  // Calculate totals
  const totalDispatchQty = lineItems.reduce(
    (sum, item) => sum + item.dispatchQty,
    0,
  );
  const subtotal = lineItems.reduce((sum, item) => sum + item.amount, 0);
  const totalGst = lineItems.reduce((sum, item) => sum + item.gstAmount, 0);
  const grandTotal = subtotal + totalGst;

  // Get POs with remaining quantity
  const availablePOs = omPurchaseOrders.filter((po) => {
    if (po.status === "Closed") return false;
    const totalOrdered = po.totalQuantity;
    const dispatched = po.lineItems.reduce((sum, item) => {
      return sum + getDispatchedQuantity(po.id, item.id);
    }, 0);
    return totalOrdered > dispatched;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (
      !poId ||
      !invoiceNumber ||
      !invoiceDate ||
      !logisticsPartnerId ||
      !trackingNumber
    ) {
      toast.error("Please fill all required fields");
      return;
    }

    if (totalDispatchQty === 0) {
      toast.error("Please add at least one item to dispatch");
      return;
    }

    if (lineItems.some((item) => item.dispatchQty > item.remainingQty)) {
      toast.error("Dispatch quantity cannot exceed remaining quantity");
      return;
    }

    // In a real app, this would save to backend
    toast.success("Dispatch created successfully");
    router.push("/admin/order-management/dispatches");
  };

  const handleAddNewLogistics = () => {
    if (!newLogisticsName.trim()) {
      toast.error("Please enter logistics partner name");
      return;
    }
    toast.success("Logistics partner added successfully (mock)");
    setShowNewLogisticsDialog(false);
    setNewLogisticsName("");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Select PO */}
      <Card>
        <CardHeader>
          <CardTitle>Select Purchase Order</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Purchase Order *</Label>
            <Select value={poId} onValueChange={setPoId}>
              <SelectTrigger>
                <SelectValue placeholder="Select PO with remaining quantity" />
              </SelectTrigger>
              <SelectContent>
                {availablePOs.map((po) => {
                  const dispatched = po.lineItems.reduce((sum, item) => {
                    return sum + getDispatchedQuantity(po.id, item.id);
                  }, 0);
                  const remaining = po.totalQuantity - dispatched;

                  return (
                    <SelectItem key={po.id} value={po.id}>
                      {po.estimateNumber} - {po.poNumber} (Remaining:{" "}
                      {remaining})
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>

          {selectedPO && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <div className="space-y-1">
                  <p>
                    <strong>Client:</strong> {selectedPO.clientName}
                  </p>
                  <p>
                    <strong>Location:</strong> {selectedPO.deliveryLocation}
                  </p>
                  <p>
                    <strong>PO Number:</strong> {selectedPO.poNumber}
                  </p>
                </div>
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Dispatch Line Items */}
      {selectedPO && (
        <Card>
          <CardHeader>
            <CardTitle>Dispatch Items</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item Name</TableHead>
                  <TableHead className="text-right">Remaining Qty</TableHead>
                  <TableHead className="w-[150px]">Dispatch Qty</TableHead>
                  <TableHead className="text-right">Rate</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead className="text-right">GST %</TableHead>
                  <TableHead className="text-right">GST Amt</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {lineItems.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={8}
                      className="text-center py-8 text-muted-foreground"
                    >
                      No items available for dispatch (all items fully
                      dispatched)
                    </TableCell>
                  </TableRow>
                ) : (
                  lineItems.map((item) => (
                    <TableRow key={item.tempId}>
                      <TableCell className="font-medium">
                        {item.itemName}
                      </TableCell>
                      <TableCell className="text-right font-medium text-orange-600">
                        {item.remainingQty}
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          min="0"
                          max={item.remainingQty}
                          value={item.dispatchQty || ""}
                          onChange={(e) =>
                            updateLineItem(
                              item.tempId,
                              "dispatchQty",
                              e.target.value,
                            )
                          }
                          placeholder="0"
                        />
                      </TableCell>
                      <TableCell className="text-right">
                        ₹{item.rate.toLocaleString("en-IN")}
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        ₹
                        {item.amount.toLocaleString("en-IN", {
                          minimumFractionDigits: 2,
                        })}
                      </TableCell>
                      <TableCell className="text-right">
                        {item.gstPercent}%
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
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Invoice Information */}
      {selectedPO && (
        <Card>
          <CardHeader>
            <CardTitle>Invoice Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Invoice Number *</Label>
                <Input
                  value={invoiceNumber}
                  onChange={(e) => setInvoiceNumber(e.target.value)}
                  placeholder="FP/LLP/YY-YY/Sequential"
                />
              </div>

              <div className="space-y-2">
                <Label>Invoice Date *</Label>
                <Input
                  type="date"
                  value={invoiceDate}
                  onChange={(e) => setInvoiceDate(e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Logistics Details */}
      {selectedPO && (
        <Card>
          <CardHeader>
            <CardTitle>Logistics Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Logistics Partner *</Label>
                <div className="flex gap-2">
                  <Select
                    value={logisticsPartnerId}
                    onValueChange={setLogisticsPartnerId}
                  >
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="Select logistics partner" />
                    </SelectTrigger>
                    <SelectContent>
                      {omLogisticsPartners.map((partner) => (
                        <SelectItem key={partner.id} value={partner.id}>
                          {partner.name} ({partner.defaultMode})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Dialog
                    open={showNewLogisticsDialog}
                    onOpenChange={setShowNewLogisticsDialog}
                  >
                    <DialogTrigger asChild>
                      <Button type="button" variant="outline">
                        <Plus className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add New Logistics Partner</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4 pt-4">
                        <div className="space-y-2">
                          <Label>Partner Name</Label>
                          <Input
                            value={newLogisticsName}
                            onChange={(e) =>
                              setNewLogisticsName(e.target.value)
                            }
                            placeholder="Enter partner name"
                          />
                        </div>
                        <Button type="button" onClick={handleAddNewLogistics}>
                          Add Partner
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Docket / Tracking Number *</Label>
                <Input
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  placeholder="Enter tracking number"
                />
              </div>

              <div className="space-y-2">
                <Label>Expected Delivery Date *</Label>
                <Input
                  type="date"
                  value={expectedDeliveryDate}
                  onChange={(e) => setExpectedDeliveryDate(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Dispatch Status</Label>
                <Select
                  value={status}
                  onValueChange={(val: "Created" | "Dispatched") =>
                    setStatus(val)
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Created">Created</SelectItem>
                    <SelectItem value="Dispatched">Dispatched</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Dispatch Summary */}
      {selectedPO && totalDispatchQty > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Dispatch Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">
                  Total Dispatch Quantity:
                </span>
                <span className="font-medium">{totalDispatchQty}</span>
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
      )}

      {/* Actions */}
      <div className="flex justify-end gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/admin/order-management/dispatches")}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={!selectedPO || totalDispatchQty === 0}>
          <Save className="h-4 w-4 mr-2" />
          Create Dispatch
        </Button>
      </div>
    </form>
  );
}

export default function OMCreateDispatch() {
  return (
    <Layout isClient={false}>
      <Suspense fallback={<div>Loading form...</div>}>
        <CreateDispatchForm />
      </Suspense>
    </Layout>
  );
}
