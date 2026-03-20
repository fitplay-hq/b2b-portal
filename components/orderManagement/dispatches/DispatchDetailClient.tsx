"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
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
import { formatDisplayDate } from "@/lib/utils";
import {
  type OMDispatchOrder,
  type OMDispatchOrderItem,
  getDispatchStatusVisuals,
} from "@/types/order-management";
import { useOMDispatch } from "@/data/om/admin.hooks";

interface DispatchDetailClientProps {
  initialData?: OMDispatchOrder;
}

export default function DispatchDetailClient({ initialData }: DispatchDetailClientProps) {
  const params = useParams();
  const id = params.id as string;
  
  // Use SWR for background updates and manual mutations
  const { dispatch: swrData, isLoading, mutate } = useOMDispatch(id, {
    ...(initialData ? { fallbackData: initialData } : {})
  });

  // Use the best available data source: SWR > initialData
  const dispatch = swrData || initialData || null;

  if (!dispatch && isLoading) {
    return (
      <div className="space-y-6">
          <Skeleton className="h-10 w-full" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
          <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!dispatch) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-semibold mb-2">Dispatch Not Found</h3>
        <p className="text-muted-foreground mb-4">
          The dispatch you're looking for doesn't exist.
        </p>
        <Link href="/admin/order-management/dispatches">
          <Button>Back to Dispatches</Button>
        </Link>
      </div>
    );
  }

  const po = dispatch.purchaseOrder;

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
              <h1 className="text-2xl font-bold">
                {dispatch.invoiceNumber}
              </h1>
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
              className={`text-sm px-3 py-1 ${getDispatchStatusVisuals(dispatch.status).color}`}
            >
              {getDispatchStatusVisuals(dispatch.status).label}
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
                <p className="text-sm text-muted-foreground">
                  Delivery Location
                </p>
                <p className="font-medium">
                  {dispatch.deliveryLocation?.name || "N/A"}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">
                  Expected Delivery
                </p>
                <p className="font-medium">
                  {formatDisplayDate(dispatch.expectedDeliveryDate)}
                </p>
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
                <Badge className={getDispatchStatusVisuals(dispatch.status).color}>
                  {getDispatchStatusVisuals(dispatch.status).label}
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
                  <p>PO: {po.poNumber}</p>
                  <p className="text-sm text-muted-foreground">
                    PO Date: {po.poDate ? formatDisplayDate(po.poDate) : "N/A"}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Delivery:{" "}
                    {dispatch.deliveryLocation?.name ||
                      po.deliveryLocations
                        ?.map((l: any) => l.name)
                        .join(", ") ||
                      "Self-Pickup"}
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
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert>
                <Package className="h-4 w-4" />
                <AlertDescription>
                  <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-4">
                    <div>
                      <p className="text-sm font-medium">Total Boxes</p>
                      <p className="text-xl font-bold">
                        {dispatch.shipmentBoxes.reduce(
                          (sum, box) => sum + box.numberOfBoxes,
                          0,
                        )}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Box Types</p>
                      <p className="text-xl font-bold">
                        {dispatch.shipmentBoxes.length}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Packed Qty</p>
                      <p className="text-xl font-bold">{totalQty}</p>
                    </div>
                  </div>
                </AlertDescription>
              </Alert>

              <div className="space-y-4">
                {dispatch.shipmentBoxes.map((box) => (
                  <Card key={box.boxId} className="border">
                    <CardHeader className="py-3 bg-muted/30">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-sm font-medium">
                          Box {box.boxNumber} {box.numberOfBoxes > 1 && `(${box.numberOfBoxes} identical boxes)`}
                        </CardTitle>
                        <Badge variant="secondary">
                          {box.length}x{box.width}x{box.height} cm | {box.weight} kg
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="py-4">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Item Name</TableHead>
                            <TableHead className="text-right">Qty per Box</TableHead>
                            {box.numberOfBoxes > 1 && <TableHead className="text-right">Total Qty</TableHead>}
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {box.contents.map((content, idx) => (
                            <TableRow key={idx}>
                              <TableCell>{content.itemName}</TableCell>
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
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
    </div>
  );
}
