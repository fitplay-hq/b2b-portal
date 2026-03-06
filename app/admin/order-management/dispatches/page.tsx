"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
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
  FileDown,
  FileSpreadsheet,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function OMDispatchesList() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [clientFilter, setClientFilter] = useState<string>("all");
  const [dispatches, setDispatches] = useState<any[]>([]);
  const [clients, setClients] = useState<any[]>([]);
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

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "CREATED":
        return "secondary";
      case "DISPATCHED":
        return "default";
      case "DELIVERED":
        return "default";
      case "CANCELLED":
        return "destructive";
      default:
        return "secondary";
    }
  };

  const getTotalQty = (dispatch: any) => {
    return (
      dispatch.items?.reduce((sum: number, i: any) => sum + i.quantity, 0) || 0
    );
  };

  const getGrandTotal = (dispatch: any) => {
    return (
      dispatch.items?.reduce((sum: number, i: any) => sum + i.totalAmount, 0) ||
      0
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
  const exportToPDF = () => {
    let pdfContent = `
DISPATCHES REPORT
Generated: ${new Date().toLocaleString("en-IN")}
Total Records: ${filteredDispatches.length}

${"=".repeat(120)}

`;

    filteredDispatches.forEach((dispatch) => {
      const totalQty = getTotalQty(dispatch);
      const grandTotal = getGrandTotal(dispatch);
      pdfContent += `
Invoice: ${dispatch.invoiceNumber} | PO: ${dispatch.purchaseOrder?.poNumber || "N/A"} | Client: ${dispatch.purchaseOrder?.client?.name || "Unknown"}
Status: ${dispatch.status} | Date: ${new Date(dispatch.invoiceDate).toLocaleDateString("en-IN")}
Quantity: ${totalQty} | Courier: ${dispatch.logisticsPartner?.name || "N/A"}
Tracking: ${dispatch.docketNumber || "N/A"} | Expected Delivery: ${new Date(dispatch.expectedDeliveryDate).toLocaleDateString("en-IN")}
Total Value: ₹${grandTotal.toLocaleString("en-IN")}
${"-".repeat(120)}
`;
    });

    const blob = new Blob([pdfContent], { type: "text/plain;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `dispatches_${new Date().toISOString().split("T")[0]}.txt`,
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success("Dispatches exported to PDF format");
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

              <Select value={clientFilter} onValueChange={setClientFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by Client" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Clients</SelectItem>
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
                {filteredDispatches.length === 0 ? (
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
                    <TableRow key={dispatch.id}>
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
                        <Badge variant={getStatusVariant(dispatch.status)}>
                          {dispatch.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Link
                          href={`/admin/order-management/dispatches/${dispatch.id}`}
                        >
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
