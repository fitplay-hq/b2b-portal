"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import type { OMClient } from "@/types/order-management";
import { DeleteConfirmationDialog } from "@/components/delete-confirmation-dialog";
import { OMClientForm } from "@/components/orderManagement/OMClientForm";
import type { SortOption } from "@/components/orderManagement/OMSortControl";
import { OMFilterCard } from "@/components/orderManagement/shared/OMFilterCard";
import { OMActiveFilters } from "@/components/orderManagement/shared/OMActiveFilters";
import { ClientFilters } from "./ClientFilters";
import { useOMFilters } from "@/hooks/use-om-filters";
import { OMInfiniteScroll } from "@/components/orderManagement/shared/OMInfiniteScroll";
import { type PaginatedResponse } from "@/lib/om-data";
import { CLIENT_SORT_OPTIONS } from "@/constants/om-sort-options";
import { OMPageHeader } from "@/components/orderManagement/shared/parts/OMPageHeader";
import { useOMClientData } from "@/hooks/use-om-client-data";
import { exportToExcel, exportToPDF } from "@/lib/om-export-utils";
import { ClientsTable } from "./ClientsTable";
import { ClientViewDialog } from "./ClientViewDialog";

interface OMClientsClientProps {
  initialData: PaginatedResponse<OMClient>;
}

