"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Layout from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Loader2, Trash2, ArrowLeft, Edit, MapPin } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { DeleteConfirmationDialog } from "@/components/delete-confirmation-dialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { OMDeliveryLocation } from "@/types/order-management";
import { useMemo } from "react";
import { OMFilterCard } from "@/components/orderManagement/shared/OMFilterCard";
import { OMDataTable } from "@/components/orderManagement/shared/OMDataTable";
import { OMSortableHeader } from "@/components/orderManagement/shared/OMSortableHeader";
import { useDeliveryLocations } from "@/hooks/use-delivery-locations";
import type { SortOption } from "@/components/orderManagement/OMSortControl";

export default function OMDeliveryLocations() {
  const router = useRouter();
  const { locations, isLoading, mutate } = useDeliveryLocations();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [locationName, setLocationName] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("name_asc");
  const [showFilters, setShowFilters] = useState(false);

  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const [editingLocation, setEditingLocation] =
    useState<OMDeliveryLocation | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editName, setEditName] = useState("");

  useEffect(() => {
    // Other initializations if needed
  }, []);

  const filteredLocations = useMemo(() => {
    return locations
      .filter((loc) => {
        const matchesSearch =
          !searchTerm ||
          loc.name.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesSearch;
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
  }, [locations, searchTerm, sortBy]);

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
        mutate();
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
        mutate();
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
        mutate();

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
    <Layout isClient={false}>
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
          subtitle={`Showing ${filteredLocations.length} of ${locations.length} delivery locations`}
          searchPlaceholder="Search by city name..."
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          sortBy={sortBy}
          onSortChange={setSortBy}
          sortNameLabel="City Name"
          showFilters={showFilters}
          setShowFilters={setShowFilters}
          onReset={() => {
            setSearchTerm("");
            setSortBy("newest");
          }}
        >
          <div className="text-sm text-muted-foreground">
            More filters can be added here if needed.
          </div>
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
    </Layout>
  );
}
