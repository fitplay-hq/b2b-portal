"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import Layout from "@/components/layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Package, TrendingUp, Truck } from "lucide-react";
import {
  omDispatches,
  omPurchaseOrders,
  OMDispatch,
} from "../../_mock/omMockData";

export default function OMDispatchDetail() {
  const params = useParams();
  const id = params.id as string;
  const dispatch = omDispatches.find((d) => d.id === id);

  if (!dispatch) {
    return (
      <Layout isClient={false}>
        <div className="text-center py-12">
          <h3 className="text-lg font-semibold mb-2">Dispatch Not Found</h3>
          <p className="text-muted-foreground mb-4">
            The dispatch you're looking for doesn't exist.
          </p>
          <Link href="/admin/order-management/dispatches">
            <Button>Back to Dispatches</Button>
          </Link>
        </div>
      </Layout>
    );
  }

  const po = omPurchaseOrders.find((p) => p.id === dispatch.poId);

  const getStatusVariant = (status: OMDispatch["status"]) => {
    switch (status) {
      case "Created":
        return "secondary";
      case "Dispatched":
        return "default";
      case "Delivered":
        return "default";
      case "Cancelled":
        return "destructive";
      default:
        return "secondary";
    }
  };

  return (
    <Layout isClient={false}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/admin/order-management/dispatches">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            </Link>
            <div>
              <h3 className="text-lg font-semibold">
                {dispatch.invoiceNumber}
              </h3>
              <p className="text-sm text-muted-foreground">
                PO: {dispatch.poNumber}
              </p>
            </div>
          </div>
          <Badge
            variant={getStatusVariant(dispatch.status)}
            className="text-sm px-3 py-1"
          >
            {dispatch.status}
          </Badge>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Dispatched
              </CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {dispatch.totalDispatchQty}
              </div>
              <p className="text-xs text-muted-foreground">Items dispatched</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Dispatch Value
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ₹{dispatch.grandTotal.toLocaleString("en-IN")}
              </div>
              <p className="text-xs text-muted-foreground">
                Total invoice value
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Logistics Partner
              </CardTitle>
              <Truck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-lg font-bold">
                {dispatch.logisticsPartnerName}
              </div>
              <p className="text-xs text-muted-foreground font-mono">
                {dispatch.trackingNumber}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Dispatch Details */}
        <Card>
          <CardHeader>
            <CardTitle>Dispatch Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Client</p>
                <p className="font-medium">{dispatch.clientName}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Invoice Date</p>
                <p className="font-medium">
                  {new Date(dispatch.invoiceDate).toLocaleDateString("en-IN")}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">
                  Expected Delivery
                </p>
                <p className="font-medium">
                  {new Date(dispatch.expectedDeliveryDate).toLocaleDateString(
                    "en-IN",
                  )}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Tracking Number</p>
                <p className="font-mono text-sm">{dispatch.trackingNumber}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Created At</p>
                <p className="font-medium">
                  {new Date(dispatch.createdAt).toLocaleString("en-IN")}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Status</p>
                <Badge variant={getStatusVariant(dispatch.status)}>
                  {dispatch.status}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Related Purchase Order */}
        {po && (
          <Card>
            <CardHeader>
              <CardTitle>Related Purchase Order</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="font-medium">{po.estimateNumber}</p>
                  <p className="text-sm text-muted-foreground">
                    PO: {po.poNumber}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Location: {po.deliveryLocation}
                  </p>
                </div>
                <Link href={`/admin/order-management/purchase-orders/${po.id}`}>
                  <Button variant="outline">View PO</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Dispatch Items */}
        <Card>
          <CardHeader>
            <CardTitle>Dispatched Items</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item Name</TableHead>
                  <TableHead className="text-right">Dispatched Qty</TableHead>
                  <TableHead className="text-right">Rate</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead className="text-right">GST %</TableHead>
                  <TableHead className="text-right">GST Amount</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {dispatch.lineItems.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">
                      {item.itemName}
                    </TableCell>
                    <TableCell className="text-right">
                      {item.dispatchQty}
                    </TableCell>
                    <TableCell className="text-right">
                      ₹{item.rate.toLocaleString("en-IN")}
                    </TableCell>
                    <TableCell className="text-right">
                      ₹{item.amount.toLocaleString("en-IN")}
                    </TableCell>
                    <TableCell className="text-right">
                      {item.gstPercent}%
                    </TableCell>
                    <TableCell className="text-right">
                      ₹{item.gstAmount.toLocaleString("en-IN")}
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      ₹{item.totalAmount.toLocaleString("en-IN")}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <Separator className="my-4" />

            <div className="space-y-2 max-w-md ml-auto">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal:</span>
                <span className="font-medium">
                  ₹{dispatch.subtotal.toLocaleString("en-IN")}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total GST:</span>
                <span className="font-medium">
                  ₹{dispatch.totalGst.toLocaleString("en-IN")}
                </span>
              </div>
              <div className="flex justify-between pt-2 border-t">
                <span className="font-semibold">Grand Total:</span>
                <span className="font-semibold text-lg">
                  ₹{dispatch.grandTotal.toLocaleString("en-IN")}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
