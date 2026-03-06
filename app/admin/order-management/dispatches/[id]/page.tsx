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
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { formatStatus } from "@/lib/utils";
import type {
  OMDispatchOrder,
  OMDispatchOrderItem,
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
        <div className="flex h-[50vh] items-center justify-center">
          <p className="text-muted-foreground">Loading dispatch details...</p>
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
    switch (status) {
      case "CREATED":
        return "bg-blue-100 text-blue-800 hover:bg-blue-100 border-transparent";
      case "DISPATCHED":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100 border-transparent";
      case "DELIVERED":
        return "bg-green-100 text-green-800 hover:bg-green-100 border-transparent";
      case "CANCELLED":
        return "bg-red-100 text-red-800 hover:bg-red-100 border-transparent";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100 border-transparent";
    }
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
              {formatStatus(dispatch.status)}
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
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Client</p>
                <p className="font-medium">{po?.client?.name || "Unknown"}</p>
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
                  {dispatch.expectedDeliveryDate
                    ? new Date(
                        dispatch.expectedDeliveryDate,
                      ).toLocaleDateString("en-IN")
                    : "N/A"}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Tracking Number</p>
                <p className="font-mono text-sm">
                  {dispatch.docketNumber || "N/A"}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Created At</p>
                <p className="font-medium">
                  {dispatch.createdAt
                    ? new Date(dispatch.createdAt).toLocaleString("en-IN")
                    : "N/A"}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Status</p>
                <Badge className={getStatusColor(dispatch.status)}>
                  {formatStatus(dispatch.status)}
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
                    Location: {po.deliveryLocation?.name || "Self-Pickup"}
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
      </div>
    </Layout>
  );
}
