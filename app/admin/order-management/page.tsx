"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { MasterSearch } from "@/components/dashboard/master-search/MasterSearch";
import { useMasterSearch } from "@/components/dashboard/master-search/useMasterSearch";
import { useOMFilters } from "@/hooks/use-om-filters";
import {
  OMDashboardDispatch,
  OMDashboardPO,
  OMClientSummary,
  OMItemSummary,
  OMPurchaseOrder,
  OMPurchaseOrderItem,
  OMDispatchOrder,
  OMDispatchOrderItem,
} from "@/types/order-management";

import { SummaryCards } from "@/components/dashboard/order-management/SummaryCards";
import { DashboardCharts } from "@/components/dashboard/order-management/DashboardCharts";
import { SearchResultsList } from "@/components/dashboard/order-management/SearchResultsList";
import {
  getPoStatusClass,
  getDispatchStatusClass,
  PO_STATUS_LABELS,
} from "@/constants/order-management";
import Layout from "@/components/layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ComboboxOption, SearchableSelect } from "@/components/ui/combobox";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  Package,
  Truck,
  Box,
  ChevronUp,
  ChevronDown,
  ShoppingCart,
  TrendingUp,
  CheckCircle,
  AlertCircle,
  Calendar,
  RotateCcw,
  X,
} from "lucide-react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  XAxis,
  YAxis,
  Bar,
} from "recharts";

