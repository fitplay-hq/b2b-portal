"use client";

import Layout from "@/components/layout";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
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
  Box,
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
  const [timeRange, setTimeRange] = useState("all");

  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [advancedFilters, setAdvancedFilters] = useState({
    fromDate: "",
    toDate: "",
    clientName: "",
    itemName: "",
    brandName: "",
    logisticsPartnerId: "",
    poNumber: "",
    invoiceNumber: "",
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
  const [poOptions, setPoOptions] = useState<ComboboxOption[]>([]);
  const [invoiceOptions, setInvoiceOptions] = useState<ComboboxOption[]>([]);
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
      if (advancedFilters.poNumber)
        params.append("poNumber", advancedFilters.poNumber);
      if (advancedFilters.invoiceNumber)
        params.append("invoiceNumber", advancedFilters.invoiceNumber);
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
            itemSku: item.product?.sku || null,
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
                itemSku: i.purchaseOrderItem?.product?.sku || null,
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
        const [
          clientsRes,
          productsRes,
          brandsRes,
          logisticsRes,
          locationsRes,
          poOptionsRes,
          invoiceOptionsRes,
        ] = await Promise.all([
          fetch("/api/admin/om/clients"),
          fetch("/api/admin/om/products"),
          fetch("/api/admin/om/brands"),
          fetch("/api/admin/om/logistics-partners"),
          fetch("/api/admin/om/delivery-locations"),
          fetch("/api/admin/om/purchase-orders/options"),
          fetch("/api/admin/om/dispatch-orders/options"),
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
        if (poOptionsRes.ok) {
          const poOpts = await poOptionsRes.json();
          setPoOptions(poOpts);
        }
        if (invoiceOptionsRes.ok) {
          const invOpts = await invoiceOptionsRes.json();
          setInvoiceOptions(invOpts);
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
      poNumber: "",
      invoiceNumber: "",
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
    if (advancedFilters.poNumber) {
      active.push({
        key: "poNumber",
        label: "PO #",
        value: advancedFilters.poNumber,
      });
    }
    if (advancedFilters.invoiceNumber) {
      active.push({
        key: "invoiceNumber",
        label: "Invoice #",
        value: advancedFilters.invoiceNumber,
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

  // Filter results based on search query
  const searchResults = useMemo(() => {
    const pos = omPurchaseOrders.filter(
      (po) =>
        po.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        po.estimateNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        po.poNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        po.deliveryLocation.toLowerCase().includes(searchQuery.toLowerCase()) ||
        po.lineItems.some(
          (item) =>
            item.itemName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.itemSku?.toLowerCase().includes(searchQuery.toLowerCase()),
        ),
    );

    const dispatches = omDispatches.filter(
      (d) =>
        d.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.poNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.lineItems.some(
          (item) =>
            (item.itemName ?? "")
              .toLowerCase()
              .includes(searchQuery.toLowerCase()) ||
            item.itemSku?.toLowerCase().includes(searchQuery.toLowerCase()),
        ),
    );

    // Sum up items matching the search query across all POs
    const itemsMap = new Map<string, any>();
    omPurchaseOrders.forEach((po) => {
      po.lineItems.forEach((item) => {
        if (
          item.itemName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.itemSku?.toLowerCase().includes(searchQuery.toLowerCase())
        ) {
          const existing = itemsMap.get(item.itemName) || {
            itemName: item.itemName,
            itemSku: item.itemSku,
            ordered: 0,
            dispatched: 0,
            remaining: 0,
          };

          existing.ordered += item.quantity;
          // Calculate dispatched for this item in this PO
          const itemDispatched = omDispatches
            .filter((d) => d.poId === po.id)
            .reduce((sum, d) => {
              const dItem = d.lineItems.find(
                (di) => di.itemName === item.itemName,
              );
              return sum + (dItem?.dispatchQty || 0);
            }, 0);

          existing.dispatched += itemDispatched;
          existing.remaining = existing.ordered - existing.dispatched;
          itemsMap.set(item.itemName, existing);
        }
      });
    });

    return {
      pos,
      dispatches,
      items: Array.from(itemsMap.values()),
    };
  }, [omPurchaseOrders, omDispatches, searchQuery]);

  // Calculate if search query looks like a specific field
  const isSkuSearch =
    /^[A-Z0-9-]+$/i.test(searchQuery) &&
    searchQuery.length > 4 &&
    searchResults.items.length > 0;
  const isPoSearch =
    searchQuery.toLowerCase().startsWith("po-") ||
    (searchResults.pos.length === 1 && !isSkuSearch);
  const isDispatchSearch =
    searchQuery.toLowerCase().startsWith("inv-") ||
    (searchResults.dispatches.length === 1 && !isSkuSearch);

  // Calculate search result summaries
  const searchSummary =
    searchResults.pos.length > 0 || searchResults.dispatches.length > 0
      ? {
          totalPOs: searchResults.pos.length,
          totalDispatches: searchResults.dispatches.length,
          totalOrdered: searchResults.pos.reduce(
            (sum: number, po: OMDashboardPO) => sum + po.totalQuantity,
            0,
          ),
          totalDispatched: searchResults.pos.reduce(
            (sum: number, po: OMDashboardPO) =>
              sum + getTotalDispatchedForPO(po.id),
            0,
          ),
          totalValue: searchResults.pos.reduce(
            (sum: number, po: OMDashboardPO) => sum + po.grandTotal,
            0,
          ),
        }
      : null;

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
                  placeholder="Search by client, item, PO/Estimate #, invoice, location, SKU"
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
                      PO Number
                    </label>
                    <SearchableSelect
                      options={poOptions}
                      value={advancedFilters.poNumber}
                      onValueChange={(val) =>
                        setAdvancedFilters((prev) => ({
                          ...prev,
                          poNumber: val,
                        }))
                      }
                      placeholder="Select PO #..."
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Invoice Number
                    </label>
                    <SearchableSelect
                      options={invoiceOptions}
                      value={advancedFilters.invoiceNumber}
                      onValueChange={(val) =>
                        setAdvancedFilters((prev) => ({
                          ...prev,
                          invoiceNumber: val,
                        }))
                      }
                      placeholder="Select Invoice #..."
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
              <CardTitle className="text-xl flex items-center gap-2">
                <Search className="h-5 w-5" />
                Search Results for &quot;{searchQuery}&quot;
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-8 pt-6">
              {/* Dynamic Results Header */}
              {searchSummary && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-muted/30 rounded-lg border border-muted">
                  <div>
                    <p className="text-sm text-muted-foreground">Found POs</p>
                    <p className="text-2xl font-bold">
                      {searchSummary.totalPOs}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Found Dispatches
                    </p>
                    <p className="text-2xl font-bold">
                      {searchSummary.totalDispatches}
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

              {/* Purchase Order Context Results */}
              {searchResults.pos.length > 0 && !isSkuSearch && (
                <div className="space-y-6">
                  {searchResults.pos.map((po) => (
                    <div
                      key={po.id}
                      className="space-y-4 p-4 border rounded-xl bg-card shadow-sm border-muted"
                    >
                      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                          <h3 className="text-lg font-bold flex items-center gap-2">
                            <Package className="h-5 w-5 text-primary" />
                            PO: {po.poNumber || "N/A"}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            Client: {po.clientName} | Estimate:{" "}
                            {po.estimateNumber}
                          </p>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge className={getPoStatusClass(po.status)}>
                            {PO_STATUS_LABELS[po.status] ?? po.status}
                          </Badge>
                          <Link
                            href={`/admin/order-management/purchase-orders/${po.id}`}
                          >
                            <Button variant="outline" size="sm">
                              View Details
                            </Button>
                          </Link>
                        </div>
                      </div>

                      {/* Associated Item Table for PO */}
                      <div className="border rounded-lg overflow-hidden">
                        <Table>
                          <TableHeader className="bg-muted/50">
                            <TableRow>
                              <TableHead className="w-[40%]">
                                Item Name
                              </TableHead>
                              <TableHead className="text-right">
                                Ordered
                              </TableHead>
                              <TableHead className="text-right">Rate</TableHead>
                              <TableHead className="text-right">
                                GST %
                              </TableHead>
                              <TableHead className="text-right">
                                Total (Inc. GST)
                              </TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {po.lineItems.map((item) => (
                              <TableRow key={item.id}>
                                <TableCell className="font-medium">
                                  {item.itemName}
                                  {item.itemSku && (
                                    <span className="block text-[10px] text-muted-foreground font-mono">
                                      {item.itemSku}
                                    </span>
                                  )}
                                </TableCell>
                                <TableCell className="text-right">
                                  {item.quantity}
                                </TableCell>
                                <TableCell className="text-right">
                                  ₹{item.rate.toLocaleString("en-IN")}
                                </TableCell>
                                <TableCell className="text-right">
                                  {item.gstPercentage}%
                                </TableCell>
                                <TableCell className="text-right font-semibold">
                                  ₹{item.totalAmount.toLocaleString("en-IN")}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Dispatch Context Results */}
              {searchResults.dispatches.length > 0 &&
                !isSkuSearch &&
                !isPoSearch && (
                  <div className="space-y-6">
                    {searchResults.dispatches.map((dispatch) => (
                      <div
                        key={dispatch.id}
                        className="space-y-4 p-4 border rounded-xl bg-card shadow-sm border-muted"
                      >
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                          <div>
                            <h3 className="text-lg font-bold flex items-center gap-2">
                              <Truck className="h-5 w-5 text-primary" />
                              Invoice: {dispatch.invoiceNumber}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              Client: {dispatch.clientName} | PO:{" "}
                              {dispatch.poNumber}
                            </p>
                          </div>
                          <div className="flex items-center gap-3">
                            <Badge
                              className={getDispatchStatusClass(
                                dispatch.status,
                              )}
                            >
                              {dispatch.status.charAt(0).toUpperCase() +
                                dispatch.status.slice(1).toLowerCase()}
                            </Badge>
                            <Link
                              href={`/admin/order-management/dispatches/${dispatch.id}`}
                            >
                              <Button variant="outline" size="sm">
                                View Dispatch
                              </Button>
                            </Link>
                          </div>
                        </div>

                        {/* Associated Item Table for Dispatch */}
                        <div className="border rounded-lg overflow-hidden">
                          <Table>
                            <TableHeader className="bg-muted/50">
                              <TableRow>
                                <TableHead className="w-[60%]">
                                  Item Name
                                </TableHead>
                                <TableHead className="text-right">
                                  Dispatched Qty
                                </TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {dispatch.lineItems.map((item, idx) => (
                                <TableRow key={idx}>
                                  <TableCell className="font-medium">
                                    {item.itemName}
                                    {item.itemSku && (
                                      <span className="block text-[10px] text-muted-foreground font-mono">
                                        {item.itemSku}
                                      </span>
                                    )}
                                  </TableCell>
                                  <TableCell className="text-right">
                                    {item.dispatchQty}
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

              {/* SKU / Item Results */}
              {(isSkuSearch ||
                (searchResults.items.length > 0 &&
                  !isPoSearch &&
                  !isDispatchSearch)) && (
                <div className="space-y-4">
                  <h3 className="text-lg font-bold flex items-center gap-2">
                    <Box className="h-5 w-5 text-primary" />
                    Matching Items
                  </h3>
                  <div className="border rounded-lg">
                    <Table>
                      <TableHeader className="bg-muted/50">
                        <TableRow>
                          <TableHead>Item Name</TableHead>
                          <TableHead className="text-right">
                            Total Ordered
                          </TableHead>
                          <TableHead className="text-right">
                            Total Dispatched
                          </TableHead>
                          <TableHead className="text-right">
                            Remaining
                          </TableHead>
                          <TableHead className="text-center">
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
                                {item.itemSku && (
                                  <span className="block text-[10px] text-muted-foreground font-mono">
                                    {item.itemSku}
                                  </span>
                                )}
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
                              <TableCell className="text-center">
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
                searchResults.items.length === 0 && (
                  <div className="text-center py-12 border-2 border-dashed rounded-xl border-muted">
                    <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                    <p className="text-lg font-medium text-muted-foreground">
                      No results found for &quot;{searchQuery}&quot;
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Try searching by SKU, PO #, or Invoice #
                    </p>
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

            {/* Purchase Orders Table */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Recent Purchase Orders</CardTitle>
                  <CardDescription>
                    Main order activity across all clients
                  </CardDescription>
                </div>
                <Link href="/admin/order-management/purchase-orders">
                  <Button variant="outline" size="sm">
                    View All
                  </Button>
                </Link>
              </CardHeader>
              <CardContent>
                <div className="border rounded-lg">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>PO Number</TableHead>
                        <TableHead>Client</TableHead>
                        <TableHead className="text-right">Qty</TableHead>
                        <TableHead className="text-right">Value</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {dashboardPOs.slice(0, 10).map((po) => (
                        <TableRow key={po.id}>
                          <TableCell className="text-xs">
                            {po.poDate
                              ? new Date(po.poDate).toLocaleDateString()
                              : "Draft"}
                          </TableCell>
                          <TableCell className="font-medium">
                            {po.poNumber || po.estimateNumber}
                          </TableCell>
                          <TableCell className="max-w-[150px] truncate">
                            {po.clientName}
                          </TableCell>
                          <TableCell className="text-right">
                            {po.totalQuantity}
                          </TableCell>
                          <TableCell className="text-right">
                            ₹{po.grandTotal.toLocaleString("en-IN")}
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
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>

            {/* Recent Dispatches Table */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Recent Dispatches</CardTitle>
                  <CardDescription>
                    Track latest fulfillment activity
                  </CardDescription>
                </div>
                <Link href="/admin/order-management/dispatches">
                  <Button variant="outline" size="sm">
                    View All
                  </Button>
                </Link>
              </CardHeader>
              <CardContent>
                <div className="border rounded-lg">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Invoice #</TableHead>
                        <TableHead>PO Number</TableHead>
                        <TableHead>Client</TableHead>
                        <TableHead className="text-right">Qty</TableHead>
                        <TableHead>Courier</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {omDispatches.slice(0, 10).map((dispatch) => (
                        <TableRow key={dispatch.id}>
                          <TableCell className="font-medium">
                            {dispatch.invoiceNumber}
                          </TableCell>
                          <TableCell>{dispatch.poNumber}</TableCell>
                          <TableCell className="max-w-[150px] truncate">
                            {dispatch.clientName}
                          </TableCell>
                          <TableCell className="text-right">
                            {dispatch.totalDispatchQty}
                          </TableCell>
                          <TableCell className="text-xs">
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
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </Layout>
  );
}
