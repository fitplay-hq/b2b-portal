"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Layout from "@/components/layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, FileDown, FileSpreadsheet, Download } from "lucide-react";
import { toast } from "sonner";
import { OMPurchaseOrderFilters } from "@/components/orderManagement/OMPurchaseOrderFilters";
import { OMPurchaseOrderListTable } from "@/components/orderManagement/OMPurchaseOrderListTable";
import { DeleteConfirmationDialog } from "@/components/delete-confirmation-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import {
  OMSortControl,
  type SortOption,
} from "@/components/orderManagement/OMSortControl";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type {
  OMPurchaseOrder,
  OMClient,
  OMPaginationMeta,
} from "@/types/order-management";

export default function OMPurchaseOrdersList() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [clientFilter, setClientFilter] = useState<string>("all");
  const [purchaseOrders, setPurchaseOrders] = useState<OMPurchaseOrder[]>([]);
  const [clients, setClients] = useState<OMClient[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [meta, setMeta] = useState<OMPaginationMeta | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>("newest");

  const [deletePo, setDeletePo] = useState<OMPurchaseOrder | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

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

  const filteredPOs = purchaseOrders
    .filter((po) => {
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
      if (sortBy === "name_asc")
        return (a.client?.name || "").localeCompare(b.client?.name || "");
      if (sortBy === "name_desc")
        return (b.client?.name || "").localeCompare(a.client?.name || "");
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
      if (sortBy === "latest_update")
        return (
          new Date(b.updatedAt || 0).getTime() -
          new Date(a.updatedAt || 0).getTime()
        );
      return 0;
    });

  const handleExportExcel = () => {
    toast.info("Exporting to Excel...");
    // Future: Use modular export utility
  };

  const handleExportPDF = () => {
    toast.info("Exporting to PDF...");
    // Future: Use modular export utility
  };

  return (
    <Layout isClient={false}>
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

        <Card>
          <CardHeader>
            <CardTitle>Filters</CardTitle>
          </CardHeader>
          <CardContent>
            <OMPurchaseOrderFilters
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              statusFilter={statusFilter}
              onStatusChange={setStatusFilter}
              clientFilter={clientFilter}
              onClientChange={setClientFilter}
              clients={clients}
            />
            <div className="mt-4 flex justify-start items-end">
              <OMSortControl
                value={sortBy}
                onValueChange={setSortBy}
                nameLabel="Client Name"
                className="w-full md:w-[200px]"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Purchase Order List</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                <div className="border rounded-md">
                  <div className="grid grid-cols-7 gap-4 p-4 border-b bg-muted/50">
                    {[...Array(7)].map((_, i) => (
                      <Skeleton key={i} className="h-4 w-full" />
                    ))}
                  </div>
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className="grid grid-cols-7 gap-4 p-4 border-b"
                    >
                      {[...Array(7)].map((_, j) => (
                        <Skeleton key={j} className="h-4 w-full" />
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <OMPurchaseOrderListTable
                purchaseOrders={filteredPOs}
                onDeleteRequest={setDeletePo}
              />
            )}
          </CardContent>
        </Card>
      </div>

      <DeleteConfirmationDialog
        isOpen={!!deletePo}
        onOpenChange={(open) => !open && setDeletePo(null)}
        onConfirm={handleDeletePO}
        title="Delete Purchase Order"
        description="Are you sure you want to delete this purchase order? This action cannot be undone."
        isLoading={isDeleting}
      />
    </Layout>
  );
}
