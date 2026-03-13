"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Layout from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { OMDataTable } from "@/components/orderManagement/shared/OMDataTable";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { OMBrand } from "@/types/order-management";

export default function OMBrands() {
  const router = useRouter();
  const [brands, setBrands] = useState<OMBrand[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [brandName, setBrandName] = useState("");

  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const [editingBrand, setEditingBrand] = useState<OMBrand | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editName, setEditName] = useState("");

  const fetchBrands = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/om/brands");
      if (res.ok) {
        setBrands(await res.json());
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to load brands");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBrands();
  }, []);

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
    <Layout isClient={false}>
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

        <OMDataTable
          title="Brand List"
          subtitle={`${brands.length} brand${
            brands.length !== 1 ? "s" : ""
          } registered`}
          data={brands}
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
    </Layout>
  );
}
