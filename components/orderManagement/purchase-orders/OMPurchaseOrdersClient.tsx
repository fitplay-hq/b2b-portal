"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
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
import { 
  useMutatePurchaseOrders
} from "@/data/om/admin.hooks";

const PO_STATUS_LABELS: Record<string, string> = {
  DRAFT: "Draft",
  CONFIRMED: "Confirmed",
  PARTIALLY_DISPATCHED: "Partially Dispatched",
  FULLY_DISPATCHED: "Fully Dispatched",
  CLOSED: "Closed",
};

interface OMPurchaseOrdersClientProps {
  initialData?: PaginatedResponse<OMPurchaseOrder>;
  clientOptions?: ComboboxOption[];
  locationOptions?: ComboboxOption[];
  poOptions?: ComboboxOption[];
}

export function OMPurchaseOrdersClient({
  initialData,
  clientOptions: propsClientOptions,
  locationOptions: propsLocationOptions,
  poOptions: propsPoOptions,
}: OMPurchaseOrdersClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  

  // 2. Fetch options via SWR

  const clientOptions = useMemo(() => propsClientOptions || [], [propsClientOptions]);
  const locationOptions = useMemo(() => propsLocationOptions || [], [propsLocationOptions]);
  const poOptions = useMemo(() => propsPoOptions || [], [propsPoOptions]);

  const [searchTerm, setSearchTerm] = useState(searchParams.get("q") || "");
  const [sortBy, setSortBy] = useState<SortOption>((searchParams.get("sortBy") as SortOption) || "po_date_desc");
  const [showFilters, setShowFilters] = useState(false);
  const [viewType, setViewType] = useState<"client" | "item">(
    (searchParams.get("view") as "client" | "item") || "client"
  );

  const [purchaseOrders, setPurchaseOrders] = useState<OMPurchaseOrder[]>(initialData?.data || []);
  const [currentPage, setCurrentPage] = useState(initialData?.meta.page || 1);
  const [hasMore, setHasMore] = useState(initialData ? initialData.meta.page < initialData.meta.totalPages : false);
  const [isFetchingMore, setIsFetchingMore] = useState(false);


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
    // Initial sync from server data (Fresh from router.refresh() or initial load)
    if (initialData) {
      setPurchaseOrders(initialData.data);
      setCurrentPage(initialData.meta.page);
      setHasMore(initialData.meta.page < initialData.meta.totalPages);
    }
  }, [initialData]);

  const loadMore = async () => {
    if (isFetchingMore || !hasMore) return;
    setIsFetchingMore(true);
    try {
      const nextPage = currentPage + 1;
      const url = new URL("/api/admin/om/purchase-orders", window.location.origin);
      url.searchParams.set("page", nextPage.toString());
      url.searchParams.set("limit", "500");
      
      searchParams.forEach((value, key) => {
        if (key !== "page" && key !== "limit") {
          url.searchParams.set(key, value);
        }
      });

      const res = await fetch(url.toString());
      if (res.ok) {
        const result: PaginatedResponse<OMPurchaseOrder> = await res.json();
        setPurchaseOrders((prev) => {
          const existingIds = new Set(prev.map(p => p.id));
          const uniqueNewData = result.data.filter(p => !existingIds.has(p.id));
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

  // Silent background prefetching
  useEffect(() => {
    if (hasMore && !isFetchingMore) {
      const timer = setTimeout(() => {
        loadMore();
      }, 2000); // 2 second delay between background fetches
      return () => clearTimeout(timer);
    }
  }, [hasMore, isFetchingMore]);

  const filterFn = useCallback((po: OMPurchaseOrder, searchTerm: string, filters: Record<string, any>) => {
    const q = searchTerm.toLowerCase().trim();
    const matchesSearch = !q || 
      (po.poNumber || "").toLowerCase().includes(q) || 
      (po.estimateNumber || "").toLowerCase().includes(q) || 
      (po.client?.name || "").toLowerCase().includes(q) ||
      po.items?.some(i => 
        (i.product?.name || "").toLowerCase().includes(q) || 
        (i.OMBrand?.name || i.product?.OMBrand?.name || "").toLowerCase().includes(q)
      );
    
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
      case "ordered_asc": {
        return (a.totalQuantity || 0) - (b.totalQuantity || 0);
      }
      case "ordered_desc": {
        return (b.totalQuantity || 0) - (a.totalQuantity || 0);
      }
      case "dispatched_asc": {
        return (a.dispatchedQuantity || 0) - (b.dispatchedQuantity || 0);
      }
      case "dispatched_desc": {
        return (b.dispatchedQuantity || 0) - (a.dispatchedQuantity || 0);
      }
      case "remaining_asc": {
        return (a.remainingQuantity || 0) - (b.remainingQuantity || 0);
      }
      case "remaining_desc": {
        return (b.remainingQuantity || 0) - (a.remainingQuantity || 0);
      }
      case "value_asc": {
        return (a.grandTotal || 0) - (b.grandTotal || 0);
      }
      case "value_desc": {
        return (b.grandTotal || 0) - (a.grandTotal || 0);
      }
      case "status_asc":
        return (a.status || "").localeCompare(b.status || "");
      case "status_desc":
        return (b.status || "").localeCompare(a.status || "");
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
    return processedDataFiltered.map((po: OMPurchaseOrder) => {
      const totalQty = po.totalQuantity || 0;
      const totalDispatched = po.dispatchedQuantity || 0;
      const totalAmount = po.grandTotal || 0;

      // FIFO Check for PO level (Client View)
      const otherClientPOs = purchaseOrders
        .filter((p) => p.clientId === po.clientId && p.id !== po.id)
        .sort((a, b) => new Date(a.poDate || a.createdAt || 0).getTime() - new Date(b.poDate || b.createdAt || 0).getTime());

      const currentPoDate = new Date(po.poDate || po.createdAt || 0).getTime();
      let isFifoBlocked = false;
      let blockingPoNumber = "";

      if (po.status === "CONFIRMED" || po.status === "PARTIALLY_DISPATCHED") {
        for (const item of po.items || []) {
          const olderPO = otherClientPOs.find(p => {
            const otherDate = new Date(p.poDate || p.createdAt || 0).getTime();
            if (otherDate >= currentPoDate) return false;
            return p.items?.some(oi => {
              if (oi.productId !== item.productId) return false;
              return (oi.remainingQuantity || 0) > 0;
            });
          });
          if (olderPO) {
            isFifoBlocked = true;
            blockingPoNumber = olderPO.poNumber || olderPO.estimateNumber || "Older PO";
            break;
          }
        }
      }
      
      return {
        ...po,
        _totalQty: totalQty,
        _totalDispatched: totalDispatched,
        _totalRemaining: totalQty - totalDispatched,
        _totalAmount: totalAmount,
        _isFifoBlocked: isFifoBlocked,
        _blockingPoNumber: blockingPoNumber
      };
    });
  }, [processedDataFiltered, purchaseOrders]);

  const processedItemData = useMemo(() => {
    if (viewType !== "item") return [];
    
    let items = processedData.flatMap((po: any) =>
      (po.items || []).map((item: any) => {
        const itemDispatched = item.dispatchedQuantity || 0;
        
        // Item-level FIFO check
        const otherClientPOs = purchaseOrders
          .filter((p) => p.clientId === po.clientId && p.id !== po.id)
          .sort((a, b) => new Date(a.poDate || a.createdAt || 0).getTime() - new Date(b.poDate || b.createdAt || 0).getTime());
        
        const currentPoDate = new Date(po.poDate || po.createdAt || 0).getTime();
        const olderPO = otherClientPOs.find(p => {
          const otherDate = new Date(p.poDate || p.createdAt || 0).getTime();
          if (otherDate >= currentPoDate) return false;
          return p.items?.some(oi => {
            if (oi.productId !== item.productId) return false;
            return (oi.remainingQuantity || 0) > 0;
          });
        });

        return {
          ...item,
          poId: po.id,
          poNumber: po.poNumber || po.estimateNumber,
          poDate: po.poDate,
          clientName: po.client?.name || "N/A",
          itemName: item.product?.name || "N/A",
          brandName: item.OMBrand?.name || item.product?.OMBrand?.name || "N/A",
          status: po.status,
          itemDispatched,
          itemRemaining: item.quantity - itemDispatched,
          isFifoBlocked: !!olderPO,
          blockingPoNumber: olderPO?.poNumber || olderPO?.estimateNumber || "Older PO",
        };
      })
    );

    // Apply search filtering for items
    const q = searchTerm.toLowerCase().trim();
    if (q) {
      items = items.filter((item: any) => 
        (item.poNumber || "").toLowerCase().includes(q) ||
        (item.clientName || "").toLowerCase().includes(q) ||
        (item.itemName || "").toLowerCase().includes(q) ||
        (item.brandName || "").toLowerCase().includes(q)
      );
    }

    // Apply item-level sorting for specific fields
    if (sortBy === "name_asc") {
      items.sort((a: any, b: any) => a.itemName.localeCompare(b.itemName));
    } else if (sortBy === "name_desc") {
      items.sort((a: any, b: any) => b.itemName.localeCompare(a.itemName));
    } else if (sortBy === "qty_asc") {
      items.sort((a: any, b: any) => a.quantity - b.quantity);
    } else if (sortBy === "qty_desc") {
      items.sort((a: any, b: any) => b.quantity - a.quantity);
    } else if (sortBy === "dispatched_asc") {
      items.sort((a: any, b: any) => (a as any).itemDispatched - (b as any).itemDispatched);
    } else if (sortBy === "dispatched_desc") {
      items.sort((a: any, b: any) => (b as any).itemDispatched - (a as any).itemDispatched);
    } else if (sortBy === "remaining_asc") {
      items.sort((a: any, b: any) => (a as any).itemRemaining - (b as any).itemRemaining);
    } else if (sortBy === "remaining_desc") {
      items.sort((a: any, b: any) => (b as any).itemRemaining - (a as any).itemRemaining);
    } else if (sortBy === "value_asc") {
      items.sort((a: any, b: any) => a.totalAmount - b.totalAmount);
    } else if (sortBy === "value_desc") {
      items.sort((a: any, b: any) => b.totalAmount - a.totalAmount);
    }
    
    return items;
  }, [processedData, viewType, sortBy]);

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

  const { deletePurchaseOrder } = useMutatePurchaseOrders();
  const [deletePo, setDeletePo] = useState<OMPurchaseOrder | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeletePO = async () => {
    if (!deletePo) return;
    setIsDeleting(true);
    const success = await deletePurchaseOrder(deletePo.id);
    if (success) {
      toast.success("Purchase Order deleted successfully");
      router.refresh();
      setDeletePo(null);
    } else {
      toast.error("Failed to delete Purchase Order");
    }
    setIsDeleting(false);
  };

  const handleExportExcel = useCallback(() => {
    let exportData: any[] = [];
    let filename = "Purchase_Orders";

    if (viewType === "item") {
      exportData = processedItemData.map((item: any) => ({
        "PO / Estimate #": item.poNumber,
        "Date": item.poDate ? new Date(item.poDate).toLocaleDateString() : "-",
        "Client": item.clientName,
        "Item Name": item.itemName,
        "Brand": item.brandName,
        "Quantity": item.quantity,
        "Dispatched": item.itemDispatched,
        "Remaining": item.itemRemaining,
        "Total Value": item.totalAmount || 0,
        "Status": item.status
      }));
      filename = "Purchase_Order_Items";
    } else {
      exportData = processedData.map((po: any) => ({
        "PO / Estimate #": po.poNumber || po.estimateNumber,
        "Date": po.poDate ? new Date(po.poDate).toLocaleDateString() : "-",
        "Client": po.client?.name || "-",
        "Total Quantity": po._totalQty || 0,
        "Total Amount": po._totalAmount || 0,
        "Status": po.status
      }));
    }
    
    if (exportToExcel(exportData, filename)) {
      toast.success(`${viewType === "item" ? "Item list" : "Purchase orders"} exported to Excel successfully`);
    } else {
      toast.error(`Failed to export to Excel`);
    }
  }, [processedData, processedItemData, viewType]);

  const handleExportPDF = useCallback(() => {
    let exportData: any[] = [];
    let filename = "Purchase_Orders";
    let title = "Purchase Orders Report";

    if (viewType === "item") {
      exportData = processedItemData.map((item: any) => ({
        "PO / Est #": item.poNumber,
        "Date": item.poDate ? new Date(item.poDate).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "-",
        "Client": item.clientName,
        "Item Name": item.itemName,
        "Brand": item.brandName,
        "Qty": item.quantity,
        "Disp": item.itemDispatched,
        "Rem": item.itemRemaining,
        "Value": item.totalAmount || 0,
        "Status": item.status
      }));
      filename = "Purchase_Order_Items";
      title = "Purchase Order Items Report";
    } else {
      exportData = processedData.map((po: any) => ({
        "PO / Est #": po.poNumber || po.estimateNumber,
        "Date": po.poDate ? new Date(po.poDate).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "-",
        "Client": po.client?.name || "-",
        "Total Qty": po._totalQty || 0,
        "Total Amount": po._totalAmount || 0,
        "Status": po.status
      }));
    }
    
    if (exportToPDF(exportData, filename, title)) {
      toast.success(`${viewType === "item" ? "Item list" : "Purchase orders"} exported to PDF successfully`);
    } else {
      toast.error(`Failed to export to PDF`);
    }
  }, [processedData, processedItemData, viewType]);

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
        totalCount={initialData?.meta?.unfilteredTotal || initialData?.meta?.total || purchaseOrders.length}
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
          isLoading={false}
          sortBy={sortBy}
          onSort={setSortBy}
          onDelete={setDeletePo}
          onRowClick={(po: any) => router.push(`/admin/order-management/purchase-orders/${po.id}`)}
        />
      ) : (
        <POItemTable
          data={processedItemData}
          isLoading={false}
          sortBy={sortBy}
          onSort={setSortBy}
          onDelete={setDeletePo}
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
