"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Layout from "@/components/layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Search,
  Plus,
  FileDown,
  FileSpreadsheet,
  Download,
  Package,
} from "lucide-react";
import { toast } from "sonner";
import { OMPurchaseOrderListTable } from "@/components/orderManagement/OMPurchaseOrderListTable";
import { DeleteConfirmationDialog } from "@/components/delete-confirmation-dialog";
import { OMFilterCard } from "@/components/orderManagement/shared/OMFilterCard";
import { OMActiveFilters } from "@/components/orderManagement/shared/OMActiveFilters";
import { POFilters } from "@/components/orderManagement/purchaseOrders/POFilters";
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
import { SearchableSelect, ComboboxOption } from "@/components/ui/combobox";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useMemo } from "react";
import type {
  OMPurchaseOrder,
  OMClient,
  OMPaginationMeta,
} from "@/types/order-management";

const PO_STATUS_LABELS: Record<string, string> = {
  DRAFT: "Draft",
  CONFIRMED: "Confirmed",
  PARTIALLY_DISPATCHED: "Partially Dispatched",
  FULLY_DISPATCHED: "Fully Dispatched",
  CLOSED: "Closed",
};

export default function OMPurchaseOrdersList() {
  const [searchTerm, setSearchTerm] = useState("");
  const [purchaseOrders, setPurchaseOrders] = useState<OMPurchaseOrder[]>([]);
  const [clients, setClients] = useState<OMClient[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [meta, setMeta] = useState<OMPaginationMeta | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>("newest");

  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    fromDate: "",
    toDate: "",
    clientName: "",
    poNumber: "",
    status: "all",
    locationId: "",
  });

  const [locationOptions, setLocationOptions] = useState<ComboboxOption[]>([]);
  const [poOptions, setPoOptions] = useState<ComboboxOption[]>([]);

  const [deletePo, setDeletePo] = useState<OMPurchaseOrder | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchOptions = async () => {
    try {
      const [clientsRes, locationsRes, poOptionsRes] = await Promise.all([
        fetch("/api/admin/om/clients"),
        fetch("/api/admin/om/delivery-locations"),
        fetch("/api/admin/om/purchase-orders/options"),
      ]);

      if (clientsRes.ok) {
        const data = await clientsRes.json();
        setClients(data);
      }
      if (locationsRes.ok) {
        const locations = await locationsRes.json();
        setLocationOptions(
          locations.map((l: any) => ({ value: l.id, label: l.name })),
        );
      }
      if (poOptionsRes.ok) {
        const poOpts = await poOptionsRes.json();
        setPoOptions(poOpts);
      }
    } catch (err) {
      console.error("Failed to fetch options", err);
    }
  };

  const fetchPurchaseOrders = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.status !== "all") params.append("status", filters.status);
      if (filters.clientName) {
        const client = clients.find((c) => c.name === filters.clientName);
        if (client) params.append("clientId", client.id);
      }
      if (filters.fromDate) params.append("fromDate", filters.fromDate);
      if (filters.toDate) params.append("toDate", filters.toDate);
      if (filters.poNumber) params.append("poNumber", filters.poNumber);
      if (filters.locationId) params.append("locationId", filters.locationId);

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
    fetchOptions();
  }, []);

  useEffect(() => {
    fetchPurchaseOrders();
  }, [filters]);

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

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      fetchPurchaseOrders();
    }
  };

  const resetFilters = () => {
    setFilters({
      fromDate: "",
      toDate: "",
      clientName: "",
      poNumber: "",
      status: "all",
      locationId: "",
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
    if (filters.poNumber)
      active.push({ key: "poNumber", label: "PO #", value: filters.poNumber });
    if (filters.locationId) {
      const label = locationOptions.find(
        (o) => o.value === filters.locationId,
      )?.label;
      active.push({
        key: "locationId",
        label: "Location",
        value: label || filters.locationId,
      });
    }
    if (filters.status && filters.status !== "all") {
      active.push({
        key: "status",
        label: "Status",
        value: PO_STATUS_LABELS[filters.status] || filters.status,
      });
    }
    return active;
  }, [filters, locationOptions]);

  const clientOptions = useMemo(() => {
    return clients.map((c) => ({ value: c.name, label: c.name }));
  }, [clients]);

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

        <OMFilterCard
          title="Filters"
          subtitle={`Showing ${filteredPOs.length} of ${meta?.total || purchaseOrders.length} purchase orders`}
          searchPlaceholder="Search by PO/Estimate #, client name..."
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          sortBy={sortBy}
          onSortChange={setSortBy}
          sortNameLabel="Client Name"
          showFilters={showFilters}
          setShowFilters={setShowFilters}
          onReset={resetFilters}
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
            onClearAll={resetFilters}
          />
        </OMFilterCard>

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
