"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShoppingCart, TrendingUp, CheckCircle, Package, Truck, AlertCircle } from "lucide-react";

interface SummaryCardsProps {
  totalActivePOs: number;
  totalOrderValue: number;
  overallFulfillment: string;
  totalOrderedQty: number;
  totalDispatchedQty: number;
  totalRemainingQty: number;
}

export function SummaryCards({
  totalActivePOs,
  totalOrderValue,
  overallFulfillment,
  totalOrderedQty,
  totalDispatchedQty,
  totalRemainingQty,
}: SummaryCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Active POs</CardTitle>
          <ShoppingCart className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalActivePOs}</div>
          <p className="text-xs text-muted-foreground">Purchase orders in progress</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Order Value</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">₹{totalOrderValue.toLocaleString("en-IN")}</div>
          <p className="text-xs text-muted-foreground">Grand total of all orders</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Overall Fulfillment</CardTitle>
          <CheckCircle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{overallFulfillment}%</div>
          <p className="text-xs text-muted-foreground">Order completion rate</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Ordered Quantity</CardTitle>
          <Package className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalOrderedQty}</div>
          <p className="text-xs text-muted-foreground">Total items ordered</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Dispatched</CardTitle>
          <Truck className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalDispatchedQty}</div>
          <p className="text-xs text-muted-foreground">Items dispatched</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Remaining</CardTitle>
          <AlertCircle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalRemainingQty}</div>
          <p className="text-xs text-muted-foreground">Items pending dispatch</p>
        </CardContent>
      </Card>
    </div>
  );
}
