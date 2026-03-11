"use client";

import { useState, useEffect, useRef } from "react";
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
import { Loader2, Plus, Save } from "lucide-react";
import { SearchableSelect } from "@/components/ui/combobox";
import { OMClientForm } from "./OMClientForm";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { OMPurchaseOrderLineItems, LineItem } from "./OMPurchaseOrderLineItems";
import { OMNewLocationDialog } from "./OMNewLocationDialog";
import { getFinancialYearString } from "@/lib/utils/financial-year";
import {
  OMClient,
  OMDeliveryLocation,
  OMProduct,
  OMBrand,
  OMPoStatus,
} from "@/types/order-management";
import { toast } from "sonner";

interface OMPurchaseOrderFormProps {
  initialData?: any;
  clients: OMClient[];
  locations: OMDeliveryLocation[];
  products: OMProduct[];
  brands: OMBrand[];
  onSubmit: (data: any) => Promise<void>;
  isSubmitting: boolean;
  onRefreshData: (isSilent?: boolean) => Promise<void>;
}

export function OMPurchaseOrderForm({
  initialData,
  clients,
  locations,
  products,
  brands,
  onSubmit,
  isSubmitting,
  onRefreshData,
}: OMPurchaseOrderFormProps) {
  const [clientId, setClientId] = useState(initialData?.clientId || "");
  const [locationId, setLocationId] = useState(initialData?.locationId || "");

  const [estimateNumber, setEstimateNumber] = useState(() => {
    const existingEst = initialData?.estimateNumber || "";
    const fyMatch = existingEst.match(/^(FP\/\d{2}-\d{2}\/)(.*)$/);
    return fyMatch ? (fyMatch[2] === "" ? "" : fyMatch[2]) : existingEst;
  });
  const [estimateDate, setEstimateDate] = useState(
    initialData?.estimateDate?.split("T")[0] || "",
  );
  const [poNumber, setPoNumber] = useState(initialData?.poNumber || "");
  const [poDate, setPoDate] = useState(
    initialData?.poDate?.split("T")[0] || "",
  );
  const [poReceivedDate, setPoReceivedDate] = useState(
    initialData?.poReceivedDate?.split("T")[0] || "",
  );
  const [status, setStatus] = useState<OMPoStatus>(
    initialData?.status || "DRAFT",
  );

  const [lineItems, setLineItems] = useState<LineItem[]>(() => {
    if (initialData?.items) {
      return initialData.items.map((item: any, idx: number) => ({
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
        brandId: item.brandId || item.OMBrand?.id || "",
        description: item.description || "",
      }));
    }
    return [];
  });
  const [nextTempId, setNextTempId] = useState(
    (initialData?.items?.length || 0) + 1,
  );
  const fyPrefixRef = useRef(
    initialData?.estimateNumber?.match(/^(FP\/\d{2}-\d{2}\/)/)?.[1] ||
      `FP/${getFinancialYearString()}/`,
  );
  const hasInitializedRef = useRef(false);

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

  // Simple effect to handle programmatic data refreshes if needed,
  // but initial mounting data is handled by useState initialization
  useEffect(() => {
    if (initialData && hasInitializedRef.current) {
        // Handle significant changes from outside if necessary
        // but avoid overwriting active user edits
    }
    hasInitializedRef.current = true;
  }, [initialData]);

  const clientOptions = clients.map((c) => ({ value: c.id, label: c.name }));
  const locationOptions = locations.map((l) => ({
    value: l.id,
    label: l.name,
  }));

  const addLineItem = () => {
    const newItem: LineItem = {
      tempId: `temp-${nextTempId}`,
      productId: "",
      itemName: "",
      quantity: 1,
      rate: 0,
      amount: 0,
      gstPercentage: 0,
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
    value: any,
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
            updated.gstPercentage = selectedProduct.defaultGstPct ?? 0;
            updated.brandId =
              selectedProduct.brandId ||
              (selectedProduct as any).brands?.[0]?.id ||
              "";
          }
        }

        updated.amount = updated.quantity * updated.rate;
        updated.gstAmount = (updated.amount * updated.gstPercentage) / 100;
        updated.totalAmount = updated.amount + updated.gstAmount;

        return updated;
      }),
    );
  };

  const handleNewItemAdded = (tempId: string, product: OMProduct) => {
    onRefreshData(true).then(() => {
      updateLineItem(tempId, "productId", product.id, product);
    });
  };

  const handleNewBrandAdded = (tempId: string, brand: OMBrand) => {
    onRefreshData(true).then(() => {
      updateLineItem(tempId, "brandId", brand.id);
    });
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const fyPrefix = fyPrefixRef.current;
    let finalEstimateNumber = estimateNumber;
    if (!finalEstimateNumber || finalEstimateNumber.trim() === "") {
      finalEstimateNumber = fyPrefix;
    } else {
      finalEstimateNumber = fyPrefix + estimateNumber;
    }

    const finalStatus =
      poNumber && poNumber.trim() !== ""
        ? status === "DRAFT"
          ? "CONFIRMED"
          : status
        : "DRAFT";

    const payload = {
      clientId,
      locationId: locationId || null,
      estimateNumber: finalEstimateNumber || null,
      estimateDate: estimateDate ? new Date(estimateDate).toISOString() : null,
      poNumber: poNumber || null,
      poDate: poDate ? new Date(poDate).toISOString() : null,
      poReceivedDate: poReceivedDate
        ? new Date(poReceivedDate).toISOString()
        : null,
      status: finalStatus,
      items: lineItems.map(({ tempId, itemName, id, ...rest }) => ({
        ...rest,
        id: id, // Include ID for updates
      })),
    };

    onSubmit(payload);
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
        await onRefreshData();
        setClientId(data.id || data.data.id);
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
        toast.success("Client added successfully");
      }
    } finally {
      setIsAddingClient(false);
    }
  };

  const subtotal = lineItems.reduce((sum, item) => sum + item.amount, 0);
  const totalGst = lineItems.reduce((sum, item) => sum + item.gstAmount, 0);
  const grandTotal = subtotal + totalGst;

  return (
    <form onSubmit={handleFormSubmit} className="space-y-6">
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
                <OMNewLocationDialog
                  onLocationAdded={(loc) => {
                    onRefreshData().then(() => setLocationId(loc.id));
                  }}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>FitPlay Estimate Number</Label>
              <div className="flex items-center border rounded-md px-3 bg-muted/30 focus-within:ring-1 focus-within:ring-ring">
                <p className="text-sm font-medium text-muted-foreground whitespace-nowrap pr-2 border-r">
                  {fyPrefixRef.current}
                </p>
                <Input
                  value={estimateNumber}
                  onChange={(e) => setEstimateNumber(e.target.value)}
                  placeholder="N/A"
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

            <div className="space-y-2">
              <Label>Status</Label>
              <Select
                value={status}
                onValueChange={(val: OMPoStatus) => setStatus(val)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="DRAFT">Draft</SelectItem>
                  <SelectItem value="CONFIRMED">Confirmed</SelectItem>
                  <SelectItem value="PARTIALLY_DISPATCHED">
                    Partially Dispatched
                  </SelectItem>
                  <SelectItem value="FULLY_DISPATCHED">
                    Fully Dispatched
                  </SelectItem>
                  <SelectItem value="CLOSED">Closed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <OMPurchaseOrderLineItems
            lineItems={lineItems}
            products={products}
            brands={brands}
            onAddLineItem={addLineItem}
            onRemoveLineItem={removeLineItem}
            onUpdateLineItem={updateLineItem}
            onNewItemAdded={handleNewItemAdded}
            onNewBrandAdded={handleNewBrandAdded}
          />
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row justify-between gap-6">
            <div className="flex-1 space-y-2">
              <p className="text-sm text-muted-foreground italic">
                * PO Number is required to mark as CONFIRMED.
              </p>
            </div>
            <div className="w-full md:w-80 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal:</span>
                <span className="font-medium">
                  ₹
                  {subtotal.toLocaleString("en-IN", {
                    minimumFractionDigits: 2,
                  })}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Total GST:</span>
                <span className="font-medium">
                  ₹
                  {totalGst.toLocaleString("en-IN", {
                    minimumFractionDigits: 2,
                  })}
                </span>
              </div>
              <div className="flex justify-between text-base pt-2 border-t font-bold">
                <span>Grand Total:</span>
                <span className="text-primary text-lg">
                  ₹
                  {grandTotal.toLocaleString("en-IN", {
                    minimumFractionDigits: 2,
                  })}
                </span>
              </div>
              <Button
                type="submit"
                className="w-full mt-4"
                disabled={
                  isSubmitting ||
                  !clientId ||
                  lineItems.length === 0 ||
                  !lineItems.some((item) => item.productId)
                }
              >
                {isSubmitting ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Save className="mr-2 h-4 w-4" />
                )}
                {initialData
                  ? "Update Purchase Order"
                  : "Create Purchase Order"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </form>
  );
}
