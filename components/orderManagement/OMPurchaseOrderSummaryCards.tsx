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
  const totalValue = po.grandTotal || 0;
  const dispatchedValue =
    po.dispatchOrders?.reduce((sum: number, d) => {
      return (
        sum +
        (d.items?.reduce((s: number, i) => s + (i.totalAmount || 0), 0) || 0)
      );
    }, 0) || 0;

  const remainingValue = totalValue - dispatchedValue;

  const fulfillmentPercent =
    totalValue > 0 ? ((dispatchedValue / totalValue) * 100).toFixed(1) : "0";

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Value</CardTitle>
          <Package className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            ₹
            {totalValue.toLocaleString("en-IN", {
              minimumFractionDigits: 2,
            })}
          </div>
          <p className="text-xs text-muted-foreground">Order total value</p>
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
          <div className="text-2xl font-bold">
            ₹
            {dispatchedValue.toLocaleString("en-IN", {
              minimumFractionDigits: 2,
            })}
          </div>
          <p className="text-xs text-muted-foreground">Value dispatched</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Remaining</CardTitle>
          <AlertCircle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            ₹
            {remainingValue.toLocaleString("en-IN", {
              minimumFractionDigits: 2,
            })}
          </div>
          <p className="text-xs text-muted-foreground">Value pending</p>
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
