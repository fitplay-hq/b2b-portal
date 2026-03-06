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
import { Plus, Save, AlertCircle, Loader2 } from "lucide-react";
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
  productId: string;
  itemName: string;
  remainingQty: number;
  dispatchQty: number;
  rate: number;
  amount: number;
  gstPercentage: number;
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
  const [status, setStatus] = useState<"CREATED" | "DISPATCHED">("DISPATCHED");

  // Master data
  const [availablePOs, setAvailablePOs] = useState<any[]>([]);
  const [logisticsPartners, setLogisticsPartners] = useState<any[]>([]);
  const [isLoadingMaster, setIsLoadingMaster] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Line items
  const [lineItems, setLineItems] = useState<DispatchLineItem[]>([]);
  const [nextId, setNextId] = useState(1);

  // Selected PO full details
  const [selectedPO, setSelectedPO] = useState<any | null>(null);
  const [isLoadingPoDetail, setIsLoadingPoDetail] = useState(false);

  // New logistics partner dialog
  const [showNewLogisticsDialog, setShowNewLogisticsDialog] = useState(false);
  const [newLogisticsName, setNewLogisticsName] = useState("");
  const [isAddingLogistics, setIsAddingLogistics] = useState(false);

  useEffect(() => {
    const fetchMaster = async () => {
      setIsLoadingMaster(true);
      try {
        const [posRes, logisticsRes] = await Promise.all([
          fetch("/api/admin/om/purchase-orders?status=active"),
          fetch("/api/admin/om/logistics-partners"),
        ]);

        if (posRes.ok) setAvailablePOs(await posRes.json());
        if (logisticsRes.ok) setLogisticsPartners(await logisticsRes.json());
      } catch (err) {
        console.error(err);
        toast.error("Failed to load form data");
      } finally {
        setIsLoadingMaster(false);
      }
    };
    fetchMaster();
  }, []);

  // When PO is selected, fetch full details with items and calculate remaining
  useEffect(() => {
    if (!poId) {
      setSelectedPO(null);
      setLineItems([]);
      return;
    }

    const fetchPoDetail = async () => {
      setIsLoadingPoDetail(true);
      try {
        const res = await fetch(`/api/admin/om/purchase-orders/${poId}`);
        if (res.ok) {
          const po = await res.json();
          setSelectedPO(po);

          // Calculate remaining quantity for each item
          const items = po.items
            .map((item: any) => {
              const totalDispatched =
                item.dispatchItems?.reduce(
                  (sum: number, di: any) => sum + di.quantity,
                  0,
                ) || 0;
              const remaining = item.quantity - totalDispatched;
              return {
                ...item,
                remainingQty: remaining,
              };
            })
            .filter((i: any) => i.remainingQty > 0);

          // Initialize dispatch line items
          const newLineItems: DispatchLineItem[] = items.map(
            (item: any, index: number) => ({
              tempId: `dispatch-${index}`,
              poLineItemId: item.id,
              productId: item.productId,
              itemName: item.product?.name || "Unknown Item",
              remainingQty: item.remainingQty,
              dispatchQty: 0,
              rate: item.rate,
              amount: 0,
              gstPercentage: item.gstPercentage,
              gstAmount: 0,
              totalAmount: 0,
            }),
          );

          setLineItems(newLineItems);
        }
      } catch (err) {
        console.error(err);
        toast.error("Failed to load PO details");
      } finally {
        setIsLoadingPoDetail(false);
      }
    };

    fetchPoDetail();
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
        updated.gstAmount = (updated.amount * updated.gstPercentage) / 100;
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

  const handleSubmit = async (e: React.FormEvent) => {
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

    setIsSubmitting(true);
    try {
      const payload = {
        purchaseOrderId: poId,
        invoiceNumber,
        invoiceDate,
        logisticsPartnerId,
        docketNumber: trackingNumber,
        expectedDeliveryDate,
        status,
        items: lineItems
          .filter((item) => item.dispatchQty > 0)
          .map(({ tempId, itemName, remainingQty, ...rest }) => rest),
      };

      const res = await fetch("/api/admin/om/dispatch-orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        toast.success("Dispatch created successfully");
        router.push("/admin/order-management/dispatches");
      } else {
        const err = await res.json();
        toast.error(err.error || "Failed to create dispatch");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error creating dispatch");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddNewLogistics = async () => {
    if (!newLogisticsName.trim()) {
      toast.error("Please enter logistics partner name");
      return;
    }
    setIsAddingLogistics(true);
    try {
      const res = await fetch("/api/admin/om/logistics-partners", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newLogisticsName }),
      });
      if (res.ok) {
        const data = await res.json();
        setLogisticsPartners([...logisticsPartners, data.data]);
        setLogisticsPartnerId(data.id);
        toast.success("Logistics partner added successfully");
        setShowNewLogisticsDialog(false);
        setNewLogisticsName("");
      }
    } catch (err) {
      toast.error("Failed to add partner");
    } finally {
      setIsAddingLogistics(false);
    }
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
            <Select
              value={poId}
              onValueChange={setPoId}
              disabled={isLoadingMaster}
            >
              <SelectTrigger>
                <SelectValue
                  placeholder={
                    isLoadingMaster
                      ? "Loading active POs..."
                      : "Select PO with remaining quantity"
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {availablePOs.map((po) => {
                  return (
                    <SelectItem key={po.id} value={po.id}>
                      {po.estimateNumber} - {po.poNumber} (Ordered:{" "}
                      {po.totalQuantity})
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>

          {isLoadingPoDetail && (
            <div className="flex items-center justify-center p-4">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
              <span className="ml-2">Loading PO details...</span>
            </div>
          )}
          {selectedPO && !isLoadingPoDetail && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <div className="space-y-1">
                  <p>
                    <strong>Client:</strong> {selectedPO.client?.name}
                  </p>
                  <p>
                    <strong>Location:</strong>{" "}
                    {selectedPO.deliveryLocation?.name}
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
                {isLoadingPoDetail ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8">
                      <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2" />
                      Loading items...
                    </TableCell>
                  </TableRow>
                ) : lineItems.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={8}
                      className="text-center py-8 text-muted-foreground"
                    >
                      {selectedPO
                        ? "No items available for dispatch (all items fully dispatched)"
                        : "Select a Purchase Order to view items"}
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
                        {item.gstPercentage}%
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
                      {logisticsPartners.map((partner) => (
                        <SelectItem key={partner.id} value={partner.id}>
                          {partner.name}
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
                        <Button
                          type="button"
                          onClick={handleAddNewLogistics}
                          disabled={isAddingLogistics}
                        >
                          {isAddingLogistics && (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          )}
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
                  onValueChange={(val: "CREATED" | "DISPATCHED") =>
                    setStatus(val)
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CREATED">Created</SelectItem>
                    <SelectItem value="DISPATCHED">Dispatched</SelectItem>
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
        <Button
          type="submit"
          disabled={!selectedPO || totalDispatchQty === 0 || isSubmitting}
        >
          {isSubmitting ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Save className="h-4 w-4 mr-2" />
          )}
          {isSubmitting ? "Creating..." : "Create Dispatch"}
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
