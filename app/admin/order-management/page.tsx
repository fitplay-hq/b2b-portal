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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  Calendar,
  Filter,
  RotateCcw,
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
import { Skeleton } from "@/components/ui/skeleton";
import { SearchableSelect, ComboboxOption } from "@/components/ui/combobox";
import { useState, useEffect, useMemo } from "react";
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
      return "bg-gray-100 text-gray-800 hover:bg-gray-100 border-transparent";
    case "CONFIRMED":
      return "bg-blue-100 text-blue-800 hover:bg-blue-100 border-transparent";
    case "PARTIALLY_DISPATCHED":
      return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100 border-transparent";
    case "FULLY_DISPATCHED":
      return "bg-green-100 text-green-800 hover:bg-green-100 border-transparent";
    case "CLOSED":
      return "bg-red-100 text-red-800 hover:bg-red-100 border-transparent";
    default:
      return "bg-gray-100 text-gray-800 hover:bg-gray-100 border-transparent";
  }
};

// Returns Tailwind classes for each Dispatch status
const getDispatchStatusClass = (status: string) => {
  switch (status) {
    case "CREATED":
      return "bg-blue-100 text-blue-800 hover:bg-blue-100 border-transparent";
    case "DISPATCHED":
      return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100 border-transparent";
    case "DELIVERED":
      return "bg-green-100 text-green-800 hover:bg-green-100 border-transparent";
    case "CANCELLED":
      return "bg-red-100 text-red-800 hover:bg-red-100 border-transparent";
    default:
      return "bg-gray-100 text-gray-800 hover:bg-gray-100 border-transparent";
  }
};

