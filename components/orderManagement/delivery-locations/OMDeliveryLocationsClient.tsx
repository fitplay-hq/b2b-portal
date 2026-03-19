"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { toast } from "sonner";
import { DeleteConfirmationDialog } from "@/components/delete-confirmation-dialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { OMDeliveryLocation } from "@/types/order-management";
import { OMFilterCard } from "@/components/orderManagement/shared/OMFilterCard";
import { OMDataTable } from "@/components/orderManagement/shared/OMDataTable";
import { OMInfiniteScroll } from "@/components/orderManagement/shared/OMInfiniteScroll";
import { type PaginatedResponse } from "@/lib/om-data";
import { useOMFilters } from "@/hooks/use-om-filters";
import { LocationFilters } from "./LocationFilters";
import { OMActiveFilters } from "@/components/orderManagement/shared/OMActiveFilters";
import { LOCATION_SORT_OPTIONS } from "@/constants/om-sort-options";
import { type ComboboxOption } from "@/components/ui/combobox";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { OMPageHeader } from "@/components/orderManagement/shared/parts/OMPageHeader";
import { useOMClientData } from "@/hooks/use-om-client-data";
import { exportToExcel, exportToPDF } from "@/lib/om-export-utils";
import { LocationsTable } from "./LocationsTable";
import { LocationForm } from "./LocationForm";
import { LocationViewDialog } from "./LocationViewDialog";

interface OMDeliveryLocationsClientProps {
  initialData: PaginatedResponse<OMDeliveryLocation>;
}

