"use client";

import Layout from "@/components/layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Package,
  TrendingUp,
  ShoppingCart,
  Truck,
  AlertCircle,
  CheckCircle,
  Search,
  X,
} from "lucide-react";

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import Link from "next/link";
import type {
  OMDashboardPO,
  OMDashboardDispatch,
  OMClientSummary,
  OMItemSummary,
  OMPurchaseOrder,
  OMPurchaseOrderItem,
  OMDispatchOrder,
  OMDispatchOrderItem,
} from "@/types/order-management";

// Maps raw DB enum values to display labels
const PO_STATUS_LABELS: Record<string, string> = {
  DRAFT: "Draft",
  CONFIRMED: "Confirmed",
  PARTIALLY_DISPATCHED: "Partially Dispatched",
  FULLY_DISPATCHED: "Fully Dispatched",
  CLOSED: "Closed",
};

// Returns Tailwind classes for each PO status
const getPoStatusClass = (status: string) => {
  switch (status) {
    case "DRAFT":
      return "bg-slate-400 text-white border-0";
    case "CONFIRMED":
      return "bg-blue-500 text-white border-0";
    case "PARTIALLY_DISPATCHED":
      return "bg-amber-500 text-white border-0";
    case "FULLY_DISPATCHED":
      return "bg-emerald-500 text-white border-0";
    case "CLOSED":
      return "bg-gray-500 text-white border-0";
    default:
      return "bg-gray-300 text-gray-800 border-0";
  }
};

// Returns Tailwind classes for each Dispatch status
const getDispatchStatusClass = (status: string) => {
  switch (status) {
    case "CREATED":
      return "bg-blue-400 text-white border-0";
    case "DISPATCHED":
      return "bg-amber-500 text-white border-0";
    case "DELIVERED":
      return "bg-emerald-500 text-white border-0";
    case "CANCELLED":
      return "bg-red-500 text-white border-0";
    default:
      return "bg-gray-300 text-gray-800 border-0";
  }
};

