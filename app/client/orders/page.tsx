"use client";

import { useState, useMemo } from "react";
import { useSession } from "next-auth/react";
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
  Clock,
  CheckCircle,
  XCircle,
  Download,
  Building2,
} from "lucide-react";
import { useOrders } from "@/data/order/client.hooks";
import { Skeleton } from "@/components/ui/skeleton";
import { $Enums, Order } from "@/lib/generated/prisma";
import { formatStatus } from "@/lib/utils";
import type { OrderWithItems } from "@/data/order/client.actions";
import { ClientOrdersTable } from "./components/orders-table";

export default function ClientOrderHistory() {
  const { data: session } = useSession();
  const isShowPrice = session?.user?.isShowPrice ?? false;
  const { orders, isLoading } = useOrders();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [expandedOrders, setExpandedOrders] = useState<Set<string>>(new Set());
  const [viewType, setViewType] = useState<"card" | "table">("card");

  const filteredOrders = useMemo(() => {
    if (!orders) return [];

    let filtered: OrderWithItems[] = orders as OrderWithItems[];
    const lowercasedTerm = searchTerm.toLowerCase();

    // Apply search filter
    if (lowercasedTerm) {
      filtered = filtered.filter(order => {
        // Search by Order ID
        if (order.id.toLowerCase().includes(lowercasedTerm)) return true;
        
        // Search by Order Status (both raw and formatted)
        if (order.status.toLowerCase().includes(lowercasedTerm)) return true;
        if (formatStatus(order.status).toLowerCase().includes(lowercasedTerm)) return true;
        
        // Search by Total Amount
        if (order.totalAmount.toString().includes(lowercasedTerm)) return true;
        
        // Search by Order notes
        if (order.note?.toLowerCase().includes(lowercasedTerm)) return true;
        
        // Search in consignee details
        if (order.consigneeName?.toLowerCase().includes(lowercasedTerm)) return true;
        if (order.consigneePhone?.toLowerCase().includes(lowercasedTerm)) return true;
        if (order.consigneeEmail?.toLowerCase().includes(lowercasedTerm)) return true;
        
        // Search in delivery address fields
        if (order.deliveryAddress?.toLowerCase().includes(lowercasedTerm)) return true;
        if (order.city?.toLowerCase().includes(lowercasedTerm)) return true;
        if (order.state?.toLowerCase().includes(lowercasedTerm)) return true;
        if (order.pincode?.toLowerCase().includes(lowercasedTerm)) return true;
        
        // Search in delivery details
        if (order.deliveryService?.toLowerCase().includes(lowercasedTerm)) return true;
        if (order.modeOfDelivery?.toLowerCase().includes(lowercasedTerm)) return true;
        
        // Search by Product names in regular order items
        if (order.orderItems?.some(item =>
          item.product?.name?.toLowerCase().includes(lowercasedTerm) ||
          item.product?.sku?.toLowerCase().includes(lowercasedTerm)
        )) return true;
        
        // Search by Product names in bundle order items
        if (order.bundleOrderItems?.some(bundleItem => {
          // Check bundle product name
          if (bundleItem.product?.name?.toLowerCase().includes(lowercasedTerm)) return true;
          
          // Check individual items within the bundle
          if (bundleItem.bundle?.items?.some(item =>
            item.product?.name?.toLowerCase().includes(lowercasedTerm)
          )) return true;
          
          return false;
        })) return true;
        
        return false;
      });
    }

    // Apply status filter
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
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100/80";
      case "APPROVED":
        return "bg-blue-100 text-blue-800 hover:bg-blue-100/80";
      case "READY_FOR_DISPATCH":
        return "bg-purple-100 text-purple-800 hover:bg-purple-100/80";
      case "DISPATCHED":
        return "bg-indigo-100 text-indigo-800 hover:bg-indigo-100/80";
      case "AT_DESTINATION":
        return "bg-orange-100 text-orange-800 hover:bg-orange-100/80";
      case "DELIVERED":
        return "bg-green-100 text-green-800 hover:bg-green-100/80";
      case "COMPLETED":
        return "bg-green-100 text-green-800 hover:bg-green-100/80";
      case "CANCELLED":
      case "REJECTED":
        return "bg-red-100 text-red-800 hover:bg-red-100/80";
      case "IN_PROGRESS":
        return "bg-purple-100 text-purple-800 hover:bg-purple-100/80";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100/80";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "PENDING":
        return Clock;
      case "APPROVED":
        return CheckCircle;
      case "READY_FOR_DISPATCH":
        return Download;
      case "DISPATCHED":
      case "AT_DESTINATION":
        return Package;
      case "DELIVERED":
      case "COMPLETED":
        return Building2;
      case "CANCELLED":
      case "REJECTED":
        return XCircle;
      case "IN_PROGRESS":
        return Package;
      default:
        return Clock;
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
                    placeholder="Search by order ID, amount, product, address, consignee..."
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
                      <SelectItem key={status} value={status}>
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
          <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
            <span>Showing {filteredOrders.length} of {orders?.length || 0} orders</span>
          </div>
          <div className="flex gap-2">
            <Button
              variant={viewType === "card" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewType("card")}
              className="text-xs sm:text-sm"
            >
              <Grid3x3 className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Card View</span>
              <span className="sm:hidden">Card</span>
            </Button>
            <Button
              variant={viewType === "table" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewType("table")}
              className="text-xs sm:text-sm"
            >
              <Table className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Table View</span>
              <span className="sm:hidden">Table</span>
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
              isShowPrice={isShowPrice}
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
                      <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors p-2 sm:p-4 pb-2 sm:pb-3">
                        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-2 sm:gap-4">
                          <div className="flex-1 min-w-0 grid grid-rows-3 gap-1">
                            <div className="flex items-center gap-2 sm:gap-3">
                              <CardTitle className="text-base sm:text-lg truncate">
                                {order.id}
                              </CardTitle>
                              <Badge className={getStatusColor(order.status)}>
                                {(() => {
                                  const StatusIcon = getStatusIcon(order.status);
                                  return <StatusIcon className="mr-1 h-3 w-3" />;
                                })()}
                                {formatStatus(order.status)}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-2 sm:gap-4 text-xs sm:text-sm text-muted-foreground flex-wrap">
                              <span className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {new Date(order.createdAt).toLocaleDateString()} , {new Date(order.createdAt).toLocaleTimeString()}
                              </span>
                              <span className="hidden sm:inline">•</span>
                              <span className="flex items-center gap-1">
                                <Package className="h-3 w-3" />
                                {(() => {
                                  // Calculate total items from both orderItems and bundleOrderItems
                                  const totalQty = (order.orderItems?.reduce((sum, item) => sum + item.quantity, 0) || 0) +
                                    (order.bundleOrderItems?.reduce((sum, item) => sum + item.quantity, 0) || 0);
                                  
                                  return `${totalQty} item${totalQty !== 1 ? 's' : ''}`;
                                })()
                              }
                              </span>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {getStatusDescription(order.status)}
                            </p>
                          </div>
                          
                          {/* Right Side Summary */}
                          <div className="hidden lg:flex items-center gap-4">
                            <div className="text-right">
                              <div className="text-sm font-medium text-muted-foreground mb-1">
                                {(() => {
                                  const totalQuantity = (order.orderItems?.reduce((sum, item) => sum + item.quantity, 0) || 0) +
                                    (order.bundleOrderItems?.reduce((sum, item) => sum + item.quantity, 0) || 0);
                                  return `${totalQuantity} Total Items`;
                                })()}
                              </div>
                              {/* Compact product list - Show aggregated products with total quantities */}
                              <div className="flex flex-col gap-1 justify-end max-w-[350px]">
                                {(() => {
                                  // Aggregate products by productId from both orderItems and bundleOrderItems
                                  const productQuantities = new Map<string, { name: string, totalQty: number }>();
                                  
                                  // Add quantities from regular items
                                  order.orderItems?.forEach((item) => {
                                    if (item.product?.id) {
                                      const existing = productQuantities.get(item.product.id);
                                      if (existing) {
                                        existing.totalQty += item.quantity;
                                      } else {
                                        productQuantities.set(item.product.id, {
                                          name: item.product.name,
                                          totalQty: item.quantity
                                        });
                                      }
                                    }
                                  });
                                  
                                  // Add quantities from bundle items
                                  order.bundleOrderItems?.forEach((item) => {
                                    if (item.product?.id) {
                                      const existing = productQuantities.get(item.product.id);
                                      if (existing) {
                                        existing.totalQty += item.quantity;
                                      } else {
                                        productQuantities.set(item.product.id, {
                                          name: item.product.name,
                                          totalQty: item.quantity
                                        });
                                      }
                                    }
                                  });
                                  
                                  // Convert to array and show first 3
                                  const productsArray = Array.from(productQuantities.entries()).map(([id, data]) => ({
                                    id,
                                    name: data.name,
                                    totalQty: data.totalQty
                                  }));
                                  
                                  const itemsToShow = productsArray.slice(0, 3);
                                  
                                  return (
                                    <>
                                      {itemsToShow.map((product) => (
                                        <div key={product.id} className="flex items-center gap-1 text-sm bg-muted px-2 py-0 rounded whitespace-nowrap">
                                          <span className="font-medium">{product.name}</span>
                                          <span className="text-muted-foreground">Qty: {product.totalQty}</span>
                                        </div>
                                      ))}
                                      {productsArray.length > 3 && (
                                        <span className="text-sm text-muted-foreground">
                                          +{productsArray.length - 3} more items
                                        </span>
                                      )}
                                    </>
                                  );
                                })()}
                              </div>
                            </div>
                            <div className="flex items-center">
                              {isExpanded ? (
                                <ChevronUp className="h-5 w-5" />
                              ) : (
                                <ChevronDown className="h-5 w-5" />
                              )}
                            </div>
                          </div>                          
                          {/* Mobile-only total items */}
                          <div className="flex lg:hidden flex-col gap-2 w-full">
                            <div className="flex items-center justify-between">
                              <div className="text-sm font-medium text-muted-foreground">
                                {(() => {
                                  const totalQuantity = (order.orderItems?.reduce((sum, item) => sum + item.quantity, 0) || 0) +
                                    (order.bundleOrderItems?.reduce((sum, item) => sum + item.quantity, 0) || 0);
                                  return `${totalQuantity} Total Items`;
                                })()}
                              </div>
                              <div className="flex items-center">
                                {isExpanded ? (
                                  <ChevronUp className="h-5 w-5" />
                                ) : (
                                  <ChevronDown className="h-5 w-5" />
                                )}
                              </div>
                            </div>
                            {/* Mobile product badges */}
                            <div className="flex flex-col gap-1">
                              {(() => {
                                // Aggregate products by productId from both orderItems and bundleOrderItems
                                const productQuantities = new Map<string, { name: string, totalQty: number }>();
                                
                                // Add quantities from regular items
                                order.orderItems?.forEach((item) => {
                                  if (item.product?.id) {
                                    const existing = productQuantities.get(item.product.id);
                                    if (existing) {
                                      existing.totalQty += item.quantity;
                                    } else {
                                      productQuantities.set(item.product.id, {
                                        name: item.product.name,
                                        totalQty: item.quantity
                                      });
                                    }
                                  }
                                });
                                
                                // Add quantities from bundle items
                                order.bundleOrderItems?.forEach((item) => {
                                  if (item.product?.id) {
                                    const existing = productQuantities.get(item.product.id);
                                    if (existing) {
                                      existing.totalQty += item.quantity;
                                    } else {
                                      productQuantities.set(item.product.id, {
                                        name: item.product.name,
                                        totalQty: item.quantity
                                      });
                                    }
                                  }
                                });
                                
                                // Convert to array and show first 3
                                const productsArray = Array.from(productQuantities.entries()).map(([id, data]) => ({
                                  id,
                                  name: data.name,
                                  totalQty: data.totalQty
                                }));
                                
                                const itemsToShow = productsArray.slice(0, 3);
                                
                                return (
                                  <>
                                    {itemsToShow.map((product) => (
                                      <div key={product.id} className="flex items-center gap-1 text-sm bg-muted px-2 py-0 rounded whitespace-nowrap">
                                        <span className="font-medium">{product.name}</span>
                                        <span className="text-muted-foreground">Qty: {product.totalQty}</span>
                                      </div>
                                    ))}
                                    {productsArray.length > 3 && (
                                      <span className="text-sm text-muted-foreground bg-muted px-2 py-0 rounded">
                                        +{productsArray.length - 3} more items
                                      </span>
                                    )}
                                  </>
                                );
                              })()}
                            </div>
                          </div>                        </div>
                      </CardHeader>
                    </CollapsibleTrigger>

                    <CollapsibleContent>
                      <CardContent className="px-2 pb-2 sm:px-4 sm:pb-4 pt-0">
                        <div className="space-y-3 sm:space-y-4">
                          {/* Order Timeline */}
                          <div>
                            <h4 className="text-sm sm:text-base font-medium mb-2 sm:mb-3">Order Timeline</h4>
                            <div className="space-y-2 sm:space-y-3 mb-3 sm:mb-4">
                              {(() => {
                                // Build dynamic timeline based on actual events
                                const timelineEvents = [];
                                
                                // Always show order creation
                                timelineEvents.push({
                                  label: "Order Created",
                                  description: "",
                                  timestamp: order.createdAt,
                                  icon: CheckCircle,
                                  color: "bg-green-100 text-green-600"
                                });

                                // Add status-based events
                                const statusMap: Record<string, { label: string; description: string; icon: any; color: string }> = {
                                  APPROVED: {
                                    label: "Order Approved",
                                    description: "Order has been approved",
                                    icon: CheckCircle,
                                    color: "bg-blue-100 text-blue-600"
                                  },
                                  READY_FOR_DISPATCH: {
                                    label: "Ready for Dispatch",
                                    description: "Order is packed and ready",
                                    icon: Download,
                                    color: "bg-purple-100 text-purple-600"
                                  },
                                  DISPATCHED: {
                                    label: "Order Dispatched",
                                    description: "Order has been dispatched",
                                    icon: Package,
                                    color: "bg-green-100 text-green-600"
                                  },
                                  AT_DESTINATION: {
                                    label: "At Destination",
                                    description: "Order reached delivery location",
                                    icon: Building2,
                                    color: "bg-green-100 text-green-600"
                                  },
                                  DELIVERED: {
                                    label: "Delivered",
                                    description: "Order has been delivered",
                                    icon: Building2,
                                    color: "bg-green-100 text-green-600"
                                  },
                                  COMPLETED: {
                                    label: "Completed",
                                    description: "Order is complete",
                                    icon: CheckCircle,
                                    color: "bg-green-100 text-green-600"
                                  },
                                  CANCELLED: {
                                    label: "Order Cancelled",
                                    description: "Status updated to cancelled",
                                    icon: XCircle,
                                    color: "bg-red-100 text-red-600"
                                  },
                                };

                                // Add current status event if not PENDING
                                if (order.status !== "PENDING" && statusMap[order.status]) {
                                  const statusInfo = statusMap[order.status];
                                  timelineEvents.push({
                                    label: statusInfo.label,
                                    description: statusInfo.description,
                                    timestamp: order.updatedAt,
                                    icon: statusInfo.icon,
                                    color: statusInfo.color
                                  });
                                }
                                
                                return timelineEvents.map((timelineItem, index) => {
                                  const TimelineIcon = timelineItem.icon;
                                  const isLast = index === timelineEvents.length - 1;

                                  return (
                                    <div key={index} className="relative">
                                      <div className="flex items-start gap-2 sm:gap-3">
                                        <div className={`h-8 w-8 sm:h-10 sm:w-10 flex-shrink-0 rounded-full flex items-center justify-center ${timelineItem.color}`}>
                                          <TimelineIcon className="h-4 w-4 sm:h-4 sm:w-4" />
                                        </div>
                                        <div className="flex-1 min-w-0 pt-0.5">
                                          <p className="font-semibold text-sm sm:text-base">
                                            {timelineItem.label}
                                          </p>
                                          <p className="text-xs sm:text-sm text-muted-foreground">
                                            {timelineItem.description}
                                          </p>
                                          <p className="text-xs text-muted-foreground mt-0.5">
                                            {new Date(timelineItem.timestamp).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, '/')}, {new Date(timelineItem.timestamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })}
                                          </p>
                                        </div>
                                      </div>
                                      {!isLast && (
                                        <div className="absolute left-4 sm:left-5 top-8 sm:top-10 w-0.5 bg-gray-200 h-2" />
                                      )}
                                    </div>
                                  );
                                });
                              })()}
                            </div>
                          </div>

                          {/* Order Summary */}
                          <div>
                            <h4 className="text-sm sm:text-base font-medium mb-3">Order Details</h4>
                            <div className="text-xs sm:text-sm text-muted-foreground space-y-1">
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
                            <h4 className="text-sm sm:text-base font-medium mb-2 sm:mb-3">Order Items</h4>
                            <div className="space-y-2 sm:space-y-3">
                              {(() => {
                                // Aggregate products by productId from both orderItems and bundleOrderItems
                                const productMap = new Map<string, { product: any, totalQty: number, price?: number }>();
                                
                                // Add quantities from regular items
                                order.orderItems?.forEach((item) => {
                                  const existing = productMap.get(item.product.id);
                                  if (existing) {
                                    existing.totalQty += item.quantity;
                                  } else {
                                    productMap.set(item.product.id, {
                                      product: item.product,
                                      totalQty: item.quantity,
                                      price: item.price
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
                                      totalQty: item.quantity,
                                      price: item.price || item.product?.price
                                    });
                                  }
                                });
                                
                                return Array.from(productMap.values()).map((data) => (
                                  <div
                                    key={data.product.id}
                                    className="flex gap-2 sm:gap-3 rounded-lg bg-muted/40 p-2 sm:p-3"
                                  >
                                    <ImageWithFallback
                                      src={data.product.images[0]}
                                      alt={data.product.name}
                                      className="h-12 w-12 sm:h-16 sm:w-16 flex-shrink-0 rounded object-cover"
                                    />
                                    <div className="min-w-0 flex-1">
                                      <p className="font-medium text-sm sm:text-base line-clamp-2">
                                        {data.product.name}
                                      </p>
                                      <p className="text-xs sm:text-sm text-muted-foreground">
                                        SKU: {data.product.sku}
                                      </p>
                                      {isShowPrice && data.price && data.price > 0 && (
                                        <p className="text-xs sm:text-sm">
                                          Price: ₹{data.price.toFixed(2)}
                                        </p>
                                      )}
                                    </div>
                                    <div className="text-right shrink-0">
                                      <p className="text-sm sm:text-base font-medium">Qty: {data.totalQty}</p>
                                    </div>
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

                                return Object.values(bundleGroups).map((group: any, groupIndex) => {
                                  const bundleCount = group.items[0]?.bundle?.numberOfBundles || 1;
                                  return (
                                    <div key={`bundle-group-${groupIndex}`} className="space-y-2 sm:space-y-3">
                                      {/* Bundle Header */}
                                      <div className="flex flex-wrap items-center gap-2 p-2 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                                        <Package className="h-3 w-3 sm:h-4 sm:w-4 text-blue-600" />
                                        <span className="font-medium text-xs sm:text-sm text-blue-900">Bundle {groupIndex + 1}</span>
                                        <span className="text-xs sm:text-sm text-blue-600 ml-auto">
                                          {group.items.length} item{group.items.length > 1 ? 's' : ''} • {bundleCount} bundle{bundleCount > 1 ? 's' : ''}
                                        </span>
                                      </div>
                                    
                                    {/* Bundle Items */}
                                    {group.items.map((bundleItem: any, itemIndex: number) => {
                                      const perBundleQty = bundleCount > 0 ? bundleItem.quantity / bundleCount : bundleItem.quantity;
                                      return (
                                      <div key={`bundle-item-${groupIndex}-${itemIndex}`} className="flex gap-2 sm:gap-3 rounded-lg border p-2 sm:p-3 ml-2 sm:ml-4">
                                        <div className="h-12 w-12 sm:h-16 sm:w-16 flex-shrink-0 rounded overflow-hidden">
                                          <ImageWithFallback
                                            src={bundleItem.product?.images?.[0] || ''}
                                            alt={bundleItem.product?.name || 'Bundle Product'}
                                            className="h-full w-full object-cover"
                                          />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                          <p className="font-medium text-sm sm:text-base line-clamp-2">
                                            {bundleItem.product?.name || 'Bundle Product'}
                                          </p>
                                          <p className="text-xs sm:text-sm text-muted-foreground">
                                            SKU: {bundleItem.product?.sku || 'N/A'}
                                          </p>
                                          {isShowPrice && (bundleItem.price || bundleItem.product?.price) && (
                                            <p className="text-xs sm:text-sm">
                                              Price: ₹{(bundleItem.price || bundleItem.product?.price || 0).toFixed(2)}
                                            </p>
                                          )}
                                          <p className="text-xs sm:text-sm text-blue-600 font-medium">Bundle Item</p>
                                        </div>
                                        <div className="text-right">
                                          <p className="text-xs sm:text-sm font-medium">Qty: {perBundleQty} each</p>
                                        </div>
                                      </div>
                                    );
                                    })}
                                    </div>
                                );
                              });
                              })()}
                              {(!order.orderItems || order.orderItems.length === 0) && (!order.bundleOrderItems || order.bundleOrderItems.length === 0) && (
                                <div className="text-center py-8 text-muted-foreground">
                                  <Package className="h-12 w-12 mx-auto mb-2 opacity-50" />
                                  <p>No items found in this order</p>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Total Amount */}
                          {isShowPrice && order.totalAmount > 0 && (
                            <div className="pt-3 sm:pt-4 border-t">
                              <div className="flex justify-between items-center">
                                <span className="text-sm sm:text-base font-medium">
                                  Total Amount:
                                </span>
                                <span className="text-base sm:text-lg font-bold">
                                  ₹{order.totalAmount.toFixed(2)}
                                </span>
                              </div>
                            </div>
                          )}

                          {/* Order Details */}
                          <div className="grid grid-cols-1 gap-x-4 gap-y-4 sm:gap-y-6 pt-3 sm:pt-4 border-t md:grid-cols-2">
                            <div>
                              <h4 className="text-sm sm:text-base font-medium mb-2">
                                Delivery Info
                              </h4>
                              <div className="text-xs sm:text-sm text-muted-foreground space-y-1">
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
                                <h4 className="text-sm sm:text-base font-medium mb-2">Notes</h4>
                                <p className="text-xs sm:text-sm text-muted-foreground whitespace-pre-line">
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
