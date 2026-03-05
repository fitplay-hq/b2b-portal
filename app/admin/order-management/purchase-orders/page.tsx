"use client";

import { useState } from "react";
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
  Edit,
  FileDown,
  FileSpreadsheet,
} from "lucide-react";
import {
  omPurchaseOrders,
  omClients,
  getTotalDispatchedForPO,
  OMPurchaseOrder,
} from "../_mock/omMockData";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function OMPurchaseOrdersList() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [clientFilter, setClientFilter] = useState<string>("all");

  // Filter purchase orders
  const filteredPOs = omPurchaseOrders.filter((po) => {
    const matchesSearch =
      po.estimateNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      po.poNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      po.clientName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === "all" || po.status === statusFilter;
    const matchesClient =
      clientFilter === "all" || po.clientId === clientFilter;

    return matchesSearch && matchesStatus && matchesClient;
  });

  const getStatusVariant = (status: OMPurchaseOrder["status"]) => {
    switch (status) {
      case "Draft":
        return "secondary";
      case "Confirmed":
        return "default";
      case "Partially Dispatched":
        return "outline";
      case "Fully Dispatched":
        return "default";
      case "Closed":
        return "secondary";
      default:
        return "secondary";
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
      const dispatched = getTotalDispatchedForPO(po.id);
      const remaining = po.totalQuantity - dispatched;

      return [
        po.estimateNumber,
        po.poNumber,
        po.clientName,
        po.totalQuantity,
        dispatched,
        remaining,
        po.grandTotal,
        po.status,
        new Date(po.poDate).toLocaleDateString("en-IN"),
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
  const exportToPDF = () => {
    // Create a simple text-based PDF content
    let pdfContent = `
PURCHASE ORDERS REPORT
Generated: ${new Date().toLocaleString("en-IN")}
Total Records: ${filteredPOs.length}

${"=".repeat(120)}

`;

    filteredPOs.forEach((po) => {
      const dispatched = getTotalDispatchedForPO(po.id);
      const remaining = po.totalQuantity - dispatched;

      pdfContent += `
Estimate: ${po.estimateNumber} | PO: ${po.poNumber} | Client: ${po.clientName}
Status: ${po.status} | Date: ${new Date(po.poDate).toLocaleDateString("en-IN")}
Ordered: ${po.totalQuantity} | Dispatched: ${dispatched} | Remaining: ${remaining}
Total Value: ₹${po.grandTotal.toLocaleString("en-IN")}
${"-".repeat(120)}
`;
    });

    const blob = new Blob([pdfContent], { type: "text/plain;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `purchase_orders_${new Date().toISOString().split("T")[0]}.txt`,
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success("Purchase Orders exported to PDF format");
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

              <Select value={clientFilter} onValueChange={setClientFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by Client" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Clients</SelectItem>
                  {omClients.map((client) => (
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
                  <SelectItem value="Draft">Draft</SelectItem>
                  <SelectItem value="Confirmed">Confirmed</SelectItem>
                  <SelectItem value="Partially Dispatched">
                    Partially Dispatched
                  </SelectItem>
                  <SelectItem value="Fully Dispatched">
                    Fully Dispatched
                  </SelectItem>
                  <SelectItem value="Closed">Closed</SelectItem>
                </SelectContent>
              </Select>
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
                    const dispatched = getTotalDispatchedForPO(po.id);
                    const remaining = po.totalQuantity - dispatched;

                    return (
                      <TableRow key={po.id}>
                        <TableCell className="font-medium">
                          {po.estimateNumber}
                        </TableCell>
                        <TableCell>{po.poNumber}</TableCell>
                        <TableCell>{po.clientName}</TableCell>
                        <TableCell className="text-right">
                          {po.totalQuantity}
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
                          <Badge variant={getStatusVariant(po.status)}>
                            {po.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Link
                              href={`/admin/order-management/purchase-orders/${po.id}`}
                            >
                              <Button variant="ghost" size="sm">
                                <Eye className="h-4 w-4" />
                              </Button>
                            </Link>
                            <Link
                              href={`/admin/order-management/purchase-orders/${po.id}/edit`}
                            >
                              <Button variant="ghost" size="sm">
                                <Edit className="h-4 w-4" />
                              </Button>
                            </Link>
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
      </div>
    </Layout>
  );
}
