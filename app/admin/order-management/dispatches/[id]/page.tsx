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
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ArrowLeft, Package, TrendingUp, Truck, Box } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { formatStatus, formatDisplayDate } from "@/lib/utils";
import {
  type OMDispatchOrder,
  type OMDispatchOrderItem,
  getDispatchStatusVisuals,
} from "@/types/order-management";

export default function OMDispatchDetail() {
  const params = useParams();
  const id = params.id as string;
  const [dispatch, setDispatch] = useState<OMDispatchOrder | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchDispatch = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/admin/om/dispatch-orders/${id}`);
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setDispatch(data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load dispatch details");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchDispatch();
  }, [id]);

  if (isLoading) {
    return (
      <Layout isClient={false}>
        <div className="space-y-6">
          {/* Header Skeleton */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Skeleton className="h-9 w-20" />
              <div className="space-y-2">
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-4 w-24" />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Skeleton className="h-9 w-28" />
              <Skeleton className="h-7 w-24 rounded-full" />
            </div>
          </div>

          {/* Summary Cards Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => (
              <Card key={i}>
                <CardHeader className="pb-2">
                  <Skeleton className="h-4 w-28" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-8 w-16 mb-1" />
                  <Skeleton className="h-3 w-32" />
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Details Skeleton */}
          <Card>
            <CardHeader className="pb-0">
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="space-y-2">
                    <Skeleton className="h-3 w-20" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Items Table Skeleton */}
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-7 gap-4 py-2 border-b">
                  {[...Array(7)].map((_, i) => (
                    <Skeleton key={i} className="h-4 w-full" />
                  ))}
                </div>
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="grid grid-cols-7 gap-4 py-4 border-b">
                    {[...Array(7)].map((_, j) => (
                      <Skeleton key={j} className="h-4 w-full" />
                    ))}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  if (!dispatch) {
    return (
      <Layout isClient={false}>
        <div className="text-center py-12">
          <h3 className="text-lg font-semibold mb-2">Dispatch Not Found</h3>
          <p className="text-muted-foreground mb-4">
            The dispatch you&apos;re looking for doesn&apos;t exist.
          </p>
          <Link href="/admin/order-management/dispatches">
            <Button>Back to Dispatches</Button>
          </Link>
        </div>
      </Layout>
    );
  }

  const po = dispatch.purchaseOrder;

  const getStatusColor = (status: string) => {
    return getDispatchStatusVisuals(status).color;
  };

  const getStatusLabel = (status: string) => {
    return getDispatchStatusVisuals(status).label;
  };

  const totalQty =
    dispatch.items?.reduce(
      (sum: number, i: OMDispatchOrderItem) => sum + i.quantity,
      0,
    ) || 0;
  const grandTotal =
    dispatch.items?.reduce(
      (sum: number, i: OMDispatchOrderItem) => sum + i.totalAmount,
      0,
    ) || 0;
  const subtotal =
    dispatch.items?.reduce(
      (sum: number, i: OMDispatchOrderItem) => sum + i.amount,
      0,
    ) || 0;
  const totalGst =
    dispatch.items?.reduce(
      (sum: number, i: OMDispatchOrderItem) => sum + i.gstAmount,
      0,
    ) || 0;

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
                PO: {po?.poNumber || "N/A"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href={`/admin/order-management/dispatches/${dispatch.id}/edit`}
            >
              <Button size="sm" variant="outline">
                Edit Dispatch
              </Button>
            </Link>
            <Badge
              className={`text-sm px-3 py-1 ${getStatusColor(dispatch.status)}`}
            >
              {getStatusLabel(dispatch.status)}
            </Badge>
          </div>
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
              <div className="text-2xl font-bold">{totalQty}</div>
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
                ₹{grandTotal.toLocaleString("en-IN")}
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
                {dispatch.logisticsPartner?.name || "Custom/Direct"}
              </div>
              <p className="text-xs text-muted-foreground font-mono">
                {dispatch.docketNumber || "N/A"}
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
            <div className="grid grid-cols-3 md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Client</p>
                <p className="font-medium">{po?.client?.name || "Unknown"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Invoice Date</p>
                <p className="font-medium">
                  {formatDisplayDate(dispatch.invoiceDate)}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Delivery Location</p>
                <p className="font-medium">
                  {dispatch.deliveryLocation?.name || "N/A"}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">
                  Expected Delivery
                </p>
                <p className="font-medium">{formatDisplayDate(dispatch.expectedDeliveryDate)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Tracking Number</p>
                <p className="font-mono text-sm">
                  {dispatch.docketNumber || "N/A"}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Dispatch Date</p>
                <p className="font-medium">
                  {formatDisplayDate(dispatch.dispatchDate)}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Delivery Date</p>
                <p className="font-medium">
                  {formatDisplayDate(dispatch.deliveryDate)}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Created At</p>
                <p className="font-medium">
                  {formatDisplayDate(dispatch.createdAt, true)}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Status</p>
                <Badge className={getStatusColor(dispatch.status)}>
                  {getStatusLabel(dispatch.status)}
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
                  <p className="font-medium">{po.estimateNumber || "N/A"}</p>
                  <p className="text-sm text-muted-foreground">
                    PO: {po.poNumber}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Delivery: {dispatch.deliveryLocation?.name || po.deliveryLocations?.map((l:any) => l.name).join(", ") || "Self-Pickup"}
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
                {(dispatch.items || []).map((item: OMDispatchOrderItem) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">
                      {item.purchaseOrderItem?.product?.name || "Custom Item"}
                    </TableCell>
                    <TableCell className="text-right">
                      {item.quantity}
                    </TableCell>
                    <TableCell className="text-right">
                      ₹{item.rate.toLocaleString("en-IN")}
                    </TableCell>
                    <TableCell className="text-right">
                      ₹{item.amount.toLocaleString("en-IN")}
                    </TableCell>
                    <TableCell className="text-right">
                      {item.gstPercentage}%
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
                  ₹{subtotal.toLocaleString("en-IN")}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total GST:</span>
                <span className="font-medium">
                  ₹{totalGst.toLocaleString("en-IN")}
                </span>
              </div>
              <div className="flex justify-between pt-2 border-t">
                <span className="font-semibold">Grand Total:</span>
                <span className="font-semibold text-lg">
                  ₹{grandTotal.toLocaleString("en-IN")}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Shipment / Packing Details */}
        {dispatch.shipmentBoxes && dispatch.shipmentBoxes.length > 0 && (
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Box className="h-5 w-5" />
                <CardTitle>Shipment / Packing Details</CardTitle>
              </div>
              <p className="text-xs text-muted-foreground my-1">
                Detailed packing information for this dispatch
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Packing Summary */}
              <Alert>
                <Package className="h-4 w-4" />
                <AlertDescription>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-10">
                    <div>
                      <p className="text-sm font-medium">Total Boxes</p>
                      <p className="text-2xl font-bold">
                        {dispatch.shipmentBoxes.reduce((sum, box) => sum + box.numberOfBoxes, 0)}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm font-medium">Box Types</p>
                      <p className="text-2xl font-bold">
                        {dispatch.shipmentBoxes.length}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm font-medium">Total Volume</p>
                      <p className="text-2xl font-bold">
                        {dispatch.shipmentBoxes.reduce((sum, box) => {
                          const volumePerBox = (box.length * box.width * box.height) / 1000000;
                          return sum + volumePerBox * box.numberOfBoxes;
                        }, 0).toFixed(3)} m³
                      </p>
                    </div>

                    <div>
                      <p className="text-sm font-medium">Total Weight</p>
                      <p className="text-2xl font-bold">
                        {dispatch.shipmentBoxes
                          .reduce((sum, box) => sum + (box.weight || 0) * box.numberOfBoxes, 0)
                          .toFixed(2)} kg
                      </p>
                    </div>

                    <div>
                      <p className="text-sm font-medium">Items Packed</p>
                      <p className="text-2xl font-bold">{totalQty}</p>
                    </div>
                  </div>
                </AlertDescription>
              </Alert>

              {/* Individual Box Details */}
              <div className="space-y-4">
                {dispatch.shipmentBoxes.map((box) => {
                  const volumePerBox = (box.length * box.width * box.height) / 1000000;
                  const totalVolume = volumePerBox * box.numberOfBoxes;
                  
                  return (
                    <Card key={box.boxId} className="border-2">
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <CardTitle className="text-base">Box {box.boxNumber}</CardTitle>
                            {box.numberOfBoxes > 1 && (
                              <p className="text-sm text-muted-foreground mt-1">
                                {box.numberOfBoxes} identical boxes
                              </p>
                            )}
                          </div>
                          <Badge variant="outline">
                            {box.length} × {box.width} × {box.height} cm
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {/* Dimensions */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 p-3 bg-muted/50 rounded-lg">
                          <div>
                            <p className="text-xs text-muted-foreground">Length</p>
                            <p className="font-medium">{box.length} cm</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">Width</p>
                            <p className="font-medium">{box.width} cm</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">Height</p>
                            <p className="font-medium">{box.height} cm</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">Weight</p>
                            <p className="font-medium">{box.weight || 0} kg</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">Volume</p>
                            <p className="font-medium">{volumePerBox.toFixed(4)} m³</p>
                            {box.numberOfBoxes > 1 && (
                              <p className="text-xs text-muted-foreground mt-1">
                                Total Vol: {totalVolume.toFixed(4)} m³
                                <br />
                                Total Wt: {((box.weight || 0) * box.numberOfBoxes).toFixed(2)} kg
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Contents */}
                        <div>
                          <p className="text-sm font-medium mb-2">Contents (per box):</p>
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Item Name</TableHead>
                                <TableHead className="text-right">Quantity per Box</TableHead>
                                {box.numberOfBoxes > 1 && (
                                  <TableHead className="text-right">Total Quantity</TableHead>
                                )}
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {box.contents.map((content, index) => (
                                <TableRow key={index}>
                                  <TableCell className="font-medium">{content.itemName}</TableCell>
                                  <TableCell className="text-right">{content.quantity}</TableCell>
                                  {box.numberOfBoxes > 1 && (
                                    <TableCell className="text-right font-medium">
                                      {content.quantity * box.numberOfBoxes}
                                    </TableCell>
                                  )}
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              {/* Instructions for Client */}
              <Alert>
                <AlertDescription>
                  <p className="text-sm font-medium mb-2">📦 For Client Reference:</p>
                  <ul className="text-sm space-y-1 list-disc list-inside">
                    <li>Total shipment consists of {dispatch.shipmentBoxes.reduce((sum, box) => sum + box.numberOfBoxes, 0)} box(es)</li>
                    <li>Please verify contents of each box upon delivery</li>
                    <li>Box dimensions provided for storage planning</li>
                  </ul>
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
}
