"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShoppingCart, TrendingUp, CheckCircle, Package, Truck, AlertCircle } from "lucide-react";

interface SummaryCardsProps {
  inProgressCount: number;
  fulfilledCount: number;
  closedCount: number;
  inProgressValue: number;
  fulfillmentValue: number;
  overallFulfillment: string;
}

export function SummaryCards({
  inProgressCount,
  fulfilledCount,
  closedCount,
  inProgressValue,
  fulfillmentValue,
  overallFulfillment,
}: SummaryCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {/* 1. In Progress POs */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">In Progress</CardTitle>
          <ShoppingCart className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{inProgressCount}</div>
          <p className="text-xs text-muted-foreground">Confirmed & Partially Dispatched</p>
        </CardContent>
      </Card>

      {/* 2. Fulfilled POs */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Fulfilled</CardTitle>
          <CheckCircle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{fulfilledCount}</div>
          <p className="text-xs text-muted-foreground">Fully Dispatched</p>
        </CardContent>
      </Card>

      {/* 3. Closed POs */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Closed POs</CardTitle>
          <AlertCircle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{closedCount}</div>
          <p className="text-xs text-muted-foreground">Completed Purchase Orders</p>
        </CardContent>
      </Card>

      {/* 4. In Progress Value */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">In Progress Value</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">₹{inProgressValue.toLocaleString("en-IN")}</div>
          <p className="text-xs text-muted-foreground">Value of active orders</p>
        </CardContent>
      </Card>

      {/* 5. Fulfillment Value */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Fulfillment Value</CardTitle>
          <Package className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">₹{fulfillmentValue.toLocaleString("en-IN")}</div>
          <p className="text-xs text-muted-foreground">Value of fulfilled orders</p>
        </CardContent>
      </Card>

      {/* 6. Overall Fulfillment */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Overall Fulfillment</CardTitle>
          <Truck className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{overallFulfillment}%</div>
          <p className="text-xs text-muted-foreground">Net order completion rate</p>
        </CardContent>
      </Card>
    </div>
  );
}
