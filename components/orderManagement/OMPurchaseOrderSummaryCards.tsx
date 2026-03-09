"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, TrendingUp, AlertCircle, CheckCircle2 } from "lucide-react";
import { OMPurchaseOrder, OMPurchaseOrderItem } from "@/types/order-management";

interface OMPurchaseOrderSummaryCardsProps {
  po: OMPurchaseOrder;
}

export function OMPurchaseOrderSummaryCards({
  po,
}: OMPurchaseOrderSummaryCardsProps) {
  const totalQuantity =
    po.items?.reduce(
      (sum: number, i: OMPurchaseOrderItem) => sum + (i.quantity || 0),
      0,
    ) || 0;

  const totalDispatched =
    po.dispatchOrders?.reduce((sum: number, d) => {
      return (
        sum +
        (d.items?.reduce((s: number, i) => s + Number(i.quantity || 0), 0) || 0)
      );
    }, 0) || 0;

  const totalRemaining = totalQuantity - totalDispatched;
  const fulfillmentPercent =
    totalQuantity > 0
      ? ((totalDispatched / totalQuantity) * 100).toFixed(1)
      : "0";

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Ordered</CardTitle>
          <Package className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalQuantity}</div>
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
  );
}
