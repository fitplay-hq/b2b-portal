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
import { Plus, Search, Eye, FileDown, FileSpreadsheet } from "lucide-react";
import { omDispatches, omClients, OMDispatch } from "../_mock/omMockData";
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

  // Filter dispatches
  const filteredDispatches = omDispatches.filter((dispatch) => {
    const matchesSearch =
      dispatch.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dispatch.poNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dispatch.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dispatch.trackingNumber.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || dispatch.status === statusFilter;
    const matchesClient =
      clientFilter === "all" || dispatch.clientId === clientFilter;

    return matchesSearch && matchesStatus && matchesClient;
  });

  const getStatusVariant = (status: OMDispatch["status"]) => {
    switch (status) {
      case "Created":
        return "secondary";
      case "Dispatched":
        return "default";
      case "Delivered":
        return "default";
      case "Cancelled":
        return "destructive";
      default:
        return "secondary";
    }
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
      return [
        dispatch.invoiceNumber,
        dispatch.poNumber,
        dispatch.clientName,
        dispatch.totalDispatchQty,
        dispatch.logisticsPartnerName,
        dispatch.trackingNumber,
        new Date(dispatch.invoiceDate).toLocaleDateString("en-IN"),
        new Date(dispatch.expectedDeliveryDate).toLocaleDateString("en-IN"),
        dispatch.status,
        dispatch.grandTotal,
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
      pdfContent += `
Invoice: ${dispatch.invoiceNumber} | PO: ${dispatch.poNumber} | Client: ${dispatch.clientName}
Status: ${dispatch.status} | Date: ${new Date(dispatch.invoiceDate).toLocaleDateString("en-IN")}
Quantity: ${dispatch.totalDispatchQty} | Courier: ${dispatch.logisticsPartnerName}
Tracking: ${dispatch.trackingNumber} | Expected Delivery: ${new Date(dispatch.expectedDeliveryDate).toLocaleDateString("en-IN")}
Total Value: ₹${dispatch.grandTotal.toLocaleString("en-IN")}
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
                  <SelectItem value="Created">Created</SelectItem>
                  <SelectItem value="Dispatched">Dispatched</SelectItem>
                  <SelectItem value="Delivered">Delivered</SelectItem>
                  <SelectItem value="Cancelled">Cancelled</SelectItem>
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
                      <TableCell>{dispatch.poNumber}</TableCell>
                      <TableCell>{dispatch.clientName}</TableCell>
                      <TableCell className="text-right">
                        {dispatch.totalDispatchQty}
                      </TableCell>
                      <TableCell>{dispatch.logisticsPartnerName}</TableCell>
                      <TableCell className="font-mono text-sm">
                        {dispatch.trackingNumber}
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
