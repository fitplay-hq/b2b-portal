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
import { formatStatus } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type {
  OMDispatchOrder,
  OMDispatchOrderItem,
  OMClient,
} from "@/types/order-management";
import { DeleteConfirmationDialog } from "@/components/delete-confirmation-dialog";

export default function OMDispatchesList() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [clientFilter, setClientFilter] = useState<string>("all");
  const [dispatches, setDispatches] = useState<OMDispatchOrder[]>([]);
  const [clients, setClients] = useState<OMClient[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchClients = async () => {
    try {
      const res = await fetch("/api/admin/om/clients");
      if (res.ok) {
        const data = await res.json();
        setClients(data);
      }
    } catch (err) {
      console.error("Failed to fetch clients", err);
    }
  };

  const fetchDispatches = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (statusFilter !== "all") params.append("status", statusFilter);
      // Backend route doesn't explicitly support clientId filter in dispatch-orders API yet,
      // but we can filter client-side or use purchaseOrderId if needed.
      // For now we'll filter client-side for consistency with the PO list.

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
    fetchClients();
  }, []);

  useEffect(() => {
    fetchDispatches();
  }, [statusFilter]);

  // Filter dispatches client-side
  const filteredDispatches = dispatches.filter((dispatch) => {
    const clientName = dispatch.purchaseOrder?.client?.name || "Unknown";
    const poNumber = dispatch.purchaseOrder?.poNumber || "N/A";

    const matchesSearch =
      dispatch.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      poNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (dispatch.docketNumber || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

    const matchesClient =
      clientFilter === "all" ||
      dispatch.purchaseOrder?.clientId === clientFilter;

    return matchesSearch && matchesClient;
  });

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
        new Date(dispatch.invoiceDate).toLocaleDateString("en-IN"),
        new Date(dispatch.expectedDeliveryDate).toLocaleDateString("en-IN"),
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
        new Date(dispatch.invoiceDate).toLocaleDateString("en-IN"),
        new Date(dispatch.expectedDeliveryDate).toLocaleDateString("en-IN"),
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
            <h3 className="text-lg font-semibold">All Dispatches</h3>
            <p className="text-sm text-muted-foreground">
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

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle>Search & Filter</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by Invoice, PO, Client, or Tracking..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>

              <div className="flex gap-2">
                <Select value={clientFilter} onValueChange={setClientFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by Client" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Clients</SelectItem>
                    {clients.map((client) => (
                      <SelectItem key={client.id} value={client.id}>
                        {client.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="CREATED">Created</SelectItem>
                    <SelectItem value="DISPATCHED">Dispatched</SelectItem>
                    <SelectItem value="DELIVERED">Delivered</SelectItem>
                    <SelectItem value="CANCELLED">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Dispatches Table */}
        <Card>
          <CardContent className="p-0">
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
                        {new Date(dispatch.invoiceDate).toLocaleDateString(
                          "en-IN",
                        )}
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