export default function OMDashboard() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [omPurchaseOrders, setPurchaseOrders] = useState<OMDashboardPO[]>([]);
  const [omDispatches, setDispatches] = useState<OMDashboardDispatch[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async (query: string = "") => {
    setIsLoading(true);
    try {
      const res = await fetch(
        `/api/admin/om/search?q=${encodeURIComponent(query)}`,
      );
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();

      const pos: OMDashboardPO[] = data.results.map((po: OMPurchaseOrder) => ({
        id: po.id,
        clientId: po.clientId,
        clientName: po.client?.name || "Unknown",
        deliveryLocation: po.deliveryLocation?.name || "",
        estimateNumber: po.estimateNumber,
        estimateDate: po.estimateDate,
        poNumber: po.poNumber,
        poDate: po.poDate,
        poReceivedDate: po.poReceivedDate,
        totalQuantity:
          po.items?.reduce(
            (sum: number, item: OMPurchaseOrderItem) => sum + item.quantity,
            0,
          ) || 0,
        subtotal:
          po.items?.reduce(
            (sum: number, item: OMPurchaseOrderItem) => sum + item.amount,
            0,
          ) || 0,
        totalGst: po.totalGst,
        grandTotal: po.grandTotal,
        status: po.status,
        lineItems:
          po.items?.map((item: OMPurchaseOrderItem) => ({
            id: item.id,
            itemId: item.productId,
            itemName: item.product?.name || "Unknown",
            quantity: item.quantity,
            rate: item.rate,
            amount: item.amount,
            gstPercentage: item.gstPercentage,
            gstAmount: item.gstAmount,
            totalAmount: item.totalAmount,
          })) || [],
      }));

      const dispatches: OMDashboardDispatch[] = [];
      data.results.forEach((po: OMPurchaseOrder) => {
        po.dispatchOrders?.forEach((d: OMDispatchOrder) => {
          dispatches.push({
            id: d.id,
            poId: po.id,
            poNumber: po.poNumber,
            clientId: po.clientId,
            clientName: po.client?.name || "Unknown",
            invoiceNumber: d.invoiceNumber,
            totalDispatchQty:
              d.items?.reduce(
                (sum: number, i: OMDispatchOrderItem) => sum + i.quantity,
                0,
              ) || 0,
            logisticsPartnerName:
              d.logisticsPartner?.name || "Logistics Partner",
            status: d.status,
            lineItems:
              d.items?.map((i: OMDispatchOrderItem) => ({
                poLineItemId: i.purchaseOrderItemId,
                dispatchQty: i.quantity,
                itemName: i.purchaseOrderItem?.product?.name || "Unknown",
              })) || [],
          });
        });
      });

      setPurchaseOrders(pos);
      setDispatches(dispatches);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const getTotalDispatchedForPO = (poId: string) => {
    return omDispatches
      .filter((d) => d.poId === poId)
      .reduce((sum, d) => sum + d.totalDispatchQty, 0);
  };

  // Summary calculations
  const totalActivePOs = omPurchaseOrders.filter(
    (po) => po.status !== "CLOSED",
  ).length;
  const totalOrderValue = omPurchaseOrders.reduce(
    (sum, po) => sum + po.grandTotal,
    0,
  );
  const totalOrderedQty = omPurchaseOrders.reduce(
    (sum, po) => sum + po.totalQuantity,
    0,
  );
  const totalDispatchedQty = omPurchaseOrders.reduce(
    (sum, po) => sum + getTotalDispatchedForPO(po.id),
    0,
  );
  const totalRemainingQty = totalOrderedQty - totalDispatchedQty;
  const overallFulfillment =
    totalOrderedQty > 0
      ? ((totalDispatchedQty / totalOrderedQty) * 100).toFixed(1)
      : "0";

  // Client summary
  const clientSummary = omPurchaseOrders.reduce(
    (acc, po) => {
      if (!acc[po.clientId]) {
        acc[po.clientId] = {
          clientName: po.clientName,
          totalOrders: 0,
          ordered: 0,
          dispatched: 0,
          remaining: 0,
          value: 0,
        };
      }
      const dispatched = getTotalDispatchedForPO(po.id);
      acc[po.clientId].totalOrders += 1;
      acc[po.clientId].ordered += po.totalQuantity;
      acc[po.clientId].dispatched += dispatched;
      acc[po.clientId].remaining += po.totalQuantity - dispatched;
      acc[po.clientId].value += po.grandTotal;
      return acc;
    },
    {} as Record<string, OMClientSummary>,
  );

  const clientSummaryArray = Object.values(clientSummary);

  // Item summary
  const itemSummary = omPurchaseOrders.reduce(
    (acc, po) => {
      po.lineItems.forEach((item: OMDashboardPO["lineItems"][number]) => {
        if (!acc[item.itemId]) {
          acc[item.itemId] = {
            itemName: item.itemName,
            ordered: 0,
            dispatched: 0,
            remaining: 0,
          };
        }
        const dispatchedForItem = omDispatches
          .filter((d) => d.poId === po.id)
          .reduce((sum, dispatch) => {
            const dispatchItem = dispatch.lineItems.find(
              (di) => di.poLineItemId === item.id,
            );
            return sum + (dispatchItem?.dispatchQty || 0);
          }, 0);

        acc[item.itemId].ordered += item.quantity;
        acc[item.itemId].dispatched += dispatchedForItem;
        acc[item.itemId].remaining += item.quantity - dispatchedForItem;
      });
      return acc;
    },
    {} as Record<string, OMItemSummary>,
  );

  const itemSummaryArray = Object.values(itemSummary);

  // Status breakdown — uses SCREAMING_SNAKE_CASE to match Prisma enum values
  const statusBreakdown = [
    {
      name: "Draft",
      value: omPurchaseOrders.filter((po) => po.status === "DRAFT").length,
      color: "#94a3b8",
    },
    {
      name: "Confirmed",
      value: omPurchaseOrders.filter((po) => po.status === "CONFIRMED").length,
      color: "#3b82f6",
    },
    {
      name: "Partially Dispatched",
      value: omPurchaseOrders.filter(
        (po) => po.status === "PARTIALLY_DISPATCHED",
      ).length,
      color: "#f59e0b",
    },
    {
      name: "Fully Dispatched",
      value: omPurchaseOrders.filter((po) => po.status === "FULLY_DISPATCHED")
        .length,
      color: "#10b981",
    },
    {
      name: "Closed",
      value: omPurchaseOrders.filter((po) => po.status === "CLOSED").length,
      color: "#6b7280",
    },
  ].filter((item) => item.value > 0);

  // Search functionality
  const handleSearch = () => {
    if (searchQuery.trim()) {
      setIsSearching(true);
      fetchData(searchQuery);
    }
  };

  const clearSearch = () => {
    setSearchQuery("");
    setIsSearching(false);
    fetchData("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  if (isLoading) {
    return (
      <Layout isClient={false}>
        <div className="flex h-[80vh] items-center justify-center">
          <p className="text-muted-foreground">Loading dashboard data...</p>
        </div>
      </Layout>
    );
  }

  // Filter results based on search query
  const searchResults = {
    pos: omPurchaseOrders.filter(
      (po) =>
        po.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        po.estimateNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        po.poNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        po.deliveryLocation.toLowerCase().includes(searchQuery.toLowerCase()) ||
        po.lineItems.some((item) =>
          item.itemName.toLowerCase().includes(searchQuery.toLowerCase()),
        ),
    ),
    dispatches: omDispatches.filter(
      (d) =>
        d.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.poNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.lineItems.some((item) =>
          (item.itemName ?? "")
            .toLowerCase()
            .includes(searchQuery.toLowerCase()),
        ),
    ),
    clients: clientSummaryArray.filter((c) =>
      c.clientName.toLowerCase().includes(searchQuery.toLowerCase()),
    ),
    items: itemSummaryArray.filter((i) =>
      i.itemName.toLowerCase().includes(searchQuery.toLowerCase()),
    ),
  };

  // Calculate search result summaries
  const searchSummary =
    searchResults.pos.length > 0 || searchResults.dispatches.length > 0
      ? {
          totalPOs: searchResults.pos.length,
          totalDispatches: searchResults.dispatches.length,
          totalOrdered: searchResults.pos.reduce(
            (sum: number, po) => sum + po.totalQuantity,
            0,
          ),
          totalDispatched: searchResults.pos.reduce(
            (sum: number, po) => sum + getTotalDispatchedForPO(po.id),
            0,
          ),
          totalValue: searchResults.pos.reduce(
            (sum: number, po) => sum + po.grandTotal,
            0,
          ),
        }
      : null;

  return (
    <Layout isClient={false}>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="min-w-0 flex-1">
            <h1 className="text-xl sm:text-2xl font-bold">
              Order Management Dashboard
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground">
              Overview of all purchase orders and dispatches
            </p>
          </div>
        </div>

        {/* Master Search Bar */}
        <Card>
          <CardHeader>
            <CardTitle>Master Search</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by client name, item name, PO number, invoice number, or location..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="pl-10"
                />
              </div>
              {isSearching && (
                <Button variant="outline" size="icon" onClick={clearSearch}>
                  <X className="h-4 w-4" />
                </Button>
              )}
              <Button onClick={handleSearch}>Search</Button>
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              Search across all POs, dispatches, clients, and items
            </p>
          </CardContent>
        </Card>

        {/* Search Results */}
        {isSearching && searchQuery && (
          <Card>
            <CardHeader>
              <CardTitle>
                Search Results for &quot;{searchQuery}&quot;
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {searchSummary && (
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 pb-4 border-b">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Purchase Orders
                    </p>
                    <p className="text-2xl font-bold">
                      {searchSummary.totalPOs}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Dispatches</p>
                    <p className="text-2xl font-bold">
                      {searchSummary.totalDispatches}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Total Ordered
                    </p>
                    <p className="text-2xl font-bold">
                      {searchSummary.totalOrdered}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Total Dispatched
                    </p>
                    <p className="text-2xl font-bold">
                      {searchSummary.totalDispatched}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Value</p>
                    <p className="text-2xl font-bold">
                      ₹{searchSummary.totalValue.toLocaleString("en-IN")}
                    </p>
                  </div>
                </div>
              )}

              {/* Purchase Orders Results */}
              {searchResults.pos.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-3">
                    Purchase Orders ({searchResults.pos.length})
                  </h3>
                  <div className="border rounded-lg">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Estimate Number</TableHead>
                          <TableHead>PO Number</TableHead>
                          <TableHead>Client</TableHead>
                          <TableHead className="text-right">Ordered</TableHead>
                          <TableHead className="text-right">
                            Dispatched
                          </TableHead>
                          <TableHead className="text-right">
                            Remaining
                          </TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {searchResults.pos.map((po) => {
                          const dispatched = getTotalDispatchedForPO(po.id);
                          const remaining = po.totalQuantity - dispatched;
                          return (
                            <TableRow key={po.id}>
                              <TableCell className="font-medium">
                                {po.estimateNumber}
                              </TableCell>
                              <TableCell>{po.poNumber}</TableCell>
                              <TableCell>{po.clientName}</TableCell>
                              <TableCell className="text-right">
                                {po.totalQuantity}
                              </TableCell>
                              <TableCell className="text-right">
                                {dispatched}
                              </TableCell>
                              <TableCell className="text-right">
                                {remaining}
                              </TableCell>
                              <TableCell>
                                <Badge className={getPoStatusClass(po.status)}>
                                  {PO_STATUS_LABELS[po.status] ?? po.status}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-right">
                                <Link
                                  href={`/admin/order-management/purchase-orders/${po.id}`}
                                >
                                  <Button variant="ghost" size="sm">
                                    View
                                  </Button>
                                </Link>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              )}

              {/* Dispatches Results */}
              {searchResults.dispatches.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-3">
                    Dispatches ({searchResults.dispatches.length})
                  </h3>
                  <div className="border rounded-lg">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Invoice Number</TableHead>
                          <TableHead>PO Number</TableHead>
                          <TableHead>Client</TableHead>
                          <TableHead className="text-right">Quantity</TableHead>
                          <TableHead>Courier</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {searchResults.dispatches.map((dispatch) => (
                          <TableRow key={dispatch.id}>
                            <TableCell className="font-medium">
                              {dispatch.invoiceNumber}
                            </TableCell>
                            <TableCell>{dispatch.poNumber}</TableCell>
                            <TableCell>{dispatch.clientName}</TableCell>
                            <TableCell className="text-right">
                              {dispatch.totalDispatchQty}
                            </TableCell>
                            <TableCell>
                              {dispatch.logisticsPartnerName}
                            </TableCell>
                            <TableCell>
                              <Badge
                                className={getDispatchStatusClass(
                                  dispatch.status,
                                )}
                              >
                                {dispatch.status.charAt(0).toUpperCase() +
                                  dispatch.status.slice(1).toLowerCase()}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <Link
                                href={`/admin/order-management/dispatches/${dispatch.id}`}
                              >
                                <Button variant="ghost" size="sm">
                                  View
                                </Button>
                              </Link>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              )}

              {/* Client Summary Results */}
              {searchResults.clients.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-3">
                    Client Summary ({searchResults.clients.length})
                  </h3>
                  <div className="border rounded-lg">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Client</TableHead>
                          <TableHead className="text-right">
                            Total Orders
                          </TableHead>
                          <TableHead className="text-right">Ordered</TableHead>
                          <TableHead className="text-right">
                            Dispatched
                          </TableHead>
                          <TableHead className="text-right">
                            Remaining
                          </TableHead>
                          <TableHead className="text-right">Value</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {searchResults.clients.map((client, index) => (
                          <TableRow key={index}>
                            <TableCell className="font-medium">
                              {client.clientName}
                            </TableCell>
                            <TableCell className="text-right">
                              {client.totalOrders}
                            </TableCell>
                            <TableCell className="text-right">
                              {client.ordered}
                            </TableCell>
                            <TableCell className="text-right">
                              {client.dispatched}
                            </TableCell>
                            <TableCell className="text-right">
                              {client.remaining}
                            </TableCell>
                            <TableCell className="text-right">
                              ₹{client.value.toLocaleString("en-IN")}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              )}

              {/* Item Summary Results */}
              {searchResults.items.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-3">
                    Item Summary ({searchResults.items.length})
                  </h3>
                  <div className="border rounded-lg">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Item</TableHead>
                          <TableHead className="text-right">Ordered</TableHead>
                          <TableHead className="text-right">
                            Dispatched
                          </TableHead>
                          <TableHead className="text-right">
                            Remaining
                          </TableHead>
                          <TableHead className="text-right">
                            Fulfillment
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {searchResults.items.map((item, index) => {
                          const fulfillment =
                            item.ordered > 0
                              ? (
                                  (item.dispatched / item.ordered) *
                                  100
                                ).toFixed(1)
                              : "0";
                          return (
                            <TableRow key={index}>
                              <TableCell className="font-medium">
                                {item.itemName}
                              </TableCell>
                              <TableCell className="text-right">
                                {item.ordered}
                              </TableCell>
                              <TableCell className="text-right">
                                {item.dispatched}
                              </TableCell>
                              <TableCell className="text-right">
                                {item.remaining}
                              </TableCell>
                              <TableCell className="text-right">
                                <Badge
                                  variant={
                                    parseFloat(fulfillment) === 100
                                      ? "default"
                                      : "secondary"
                                  }
                                >
                                  {fulfillment}%
                                </Badge>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              )}

              {searchResults.pos.length === 0 &&
                searchResults.dispatches.length === 0 &&
                searchResults.clients.length === 0 &&
                searchResults.items.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    No results found for &quot;{searchQuery}&quot;
                  </div>
                )}
            </CardContent>
          </Card>
        )}

        {/* Show default dashboard when not searching */}
        {!isSearching && (
          <>
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Active POs
                  </CardTitle>
                  <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalActivePOs}</div>
                  <p className="text-xs text-muted-foreground">
                    Purchase orders in progress
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Order Value
                  </CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    ₹{totalOrderValue.toLocaleString("en-IN")}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Grand total of all orders
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Ordered Quantity
                  </CardTitle>
                  <Package className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalOrderedQty}</div>
                  <p className="text-xs text-muted-foreground">
                    Total items ordered
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Dispatched
                  </CardTitle>
                  <Truck className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalDispatchedQty}</div>
                  <p className="text-xs text-muted-foreground">
                    Items dispatched
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Remaining
                  </CardTitle>
                  <AlertCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalRemainingQty}</div>
                  <p className="text-xs text-muted-foreground">
                    Items pending dispatch
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Overall Fulfillment
                  </CardTitle>
                  <CheckCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {overallFulfillment}%
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Order completion rate
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Status Breakdown */}
              <Card>
                <CardHeader>
                  <CardTitle>Status Breakdown</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={statusBreakdown}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, value }) => `${name}: ${value}`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {statusBreakdown.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Top Clients by Value */}
              <Card>
                <CardHeader>
                  <CardTitle>Client Order Value</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={clientSummaryArray}>
                      <XAxis
                        dataKey="clientName"
                        tickMargin={10}
                        height={60}
                        fontSize={12}
                      />
                      <YAxis />
                      <Tooltip
                        formatter={(value: number | undefined) =>
                          value ? `₹${value.toLocaleString("en-IN")}` : "₹0"
                        }
                      />
                      <Bar dataKey="value" fill="#3b82f6" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Client Summary Table */}
            <Card>
              <CardHeader>
                <CardTitle>Client Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Client</TableHead>
                      <TableHead className="text-right">Total Orders</TableHead>
                      <TableHead className="text-right">Ordered</TableHead>
                      <TableHead className="text-right">Dispatched</TableHead>
                      <TableHead className="text-right">Remaining</TableHead>
                      <TableHead className="text-right">Value</TableHead>
                      <TableHead className="text-right">Fulfillment</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {clientSummaryArray.map((client, index: number) => {
                      const fulfillment =
                        client.ordered > 0
                          ? (
                              (client.dispatched / client.ordered) *
                              100
                            ).toFixed(1)
                          : "0";
                      return (
                        <TableRow key={index}>
                          <TableCell className="font-medium">
                            {client.clientName}
                          </TableCell>
                          <TableCell className="text-right">
                            {client.totalOrders}
                          </TableCell>
                          <TableCell className="text-right">
                            {client.ordered}
                          </TableCell>
                          <TableCell className="text-right">
                            {client.dispatched}
                          </TableCell>
                          <TableCell className="text-right">
                            {client.remaining}
                          </TableCell>
                          <TableCell className="text-right">
                            ₹{client.value.toLocaleString("en-IN")}
                          </TableCell>
                          <TableCell className="text-right">
                            <Badge
                              variant={
                                parseFloat(fulfillment) === 100
                                  ? "default"
                                  : "secondary"
                              }
                            >
                              {fulfillment}%
                            </Badge>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Item Summary Table */}
            <Card>
              <CardHeader>
                <CardTitle>Item Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Item</TableHead>
                      <TableHead className="text-right">Ordered</TableHead>
                      <TableHead className="text-right">Dispatched</TableHead>
                      <TableHead className="text-right">Remaining</TableHead>
                      <TableHead className="text-right">Fulfillment</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {itemSummaryArray.map((item, index: number) => {
                      const fulfillment =
                        item.ordered > 0
                          ? ((item.dispatched / item.ordered) * 100).toFixed(1)
                          : "0";
                      return (
                        <TableRow key={index}>
                          <TableCell className="font-medium">
                            {item.itemName}
                          </TableCell>
                          <TableCell className="text-right">
                            {item.ordered}
                          </TableCell>
                          <TableCell className="text-right">
                            {item.dispatched}
                          </TableCell>
                          <TableCell className="text-right">
                            {item.remaining}
                          </TableCell>
                          <TableCell className="text-right">
                            <Badge
                              variant={
                                parseFloat(fulfillment) === 100
                                  ? "default"
                                  : "secondary"
                              }
                            >
                              {fulfillment}%
                            </Badge>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </Layout>
  );
}
