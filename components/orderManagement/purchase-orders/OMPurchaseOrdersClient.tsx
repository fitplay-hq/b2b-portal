"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Eye, Edit, Trash2, Plus, Download, FileSpreadsheet, FileDown } from "lucide-react";
import { toast } from "sonner";
import { DeleteConfirmationDialog } from "@/components/delete-confirmation-dialog";
import { OMDataTable } from "@/components/orderManagement/shared/OMDataTable";
import { OMSortableHeader } from "@/components/orderManagement/shared/OMSortableHeader";
import { formatStatus } from "@/lib/utils";
import { format } from "date-fns";
import {
  TableRow,
  TableCell,
  TableHead,
} from "@/components/ui/table";
import { OMFilterCard } from "@/components/orderManagement/shared/OMFilterCard";
import { OMActiveFilters } from "@/components/orderManagement/shared/OMActiveFilters";
import { POFilters } from "./POFilters";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { type ComboboxOption } from "@/components/ui/combobox";
import { Badge } from "@/components/ui/badge";
import type { SortOption } from "@/components/orderManagement/OMSortControl";
import type {
  OMPurchaseOrder,
} from "@/types/order-management";
import { useOMFilters } from "@/hooks/use-om-filters";
import { OMInfiniteScroll } from "@/components/orderManagement/shared/OMInfiniteScroll";
import { type PaginatedResponse } from "@/lib/om-data";
import { PO_SORT_OPTIONS } from "@/constants/om-sort-options";

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
  const [purchaseOrders, setPurchaseOrders] = useState<OMPurchaseOrder[]>(initialData.data);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("po_date_desc");
  const [showFilters, setShowFilters] = useState(false);
  const [totalCount, setTotalCount] = useState(initialData.meta.total);
  const [isHydrating, setIsHydrating] = useState(false);

  const [currentPage, setCurrentPage] = useState(initialData.meta.page);
  const [hasMore, setHasMore] = useState(initialData.meta.page < initialData.meta.totalPages);
  const [isFetchingMore, setIsFetchingMore] = useState(false);

  useEffect(() => {
    setPurchaseOrders(initialData.data);
    setTotalCount(initialData.meta.total);
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

  const hydrateData = async () => {
    if (isHydrating || !hasMore) return;
    setIsHydrating(true);
    try {
      let nextP = currentPage + 1;
      let more: boolean = hasMore;
      while (more) {
        const url = new URL("/api/admin/om/purchase-orders", window.location.origin);
        url.searchParams.set("page", nextP.toString());
        url.searchParams.set("limit", "50");
        const res = await fetch(url.toString());
        if (!res.ok) break;
        const result: PaginatedResponse<OMPurchaseOrder> = await res.json();
        setPurchaseOrders((prev) => {
          const existingIds = new Set(prev.map(po => po.id));
          const uniqueNewData = result.data.filter(po => !existingIds.has(po.id));
          return [...prev, ...uniqueNewData];
        });
        nextP = result.meta.page + 1;
        more = result.meta.page < result.meta.totalPages;
        setCurrentPage(result.meta.page);
        setHasMore(more);
        await new Promise(r => setTimeout(r, 100));
      }
    } catch (err) {
      console.error("Hydration failed:", err);
    } finally {
      setIsHydrating(false);
    }
  };


  const fetchPurchaseOrders = async () => {
    setIsLoading(true);
    try {
      const url = new URL("/api/admin/om/purchase-orders", window.location.origin);
      url.searchParams.set("page", "1");
      url.searchParams.set("limit", "50");

      const res = await fetch(url.toString());
      if (res.ok) {
        const result: PaginatedResponse<OMPurchaseOrder> = await res.json();
        setPurchaseOrders(result.data);
        setTotalCount(result.meta.total);
        setCurrentPage(result.meta.page);
        setHasMore(result.meta.page < result.meta.totalPages);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to load purchase orders");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const fetchTotalCount = async () => {
      try {
        const res = await fetch("/api/admin/om/counts");
        if (res.ok) {
          const data = await res.json();
          setTotalCount(data.purchaseOrders);
        }
      } catch (err) {
        console.error("Failed to fetch total count:", err);
      }
    };
    fetchTotalCount();
  }, []);

  const [deletePo, setDeletePo] = useState<OMPurchaseOrder | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const valueLabels = useMemo(
    () => ({
      status: (val: string) => PO_STATUS_LABELS[val] || val,
      locationId: (val: string) =>
        locationOptions.find((o) => o.value === val)?.label || val,
    }),
    [locationOptions],
  );

  const { filters, setFilters, resetFilters, activeFilters, removeFilter } =
    useOMFilters({
      initialFilters: {
        fromDate: "",
        toDate: "",
        clientName: "",
        poNumber: "",
        status: "all",
        locationId: "",
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

  useEffect(() => {
    const isSearchActive =
      searchTerm.length > 0 ||
      Object.values(filters).some((v) => v && v !== "all");
    if (isSearchActive && hasMore && !isHydrating) {
      void hydrateData();
    }
  }, [searchTerm, filters, hasMore, isHydrating, hydrateData]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchPurchaseOrders();
    }, 500);
    return () => clearTimeout(timer);
  }, [sortBy]);


  const handleDeletePO = async () => {
    if (!deletePo) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/admin/om/purchase-orders/${deletePo.id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        toast.success("Purchase Order deleted successfully");
        fetchPurchaseOrders();
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

  const filteredPOs = useMemo(() => {
    return purchaseOrders
      .filter((po) => {
        // Advanced filters
        if (filters.status !== "all" && po.status !== filters.status)
          return false;
        if (
          filters.poNumber &&
          !po.poNumber?.toLowerCase().includes(filters.poNumber.toLowerCase())
        )
          return false;
        if (
          filters.fromDate &&
          new Date(po.poDate!) < new Date(filters.fromDate)
        )
          return false;
        if (filters.toDate && new Date(po.poDate!) > new Date(filters.toDate))
          return false;
        if (filters.clientName && po.client?.name !== filters.clientName)
          return false;

        const searchLower = searchTerm.toLowerCase();
        const poNum = (po.poNumber || "").toLowerCase();
        const estNum = (po.estimateNumber || "").toLowerCase();
        const clientName = (po.client?.name || "").toLowerCase();

        return (
          poNum.includes(searchLower) ||
          estNum.includes(searchLower) ||
          clientName.includes(searchLower)
        );
      })
      .sort((a, b) => {
        if (sortBy === "po_date_asc" || sortBy === "oldest")
          return new Date(a.poDate || 0).getTime() - new Date(b.poDate || 0).getTime();
        if (sortBy === "po_date_desc" || sortBy === "newest")
          return new Date(b.poDate || 0).getTime() - new Date(a.poDate || 0).getTime();

        if (sortBy === "po_number_asc")
          return (a.poNumber || "").localeCompare(b.poNumber || "");
        if (sortBy === "po_number_desc")
          return (b.poNumber || "").localeCompare(a.poNumber || "");

        if (sortBy === "client_asc")
          return (a.client?.name || "").localeCompare(b.client?.name || "");
        if (sortBy === "client_desc")
          return (b.client?.name || "").localeCompare(a.client?.name || "");

        if (sortBy === "status_asc") return a.status.localeCompare(b.status);
        if (sortBy === "status_desc") return b.status.localeCompare(a.status);

        const getQty = (po: OMPurchaseOrder) =>
          po.items?.reduce((sum, i) => sum + i.quantity, 0) || 0;
        const getDispatched = (po: OMPurchaseOrder) =>
          po.items?.reduce(
            (sum, i) =>
              sum +
              (i.dispatchItems?.reduce((acc, d) => acc + d.quantity, 0) || 0),
            0,
          ) || 0;
        const getValue = (po: OMPurchaseOrder) =>
          po.items?.reduce((sum, i) => sum + i.totalAmount, 0) || 0;

        if (sortBy === "ordered_asc") return getQty(a) - getQty(b);
        if (sortBy === "ordered_desc") return getQty(b) - getQty(a);

        if (sortBy === "dispatched_asc")
          return getDispatched(a) - getDispatched(b);
        if (sortBy === "dispatched_desc")
          return getDispatched(b) - getDispatched(a);

        if (sortBy === "remaining_asc")
          return getQty(a) - getDispatched(a) - (getQty(b) - getDispatched(b));
        if (sortBy === "remaining_desc")
          return getQty(b) - getDispatched(b) - (getQty(a) - getDispatched(a));

        if (sortBy === "value_asc") return getValue(a) - getValue(b);
        if (sortBy === "value_desc") return getValue(b) - getValue(a);

        return 0;
      });
  }, [purchaseOrders, searchTerm, filters, sortBy]);

  const handleExportExcel = () => {
    toast.info("Exporting to Excel...");
  };

  const handleExportPDF = () => {
    toast.info("Exporting to PDF...");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Purchase Orders</h1>
          <p className="text-muted-foreground">
            Manage client purchase orders and estimates
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" disabled={isLoading}>
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleExportExcel}>
                <FileSpreadsheet className="h-4 w-4 mr-2" />
                Excel Format
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleExportPDF}>
                <FileDown className="h-4 w-4 mr-2" />
                PDF Document
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Link href="/admin/order-management/purchase-orders/create">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create PO
            </Button>
          </Link>
        </div>
      </div>

      <OMFilterCard
        title="Filters"
        subtitle={`Showing ${totalCount} of ${totalCount} purchase orders`}
        searchPlaceholder="Search by PO/Estimate #, client name..."
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        sortBy={sortBy as any}
        onSortChange={setSortBy as any}
        sortOptions={PO_SORT_OPTIONS}
        sortNameLabel="PO Date"
        showFilters={showFilters}
        setShowFilters={setShowFilters}
        onReset={() => {
          setSearchTerm("");
          resetFilters();
        }}
        isHydrating={isHydrating}
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

      <OMDataTable
        data={filteredPOs}
        isLoading={isLoading}
        columnCount={9}
        emptyMessage="No purchase orders found."
        onRowClick={(po) =>
          router.push(`/admin/order-management/purchase-orders/${po.id}`)
        }
        header={
          <TableRow>
            <OMSortableHeader
              title="PO Date"
              currentSort={sortBy}
              onSort={setSortBy}
              ascOption="po_date_asc"
              descOption="po_date_desc"
            />
            <OMSortableHeader
              title="PO / Estimate"
              currentSort={sortBy}
              onSort={setSortBy}
              ascOption="po_number_asc"
              descOption="po_number_desc"
            />
            <OMSortableHeader
              title="Client"
              currentSort={sortBy}
              onSort={setSortBy}
              ascOption="client_asc"
              descOption="client_desc"
            />
            <OMSortableHeader
              title="Total Ordered"
              currentSort={sortBy}
              onSort={setSortBy}
              ascOption="ordered_asc"
              descOption="ordered_desc"
              className="text-right"
            />
            <OMSortableHeader
              title="Dispatched"
              currentSort={sortBy}
              onSort={setSortBy}
              ascOption="dispatched_asc"
              descOption="dispatched_desc"
              className="text-right"
            />
            <OMSortableHeader
              title="Remaining"
              currentSort={sortBy}
              onSort={setSortBy}
              ascOption="remaining_asc"
              descOption="remaining_desc"
              className="text-right"
            />
            <OMSortableHeader
              title="Total Value"
              currentSort={sortBy}
              onSort={setSortBy}
              ascOption="value_asc"
              descOption="value_desc"
              className="text-right"
            />
            <OMSortableHeader
              title="Status"
              currentSort={sortBy}
              onSort={setSortBy}
              ascOption="status_asc"
              descOption="status_desc"
            />
            <TableHead className="text-right w-[100px] pr-7">Actions</TableHead>
          </TableRow>
        }
        renderRow={(po: OMPurchaseOrder) => {
          const totalQty =
            po.items?.reduce((sum, i) => sum + i.quantity, 0) || 0;
          const totalDispatched =
            po.items?.reduce(
              (sum, i) =>
                sum +
                (i.dispatchItems?.reduce(
                  (acc, d: any) => acc + d.quantity,
                  0,
                ) || 0),
              0,
            ) || 0;
          const totalRemaining = totalQty - totalDispatched;
          const totalAmount =
            po.items?.reduce((sum, i) => sum + i.totalAmount, 0) || 0;

          return (
            <TableRow key={po.id}>
              <TableCell>
                {po.poDate ? format(new Date(po.poDate), "dd MMM yyyy") : "N/A"}
              </TableCell>
              <TableCell>
                <div className="font-medium">
                  {po.poNumber || po.estimateNumber}
                </div>
                {po.poNumber && po.estimateNumber && (
                  <div className="text-xs text-muted-foreground">
                    Est: {po.estimateNumber}
                  </div>
                )}
              </TableCell>
              <TableCell>{po.client?.name || "N/A"}</TableCell>
              <TableCell className="text-right">{totalQty}</TableCell>
              <TableCell className="text-right">{totalDispatched}</TableCell>
              <TableCell className="text-right">{totalRemaining}</TableCell>
              <TableCell className="text-right font-medium">
                ₹
                {totalAmount.toLocaleString("en-IN", {
                  minimumFractionDigits: 2,
                })}
              </TableCell>
              <TableCell>
                <Badge
                  className={
                    po.status === "DRAFT"
                      ? "bg-gray-100 text-gray-800 hover:bg-gray-100 border-transparent line-clamp-1"
                      : po.status === "CONFIRMED"
                        ? "bg-blue-100 text-blue-800 hover:bg-blue-100 border-transparent line-clamp-1"
                        : po.status === "PARTIALLY_DISPATCHED"
                          ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-100 border-transparent line-clamp-1"
                          : po.status === "FULLY_DISPATCHED"
                            ? "bg-green-100 text-green-800 hover:bg-green-100 border-transparent line-clamp-1"
                            : po.status === "CLOSED"
                              ? "bg-red-100 text-red-800 hover:bg-red-100 border-transparent line-clamp-1"
                              : "bg-gray-100 text-gray-800 hover:bg-gray-100 border-transparent line-clamp-1"
                  }
                >
                  {formatStatus(po.status)}
                </Badge>
              </TableCell>
              <TableCell
                className="text-right"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    asChild
                    title="View Details"
                  >
                    <Link
                      href={`/admin/order-management/purchase-orders/${po.id}`}
                    >
                      <Eye className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    asChild
                    title="Edit PO"
                  >
                    <Link
                      href={`/admin/order-management/purchase-orders/${po.id}/edit`}
                    >
                      <Edit className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                    onClick={() => setDeletePo(po)}
                    title="Delete PO"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          );
        }}
      />

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
