"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import Layout from "@/components/layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Edit, Plus } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { formatStatus } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { OMPurchaseOrderSummaryCards } from "@/components/orderManagement/OMPurchaseOrderSummaryCards";
import { OMPurchaseOrderItemsTable } from "@/components/orderManagement/OMPurchaseOrderItemsTable";
import { OMDispatchHistory } from "@/components/orderManagement/OMDispatchHistory";
import type { OMPurchaseOrder } from "@/types/order-management";
import { useOMPurchaseOrder } from "@/data/om/admin.hooks";

export default function OMPurchaseOrderDetail() {
  const params = useParams();
  const id = params.id as string;
  const { purchaseOrder: po, isLoading, mutate } = useOMPurchaseOrder(id);

  const fetchPO = async () => {
    mutate();
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
          {/* Header Skeleton */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Skeleton className="h-10 w-10 rounded-md" />
              <div className="space-y-2">
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-4 w-24" />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Skeleton className="h-10 w-32" />
              <Skeleton className="h-10 w-24" />
            </div>
          </div>

          {/* Summary Cards Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <Card key={i}>
                <CardHeader className="pb-2">
                  <Skeleton className="h-4 w-24" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-8 w-16 mb-2" />
                  <Skeleton className="h-3 w-32" />
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Details & Info Skeletons */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <Skeleton className="h-5 w-32" />
              </CardHeader>
              <CardContent className="space-y-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="space-y-1">
                    <Skeleton className="h-3 w-24" />
                    <Skeleton className="h-4 w-40" />
                  </div>
                ))}
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <Skeleton className="h-5 w-32" />
              </CardHeader>
              <CardContent className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="space-y-1">
                    <Skeleton className="h-3 w-24" />
                    <Skeleton className="h-4 w-40" />
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Items & History Skeletons */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-48" />
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="grid grid-cols-6 gap-4 py-2 border-b">
                    {[...Array(6)].map((_, i) => (
                      <Skeleton key={i} className="h-4 w-full" />
                    ))}
                  </div>
                  {[...Array(3)].map((_, i) => (
                    <div
                      key={i}
                      className="grid grid-cols-6 gap-4 py-4 border-b"
                    >
                      {[...Array(6)].map((_, j) => (
                        <Skeleton key={j} className="h-4 w-full" />
                      ))}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-40" />
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[...Array(2)].map((_, i) => (
                    <Skeleton key={i} className="h-12 w-full" />
                  ))}
                </div>
              </CardContent>
            </Card>
        </div>
      </div>
    );
  }

  if (!po) {
    return (
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
    );
  }

  return (
    <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link href="/admin/order-management/purchase-orders">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-semibold">
                  PO: {po.poNumber || po.estimateNumber}
                </h1>
                <Badge
                  className={
                    po.status === "DRAFT"
                      ? "bg-gray-100 text-gray-800 hover:bg-gray-100 border-transparent"
                      : po.status === "CONFIRMED"
                        ? "bg-blue-100 text-blue-800 hover:bg-blue-100 border-transparent"
                        : po.status === "PARTIALLY_DISPATCHED"
                          ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-100 border-transparent"
                          : po.status === "FULLY_DISPATCHED"
                            ? "bg-green-100 text-green-800 hover:bg-green-100 border-transparent"
                            : po.status === "CLOSED"
                              ? "bg-red-100 text-red-800 hover:bg-red-100 border-transparent"
                              : "bg-gray-100 text-gray-800 hover:bg-gray-100 border-transparent"
                  }
                >
                  {formatStatus(po.status)}
                </Badge>
              </div>
              <p className="text-muted-foreground">
                {po.client?.name} |{" "}
                {po.createdAt
                  ? new Date(po.createdAt).toLocaleDateString()
                  : "N/A"}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Link href={`/admin/order-management/purchase-orders/${id}/edit`}>
              <Button variant="outline">
                <Edit className="h-4 w-4 mr-2" />
                Edit PO
              </Button>
            </Link>
            <Link href={`/admin/order-management/dispatches/create?poId=${id}`}>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Dispatch Items
              </Button>
            </Link>
          </div>
        </div>

        <OMPurchaseOrderSummaryCards po={po} />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Reference Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">
                    Estimate Number
                  </p>
                  <p className="font-medium">{po.estimateNumber || "N/A"}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Estimate Date</p>
                  <p className="font-medium">
                    {po.estimateDate
                      ? new Date(po.estimateDate).toLocaleDateString()
                      : "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    PO Received Date
                  </p>
                  <p className="font-medium">
                    {po.poReceivedDate
                      ? new Date(po.poReceivedDate).toLocaleDateString()
                      : "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    Delivery Locations
                  </p>
                  <p className="font-medium">
                    {po.deliveryLocations && po.deliveryLocations.length > 0
                      ? po.deliveryLocations.map((loc: any) => loc.name).join(", ")
                      : "N/A"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Client Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">
                    Contact Person
                  </p>
                  <p className="font-medium">
                    {po.client?.contactPerson || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">{po.client?.email || "N/A"}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Phone</p>
                  <p className="font-medium">{po.client?.phone || "N/A"}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Ordered Items</CardTitle>
            </CardHeader>
            <CardContent>
              <OMPurchaseOrderItemsTable
                poId={id}
                items={po.items || []}
                dispatches={po.dispatchOrders || []}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Dispatch History</CardTitle>
            </CardHeader>
            <CardContent>
              <OMDispatchHistory 
                dispatches={po.dispatchOrders || []} 
                poItems={po.items || []}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }
