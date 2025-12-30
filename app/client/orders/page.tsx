"use client";

import { useState, useMemo } from "react";
import Layout from "@/components/layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ImageWithFallback } from "@/components/image";
import {
  Search,
  ChevronDown,
  ChevronUp,
  Calendar,
  Package,
  Grid3x3,
  Table,
} from "lucide-react";
import { useOrders } from "@/data/order/client.hooks";
import { Skeleton } from "@/components/ui/skeleton";
import { $Enums, Order } from "@/lib/generated/prisma";
import { formatStatus } from "@/lib/utils";
import type { OrderWithItems } from "@/data/order/client.actions";
import { ClientOrdersTable } from "./components/orders-table";

export default function ClientOrderHistory() {
  const { orders, isLoading } = useOrders();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [expandedOrders, setExpandedOrders] = useState<Set<string>>(new Set());
  const [viewType, setViewType] = useState<"card" | "table">("card");

  const filteredOrders = useMemo(() => {
    if (!orders) return [];

    let filtered: OrderWithItems[] = orders as OrderWithItems[];

    if (statusFilter !== "all") {
      filtered = filtered.filter((order) => order.status === statusFilter);
    }

    return filtered.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }, [orders, searchTerm, statusFilter]);

  const toggleOrderExpansion = (orderId: string) => {
    const newExpanded = new Set(expandedOrders);
    if (newExpanded.has(orderId)) {
      newExpanded.delete(orderId);
    } else {
      newExpanded.add(orderId);
    }
    setExpandedOrders(newExpanded);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
      case "APPROVED":
        return "bg-blue-100 text-blue-800 border-blue-300";
      case "IN_PROGRESS":
        return "bg-purple-100 text-purple-800 border-purple-300";
      case "COMPLETED":
        return "bg-green-100 text-green-800 border-green-300";
      case "CANCELLED":
      case "REJECTED":
        return "bg-red-100 text-red-800 border-red-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  const getStatusDescription = (status: string) => {
    switch (status) {
      case "PENDING":
        return "Awaiting approval from Fitplay team";
      case "APPROVED":
        return "Order approved, preparing for shipment";
      case "IN_PROGRESS":
        return "Order is being processed and shipped";
      case "COMPLETED":
        return "Order has been delivered";
      case "CANCELLED":
        return "Order was cancelled";
      case "REJECTED":
        return "Order was rejected";
      default:
        return "";
    }
  };

  const stats = useMemo(() => {
    if (!orders) {
      return {
        totalOrders: 0,
        pendingOrders: 0,
      };
    }
    const typedOrders = orders as OrderWithItems[];
    const totalOrders = typedOrders.length;
    const pendingOrders = typedOrders.filter(
      (o) => o.status === "PENDING"
    ).length;

    return { totalOrders, pendingOrders };
  }, [orders]);

  if (isLoading) {
    return (
      <Layout title="Order History" isClient>
        <div className="space-y-4 sm:space-y-6 px-2 sm:px-0">
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
            <Skeleton className="h-20 sm:h-24" />
            <Skeleton className="h-20 sm:h-24" />
            <Skeleton className="h-20 sm:h-24" />
          </div>
          <Skeleton className="h-16 sm:h-20" />
          <div className="space-y-3 sm:space-y-4">
            <Skeleton className="h-24 sm:h-32" />
            <Skeleton className="h-24 sm:h-32" />
            <Skeleton className="h-24 sm:h-32" />
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Order History" isClient>
      <div className="space-y-4 sm:space-y-6 px-2 sm:px-0">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-2 gap-3 sm:gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium">
                Total Orders
              </CardTitle>
              <Package className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl font-bold">{stats.totalOrders}</div>
              <p className="text-xs text-muted-foreground">
                All purchase orders
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium">
                Pending Orders
              </CardTitle>
              <Calendar className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl font-bold">{stats.pendingOrders}</div>
              <p className="text-xs text-muted-foreground">Awaiting approval</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader className="p-3 sm:p-6">
            <div className="flex flex-col gap-3 sm:gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Search by product name, or SKU..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 text-sm"
                  />
                </div>
              </div>
              <div className="w-full sm:w-48">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    {Object.keys($Enums.Status).map((status) => (
                      <SelectItem value={status}>
                        {formatStatus(status)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* View Toggle */}
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>Showing {filteredOrders.length} of {orders?.length || 0} orders</span>
          </div>
          <div className="flex gap-2">
            <Button
              variant={viewType === "card" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewType("card")}
            >
              <Grid3x3 className="h-4 w-4 mr-2" />
              Card View
            </Button>
            <Button
              variant={viewType === "table" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewType("table")}
            >
              <Table className="h-4 w-4 mr-2" />
              Table View
            </Button>
          </div>
        </div>

        {/* Orders List */}
        <div className="space-y-4">
          {filteredOrders.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <div className="space-y-2">
                  <Package className="h-16 w-16 text-muted-foreground mx-auto" />
                  <h3 className="text-lg font-medium">No orders found</h3>
                  <p className="text-muted-foreground">
                    {orders?.length === 0
                      ? "You haven't placed any orders yet"
                      : "Try adjusting your search or filter criteria"}
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : viewType === "table" ? (
            <ClientOrdersTable 
              orders={filteredOrders}
              expandedOrders={expandedOrders}
              onToggleOrder={toggleOrderExpansion}
            />
          ) : (
            filteredOrders.map((order) => {
              const isExpanded = expandedOrders.has(order.id);

              return (
                <Card key={order.id}>
                  <Collapsible
                    open={isExpanded}
                    onOpenChange={() => toggleOrderExpansion(order.id)}
                  >
                    <CollapsibleTrigger asChild>
                      <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                        <div className="flex items-center justify-between">
                          <div className="space-y-1">
                            <div className="flex items-center gap-3">
                              <CardTitle className="text-lg">
                                {order.id}
                              </CardTitle>
                              <Badge className={getStatusColor(order.status)}>
                                {formatStatus(order.status)}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <span>
                                {new Date(order.createdAt).toLocaleDateString()}
                              </span>
                              <span>•</span>
                              <span>
                                {(() => {
                                  const regularItems = order.orderItems?.length || 0;
                                  const bundleItems = order.bundleOrderItems?.reduce((count, bundleItem) => {
                                    return count + (bundleItem.bundle?.items?.length || 0);
                                  }, 0) || 0;
                                  const totalItems = regularItems + bundleItems;
                                  
                                  if (totalItems === 1) {
                                    // Show single item name
                                    if (order.orderItems?.[0]) {
                                      return order.orderItems[0].product?.name || 'Item';
                                    } else if (order.bundleOrderItems?.[0]?.bundle?.items?.[0]) {
                                      return order.bundleOrderItems[0].bundle.items[0].product?.name || 'Bundle Item';
                                    }
                                    return 'Item';
                                  } else {
                                    // Show count for multiple items
                                    return `${totalItems} items`;
                                  }
                                })()
                              }
                              </span>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {getStatusDescription(order.status)}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            {isExpanded ? (
                              <ChevronUp className="h-4 w-4" />
                            ) : (
                              <ChevronDown className="h-4 w-4" />
                            )}
                          </div>
                        </div>
                      </CardHeader>
                    </CollapsibleTrigger>

                    <CollapsibleContent>
                      <CardContent className="pt-0">
                        <div className="space-y-4">
                          {/* Order Timeline */}
                          <div>
                            <h4 className="font-medium mb-3">Order Timeline</h4>
                            <div className="space-y-3 mb-4">
                              {[
                                { status: "PENDING", label: "Order Placed", description: "Your order has been submitted" },
                                { status: "APPROVED", label: "Order Approved", description: "Your order has been approved" },
                                { status: "READY_FOR_DISPATCH", label: "Ready for Dispatch", description: "Your order is packed and ready" },
                                { status: "DISPATCHED", label: "Order Dispatched", description: "Your order has been dispatched" },
                                { status: "AT_DESTINATION", label: "At Destination", description: "Your order has reached destination" },
                                { status: "DELIVERED", label: "Delivered", description: "Your order has been delivered" },
                                { status: "COMPLETED", label: "Completed", description: "Your order is complete" },
                              ].filter((timelineItem, index) => {
                                const currentStatusIndex = [
                                  "PENDING", "APPROVED", "READY_FOR_DISPATCH", 
                                  "DISPATCHED", "AT_DESTINATION", "DELIVERED", "COMPLETED"
                                ].indexOf(order.status);
                                return index <= currentStatusIndex;
                              }).map((timelineItem, index, filteredArray) => {
                                const isCurrent = index === filteredArray.length - 1;

                                return (
                                  <div key={timelineItem.status} className="flex items-center gap-3">
                                    <div className={`h-6 w-6 rounded-full flex items-center justify-center text-xs ${
                                      isCurrent ? 'bg-primary text-primary-foreground' : 'bg-green-100 text-green-600'
                                    }`}>
                                      ✓
                                    </div>
                                    <div className="flex-1">
                                      <p className={`font-medium text-sm ${isCurrent ? 'text-primary' : ''}`}>
                                        {timelineItem.label}
                                      </p>
                                      <p className="text-xs text-muted-foreground">
                                        {timelineItem.description}
                                      </p>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>

                          {/* Order Summary */}
                          <div>
                            <h4 className="font-medium mb-3">Order Details</h4>
                            <div className="text-sm text-muted-foreground">
                              <p>Order ID: {order.id}</p>
                              <p>Status: {formatStatus(order.status)}</p>
                              <p>
                                Date:{" "}
                                {new Date(order.createdAt).toLocaleDateString()}
                              </p>
                              <p>
                                Required By Date:{" "}
                                {new Date(
                                  order.requiredByDate
                                ).toLocaleDateString()}
                              </p>
                            </div>
                          </div>

                          {/* Order Items */}
                          <div>
                            <h4 className="font-medium mb-3">Order Items</h4>
                            <div className="space-y-3">
                              {order.orderItems && order.orderItems.map((item) => (
                                <div
                                  key={item.product.id}
                                  className="flex gap-3 rounded-lg bg-muted/40 p-3"
                                >
                                  <ImageWithFallback
                                    src={item.product.images[0]}
                                    alt={item.product.name}
                                    className="h-16 w-16 rounded object-cover"
                                  />
                                  <div>
                                    <p className="font-medium">
                                      {item.product.name}
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                      Quantity: {item.quantity}
                                    </p>
                                    {item.price > 0 && (
                                      <p className="text-sm">
                                        Price: ₹{item.price.toFixed(2)}
                                      </p>
                                    )}
                                  </div>
                                </div>
                              ))}
                              {order.bundleOrderItems && order.bundleOrderItems
                                .filter(bundleItem => bundleItem.bundle?.items)
                                .map((bundleItem) => 
                                bundleItem.bundle!.items.map((item) => (
                                  <div
                                    key={`bundle-${bundleItem.id}-${item.id}`}
                                    className="flex gap-3 rounded-lg border p-3"
                                  >
                                    <div className="h-16 w-16 rounded overflow-hidden">
                                      <ImageWithFallback
                                        src={item.product?.images?.[0] || ''}
                                        alt={item.product?.name || 'Bundle Product'}
                                        className="h-full w-full object-cover"
                                      />
                                    </div>
                                    <div>
                                      <p className="font-medium">
                                        {item.product?.name || 'Bundle Product'}
                                      </p>
                                      <p className="text-sm text-muted-foreground">
                                        SKU: {item.product?.sku || 'N/A'}
                                      </p>
                                      <p className="text-sm text-muted-foreground">
                                          Bundle Qty: {Math.floor(bundleItem.quantity / item.bundleProductQuantity)} × Item Qty: {item.bundleProductQuantity}
                                      </p>
                                      {item.product?.price && item.product.price > 0 && (
                                        <p className="text-sm">
                                          Price: ₹{item.product.price.toFixed(2)}
                                        </p>
                                      )}
                                      <p className="text-xs text-blue-600 font-medium">Bundle</p>
                                    </div>
                                  </div>
                                ))
                              )}
                              {(!order.orderItems || order.orderItems.length === 0) && (!order.bundleOrderItems || order.bundleOrderItems.length === 0) && (
                                <div className="text-center py-8 text-muted-foreground">
                                  <Package className="h-12 w-12 mx-auto mb-2 opacity-50" />
                                  <p>No items found in this order</p>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Total Amount */}
                          {order.totalAmount > 0 && (
                            <div className="pt-4 border-t">
                              <div className="flex justify-between items-center">
                                <span className="font-medium">
                                  Total Amount:
                                </span>
                                <span className="font-bold text-lg">
                                  ₹{order.totalAmount.toFixed(2)}
                                </span>
                              </div>
                            </div>
                          )}

                          {/* Order Details */}
                          <div className="grid grid-cols-1 gap-x-4 gap-y-6 pt-4 border-t md:grid-cols-2">
                            <div>
                              <h4 className="font-medium mb-2">
                                Delivery Address
                              </h4>
                              <div className="text-sm text-muted-foreground space-y-1">
                                {order.consigneeName && (
                                  <p>
                                    <strong>Consignee:</strong>{" "}
                                    {order.consigneeName}
                                  </p>
                                )}
                                {order.consigneePhone && (
                                  <p>
                                    <strong>Phone:</strong>{" "}
                                    {order.consigneePhone}
                                  </p>
                                )}
                                {order.consigneeEmail && (
                                  <p>
                                    <strong>Email:</strong>{" "}
                                    {order.consigneeEmail}
                                  </p>
                                )}
                                <p>
                                  <strong>Address:</strong>{" "}
                                  {order.deliveryAddress}
                                </p>
                                {order.city && (
                                  <p>
                                    <strong>City:</strong> {order.city}
                                  </p>
                                )}
                                {order.state && (
                                  <p>
                                    <strong>State:</strong> {order.state}
                                  </p>
                                )}
                                {order.pincode && (
                                  <p>
                                    <strong>Pincode:</strong> {order.pincode}
                                  </p>
                                )}
                                {order.modeOfDelivery && (
                                  <p>
                                    <strong>Mode:</strong>{" "}
                                    {order.modeOfDelivery}
                                  </p>
                                )}
                                {order.consignmentNumber && (
                                  <p>
                                    <strong>Consignment Number:</strong>{" "}
                                    {order.consignmentNumber}
                                  </p>
                                )}
                                {order.deliveryService && (
                                  <p>
                                    <strong>Delivery Service:</strong>{" "}
                                    {order.deliveryService}
                                  </p>
                                )}
                                {order.deliveryReference && (
                                  <p>
                                    <strong>Reference:</strong>{" "}
                                    {order.deliveryReference!}
                                  </p>
                                )}
                                {order.packagingInstructions && (
                                  <p>
                                    <strong>Packaging:</strong>{" "}
                                    {order.packagingInstructions!}
                                  </p>
                                )}
                              </div>
                            </div>
                            {order.note && (
                              <div className="md:col-span-2">
                                <h4 className="font-medium mb-2">Notes</h4>
                                <p className="text-sm text-muted-foreground whitespace-pre-line">
                                  {order.note}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </CollapsibleContent>
                  </Collapsible>
                </Card>
              );
            })
          )}
        </div>
      </div>
    </Layout>
  );
}