export function OMDeliveryLocationsClient({
  initialData,
}: OMDeliveryLocationsClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const [locations, setLocations] = useState<OMDeliveryLocation[]>(initialData.data);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [locationName, setLocationName] = useState("");

  const [searchTerm, setSearchTerm] = useState(searchParams.get("q") || "");
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
    const isFiltered = searchParams.get("q") || searchParams.get("cityName");
    if (isFiltered) {
      fetch("/api/admin/om/counts")
        .then((res) => res.json())
        .then((data) => setUnfilteredTotal(data.locations))
        .catch((err) => console.error("Failed to fetch location counts", err));
    } else {
      setUnfilteredTotal(initialData.meta.total);
    }
  }, [initialData.meta.total, searchParams]);

  useEffect(() => {
    setLocations(initialData.data);
    setCurrentPage(initialData.meta.page);
    setHasMore(initialData.meta.page < initialData.meta.totalPages);
  }, [initialData]);

  const loadMore = async () => {
    if (isFetchingMore || !hasMore) return;
    setIsFetchingMore(true);
    try {
      const nextPage = currentPage + 1;
      const url = new URL("/api/admin/om/delivery-locations", window.location.origin);
      url.searchParams.set("page", nextPage.toString());
      url.searchParams.set("limit", "50");
      
      searchParams.forEach((value, key) => {
        if (key !== "page" && key !== "limit") {
          url.searchParams.set(key, value);
        }
      });

      const res = await fetch(url.toString());
      if (res.ok) {
        const result: PaginatedResponse<OMDeliveryLocation> = await res.json();
        setLocations((prev) => {
          const existingIds = new Set(prev.map(loc => loc.id));
          const uniqueNewData = result.data.filter(loc => !existingIds.has(loc.id));
          return [...prev, ...uniqueNewData];
        });
        setCurrentPage(result.meta.page);
        setHasMore(result.meta.page < result.meta.totalPages);
      }
    } catch (err) {
      console.error("Error loading more locations:", err);
      toast.error("Failed to load more locations");
    } finally {
      setIsFetchingMore(false);
    }
  };

  const { filters, setFilters, resetFilters, activeFilters, removeFilter } =
    useOMFilters({
      initialFilters: {
        cityName: searchParams.get("cityName") || "",
      },
      labels: {
        cityName: "City",
      },
    });

  const filterFn = useCallback((loc: OMDeliveryLocation, searchTerm: string, filters: Record<string, any>) => {
    const q = searchTerm.toLowerCase().trim();
    const matchesSearch = !q || loc.name.toLowerCase().includes(q);
    const matchesCity = !filters.cityName || loc.name === filters.cityName;
    return matchesSearch && matchesCity;
  }, []);

  const sortFn = useCallback((a: OMDeliveryLocation, b: OMDeliveryLocation, sortBy: string) => {
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
    data: locations,
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

  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const [editingLocation, setEditingLocation] = useState<OMDeliveryLocation | null>(null);
  const [viewingLocation, setViewingLocation] = useState<OMDeliveryLocation | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [editName, setEditName] = useState("");

  const cityOptions = useMemo<ComboboxOption[]>(() => {
    return Array.from(new Set(locations.map((loc) => loc.name))).map(
      (name) => ({
        value: name,
        label: name,
      }),
    );
  }, [locations]);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!locationName.trim()) return;
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/admin/om/delivery-locations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: locationName.trim() }),
      });
      if (res.ok) {
        toast.success("Delivery location added successfully");
        setLocationName("");
        setIsAddDialogOpen(false);
        router.refresh();
      } else {
        const error = await res.json();
        toast.error(error.error || "Failed to add delivery location");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to add delivery location");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (location: OMDeliveryLocation) => {
    setEditingLocation(location);
    setEditName(location.name);
    setIsEditDialogOpen(true);
  };

  const handleView = (location: OMDeliveryLocation) => {
    setViewingLocation(location);
    setIsViewDialogOpen(true);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingLocation || !editName.trim()) return;
    setIsSubmitting(true);
    try {
      const res = await fetch(
        `/api/admin/om/delivery-locations/${editingLocation.id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: editName.trim() }),
        },
      );
      if (res.ok) {
        toast.success("Delivery location updated successfully");
        setIsEditDialogOpen(false);
        router.refresh();
      } else {
        const error = await res.json();
        toast.error(error.error || "Failed to update delivery location");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error updating delivery location");
    } finally {
      setIsSubmitting(false);
    }
  };

  const onConfirmDelete = async () => {
    if (!deleteId) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/admin/om/delivery-locations/${deleteId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        toast.success("Delivery location deleted successfully");
        router.refresh();
        setIsDeleteDialogOpen(false);
      } else {
        const error = await res.json();
        toast.error(error.error || "Failed to delete delivery location");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error deleting delivery location");
    } finally {
      setIsDeleting(false);
      setDeleteId(null);
    }
  };

  const handleExportExcel = useCallback(() => {
    const exportData = processedData.map(loc => ({
      "ID": loc.id,
      "Location Name": loc.name
    }));
    
    if (exportToExcel(exportData, "Delivery_Locations")) {
      toast.success("Locations exported to Excel successfully");
    } else {
      toast.error("Failed to export locations to Excel");
    }
  }, [processedData]);
  const handleExportPDF = useCallback(() => {
    const exportData = processedData.map(loc => ({
      "ID": loc.id,
      "Location Name": loc.name
    }));
    
    if (exportToPDF(exportData, "Delivery_Locations", "Delivery Locations Report")) {
      toast.success("Locations exported to PDF successfully");
    } else {
      toast.error("Failed to export locations to PDF");
    }
  }, [processedData]);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.push("/admin/order-management")}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <OMPageHeader
          title="Delivery Locations"
          description="Manage city-based delivery locations for purchase orders"
          className="flex-1"
          onExportExcel={handleExportExcel}
          onExportPDF={handleExportPDF}
          addButton={{
            label: "Add Location",
            onClick: () => setIsAddDialogOpen(true)
          }}
        />
      </div>

      <OMFilterCard
        filteredCount={processedData.length}
        totalCount={unfilteredTotal}
        unit="delivery locations"
        searchPlaceholder="Search by city name..."
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        sortBy={sortBy as any}
        onSortChange={setSortBy as any}
        sortOptions={LOCATION_SORT_OPTIONS}
        sortNameLabel="City Name"
        showFilters={showFilters}
        setShowFilters={setShowFilters}
        onReset={() => {
          setSearchTerm("");
          resetFilters();
          router.push(pathname);
        }}
      >
        <LocationFilters
          filters={filters}
          setFilters={setFilters}
          cityOptions={cityOptions}
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

      <LocationsTable
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
        title="Delete Location"
        description="Are you sure you want to delete this delivery location?"
      />

      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add Delivery Location</DialogTitle>
          </DialogHeader>
          <LocationForm
            name={locationName}
            setName={setLocationName}
            onSubmit={handleAdd}
            isSubmitting={isSubmitting}
            onCancel={() => setIsAddDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Location</DialogTitle>
          </DialogHeader>
          <LocationForm
            name={editName}
            setName={setEditName}
            onSubmit={handleUpdate}
            isSubmitting={isSubmitting}
            isEdit={true}
            onCancel={() => setIsEditDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
      
      <LocationViewDialog
        location={viewingLocation}
        isOpen={isViewDialogOpen}
        onOpenChange={setIsViewDialogOpen}
        onEdit={handleEdit}
      />
    </div>
  );
}
