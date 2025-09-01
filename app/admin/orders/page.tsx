"use client";

import { useState, useEffect } from "react";
import Layout from "@/components/layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { ImageWithFallback } from "@/components/image";
import {
  Search,
  ChevronDown,
  ChevronUp,
  Clock,
  CheckCircle,
  XCircle,
  Package,
  Building2,
  Calendar,
  IndianRupee,
  FileText,
  Download,
  DollarSign,
} from "lucide-react";
import { toast } from "sonner";
import {
  PurchaseOrder,
  getStoredData,
  setStoredData,
  MOCK_ORDERS,
} from "@/lib/mockData";

export default function AdminOrders() {
  const [orders, setOrders] = useState<PurchaseOrder[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<PurchaseOrder[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [expandedOrders, setExpandedOrders] = useState<Set<string>>(new Set());
  const [selectedOrder, setSelectedOrder] = useState<PurchaseOrder | null>(
    null,
  );
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);
  const [newStatus, setNewStatus] = useState<string>("");
  const [statusNotes, setStatusNotes] = useState("");

  useEffect(() => {
    const storedOrders = getStoredData<PurchaseOrder[]>(
      "fitplay_orders",
      MOCK_ORDERS,
    );
    const sortedOrders = storedOrders.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
    setOrders(sortedOrders);
  }, []);

  useEffect(() => {
    // Filter orders
    let filtered = orders;

    if (searchTerm) {
      filtered = filtered.filter(
        (order) =>
          order.poNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.items.some(
            (item) =>
              item.product.name
                .toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
              item.product.sku.toLowerCase().includes(searchTerm.toLowerCase()),
          ),
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((order) => order.status === statusFilter);
    }

    setFilteredOrders(filtered);
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

  const openStatusDialog = (order: PurchaseOrder) => {
    setSelectedOrder(order);
    setNewStatus(order.status);
    setStatusNotes("");
    setIsStatusDialogOpen(true);
  };

  const updateOrderStatus = () => {
    if (!selectedOrder) return;

    const updatedOrders = orders.map((order) =>
      order.id === selectedOrder.id
        ? {
            ...order,
            status: newStatus as PurchaseOrder["status"],
            updatedAt: new Date().toISOString(),
            notes: statusNotes
              ? `${order.notes}\n\nStatus Update: ${statusNotes}`
              : order.notes,
          }
        : order,
    );

    setOrders(updatedOrders);
    setStoredData("fitplay_orders", updatedOrders);
    setIsStatusDialogOpen(false);
    toast.success(
      `Order ${selectedOrder.poNumber} status updated to ${newStatus}`,
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
      case "approved":
        return "bg-blue-100 text-blue-800 border-blue-300";
      case "in-progress":
        return "bg-purple-100 text-purple-800 border-purple-300";
      case "completed":
        return "bg-green-100 text-green-800 border-green-300";
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4" />;
      case "approved":
        return <CheckCircle className="h-4 w-4" />;
      case "in-progress":
        return <Package className="h-4 w-4" />;
      case "completed":
        return <CheckCircle className="h-4 w-4" />;
      case "cancelled":
        return <XCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const exportOrderPDF = (order: PurchaseOrder) => {
    // Mock PDF export functionality
    toast.success(`Exporting ${order.poNumber} as PDF...`);
  };

  const totalOrders = orders.length;
  const pendingOrders = orders.filter((o) => o.status === "pending").length;
  const completedOrders = orders.filter((o) => o.status === "completed").length;
  const totalRevenue = orders
    .filter((o) => o.status !== "cancelled")
    .reduce((sum, order) => sum + order.total, 0);

  return (
    <Layout title="Order Management" isClient={false}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Order Management</h1>
            <p className="text-muted-foreground">
              Review and manage purchase orders from clients
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Orders
              </CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalOrders}</div>
              <p className="text-xs text-muted-foreground">
                All purchase orders
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Pending Approval
              </CardTitle>
              <Clock className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingOrders}</div>
              <p className="text-xs text-muted-foreground">Need review</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{completedOrders}</div>
              <p className="text-xs text-muted-foreground">Delivered</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Revenue
              </CardTitle>
              <IndianRupee className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ₹{totalRevenue.toFixed(2)}
              </div>
              <p className="text-xs text-muted-foreground">From orders</p>
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
                    placeholder="Search by PO number, client, company, or product..."
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
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
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
                  <FileText className="h-16 w-16 text-muted-foreground mx-auto" />
                  <h3 className="text-lg font-medium">No orders found</h3>
                  <p className="text-muted-foreground">
                    {orders.length === 0
                      ? "No purchase orders have been placed yet"
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
                                {order.poNumber}
                              </CardTitle>
                              <Badge className={getStatusColor(order.status)}>
                                {getStatusIcon(order.status)}
                                <span className="ml-1">
                                  {order.status.charAt(0).toUpperCase() +
                                    order.status.slice(1)}
                                </span>
                              </Badge>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <Building2 className="h-3 w-3" />
                                {order.company}
                              </div>
                              <div className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {new Date(order.createdAt).toLocaleDateString()}
                              </div>
                              <div className="flex items-center gap-1">
                                <Package className="h-3 w-3" />
                                {order.items.length} item
                                {order.items.length !== 1 ? "s" : ""}
                              </div>
                              <div className="flex items-center gap-1">
                                <DollarSign className="h-3 w-3" />$
                                {order.total.toFixed(2)}
                              </div>
                            </div>
                            <p className="text-sm">
                              <span className="font-medium">
                                {order.clientName}
                              </span>{" "}
                              • {order.clientEmail}
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
                        <div className="space-y-6">
                          {/* Action Buttons */}
                          <div className="flex items-center gap-2 pb-4 border-b">
                            <Button
                              size="sm"
                              onClick={() => openStatusDialog(order)}
                              variant={
                                order.status === "pending"
                                  ? "default"
                                  : "outline"
                              }
                            >
                              Update Status
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => exportOrderPDF(order)}
                            >
                              <Download className="h-4 w-4 mr-2" />
                              Export PDF
                            </Button>
                          </div>

                          {/* Order Items */}
                          <div>
                            <h4 className="font-medium mb-3">Order Items</h4>
                            <div className="space-y-3">
                              {order.items.map((item) => (
                                <div
                                  key={item.product.id}
                                  className="flex gap-3 p-3 bg-muted/30 rounded-lg"
                                >
                                  <div className="w-16 h-16 flex-shrink-0">
                                    <ImageWithFallback
                                      src={item.product.image}
                                      alt={item.product.name}
                                      className="w-full h-full object-cover rounded"
                                    />
                                  </div>
                                  <div className="flex-1">
                                    <p className="font-medium">
                                      {item.product.name}
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                      SKU: {item.product.sku} • Category:{" "}
                                      {item.product.category}
                                    </p>
                                    <p className="text-sm">
                                      ${item.product.price} × {item.quantity} =
                                      $
                                      {(
                                        item.product.price * item.quantity
                                      ).toFixed(2)}
                                    </p>
                                  </div>
                                </div>
                              ))}
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
                            <div>
                              <h4 className="font-medium mb-2">
                                Billing Contact
                              </h4>
                              <p className="text-sm text-muted-foreground">
                                {order.billingContact}
                              </p>
                            </div>

                            {order.notes && (
                              <div className="md:col-span-2">
                                <h4 className="font-medium mb-2">Notes</h4>
                                <p className="text-sm text-muted-foreground whitespace-pre-line">
                                  {order.notes}
                                </p>
                              </div>
                            )}

                            <div className="md:col-span-2">
                              <h4 className="font-medium mb-2">
                                Order Timeline
                              </h4>
                              <div className="text-sm text-muted-foreground space-y-1">
                                <p>
                                  Created:{" "}
                                  {new Date(order.createdAt).toLocaleString()}
                                </p>
                                <p>
                                  Last Updated:{" "}
                                  {new Date(order.updatedAt).toLocaleString()}
                                </p>
                              </div>
                            </div>
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

        {/* Status Update Dialog */}
        <Dialog open={isStatusDialogOpen} onOpenChange={setIsStatusDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Update Order Status</DialogTitle>
              <DialogDescription>
                Update the status of {selectedOrder?.poNumber}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">New Status</label>
                <Select value={newStatus} onValueChange={setNewStatus}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Status Update Notes (Optional)
                </label>
                <Textarea
                  value={statusNotes}
                  onChange={(e) => setStatusNotes(e.target.value)}
                  placeholder="Add any notes about this status change..."
                  rows={3}
                />
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setIsStatusDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button onClick={updateOrderStatus}>Update Status</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
}