export default function OMDashboard() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [omPurchaseOrders, setPurchaseOrders] = useState<OMDashboardPO[]>([]);
  const [omDispatches, setDispatches] = useState<OMDashboardDispatch[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState("today");

  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [advancedFilters, setAdvancedFilters] = useState({
    fromDate: "",
    toDate: "",
    clientName: "",
    itemName: "",
    brandName: "",
    logisticsPartnerId: "",
    locationId: "",
    sku: "",
    docketNumber: "",
    gstPercentage: "",
    minAmount: "",
    maxAmount: "",
    status: "",
  });

  const [clientOptions, setClientOptions] = useState<ComboboxOption[]>([]);
  const [itemOptions, setItemOptions] = useState<ComboboxOption[]>([]);
  const [brandOptions, setBrandOptions] = useState<ComboboxOption[]>([]);
  const [logisticsOptions, setLogisticsOptions] = useState<ComboboxOption[]>(
    [],
  );
  const [locationOptions, setLocationOptions] = useState<ComboboxOption[]>([]);
  const [products, setProducts] = useState<any[]>([]);

  const filteredBrandOptions = useMemo(() => {
    if (!advancedFilters.itemName) return brandOptions;

    const selectedProduct = products.find(
      (p) => p.name === advancedFilters.itemName,
    );
    if (!selectedProduct) return [];

    return (
      selectedProduct.brands?.map((b: any) => ({
        value: b.name,
        label: b.name,
      })) || []
    );
  }, [advancedFilters.itemName, products, brandOptions]);

  const fetchData = async (query: string = "") => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (query) params.append("q", query);
      if (advancedFilters.fromDate)
        params.append("fromDate", advancedFilters.fromDate);
      if (advancedFilters.toDate)
        params.append("toDate", advancedFilters.toDate);
      if (advancedFilters.clientName)
        params.append("clientName", advancedFilters.clientName);
      if (advancedFilters.itemName)
        params.append("itemName", advancedFilters.itemName);
      if (advancedFilters.brandName)
        params.append("brandName", advancedFilters.brandName);
      if (advancedFilters.logisticsPartnerId)
        params.append("logisticsPartnerId", advancedFilters.logisticsPartnerId);
      if (advancedFilters.locationId)
        params.append("locationId", advancedFilters.locationId);
      if (advancedFilters.sku) params.append("sku", advancedFilters.sku);
      if (advancedFilters.docketNumber)
        params.append("docketNumber", advancedFilters.docketNumber);
      if (advancedFilters.gstPercentage)
        params.append("gstPercentage", advancedFilters.gstPercentage);
      if (advancedFilters.minAmount)
        params.append("minAmount", advancedFilters.minAmount);
      if (advancedFilters.maxAmount)
        params.append("maxAmount", advancedFilters.maxAmount);
      if (advancedFilters.status)
        params.append("status", advancedFilters.status);

      const res = await fetch(`/api/admin/om/search?${params.toString()}`);
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
            docketNumber: d.docketNumber || "",
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
    const fetchOptions = async () => {
      try {
        const [clientsRes, productsRes, brandsRes, logisticsRes, locationsRes] =
          await Promise.all([
            fetch("/api/admin/om/clients"),
            fetch("/api/admin/om/products"),
            fetch("/api/admin/om/brands"),
            fetch("/api/admin/om/logistics-partners"),
            fetch("/api/admin/om/delivery-locations"),
          ]);

        if (clientsRes.ok) {
          const clients = await clientsRes.json();
          setClientOptions(
            clients.map((c: any) => ({ value: c.name, label: c.name })),
          );
        }
        if (productsRes.ok) {
          const productsData = await productsRes.json();
          setProducts(productsData);
          setItemOptions(
            productsData.map((p: any) => ({ value: p.name, label: p.name })),
          );
        }
        if (brandsRes.ok) {
          const brands = await brandsRes.json();
          setBrandOptions(
            brands.map((b: any) => ({ value: b.name, label: b.name })),
          );
        }
        if (logisticsRes.ok) {
          const logistics = await logisticsRes.json();
          setLogisticsOptions(
            logistics.map((l: any) => ({ value: l.id, label: l.name })),
          );
        }
        if (locationsRes.ok) {
          const locations = await locationsRes.json();
          setLocationOptions(
            locations.map((l: any) => ({ value: l.id, label: l.name })),
          );
        }
      } catch (err) {
        console.error("Failed to fetch filter options:", err);
      }
    };
    fetchOptions();
  }, []);

  useEffect(() => {
    fetchData(searchQuery);
  }, [advancedFilters]);

  const getTotalDispatchedForPO = (poId: string) => {
    return omDispatches
      .filter((d) => d.poId === poId)
      .reduce((sum, d) => sum + d.totalDispatchQty, 0);
  };

  const getFilteredPOs = () => {
    if (timeRange === "all") return omPurchaseOrders;
    const now = new Date();
    now.setHours(23, 59, 59, 999);

    return omPurchaseOrders.filter((po) => {
      const dateStr = po.poDate || po.estimateDate;
      if (!dateStr) return false;
      const poDate = new Date(dateStr);
      const diffTime = Math.abs(now.getTime() - poDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (timeRange === "today") return diffDays <= 1;
      if (timeRange === "7d") return diffDays <= 7;
      if (timeRange === "30d") return diffDays <= 30;
      return true;
    });
  };

  const dashboardPOs = getFilteredPOs();

  // Summary calculations
  const totalActivePOs = dashboardPOs.filter(
    (po) => po.status !== "CLOSED",
  ).length;
  const totalOrderValue = dashboardPOs.reduce(
    (sum, po) => sum + po.grandTotal,
    0,
  );
  const totalOrderedQty = dashboardPOs.reduce(
    (sum, po) => sum + po.totalQuantity,
    0,
  );
  const totalDispatchedQty = dashboardPOs.reduce(
    (sum, po) => sum + getTotalDispatchedForPO(po.id),
    0,
  );
  const totalRemainingQty = totalOrderedQty - totalDispatchedQty;
  const overallFulfillment =
    totalOrderedQty > 0
      ? ((totalDispatchedQty / totalOrderedQty) * 100).toFixed(1)
      : "0";

  // Client summary
  const clientSummary = dashboardPOs.reduce(
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
  const itemSummary = dashboardPOs.reduce(
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
      value: dashboardPOs.filter((po) => po.status === "DRAFT").length,
      color: "#94a3b8",
    },
    {
      name: "Confirmed",
      value: dashboardPOs.filter((po) => po.status === "CONFIRMED").length,
      color: "#3b82f6",
    },
    {
      name: "Partially Dispatched",
      value: dashboardPOs.filter((po) => po.status === "PARTIALLY_DISPATCHED")
        .length,
      color: "#f59e0b",
    },
    {
      name: "Fully Dispatched",
      value: dashboardPOs.filter((po) => po.status === "FULLY_DISPATCHED")
        .length,
      color: "#10b981",
    },
    {
      name: "Closed",
      value: dashboardPOs.filter((po) => po.status === "CLOSED").length,
      color: "#ef4444",
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

  const resetFilters = () => {
    setAdvancedFilters({
      fromDate: "",
      toDate: "",
      clientName: "",
      itemName: "",
      brandName: "",
      logisticsPartnerId: "",
      locationId: "",
      sku: "",
      docketNumber: "",
      gstPercentage: "",
      minAmount: "",
      maxAmount: "",
      status: "",
    });
    setSearchQuery("");
    setIsSearching(false);
  };

  const removeFilter = (key: string) => {
    setAdvancedFilters((prev) => ({ ...prev, [key]: "" }));
  };

  const getActiveFilters = () => {
    const active = [];
    if (advancedFilters.fromDate)
      active.push({
        key: "fromDate",
        label: "From",
        value: advancedFilters.fromDate,
      });
    if (advancedFilters.toDate)
      active.push({
        key: "toDate",
        label: "To",
        value: advancedFilters.toDate,
      });
    if (advancedFilters.clientName)
      active.push({
        key: "clientName",
        label: "Client",
        value: advancedFilters.clientName,
      });
    if (advancedFilters.itemName)
      active.push({
        key: "itemName",
        label: "Item",
        value: advancedFilters.itemName,
      });
    if (advancedFilters.brandName)
      active.push({
        key: "brandName",
        label: "Brand",
        value: advancedFilters.brandName,
      });
    if (advancedFilters.logisticsPartnerId) {
      const label = logisticsOptions.find(
        (o) => o.value === advancedFilters.logisticsPartnerId,
      )?.label;
      active.push({
        key: "logisticsPartnerId",
        label: "Logistics",
        value: label || advancedFilters.logisticsPartnerId,
      });
    }
    if (advancedFilters.locationId) {
      const label = locationOptions.find(
        (o) => o.value === advancedFilters.locationId,
      )?.label;
      active.push({
        key: "locationId",
        label: "Location",
        value: label || advancedFilters.locationId,
      });
    }
    if (advancedFilters.sku)
      active.push({ key: "sku", label: "SKU", value: advancedFilters.sku });
    if (advancedFilters.docketNumber)
      active.push({
        key: "docketNumber",
        label: "Tracking #",
        value: advancedFilters.docketNumber,
      });
    if (advancedFilters.gstPercentage)
      active.push({
        key: "gstPercentage",
        label: "GST %",
        value: advancedFilters.gstPercentage + "%",
      });
    if (advancedFilters.minAmount)
      active.push({
        key: "minAmount",
        label: "Min Amount",
        value: "₹" + advancedFilters.minAmount,
      });
    if (advancedFilters.maxAmount)
      active.push({
        key: "maxAmount",
        label: "Max Amount",
        value: "₹" + advancedFilters.maxAmount,
      });

    if (advancedFilters.status && advancedFilters.status !== "ALL")
      active.push({
        key: "status",
        label: "Status",
        value:
          PO_STATUS_LABELS[advancedFilters.status] || advancedFilters.status,
      });
    return active;
  };

  if (isLoading) {
    return (
      <Layout isClient={false}>
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="min-w-0 flex-1 space-y-2">
              <Skeleton className="h-8 w-64" />
              <Skeleton className="h-4 w-48" />
            </div>
          </div>

          {/* Master Search Skeleton */}
          <Card>
            <CardHeader className="pb-0">
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent className="pt-6">
              <div className="flex gap-2">
                <Skeleton className="h-10 flex-1" />
                <Skeleton className="h-10 w-24" />
              </div>
            </CardContent>
          </Card>

          {/* Summary Cards Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <Card key={i}>
                <CardHeader className="pb-2">
                  <Skeleton className="h-4 w-28" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-8 w-20 mb-1" />
                  <Skeleton className="h-3 w-40" />
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Charts Skeleton */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader className="pb-0">
                <Skeleton className="h-6 w-48" />
              </CardHeader>
              <CardContent className="h-[300px] flex items-center justify-center pt-6">
                <Skeleton className="h-56 w-56 rounded-full" />
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-0">
                <Skeleton className="h-6 w-48" />
              </CardHeader>
              <CardContent className="h-[300px] flex items-end gap-2 pt-6">
                {[...Array(10)].map((_, i) => (
                  <Skeleton
                    key={i}
                    className="flex-1"
                    style={{ height: `${20 + ((i * 7) % 80)}%` }}
                  />
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Tables Skeleton */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {[...Array(2)].map((_, i) => (
              <Card key={i}>
                <CardHeader className="pb-0">
                  <Skeleton className="h-6 w-48" />
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div className="grid grid-cols-4 gap-4 py-2 border-b">
                      {[...Array(4)].map((_, j) => (
                        <Skeleton key={j} className="h-4 w-full" />
                      ))}
                    </div>
                    {[...Array(4)].map((_, j) => (
                      <div
                        key={j}
                        className="grid grid-cols-4 gap-4 py-3 border-b"
                      >
                        {[...Array(4)].map((_, k) => (
                          <Skeleton key={k} className="h-4 w-full" />
                        ))}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
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
        ) ||
        omDispatches.some(
          (d) =>
            d.poId === po.id &&
            (d.invoiceNumber
              ?.toLowerCase()
              .includes(searchQuery.toLowerCase()) ||
              d.logisticsPartnerName
                ?.toLowerCase()
                .includes(searchQuery.toLowerCase())),
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
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Time Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="7d">Last 7 Days</SelectItem>
                <SelectItem value="30d">Last 30 Days</SelectItem>
                <SelectItem value="all">All Time</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Master Search Bar */}
        <Card>
          <CardHeader className="pb-3 flex flex-row items-center justify-between space-y-0">
            <CardTitle>Master Search</CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              className="h-8 flex gap-2"
            >
              <Filter className="h-4 w-4" />
              {showAdvancedFilters ? "Hide Filters" : "Show Filters"}
            </Button>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by client, item, PO/Estimate #, invoice, tracking #, brand, logistics, location, SKU, rate, amount, GST"
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

            {showAdvancedFilters && (
              <div className="mt-6 pt-6 border-t animate-in fade-in slide-in-from-top-4 duration-300">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 block">
                      From Date
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />
                      <Input
                        type="date"
                        value={advancedFilters.fromDate}
                        onChange={(e) =>
                          setAdvancedFilters((prev) => ({
                            ...prev,
                            fromDate: e.target.value,
                          }))
                        }
                        className="pl-9 text-xs"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 block">
                      To Date
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />
                      <Input
                        type="date"
                        value={advancedFilters.toDate}
                        onChange={(e) =>
                          setAdvancedFilters((prev) => ({
                            ...prev,
                            toDate: e.target.value,
                          }))
                        }
                        className="pl-9 text-xs"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Client Name
                    </label>
                    <SearchableSelect
                      options={clientOptions}
                      value={advancedFilters.clientName}
                      onValueChange={(val) =>
                        setAdvancedFilters((prev) => ({
                          ...prev,
                          clientName: val,
                        }))
                      }
                      placeholder="Select client..."
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Item Name
                    </label>
                    <SearchableSelect
                      options={itemOptions}
                      value={advancedFilters.itemName}
                      onValueChange={(val) => {
                        setAdvancedFilters((prev) => {
                          const newState = { ...prev, itemName: val };
                          if (val) {
                            const selectedProduct = products.find(
                              (p) => p.name === val,
                            );
                            const availableBrands =
                              selectedProduct?.brands?.map(
                                (b: any) => b.name,
                              ) || [];
                            if (!availableBrands.includes(prev.brandName)) {
                              newState.brandName = "";
                            }
                          }
                          return newState;
                        });
                      }}
                      placeholder="Select item..."
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Brand Name
                    </label>
                    <SearchableSelect
                      options={filteredBrandOptions}
                      value={advancedFilters.brandName}
                      onValueChange={(val) =>
                        setAdvancedFilters((prev) => ({
                          ...prev,
                          brandName: val,
                        }))
                      }
                      placeholder={
                        advancedFilters.itemName
                          ? "Select brand..."
                          : "Select item first..."
                      }
                      disabled={!advancedFilters.itemName}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Logistics Partner
                    </label>
                    <SearchableSelect
                      options={logisticsOptions}
                      value={advancedFilters.logisticsPartnerId}
                      onValueChange={(val) =>
                        setAdvancedFilters((prev) => ({
                          ...prev,
                          logisticsPartnerId: val,
                        }))
                      }
                      placeholder="Select partner..."
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Delivery Location
                    </label>
                    <SearchableSelect
                      options={locationOptions}
                      value={advancedFilters.locationId}
                      onValueChange={(val) =>
                        setAdvancedFilters((prev) => ({
                          ...prev,
                          locationId: val,
                        }))
                      }
                      placeholder="Select location..."
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Status
                    </label>
                    <Select
                      value={advancedFilters.status}
                      onValueChange={(val) =>
                        setAdvancedFilters((prev) => ({ ...prev, status: val }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select status..." />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(PO_STATUS_LABELS).map(
                          ([val, label]) => (
                            <SelectItem key={val} value={val}>
                              {label}
                            </SelectItem>
                          ),
                        )}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-end lg:col-span-1 xl:col-start-4">
                    <Button
                      variant="outline"
                      className="w-full flex gap-2"
                      onClick={resetFilters}
                    >
                      <RotateCcw className="h-4 w-4" />
                      Reset All Filters
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {getActiveFilters().length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2 items-center">
                <span className="text-xs text-muted-foreground font-medium mr-1">
                  Active Filters:
                </span>
                {getActiveFilters().map((filter) => (
                  <Badge
                    key={filter.key}
                    variant="secondary"
                    className="flex gap-1 items-center px-2 py-1 bg-blue-50 text-blue-700 border-blue-100 hover:bg-blue-100 transition-colors"
                  >
                    <span className="font-bold opacity-70 uppercase text-[10px]">
                      {filter.label}:
                    </span>
                    <span>{filter.value}</span>
                    <button
                      onClick={() => removeFilter(filter.key)}
                      className="ml-1 hover:text-blue-900 rounded-full hover:bg-blue-200 transition-colors"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={resetFilters}
                  className="h-7 px-2 text-[11px] text-muted-foreground hover:text-foreground"
                >
                  Clear all
                </Button>
              </div>
            )}
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
                          <TableHead>Tracking #</TableHead>
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
                            <TableCell>{dispatch.docketNumber}</TableCell>
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
                        formatter={(value: any) =>
                          typeof value === "number"
                            ? `₹${value.toLocaleString("en-IN")}`
                            : value
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
