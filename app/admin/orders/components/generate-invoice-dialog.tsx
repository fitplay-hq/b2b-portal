
"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { AdminOrder } from "@/data/order/admin.actions";
import { useRef, useState } from "react";
import { toast } from "sonner";


interface Props {
  order: AdminOrder | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const handlePdfGeneration = async (formData: any,Setgenerating:any) => {
  
  try {
    Setgenerating(true)
    
    const invoiceNumber = formData.invoiceNumber;
    const invoiceDate = formData.invoiceDate;

    const buyer = {
      name: formData.buyerName,
      address: formData.buyerAddress,
      gstin: formData.buyerGstin,
    };

    const dispatch = {
  deliveryNote: formData.deliveryNote,
  paymentTerms: formData.paymentTerms,
  supplierRef: formData.supplierRef,
  otherRef: formData.otherRef,
  buyerOrderNo: formData.buyerOrderNo,
  buyerOrderDate: formData.dated,
  dispatchDocNo: formData.dispatchDocNo,
  deliveryNoteDate: formData.deliveryNoteDate,
  dispatchedThrough: formData.dispatchedThrough,
  destination: formData.destination,
  deliveryAddress: formData.deliveryAddress,
};


    const items = formData.items.map((i: any) => ({
      name: i.name,
      hsn: i.hsn,
      qty: i.qty,
      rate: i.rate,
      taxPercent: i.taxPercent,
      igst: i.rate * i.qty * (i.taxPercent / 100),
      total: i.rate * i.qty,
    }));

    const taxable = items.reduce((sum: number, i: any) => sum + i.total, 0);
    const igst = items.reduce((sum: number, i: any) => sum + i.igst, 0);
    const grand = taxable + igst;

    const res = await fetch("/api/invoices/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        invoiceNumber,
        invoiceDate,
        buyer,
        dispatch,
        items,
        totals: {
          taxable,
          igst,
          grand,
        },
      }),
    });

    if (!res.ok) {
      throw new Error("Failed to generate invoice");
    }

    // 👉 Download PDF
    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `invoice-${invoiceNumber}.pdf`;
    document.body.appendChild(a);
    a.click();
    a.remove();

    window.URL.revokeObjectURL(url);
    Setgenerating(false)
    toast.success("PDF Genarated Successfully");
    
  } catch (error) {
    console.error(error);
     Setgenerating(false)
     toast.error("Failed to Generate Pdf")
   
  }
};

