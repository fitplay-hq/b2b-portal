"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { OMDataTable } from "@/components/orderManagement/shared/OMDataTable";
import { OMFilterCard } from "@/components/orderManagement/shared/OMFilterCard";
import { OMInfiniteScroll } from "@/components/orderManagement/shared/OMInfiniteScroll";
import { type PaginatedResponse } from "@/lib/om-data";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TableCell, TableHead, TableRow } from "@/components/ui/table";
import { Plus, Loader2, Trash2, ArrowLeft, Edit } from "lucide-react";

import { toast } from "sonner";
import { DeleteConfirmationDialog } from "@/components/delete-confirmation-dialog";
import { type SortOption } from "@/components/orderManagement/OMSortControl";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { OMBrand } from "@/types/order-management";

interface OMBrandsClientProps {
  initialData: PaginatedResponse<OMBrand>;
}

export function OMBrandsClient({ initialData }: OMBrandsClientProps) {
  const router = useRouter();
  const [brands, setBrands] = useState<OMBrand[]>(initialData.data);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [brandName, setBrandName] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>("name_asc");
  const [showFilters, setShowFilters] = useState(false);
  const [isHydrating, setIsHydrating] = useState(false);

  const [editingBrand, setEditingBrand] = useState<OMBrand | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editName, setEditName] = useState("");
  const [totalCount, setTotalCount] = useState(initialData.meta.total);

  useEffect(() => {
    const fetchTotalCount = async () => {
      try {
        const res = await fetch("/api/admin/om/counts");
        if (res.ok) {
          const data = await res.json();
          setTotalCount(data.brands);
        }
      } catch (err) {
        console.error("Failed to fetch total count:", err);
      }
    };
    fetchTotalCount();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchBrands();
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const [currentPage, setCurrentPage] = useState(initialData.meta.page);
  const [hasMore, setHasMore] = useState(initialData.meta.page < initialData.meta.totalPages);
  const [isFetchingMore, setIsFetchingMore] = useState(false);

  useEffect(() => {
    setBrands(initialData.data);
    setTotalCount(initialData.meta.total);
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

  const hydrateData = async () => {
    if (isHydrating || !hasMore) return;
    setIsHydrating(true);
    try {
      let nextP = currentPage + 1;
      let more: boolean = hasMore;
      while (more) {
        const url = new URL("/api/admin/om/brands", window.location.origin);
        url.searchParams.set("page", nextP.toString());
        url.searchParams.set("limit", "50");
        const res = await fetch(url.toString());
        if (!res.ok) break;
        const result: PaginatedResponse<OMBrand> = await res.json();
        setBrands((prev) => {
          const existingIds = new Set(prev.map(b => b.id));
          const uniqueNewData = result.data.filter(b => !existingIds.has(b.id));
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

  useEffect(() => {
    const isSearchActive = searchTerm.length > 0;
    if (isSearchActive && hasMore && !isHydrating) {
      void hydrateData();
    }
  }, [searchTerm, hasMore, isHydrating, hydrateData]);

  const fetchBrands = async () => {
    setIsLoading(true);
    try {
      const url = new URL("/api/admin/om/brands", window.location.origin);
      url.searchParams.set("page", "1");
      url.searchParams.set("limit", "50");

      const res = await fetch(url.toString());
      if (res.ok) {
        const result: PaginatedResponse<OMBrand> = await res.json();
        setBrands(result.data);
        setTotalCount(result.meta.total);
        setCurrentPage(result.meta.page);
        setHasMore(result.meta.page < result.meta.totalPages);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to load brands");
    } finally {
      setIsLoading(false);
    }
  };

  const filteredBrands = useMemo(() => {
    return brands
      .filter((b) => b.name.toLowerCase().includes(searchTerm.toLowerCase()))
      .sort((a, b) => {
        if (sortBy === "name_asc") return a.name.localeCompare(b.name);
        if (sortBy === "name_desc") return b.name.localeCompare(a.name);
        return 0;
      });
  }, [brands, searchTerm, sortBy]);

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
        fetchBrands();
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
        fetchBrands();
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

  const handleDelete = (id: string) => {
    setDeleteId(id);
    setIsDeleteDialogOpen(true);
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
        fetchBrands();
        setIsDeleteDialogOpen(false);
        router.refresh();
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push("/admin/order-management/items")}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-semibold">Manage Brands</h1>
            <p className="text-muted-foreground">
              Add or remove brands for your product catalog
            </p>
          </div>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Add Brand</CardTitle>
          <CardDescription>
            Create a new brand to assign to items
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAdd} className="flex items-end gap-4">
            <div className="flex-1 space-y-2">
              <Label htmlFor="brandName">Brand Name *</Label>
              <Input
                id="brandName"
                required
                value={brandName}
                onChange={(e) => setBrandName(e.target.value)}
                placeholder="Enter brand name"
                maxLength={100}
              />
            </div>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Plus className="mr-2 h-4 w-4" />
              )}
              Add Brand
            </Button>
          </form>
        </CardContent>
      </Card>
      <OMFilterCard
        subtitle={`Showing ${totalCount} of ${totalCount} brands`}
        searchPlaceholder="Search by brand name..."
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        sortBy={sortBy}
        onSortChange={setSortBy}
        showFilters={showFilters}
        setShowFilters={setShowFilters}
        isHydrating={isHydrating}
      >
        {null}
      </OMFilterCard>

      <OMDataTable
        title="Brand List"
        data={filteredBrands}
        isLoading={isLoading}
        columnCount={2}
        emptyMessage="No brands found. Add one above."
        header={
          <TableRow>
            <TableHead>Brand Name</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        }
        renderRow={(brand: OMBrand) => (
          <TableRow key={brand.id}>
            <TableCell className="font-medium">{brand.name}</TableCell>
            <TableCell className="text-right flex justify-end gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleEdit(brand)}
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDelete(brand.id)}
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
        title="Delete Brand"
        description="Are you sure you want to delete this brand? Products using this brand must be reassigned first."
      />

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Brand</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleUpdate} className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="editName">Brand Name *</Label>
              <Input
                id="editName"
                required
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                placeholder="Enter brand name"
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
