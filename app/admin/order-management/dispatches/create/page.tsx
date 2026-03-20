"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
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
import {
  Plus,
  Save,
  AlertCircle,
  Info,
  Loader2,
  ArrowLeft,
  Package,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import { useOMMutate, useOMPurchaseOrders, useOMLogisticsPartners } from "@/data/om/admin.hooks";
import { formatDateForApi, formatDateToYYYYMMDD } from "@/lib/utils";
import { getFinancialYearString } from "@/lib/utils/financial-year";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { SearchableSelect } from "@/components/ui/combobox";
import {
  type OMPurchaseOrder,
  type OMPurchaseOrderItem,
  type OMDispatchOrderItem,
  type OMLogisticsPartner,
  OM_DISPATCH_STATUS_CONFIG,
  type OMShipmentBox,
  OMShipmentHelpers,
} from "@/types/order-management";

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
  blockedByFifo?: boolean;
  blockingPoNumber?: string;
  blockingPoQuantity?: number;
  blockingPoId?: string;
}

function CreateDispatchForm() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { revalidateOM } = useOMMutate();
  const preSelectedPoId = searchParams.get("poId");

  // Form state
  const [poId, setPoId] = useState(preSelectedPoId || "");
  const fyPrefix = `FP/LLP/${getFinancialYearString()}/`;
  const [invoiceNumber, setInvoiceNumber] = useState(fyPrefix);
  const [invoiceDate, setInvoiceDate] = useState("");
  const [logisticsPartnerId, setLogisticsPartnerId] = useState("");
  const [deliveryLocationId, setDeliveryLocationId] = useState("");
  const [trackingNumber, setTrackingNumber] = useState("");
  const [expectedDeliveryDate, setExpectedDeliveryDate] = useState("");
  const [dispatchDate, setDispatchDate] = useState("");
  const [deliveryDate, setDeliveryDate] = useState("");
  const [status, setStatus] = useState<
    | "PENDING"
    | "APPROVED"
    | "READY_FOR_DISPATCH"
    | "DISPATCHED"
    | "AT_DESTINATION"
    | "DELIVERED"
    | "CANCELLED"
  >("PENDING");
  const [shipmentBoxes, setShipmentBoxes] = useState<OMShipmentBox[]>([]);
  const [nextBoxNumber, setNextBoxNumber] = useState(1);

  // Master data via SWR
  const { purchaseOrders: rawPos, isLoading: loadingSOs } = useOMPurchaseOrders("status=active&limit=1000");
  const { partners: logisticsPartners, isLoading: loadingPartners } = useOMLogisticsPartners();
  
  // Filter out fully dispatched or closed POs for the initial selection
  const availablePOs = rawPos.filter((po: any) => 
    po.status !== "FULLY_DISPATCHED" && po.status !== "CLOSED"
  );
  
  const isLoadingMaster = loadingSOs || loadingPartners;
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Line items
  const [lineItems, setLineItems] = useState<DispatchLineItem[]>([]);
  const [nextId, setNextId] = useState(1);

  // Selected PO full details
  const [selectedPO, setSelectedPO] = useState<OMPurchaseOrder | null>(null);
  const [isLoadingPoDetail, setIsLoadingPoDetail] = useState(false);

  // New logistics partner dialog
  const [showNewLogisticsDialog, setShowNewLogisticsDialog] = useState(false);
  const [newLogisticsName, setNewLogisticsName] = useState("");
  const [isAddingLogistics, setIsAddingLogistics] = useState(false);

  // Empty line replaced

  // When PO is selected, fetch full details with items and calculate remaining
  useEffect(() => {
    if (!poId) {
      setSelectedPO(null);
      setLineItems([]);
      setDeliveryLocationId("");
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
            .map((item: OMPurchaseOrderItem) => {
              const totalDispatched =
                item.dispatchItems?.reduce(
                  (sum: number, di: { quantity: number }) =>
                    sum + (di.quantity || 0),
                  0,
                ) || 0;
              const remaining = Number(item.quantity) - Number(totalDispatched);
              return {
                ...item,
                remainingQty: remaining,
              };
            })
            .filter(
              (i: OMPurchaseOrderItem & { remainingQty: number }) =>
                i.remainingQty > 0,
            );

          // Initialize dispatch line items with FIFO check
          const otherClientPOs = availablePOs
            .filter((p) => p.clientId === po.clientId && p.id !== po.id)
            .sort(
              (a, b) =>
                new Date(a.poDate || a.createdAt || 0).getTime() -
                new Date(b.poDate || b.createdAt || 0).getTime(),
            );

          const currentPoDate = new Date(
            po.poDate || po.createdAt || 0,
          ).getTime();

          const newLineItems: DispatchLineItem[] = items.map(
            (
              item: OMPurchaseOrderItem & { remainingQty: number },
              index: number,
            ) => {
              // Find if this product exists in an older PO for the same client
              const olderBlockingPO = otherClientPOs.find((otherPO) => {
                // Strictly only consider CONFIRMED or PARTIALLY_DISPATCHED as blocking
                if (otherPO.status !== "CONFIRMED" && otherPO.status !== "PARTIALLY_DISPATCHED") {
                  return false;
                }

                const otherPoDate = new Date(
                  otherPO.poDate || otherPO.createdAt || 0,
                ).getTime();
                if (otherPoDate >= currentPoDate) return false;

                // Check if this product is in the older PO and has remaining quantity
                return otherPO.items?.some((otherItem) => {
                  if (otherItem.productId !== item.productId) return false;
                  const totalDispatched =
                    otherItem.dispatchItems?.reduce(
                      (sum, di) => sum + (di.quantity || 0),
                      0,
                    ) || 0;
                  const remaining = Number(otherItem.quantity) - totalDispatched;
                  
                  // Only block if there is actual remaining quantity
                  if (remaining > 0) {
                    (item as any)._tempBlockingQty = remaining;
                    return true;
                  }
                  return false;
                });
              });

              return {
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
                blockedByFifo: !!olderBlockingPO,
                blockingPoNumber: olderBlockingPO?.poNumber || undefined,
                blockingPoQuantity: (item as any)._tempBlockingQty,
                blockingPoId: olderBlockingPO?.id || undefined,
              };
            },
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
    value: string | number,
  ) => {
    setLineItems(
      lineItems.map((item) => {
        if (item.tempId !== tempId) return item;

        const updated = { ...item, [field]: value };

        // Validate dispatch quantity
        if (field === "dispatchQty") {
          const qty = parseInt(value as string) || 0;
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

  // Shipment box functions
  const addNewBox = () => {
    const newBox: OMShipmentBox = {
      boxId: `box-${nextBoxNumber}`,
      boxNumber: nextBoxNumber,
      length: 0,
      width: 0,
      height: 0,
      weight: 0,
      numberOfBoxes: 1,
      contents: [],
    };
    setShipmentBoxes([...shipmentBoxes, newBox]);
    setNextBoxNumber(nextBoxNumber + 1);
  };

  const removeBox = (boxId: string) => {
    setShipmentBoxes(shipmentBoxes.filter((b) => b.boxId !== boxId));
  };

  const updateBox = (boxId: string, field: keyof OMShipmentBox, value: any) => {
    setShipmentBoxes(
      shipmentBoxes.map((box) =>
        box.boxId === boxId ? { ...box, [field]: value } : box,
      ),
    );
  };

  const addContentToBox = (boxId: string) => {
    setShipmentBoxes(
      shipmentBoxes.map((box) => {
        if (box.boxId !== boxId) return box;
        return {
          ...box,
          contents: [
            ...box.contents,
            { itemId: "", itemName: "", quantity: 0 },
          ],
        };
      }),
    );
  };

  const updateBoxContent = (
    boxId: string,
    contentIndex: number,
    field: string,
    value: any,
  ) => {
    setShipmentBoxes(
      shipmentBoxes.map((box) => {
        if (box.boxId !== boxId) return box;
        const newContents = [...box.contents];
        const content = { ...newContents[contentIndex] };

        if (field === "itemId") {
          content.itemId = value;
          const item = lineItems.find((li) => li.poLineItemId === value);
          content.itemName = item?.itemName || "";
        } else {
          (content as any)[field] = value;
        }

        newContents[contentIndex] = content;
        return { ...box, contents: newContents };
      }),
    );
  };

  const removeContentFromBox = (boxId: string, contentIndex: number) => {
    setShipmentBoxes(
      shipmentBoxes.map((box) => {
        if (box.boxId !== boxId) return box;
        const newContents = box.contents.filter((_, i) => i !== contentIndex);
        return { ...box, contents: newContents };
      }),
    );
  };

  const getPackedQuantity = (itemId: string) => {
    return shipmentBoxes.reduce((total, box) => {
      const itemInBox = box.contents.find((c) => c.itemId === itemId);
      return total + (itemInBox ? itemInBox.quantity * box.numberOfBoxes : 0);
    }, 0);
  };

  const isPackingComplete =
    totalDispatchQty > 0 &&
    lineItems
      .filter((item) => item.dispatchQty > 0)
      .every(
        (item) => getPackedQuantity(item.poLineItemId) === item.dispatchQty,
      );

  const getTotalBoxes = () => OMShipmentHelpers.getTotalBoxes(shipmentBoxes);
  const getVolumetricWeight = () =>
    OMShipmentHelpers.getVolumetricWeight(shipmentBoxes);
  const getTotalWeight = () => OMShipmentHelpers.getTotalWeight(shipmentBoxes);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    // Validation - Only PO and Items are strictly required now
    if (!poId) {
      toast.error("Please select a Purchase Order");
      return;
    }

    if (totalDispatchQty === 0) {
      toast.error("Please add at least one item to dispatch");
      return;
    }

    if (invoiceDate && selectedPO?.poDate) {
      const invDateObj = new Date(invoiceDate);
      const poDateObj = new Date(selectedPO.poDate);
      invDateObj.setHours(0, 0, 0, 0);
      poDateObj.setHours(0, 0, 0, 0);
      if (invDateObj < poDateObj) {
        toast.error("Invoice Date cannot be earlier than the PO Date");
        return;
      }
    }

    // Validate packing if boxes are added
    if (shipmentBoxes.length > 0) {
      // Check if all dispatched items are packed
      for (const item of lineItems) {
        if (item.dispatchQty > 0) {
          const packedQty = getPackedQuantity(item.poLineItemId);
          if (packedQty !== item.dispatchQty) {
            toast.error(
              `Item "${item.itemName}" dispatch quantity (${item.dispatchQty}) doesn't match packed quantity (${packedQty})`,
            );
            return;
          }
        }
      }

      // Check if all boxes have dimensions
      if (
        shipmentBoxes.some(
          (box) => box.length === 0 || box.width === 0 || box.height === 0,
        )
      ) {
        toast.error("Please enter dimensions for all boxes");
        return;
      }

      // Check if all boxes have contents
      if (shipmentBoxes.some((box) => box.contents.length === 0)) {
        toast.error("Please add contents to all boxes");
        return;
      }

      // Check if all contents have valid items and quantities
      for (const box of shipmentBoxes) {
        for (const content of box.contents) {
          if (!content.itemId || content.quantity === 0) {
            toast.error(
              `Please complete all content details in Box ${box.boxNumber}`,
            );
            return;
          }
        }
      }
    }

    setIsSubmitting(true);
    try {
      const processedItems = lineItems
        .filter((item) => item.dispatchQty > 0)
        .map((item) => ({
          purchaseOrderItemId: item.poLineItemId,
          quantity: item.dispatchQty,
          rate: item.rate,
          amount: item.amount,
          gstPercentage: item.gstPercentage,
          gstAmount: item.gstAmount,
          totalAmount: item.totalAmount,
        }));

      const payload = {
        purchaseOrderId: poId,
        invoiceNumber: invoiceNumber ? invoiceNumber.trim() : null,
        invoiceDate: invoiceDate ? formatDateForApi(invoiceDate) : null,
        logisticsPartnerId: logisticsPartnerId || null,
        deliveryLocationId: deliveryLocationId || null,
        docketNumber: trackingNumber || null,
        expectedDeliveryDate: expectedDeliveryDate
          ? formatDateForApi(expectedDeliveryDate)
          : null,
        dispatchDate: dispatchDate ? formatDateForApi(dispatchDate) : null,
        deliveryDate: deliveryDate ? formatDateForApi(deliveryDate) : null,
        status,
        items: processedItems,
        shipmentBoxes: shipmentBoxes.map((box) => ({
          boxNumber: box.boxNumber,
          length: box.length,
          width: box.width,
          height: box.height,
          weight: box.weight || 0,
          numberOfBoxes: box.numberOfBoxes,
          contents: box.contents.map((c) => ({
            itemId: c.itemId,
            quantity: c.quantity,
          })),
        })),
      };

      const res = await fetch("/api/admin/om/dispatch-orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        toast.success("Dispatch created successfully");
        revalidateOM(); // Trigger global revalidation
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
        const newId = data.id || data.data?.id;
        if (newId) setLogisticsPartnerId(newId);
        
        toast.success("Logistics partner added successfully");
        setShowNewLogisticsDialog(false);
        setNewLogisticsName("");
        revalidateOM();
      }
    } catch (err) {
      toast.error("Failed to add partner");
    } finally {
      setIsAddingLogistics(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => router.push("/admin/order-management/dispatches")}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-semibold">Create Dispatch Order</h1>
          <p className="text-muted-foreground">
            Create a new dispatch for a purchase order
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Select PO */}
        <Card>
          <CardHeader>
            <CardTitle>Select Purchase Order</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Purchase Order *</Label>
              <SearchableSelect
                options={availablePOs.map((po) => {
                  const totalQty =
                    po.totalQuantity ??
                    po.items?.reduce((sum, item) => sum + item.quantity, 0) ??
                    0;
                  return {
                    value: po.id,
                    label: `${po.client?.name || "Unknown Client"} - ${po.poNumber} (Ordered: ${totalQty})`,
                  };
                })}
                value={poId}
                onValueChange={setPoId}
                placeholder={
                  isLoadingMaster
                    ? "Loading active POs..."
                    : "Select PO with remaining quantity"
                }
                searchPlaceholder="Search POs..."
                disabled={isLoadingMaster}
              />
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
                      <strong>PO Number:</strong> {selectedPO.poNumber}
                    </p>
                    <p>
                      <strong>PO Date:</strong>{" "}
                      {selectedPO.poDate
                        ? new Date(selectedPO.poDate).toLocaleDateString(
                            "en-IN",
                            { day: "2-digit", month: "short", year: "numeric" },
                          )
                        : "N/A"}
                    </p>
                  </div>
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        {/* FIFO Blocking Warning */}
        {selectedPO && lineItems.some((li) => li.blockedByFifo) && (
          <Alert variant="destructive" className="border-orange-500 bg-orange-50 text-orange-900">
            <AlertCircle className="h-5 w-5 text-orange-600" />
            <AlertDescription>
              <div className="space-y-2">
                <p className="font-semibold text-lg">Pending Older Orders</p>
                <p>We already have pending orders for this client and these items. Please fulfill the older orders first:</p>
                <div className="space-y-3 mt-4">
                  {lineItems
                    .filter((li) => li.blockedByFifo)
                    .map((li) => (
                      <div key={li.tempId} className="flex items-center justify-between bg-white/50 p-3 rounded-lg border border-orange-200">
                        <div className="flex-1">
                          <p className="font-semibold text-orange-900">{li.itemName}</p>
                          <p className="text-sm text-orange-800">
                            {li.blockingPoQuantity} units remaining in <strong>PO #{li.blockingPoNumber}</strong>
                          </p>
                        </div>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="bg-white hover:bg-orange-100 text-orange-700 border-orange-300 ml-4"
                          onClick={() => {
                            if (li.blockingPoId) {
                              setPoId(li.blockingPoId);
                              router.push(`${pathname}?poId=${li.blockingPoId}`, { scroll: false });
                            }
                          }}
                        >
                          Switch to PO #{li.blockingPoNumber}
                        </Button>
                      </div>
                    ))}
                </div>
                <p className="text-sm mt-4 italic font-medium">Please fulfill the units from the older purchase orders listed above before dispatching from this one.</p>
              </div>
            </AlertDescription>
          </Alert>
        )}

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
                    <TableHead className="w-37.5">Dispatch Qty</TableHead>
                    <TableHead className="text-right">Rate</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead className="text-right">GST %</TableHead>
                    <TableHead className="text-right">GST Amt</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                    <TableHead></TableHead>
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
                            placeholder={item.blockedByFifo ? "Blocked" : "0"}
                            disabled={item.blockedByFifo}
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
                  <Label>Invoice Number</Label>
                  <Input
                    value={invoiceNumber}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (val.startsWith(fyPrefix)) {
                        const seq = val.slice(fyPrefix.length);
                        // Only allow digits for the sequential part
                        if (/^\d*$/.test(seq)) {
                          setInvoiceNumber(val);
                        }
                      } else if (val === "" || fyPrefix.startsWith(val)) {
                        // Prevent deleting the prefix
                        setInvoiceNumber(fyPrefix);
                      }
                    }}
                    placeholder={`${fyPrefix}Sequential`}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Invoice Date</Label>
                  <Input
                    type="date"
                    value={invoiceDate}
                    onChange={(e) => setInvoiceDate(e.target.value)}
                    min={
                      selectedPO?.poDate
                        ? formatDateToYYYYMMDD(selectedPO.poDate)
                        : undefined
                    }
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
              <div className="grid grid-cols-3 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label>Logistics Partner</Label>
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <SearchableSelect
                        options={logisticsPartners.map((partner) => ({
                          value: partner.id,
                          label: partner.name,
                        }))}
                        value={logisticsPartnerId}
                        onValueChange={setLogisticsPartnerId}
                        placeholder="Select logistics partner"
                        searchPlaceholder="Search partners..."
                      />
                    </div>
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
                  <Label>Docket / Tracking Number</Label>
                  <Input
                    value={trackingNumber}
                    onChange={(e) => setTrackingNumber(e.target.value)}
                    placeholder="Enter tracking number"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Dispatch Date</Label>
                  <Input
                    type="date"
                    value={dispatchDate}
                    onChange={(e) => setDispatchDate(e.target.value)}
                  />
                </div>

                {selectedPO.deliveryLocations &&
                  selectedPO.deliveryLocations.length > 0 && (
                    <div>
                      <Label className="mb-2 block">Delivery Location</Label>
                      <SearchableSelect
                        options={selectedPO.deliveryLocations.map(
                          (loc: any) => ({
                            value: loc.id,
                            label: loc.name,
                          }),
                        )}
                        value={deliveryLocationId}
                        onValueChange={setDeliveryLocationId}
                        placeholder="Select delivery location"
                        searchPlaceholder="Search locations..."
                      />
                    </div>
                  )}

                <div className="space-y-2">
                  <Label>Expected Delivery Date</Label>
                  <Input
                    type="date"
                    value={expectedDeliveryDate}
                    onChange={(e) => setExpectedDeliveryDate(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Delivery Date</Label>
                  <Input
                    type="date"
                    value={deliveryDate}
                    onChange={(e) => setDeliveryDate(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Dispatch Status</Label>
                  <Select
                    value={status}
                    onValueChange={(
                      val:
                        | "PENDING"
                        | "APPROVED"
                        | "READY_FOR_DISPATCH"
                        | "DISPATCHED"
                        | "AT_DESTINATION"
                        | "DELIVERED"
                        | "CANCELLED",
                    ) => setStatus(val)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {(
                        Object.entries(OM_DISPATCH_STATUS_CONFIG) as [
                          string,
                          { label: string; color: string },
                        ][]
                      ).map(([key, config]) => (
                        <SelectItem key={key} value={key}>
                          {config.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Shipment / Packing Details */}
        {selectedPO &&
          totalDispatchQty > 0 &&
          (!logisticsPartnerId ? (
            <Card className="px-6">
              <CardContent className="py-6 text-center text-muted-foreground border-2 border-dashed rounded-lg">
                <Info className="h-4 w-4 mx-auto mb-2" />
                <p className="text-sm">
                  Note: Select a Logistics Partner to add shipment details
                </p>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Shipment / Packing Details</CardTitle>
                  <p className="text-xs text-muted-foreground my-1">
                    Add boxes/cartons with their dimensions and contents
                  </p>
                </div>
                <Button
                  type="button"
                  onClick={addNewBox}
                  variant="outline"
                  size="sm"
                >
                  <Package className="h-4 w-4 mr-2" />
                  Add Box
                </Button>
              </CardHeader>
              <CardContent className="space-y-6">
                {shipmentBoxes.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground border-2 border-dashed rounded-lg">
                    <Package className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p>No boxes added yet</p>
                    <p className="text-sm">
                      Click "Add Box" to start adding shipment details
                    </p>
                  </div>
                ) : (
                  <>
                    {/* Packing Summary */}
                    <Alert>
                      <Package className="h-4 w-4" />
                      <AlertDescription>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div>
                            <p className="text-sm font-medium">Total Boxes</p>
                            <p className="text-2xl font-bold">
                              {getTotalBoxes()}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm font-medium">
                              Volumetric Weight
                            </p>
                            <p className="text-2xl font-bold">
                              {getVolumetricWeight().toFixed(3)} kg
                            </p>
                          </div>
                          <div>
                            <p className="text-sm font-medium">Actual Weight</p>
                            <p className="text-2xl font-bold">
                              {getTotalWeight().toFixed(2)} kg
                            </p>
                          </div>
                          <div className="col-span-2 md:col-span-1">
                            <p className="text-sm font-medium mb-2">
                              Packing Status
                            </p>
                            {lineItems
                              .filter((item) => item.dispatchQty > 0)
                              .map((item) => {
                                const packed = getPackedQuantity(
                                  item.poLineItemId,
                                );
                                const isComplete = packed === item.dispatchQty;
                                return (
                                  <div
                                    key={item.poLineItemId}
                                    className="flex justify-between text-sm mb-1"
                                  >
                                    <span className="truncate">
                                      {item.itemName}:
                                    </span>
                                    <span
                                      className={
                                        isComplete
                                          ? "text-green-600 font-medium"
                                          : "text-orange-600 font-medium"
                                      }
                                    >
                                      {packed} / {item.dispatchQty}{" "}
                                      {isComplete ? "✓" : "⚠"}
                                    </span>
                                  </div>
                                );
                              })}
                          </div>
                        </div>
                      </AlertDescription>
                    </Alert>

                    {/* Individual Boxes */}
                    {shipmentBoxes.map((box, boxIndex) => (
                      <Card key={box.boxId} className="border-2">
                        <CardHeader className="pb-3">
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-base">
                              Box {box.boxNumber}
                            </CardTitle>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeBox(box.boxId)}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          {/* Box Dimensions */}
                          <div>
                            <Label className="text-sm font-medium mb-2 block">
                              Dimensions (in cm) & Weight (in kg)
                            </Label>
                            <div className="grid grid-cols-5 gap-3">
                              <div className="space-y-1">
                                <Label className="text-xs text-muted-foreground">
                                  Length
                                </Label>
                                <Input
                                  type="number"
                                  min="0"
                                  value={box.length || ""}
                                  onChange={(e) =>
                                    updateBox(
                                      box.boxId,
                                      "length",
                                      parseFloat(e.target.value) || 0,
                                    )
                                  }
                                  placeholder="cm"
                                />
                              </div>
                              <div className="space-y-1">
                                <Label className="text-xs text-muted-foreground">
                                  Width
                                </Label>
                                <Input
                                  type="number"
                                  min="0"
                                  value={box.width || ""}
                                  onChange={(e) =>
                                    updateBox(
                                      box.boxId,
                                      "width",
                                      parseFloat(e.target.value) || 0,
                                    )
                                  }
                                  placeholder="cm"
                                />
                              </div>
                              <div className="space-y-1">
                                <Label className="text-xs text-muted-foreground">
                                  Height
                                </Label>
                                <Input
                                  type="number"
                                  min="0"
                                  value={box.height || ""}
                                  onChange={(e) =>
                                    updateBox(
                                      box.boxId,
                                      "height",
                                      parseFloat(e.target.value) || 0,
                                    )
                                  }
                                  placeholder="cm"
                                />
                              </div>
                              <div className="space-y-1">
                                <Label className="text-xs text-muted-foreground">
                                  Weight
                                </Label>
                                <Input
                                  type="number"
                                  min="0"
                                  value={box.weight || ""}
                                  onChange={(e) =>
                                    updateBox(
                                      box.boxId,
                                      "weight",
                                      parseFloat(e.target.value) || 0,
                                    )
                                  }
                                  placeholder="kg"
                                />
                              </div>
                              <div className="space-y-1">
                                <Label className="text-xs text-muted-foreground">
                                  # of Boxes
                                </Label>
                                <Input
                                  type="number"
                                  min="1"
                                  value={box.numberOfBoxes || ""}
                                  onChange={(e) =>
                                    updateBox(
                                      box.boxId,
                                      "numberOfBoxes",
                                      parseInt(e.target.value),
                                    )
                                  }
                                  placeholder="0"
                                />
                              </div>
                            </div>
                            {box.length > 0 &&
                              box.width > 0 &&
                              box.height > 0 && (
                                <p className="text-xs text-muted-foreground mt-2">
                                  Volumetric Weight per box:{" "}
                                  {OMShipmentHelpers.calculateBoxVolumetricWeight(
                                    box,
                                  ).toFixed(4)}{" "}
                                  kg
                                  {box.numberOfBoxes > 1 &&
                                    ` × ${box.numberOfBoxes} = ${OMShipmentHelpers.calculateTotalBoxVolumetricWeight(
                                      box,
                                    ).toFixed(4)} kg`}
                                </p>
                              )}
                            {box.weight > 0 && (
                              <p className="text-xs text-muted-foreground mt-1">
                                Weight per box: {box.weight} kg
                                {box.numberOfBoxes > 1 &&
                                  ` × ${box.numberOfBoxes} = ${(box.weight * box.numberOfBoxes).toFixed(2)} kg`}
                              </p>
                            )}
                          </div>

                          {/* Box Contents */}
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <Label className="text-sm font-medium">
                                Contents (per box)
                              </Label>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => addContentToBox(box.boxId)}
                              >
                                <Plus className="h-3 w-3 mr-1" />
                                Add Item
                              </Button>
                            </div>

                            {box.contents.length === 0 ? (
                              <div className="text-center py-4 border-2 border-dashed rounded text-sm text-muted-foreground">
                                No items in this box yet
                              </div>
                            ) : (
                              <div className="space-y-2">
                                {box.contents.map((content, contentIndex) => (
                                  <div
                                    key={contentIndex}
                                    className="flex gap-2"
                                  >
                                    <Select
                                      value={content.itemId}
                                      onValueChange={(value) =>
                                        updateBoxContent(
                                          box.boxId,
                                          contentIndex,
                                          "itemId",
                                          value,
                                        )
                                      }
                                    >
                                      <SelectTrigger className="flex-1">
                                        <SelectValue placeholder="Select item" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        {lineItems
                                          .filter(
                                            (item) => item.dispatchQty > 0,
                                          )
                                          .map((item) => (
                                            <SelectItem
                                              key={item.poLineItemId}
                                              value={item.poLineItemId}
                                            >
                                              {item.itemName} (Dispatch:{" "}
                                              {item.dispatchQty})
                                            </SelectItem>
                                          ))}
                                      </SelectContent>
                                    </Select>
                                    <Input
                                      type="number"
                                      min="0"
                                      value={content.quantity || ""}
                                      onChange={(e) =>
                                        updateBoxContent(
                                          box.boxId,
                                          contentIndex,
                                          "quantity",
                                          parseInt(e.target.value) || 0,
                                        )
                                      }
                                      placeholder="Qty"
                                      className="w-24"
                                    />
                                    <Button
                                      type="button"
                                      variant="ghost"
                                      size="sm"
                                      onClick={() =>
                                        removeContentFromBox(
                                          box.boxId,
                                          contentIndex,
                                        )
                                      }
                                    >
                                      <Trash2 className="h-4 w-4 text-destructive" />
                                    </Button>
                                  </div>
                                ))}
                                {box.numberOfBoxes > 1 &&
                                  box.contents.length > 0 && (
                                    <p className="text-xs text-muted-foreground italic mt-2">
                                      Total across {box.numberOfBoxes} boxes:
                                      {box.contents
                                        .map((c) => c.itemName)
                                        .filter(Boolean)
                                        .map((name, i) => (
                                          <span key={i}>
                                            {" "}
                                            {name} (
                                            {box.contents[i].quantity *
                                              box.numberOfBoxes}
                                            )
                                          </span>
                                        ))}
                                    </p>
                                  )}
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </>
                )}
              </CardContent>
            </Card>
          ))}

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
        <div className="flex flex-col items-end gap-2">
          {shipmentBoxes.length > 0 &&
            !isPackingComplete &&
            totalDispatchQty > 0 && (
              <p className="text-sm text-destructive flex items-center bg-destructive/10 px-3 py-1 rounded-md">
                <AlertCircle className="h-4 w-4 mr-2" />
                Packing status not met. Please ensure all items are fully
                packed.
              </p>
            )}
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
              disabled={
                !selectedPO ||
                totalDispatchQty === 0 ||
                isSubmitting ||
                (shipmentBoxes.length > 0 && !isPackingComplete)
              }
            >
              {isSubmitting ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              {isSubmitting ? "Creating..." : "Create Dispatch"}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default function OMCreateDispatch() {
  return (
    <div className="space-y-6">
      <Suspense fallback={<div>Loading form...</div>}>
        <CreateDispatchForm />
      </Suspense>
    </div>
  );
}