export function GenerateInvoiceDialog({ order, open, onOpenChange }: Props) {
  if (!order) return null;

  console.log(order)
 const invoiceItems = [
  // Normal order items (if any)
  ...order.orderItems.map((item) => ({
    id: item.id,
    name: item.product.name,
    qty: item.quantity,
    rate: item.price,
    taxPercent: 18,
    hsn: "",
  })),

  // Bundle order items (ALREADY FLATTENED)
  ...(order.bundleOrderItems || []).map((item) => ({
    id: `bundle-${item.id}`,
    name: item.product.name,   // ✅ real product
    qty: item.quantity,        // ✅ already total qty
    rate: item.price,          // ✅ snapshot price
    taxPercent: 18,
    hsn: "",
  })),
];






  const [generating,Setgenerating] = useState(false);
  const invoiceNumberRef = useRef<HTMLInputElement>(null);
  const invoiceDateRef = useRef<HTMLInputElement>(null);
  const sellerNameRef = useRef<HTMLInputElement>(null);
  const sellerAddressRef = useRef<HTMLTextAreaElement>(null);
  const sellerGstinRef = useRef<HTMLInputElement>(null);
  const buyerNameRef = useRef<HTMLInputElement>(null);
  const buyerAddressRef = useRef<HTMLTextAreaElement>(null);
  const buyerGstinRef = useRef<HTMLInputElement>(null);
  const deliveryNoteRef = useRef<HTMLInputElement>(null);
  const paymentTermsRef = useRef<HTMLInputElement>(null);
  const supplierRefRef = useRef<HTMLInputElement>(null);
  const otherRefRef = useRef<HTMLInputElement>(null);
  const buyerOrderNoRef = useRef<HTMLInputElement>(null);
  const datedRef = useRef<HTMLInputElement>(null);
  const dispatchDocNoRef = useRef<HTMLInputElement>(null);
  const deliveryNoteDateRef = useRef<HTMLInputElement>(null);
  const dispatchedThroughRef = useRef<HTMLInputElement>(null);
  const destinationRef = useRef<HTMLInputElement>(null);
  const deliveryAddressRef = useRef<HTMLTextAreaElement>(null);
  const notesRef = useRef<HTMLTextAreaElement>(null);

  const itemRefs = useRef<{
    [key: string]: {
      name: HTMLInputElement | null;
      qty: HTMLInputElement | null;
      rate: HTMLInputElement | null;
      taxPercent: HTMLInputElement | null;
      hsn:HTMLInputElement | null
    };
  }>({});

  const collectFormData = () => {
    Setgenerating(true)
    const items = invoiceItems.map((item) => ({
      name: itemRefs.current[item.id]?.name?.value || item.name,
      qty: parseFloat(itemRefs.current[item.id]?.qty?.value || String(item.qty)),
      rate: parseFloat(itemRefs.current[item.id]?.rate?.value || String(item.rate)),
      taxPercent: parseFloat(itemRefs.current[item.id]?.taxPercent?.value || "18"),
      hsn: parseFloat(itemRefs.current[item.id]?.hsn?.value || ""),
    }));

    return {
      invoiceNumber: invoiceNumberRef.current?.value || ` FP/LLP/25-26/`,
      invoiceDate: invoiceDateRef.current?.value || new Date().toISOString().split("T")[0],
      sellerName: sellerNameRef.current?.value || "FITPLAY INTERNATIONAL LLP",
      sellerAddress: sellerAddressRef.current?.value || "B4/1002, 10th Floor, Tulip Orange, Gurgaon, Haryana - 122001",
      sellerGstin: sellerGstinRef.current?.value || "",
      buyerName: buyerNameRef.current?.value || order.client.companyName || order.client.company.name,
      buyerAddress: buyerAddressRef.current?.value || order.client.company.address,
      buyerGstin: buyerGstinRef.current?.value || "",
      deliveryNote: deliveryNoteRef.current?.value || "",
      paymentTerms: paymentTermsRef.current?.value || "",
      supplierRef: supplierRefRef.current?.value || "",
      otherRef: otherRefRef.current?.value || "",
      buyerOrderNo: buyerOrderNoRef.current?.value || "",
      dated: datedRef.current?.value || "",
      dispatchDocNo: dispatchDocNoRef.current?.value || "",
      deliveryNoteDate: deliveryNoteDateRef.current?.value || "",
      dispatchedThrough: dispatchedThroughRef.current?.value || "",
      destination: destinationRef.current?.value || "",
      deliveryAddress: deliveryAddressRef.current?.value || order.deliveryAddress,
      notes: notesRef.current?.value || "",
      items,
    };
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Generate Invoice</DialogTitle>
        </DialogHeader>

        {/* Invoice Meta */}
        <div className="grid grid-cols-3 gap-4">
          <div>
            <Label>Invoice Number</Label>
            <Input ref={invoiceNumberRef} defaultValue={`FP/LLP/25-26/`} />
          </div>
          <div>
            <Label>Invoice Date</Label>
            <Input
              ref={invoiceDateRef}
              type="date"
              defaultValue={new Date().toISOString().split("T")[0]}
            />
          </div>
          <div>
            <Label>Order ID</Label>
            <Input value={order.id} disabled />
          </div>
        </div>

        {/* Seller & Buyer */}
        <div className="grid grid-cols-2 gap-6 mt-6">
          <div className="space-y-2">
            <h4 className="font-semibold">Seller Details</h4>
            <Input ref={sellerNameRef} defaultValue="FITPLAY INTERNATIONAL LLP" />
            <Textarea ref={sellerAddressRef} defaultValue="B4/1002, 10th Floor, Tulip Orange, Gurgaon, Haryana - 122001" />
            <Input ref={sellerGstinRef} placeholder="GSTIN" />
          </div>

          <div className="space-y-2">
            <h4 className="font-semibold">Buyer Details</h4>
            <Input ref={buyerNameRef} defaultValue={order.client.companyName || order.client.company.name} />
            <Textarea ref={buyerAddressRef} defaultValue={order.client.company.address} />
            <Input ref={buyerGstinRef} placeholder="GSTIN " />
          </div>
        </div>

        {/* Invoice Reference Details (NEW) */}
        <div className="mt-6">
          <h4 className="font-semibold mb-3">Invoice & Dispatch Details</h4>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Delivery Note</Label>
              <Input ref={deliveryNoteRef} placeholder="Delivery Note" />
            </div>
            <div>
              <Label>Mode / Terms of Payment</Label>
              <Input ref={paymentTermsRef} placeholder="Mode / Terms of Payment" />
            </div>

            <div>
              <Label>Supplier's Ref</Label>
              <Input ref={supplierRefRef} placeholder="Supplier Reference" />
            </div>
            <div>
              <Label>Other Ref</Label>
              <Input ref={otherRefRef} placeholder="Other Reference" />
            </div>

            <div>
              <Label>Buyer's Order No.</Label>
              <Input ref={buyerOrderNoRef} placeholder="Buyer Order Number" />
            </div>
            <div>
              <Label>Dated</Label>
              <Input ref={datedRef} type="date" />
            </div>

            <div>
              <Label>Dispatch Document No.</Label>
              <Input ref={dispatchDocNoRef} placeholder="Dispatch Document Number" />
            </div>
            <div>
              <Label>Delivery Note Date</Label>
              <Input ref={deliveryNoteDateRef} type="date" />
            </div>

            <div>
              <Label>Dispatched Through</Label>
              <Input ref={dispatchedThroughRef} placeholder="Courier / Transport Name" />
            </div>
            <div>
              <Label>Destination</Label>
              <Input ref={destinationRef} placeholder="Destination" />
            </div>
          </div>

          <div className="mt-4">
            <Label>Delivery Address</Label>
            <Textarea
              ref={deliveryAddressRef}
              defaultValue={order.deliveryAddress}
              rows={4}
            />
          </div>
        </div>

        {/* Items */}
        <div className="mt-6">
  <h4 className="font-semibold mb-2">Invoice Items</h4>

  <div className="border rounded-md">
    <div className="grid grid-cols-6 text-xs font-medium bg-muted px-3 py-2">
      <span>Item</span>
      <span>HSN</span>
      <span>Qty</span>
      <span>Rate</span>
      <span>Tax %</span>
      <span>Total</span>
    </div>

    {invoiceItems.map((item) => (
      <div
        key={item.id}
        className="grid grid-cols-6 gap-2 px-3 py-2 text-sm"
      >
        {/* Item Name */}
        <Input
          ref={(el) => {
            if (!itemRefs.current[item.id])
              itemRefs.current[item.id] = {
                name: null,
                hsn: null,
                qty: null,
                rate: null,
                taxPercent: null,
              };
            itemRefs.current[item.id].name = el;
          }}
          defaultValue={item.name}
        />

        {/* HSN */}
        <Input
          ref={(el) => {
            itemRefs.current[item.id].hsn = el;
          }}
          placeholder="HSN"
          defaultValue={item.hsn || ""}
        />

        {/* Qty */}
        <Input
          ref={(el) => {
            itemRefs.current[item.id].qty = el;
          }}
          type="number"
          defaultValue={item.qty}
        />

        {/* Rate */}
        <Input
          ref={(el) => {
            itemRefs.current[item.id].rate = el;
          }}
          type="number"
          defaultValue={item.rate}
        />

        {/* Tax % */}
        <Input
          ref={(el) => {
            itemRefs.current[item.id].taxPercent = el;
          }}
          type="number"
          defaultValue={18}
        />

        {/* Total */}
        <Input
          value={(item.qty * item.rate).toFixed(2)}
          disabled
        />
      </div>
    ))}
  </div>
</div>


        {/* Notes */}
        <div className="mt-4">
          <Label>Notes</Label>
          <Textarea ref={notesRef} placeholder="Any special instructions..." />
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2 mt-6">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={() => {
              handlePdfGeneration(collectFormData(),Setgenerating);
            }}
          >
           {
            generating ? "Generating...": "Genarate Pdf"
           }
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}