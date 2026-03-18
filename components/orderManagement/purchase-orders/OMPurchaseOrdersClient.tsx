"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { toast } from "sonner";
import { DeleteConfirmationDialog } from "@/components/delete-confirmation-dialog";
import { OMFilterCard } from "@/components/orderManagement/shared/OMFilterCard";
import { OMActiveFilters } from "@/components/orderManagement/shared/OMActiveFilters";
import { POFilters } from "./POFilters";
import { Button } from "@/components/ui/button";
import { type ComboboxOption } from "@/components/ui/combobox";
import type { SortOption } from "@/components/orderManagement/OMSortControl";
import type {
  OMPurchaseOrder,
} from "@/types/order-management";
import { useOMFilters } from "@/hooks/use-om-filters";
import { OMInfiniteScroll } from "@/components/orderManagement/shared/OMInfiniteScroll";
import { type PaginatedResponse } from "@/lib/om-data";
import { PO_SORT_OPTIONS } from "@/constants/om-sort-options";
import { OMPageHeader } from "@/components/orderManagement/shared/parts/OMPageHeader";
import { useOMClientData } from "@/hooks/use-om-client-data";
import { exportToExcel, exportToPDF } from "@/lib/om-export-utils";
import { POTable } from "./POTable";
import { POItemTable } from "./POItemTable";
import { Grid3x3, Table as TableIcon } from "lucide-react";

const PO_STATUS_LABELS: Record<string, string> = {
  DRAFT: "Draft",
  CONFIRMED: "Confirmed",
  PARTIALLY_DISPATCHED: "Partially Dispatched",
  FULLY_DISPATCHED: "Fully Dispatched",
  CLOSED: "Closed",
};

interface OMPurchaseOrdersClientProps {
  initialData: PaginatedResponse<OMPurchaseOrder>;
  clientOptions: ComboboxOption[];
  locationOptions: ComboboxOption[];
  poOptions: ComboboxOption[];
}

