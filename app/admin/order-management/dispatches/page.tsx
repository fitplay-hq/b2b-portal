"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Layout from "@/components/layout";
import { TableCell, TableHead, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import {
  Plus,
  Search,
  Eye,
  FileDown,
  FileSpreadsheet,
  Trash2,
  Edit,
  ChevronDown,
  ArrowLeft,
} from "lucide-react";
import { toast } from "sonner";
import { formatStatus, formatDisplayDate } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SearchableSelect, type ComboboxOption } from "@/components/ui/combobox";
import {
  type OMDispatchOrder,
  type OMDispatchOrderItem,
  type OMClient,
  type OMDispatchStatus,
  OM_DISPATCH_STATUS_CONFIG,
  getDispatchStatusVisuals,
} from "@/types/order-management";
import { DeleteConfirmationDialog } from "@/components/delete-confirmation-dialog";
import {
  type SortOption,
} from "@/components/orderManagement/OMSortControl";
import { OMFilterCard } from "@/components/orderManagement/shared/OMFilterCard";
import { OMActiveFilters } from "@/components/orderManagement/shared/OMActiveFilters";
import { DispatchFilters } from "@/components/orderManagement/dispatches/DispatchFilters";
import { OMDataTable } from "@/components/orderManagement/shared/OMDataTable";
import { OMSortableHeader } from "@/components/orderManagement/shared/OMSortableHeader";
import { useOMFilters } from "@/hooks/use-om-filters";
import { useDispatches } from "@/hooks/use-dispatches";
import { DISPATCH_SORT_OPTIONS } from "@/constants/om-sort-options";

