"use client";

import React from "react";
import { useOrder, useUpdateOrderStatus } from "@/data/order/admin.hooks";
import { useParams } from "next/navigation";
import Layout from "@/components/layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, ArrowLeft, ExternalLink, Package } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { $Enums } from "@/lib/generated/prisma";
import { formatStatus } from "@/lib/utils";

const OrderDetailsPage = () => {
  const params = useParams();
  const id = params.id as string;
  const [selectedStatus, setSelectedStatus] = useState<string>("");

  const { order, error, isLoading } = useOrder(id);
  const { updateOrderStatus, isUpdating } = useUpdateOrderStatus();

  const handleStatusUpdate = async () => {
    if (!order || !selectedStatus) return;

    try {
      await updateOrderStatus({
        orderId: id,
        status: selectedStatus as $Enums.Status,
      });
      setSelectedStatus("");
    } catch (error) {
      console.error("Failed to update order status:", error);
    }
  };

  if (error) {
    return (
      <Layout isClient={false}>
        <div className="text-center text-destructive">
          Failed to load order details. Please try again later.
        </div>
      </Layout>
    );
  }

  if (isLoading || !order) {
    return (
      <Layout isClient={false}>
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout isClient={false}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-4 mb-2">
              <Link href="/admin/orders">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Orders
                </Button>
              </Link>
            </div>
            <h1 className="text-2xl font-bold">Order Details</h1>
            <p className="text-muted-foreground">
              Review and manage order #{order.id}
            </p>
          </div>
          <Link href={`/admin/orders/${order.id}/approve`}>
            <Button variant="outline">
              <ExternalLink className="h-4 w-4 mr-2" />
              Go to Approval Page
            </Button>
          </Link>
        </div>
        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle>Order #{order.id}</CardTitle>
                <p className="text-sm text-muted-foreground">
                  {new Date(order.createdAt).toLocaleDateString('en-GB')}
                </p>
              </div>
              <Badge>{formatStatus(order.status)}</Badge>
            </div>
          </CardHeader>
          <CardContent className="grid gap-6">
            <div>
              <h3 className="font-semibold mb-2">Order Summary</h3>
              <p>
                <strong>Order ID:</strong> {order.id}
              </p>
              <p>
                <strong>Status:</strong> {formatStatus(order.status)}
              </p>
              <p>
                <strong>Date:</strong>{" "}
                {new Date(order.createdAt).toLocaleDateString('en-GB')}
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Order Items</h3>
              <div className="space-y-2">
                {(() => {
                  // Aggregate products by productId from both orderItems and bundleOrderItems
                  const productMap = new Map<string, { product: any, totalQty: number }>();
                  
                  // Add quantities from regular items
                  order.orderItems?.forEach((item) => {
                    const existing = productMap.get(item.product.id);
                    if (existing) {
                      existing.totalQty += item.quantity;
                    } else {
                      productMap.set(item.product.id, {
                        product: item.product,
                        totalQty: item.quantity
                      });
                    }
                  });
                  
                  // Add quantities from bundle items
                  order.bundleOrderItems?.forEach((item) => {
                    const existing = productMap.get(item.product.id);
                    if (existing) {
                      existing.totalQty += item.quantity;
                    } else {
                      productMap.set(item.product.id, {
                        product: item.product,
                        totalQty: item.quantity
                      });
                    }
                  });
                  
                  return Array.from(productMap.values()).map((data) => (
                    <div key={data.product.id} className="flex items-center">
                      <span className="font-medium">{data.product.name}</span>
                      <span className="text-sm text-muted-foreground ml-2">
                        (Qty: {data.totalQty})
                      </span>
                    </div>
                  ));
                })()}
                {order.bundleOrderItems && order.bundleOrderItems.length > 0 && (() => {
                  // Group bundleOrderItems by bundle
                  const bundleGroups = order.bundleOrderItems.reduce((groups: any, bundleItem) => {
                    const bundleId = bundleItem.bundleId;
                    if (!groups[bundleId]) {
                      groups[bundleId] = {
                        bundle: bundleItem.bundle,
                        items: []
                      };
                    }
                    groups[bundleId].items.push(bundleItem);
                    return groups;
                  }, {});

                  return Object.values(bundleGroups).map((group: any, groupIndex) => (
                    <div key={`bundle-group-${groupIndex}`} className="space-y-2">
                      <div className="flex items-center gap-2 p-2 bg-blue-50 rounded-lg">
                        <Package className="h-4 w-4 text-blue-600" />
                        <span className="font-medium text-blue-900">Bundle {groupIndex + 1}</span>
                        <span className="text-sm text-blue-600 ml-auto">
                          {group.items.length} items • {group.bundle?.numberOfBundles || 1} bundles
                        </span>
                      </div>
                      {/* Bundle Items */}
                      {group.items.map((bundleItem: any, itemIndex: number) => {
                        const bundleCount = group.bundle?.numberOfBundles || 1;
                        const perBundleQty = bundleCount > 0 ? bundleItem.quantity / bundleCount : bundleItem.quantity;
                        return (
                          <div key={`bundle-item-${groupIndex}-${itemIndex}`} className="flex items-center ml-4">
                            <span className="font-medium">{bundleItem.product?.name || 'Bundle Product'}</span>
                            <span className="text-sm text-muted-foreground ml-2">
                              (Qty: {perBundleQty} each)
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  ));
                })()}
              </div>
            </div>
            <div className="border-t pt-4">
              <h3 className="font-semibold mb-2">Delivery Address</h3>
              <div className="space-y-2">
                <p>
                  <strong>Consignee:</strong> {order.consigneeName}
                </p>
                <p>
                  <strong>Phone:</strong> {order.consigneePhone}
                </p>
                <p>
                  <strong>Email:</strong> {order.consigneeEmail}
                </p>
                <p>
                  <strong>Address:</strong> {order.deliveryAddress}
                </p>
                <p>
                  <strong>City:</strong> {order.city}
                </p>
                <p>
                  <strong>State:</strong> {order.state}
                </p>
                <p>
                  <strong>Pincode:</strong> {order.pincode}
                </p>
                <p>
                  <strong>Mode of Delivery:</strong> {order.modeOfDelivery}
                </p>
                {order.deliveryReference && (
                  <p>
                    <strong>Reference:</strong> {order.deliveryReference}
                  </p>
                )}
                {order.packagingInstructions && (
                  <p>
                    <strong>Packaging Instructions:</strong>{" "}
                    {order.packagingInstructions}
                  </p>
                )}
                {order.note && (
                  <p>
                    <strong>Client Note:</strong> {order.note}
                  </p>
                )}
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Update status" />
                </SelectTrigger>
                <SelectContent>
                  {Object.keys($Enums.Status).map((status) => (
                    <SelectItem key={status} value={status}>
                      {formatStatus(status)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                onClick={handleStatusUpdate}
                disabled={!selectedStatus || isUpdating}
                variant="outline"
              >
                {isUpdating ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Updating...
                  </>
                ) : (
                  "Update Status"
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default OrderDetailsPage;
