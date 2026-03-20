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
import { Tags, Plus } from "lucide-react";
import { toast } from "sonner";
import type { OMProduct, OMBrand } from "@/types/order-management";
import type { SortOption } from "@/components/orderManagement/OMSortControl";
import { formatDateToYYYYMMDD } from "@/lib/utils";
import { DeleteConfirmationDialog } from "@/components/delete-confirmation-dialog";
import { OMNewItemDialog } from "@/components/orderManagement/OMNewItemDialog";
import { OMFilterCard } from "@/components/orderManagement/shared/OMFilterCard";
import { OMActiveFilters } from "@/components/orderManagement/shared/OMActiveFilters";
import { ItemFilters } from "./ItemFilters";
import { useOMFilters } from "@/hooks/use-om-filters";
import { OMInfiniteScroll } from "@/components/orderManagement/shared/OMInfiniteScroll";
import { type PaginatedResponse } from "@/lib/om-data";
import { ITEM_SORT_OPTIONS } from "@/constants/om-sort-options";
import { useOMCounts } from "@/hooks/use-om-counts";
import { OMPageHeader } from "@/components/orderManagement/shared/parts/OMPageHeader";
import { useOMClientData } from "@/hooks/use-om-client-data";
import { exportToExcel, exportToPDF } from "@/lib/om-export-utils";
import { ItemsTable } from "./ItemsTable";
import { ItemForm } from "./ItemForm";
import { ItemViewDialog } from "./ItemViewDialog";

function skuBrandPart(brandName: string | undefined): string {
  return brandName
    ? brandName
        .replace(/[^a-zA-Z0-9]/g, "")
        .substring(0, 3)
        .toUpperCase()
    : "NIL";
}

function skuProductPart(productName: string): string {
  return productName
    .replace(/[^a-zA-Z0-9]/g, "")
    .substring(0, 3)
    .toUpperCase();
}

interface OMItemsClientProps {
  initialData: PaginatedResponse<OMProduct>;
  initialBrands: PaginatedResponse<OMBrand>;
}