export function OMClientsClient({ initialData }: OMClientsClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const [clients, setClients] = useState<OMClient[]>(initialData.data);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState(searchParams.get("q") || "");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<OMClient | null>(null);
  const [viewingClient, setViewingClient] = useState<OMClient | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sortBy, setSortBy] = useState<string>((searchParams.get("sortBy")) || "name_asc");
  const [showFilters, setShowFilters] = useState(false);
  const [unfilteredTotal, setUnfilteredTotal] = useState(initialData.meta.total);
  const [currentPage, setCurrentPage] = useState(initialData.meta.page);
  const [hasMore, setHasMore] = useState(initialData.meta.page < initialData.meta.totalPages);
  const [isFetchingMore, setIsFetchingMore] = useState(false);

  // Helper to update URL
  const updateUrl = useCallback((newParams: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());
    let changed = false;
    
    Object.entries(newParams).forEach(([key, value]) => {
      const currentValue = searchParams.get(key) || "";
      const newValue = value === null || value === "all" ? "" : value;
      
      if (currentValue !== newValue) {
        if (value === null || value === "" || value === "all") {
          params.delete(key);
        } else {
          params.set(key, value);
        }
        changed = true;
      }
    });

    if (changed) {
      params.set("page", "1");
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    }
  }, [searchParams, pathname, router]);

  useEffect(() => {
    const isFiltered = searchParams.get("q") || searchParams.get("clientName");
    if (isFiltered) {
      fetch("/api/admin/om/counts")
        .then(res => res.json())
        .then(data => setUnfilteredTotal(data.clients))
        .catch(err => console.error("Failed to fetch client counts", err));
    } else {
      setUnfilteredTotal(initialData.meta.total);
    }
  }, [initialData.meta.total, searchParams]);

  useEffect(() => {
    setClients(initialData.data);
    setCurrentPage(initialData.meta.page);
    setHasMore(initialData.meta.page < initialData.meta.totalPages);
  }, [initialData]);

  const loadMore = async () => {
    if (isFetchingMore || !hasMore) return;
    setIsFetchingMore(true);
    try {
      const nextPage = currentPage + 1;
      const url = new URL("/api/admin/om/clients", window.location.origin);
      url.searchParams.set("page", nextPage.toString());
      url.searchParams.set("limit", "50");
      
      searchParams.forEach((value, key) => {
        if (key !== "page" && key !== "limit") {
          url.searchParams.set(key, value);
        }
      });

      const res = await fetch(url.toString());
      if (res.ok) {
        const result: PaginatedResponse<OMClient> = await res.json();
        setClients((prev) => {
          const existingIds = new Set(prev.map(c => c.id));
          const uniqueNewData = result.data.filter(c => !existingIds.has(c.id));
          return [...prev, ...uniqueNewData];
        });
        setCurrentPage(result.meta.page);
        setHasMore(result.meta.page < result.meta.totalPages);
      }
    } catch (err) {
      console.error("Error loading more clients:", err);
      toast.error("Failed to load more clients");
    } finally {
      setIsFetchingMore(false);
    }
  };

  const { filters, setFilters, resetFilters, activeFilters, removeFilter } =
    useOMFilters({
      initialFilters: {
        clientName: searchParams.get("clientName") || "",
      },
      labels: {
        clientName: "Client",
      },
    });

  const filterFn = useCallback((client: OMClient, searchTerm: string, filters: Record<string, any>) => {
    const q = searchTerm.toLowerCase().trim();
    const matchesSearch = !q || 
      client.name.toLowerCase().includes(q) || 
      (client.contactPerson || "").toLowerCase().includes(q) || 
      (client.email || "").toLowerCase().includes(q) || 
      (client.gstNumber || "").toLowerCase().includes(q);
    
    const matchesFilter = !filters.clientName || client.name === filters.clientName;
    
    return matchesSearch && matchesFilter;
  }, []);

  const sortFn = useCallback((a: OMClient, b: OMClient, sortBy: string) => {
    switch (sortBy) {
      case "name_asc":
        return a.name.localeCompare(b.name);
      case "name_desc":
        return b.name.localeCompare(a.name);
      case "newest":
        return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
      case "oldest":
        return new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime();
      case "latest_update":
        return new Date(b.updatedAt || 0).getTime() - new Date(a.updatedAt || 0).getTime();
      default:
        return 0;
    }
  }, []);

  const processedData = useOMClientData({
    data: clients,
    searchTerm,
    sortBy,
    filters,
    filterFn,
    sortFn,
  });

  // Sync searchTerm with URL (debounced server search)
  useEffect(() => {
    const timer = setTimeout(() => {
      const currentQ = searchParams.get("q") || "";
      if (searchTerm.trim() !== currentQ) {
        updateUrl({ q: searchTerm.trim() || null });
      }
    }, 1000);
    return () => clearTimeout(timer);
  }, [searchTerm, updateUrl, searchParams]);

  // Sync filters with URL
  useEffect(() => {
    const timer = setTimeout(() => {
      const newParams: Record<string, string | null> = {};
      let changed = false;
      Object.entries(filters).forEach(([key, value]) => {
        if (searchParams.get(key) !== value) {
          newParams[key] = value;
          changed = true;
        }
      });
      if (changed) updateUrl(newParams);
    }, 1000);
    return () => clearTimeout(timer);
  }, [filters, updateUrl, searchParams]);

  // Sync sortBy with URL
  useEffect(() => {
    const currentSort = searchParams.get("sortBy") || "name_asc";
    if (sortBy !== currentSort) {
      updateUrl({ sortBy });
    }
  }, [sortBy, updateUrl, searchParams]);

  const [formData, setFormData] = useState({
    name: "",
    contactPerson: "",
    email: "",
    phone: "",
    billingAddress: "",
    gstNumber: "",
    notes: "",
  });

  const resetForm = () => {
    setFormData({
      name: "",
      contactPerson: "",
      email: "",
      phone: "",
      billingAddress: "",
      gstNumber: "",
      notes: "",
    });
    setEditingClient(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const url = editingClient
        ? `/api/admin/om/clients/${editingClient.id}`
        : "/api/admin/om/clients";
      const method = editingClient ? "PATCH" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        toast.success(`Client ${editingClient ? "updated" : "added"} successfully`);
        setIsAddDialogOpen(false);
        resetForm();
        router.refresh();
      } else {
        const error = await res.json();
        toast.error(error.error || "Something went wrong");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to save client");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (client: OMClient) => {
    setEditingClient(client);
    setFormData({
      name: client.name,
      contactPerson: client.contactPerson || "",
      email: client.email || "",
      phone: client.phone || "",
      billingAddress: client.billingAddress || "",
      gstNumber: client.gstNumber || "",
      notes: client.notes || "",
    });
    setIsAddDialogOpen(true);
  };
  
  const handleView = (client: OMClient) => {
    setViewingClient(client);
    setIsViewDialogOpen(true);
  };

  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const onConfirmDelete = async () => {
    if (!deleteId) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/admin/om/clients/${deleteId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        toast.success("Client deleted successfully");
        router.refresh();
        setIsDeleteDialogOpen(false);
      } else {
        const errorData = await res.json();
        toast.error(errorData.error || "Failed to delete client");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error deleting client");
    } finally {
      setIsDeleting(false);
      setDeleteId(null);
    }
  };

  const clientOptions = useMemo(() => {
    return Array.from(new Set(clients.map((c) => c.name))).map((name) => ({
      value: name,
      label: name,
    }));
  }, [clients]);

  const handleExportExcel = useCallback(() => {
    const exportData = processedData.map(client => ({
      "Client Name": client.name,
      "Contact Person": client.contactPerson || "-",
      "Email": client.email || "-",
      "Phone": client.phone || "-",
      "GST Number": client.gstNumber || "-",
      "Billing Address": client.billingAddress || "-"
    }));
    
    if (exportToExcel(exportData, "Clients_Master")) {
      toast.success("Clients exported to Excel successfully");
    } else {
      toast.error("Failed to export clients to Excel");
    }
  }, [processedData]);
  const handleExportPDF = useCallback(() => {
    const exportData = processedData.map(client => ({
      "Client Name": client.name,
      "Contact Person": client.contactPerson || "-",
      "Email": client.email || "-",
      "Phone": client.phone || "-",
      "GST Number": client.gstNumber || "-",
      "Billing Address": client.billingAddress || "-"
    }));
    
    if (exportToPDF(exportData, "Clients_Master", "Clients Master Report")) {
      toast.success("Clients exported to PDF successfully");
    } else {
      toast.error("Failed to export clients to PDF");
    }
  }, [processedData]);

  return (
    <div className="space-y-6">
      <OMPageHeader
        title="Clients Master"
        description="Manage your client database"
        onExportExcel={handleExportExcel}
        onExportPDF={handleExportPDF}
        addButton={{
          label: "Add Client",
          onClick: () => setIsAddDialogOpen(true)
        }}
      />

      <OMFilterCard
        filteredCount={processedData.length}
        totalCount={unfilteredTotal}
        unit="clients"
        searchPlaceholder="Search by name, contact, email, or GST number..."
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        sortBy={sortBy as any}
        onSortChange={setSortBy as any}
        sortOptions={CLIENT_SORT_OPTIONS}
        sortNameLabel="Client Name"
        showFilters={showFilters}
        setShowFilters={setShowFilters}
        onReset={() => {
          setSearchTerm("");
          resetFilters();
          router.push(pathname);
        }}
      >
        <ClientFilters
          filters={filters}
          setFilters={setFilters}
          clientOptions={clientOptions}
        />
        <OMActiveFilters
          activeFilters={activeFilters}
          onRemove={removeFilter}
          onClearAll={() => {
            setSearchTerm("");
            resetFilters();
            router.push(pathname);
          }}
        />
      </OMFilterCard>

      <ClientsTable
        data={processedData}
        isLoading={isLoading}
        sortBy={sortBy}
        onSort={setSortBy}
        onEdit={handleEdit}
        onDelete={(id) => { setDeleteId(id); setIsDeleteDialogOpen(true); }}
        onView={handleView}
      />

      <DeleteConfirmationDialog
        isOpen={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={onConfirmDelete}
        isLoading={isDeleting}
        title="Delete Client"
        description="Are you sure you want to delete this client?"
      />

      <OMInfiniteScroll
        onLoadMore={loadMore}
        hasMore={hasMore}
        isLoading={isFetchingMore}
      />
      
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingClient ? "Edit Client" : "Add Client"}</DialogTitle>
          </DialogHeader>
          <OMClientForm
            formData={formData}
            onChange={setFormData}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
            isEdit={!!editingClient}
          />
        </DialogContent>
      </Dialog>
      
      <ClientViewDialog
        client={viewingClient}
        isOpen={isViewDialogOpen}
        onOpenChange={setIsViewDialogOpen}
        onEdit={handleEdit}
      />
    </div>
  );
}
