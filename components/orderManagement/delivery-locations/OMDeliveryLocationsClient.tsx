"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TableCell, TableHead, TableRow } from "@/components/ui/table";
import { Plus, Loader2, Trash2, ArrowLeft, Edit, MapPin } from "lucide-react";
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
import { OMSortableHeader } from "@/components/orderManagement/shared/OMSortableHeader";
import { OMInfiniteScroll } from "@/components/orderManagement/shared/OMInfiniteScroll";
import { type PaginatedResponse } from "@/lib/om-data";
import type { SortOption } from "@/components/orderManagement/OMSortControl";
import { useOMFilters } from "@/hooks/use-om-filters";
import { LocationFilters } from "./LocationFilters";
import { OMActiveFilters } from "@/components/orderManagement/shared/OMActiveFilters";
import { LOCATION_SORT_OPTIONS } from "@/constants/om-sort-options";
import { type ComboboxOption } from "@/components/ui/combobox";

interface OMDeliveryLocationsClientProps {
  initialData: PaginatedResponse<OMDeliveryLocation>;
}

export function OMDeliveryLocationsClient({
  initialData,
}: OMDeliveryLocationsClientProps) {
  const router = useRouter();
  const [locations, setLocations] = useState<OMDeliveryLocation[]>(initialData.data);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [locationName, setLocationName] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("name_asc");
  const [showFilters, setShowFilters] = useState(false);
  const [totalCount, setTotalCount] = useState(initialData.meta.total);
  const [isHydrating, setIsHydrating] = useState(false);

  const [currentPage, setCurrentPage] = useState(initialData.meta.page);
  const [hasMore, setHasMore] = useState(initialData.meta.page < initialData.meta.totalPages);
  const [isFetchingMore, setIsFetchingMore] = useState(false);

  useEffect(() => {
    setLocations(initialData.data);
    setTotalCount(initialData.meta.total);
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

  const hydrateData = async () => {
    if (isHydrating || !hasMore) return;
    setIsHydrating(true);
    try {
      let nextP = currentPage + 1;
      let more: boolean = hasMore;
      while (more) {
        const url = new URL("/api/admin/om/delivery-locations", window.location.origin);
        url.searchParams.set("page", nextP.toString());
        url.searchParams.set("limit", "50");
        const res = await fetch(url.toString());
        if (!res.ok) break;
        const result: PaginatedResponse<OMDeliveryLocation> = await res.json();
        setLocations((prev) => {
          const existingIds = new Set(prev.map(loc => loc.id));
          const uniqueNewData = result.data.filter(loc => !existingIds.has(loc.id));
          return [...prev, ...uniqueNewData];
        });
        nextP = result.meta.page + 1;
        more = result.meta.page < result.meta.totalPages;
        setCurrentPage(result.meta.page);
        setHasMore(more);
        await new Promise(r => setTimeout(r, 100));
      }
    } catch (err) {
      console.error("Hydration failed:", err);
    } finally {
      setIsHydrating(false);
    }
  };


  const fetchLocations = async () => {
    setIsLoading(true);
    try {
      const url = new URL("/api/admin/om/delivery-locations", window.location.origin);
      url.searchParams.set("page", "1");
      url.searchParams.set("limit", "50");

      const res = await fetch(url.toString());
      if (res.ok) {
        const result: PaginatedResponse<OMDeliveryLocation> = await res.json();
        setLocations(result.data);
        setTotalCount(result.meta.total);
        setCurrentPage(result.meta.page);
        setHasMore(result.meta.page < result.meta.totalPages);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to load locations");
    } finally {
      setIsLoading(false);
    }
  };

  const { filters, setFilters, resetFilters, activeFilters, removeFilter } =
    useOMFilters({
      initialFilters: {
        cityName: "",
      },
      labels: {
        cityName: "City",
      },
    });

  useEffect(() => {
    const isSearchActive =
      searchTerm.length > 0 || Object.values(filters).some((v) => v);
    if (isSearchActive && hasMore && !isHydrating) {
      void hydrateData();
    }
  }, [searchTerm, filters, hasMore, isHydrating, hydrateData]);

  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const [editingLocation, setEditingLocation] =
    useState<OMDeliveryLocation | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editName, setEditName] = useState("");

  const cityOptions = useMemo<ComboboxOption[]>(() => {
    return Array.from(new Set(locations.map((loc) => loc.name))).map(
      (name) => ({
        value: name,
        label: name,
      }),
    );
  }, [locations]);


  useEffect(() => {
    const timer = setTimeout(() => {
      fetchLocations();
    }, 500);
    return () => clearTimeout(timer);
  }, [sortBy]);

  const filteredLocations = useMemo(() => {
    return locations
      .filter((loc) => {
        const matchesSearch =
          !searchTerm ||
          loc.name.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesCity = !filters.cityName || loc.name === filters.cityName;

        return matchesSearch && matchesCity;
      })
      .sort((a, b) => {
        if (sortBy === "name_asc") return a.name.localeCompare(b.name);
        if (sortBy === "name_desc") return b.name.localeCompare(a.name);
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
        return 0;
      });
  }, [locations, searchTerm, sortBy, filters.cityName]);

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
        fetchLocations();
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
        fetchLocations();
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

  const handleDelete = (id: string) => {
    setDeleteId(id);
    setIsDeleteDialogOpen(true);
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
        fetchLocations();
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push("/admin/order-management")}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-semibold">Delivery Locations</h1>
            <p className="text-muted-foreground">
              Manage city-based delivery locations for purchase orders
            </p>
          </div>
        </div>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Location
        </Button>
      </div>

      <OMFilterCard
        title="Filters"
        subtitle={`Showing ${totalCount} of ${totalCount} delivery locations`}
        searchPlaceholder="Search by city name..."
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        sortBy={sortBy}
        onSortChange={setSortBy}
        sortOptions={LOCATION_SORT_OPTIONS}
        sortNameLabel="City Name"
        showFilters={showFilters}
        setShowFilters={setShowFilters}
        onReset={() => {
          setSearchTerm("");
          setSortBy("name_asc");
          resetFilters();
        }}
        isHydrating={isHydrating}
      >
        <LocationFilters
          filters={filters}
          setFilters={setFilters}
          cityOptions={cityOptions}
        />
        <OMActiveFilters
          activeFilters={activeFilters}
          onRemove={removeFilter}
          onClearAll={resetFilters}
        />
      </OMFilterCard>

      <OMDataTable
        data={filteredLocations}
        isLoading={isLoading}
        columnCount={2}
        emptyMessage={
          searchTerm
            ? "No locations matching your search."
            : "No delivery locations found."
        }
        header={
          <TableRow>
            <OMSortableHeader
              title="Location / City Name"
              currentSort={sortBy}
              onSort={setSortBy}
              ascOption="name_asc"
              descOption="name_desc"
            />
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        }
        renderRow={(location: OMDeliveryLocation) => (
          <TableRow key={location.id} className="group">
            <TableCell className="font-medium">
              <div className="flex items-center gap-2">
                <MapPin
                  className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors"
                />
                {location.name}
              </div>
            </TableCell>

            <TableCell className="text-right flex justify-end gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleEdit(location)}
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDelete(location.id)}
                className="text-destructive hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </TableCell>
          </TableRow>
        )}
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
        description="Are you sure you want to delete this delivery location? This may affect orders assigned to this city."
      />

      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-150">
          <DialogHeader>
            <DialogTitle>Add Delivery Location</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAdd} className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="locationName">City Name *</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="locationName"
                  required
                  className="pl-9"
                  value={locationName}
                  onChange={(e) => setLocationName(e.target.value)}
                  placeholder="e.g. Mumbai, Bangalore"
                  maxLength={100}
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsAddDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Plus className="mr-2 h-4 w-4" />
                )}
                Add Location
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Location</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleUpdate} className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="editName">City Name *</Label>
              <Input
                id="editName"
                required
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                placeholder="Enter city name"
                maxLength={100}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsEditDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Save Changes
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