export function OMItemsClient({
  initialData,
  initialBrands,
}: OMItemsClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const [items, setItems] = useState<OMProduct[]>(initialData.data);
  const [brands, setBrands] = useState<OMBrand[]>(initialBrands.data);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState(searchParams.get("q") || "");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<OMProduct | null>(null);
  const [viewingItem, setViewingItem] = useState<OMProduct | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>((searchParams.get("sortBy") as SortOption) || "name_asc");
  const [showFilters, setShowFilters] = useState(false);
  const { count: fetchedCount, mutate } = useOMCounts('items');
  const unfilteredTotal = fetchedCount ?? initialData.meta.total;
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
    setItems(initialData.data);
    setCurrentPage(initialData.meta.page);
    setHasMore(initialData.meta.page < initialData.meta.totalPages);
  }, [initialData]);

  const loadMore = async () => {
    if (isFetchingMore || !hasMore) return;
    setIsFetchingMore(true);
    try {
      const nextPage = currentPage + 1;
      const url = new URL("/api/admin/om/products", window.location.origin);
      url.searchParams.set("page", nextPage.toString());
      url.searchParams.set("limit", "50");
      
      searchParams.forEach((value, key) => {
        if (key !== "page" && key !== "limit") {
          url.searchParams.set(key, value);
        }
      });

      const res = await fetch(url.toString());
      if (res.ok) {
        const result: PaginatedResponse<OMProduct> = await res.json();
        setItems((prev) => {
          const existingIds = new Set(prev.map(item => item.id));
          const uniqueNewData = result.data.filter(item => !existingIds.has(item.id));
          return [...prev, ...uniqueNewData];
        });
        setCurrentPage(result.meta.page);
        setHasMore(result.meta.page < result.meta.totalPages);
      }
    } catch (err) {
      console.error("Error loading more items:", err);
      toast.error("Failed to load more items");
    } finally {
      setIsFetchingMore(false);
    }
  };

  const valueLabels = useMemo(
    () => ({
      brandIds: (val: any) => {
        if (Array.isArray(val)) {
          return val
            .map((id) => brands.find((b) => b.id === id)?.name || id)
            .join(", ");
        }
        return brands.find((b) => b.id === val)?.name || val;
      },
      gst: (val: string) => (val === "all" ? "All" : `${val}%`),
    }),
    [brands],
  );

  const { filters, setFilters, resetFilters, activeFilters, removeFilter } =
    useOMFilters({
      initialFilters: {
        brandIds: searchParams.get("brandIds")?.split(",") || [],
        minPrice: "",
        maxPrice: "",
        gst: "all",
        minTotalOrdered: "",
        maxTotalOrdered: "",
      },
      labels: {
        brandIds: "Brands",
        minPrice: "Min Price",
        maxPrice: "Max Price",
        gst: "GST",
        minTotalOrdered: "Min Ordered",
        maxTotalOrdered: "Max Ordered",
      },
      valueLabels,
    });

  const filterFn = useCallback((item: OMProduct, searchTerm: string, filters: Record<string, any>) => {
    const q = searchTerm.toLowerCase().trim();
    const matchesSearch = !q || 
      item.name.toLowerCase().includes(q) || 
      (item.sku || "").toLowerCase().includes(q) || 
      (item.description || "").toLowerCase().includes(q);
    
    const matchesBrand = filters.brandIds.length === 0 || item.brands?.some(b => filters.brandIds.includes(b.id));
    const matchesGst = filters.gst === "all" || item.defaultGstPct.toString() === filters.gst;
    
    const minP = filters.minPrice ? parseFloat(filters.minPrice) : null;
    const maxP = filters.maxPrice ? parseFloat(filters.maxPrice) : null;
    const matchesPrice = (!minP || (item.price || 0) >= minP) && (!maxP || (item.price || 0) <= maxP);
    
    const minQ = filters.minTotalOrdered ? parseInt(filters.minTotalOrdered) : null;
    const maxQ = filters.maxTotalOrdered ? parseInt(filters.maxTotalOrdered) : null;
    const matchesQty = (!minQ || (item.totalOrdered || 0) >= minQ) && (!maxQ || (item.totalOrdered || 0) <= maxQ);
    
    return Boolean(matchesSearch && matchesBrand && matchesGst && matchesPrice && matchesQty);
  }, []);

  const sortFn = useCallback((a: OMProduct, b: OMProduct, sortBy: SortOption) => {
    switch (sortBy) {
      case "name_asc":
        return a.name.localeCompare(b.name);
      case "name_desc":
        return b.name.localeCompare(a.name);
      case "sku_asc":
        return (a.sku || "").localeCompare(b.sku || "");
      case "sku_desc":
        return (b.sku || "").localeCompare(a.sku || "");
      case "brand_asc": {
        const aBrand = a.brands?.[0]?.name || "";
        const bBrand = b.brands?.[0]?.name || "";
        return aBrand.localeCompare(bBrand);
      }
      case "brand_desc": {
        const aBrand = a.brands?.[0]?.name || "";
        const bBrand = b.brands?.[0]?.name || "";
        return bBrand.localeCompare(aBrand);
      }
      case "rate_asc":
        return (a.price || 0) - (b.price || 0);
      case "rate_desc":
        return (b.price || 0) - (a.price || 0);
      case "gst_asc":
        return (a.defaultGstPct || 0) - (b.defaultGstPct || 0);
      case "gst_desc":
        return (b.defaultGstPct || 0) - (a.defaultGstPct || 0);
      case "newest":
        return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
      case "oldest":
        return new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime();
      default:
        return 0;
    }
  }, []);

  const processedData = useOMClientData({
    data: items,
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
        if (typeof value === "string") {
          if (searchParams.get(key) !== value) {
            newParams[key] = value;
            changed = true;
          }
        }
      });
      if (changed) updateUrl(newParams);
    }, 500);
    return () => clearTimeout(timer);
  }, [filters, updateUrl, searchParams]);

  // Sync sortBy with URL
  useEffect(() => {
    const currentSort = (searchParams.get("sortBy") as SortOption) || "name_asc";
    if (sortBy !== currentSort) {
      updateUrl({ sortBy });
    }
  }, [sortBy, updateUrl, searchParams]);

  const [formData, setFormData] = useState({
    name: "",
    sku: "",
    price: "",
    defaultGstPct: "0",
    description: "",
    brandIds: [] as string[],
    code: "",
    skuProductPart: "",
    isPrdManuallyEdited: false,
    skuNotApplicable: true,
  });

  const resetForm = () => {
    setFormData({
      name: "",
      sku: "",
      price: "",
      defaultGstPct: "0",
      description: "",
      brandIds: [],
      code: "",
      skuProductPart: "",
      isPrdManuallyEdited: false,
      skuNotApplicable: true,
    });
    setEditingItem(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const brand = brands.find((b) => formData.brandIds.includes(b.id));
    const brandPart = skuBrandPart(brand?.name);
    const prdPart = formData.skuProductPart;
    const finalSku = formData.skuNotApplicable
      ? null
      : `FP-${brandPart}-${prdPart || "PRD"}-${formData.code}`;

    const submissionData = {
      ...formData,
      sku: finalSku,
      price: formData.price ? parseFloat(formData.price) : null,
      defaultGstPct: parseFloat(formData.defaultGstPct),
      brandIds: formData.brandIds.length > 0 ? formData.brandIds : [],
    };
    delete (submissionData as any).skuNotApplicable;

    try {
      const url = editingItem
        ? `/api/admin/om/products/${editingItem.id}`
        : "/api/admin/om/products";

      const method = editingItem ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submissionData),
      });

      if (res.ok) {
        toast.success(`Item ${editingItem ? "updated" : "added"} successfully`);
        setIsAddDialogOpen(false);
        resetForm();
        router.refresh();
      } else {
        const error = await res.json();
        toast.error(error.error || "Something went wrong");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to save item");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (item: OMProduct) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      sku: item.sku || "",
      price: item.price?.toString() ?? "",
      defaultGstPct: item.defaultGstPct.toString(),
      description: item.description || "",
      brandIds: item.brands?.map((b: any) => b.id) || [],
      code: item.sku?.split("-").pop() || "",
      skuProductPart: item.sku?.split("-")[2] || skuProductPart(item.name),
      isPrdManuallyEdited: true,
      skuNotApplicable: !item.sku,
    });
    setIsAddDialogOpen(true);
  };

  const handleView = (item: OMProduct) => {
    setViewingItem(item);
    setIsViewDialogOpen(true);
  };

  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const onConfirmDelete = async () => {
    if (!deleteId) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/admin/om/products/${deleteId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        toast.success("Item deleted successfully");
        mutate();
        router.refresh();
        setIsDeleteDialogOpen(false);
      } else {
        const error = await res.json();
        toast.error(error.error || "Failed to delete item");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error deleting item");
    } finally {
      setIsDeleting(false);
      setDeleteId(null);
    }
  };

  const handleExportExcel = useCallback(() => {
    const exportData = processedData.map(item => ({
      "Item Name": item.name,
      "Brand": item.brands?.map((b: any) => b.name).join(", ") || "-",
      "SKU": item.sku || "-",
      "Rate": item.price || 0,
      "GST %": item.defaultGstPct || 0,
      "Total Ordered": item.totalOrdered || 0
    }));
    
    if (exportToExcel(exportData, "Items_Master")) {
      toast.success("Items exported to Excel successfully");
    } else {
      toast.error("Failed to export items to Excel");
    }
  }, [processedData]);
  const handleExportPDF = useCallback(() => {
    const exportData = processedData.map(item => ({
      "Item Name": item.name,
      "Brand": item.brands?.map((b: any) => b.name).join(", ") || "-",
      "SKU": item.sku || "-",
      "Rate": item.price || 0,
      "GST %": item.defaultGstPct || 0,
      "Total Ordered": item.totalOrdered || 0
    }));
    
    if (exportToPDF(exportData, "Items_Master", "Items Master Report")) {
      toast.success("Items exported to PDF successfully");
    } else {
      toast.error("Failed to export items to PDF");
    }
  }, [processedData]);

  const brandOptions = useMemo(() => brands.map((b) => ({ value: b.id, label: b.name })), [brands]);

  return (
    <div className="space-y-6">
      <OMPageHeader
        title="Items Master"
        description="Manage your product catalog"
        onExportExcel={handleExportExcel}
        onExportPDF={handleExportPDF}
      >
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => router.push("/admin/order-management/brands")}
          >
            <Tags className="h-4 w-4 mr-2" />
            Manage Brands
          </Button>
          <OMNewItemDialog
            brands={brands}
            onItemAdded={() => router.refresh()}
            trigger={<Button><Plus className="h-4 w-4 mr-2" />Add Item</Button>}
          />
        </div>
      </OMPageHeader>

      <OMFilterCard
        filteredCount={processedData.length}
        totalCount={unfilteredTotal}
        unit="items"
        searchPlaceholder="Search by name, SKU, or description..."
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        sortBy={sortBy}
        onSortChange={setSortBy}
        sortOptions={ITEM_SORT_OPTIONS}
        sortNameLabel="Item"
        showFilters={showFilters}
        setShowFilters={setShowFilters}
        onReset={() => {
          setSearchTerm("");
          resetFilters();
          router.push(pathname);
        }}
      >
        <ItemFilters
          filters={filters}
          setFilters={setFilters}
          brandOptions={brandOptions}
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

      <ItemsTable
        data={processedData}
        isLoading={isLoading}
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
        title="Delete Item"
        description="Are you sure you want to delete this item?"
      />

      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Item</DialogTitle>
          </DialogHeader>
          <ItemForm
            formData={formData}
            setFormData={setFormData}
            brandOptions={brandOptions}
            isSubmitting={isSubmitting}
            onSubmit={handleSubmit}
            onCancel={() => setIsAddDialogOpen(false)}
            isEdit={true}
          />
        </DialogContent>
      </Dialog>

      <ItemViewDialog
        item={viewingItem}
        isOpen={isViewDialogOpen}
        onOpenChange={setIsViewDialogOpen}
        onEdit={handleEdit}
      />
    </div>
  );
}
