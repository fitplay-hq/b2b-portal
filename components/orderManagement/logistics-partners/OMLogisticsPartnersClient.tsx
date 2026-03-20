"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import type { OMLogisticsPartner } from "@/types/order-management";
import { DeleteConfirmationDialog } from "@/components/delete-confirmation-dialog";
import { OMFilterCard } from "@/components/orderManagement/shared/OMFilterCard";
import { OMActiveFilters } from "@/components/orderManagement/shared/OMActiveFilters";
import { LogisticsPartnerFilters } from "./LogisticsPartnerFilters";
import { useOMFilters } from "@/hooks/use-om-filters";
import { OMInfiniteScroll } from "@/components/orderManagement/shared/OMInfiniteScroll";
import { type PaginatedResponse } from "@/lib/om-data";
import { LOGISTICS_SORT_OPTIONS } from "@/constants/om-sort-options";
import { OMPageHeader } from "@/components/orderManagement/shared/parts/OMPageHeader";
import { useOMClientData } from "@/hooks/use-om-client-data";
import { exportToExcel, exportToPDF } from "@/lib/om-export-utils";
import { PartnersTable } from "./PartnersTable";
import { PartnerForm } from "./PartnerForm";
import { PartnerViewDialog } from "./PartnerViewDialog";
import { useOMLogisticsPartnersList, useMutatePartners } from "@/data/om/admin.hooks";

interface OMLogisticsPartnersClientProps {
  initialData: PaginatedResponse<OMLogisticsPartner>;
}

