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
import {
  ArrowLeft,
  Edit,
  Plus,
  Package,
  TrendingUp,
  AlertCircle,
} from "lucide-react";
import {
  omPurchaseOrders,
  getDispatchesForPO,
  getDispatchedQuantity,
  getRemainingQuantity,
  getTotalDispatchedForPO,
  OMPurchaseOrder,
} from "../../_mock/omMockData";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function OMPurchaseOrderDetail() {
  const params = useParams();
  const id = params.id as string;
  const po = omPurchaseOrders.find((p) => p.id === id);

  if (!po) {
    return (
      <Layout isClient={false}>
        <div className="text-center py-12">
          <h3 className="text-lg font-semibold mb-2">
            Purchase Order Not Found
          </h3>
          <p className="text-muted-foreground mb-4">
            The purchase order you're looking for doesn't exist.
          </p>
          <Link href="/admin/order-management/purchase-orders">
            <Button>Back to Purchase Orders</Button>
          </Link>
        </div>
      </Layout>
    );
  }

  const dispatches = getDispatchesForPO(po.id);
  const totalDispatched = getTotalDispatchedForPO(po.id);
  const totalRemaining = po.totalQuantity - totalDispatched;
  const fulfillmentPercent =
    po.totalQuantity > 0
      ? ((totalDispatched / po.totalQuantity) * 100).toFixed(1)
      : "0";

  const getStatusVariant = (status: OMPurchaseOrder["status"]) => {
    switch (status) {
      case "Draft":
        return "secondary";
      case "Confirmed":
        return "default";
      case "Partially Dispatched":
        return "outline";
      case "Fully Dispatched":
        return "default";
      case "Closed":
        return "secondary";
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
            <Link href="/admin/order-management/purchase-orders">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            </Link>
            <div>
              <h3 className="text-lg font-semibold">{po.estimateNumber}</h3>
              <p className="text-sm text-muted-foreground">PO: {po.poNumber}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href={`/admin/order-management/dispatches/create?poId=${po.id}`}
            >
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create Dispatch
              </Button>
            </Link>
            <Link
              href={`/admin/order-management/purchase-orders/${po.id}/edit`}
            >
              <Button variant="outline">
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
            </Link>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Ordered
              </CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{po.totalQuantity}</div>
              <p className="text-xs text-muted-foreground">Items ordered</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Dispatched
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalDispatched}</div>
              <p className="text-xs text-muted-foreground">Items dispatched</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Remaining</CardTitle>
              <AlertCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalRemaining}</div>
              <p className="text-xs text-muted-foreground">Items pending</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Fulfillment</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{fulfillmentPercent}%</div>
              <p className="text-xs text-muted-foreground">Order completion</p>
            </CardContent>
          </Card>
        </div>

        {/* PO Details */}
        <Card>
          <CardHeader>
            <CardTitle>Purchase Order Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Client</p>
                <p className="font-medium">{po.clientName}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">
                  Delivery Location
                </p>
                <p className="font-medium">{po.deliveryLocation}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Status</p>
                <Badge variant={getStatusVariant(po.status)}>{po.status}</Badge>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Estimate Date</p>
                <p className="font-medium">
                  {new Date(po.estimateDate).toLocaleDateString("en-IN")}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">PO Date</p>
                <p className="font-medium">
                  {new Date(po.poDate).toLocaleDateString("en-IN")}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">
                  PO Received Date
                </p>
                <p className="font-medium">
                  {new Date(po.poReceivedDate).toLocaleDateString("en-IN")}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Item Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Item Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item Name</TableHead>
                  <TableHead className="text-right">Ordered Qty</TableHead>
                  <TableHead className="text-right">Dispatched Qty</TableHead>
                  <TableHead className="text-right">Remaining Qty</TableHead>
                  <TableHead className="text-right">Rate</TableHead>
                  <TableHead className="text-right">GST %</TableHead>
                  <TableHead className="text-right">Total Value</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {po.lineItems.map((item) => {
                  const dispatched = getDispatchedQuantity(po.id, item.id);
                  const remaining = item.quantity - dispatched;

                  return (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">
                        {item.itemName}
                      </TableCell>
                      <TableCell className="text-right">
                        {item.quantity}
                      </TableCell>
                      <TableCell className="text-right">{dispatched}</TableCell>
                      <TableCell className="text-right">
                        <span
                          className={
                            remaining > 0
                              ? "text-orange-600 font-medium"
                              : "text-green-600"
                          }
                        >
                          {remaining}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        ₹{item.rate.toLocaleString("en-IN")}
                      </TableCell>
                      <TableCell className="text-right">
                        {item.gstPercent}%
                      </TableCell>
                      <TableCell className="text-right">
                        ₹{item.totalAmount.toLocaleString("en-IN")}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>

            <Separator className="my-4" />

            <div className="space-y-2 max-w-md ml-auto">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal:</span>
                <span className="font-medium">
                  ₹{po.subtotal.toLocaleString("en-IN")}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total GST:</span>
                <span className="font-medium">
                  ₹{po.totalGst.toLocaleString("en-IN")}
                </span>
              </div>
              <div className="flex justify-between pt-2 border-t">
                <span className="font-semibold">Grand Total:</span>
                <span className="font-semibold text-lg">
                  ₹{po.grandTotal.toLocaleString("en-IN")}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Dispatch History */}
        <Card>
          <CardHeader>
            <CardTitle>Dispatch History ({dispatches.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {dispatches.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No dispatches yet for this purchase order
              </div>
            ) : (
              <Accordion type="single" collapsible className="w-full">
                {dispatches.map((dispatch, index) => (
                  <AccordionItem key={dispatch.id} value={dispatch.id}>
                    <AccordionTrigger>
                      <div className="flex items-center justify-between w-full pr-4">
                        <div className="flex items-center gap-4">
                          <div>
                            <p className="font-medium">
                              {dispatch.invoiceNumber}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {new Date(
                                dispatch.invoiceDate,
                              ).toLocaleDateString("en-IN")}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-6">
                          <div>
                            <p className="text-sm text-muted-foreground">Qty</p>
                            <p className="font-medium">
                              {dispatch.totalDispatchQty}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">
                              Value
                            </p>
                            <p className="font-medium">
                              ₹{dispatch.grandTotal.toLocaleString("en-IN")}
                            </p>
                          </div>
                          <Badge>{dispatch.status}</Badge>
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="pt-4 space-y-4">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <p className="text-muted-foreground">
                              Logistics Partner
                            </p>
                            <p className="font-medium">
                              {dispatch.logisticsPartnerName}
                            </p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">
                              Tracking Number
                            </p>
                            <p className="font-medium">
                              {dispatch.trackingNumber}
                            </p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">
                              Expected Delivery
                            </p>
                            <p className="font-medium">
                              {new Date(
                                dispatch.expectedDeliveryDate,
                              ).toLocaleDateString("en-IN")}
                            </p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Status</p>
                            <Badge>{dispatch.status}</Badge>
                          </div>
                        </div>

                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Item</TableHead>
                              <TableHead className="text-right">
                                Dispatched Qty
                              </TableHead>
                              <TableHead className="text-right">Rate</TableHead>
                              <TableHead className="text-right">
                                Total
                              </TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {dispatch.lineItems.map((item) => (
                              <TableRow key={item.id}>
                                <TableCell>{item.itemName}</TableCell>
                                <TableCell className="text-right">
                                  {item.dispatchQty}
                                </TableCell>
                                <TableCell className="text-right">
                                  ₹{item.rate.toLocaleString("en-IN")}
                                </TableCell>
                                <TableCell className="text-right">
                                  ₹{item.totalAmount.toLocaleString("en-IN")}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>

                        <div className="flex justify-end">
                          <Link
                            href={`/admin/order-management/dispatches/${dispatch.id}`}
                          >
                            <Button variant="outline" size="sm">
                              View Full Details
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
