"use client";

import { useMemo, useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { MasterSearch } from "@/components/dashboard/master-search/MasterSearch";
import { useMasterSearch } from "@/components/dashboard/master-search/useMasterSearch";
import { useOMFilters } from "@/hooks/use-om-filters";
import {
  OMDashboardDispatch,
  OMDashboardPO,
  OMClientSummary,
  OMItemSummary,
} from "@/types/order-management";

import { SummaryCards } from "./SummaryCards";
import { DashboardCharts } from "./DashboardCharts";
import { SearchResultsList } from "./SearchResultsList";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@/components/ui/table";
import Link from "next/link";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Calendar,
  RotateCcw,
  Package,
  Truck,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import {
  PO_STATUS_LABELS,
  getPoStatusClass,
  getDispatchStatusClass,
} from "@/constants/order-management";
import { OMSortableHeader } from "@/components/orderManagement/shared/OMSortableHeader";
import {
  ComboboxOption,
  SearchableSelect,
  MultiSearchableSelect,
} from "@/components/ui/combobox";

interface OMDashboardClientProps {
  initialData: {
    pos: OMDashboardPO[];
    dispatches: OMDashboardDispatch[];
  };
  options: {
    clientOptions: ComboboxOption[];
    itemOptions: ComboboxOption[];
    brandOptions: ComboboxOption[];
    logisticsOptions: ComboboxOption[];
    locationOptions: ComboboxOption[];
    products: any[];
  };
  searchParams: Record<string, string | string[] | undefined>;
}

export function OMDashboardClient({
  initialData,
  options,
  searchParams,
}: OMDashboardClientProps) {
  const router = useRouter();
  const searchParamsObj = useSearchParams();

  const [isLoading, setIsLoading] = useState(false);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [timeRange, setTimeRange] = useState((searchParams.timeRange as string) || "all");

  const {
    clientOptions,
    itemOptions,
    brandOptions,
    logisticsOptions,
    locationOptions,
    products,
  } = options;

  const valueLabels = useMemo(
    () => ({
      status: (val: string[]) =>
        val.map((v) => PO_STATUS_LABELS[v] || v).join(", "),
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
  } = useOMFilters({
    initialFilters: {
      fromDate: (searchParams.fromDate as string) || "",
      toDate: (searchParams.toDate as string) || "",
      clientName: (searchParams.clientName as string) || "",
      itemName: (searchParams.itemName as string) || "",
      brandName: (searchParams.brandName as string) || "",
      logisticsPartnerId: (searchParams.logisticsPartnerId as string) || "",
      poNumber: (searchParams.poNumber as string) || "",
      invoiceNumber: (searchParams.invoiceNumber as string) || "",
      locationId: (searchParams.locationId as string) || "",
      sku: (searchParams.sku as string) || "",
      docketNumber: (searchParams.docketNumber as string) || "",
      gstPercentage: (searchParams.gstPercentage as string) || "",
      minAmount: (searchParams.minAmount as string) || "",
      maxAmount: (searchParams.maxAmount as string) || "",
      status: (Array.isArray(searchParams.status) ? searchParams.status : searchParams.status ? [searchParams.status] : []) as string[],
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
      status: "Statuses",
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

  const updateUrl = (newFilters: any, newQuery?: string, newTimeRange?: string) => {
    const params = new URLSearchParams();
    
    // Persist current query if not being updated
    if (newQuery !== undefined) {
      if (newQuery) params.set("q", newQuery);
    } else {
      const q = searchParamsObj.get("q");
      if (q) params.set("q", q);
    }

    // Persist current timeRange if not being updated
    if (newTimeRange) params.set("timeRange", newTimeRange);
    else if (timeRange && timeRange !== "all") params.set("timeRange", timeRange);

    // Apply filters
    Object.entries(newFilters).forEach(([key, value]) => {
      if (value) {
        if (Array.isArray(value)) {
          value.forEach(v => params.append(key, v));
        } else {
          params.set(key, value as string);
        }
      }
    });

    setIsLoading(true);
    router.push(`/admin/order-management?${params.toString()}`, { scroll: false });
  };

  useEffect(() => {
    setIsLoading(false);
  }, [initialData]);

  const {
    searchQuery,
    setSearchQuery,
    isSearching,
    searchResults,
    searchSummary,
    handleManualSearch,
    clearSearch,
  } = useMasterSearch({
    omPurchaseOrders: initialData.pos,
    omDispatches: initialData.dispatches,
    onManualSearch: (q: string) => updateUrl(advancedFilters, q),
  });

  // Optimized lookup maps for dispatch quantities
  const dispatchMaps = useMemo(() => {
    const byPoId: Record<string, number> = {};
    const byPoLineItemId: Record<string, number> = {};

    initialData.dispatches.forEach((d) => {
      byPoId[d.poId] = (byPoId[d.poId] || 0) + d.totalDispatchQty;
      d.lineItems.forEach((li) => {
        byPoLineItemId[li.poLineItemId] = (byPoLineItemId[li.poLineItemId] || 0) + li.dispatchQty;
      });
    });

    return { byPoId, byPoLineItemId };
  }, [initialData.dispatches]);

  // Combined summary calculations to minimize iterations
  const {
    inProgressCount,
    fulfilledCount,
    closedCount,
    inProgressValue,
    fulfillmentValue,
    totalOrderedQty,
    totalDispatchedQty,
    statusBreakdown,
    clientSummaryArray,
    itemSummaryArray,
    totalOrderedValue,
  } = useMemo(() => {
    const dashboardPOs = initialData.pos;
    let inProgressCount = 0;
    let fulfilledCount = 0;
    let closedCount = 0;
    let inProgressValue = 0;
    let fulfillmentValue = 0;
    let totalOrderedValue = 0;
    let orderedQty = 0;
    let dispatchedTotal = 0;

    const statusCounts: Record<string, number> = {
      DRAFT: 0,
      CONFIRMED: 0,
      PARTIALLY_DISPATCHED: 0,
      FULLY_DISPATCHED: 0,
      CLOSED: 0,
    };

    const clientAcc: Record<string, OMClientSummary> = {};
    const itemAcc: Record<string, OMItemSummary> = {};

    dashboardPOs.forEach((po) => {
      // Metric calculations based on status
      if (po.status === "CONFIRMED" || po.status === "PARTIALLY_DISPATCHED") {
        inProgressCount++;
        inProgressValue += po.grandTotal;
      } else if (po.status === "FULLY_DISPATCHED") {
        fulfilledCount++;
      } else if (po.status === "CLOSED") {
        closedCount++;
      }

      // Add to total ordered value for applicable statuses
      if (["CONFIRMED", "PARTIALLY_DISPATCHED", "FULLY_DISPATCHED"].includes(po.status)) {
        totalOrderedValue += po.grandTotal;
      }

      orderedQty += po.totalQuantity;
      
      const dispatchedForPO = dispatchMaps.byPoId[po.id] || 0;
      dispatchedTotal += dispatchedForPO;

      if (statusCounts[po.status] !== undefined) {
        statusCounts[po.status]++;
      }

      // Client summary
      if (!clientAcc[po.clientId]) {
        clientAcc[po.clientId] = {
          clientName: po.clientName,
          totalOrders: 0,
          ordered: 0,
          dispatched: 0,
          remaining: 0,
          value: 0,
        };
      }
      clientAcc[po.clientId].totalOrders += 1;
      clientAcc[po.clientId].ordered += po.totalQuantity;
      clientAcc[po.clientId].dispatched += dispatchedForPO;
      clientAcc[po.clientId].remaining += po.totalQuantity - dispatchedForPO;
      clientAcc[po.clientId].value += po.grandTotal;

      // Item summary
      po.lineItems.forEach((item) => {
        if (!itemAcc[item.itemId]) {
          itemAcc[item.itemId] = {
            itemName: item.itemName,
            itemSku: item.itemSku,
            ordered: 0,
            dispatched: 0,
            remaining: 0,
          };
        }
        const dispatchedForItem = dispatchMaps.byPoLineItemId[item.id] || 0;
        itemAcc[item.itemId].ordered += item.quantity;
        itemAcc[item.itemId].dispatched += dispatchedForItem;
        itemAcc[item.itemId].remaining += item.quantity - dispatchedForItem;

        // Calculate value dispatched for this item
        if (item.quantity > 0) {
          const itemDispatchedValue = (dispatchedForItem / item.quantity) * item.totalAmount;
          fulfillmentValue += itemDispatchedValue;
        }
      });
    });

    const statusBreakdownData = [
      { name: "Draft", value: statusCounts.DRAFT, color: "#94a3b8" },
      { name: "Confirmed", value: statusCounts.CONFIRMED, color: "#3b82f6" },
      { name: "Partially Dispatched", value: statusCounts.PARTIALLY_DISPATCHED, color: "#f59e0b" },
      { name: "Fully Dispatched", value: statusCounts.FULLY_DISPATCHED, color: "#10b981" },
      { name: "Closed", value: statusCounts.CLOSED, color: "#ef4444" },
    ].filter(item => item.value > 0);

    return {
      inProgressCount,
      fulfilledCount,
      closedCount,
      inProgressValue,
      fulfillmentValue,
      totalOrderedQty: orderedQty,
      totalDispatchedQty: dispatchedTotal,
      statusBreakdown: statusBreakdownData,
      clientSummaryArray: Object.values(clientAcc),
      itemSummaryArray: Object.values(itemAcc),
      totalOrderedValue,
    };
  }, [initialData.pos, dispatchMaps]);

  // Handle Recent Orders State & Sorting
  const [poSortBy, setPoSortBy] = useState<string>("date_desc");
  const [dispatchSortBy, setDispatchSortBy] = useState<string>("date_desc");

  const recentPOs = useMemo(() => {
    const flattened = initialData.pos.flatMap((po) =>
      po.lineItems.map((item) => ({
        ...item,
        poId: po.id,
        poNumber: po.poNumber || po.estimateNumber,
        poDate: po.poDate,
        clientName: po.clientName,
        status: po.status,
        deliveryLocations: po.deliveryLocations,
      }))
    );

    return [...flattened].sort((a, b) => {
      const [key, direction] = poSortBy.split("_");
      const isAsc = direction === "asc";
      let comparison = 0;

      switch (key) {
        case "date":
          comparison = new Date(a.poDate || 0).getTime() - new Date(b.poDate || 0).getTime();
          break;
        case "po":
          comparison = (a.poNumber || "").localeCompare(b.poNumber || "");
          break;
        case "client":
          comparison = (a.clientName || "").localeCompare(b.clientName || "");
          break;
        case "item":
          comparison = (a.itemName || "").localeCompare(b.itemName || "");
          break;
        case "qty":
          comparison = a.quantity - b.quantity;
          break;
        case "value":
          comparison = a.totalAmount - b.totalAmount;
          break;
        case "status":
          comparison = (a.status || "").localeCompare(b.status || "");
          break;
        default:
          comparison = 0;
      }

      return isAsc ? comparison : -comparison;
    }).slice(0, 5); // Show top 5 recent
  }, [initialData.pos, poSortBy]);

  const recentDispatches = useMemo(() => {
    const flattened = initialData.dispatches.flatMap((dispatch) =>
      dispatch.lineItems.map((item, idx) => {
        const parentPOItem = initialData.pos
          .flatMap((po) => po.lineItems)
          .find((pi) => pi.id === item.poLineItemId);
        const orderedQty = parentPOItem?.quantity || item.dispatchQty;

        return {
          ...item,
          dispatchId: dispatch.id,
          invoiceNumber: dispatch.invoiceNumber,
          poNumber: dispatch.poNumber,
          clientName: dispatch.clientName,
          dispatchDate: dispatch.dispatchDate || dispatch.invoiceDate,
          logisticsPartnerName: dispatch.logisticsPartnerName,
          status: dispatch.status,
          orderedQty,
          uniqueKey: `${dispatch.id}-${idx}`,
        };
      })
    );

    return [...flattened].sort((a, b) => {
      const [key, direction] = dispatchSortBy.split("_");
      const isAsc = direction === "asc";
      let comparison = 0;

      switch (key) {
        case "date":
          comparison = new Date(a.dispatchDate || 0).getTime() - new Date(b.dispatchDate || 0).getTime();
          break;
        case "inv":
          comparison = (a.invoiceNumber || "").localeCompare(b.invoiceNumber || "");
          break;
        case "po":
          comparison = (a.poNumber || "").localeCompare(b.poNumber || "");
          break;
        case "client":
          comparison = (a.clientName || "").localeCompare(b.clientName || "");
          break;
        case "item":
          comparison = (a.itemName || "").localeCompare(b.itemName || "");
          break;
        case "status":
          comparison = (a.status || "").localeCompare(b.status || "");
          break;
        default:
          comparison = 0;
      }

      return isAsc ? comparison : -comparison;
    }).slice(0, 5); // Show top 5 recent
  }, [initialData.dispatches, dispatchSortBy, initialData.pos]);

  const overallFulfillment = useMemo(() => totalOrderedValue > 0 ? ((fulfillmentValue / totalOrderedValue) * 100).toFixed(1) : "0", [totalOrderedValue, fulfillmentValue]);

  const getTotalDispatchedForItem = useCallback((poLineItemId: string) => {
    return dispatchMaps.byPoLineItemId[poLineItemId] || 0;
  }, [dispatchMaps]);

  const filteredBrandOptions = useMemo(() => {
    if (!advancedFilters.itemName) return brandOptions;
    const selectedProduct = products.find(p => p.name === advancedFilters.itemName);
    return selectedProduct?.brands?.map((b: any) => ({ value: b.name, label: b.name })) || brandOptions;
  }, [advancedFilters.itemName, products, brandOptions]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold">Order Management Dashboard</h1>
          <p className="text-sm sm:text-base text-muted-foreground">Overview of all purchase orders and dispatches</p>
        </div>
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <Select value={timeRange} onValueChange={(val: string) => {
            setTimeRange(val);
            updateUrl(advancedFilters, undefined, val);
          }}>
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
        onClear={() => {
          clearSearch();
          updateUrl(advancedFilters, "");
        }}
        isSearching={isSearching}
        isFetching={isLoading}
        showAdvancedFilters={showAdvancedFilters}
        setShowAdvancedFilters={setShowAdvancedFilters}
        dropdownMatches={searchResults.dropdownMatches}
      >
        {showAdvancedFilters && (
          <div className="mt-6 pt-6 border-t animate-in fade-in slide-in-from-top-4 duration-300">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 block">From Date</label>
                <Input type="date" value={advancedFilters.fromDate} onChange={(e) => {
                  const next = { ...advancedFilters, fromDate: e.target.value };
                  setAdvancedFilters(next);
                  updateUrl(next);
                }} className="text-xs" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 block">To Date</label>
                <Input type="date" value={advancedFilters.toDate} onChange={(e) => {
                  const next = { ...advancedFilters, toDate: e.target.value };
                  setAdvancedFilters(next);
                  updateUrl(next);
                }} className="text-xs" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Client Name</label>
                <SearchableSelect options={clientOptions} value={advancedFilters.clientName} onValueChange={(val) => {
                  const next = { ...advancedFilters, clientName: val };
                  setAdvancedFilters(next);
                  updateUrl(next);
                }} placeholder="Select client..." />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Item Name</label>
                <SearchableSelect options={itemOptions} value={advancedFilters.itemName} onValueChange={(val) => {
                  const next = { ...advancedFilters, itemName: val };
                  setAdvancedFilters(next);
                  updateUrl(next);
                }} placeholder="Select item..." />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">PO Number</label>
                <Input value={advancedFilters.poNumber} onChange={(e) => {
                  const next = { ...advancedFilters, poNumber: e.target.value };
                  setAdvancedFilters(next);
                  updateUrl(next);
                }} placeholder="PO Number..." className="text-xs" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Invoice Number</label>
                <Input value={advancedFilters.invoiceNumber} onChange={(e) => {
                  const next = { ...advancedFilters, invoiceNumber: e.target.value };
                  setAdvancedFilters(next);
                  updateUrl(next);
                }} placeholder="Invoice Number..." className="text-xs" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">SKU</label>
                <Input value={advancedFilters.sku} onChange={(e) => {
                  const next = { ...advancedFilters, sku: e.target.value };
                  setAdvancedFilters(next);
                  updateUrl(next);
                }} placeholder="SKU..." className="text-xs" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Logistics Partner</label>
                <SearchableSelect options={logisticsOptions} value={advancedFilters.logisticsPartnerId} onValueChange={(val) => {
                  const next = { ...advancedFilters, logisticsPartnerId: val };
                  setAdvancedFilters(next);
                  updateUrl(next);
                }} placeholder="Select partner..." />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Location</label>
                <SearchableSelect options={locationOptions} value={advancedFilters.locationId} onValueChange={(val) => {
                  const next = { ...advancedFilters, locationId: val };
                  setAdvancedFilters(next);
                  updateUrl(next);
                }} placeholder="Select location..." />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Status</label>
                <MultiSearchableSelect
                  options={Object.entries(PO_STATUS_LABELS).map(([value, label]) => ({ value, label }))}
                  value={advancedFilters.status}
                  onValueChange={(val: string[]) => {
                    const next = { ...advancedFilters, status: val };
                    setAdvancedFilters(next);
                    updateUrl(next);
                  }}
                  placeholder="Select statuses..."
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Min Amount</label>
                <Input type="number" value={advancedFilters.minAmount} onChange={(e) => {
                  const next = { ...advancedFilters, minAmount: e.target.value };
                  setAdvancedFilters(next);
                  updateUrl(next);
                }} placeholder="Min ₹" className="text-xs" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Max Amount</label>
                <Input type="number" value={advancedFilters.maxAmount} onChange={(e) => {
                  const next = { ...advancedFilters, maxAmount: e.target.value };
                  setAdvancedFilters(next);
                  updateUrl(next);
                }} placeholder="Max ₹" className="text-xs" />
              </div>
            </div>

            <div className="flex justify-end mt-6 pt-4 border-t">
              <Button variant="ghost" size="sm" onClick={() => {
                resetFilters();
                updateUrl({});
              }} className="text-xs gap-2">
                <RotateCcw className="h-3 w-3" />
                Reset Filters
              </Button>
            </div>
          </div>
        )}
      </MasterSearch>

      {!isSearching ? (
        <div className="space-y-6">
          <SummaryCards
            inProgressCount={inProgressCount}
            fulfilledCount={fulfilledCount}
            closedCount={closedCount}
            inProgressValue={inProgressValue}
            fulfillmentValue={fulfillmentValue}
            overallFulfillment={overallFulfillment}
          />
          <DashboardCharts statusBreakdown={statusBreakdown} clientSummaryArray={clientSummaryArray.slice(0, 10)} />
          
          {/* Recent Purchase Orders */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <Package className="h-5 w-5 text-primary" />
                Recent Purchase Orders
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => toggleSection("pos")}
              >
                {expandedSections.pos ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </Button>
            </CardHeader>
            {expandedSections.pos && (
              <CardContent>
                <div className="border rounded-lg overflow-hidden">
                  <Table>
                    <thead className="bg-muted/50 border-b">
                      <TableRow>
                        <OMSortableHeader
                          title="Date"
                          currentSort={poSortBy}
                          onSort={setPoSortBy}
                          ascOption="date_asc"
                          descOption="date_desc"
                          className="text-left px-3 text-xs"
                        />
                        <OMSortableHeader
                          title="PO Number"
                          currentSort={poSortBy}
                          onSort={setPoSortBy}
                          ascOption="po_asc"
                          descOption="po_desc"
                          className="text-left px-3"
                        />
                        <OMSortableHeader
                          title="Client"
                          currentSort={poSortBy}
                          onSort={setPoSortBy}
                          ascOption="client_asc"
                          descOption="client_desc"
                          className="text-left px-3"
                        />
                        <OMSortableHeader
                          title="Item"
                          currentSort={poSortBy}
                          onSort={setPoSortBy}
                          ascOption="item_asc"
                          descOption="item_desc"
                          className="text-left px-3"
                        />
                        <OMSortableHeader
                          title="Qty"
                          currentSort={poSortBy}
                          onSort={setPoSortBy}
                          ascOption="qty_asc"
                          descOption="qty_desc"
                          className="text-left px-3"
                        />
                        <OMSortableHeader
                          title="Value"
                          currentSort={poSortBy}
                          onSort={setPoSortBy}
                          ascOption="value_asc"
                          descOption="value_desc"
                          className="text-left px-3"
                        />
                        <OMSortableHeader
                          title="Status"
                          currentSort={poSortBy}
                          onSort={setPoSortBy}
                          ascOption="status_asc"
                          descOption="status_desc"
                          className="text-left px-3"
                        />
                      </TableRow>
                    </thead>
                    <TableBody>
                      {recentPOs.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell className="text-left px-3 text-xs">
                            {item.poDate ? new Date(item.poDate).toLocaleDateString("en-IN") : "N/A"}
                          </TableCell>
                          <TableCell className="text-left px-3 font-medium text-xs">
                            <Link href={`/admin/order-management/purchase-orders/${item.poId}`} className="hover:underline">
                              {item.poNumber}
                            </Link>
                          </TableCell>
                          <TableCell className="text-left px-3 text-xs truncate max-w-[120px]">
                            {item.clientName || "N/A"}
                          </TableCell>
                          <TableCell className="text-left px-3 text-xs truncate max-w-[150px]">
                            {item.itemName || "N/A"}
                          </TableCell>
                          <TableCell className="text-left px-3 text-xs">
                            {item.quantity}
                          </TableCell>
                          <TableCell className="text-left px-3 text-xs font-medium">
                            ₹{item.totalAmount.toLocaleString("en-IN")}
                          </TableCell>
                          <TableCell className="text-left px-3 text-xs">
                            <Badge className={getPoStatusClass(item.status)}>
                              {PO_STATUS_LABELS[item.status] ?? item.status}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            )}
          </Card>

          {/* Recent Dispatches */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <Truck className="h-5 w-5 text-primary" />
                Recent Dispatches
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => toggleSection("dispatches")}
              >
                {expandedSections.dispatches ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </Button>
            </CardHeader>
            {expandedSections.dispatches && (
              <CardContent>
                <div className="border rounded-lg overflow-hidden">
                  <Table>
                    <thead className="bg-muted/50 border-b">
                      <TableRow>
                        <OMSortableHeader
                          title="Date"
                          currentSort={dispatchSortBy}
                          onSort={setDispatchSortBy}
                          ascOption="date_asc"
                          descOption="date_desc"
                          className="text-left px-3 text-xs"
                        />
                        <OMSortableHeader
                          title="Invoice #"
                          currentSort={dispatchSortBy}
                          onSort={setDispatchSortBy}
                          ascOption="inv_asc"
                          descOption="inv_desc"
                          className="text-left px-3"
                        />
                        <OMSortableHeader
                          title="PO #"
                          currentSort={dispatchSortBy}
                          onSort={setDispatchSortBy}
                          ascOption="po_asc"
                          descOption="po_desc"
                          className="text-left px-3"
                        />
                        <OMSortableHeader
                          title="Client"
                          currentSort={dispatchSortBy}
                          onSort={setDispatchSortBy}
                          ascOption="client_asc"
                          descOption="client_desc"
                          className="text-left px-3"
                        />
                        <OMSortableHeader
                          title="Item"
                          currentSort={dispatchSortBy}
                          onSort={setDispatchSortBy}
                          ascOption="item_asc"
                          descOption="item_desc"
                          className="text-left px-3"
                        />
                        <OMSortableHeader
                          title="Qty"
                          currentSort={dispatchSortBy}
                          onSort={setDispatchSortBy}
                          ascOption="qty_asc"
                          descOption="qty_desc"
                          className="text-left px-3"
                        />
                        <OMSortableHeader
                          title="Status"
                          currentSort={dispatchSortBy}
                          onSort={setDispatchSortBy}
                          ascOption="status_asc"
                          descOption="status_desc"
                          className="text-left px-3"
                        />
                      </TableRow>
                    </thead>
                    <TableBody>
                      {recentDispatches.map((item) => (
                        <TableRow key={item.uniqueKey}>
                          <TableCell className="text-left px-3 text-xs">
                            {item.dispatchDate ? new Date(item.dispatchDate).toLocaleDateString("en-IN") : "N/A"}
                          </TableCell>
                          <TableCell className="text-left px-3 font-medium text-xs">
                            <Link href={`/admin/order-management/dispatches/${item.dispatchId}`} className="hover:underline">
                              {item.invoiceNumber}
                            </Link>
                          </TableCell>
                          <TableCell className="text-left px-3 text-xs">
                            {item.poNumber || "N/A"}
                          </TableCell>
                          <TableCell className="text-left px-3 text-xs truncate max-w-[120px]">
                            {item.clientName || "N/A"}
                          </TableCell>
                          <TableCell className="text-left px-3 text-xs truncate max-w-[150px]">
                            {item.itemName || "N/A"}
                          </TableCell>
                          <TableCell className="text-left px-3 text-xs font-medium text-blue-600">
                            {item.dispatchQty}
                          </TableCell>
                          <TableCell className="text-left px-3 text-xs">
                            <Badge className={getDispatchStatusClass(item.status)}>
                              {item.status.charAt(0).toUpperCase() + item.status.slice(1).toLowerCase()}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            )}
          </Card>
        </div>
      ) : (
        <SearchResultsList
          searchResults={searchResults}
          searchSummary={searchSummary}
          searchQuery={searchQuery}
          expandedSections={expandedSections}
          toggleSection={toggleSection}
          getTotalDispatchedForItem={getTotalDispatchedForItem}
          omPurchaseOrders={initialData.pos}
        />
      )}
    </div>
  );
}