export default function OMDispatches() {
  const router = useRouter();
  const { dispatches, isLoading, mutate } = useDispatches();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("dispatch_date_desc");
  const [showFilters, setShowFilters] = useState(false);

  const [clientOptions, setClientOptions] = useState<ComboboxOption[]>([]);
  const [logisticsOptions, setLogisticsOptions] = useState<ComboboxOption[]>([]);
  const [invoiceOptions, setInvoiceOptions] = useState<ComboboxOption[]>([]);
  const [docketOptions, setDocketOptions] = useState<ComboboxOption[]>([]);

  const { filters, setFilters, resetFilters, activeFilters, removeFilter } =
    useOMFilters({
      initialFilters: {
        fromDate: "",
        toDate: "",
        clientName: "",
        logisticsPartnerId: "",
        status: "all",
        invoiceNumber: "",
        docketNumber: "",
      },
      labels: {
        fromDate: "From",
        toDate: "To",
        clientName: "Client",
        logisticsPartnerId: "Logistics",
        status: "Status",
        invoiceNumber: "Invoice #",
        docketNumber: "Tracking #",
      },
      valueLabels: {
        status: (val) =>
          OM_DISPATCH_STATUS_CONFIG[val as OMDispatchStatus]?.label || val,
        logisticsPartnerId: (val) =>
          logisticsOptions.find((o) => o.value === val)?.label || val,
      },
    });

  const fetchFilters = async () => {
    try {
      const [clientsRes, logisticsRes, invoicesRes, docketsRes] =
        await Promise.all([
          fetch("/api/admin/om/clients"),
          fetch("/api/admin/om/logistics-partners"),
          fetch("/api/admin/om/dispatches/invoice-options"),
          fetch("/api/admin/om/dispatches/docket-options"),
        ]);

      if (clientsRes.ok) {
        const data = await clientsRes.json();
        setClientOptions(
          data.map((c: any) => ({ value: c.name, label: c.name })),
        );
      }
      if (logisticsRes.ok) {
        const data = await logisticsRes.json();
        setLogisticsOptions(
          data.map((l: any) => ({ value: l.id, label: l.name })),
        );
      }
      if (invoicesRes.ok) {
        const data = await invoicesRes.json();
        setInvoiceOptions(data);
      }
      if (docketsRes.ok) {
        const data = await docketsRes.json();
        setDocketOptions(data);
      }
    } catch (err) {
      console.error("Failed to fetch filters", err);
    }
  };

  useEffect(() => {
    fetchFilters();
  }, []);

  const resetFiltersAll = () => {
    setSearchTerm("");
    resetFilters();
  };

  const getTotalQty = (dispatch: OMDispatchOrder) => {
    return (dispatch.items || []).reduce((sum, item) => sum + item.quantity, 0);
  };

  const getGrandTotal = (dispatch: OMDispatchOrder) => {
    return (dispatch.items || []).reduce(
      (sum, item) => sum + (item.totalAmount || 0),
      0,
    );
  };

  const filteredDispatches = useMemo(() => {
    
    return dispatches
      .filter((dispatch: OMDispatchOrder) => {
        // Advanced filters
        if (filters.status !== "all" && dispatch.status !== filters.status)
          return false;
        if (
          filters.invoiceNumber &&
          dispatch.invoiceNumber !== filters.invoiceNumber
        )
          return false;
        if (
          filters.docketNumber &&
          dispatch.docketNumber !== filters.docketNumber
        )
          return false;
        if (
          filters.clientName &&
          dispatch.purchaseOrder?.client?.name !== filters.clientName
        )
          return false;
        if (
          filters.logisticsPartnerId &&
          dispatch.logisticsPartnerId !== filters.logisticsPartnerId
        )
          return false;

        const date = dispatch.dispatchDate
          ? new Date(dispatch.dispatchDate)
          : null;
        if (filters.fromDate && date && date < new Date(filters.fromDate))
          return false;
        if (filters.toDate && date && date > new Date(filters.toDate))
          return false;

        const searchLower = searchTerm.toLowerCase();
        return (
          (dispatch.invoiceNumber || "").toLowerCase().includes(searchLower) ||
          (dispatch.docketNumber || "").toLowerCase().includes(searchLower) ||
          (dispatch.purchaseOrder?.client?.name || "")
            .toLowerCase()
            .includes(searchLower) ||
          (dispatch.purchaseOrder?.poNumber || "")
            .toLowerCase()
            .includes(searchLower)
        );
      })
      .sort((a: OMDispatchOrder, b: OMDispatchOrder) => {
        if (sortBy === "dispatch_date_asc" || sortBy === "oldest") {
          return (
            new Date(a.dispatchDate || 0).getTime() -
            new Date(b.dispatchDate || 0).getTime()
          );
        }
        if (sortBy === "dispatch_date_desc" || sortBy === "newest") {
          return (
            new Date(b.dispatchDate || 0).getTime() -
            new Date(a.dispatchDate || 0).getTime()
          );
        }
        if (sortBy === "inv_number_asc")
          return (a.invoiceNumber || "").localeCompare(b.invoiceNumber || "");
        if (sortBy === "inv_number_desc")
          return (b.invoiceNumber || "").localeCompare(a.invoiceNumber || "");
        if (sortBy === "po_num_asc")
          return (a.purchaseOrder?.poNumber || "").localeCompare(
            b.purchaseOrder?.poNumber || "",
          );
        if (sortBy === "po_num_desc")
          return (b.purchaseOrder?.poNumber || "").localeCompare(
            a.purchaseOrder?.poNumber || "",
          );
        if (sortBy === "name_asc")
          return (a.purchaseOrder?.client?.name || "").localeCompare(
            b.purchaseOrder?.client?.name || "",
          );
        if (sortBy === "name_desc")
          return (b.purchaseOrder?.client?.name || "").localeCompare(
            a.purchaseOrder?.client?.name || "",
          );
        if (sortBy === "status_asc") return a.status.localeCompare(b.status);
        if (sortBy === "status_desc") return b.status.localeCompare(a.status);
        if (sortBy === "qty_asc") return getTotalQty(a) - getTotalQty(b);
        if (sortBy === "qty_desc") return getTotalQty(b) - getTotalQty(a);
        if (sortBy === "courier_asc") {
          const aCourier = a.logisticsPartner?.name || "";
          const bCourier = b.logisticsPartner?.name || "";
          return aCourier.localeCompare(bCourier);
        }
        if (sortBy === "courier_desc") {
          const aCourier = a.logisticsPartner?.name || "";
          const bCourier = b.logisticsPartner?.name || "";
          return bCourier.localeCompare(aCourier);
        }
        if (sortBy === "tracking_asc") {
          const aTracking = a.docketNumber || "";
          const bTracking = b.docketNumber || "";
          return aTracking.localeCompare(bTracking);
        }
        if (sortBy === "tracking_desc") {
          const aTracking = a.docketNumber || "";
          const bTracking = b.docketNumber || "";
          return bTracking.localeCompare(aTracking);
        }
        return 0;
      });
  }, [dispatches, searchTerm, filters, sortBy]);

  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleDelete = (id: string) => {
    setDeleteId(id);
    setIsDeleteDialogOpen(true);
  };

  const onConfirmDelete = async () => {
    if (!deleteId) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/admin/om/dispatch-orders/${deleteId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        toast.success("Dispatch order deleted successfully");
        mutate();
        setIsDeleteDialogOpen(false);
      } else {
        const error = await res.json();
        toast.error(error.error || "Failed to delete dispatch order");
      }
    } catch (err) {
      console.error("Error deleting Dispatch:", err);
      toast.error("An error occurred while deleting the dispatch order");
    } finally {
      setIsDeleting(false);
      setDeleteId(null);
    }
  };

  const getStatusColor = (status: string) => {
    return getDispatchStatusVisuals(status).color;
  };

  // Export to CSV/Excel
  const exportToExcel = () => {
    const headers = [
      "Dispatch Date",
      "Invoice Number",
      "PO Number",
      "Client",
      "Total Qty",
      "Courier",
      "Tracking Number",
      "Expected Delivery",
      "Status",
      "Total Value",
    ];

    const rows = filteredDispatches.map((dispatch: OMDispatchOrder) => {
      const totalQty = getTotalQty(dispatch);
      const grandTotal = getGrandTotal(dispatch);
      return [
        dispatch.dispatchDate ? format(new Date(dispatch.dispatchDate), "dd MMM yyyy") : "N/A",
        dispatch.invoiceNumber || "N/A",
        dispatch.purchaseOrder?.poNumber || "N/A",
        dispatch.purchaseOrder?.client?.name || "Unknown",
        totalQty,
        dispatch.logisticsPartner?.name || "N/A",
        dispatch.docketNumber || "N/A",
        dispatch.expectedDeliveryDate ? format(new Date(dispatch.expectedDeliveryDate), "dd MMM yyyy") : "N/A",
        dispatch.status,
        grandTotal,
      ];
    });

    const csvContent = [
      headers.join(","),
      ...rows.map((row: (string | number)[]) => row.map((cell) => `"${cell}"`).join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `dispatches_${new Date().toISOString().split("T")[0]}.csv`,
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success("Dispatches exported to Excel");
  };

  // Export to PDF
  const exportToPDF = async () => {
    const jsPDF = (await import("jspdf")).default;
    const autoTable = (await import("jspdf-autotable")).default;

    const doc = new jsPDF({
      orientation: "landscape",
      unit: "mm",
      format: "a4",
    });

    // Title
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Dispatches Report", 8, 10);

    // Subtitle
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100, 100, 100);
    doc.text(
      `Generated: ${new Date().toLocaleString("en-IN")} | Total Records: ${filteredDispatches.length}`,
      8,
      15,
    );
    doc.setTextColor(0, 0, 0);

    const tableColumns = [
      "Dispatch Date",
      "Invoice Number",
      "PO Number",
      "Client",
      "Total Qty",
      "Courier",
      "Tracking Number",
      "Expected Delivery",
      "Status",
      "Total Value",
    ];

    const tableRows = filteredDispatches.map((dispatch: OMDispatchOrder) => {
      const totalQty = getTotalQty(dispatch);
      const grandTotal = getGrandTotal(dispatch);
      return [
        dispatch.dispatchDate ? format(new Date(dispatch.dispatchDate), "dd MMM yyyy") : "N/A",
        dispatch.invoiceNumber || "N/A",
        dispatch.purchaseOrder?.poNumber || "N/A",
        dispatch.purchaseOrder?.client?.name || "Unknown",
        totalQty.toString(),
        dispatch.logisticsPartner?.name || "N/A",
        dispatch.docketNumber || "N/A",
        dispatch.expectedDeliveryDate ? format(new Date(dispatch.expectedDeliveryDate), "dd MMM yyyy") : "N/A",
        dispatch.status,
        `₹${grandTotal.toLocaleString("en-IN")}`,
      ];
    });

    autoTable(doc, {
      head: [tableColumns],
      body: tableRows,
      startY: 18,
      margin: { left: 6, right: 6, top: 8, bottom: 8 },
      styles: {
        fontSize: 7.5,
        cellPadding: 1.5,
        valign: "middle",
        overflow: "linebreak",
      },
      headStyles: {
        fillColor: [55, 65, 81],
        textColor: [255, 255, 255],
        fontSize: 8,
        fontStyle: "bold",
        halign: "center",
      },
      alternateRowStyles: { fillColor: [250, 250, 250] },
      didDrawPage: (data) => {
        const pageCount = (doc as any).internal.getNumberOfPages();
        doc.setFontSize(8);
        doc.setTextColor(128, 128, 128);
        doc.text(
          `Page ${data.pageNumber} of ${pageCount}`,
          doc.internal.pageSize.width - 25,
          doc.internal.pageSize.height - 5,
        );
      },
    });

    doc.save(`dispatches_${new Date().toISOString().split("T")[0]}.pdf`);
    toast.success("Dispatches exported to PDF");
  };

  return (
    <Layout isClient={false}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-semibold">All Dispatches</h1>
            <p className="text-muted-foreground">
              Track dispatch and delivery status
            </p>
          </div>
          <div className="flex gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <FileDown className="h-4 w-4 mr-2" />
                  Export
                  <ChevronDown className="h-4 w-4 ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={exportToExcel}>
                  <FileSpreadsheet className="h-4 w-4 mr-2" />
                  Export to Excel
                </DropdownMenuItem>
                <DropdownMenuItem onClick={exportToPDF}>
                  <FileDown className="h-4 w-4 mr-2" />
                  Export to PDF
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Link href="/admin/order-management/dispatches/create">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create Dispatch
              </Button>
            </Link>
          </div>
        </div>

        <OMFilterCard
          subtitle={`Showing ${filteredDispatches.length} of ${dispatches.length} dispatch orders`}
          searchPlaceholder="Search by Invoice, PO, Client, or Tracking..."
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          sortBy={sortBy}
          onSortChange={setSortBy}
          sortOptions={DISPATCH_SORT_OPTIONS}
          sortNameLabel="Client Name"
          showFilters={showFilters}
          setShowFilters={setShowFilters}
          onReset={resetFiltersAll}
        >
          <DispatchFilters
            filters={filters}
            setFilters={setFilters}
            sortBy={sortBy}
            onSortChange={setSortBy}
            clientOptions={clientOptions}
            logisticsOptions={logisticsOptions}
            invoiceOptions={invoiceOptions}
            docketOptions={docketOptions}
          />
          <OMActiveFilters
            activeFilters={activeFilters}
            onRemove={removeFilter}
            onClearAll={resetFiltersAll}
          />
        </OMFilterCard>

        {/* Dispatches Table */}
        <OMDataTable
          data={filteredDispatches}
          isLoading={isLoading}
          columnCount={9}
          emptyMessage="No dispatches found"
          onRowClick={(dispatch: OMDispatchOrder) =>
            router.push(`/admin/order-management/dispatches/${dispatch.id}`)
          }
          header={
            <TableRow>
              <OMSortableHeader
                title="Date"
                currentSort={sortBy}
                onSort={setSortBy}
                ascOption="dispatch_date_asc"
                descOption="dispatch_date_desc"
                className="pr-2"
              />
              <OMSortableHeader
                title="Invoice Number"
                currentSort={sortBy}
                onSort={setSortBy}
                ascOption="inv_number_asc"
                descOption="inv_number_desc"
                className="px-3"
              />
              <OMSortableHeader
                title="PO / Estimate"
                currentSort={sortBy}
                onSort={setSortBy}
                ascOption="po_num_asc"
                descOption="po_num_desc"
                className="px-3"
              />
              <OMSortableHeader
                title="Client"
                currentSort={sortBy}
                onSort={setSortBy}
                ascOption="name_asc"
                descOption="name_desc"
                className="px-3"
              />
              <OMSortableHeader
                title="Total Qty"
                currentSort={sortBy}
                onSort={setSortBy}
                ascOption="qty_asc"
                descOption="qty_desc"
                className="text-left px-3"
              />
              <OMSortableHeader
                title="Courier"
                currentSort={sortBy}
                onSort={setSortBy}
                ascOption="courier_asc"
                descOption="courier_desc"
                className="px-3"
              />
              <OMSortableHeader
                title="Tracking Number"
                currentSort={sortBy}
                onSort={setSortBy}
                ascOption="tracking_asc"
                descOption="tracking_desc"
                className="px-3"
              />
              <OMSortableHeader
                title="Status"
                currentSort={sortBy}
                onSort={setSortBy}
                ascOption="status_asc"
                descOption="status_desc"
                className="px-3"
              />
              <TableHead className="text-right pr-7">Actions</TableHead>
            </TableRow>
          }
          renderRow={(dispatch: OMDispatchOrder) => (
            <TableRow key={dispatch.id} className="cursor-pointer">
              <TableCell className="pr-2">
                {dispatch.dispatchDate
                  ? format(new Date(dispatch.dispatchDate), "dd MMM yyyy")
                  : "N/A"}
              </TableCell>
              <TableCell className="px-3 font-medium">
                {dispatch.invoiceNumber || "N/A"}
              </TableCell>
              <TableCell className="px-3">
                {dispatch.purchaseOrder?.poNumber || "N/A"}
              </TableCell>
              <TableCell className="px-3">
                {dispatch.purchaseOrder?.client?.name || "Unknown"}
              </TableCell>
              <TableCell className="text-left px-3">
                {getTotalQty(dispatch)}
              </TableCell>
              <TableCell className="px-3">
                {dispatch.logisticsPartner?.name || "N/A"}
              </TableCell>
              <TableCell className="font-mono text-sm px-3 max-w-32 wrap-break-word">
                {dispatch.docketNumber || "N/A"}
              </TableCell>
              <TableCell className="px-3">
                <Badge className={getStatusColor(dispatch.status)}>
                  {formatStatus(dispatch.status)}
                </Badge>
              </TableCell>
              <TableCell className="text-right pr-2">
                <div className="flex items-center justify-end gap-2">
                  <Link
                    href={`/admin/order-management/dispatches/${dispatch.id}`}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Button variant="ghost" size="sm" title="View Dispatch">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Link
                    href={`/admin/order-management/dispatches/${dispatch.id}/edit`}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Button variant="ghost" size="sm" title="Edit Dispatch">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(dispatch.id);
                    }}
                    className="text-destructive hover:text-destructive"
                    title="Delete Dispatch"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          )}
        />

        <DeleteConfirmationDialog
          isOpen={isDeleteDialogOpen}
          onOpenChange={setIsDeleteDialogOpen}
          onConfirm={onConfirmDelete}
          isLoading={isDeleting}
          title="Delete Dispatch"
          description="Are you sure you want to delete this dispatch? This action cannot be undone."
        />
      </div>
    </Layout>
  );
}
