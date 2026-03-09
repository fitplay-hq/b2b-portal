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
  Edit,
  FileDown,
  FileSpreadsheet,
  Trash2,
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
  OMPurchaseOrder,
  OMPurchaseOrderItem,
  OMDispatchOrder,
  OMDispatchOrderItem,
  OMClient,
  OMPaginationMeta,
} from "@/types/order-management";
import { DeleteConfirmationDialog } from "@/components/delete-confirmation-dialog";

export default function OMPurchaseOrdersList() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [clientFilter, setClientFilter] = useState<string>("all");
  const [purchaseOrders, setPurchaseOrders] = useState<OMPurchaseOrder[]>([]);
  const [clients, setClients] = useState<OMClient[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [meta, setMeta] = useState<OMPaginationMeta | null>(null);

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

  const fetchPurchaseOrders = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (statusFilter !== "all") params.append("status", statusFilter);
      if (clientFilter !== "all") params.append("clientId", clientFilter);
      // For global search, we might still want to filter client-side if the API doesn't support 'q' here,
      // but let's assume we can filter the result for now or use the search API if needed.
      // The current route.ts for purchase-orders doesn't have a 'q' param, so we'll filter client-side for 'searchTerm'.

      const res = await fetch(
        `/api/admin/om/purchase-orders?${params.toString()}`,
      );
      if (res.ok) {
        const result = await res.json();
        setPurchaseOrders(result.data);
        setMeta(result.meta);
      }
    } catch (err) {
      console.error("Failed to fetch POs", err);
      toast.error("Failed to load purchase orders");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  useEffect(() => {
    fetchPurchaseOrders();
  }, [statusFilter, clientFilter]);

  // Filter purchase orders client-side for search term
  const filteredPOs = purchaseOrders.filter((po) => {
    const clientName = po.client?.name || "Unknown";
    const matchesSearch =
      po.estimateNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      po.poNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      clientName.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesSearch;
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
      const res = await fetch(`/api/admin/om/purchase-orders/${deleteId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        toast.success("Purchase order deleted successfully");
        fetchPurchaseOrders();
        setIsDeleteDialogOpen(false);
      } else {
        const error = await res.json();
        toast.error(error.error || "Failed to delete purchase order");
      }
    } catch (err) {
      console.error("Error deleting PO:", err);
      toast.error("An error occurred while deleting the purchase order");
    } finally {
      setIsDeleting(false);
      setDeleteId(null);
    }
  };

  const getTotalDispatchedForPO = (po: OMPurchaseOrder) => {
    return (
      po.dispatchOrders?.reduce((sum: number, d: OMDispatchOrder) => {
        const dispatchQty =
          d.items?.reduce(
            (s: number, i: OMDispatchOrderItem) => s + i.quantity,
            0,
          ) || 0;
        return sum + dispatchQty;
      }, 0) || 0
    );
  };

  const getTotalOrderedForPO = (po: OMPurchaseOrder) => {
    return (
      po.items?.reduce(
        (sum: number, item: OMPurchaseOrderItem) => sum + item.quantity,
        0,
      ) || 0
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "DRAFT":
        return "bg-gray-100 text-gray-800 hover:bg-gray-100 border-transparent";
      case "CONFIRMED":
        return "bg-blue-100 text-blue-800 hover:bg-blue-100 border-transparent";
      case "PARTIALLY_DISPATCHED":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100 border-transparent";
      case "FULLY_DISPATCHED":
        return "bg-green-100 text-green-800 hover:bg-green-100 border-transparent";
      case "CLOSED":
        return "bg-slate-100 text-slate-800 hover:bg-slate-100 border-transparent";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100 border-transparent";
    }
  };

  // Export to CSV/Excel
  const exportToExcel = () => {
    const headers = [
      "Estimate Number",
      "PO Number",
      "Client",
      "Total Ordered",
      "Dispatched",
      "Remaining",
      "Total Value",
      "Status",
      "PO Date",
    ];

    const rows = filteredPOs.map((po) => {
      const dispatched = getTotalDispatchedForPO(po);
      const totalOrdered = getTotalOrderedForPO(po);
      const remaining = totalOrdered - dispatched;

      return [
        po.estimateNumber,
        po.poNumber,
        po.client?.name || "Unknown",
        totalOrdered,
        dispatched,
        remaining,
        po.grandTotal,
        po.status,
        po.poDate
          ? new Date(po.poDate).toLocaleDateString("en-IN")
          : "N/A",
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
      `purchase_orders_${new Date().toISOString().split("T")[0]}.csv`,
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success("Purchase Orders exported to Excel");
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
    doc.text("Purchase Orders Report", 8, 10);

    // Subtitle
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100, 100, 100);
    doc.text(
      `Generated: ${new Date().toLocaleString("en-IN")} | Total Records: ${filteredPOs.length}`,
      8,
      15,
    );
    doc.setTextColor(0, 0, 0);

    const tableColumns = [
      "Estimate Number",
      "PO Number",
      "Client",
      "Total Ordered",
      "Dispatched",
      "Remaining",
      "Total Value",
      "Status",
      "PO Date",
    ];

    const tableRows = filteredPOs.map((po) => {
      const dispatched = getTotalDispatchedForPO(po);
      const totalOrdered = getTotalOrderedForPO(po);
      const remaining = totalOrdered - dispatched;
      return [
        po.estimateNumber,
        po.poNumber,
        po.client?.name || "Unknown",
        totalOrdered.toString(),
        dispatched.toString(),
        remaining.toString(),
        `₹${po.grandTotal.toLocaleString("en-IN")}`,
        po.status,
        po.poDate
          ? new Date(po.poDate).toLocaleDateString("en-IN")
          : "N/A",
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

    doc.save(`purchase_orders_${new Date().toISOString().split("T")[0]}.pdf`);
    toast.success("Purchase Orders exported to PDF");
  };

  return (
    <Layout isClient={false}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-semibold">All Purchase Orders</h3>
            <p className="text-sm text-muted-foreground">
              Manage and track purchase orders
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
            <Link href="/admin/order-management/purchase-orders/create">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create PO
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
                  placeholder="Search by PO, Estimate, or Client..."
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
                    <SelectItem value="DRAFT">Draft</SelectItem>
                    <SelectItem value="CONFIRMED">Confirmed</SelectItem>
                    <SelectItem value="PARTIALLY_DISPATCHED">
                      Partially Dispatched
                    </SelectItem>
                    <SelectItem value="FULLY_DISPATCHED">
                      Fully Dispatched
                    </SelectItem>
                    <SelectItem value="CLOSED">Closed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Purchase Orders Table */}
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Estimate Number</TableHead>
                  <TableHead>PO Number</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead className="text-right">Total Ordered</TableHead>
                  <TableHead className="text-right">Dispatched</TableHead>
                  <TableHead className="text-right">Remaining</TableHead>
                  <TableHead className="text-right">Total Value</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPOs.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={9}
                      className="text-center py-8 text-muted-foreground"
                    >
                      No purchase orders found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredPOs.map((po) => {
                    const dispatched = getTotalDispatchedForPO(po);
                    const totalOrdered = getTotalOrderedForPO(po);
                    const remaining = totalOrdered - dispatched;

                    return (
                      <TableRow
                        key={po.id}
                        className="cursor-pointer hover:bg-muted/50"
                        onClick={() =>
                          router.push(
                            `/admin/order-management/purchase-orders/${po.id}`,
                          )
                        }
                      >
                        <TableCell className="font-medium">
                          {po.estimateNumber}
                        </TableCell>
                        <TableCell>{po.poNumber}</TableCell>
                        <TableCell>{po.client?.name || "Unknown"}</TableCell>
                        <TableCell className="text-right">
                          {totalOrdered}
                        </TableCell>
                        <TableCell className="text-right">
                          {dispatched}
                        </TableCell>
                        <TableCell className="text-right">
                          {remaining}
                        </TableCell>
                        <TableCell className="text-right">
                          ₹{po.grandTotal.toLocaleString("en-IN")}
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(po.status)}>
                            {formatStatus(po.status)}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Link
                              href={`/admin/order-management/purchase-orders/${po.id}`}
                              onClick={(e) => e.stopPropagation()}
                            >
                              <Button variant="ghost" size="sm">
                                <Eye className="h-4 w-4" />
                              </Button>
                            </Link>
                            <Link
                              href={`/admin/order-management/purchase-orders/${po.id}/edit`}
                              onClick={(e) => e.stopPropagation()}
                            >
                              <Button variant="ghost" size="sm">
                                <Edit className="h-4 w-4" />
                              </Button>
                            </Link>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDelete(po.id);
                              }}
                              className="text-destructive hover:text-destructive"
                              title="Delete Purchase Order"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })
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
          title="Delete Purchase Order"
          description="Are you sure you want to delete this purchase order? This action cannot be undone."
        />
      </div>
    </Layout>
  );
}