export function OMLogisticsPartnersClient({
  initialData,
}: OMLogisticsPartnersClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  // SWR Hook for partners
  const { partners: swrPartners, meta: swrMeta, isLoading: isSWRLoading } = useOMLogisticsPartnersList(searchParams.toString());

  const [partners, setPartners] = useState<OMLogisticsPartner[]>(initialData.data);
  const [searchTerm, setSearchTerm] = useState(searchParams.get("q") || "");
  const { savePartner, deletePartner } = useMutatePartners();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [editingPartner, setEditingPartner] = useState<OMLogisticsPartner | null>(null);
  const [viewingPartner, setViewingPartner] = useState<OMLogisticsPartner | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sortBy, setSortBy] = useState<string>((searchParams.get("sortBy")) || "name_asc");
  const [showFilters, setShowFilters] = useState(false);
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


  // Sync SWR data to local state for infinite scroll
  useEffect(() => {
    if (swrPartners && swrPartners.length > 0) {
      if (searchParams.get("page") === "1" || !searchParams.get("page")) {
        setPartners(swrPartners);
        if (swrMeta) {
          setCurrentPage(swrMeta.page);
          setHasMore(swrMeta.page < swrMeta.totalPages);
        }
      }
    }
  }, [swrPartners, swrMeta, searchParams]);

  useEffect(() => {
    if (initialData.data.length > 0) {
      setPartners(initialData.data);
      setCurrentPage(initialData.meta.page);
      setHasMore(initialData.meta.page < initialData.meta.totalPages);
    }
  }, [initialData]);

  const loadMore = async () => {
    if (isFetchingMore || !hasMore) return;
    setIsFetchingMore(true);
    try {
      const nextPage = currentPage + 1;
      const url = new URL("/api/admin/om/logistics-partners", window.location.origin);
      url.searchParams.set("page", nextPage.toString());
      url.searchParams.set("limit", "50");
      
      searchParams.forEach((value, key) => {
        if (key !== "page" && key !== "limit") {
          url.searchParams.set(key, value);
        }
      });

      const res = await fetch(url.toString());
      if (res.ok) {
        const result: PaginatedResponse<OMLogisticsPartner> = await res.json();
        setPartners((prev) => {
          const existingIds = new Set(prev.map(p => p.id));
          const uniqueNewData = result.data.filter(p => !existingIds.has(p.id));
          return [...prev, ...uniqueNewData];
        });
        setCurrentPage(result.meta.page);
        setHasMore(result.meta.page < result.meta.totalPages);
      }
    } catch (err) {
      console.error("Error loading more partners:", err);
      toast.error("Failed to load more partners");
    } finally {
      setIsFetchingMore(false);
    }
  };

  const { filters, setFilters, resetFilters, activeFilters, removeFilter } =
    useOMFilters({
      initialFilters: {
        partnerName: searchParams.get("partnerName") || "",
      },
      labels: {
        partnerName: "Partner",
      },
    });

  const filterFn = useCallback((partner: OMLogisticsPartner, searchTerm: string, filters: Record<string, any>) => {
    const q = searchTerm.toLowerCase().trim();
    const matchesSearch = !q || 
      partner.name.toLowerCase().includes(q) || 
      (partner.contactPerson || "").toLowerCase().includes(q) || 
      (partner.email || "").toLowerCase().includes(q) || 
      (partner.phone || "").toLowerCase().includes(q);
    
    const matchesPartner = !filters.partnerName || partner.name === filters.partnerName;
    
    return matchesSearch && matchesPartner;
  }, []);

  const sortFn = useCallback((a: OMLogisticsPartner, b: OMLogisticsPartner, sortBy: string) => {
    switch (sortBy) {
      case "name_asc":
        return a.name.localeCompare(b.name);
      case "name_desc":
        return b.name.localeCompare(a.name);
      case "contact_asc":
        return (a.contactPerson || "").localeCompare(b.contactPerson || "");
      case "contact_desc":
        return (b.contactPerson || "").localeCompare(a.contactPerson || "");
      case "email_asc":
        return (a.email || "").localeCompare(b.email || "");
      case "email_desc":
        return (b.email || "").localeCompare(a.email || "");
      case "phone_asc":
        return (a.phone || "").localeCompare(b.phone || "");
      case "phone_desc":
        return (b.phone || "").localeCompare(a.phone || "");
      default:
        return 0;
    }
  }, []);

  const processedData = useOMClientData({
    data: partners,
    searchTerm,
    sortBy,
    filters,
    filterFn,
    sortFn,
  });

  // Sync searchTerm with URL
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm !== (searchParams.get("q") || "")) {
        updateUrl({ q: searchTerm || null });
      }
    }, 500);
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
    }, 500);
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
    phone: "",
    email: "",
    defaultMode: "Surface" as "Air" | "Surface" | "Road",
  });

  const resetForm = () => {
    setFormData({
      name: "",
      contactPerson: "",
      phone: "",
      email: "",
      defaultMode: "Surface",
    });
    setEditingPartner(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const result = await savePartner(formData, editingPartner?.id);
    if (result.success) {
      toast.success(`Partner ${editingPartner ? "updated" : "added"} successfully`);
      setIsAddDialogOpen(false);
      resetForm();
    } else {
      toast.error(result.error);
    }
    setIsSubmitting(false);
  };

  const handleEdit = (partner: OMLogisticsPartner) => {
    setEditingPartner(partner);
    setFormData({
      name: partner.name,
      contactPerson: partner.contactPerson || "",
      phone: partner.phone || "",
      email: partner.email || "",
      defaultMode: (partner.defaultMode as any) || "Surface",
    });
    setIsAddDialogOpen(true);
  };

  const handleView = (partner: OMLogisticsPartner) => {
    setViewingPartner(partner);
    setIsViewDialogOpen(true);
  };

  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const onConfirmDelete = async () => {
    if (!deleteId) return;
    setIsDeleting(true);
    const success = await deletePartner(deleteId);
    if (success) {
      toast.success("Logistics partner deleted successfully");
      setIsDeleteDialogOpen(false);
    } else {
      toast.error("Failed to delete partner");
    }
    setIsDeleting(false);
    setDeleteId(null);
  };

  const handleExportExcel = useCallback(() => {
    const exportData = processedData.map(p => ({
      "Partner Name": p.name,
      "Contact Person": p.contactPerson || "-",
      "Email": p.email || "-",
      "Phone": p.phone || "-",
      "Default Mode": p.defaultMode || "-"
    }));
    
    if (exportToExcel(exportData, "Logistics_Partners")) {
      toast.success("Logistics partners exported to Excel successfully");
    } else {
      toast.error("Failed to export logistics partners to Excel");
    }
  }, [processedData]);
  const handleExportPDF = useCallback(() => {
    const exportData = processedData.map(p => ({
      "Partner Name": p.name,
      "Contact Person": p.contactPerson || "-",
      "Email": p.email || "-",
      "Phone": p.phone || "-",
      "Default Mode": p.defaultMode || "-"
    }));
    
    if (exportToPDF(exportData, "Logistics_Partners", "Logistics Partners Report")) {
      toast.success("Logistics partners exported to PDF successfully");
    } else {
      toast.error("Failed to export logistics partners to PDF");
    }
  }, [processedData]);

  const partnerOptions = useMemo(() => partners.map((p) => ({ value: p.name, label: p.name })), [partners]);

  return (
    <div className="space-y-6">
      <OMPageHeader
        title="Logistics Partners"
        description="Manage your logistics and courier partners"
        onExportExcel={handleExportExcel}
        onExportPDF={handleExportPDF}
        addButton={{
          label: "Add Partner",
          onClick: () => setIsAddDialogOpen(true)
        }}
      />

      <OMFilterCard
        filteredCount={processedData.length}
        totalCount={swrMeta?.unfilteredTotal || swrMeta?.total || initialData.meta.unfilteredTotal || initialData.meta.total}
        unit="logistics partners"
        searchPlaceholder="Search by name, contact person, or email..."
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        sortBy={sortBy as any}
        onSortChange={setSortBy as any}
        sortOptions={LOGISTICS_SORT_OPTIONS}
        sortNameLabel="Partner Name"
        showFilters={showFilters}
        setShowFilters={setShowFilters}
        onReset={() => {
          setSearchTerm("");
          resetFilters();
          router.push(pathname);
        }}
      >
        <LogisticsPartnerFilters
          filters={filters}
          setFilters={setFilters}
          partnerOptions={partnerOptions}
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

      <PartnersTable
        data={processedData}
        isLoading={isSWRLoading && partners.length === 0}
        sortBy={sortBy}
        onSort={setSortBy}
        onEdit={handleEdit}
        onDelete={(id) => { setDeleteId(id); setIsDeleteDialogOpen(true); }}
        onView={handleView}
      />

      <OMInfiniteScroll
        onLoadMore={loadMore}
        hasMore={hasMore}
        isLoading={isFetchingMore}
      />

      <DeleteConfirmationDialog
        isOpen={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={onConfirmDelete}
        isLoading={isDeleting}
        title="Delete Logistics Partner"
        description="Are you sure you want to delete this logistics partner?"
      />

      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingPartner ? "Edit Logistics Partner" : "Add New Logistics Partner"}
            </DialogTitle>
          </DialogHeader>
          <PartnerForm
            formData={formData}
            setFormData={setFormData}
            isSubmitting={isSubmitting}
            onSubmit={handleSubmit}
            onCancel={() => setIsAddDialogOpen(false)}
            isEdit={!!editingPartner}
          />
        </DialogContent>
      </Dialog>

      <PartnerViewDialog
        partner={viewingPartner}
        isOpen={isViewDialogOpen}
        onOpenChange={setIsViewDialogOpen}
        onEdit={handleEdit}
      />
    </div>
  );
}
