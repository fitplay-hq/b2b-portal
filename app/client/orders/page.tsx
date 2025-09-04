"use client";

import { useState, useMemo } from "react";
import Layout from "@/components/layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
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
} from "lucide-react";
import { useOrders } from "@/data/order/client.hooks";
import { Skeleton } from "@/components/ui/skeleton";
import { $Enums, Order } from "@/lib/generated/prisma";

export default function ClientOrderHistory() {
  const { orders, isLoading } = useOrders();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [expandedOrders, setExpandedOrders] = useState<Set<string>>(new Set());

  const filteredOrders = useMemo(() => {
    if (!orders) return [];

    let filtered: Order[] = orders as Order[];

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
    const typedOrders = orders as Order[];
    const totalOrders = typedOrders.length;
    const pendingOrders = typedOrders.filter(
      (o) => o.status === "PENDING"
    ).length;

    return { totalOrders, pendingOrders };
  }, [orders]);

  if (isLoading) {
    return (
      <Layout title="Order History" isClient>
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Skeleton className="h-24" />
            <Skeleton className="h-24" />
            <Skeleton className="h-24" />
          </div>
          <Skeleton className="h-20" />
          <div className="space-y-4">
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Order History" isClient>
      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Orders
              </CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalOrders}</div>
              <p className="text-xs text-muted-foreground">
                All purchase orders
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Pending Orders
              </CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.pendingOrders}</div>
              <p className="text-xs text-muted-foreground">Awaiting approval</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Search by product name, or SKU..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="sm:w-48">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    {Object.keys($Enums.Status).map((status) => (
                      <SelectItem value={status}>{status}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
        </Card>

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
                                {order.status.charAt(0).toUpperCase() +
                                  order.status.slice(1).toLowerCase()}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <span>
                                {new Date(order.createdAt).toLocaleDateString()}
                              </span>
                              <span>•</span>
                              <span>Item</span>
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
                          {/* Order Summary */}
                          <div>
                            <h4 className="font-medium mb-3">Order Details</h4>
                            <div className="text-sm text-muted-foreground">
                              <p>Order ID: {order.id}</p>
                              <p>Status: {order.status}</p>
                              <p>
                                Date:{" "}
                                {new Date(order.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                          </div>

                          {/* Order Details */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
                            <div>
                              <h4 className="font-medium mb-2">
                                Delivery Address
                              </h4>
                              <p className="text-sm text-muted-foreground whitespace-pre-line">
                                {order.deliveryAddress}
                              </p>
                            </div>
                            {order.note && (
                              <div className="md:col-span-2">
                                <h4 className="font-medium mb-2">Notes</h4>
                                <p className="text-sm text-muted-foreground">
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
