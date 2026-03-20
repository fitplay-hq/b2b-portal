"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { OMDataTable } from "@/components/orderManagement/shared/OMDataTable";
import { OMFilterCard } from "@/components/orderManagement/shared/OMFilterCard";
import { OMInfiniteScroll } from "@/components/orderManagement/shared/OMInfiniteScroll";
import { type PaginatedResponse } from "@/lib/om-data";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { DeleteConfirmationDialog } from "@/components/delete-confirmation-dialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { OMBrand } from "@/types/order-management";
import { OMPageHeader } from "@/components/orderManagement/shared/parts/OMPageHeader";
import { useOMClientData } from "@/hooks/use-om-client-data";
import { exportToExcel, exportToPDF } from "@/lib/om-export-utils";
import { BrandForm } from "./BrandForm";
import { BrandsTable } from "./BrandsTable";
import { Button } from "@/components/ui/button";

interface OMBrandsClientProps {
  initialData: PaginatedResponse<OMBrand>;
}

export function OMBrandsClient({ initialData }: OMBrandsClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const [brands, setBrands] = useState<OMBrand[]>(initialData.data);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [brandName, setBrandName] = useState("");
  const [searchTerm, setSearchTerm] = useState(searchParams.get("q") || "");

  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [sortBy, setSortBy] = useState<string>((searchParams.get("sortBy")) || "name_asc");
  const [showFilters, setShowFilters] = useState(false);

  const [editingBrand, setEditingBrand] = useState<OMBrand | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editName, setEditName] = useState("");
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
    setBrands(initialData.data);
    setCurrentPage(initialData.meta.page);
    setHasMore(initialData.meta.page < initialData.meta.totalPages);
  }, [initialData]);

  const loadMore = async () => {
    if (isFetchingMore || !hasMore) return;
    setIsFetchingMore(true);
    try {
      const nextPage = currentPage + 1;
      const url = new URL("/api/admin/om/brands", window.location.origin);
      url.searchParams.set("page", nextPage.toString());
      url.searchParams.set("limit", "50");
      
      searchParams.forEach((value, key) => {
        if (key !== "page" && key !== "limit") {
          url.searchParams.set(key, value);
        }
      });

      const res = await fetch(url.toString());
      if (res.ok) {
        const result: PaginatedResponse<OMBrand> = await res.json();
        setBrands((prev) => {
          const existingIds = new Set(prev.map(b => b.id));
          const uniqueNewData = result.data.filter(b => !existingIds.has(b.id));
          return [...prev, ...uniqueNewData];
        });
        setCurrentPage(result.meta.page);
        setHasMore(result.meta.page < result.meta.totalPages);
      }
    } catch (err) {
      console.error("Error loading more brands:", err);
      toast.error("Failed to load more brands");
    } finally {
      setIsFetchingMore(false);
    }
  };

  const filterFn = useCallback((brand: OMBrand, searchTerm: string) => {
    const q = searchTerm.toLowerCase().trim();
    return !q || brand.name.toLowerCase().includes(q);
  }, []);

  const sortFn = useCallback((a: OMBrand, b: OMBrand, sortBy: string) => {
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
    data: brands,
    searchTerm,
    sortBy,
    filters: {},
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

  // Sync sortBy with URL
  useEffect(() => {
    const currentSort = searchParams.get("sortBy") || "name_asc";
    if (sortBy !== currentSort) {
      updateUrl({ sortBy });
    }
  }, [sortBy, updateUrl, searchParams]);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!brandName.trim()) return;
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/admin/om/brands", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: brandName.trim() }),
      });
      if (res.ok) {
        toast.success("Brand added successfully");
        setBrandName("");
        router.refresh();
      } else {
        const error = await res.json();
        toast.error(error.error || "Failed to add brand");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to add brand");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (brand: OMBrand) => {
    setEditingBrand(brand);
    setEditName(brand.name);
    setIsEditDialogOpen(true);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBrand || !editName.trim()) return;
    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/admin/om/brands/${editingBrand.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: editName.trim() }),
      });
      if (res.ok) {
        toast.success("Brand updated successfully");
        setIsEditDialogOpen(false);
        router.refresh();
      } else {
        const error = await res.json();
        toast.error(error.error || "Failed to update brand");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error updating brand");
    } finally {
      setIsSubmitting(false);
    }
  };

  const onConfirmDelete = async () => {
    if (!deleteId) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/admin/om/brands/${deleteId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        toast.success("Brand deleted successfully");
        router.refresh();
        setIsDeleteDialogOpen(false);
      } else {
        const error = await res.json();
        toast.error(error.error || "Failed to delete brand");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error deleting brand");
    } finally {
      setIsDeleting(false);
      setDeleteId(null);
    }
  };
  const handleExportExcel = useCallback(() => {
    const exportData = processedData.map(brand => ({
      "Brand Name": brand.name,
      "Created At": brand.createdAt ? new Date(brand.createdAt).toLocaleDateString() : "-"
    }));
    
    if (exportToExcel(exportData, "Brands_Master")) {
      toast.success("Brands exported to Excel successfully");
    } else {
      toast.error("Failed to export brands to Excel");
    }
  }, [processedData]);

  const handleExportPDF = useCallback(() => {
    const exportData = processedData.map(brand => ({
      "Brand Name": brand.name,
      "Created At": brand.createdAt ? new Date(brand.createdAt).toLocaleDateString() : "-"
    }));
    
    if (exportToPDF(exportData, "Brands_Master", "Brands Master Report")) {
      toast.success("Brands exported to PDF successfully");
    } else {
      toast.error("Failed to export brands to PDF");
    }
  }, [processedData]);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.push("/admin/order-management/items")}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <OMPageHeader
          title="Manage Brands"
          description="Add or remove brands for your product catalog"
          className="flex-1"
          onExportExcel={handleExportExcel}
          onExportPDF={handleExportPDF}
        />
      </div>

      <BrandForm
        name={brandName}
        setName={setBrandName}
        onSubmit={handleAdd}
        isSubmitting={isSubmitting}
      />

      <OMFilterCard
        filteredCount={processedData.length}
        totalCount={initialData.meta.unfilteredTotal || initialData.meta.total}
        unit="brands"
        searchPlaceholder="Search by brand name..."
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        sortBy={sortBy as any}
        onSortChange={setSortBy as any}
        showFilters={showFilters}
        setShowFilters={setShowFilters}
        onReset={() => {
          setSearchTerm("");
          router.push(pathname);
        }}
      >
        {null}
      </OMFilterCard>

      <BrandsTable
        data={processedData}
        isLoading={isLoading}
        sortBy={sortBy}
        onSort={setSortBy}
        onEdit={handleEdit}
        onDelete={(id) => { setDeleteId(id); setIsDeleteDialogOpen(true); }}
      />

      <DeleteConfirmationDialog
        isOpen={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={onConfirmDelete}
        isLoading={isDeleting}
        title="Delete Brand"
        description="Are you sure you want to delete this brand?"
      />

      <OMInfiniteScroll
        onLoadMore={loadMore}
        hasMore={hasMore}
        isLoading={isFetchingMore}
      />

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Brand</DialogTitle>
          </DialogHeader>
          <BrandForm
            name={editName}
            setName={setEditName}
            onSubmit={handleUpdate}
            isSubmitting={isSubmitting}
            isEdit={true}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
