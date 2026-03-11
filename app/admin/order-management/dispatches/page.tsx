"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Plus,
  Search,
  Eye,
  FileDown,
  FileSpreadsheet,
  Trash2,
  Edit,
  ChevronDown,
} from "lucide-react";
import { toast } from "sonner";
import { formatStatus, formatDisplayDate } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SearchableSelect, ComboboxOption } from "@/components/ui/combobox";
import {
  type OMDispatchOrder,
  type OMDispatchOrderItem,
  type OMClient,
  getDispatchStatusVisuals,
} from "@/types/order-management";
import { DeleteConfirmationDialog } from "@/components/delete-confirmation-dialog";
import {
  OMSortControl,
  type SortOption,
} from "@/components/orderManagement/OMSortControl";
import { OMFilterCard } from "@/components/orderManagement/shared/OMFilterCard";
import { OMActiveFilters } from "@/components/orderManagement/shared/OMActiveFilters";
import { DispatchFilters } from "@/components/orderManagement/dispatches/DispatchFilters";
import { useMemo } from "react";

export default function OMDispatchesList() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [dispatches, setDispatches] = useState<OMDispatchOrder[]>([]);
  const [clients, setClients] = useState<OMClient[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sortBy, setSortBy] = useState<SortOption>("newest");

  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    fromDate: "",
    toDate: "",
    clientName: "",
    logisticsPartnerId: "",
    status: "all",
    invoiceNumber: "",
    docketNumber: "",
  });

  const [logisticsOptions, setLogisticsOptions] = useState<ComboboxOption[]>(
    [],
  );
  const [invoiceOptions, setInvoiceOptions] = useState<ComboboxOption[]>([]);
  const [docketOptions, setDocketOptions] = useState<ComboboxOption[]>([]);

  const fetchDynamicOptions = async () => {
    try {
      const clientParam = filters.clientName
        ? `?clientName=${encodeURIComponent(filters.clientName)}`
        : "";
      const [invRes, docketRes] = await Promise.all([
        fetch(`/api/admin/om/dispatch-orders/options${clientParam}`),
        fetch(
          `/api/admin/om/dispatch-orders/options${clientParam}${clientParam ? "&" : "?"}type=docket`,
        ),
      ]);

      if (invRes.ok) setInvoiceOptions(await invRes.json());
      if (docketRes.ok) setDocketOptions(await docketRes.json());
    } catch (err) {
      console.error("Failed to fetch dynamic options", err);
    }
  };

  useEffect(() => {
    fetchDynamicOptions();
  }, [filters.clientName]);

  const fetchOptions = async () => {
    try {
      const [clientsRes, logisticsRes] = await Promise.all([
        fetch("/api/admin/om/clients"),
        fetch("/api/admin/om/logistics-partners"),
      ]);

      if (clientsRes.ok) {
        setClients(await clientsRes.json());
      }
      if (logisticsRes.ok) {
        const logistics = await logisticsRes.json();
        setLogisticsOptions(
          logistics.map((l: any) => ({ value: l.id, label: l.name })),
        );
      }
    } catch (err) {
      console.error("Failed to fetch options", err);
    }
  };

  const fetchDispatches = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/admin/om/dispatch-orders?limit=100`);
      if (res.ok) {
        const data = await res.json();
        setDispatches(data.data);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to load dispatches");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOptions();
    fetchDispatches();
  }, []);

  // Filter dispatches client-side
  const filteredDispatches = useMemo(() => {
    return dispatches
      .filter((dispatch) => {
        const clientName = dispatch.purchaseOrder?.client?.name || "Unknown";
        const poNumber = dispatch.purchaseOrder?.poNumber || "N/A";
        const invoiceDate = new Date(dispatch.invoiceDate);

        // Text search
        const matchesSearch =
          !searchTerm ||
          dispatch.invoiceNumber
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          poNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
          clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (dispatch.docketNumber || "")
            .toLowerCase()
            .includes(searchTerm.toLowerCase());

        // Advanced filters
        const matchesClient =
          !filters.clientName || clientName === filters.clientName;
        const matchesStatus =
          filters.status === "all" || dispatch.status === filters.status;
        const matchesLogistics =
          !filters.logisticsPartnerId ||
          dispatch.logisticsPartnerId === filters.logisticsPartnerId;
        const matchesInvoice =
          !filters.invoiceNumber ||
          dispatch.invoiceNumber === filters.invoiceNumber;
        const matchesDocket =
          !filters.docketNumber ||
          (dispatch.docketNumber || "")
            .toLowerCase()
            .includes(filters.docketNumber.toLowerCase());

        const matchesFromDate =
          !filters.fromDate || invoiceDate >= new Date(filters.fromDate);
        const matchesToDate =
          !filters.toDate ||
          (() => {
            const to = new Date(filters.toDate);
            to.setHours(23, 59, 59, 999);
            return invoiceDate <= to;
          })();

        return (
          matchesSearch &&
          matchesClient &&
          matchesStatus &&
          matchesLogistics &&
          matchesInvoice &&
          matchesDocket &&
          matchesFromDate &&
          matchesToDate
        );
      })
      .sort((a, b) => {
        const aClientName = a.purchaseOrder?.client?.name || "";
        const bClientName = b.purchaseOrder?.client?.name || "";
        if (sortBy === "name_asc")
          return aClientName.localeCompare(bClientName);
        if (sortBy === "name_desc")
          return bClientName.localeCompare(aClientName);
        if (sortBy === "inv_date_desc")
          return (
            new Date(b.invoiceDate).getTime() -
            new Date(a.invoiceDate).getTime()
          );
        if (sortBy === "inv_date_asc")
          return (
            new Date(a.invoiceDate).getTime() -
            new Date(b.invoiceDate).getTime()
          );
        if (sortBy === "newest")
          return (
            new Date(b.createdAt || 0).getTime() -
            new Date(a.createdAt || 0).getTime()
          );
        if (sortBy === "oldest")
          return (
            new Date(a.createdAt || 0).getTime() -
            new Date(b.createdAt || 0).getTime()
          );
        return 0;
      });
  }, [dispatches, searchTerm, filters, sortBy]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      // Logic for enter key if needed
    }
  };

  const resetFilters = () => {
    setFilters({
      fromDate: "",
      toDate: "",
      clientName: "",
      logisticsPartnerId: "",
      status: "all",
      invoiceNumber: "",
      docketNumber: "",
    });
    setSearchTerm("");
  };

  const removeFilter = (key: string) => {
    setFilters((prev: any) => ({
      ...prev,
      [key]: key === "status" ? "all" : "",
    }));
  };

  const activeFilters = useMemo(() => {
    const active = [];
    if (filters.fromDate)
      active.push({ key: "fromDate", label: "From", value: filters.fromDate });
    if (filters.toDate)
      active.push({ key: "toDate", label: "To", value: filters.toDate });
    if (filters.clientName)
      active.push({
        key: "clientName",
        label: "Client",
        value: filters.clientName,
      });
    if (filters.logisticsPartnerId) {
      const label = logisticsOptions.find(
        (o) => o.value === filters.logisticsPartnerId,
      )?.label;
      active.push({
        key: "logisticsPartnerId",
        label: "Logistics",
        value: label || filters.logisticsPartnerId,
      });
    }
    if (filters.invoiceNumber)
      active.push({
        key: "invoiceNumber",
        label: "Invoice #",
        value: filters.invoiceNumber,
      });
    if (filters.docketNumber)
      active.push({
        key: "docketNumber",
        label: "Tracking #",
        value: filters.docketNumber,
      });
    if (filters.status && filters.status !== "all") {
      active.push({
        key: "status",
        label: "Status",
        value: filters.status.charAt(0) + filters.status.slice(1).toLowerCase(),
      });
    }
    return active;
  }, [filters, logisticsOptions]);

  const clientOptions = useMemo(() => {
    return clients.map((c) => ({ value: c.name, label: c.name }));
  }, [clients]);

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
        fetchDispatches();
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

  const getTotalQty = (dispatch: OMDispatchOrder) => {
    return (
      dispatch.items?.reduce(
        (sum: number, i: OMDispatchOrderItem) => sum + i.quantity,
        0,
      ) || 0
    );
  };

  const getGrandTotal = (dispatch: OMDispatchOrder) => {
    return (
      dispatch.items?.reduce(
        (sum: number, i: OMDispatchOrderItem) => sum + i.totalAmount,
        0,
      ) || 0
    );
  };

  // Export to CSV/Excel
  const exportToExcel = () => {
    const headers = [
      "Invoice Number",
      "PO Number",
      "Client",
      "Total Qty",
      "Courier",
      "Tracking Number",
      "Dispatch Date",
      "Expected Delivery",
      "Status",
      "Total Value",
    ];

    const rows = filteredDispatches.map((dispatch) => {
      const totalQty = getTotalQty(dispatch);
      const grandTotal = getGrandTotal(dispatch);
      return [
        dispatch.invoiceNumber,
        dispatch.purchaseOrder?.poNumber || "N/A",
        dispatch.purchaseOrder?.client?.name || "Unknown",
        totalQty,
        dispatch.logisticsPartner?.name || "N/A",
        dispatch.docketNumber || "N/A",
        formatDisplayDate(dispatch.invoiceDate),
        formatDisplayDate(dispatch.expectedDeliveryDate),
        dispatch.status,
        grandTotal,
      ];
    });

    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
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
      "Invoice Number",
      "PO Number",
      "Client",
      "Total Qty",
      "Courier",
      "Tracking Number",
      "Dispatch Date",
      "Expected Delivery",
      "Status",
      "Total Value",
    ];

    const tableRows = filteredDispatches.map((dispatch) => {
      const totalQty = getTotalQty(dispatch);
      const grandTotal = getGrandTotal(dispatch);
      return [
        dispatch.invoiceNumber,
        dispatch.purchaseOrder?.poNumber || "N/A",
        dispatch.purchaseOrder?.client?.name || "Unknown",
        totalQty.toString(),
        dispatch.logisticsPartner?.name || "N/A",
        dispatch.docketNumber || "N/A",
        formatDisplayDate(dispatch.invoiceDate),
        formatDisplayDate(dispatch.expectedDeliveryDate),
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
          title="Filters"
          subtitle={`Showing ${filteredDispatches.length} of ${dispatches.length} dispatch orders`}
          searchPlaceholder="Search by Invoice, PO, Client, or Tracking..."
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          sortBy={sortBy}
          onSortChange={setSortBy}
          sortNameLabel="Client Name"
          showFilters={showFilters}
          setShowFilters={setShowFilters}
          onReset={resetFilters}
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
            onClearAll={resetFilters}
          />
        </OMFilterCard>

        {/* Dispatches Table */}
        <Card>
          <CardHeader>
            <CardTitle>Dispatch List</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="border rounded-md overflow-hidden">
              <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Invoice Number</TableHead>
                  <TableHead>PO Number</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead className="text-right">Total Qty</TableHead>
                  <TableHead>Courier</TableHead>
                  <TableHead>Tracking Number</TableHead>
                  <TableHead>Dispatch Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  [...Array(5)].map((_, i) => (
                    <TableRow key={i}>
                      <TableCell>
                        <Skeleton className="h-4 w-24" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-20" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-32" />
                      </TableCell>
                      <TableCell className="text-right">
                        <Skeleton className="h-4 w-12 ml-auto" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-24" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-32" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-20" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-6 w-24 rounded-full" />
                      </TableCell>
                      <TableCell className="text-right">
                        <Skeleton className="h-8 w-24 ml-auto" />
                      </TableCell>
                    </TableRow>
                  ))
                ) : filteredDispatches.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={9}
                      className="text-center py-8 text-muted-foreground"
                    >
                      No dispatches found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredDispatches.map((dispatch) => (
                    <TableRow
                      key={dispatch.id}
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() =>
                        router.push(
                          `/admin/order-management/dispatches/${dispatch.id}`,
                        )
                      }
                    >
                      <TableCell className="font-medium">
                        {dispatch.invoiceNumber}
                      </TableCell>
                      <TableCell>
                        {dispatch.purchaseOrder?.poNumber || "N/A"}
                      </TableCell>
                      <TableCell>
                        {dispatch.purchaseOrder?.client?.name || "Unknown"}
                      </TableCell>
                      <TableCell className="text-right">
                        {getTotalQty(dispatch)}
                      </TableCell>
                      <TableCell>
                        {dispatch.logisticsPartner?.name || "N/A"}
                      </TableCell>
                      <TableCell className="font-mono text-sm">
                        {dispatch.docketNumber || "N/A"}
                      </TableCell>
                      <TableCell>
                        {formatDisplayDate(dispatch.invoiceDate)}
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(dispatch.status)}>
                          {formatStatus(dispatch.status)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/admin/order-management/dispatches/${dispatch.id}`}
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Button
                              variant="ghost"
                              size="sm"
                              title="View Dispatch"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Link
                            href={`/admin/order-management/dispatches/${dispatch.id}/edit`}
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Button
                              variant="ghost"
                              size="sm"
                              title="Edit Dispatch"
                            >
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
                  ))
                )}
              </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

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