export function OMPurchaseOrdersClient({
  initialData,
  clientOptions,
  locationOptions,
  poOptions,
}: OMPurchaseOrdersClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  
  const [purchaseOrders, setPurchaseOrders] = useState<OMPurchaseOrder[]>(initialData.data);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState(searchParams.get("q") || "");
  const [sortBy, setSortBy] = useState<SortOption>((searchParams.get("sortBy") as SortOption) || "po_date_desc");
  const [showFilters, setShowFilters] = useState(false);
  const [unfilteredTotal, setUnfilteredTotal] = useState(initialData.meta.total);
  const [currentPage, setCurrentPage] = useState(initialData.meta.page);
  const [hasMore, setHasMore] = useState(initialData.meta.page < initialData.meta.totalPages);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [viewType, setViewType] = useState<"client" | "item">(
    (searchParams.get("view") as "client" | "item") || "client"
  );

  const valueLabels = useMemo(
    () => ({
      status: (val: string) => PO_STATUS_LABELS[val] || val,
      locationId: (val: string) =>
        locationOptions.find((o) => o.value === val)?.label || val,
      clientName: (val: string) =>
        clientOptions.find((o) => o.value === val)?.label || val,
    }),
    [locationOptions, clientOptions],
  );

  const { filters, setFilters, resetFilters, activeFilters, removeFilter } =
    useOMFilters({
      initialFilters: {
        fromDate: searchParams.get("fromDate") || "",
        toDate: searchParams.get("toDate") || "",
        clientName: searchParams.get("clientId") || "",
        poNumber: searchParams.get("poNumber") || "",
        status: searchParams.get("status") || "all",
        locationId: searchParams.get("locationId") || "",
      },
      labels: {
        fromDate: "From",
        toDate: "To",
        clientName: "Client",
        poNumber: "PO #",
        locationId: "Location",
        status: "Status",
      },
      valueLabels,
    });

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
        .then(data => setUnfilteredTotal(data.purchaseOrders))
        .catch(err => console.error("Failed to fetch total PO count", err));
    } else {
      setUnfilteredTotal(initialData.meta.total);
    }
  }, [initialData.meta.total, searchParams]);

  useEffect(() => {
    setPurchaseOrders(initialData.data);
    setCurrentPage(initialData.meta.page);
    setHasMore(initialData.meta.page < initialData.meta.totalPages);
  }, [initialData]);

  const loadMore = async () => {
    if (isFetchingMore || !hasMore) return;
    setIsFetchingMore(true);
    try {
      const nextPage = currentPage + 1;
      const url = new URL("/api/admin/om/purchase-orders", window.location.origin);
      url.searchParams.set("page", nextPage.toString());
      url.searchParams.set("limit", "50");
      
      searchParams.forEach((value, key) => {
        if (key !== "page" && key !== "limit") {
          url.searchParams.set(key, value);
        }
      });

      const res = await fetch(url.toString());
      if (res.ok) {
        const result: PaginatedResponse<OMPurchaseOrder> = await res.json();
        setPurchaseOrders((prev) => {
          const existingIds = new Set(prev.map(po => po.id));
          const uniqueNewData = result.data.filter(po => !existingIds.has(po.id));
          return [...prev, ...uniqueNewData];
        });
        setCurrentPage(result.meta.page);
        setHasMore(result.meta.page < result.meta.totalPages);
      }
    } catch (err) {
      console.error("Error loading more POs:", err);
      toast.error("Failed to load more purchase orders");
    } finally {
      setIsFetchingMore(false);
    }
  };

  const filterFn = useCallback((po: OMPurchaseOrder, searchTerm: string, filters: Record<string, any>) => {
    const q = searchTerm.toLowerCase().trim();
    const matchesSearch = !q || 
      (po.poNumber || "").toLowerCase().includes(q) || 
      (po.estimateNumber || "").toLowerCase().includes(q) || 
      (po.client?.name || "").toLowerCase().includes(q);
    
    const matchesStatus = filters.status === "all" || po.status === filters.status;
    const matchesClient = !filters.clientName || po.clientId === filters.clientName;
    const matchesLocation = !filters.locationId || po.deliveryLocations?.some(l => l.id === filters.locationId);
    const matchesPoNumber = !filters.poNumber || po.poNumber === filters.poNumber;
    
    // Date filtering (optional but good for consistency)
    const matchesFromDate = !filters.fromDate || (po.poDate && new Date(po.poDate) >= new Date(filters.fromDate));
    const matchesToDate = !filters.toDate || (po.poDate && new Date(po.poDate) <= new Date(filters.toDate));

    return Boolean(matchesSearch && matchesStatus && matchesClient && matchesLocation && matchesPoNumber && matchesFromDate && matchesToDate);
  }, []);

  const sortFn = useCallback((a: OMPurchaseOrder, b: OMPurchaseOrder, sortBy: SortOption) => {
    switch (sortBy) {
      case "po_date_asc":
        return new Date(a.poDate || 0).getTime() - new Date(b.poDate || 0).getTime();
      case "po_date_desc":
        return new Date(b.poDate || 0).getTime() - new Date(a.poDate || 0).getTime();
      case "po_number_asc":
        return (a.poNumber || "").localeCompare(b.poNumber || "");
      case "po_number_desc":
        return (b.poNumber || "").localeCompare(a.poNumber || "");
      case "client_asc":
        return (a.client?.name || "").localeCompare(b.client?.name || "");
      case "client_desc":
        return (b.client?.name || "").localeCompare(a.client?.name || "");
      default:
        return 0;
    }
  }, []);

  const processedDataFiltered = useOMClientData({
    data: purchaseOrders,
    searchTerm,
    sortBy,
    filters,
    filterFn,
    sortFn,
  });

  const processedData = useMemo(() => {
    return processedDataFiltered.map((po) => {
      const totalQty = po.items?.reduce((sum, i) => sum + i.quantity, 0) || 0;
      const totalDispatched = po.items?.reduce(
        (sum, i) => sum + (i.dispatchItems?.reduce((acc, d: any) => acc + d.quantity, 0) || 0),
        0
      ) || 0;
      const totalAmount = po.items?.reduce((sum, i) => sum + i.totalAmount, 0) || 0;
      
      return {
        ...po,
        _totalQty: totalQty,
        _totalDispatched: totalDispatched,
        _totalRemaining: totalQty - totalDispatched,
        _totalAmount: totalAmount
      };
    });
  }, [processedDataFiltered]);

  const processedItemData = useMemo(() => {
    if (viewType !== "item") return [];
    
    return processedData.flatMap((po) =>
      (po.items || []).map((item) => ({
        ...item,
        poId: po.id,
        poNumber: po.poNumber || po.estimateNumber,
        poDate: po.poDate,
        clientName: po.client?.name || "N/A",
        itemName: item.product?.name || "N/A",
        status: po.status,
      }))
    );
  }, [processedData, viewType]);

  // Sync searchTerm with URL
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm !== (searchParams.get("q") || "")) {
        updateUrl({ q: searchTerm || null });
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm, updateUrl, searchParams]);

  // Sync filters with URL
  useEffect(() => {
    const timer = setTimeout(() => {
      const newParams: Record<string, string | null> = {};
      let changed = false;
      Object.entries(filters).forEach(([key, value]) => {
        if (searchParams.get(key) !== value) {
          newParams[key] = value;
          changed = true;
        }
      });
      if (changed) updateUrl(newParams);
    }, 500);
    return () => clearTimeout(timer);
  }, [filters, updateUrl, searchParams]);

  // Sync sortBy with URL
  useEffect(() => {
    const currentSort = (searchParams.get("sortBy") as SortOption) || "po_date_desc";
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

  const [deletePo, setDeletePo] = useState<OMPurchaseOrder | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeletePO = async () => {
    if (!deletePo) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/admin/om/purchase-orders/${deletePo.id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        toast.success("Purchase Order deleted successfully");
        router.refresh();
        setDeletePo(null);
      } else {
        toast.error("Failed to delete Purchase Order");
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleExportExcel = useCallback(() => {
    const exportData = processedData.map(po => ({
      "PO Number": po.poNumber,
      "Date": po.poDate ? new Date(po.poDate).toLocaleDateString() : "-",
      "Client": po.client?.name || "-",
      "Total Quantity": po._totalQty || 0,
      "Total Amount": po._totalAmount || 0,
      "Status": po.status
    }));
    
    if (exportToExcel(exportData, "Purchase_Orders")) {
      toast.success("Purchase orders exported to Excel successfully");
    } else {
      toast.error("Failed to export purchase orders to Excel");
    }
  }, [processedData]);
  const handleExportPDF = useCallback(() => {
    const exportData = processedData.map(po => ({
      "PO Number": po.poNumber,
      "Date": po.poDate ? new Date(po.poDate).toLocaleDateString() : "-",
      "Client": po.client?.name || "-",
      "Total Quantity": po._totalQty || 0,
      "Total Amount": po._totalAmount || 0,
      "Status": po.status
    }));
    
    if (exportToPDF(exportData, "Purchase_Orders", "Purchase Orders Report")) {
      toast.success("Purchase orders exported to PDF successfully");
    } else {
      toast.error("Failed to export purchase orders to PDF");
    }
  }, [processedData]);

  return (
    <div className="space-y-6">
      <OMPageHeader
        title="All Purchase Orders"
        description="Manage and track client purchase orders"
        onExportExcel={handleExportExcel}
        onExportPDF={handleExportPDF}
        addButton={{
          label: "Create PO",
          onClick: () => router.push("/admin/order-management/purchase-orders/create")
        }}
      />

      <OMFilterCard
        filteredCount={processedData.length}
        totalCount={unfilteredTotal}
        unit="purchase orders"
        searchPlaceholder="Search by PO/Estimate #, client name..."
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        sortBy={sortBy}
        onSortChange={setSortBy}
        sortOptions={PO_SORT_OPTIONS}
        sortNameLabel="PO Date"
        showFilters={showFilters}
        setShowFilters={setShowFilters}
        onReset={() => {
          setSearchTerm("");
          resetFilters();
          router.push(pathname);
        }}
      >
        <POFilters
          filters={filters}
          setFilters={setFilters}
          clientOptions={clientOptions}
          poOptions={poOptions}
          locationOptions={locationOptions}
        />
        <OMActiveFilters
          activeFilters={activeFilters}
          onRemove={removeFilter}
          onClearAll={() => {
            setSearchTerm("");
            resetFilters();
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
        <POTable
          data={processedData}
          isLoading={isLoading}
          sortBy={sortBy}
          onSort={setSortBy}
          onDelete={setDeletePo}
          onRowClick={(po) => router.push(`/admin/order-management/purchase-orders/${po.id}`)}
        />
      ) : (
        <POItemTable
          data={processedItemData}
          isLoading={isLoading}
          sortBy={sortBy}
          onSort={setSortBy}
          onRowClick={(poId) => router.push(`/admin/order-management/purchase-orders/${poId}`)}
        />
      )}

      <DeleteConfirmationDialog
        isOpen={!!deletePo}
        onOpenChange={(open) => !open && setDeletePo(null)}
        onConfirm={handleDeletePO}
        title="Delete Purchase Order"
        description="Are you sure you want to delete this purchase order? This action cannot be undone."
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