export default function OMDashboard() {
  const [omPurchaseOrders, setPurchaseOrders] = useState<OMDashboardPO[]>([]);
  const [omDispatches, setDispatches] = useState<OMDashboardDispatch[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const [timeRange, setTimeRange] = useState("all");

  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [clientOptions, setClientOptions] = useState<ComboboxOption[]>([]);
  const [itemOptions, setItemOptions] = useState<ComboboxOption[]>([]);
  const [brandOptions, setBrandOptions] = useState<ComboboxOption[]>([]);
  const [logisticsOptions, setLogisticsOptions] = useState<ComboboxOption[]>(
    [],
  );
  const [poOptions, setPoOptions] = useState<ComboboxOption[]>([]);
  const [invoiceOptions, setInvoiceOptions] = useState<ComboboxOption[]>([]);
  const [docketOptions, setDocketOptions] = useState<ComboboxOption[]>([]);
  const [locationOptions, setLocationOptions] = useState<ComboboxOption[]>([]);
  const [products, setProducts] = useState<any[]>([]);

  const valueLabels = useMemo(
    () => ({
      status: (val: string) => PO_STATUS_LABELS[val] || val,
      gstPercentage: (val: string) => `${val}%`,
      minAmount: (val: string) => `₹${val}`,
      maxAmount: (val: string) => `₹${val}`,
      logisticsPartnerId: (val: string) =>
        logisticsOptions.find((o) => o.value === val)?.label || val,
      locationId: (val: string) =>
        locationOptions.find((o) => o.value === val)?.label || val,
    }),
    [logisticsOptions, locationOptions],
  );

  const {
    filters: advancedFilters,
    setFilters: setAdvancedFilters,
    resetFilters,
    removeFilter,
    activeFilters,
  } = useOMFilters({
    initialFilters: {
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
    },
    labels: {
      fromDate: "From",
      toDate: "To",
      clientName: "Client",
      itemName: "Item",
      brandName: "Brand",
      logisticsPartnerId: "Logistics",
      poNumber: "PO #",
      invoiceNumber: "Invoice #",
      locationId: "Location",
      sku: "SKU",
      docketNumber: "Tracking #",
      gstPercentage: "GST %",
      minAmount: "Min Amount",
      maxAmount: "Max Amount",
      status: "Status",
    },
    valueLabels,
    persistenceKey: "om-dashboard-filters",
  });
  const [expandedSections, setExpandedSections] = useState({
    pos: true,
    dispatches: true,
    items: true,
  });

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section as keyof typeof expandedSections],
    }));
  };

  const filteredBrandOptions = useMemo(() => {
    if (!advancedFilters.itemName) return brandOptions;

    const selectedProduct = products.find(
      (p) => p.name === advancedFilters.itemName,
    );

    return (
      selectedProduct?.brands?.map((b: any) => ({
        value: b.name,
        label: b.name,
      })) || brandOptions
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
        deliveryLocations: po.deliveryLocations?.map((l: any) => l.name) || [],
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
            brandName:
              item.OMBrand?.name || item.product?.brands?.[0]?.name || null,
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
                brandName:
                  i.brandName ||
                  i.purchaseOrderItem?.OMBrand?.name ||
                  i.purchaseOrderItem?.product?.brands?.[0]?.name ||
                  null,
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
      setIsFirstLoad(false);
    }
  };

  const {
    searchQuery,
    setSearchQuery,
    debouncedSearchQuery,
    isSearching,
    setIsSearching,
    searchResults,
    searchSummary,
    handleManualSearch,
    clearSearch,
  } = useMasterSearch({
    omPurchaseOrders,
    omDispatches,
    onManualSearch: fetchData,
  });

  const fetchDynamicOptions = async () => {
    try {
      const clientParam = advancedFilters.clientName
        ? `?clientName=${encodeURIComponent(advancedFilters.clientName)}`
        : "";
      const [poRes, invRes, docketRes] = await Promise.all([
        fetch(`/api/admin/om/purchase-orders/options${clientParam}`),
        fetch(`/api/admin/om/dispatch-orders/options${clientParam}`),
        fetch(
          `/api/admin/om/dispatch-orders/options${clientParam}${clientParam ? "&" : "?"}type=docket`,
        ),
      ]);

      if (poRes.ok) setPoOptions(await poRes.json());
      if (invRes.ok) setInvoiceOptions(await invRes.json());
      if (docketRes.ok) setDocketOptions(await docketRes.json());
    } catch (err) {
      console.error("Failed to fetch dynamic options", err);
    }
  };

  useEffect(() => {
    fetchDynamicOptions();
  }, [advancedFilters.clientName]);

  useEffect(() => {
    const fetchStaticOptions = async () => {
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
    fetchStaticOptions();
  }, []);

  useEffect(() => {
    fetchData(searchQuery);
  }, [advancedFilters]);

  // Load persistence for searchQuery
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("om-master-search-query");
      if (saved) {
        setSearchQuery(saved);
        if (setIsSearching) setIsSearching(true);
      }
    }
  }, [setSearchQuery, setIsSearching]);

  useEffect(() => {
    if (debouncedSearchQuery) {
      fetchData(debouncedSearchQuery);
    }
  }, [debouncedSearchQuery]);

  const getTotalDispatchedForPO = (poId: string) => {
    return omDispatches
      .filter((d) => d.poId === poId)
      .reduce((sum, d) => sum + d.totalDispatchQty, 0);
  };

  const getTotalDispatchedForItem = (poLineItemId: string) => {
    return omDispatches
      .flatMap((d) => d.lineItems)
      .filter((li) => li.poLineItemId === poLineItemId)
      .reduce((sum, li) => sum + (li.dispatchQty || 0), 0);
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

  // Status breakdown — uses PO statuses (OMPoStatus)
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

  // No changes needed here, just context


function DashboardContentSkeleton() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
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
                  <div key={j} className="grid grid-cols-4 gap-4 py-3 border-b">
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
  );
}

  if (isLoading && isFirstLoad) {
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

          <DashboardContentSkeleton />
        </div>
      </Layout>
    );
  }

  return (
    <Layout isClient={false}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="min-w-0 flex-1 flex items-center gap-3">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold">
                Order Management Dashboard
              </h1>
              <p className="text-sm sm:text-base text-muted-foreground">
                Overview of all purchase orders and dispatches
              </p>
            </div>
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
        <MasterSearch
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onSearch={handleManualSearch}
          onClear={clearSearch}
          isSearching={isSearching}
          isFetching={isLoading}
          showAdvancedFilters={showAdvancedFilters}
          setShowAdvancedFilters={setShowAdvancedFilters}
          matchedItems={searchResults.items}
        >
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
                      max={
                        advancedFilters.toDate ||
                        new Date().toISOString().split("T")[0]
                      }
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
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
                      min={advancedFilters.fromDate}
                      max={new Date().toISOString().split("T")[0]}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
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
                      setAdvancedFilters((prev) => ({
                        ...prev,
                        itemName: val,
                      }));
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
                    placeholder="Select brand..."
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
                    Tracking/Docket #
                  </label>
                  <SearchableSelect
                    options={docketOptions}
                    value={advancedFilters.docketNumber}
                    onValueChange={(val) =>
                      setAdvancedFilters((prev) => ({
                        ...prev,
                        docketNumber: val,
                      }))
                    }
                    placeholder="Select tracking #..."
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
                      {Object.entries(PO_STATUS_LABELS).map(([val, label]) => (
                        <SelectItem key={val} value={val}>
                          {label}
                        </SelectItem>
                      ))}
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

          {activeFilters.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2 items-center">
              <span className="text-xs text-muted-foreground font-medium mr-1">
                Active Filters:
              </span>
              {activeFilters.map((filter) => (
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
        </MasterSearch>

        {/* Content Area with skeleton loading */}
        <div className="space-y-6">
          {isLoading && !isFirstLoad ? (
            <DashboardContentSkeleton />
          ) : (
            <>
              {/* Search Results */}
              {isSearching && searchQuery && (
                <SearchResultsList
                  searchResults={searchResults}
                  searchSummary={searchSummary}
                  searchQuery={searchQuery}
                  expandedSections={expandedSections}
                  toggleSection={toggleSection}
                  getTotalDispatchedForItem={getTotalDispatchedForItem}
                  omPurchaseOrders={omPurchaseOrders}
                />
              )}

              {/* Show default dashboard when not searching */}
              {!isSearching && (
                <>
                  <SummaryCards
                    totalActivePOs={totalActivePOs}
                    totalOrderValue={totalOrderValue}
                    overallFulfillment={overallFulfillment}
                    totalOrderedQty={totalOrderedQty}
                    totalDispatchedQty={totalDispatchedQty}
                    totalRemainingQty={totalRemainingQty}
                  />

                  <DashboardCharts
                    statusBreakdown={statusBreakdown}
                    clientSummaryArray={clientSummaryArray}
                  />

                  <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
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
                                <TableHead className="text-left px-3 text-xs uppercase tracking-wider">
                                  Date
                                </TableHead>
                                <TableHead className="text-left px-3 text-xs uppercase tracking-wider">
                                  PO Number
                                </TableHead>
                                <TableHead className="text-left px-3 text-xs uppercase tracking-wider">
                                  Client
                                </TableHead>
                                <TableHead className="text-left px-3 text-xs uppercase tracking-wider">
                                  Qty
                                </TableHead>
                                <TableHead className="text-left px-3 text-xs uppercase tracking-wider">
                                  Value
                                </TableHead>
                                <TableHead className="text-left px-3 text-xs uppercase tracking-wider text-center">
                                  Status
                                </TableHead>
                                <TableHead className="text-center px-3 text-xs uppercase tracking-wider">
                                  Action
                                </TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {omPurchaseOrders
                                .slice(0, 5)
                                .map((po: OMDashboardPO) => (
                                  <TableRow key={po.id} className="text-xs">
                                    <TableCell className="px-3">
                                      {po.poDate
                                        ? new Date(
                                            po.poDate,
                                          ).toLocaleDateString("en-IN")
                                        : "N/A"}
                                    </TableCell>
                                    <TableCell className="font-medium px-3">
                                      {po.poNumber || po.estimateNumber}
                                    </TableCell>
                                    <TableCell className="px-3 max-w-[120px] truncate">
                                      {po.clientName}
                                    </TableCell>
                                    <TableCell className="px-3">
                                      {po.totalQuantity}
                                    </TableCell>
                                    <TableCell className="px-3">
                                      ₹{po.grandTotal.toLocaleString("en-IN")}
                                    </TableCell>
                                    <TableCell className="px-3 text-center">
                                      <Badge
                                        className={getPoStatusClass(po.status)}
                                      >
                                        {PO_STATUS_LABELS[po.status] ??
                                          po.status}
                                      </Badge>
                                    </TableCell>
                                    <TableCell className="px-3 text-center">
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
                                <TableHead className="text-xs uppercase tracking-wider">
                                  Invoice #
                                </TableHead>
                                <TableHead className="text-xs uppercase tracking-wider">
                                  PO #
                                </TableHead>
                                <TableHead className="text-xs uppercase tracking-wider">
                                  Client
                                </TableHead>
                                <TableHead className="text-right text-xs uppercase tracking-wider">
                                  Qty
                                </TableHead>
                                <TableHead className="text-xs uppercase tracking-wider">
                                  Status
                                </TableHead>
                                <TableHead className="text-right text-xs uppercase tracking-wider">
                                  Action
                                </TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {omDispatches.slice(0, 5).map((dispatch) => (
                                <TableRow key={dispatch.id} className="text-xs">
                                  <TableCell className="font-medium">
                                    {dispatch.invoiceNumber || "N/A"}
                                  </TableCell>
                                  <TableCell>{dispatch.poNumber}</TableCell>
                                  <TableCell className="max-w-[120px] truncate">
                                    {dispatch.clientName}
                                  </TableCell>
                                  <TableCell className="text-right">
                                    {dispatch.totalDispatchQty}
                                  </TableCell>
                                  <TableCell>
                                    <Badge
                                      className={getDispatchStatusClass(
                                        dispatch.status,
                                      )}
                                    >
                                      {dispatch.status}
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
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </Layout>
  );
}
