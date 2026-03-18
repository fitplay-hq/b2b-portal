"use client";

import { useMemo, useState, useEffect } from "react";
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
import { PO_STATUS_LABELS } from "@/constants/order-management";
import Layout from "@/components/layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  Calendar,
  RotateCcw,
} from "lucide-react";
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
    router.push(`/admin/order-management?${params.toString()}`);
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

  // Summary calculations
  const dashboardPOs = initialData.pos;
  const totalActivePOs = dashboardPOs.filter(po => po.status !== "CLOSED").length;
  const totalOrderValue = dashboardPOs.reduce((sum, po) => sum + po.grandTotal, 0);
  const totalOrderedQty = dashboardPOs.reduce((sum, po) => sum + po.totalQuantity, 0);
  
  const getTotalDispatchedForPO = (poId: string) => {
    return initialData.dispatches
      .filter((d) => d.poId === poId)
      .reduce((sum, d) => sum + d.totalDispatchQty, 0);
  };

  const totalDispatchedQty = dashboardPOs.reduce((sum, po) => sum + getTotalDispatchedForPO(po.id), 0);
  const totalRemainingQty = totalOrderedQty - totalDispatchedQty;
  const overallFulfillment = totalOrderedQty > 0 ? ((totalDispatchedQty / totalOrderedQty) * 100).toFixed(1) : "0";

  // Client summary
  const clientSummary = dashboardPOs.reduce((acc, po) => {
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
  }, {} as Record<string, OMClientSummary>);

  const clientSummaryArray = Object.values(clientSummary);

  // Item summary
  const itemSummary = dashboardPOs.reduce((acc, po) => {
    po.lineItems.forEach((item) => {
      if (!acc[item.itemId]) {
        acc[item.itemId] = {
          itemName: item.itemName,
          itemSku: item.itemSku,
          ordered: 0,
          dispatched: 0,
          remaining: 0,
        };
      }
      const dispatchedForItem = initialData.dispatches
        .filter((d) => d.poId === po.id)
        .reduce((sum: number, dispatch) => {
          const dispatchItem = dispatch.lineItems.find(di => di.poLineItemId === item.id);
          return sum + (dispatchItem?.dispatchQty || 0);
        }, 0);

      acc[item.itemId].ordered += item.quantity;
      acc[item.itemId].dispatched += dispatchedForItem;
      acc[item.itemId].remaining += item.quantity - dispatchedForItem;
    });
    return acc;
  }, {} as Record<string, OMItemSummary>);

  const itemSummaryArray = Object.values(itemSummary);

  const statusBreakdown = [
    { name: "Draft", value: dashboardPOs.filter(po => po.status === "DRAFT").length, color: "#94a3b8" },
    { name: "Confirmed", value: dashboardPOs.filter(po => po.status === "CONFIRMED").length, color: "#3b82f6" },
    { name: "Partially Dispatched", value: dashboardPOs.filter(po => po.status === "PARTIALLY_DISPATCHED").length, color: "#f59e0b" },
    { name: "Fully Dispatched", value: dashboardPOs.filter(po => po.status === "FULLY_DISPATCHED").length, color: "#10b981" },
    { name: "Closed", value: dashboardPOs.filter(po => po.status === "CLOSED").length, color: "#ef4444" },
  ].filter(item => item.value > 0);

  const getTotalDispatchedForItem = (poLineItemId: string) => {
    return initialData.dispatches
      .flatMap((d) => d.lineItems)
      .filter((li) => li.poLineItemId === poLineItemId)
      .reduce((sum, li) => sum + (li.dispatchQty || 0), 0);
  };

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
            totalActivePOs={totalActivePOs}
            totalOrderValue={totalOrderValue}
            overallFulfillment={overallFulfillment}
            totalOrderedQty={totalOrderedQty}
            totalDispatchedQty={totalDispatchedQty}
            totalRemainingQty={totalRemainingQty}
          />
          <DashboardCharts statusBreakdown={statusBreakdown} clientSummaryArray={clientSummaryArray.slice(0, 10)} />
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
