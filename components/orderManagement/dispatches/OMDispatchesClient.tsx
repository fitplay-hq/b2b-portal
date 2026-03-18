"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { toast } from "sonner";
import { DeleteConfirmationDialog } from "@/components/delete-confirmation-dialog";
import { type ComboboxOption } from "@/components/ui/combobox";
import type { SortOption } from "@/components/orderManagement/OMSortControl";
import {
  type OMDispatchOrder,
  type TableDispatchOrder,
} from "@/types/order-management";
import { useOMFilters } from "@/hooks/use-om-filters";
import { OMInfiniteScroll } from "@/components/orderManagement/shared/OMInfiniteScroll";
import { type PaginatedResponse } from "@/lib/om-data";
import { DISPATCH_SORT_OPTIONS } from "@/constants/om-sort-options";
import { OMPageHeader } from "@/components/orderManagement/shared/parts/OMPageHeader";
import { useOMClientData } from "@/hooks/use-om-client-data";
import { exportToExcel, exportToPDF } from "@/lib/om-export-utils";
import { OMFilterCard } from "@/components/orderManagement/shared/OMFilterCard";
import { OMActiveFilters } from "@/components/orderManagement/shared/OMActiveFilters";
import { DispatchFilters } from "./DispatchFilters";
import { DispatchesTable } from "./DispatchesTable";
import { DispatchItemTable } from "./DispatchItemTable";
import { Grid3x3, Table as TableIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface OMDispatchesClientProps {
  initialData: PaginatedResponse<OMDispatchOrder>;
  clientOptions: ComboboxOption[];
  logisticsOptions: ComboboxOption[];
  invoiceOptions: ComboboxOption[];
  docketOptions: ComboboxOption[];
}

export function OMDispatchesClient({
  initialData,
  clientOptions,
  logisticsOptions,
  invoiceOptions,
  docketOptions,
}: OMDispatchesClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const [dispatches, setDispatches] = useState<OMDispatchOrder[]>(initialData.data);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState(searchParams.get("q") || "");
  const [sortBy, setSortBy] = useState<SortOption>((searchParams.get("sortBy") as SortOption) || "dispatch_date_desc");
  const [showFilters, setShowFilters] = useState(false);
  const [unfilteredTotal, setUnfilteredTotal] = useState(initialData.meta.total);
  const [currentPage, setCurrentPage] = useState(initialData.meta.page);
  const [hasMore, setHasMore] = useState(initialData.meta.page < initialData.meta.totalPages);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [viewType, setViewType] = useState<"client" | "item">(
    (searchParams.get("view") as "client" | "item") || "client"
  );

  // Helper to update URL
  const updateUrl = useCallback((newParams: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());
    let changed = false;
    
    Object.entries(newParams).forEach(([key, value]) => {
      const currentValue = searchParams.get(key) || "";
      const newValue = value === null || value === "all" ? "" : value;
      
      if (currentValue !== newValue) {
        if (value === null || value === "" || value === "all") {
          params.delete(key);
        } else {
          params.set(key, value);
        }
        changed = true;
      }
    });

    if (changed) {
      params.set("page", "1");
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    }
  }, [searchParams, pathname, router]);

  useEffect(() => {
    const isFiltered = searchParams.get("q") || searchParams.get("status") !== "all" || searchParams.get("clientId");
    if (isFiltered) {
      fetch("/api/admin/om/counts")
        .then(res => res.json())
        .then(data => setUnfilteredTotal(data.dispatches))
        .catch(err => console.error("Failed to fetch dispatch counts", err));
    } else {
      setUnfilteredTotal(initialData.meta.total);
    }
  }, [initialData.meta.total, searchParams]);

  useEffect(() => {
    setDispatches(initialData.data);
    setCurrentPage(initialData.meta.page);
    setHasMore(initialData.meta.page < initialData.meta.totalPages);
  }, [initialData]);

  const loadMore = async () => {
    if (isFetchingMore || !hasMore) return;
    setIsFetchingMore(true);
    try {
      const nextPage = currentPage + 1;
      const url = new URL("/api/admin/om/dispatches", window.location.origin);
      url.searchParams.set("page", nextPage.toString());
      url.searchParams.set("limit", "500");
      
      searchParams.forEach((value, key) => {
        if (key !== "page" && key !== "limit") {
          url.searchParams.set(key, value);
        }
      });

      const res = await fetch(url.toString());
      if (res.ok) {
        const result: PaginatedResponse<OMDispatchOrder> = await res.json();
        setDispatches((prev) => {
          const existingIds = new Set(prev.map(d => d.id));
          const uniqueNewData = result.data.filter(d => !existingIds.has(d.id));
          return [...prev, ...uniqueNewData];
        });
        setCurrentPage(result.meta.page);
        setHasMore(result.meta.page < result.meta.totalPages);
      }
    } catch (err) {
      console.error("Error loading more dispatches:", err);
      toast.error("Failed to load more dispatches");
    } finally {
      setIsFetchingMore(false);
    }
  };

  const { filters, setFilters, resetFilters, activeFilters, removeFilter } =
    useOMFilters({
      initialFilters: {
        fromDate: searchParams.get("fromDate") || "",
        toDate: searchParams.get("toDate") || "",
        status: searchParams.get("status") || "all",
        clientId: searchParams.get("clientId") || "",
        clientName: "",
        logisticsPartnerId: searchParams.get("logisticsPartnerId") || "",
        deliveryLocationId: searchParams.get("deliveryLocationId") || "",
        invoiceNumber: searchParams.get("invoiceNumber") || "",
        docketNumber: searchParams.get("docketNumber") || "",
      },
      labels: {
        fromDate: "From",
        toDate: "To",
        status: "Status",
        clientId: "Client",
        clientName: "Client Name",
        logisticsPartnerId: "Logistics Partner",
        deliveryLocationId: "Location",
        invoiceNumber: "Invoice #",
        docketNumber: "Docket #",
      },
    });

  const filterFn = useCallback((d: TableDispatchOrder, searchTerm: string, filters: Record<string, any>) => {
    const q = searchTerm.toLowerCase().trim();
    const matchesSearch = !q || 
      (d.invoiceNumber || "").toLowerCase().includes(q) || 
      (d.docketNumber || "").toLowerCase().includes(q) || 
      (d.purchaseOrder?.poNumber || "").toLowerCase().includes(q) || 
      (d.purchaseOrder?.client?.name || "").toLowerCase().includes(q);
    
    const matchesStatus = filters.status === "all" || d.status === filters.status;
    const matchesClient = !filters.clientId || d.purchaseOrder?.clientId === filters.clientId;
    const matchesInvoice = !filters.invoiceNumber || d.invoiceNumber === filters.invoiceNumber;
    
    return matchesSearch && matchesStatus && matchesClient && matchesInvoice;
  }, []);

  const sortFn = useCallback((a: TableDispatchOrder, b: TableDispatchOrder, sortBy: SortOption) => {
    const getTime = (date?: string) => (date ? new Date(date).getTime() : 0);

    switch (sortBy) {
      case "dispatch_date_asc":
        return getTime(a.dispatchDate) - getTime(b.dispatchDate);
      case "dispatch_date_desc":
        return getTime(b.dispatchDate) - getTime(a.dispatchDate);
      case "inv_number_asc":
        return (a.invoiceNumber || "").localeCompare(b.invoiceNumber || "");
      case "inv_number_desc":
        return (b.invoiceNumber || "").localeCompare(a.invoiceNumber || "");
      case "po_num_asc":
        return (a.purchaseOrder?.poNumber || "").localeCompare(b.purchaseOrder?.poNumber || "");
      case "po_num_desc":
        return (b.purchaseOrder?.poNumber || "").localeCompare(a.purchaseOrder?.poNumber || "");
      case "name_asc":
        return (a.purchaseOrder?.client?.name || "").localeCompare(b.purchaseOrder?.client?.name || "");
      case "name_desc":
        return (b.purchaseOrder?.client?.name || "").localeCompare(a.purchaseOrder?.client?.name || "");
      case "qty_asc":
        return (a._totalQty || 0) - (b._totalQty || 0);
      case "qty_desc":
        return (b._totalQty || 0) - (a._totalQty || 0);
      case "courier_asc":
        return (a.logisticsPartner?.name || "").localeCompare(b.logisticsPartner?.name || "");
      case "courier_desc":
        return (b.logisticsPartner?.name || "").localeCompare(a.logisticsPartner?.name || "");
      case "tracking_asc":
        return (a.docketNumber || "").localeCompare(b.docketNumber || "");
      case "tracking_desc":
        return (b.docketNumber || "").localeCompare(a.docketNumber || "");
      case "status_asc":
        return (a.status || "").localeCompare(b.status || "");
      case "status_desc":
        return (b.status || "").localeCompare(a.status || "");
      case "newest":
        return getTime(b.createdAt) - getTime(a.createdAt);
      case "oldest":
        return getTime(a.createdAt) - getTime(b.createdAt);
      case "latest_update":
        return getTime(b.updatedAt) - getTime(a.updatedAt);
      default:
        return 0;
    }
  }, []);

  const processedData = useMemo(() => {
    return dispatches
      .map(d => ({
        ...d,
        _totalQty: d.items?.reduce((sum, i) => sum + (i.quantity || 0), 0) || 0,
      }))
      .filter((item) => filterFn(item, searchTerm, filters))
      .sort((a, b) => sortFn(a, b, sortBy));
  }, [dispatches, searchTerm, sortBy, filters, filterFn, sortFn]);

  const processedItemData = useMemo(() => {
    if (viewType !== "item") return [];

    return processedData.flatMap((dispatch) =>
      (dispatch.items || []).map((item, idx) => ({
        ...item,
        dispatchId: dispatch.id,
        invoiceNumber: dispatch.invoiceNumber,
        poNumber: dispatch.purchaseOrder?.poNumber || "N/A",
        clientName: dispatch.purchaseOrder?.client?.name || "N/A",
        itemName: item.product?.name || item.purchaseOrderItem?.product?.name || "N/A",
        dispatchDate: dispatch.dispatchDate || dispatch.invoiceDate,
        status: dispatch.status,
        dispatchQty: item.quantity,
        uniqueKey: `${dispatch.id}-${idx}`,
      }))
    );
  }, [processedData, viewType]);

  // Sync searchTerm with URL (debounced server search)
  useEffect(() => {
    const timer = setTimeout(() => {
      const currentQ = searchParams.get("q") || "";
      if (searchTerm.trim() !== currentQ) {
        updateUrl({ q: searchTerm.trim() || null });
      }
    }, 1000);
    return () => clearTimeout(timer);
  }, [searchTerm, updateUrl, searchParams]);

  // Sync filters with URL
  useEffect(() => {
    const timer = setTimeout(() => {
      const newParams: Record<string, string | null> = {};
      let changed = false;
      Object.entries(filters).forEach(([key, value]) => {
        if (searchParams.get(key) !== (value as string)) {
          newParams[key] = value as string | null;
          changed = true;
        }
      });
      if (changed) updateUrl(newParams);
    }, 1000);
    return () => clearTimeout(timer);
  }, [filters, updateUrl, searchParams]);

  // Sync sortBy with URL
  useEffect(() => {
    const currentSort = (searchParams.get("sortBy") as SortOption) || "dispatch_date_desc";
    if (sortBy !== currentSort) {
      updateUrl({ sortBy });
    }
  }, [sortBy, updateUrl, searchParams]);

  // Sync viewType with URL
  useEffect(() => {
    const currentView = (searchParams.get("view") as "client" | "item") || "client";
    if (viewType !== currentView) {
      updateUrl({ view: viewType });
    }
  }, [viewType, updateUrl, searchParams]);

  const [deleteDispatchId, setDeleteDispatchId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteDispatch = async () => {
    if (!deleteDispatchId) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/admin/om/dispatches/${deleteDispatchId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        toast.success("Dispatch Order deleted successfully");
        router.refresh();
        setDeleteDispatchId(null);
      } else {
        toast.error("Failed to delete Dispatch Order");
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleExportExcel = useCallback(() => {
    const exportData = processedData.map(d => ({
      "Invoice Number": d.invoiceNumber,
      "Date": d.invoiceDate ? new Date(d.invoiceDate).toLocaleDateString() : "-",
      "Dispatch Date": d.dispatchDate ? new Date(d.dispatchDate).toLocaleDateString() : "-",
      "Client": d.purchaseOrder?.client?.name || "-",
      "PO Number": d.purchaseOrder?.poNumber || "-",
      "Total Quantity": d._totalQty || 0,
      "Status": d.status
    }));
    
    if (exportToExcel(exportData, "Dispatch_Orders")) {
      toast.success("Dispatch orders exported to Excel successfully");
    } else {
      toast.error("Failed to export dispatch orders to Excel");
    }
  }, [processedData]);
  const handleExportPDF = useCallback(() => {
    const exportData = processedData.map(d => ({
      "Invoice Number": d.invoiceNumber,
      "Date": d.invoiceDate ? new Date(d.invoiceDate).toLocaleDateString() : "-",
      "Dispatch Date": d.dispatchDate ? new Date(d.dispatchDate).toLocaleDateString() : "-",
      "Client": d.purchaseOrder?.client?.name || "-",
      "PO Number": d.purchaseOrder?.poNumber || "-",
      "Total Quantity": d._totalQty || 0,
      "Status": d.status
    }));
    
    if (exportToPDF(exportData, "Dispatch_Orders", "Dispatch Orders Report")) {
      toast.success("Dispatch orders exported to PDF successfully");
    } else {
      toast.error("Failed to export dispatch orders to PDF");
    }
  }, [processedData]);

  return (
    <div className="space-y-6">
      <OMPageHeader
        title="All Dispatches"
        description="Track and manage order dispatches"
        onExportExcel={handleExportExcel}
        onExportPDF={handleExportPDF}
        addButton={{
          label: "New Dispatch",
          href: "/admin/order-management/dispatches/create"
        }}
      />

      <OMFilterCard
        filteredCount={processedData.length}
        totalCount={unfilteredTotal}
        unit="dispatch orders"
        searchPlaceholder="Search by invoice, docket, PO #, client..."
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        sortBy={sortBy}
        onSortChange={setSortBy}
        sortOptions={DISPATCH_SORT_OPTIONS}
        sortNameLabel="Dispatch Date"
        showFilters={showFilters}
        setShowFilters={setShowFilters}
        onReset={() => {
          setSearchTerm("");
          resetFilters();
          router.push(pathname);
        }}
      >
        <DispatchFilters
          filters={filters}
          setFilters={setFilters}
          sortBy={sortBy}
          onSortChange={(val) => setSortBy(val)}
          clientOptions={clientOptions}
          logisticsOptions={logisticsOptions}
          invoiceOptions={invoiceOptions}
          docketOptions={docketOptions}
        />
        <OMActiveFilters
          activeFilters={activeFilters}
          onRemove={removeFilter}
          onClearAll={() => {
            setSearchTerm("");
            resetFilters();
            router.push(pathname);
          }}
        />
      </OMFilterCard>

      <div className="flex justify-end gap-2 mb-4">
        <Button
          variant={viewType === "client" ? "default" : "outline"}
          size="sm"
          onClick={() => setViewType("client")}
          className="h-8"
        >
          <TableIcon className="h-4 w-4 mr-2" />
          Client View
        </Button>
        <Button
          variant={viewType === "item" ? "default" : "outline"}
          size="sm"
          onClick={() => setViewType("item")}
          className="h-8"
        >
          <Grid3x3 className="h-4 w-4 mr-2" />
          Item View
        </Button>
      </div>

      {viewType === "client" ? (
        <DispatchesTable
          data={processedData}
          isLoading={isLoading}
          sortBy={sortBy}
          onSort={setSortBy}
          onDelete={setDeleteDispatchId}
        />
      ) : (
        <DispatchItemTable
          data={processedItemData}
          isLoading={isLoading}
          sortBy={sortBy}
          onSort={setSortBy}
          onRowClick={(dispatchId) => router.push(`/admin/order-management/dispatches/${dispatchId}`)}
        />
      )}

      <DeleteConfirmationDialog
        isOpen={!!deleteDispatchId}
        onOpenChange={(open) => !open && setDeleteDispatchId(null)}
        onConfirm={handleDeleteDispatch}
        title="Delete Dispatch Order"
        description="Are you sure you want to delete this dispatch order? This action cannot be undone."
        isLoading={isDeleting}
      />

      <OMInfiniteScroll
        onLoadMore={loadMore}
        hasMore={hasMore}
        isLoading={isFetchingMore}
      />
    </div>
  );
}
