"use client";

import { useState } from "react";
import { toast } from "sonner";

import Layout from "@/components/layout";
import PageGuard from "@/components/page-guard";
import { Button } from "@/components/ui/button";
import { Plus, Loader2, Settings } from "lucide-react";
import { useProductFilters } from "@/hooks/use-product-filters";
import { useProductForm } from "@/hooks/use-product-form";
import { usePermissions } from "@/hooks/use-permissions";

import { StatsGrid } from "./components/stats-grid";
import { ProductFilters } from "./components/product-filters";
import { ProductList } from "./components/product-list";
import { ProductFormDialog } from "./components/product-form-dialog";
import { UpdateInventoryDialog } from "./components/update-inventory-dialog";
import { CategoryManagementDialog } from "@/components/category-management-dialog";
import {
  useCreateProducts,
  useDeleteProduct,
  useProducts,
} from "@/data/product/admin.hooks";
import { Prisma } from "@/lib/generated/prisma";
import { BulkActionsDropdown } from "./components/bulk-actions-dropdown";
import type { Product } from "@/lib/generated/prisma";

export default function AdminProductsPage() {
  const { products, error, isLoading, mutate } = useProducts();
  const { deleteProduct } = useDeleteProduct();
  const { createProducts } = useCreateProducts();
  const { actions, RESOURCES } = usePermissions();

  // Inventory dialog state
  const [inventoryDialog, setInventoryDialog] = useState<{
    isOpen: boolean;
    product: Product | null;
  }>({
    isOpen: false,
    product: null,
  });

  // Category management dialog state
  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false);

  const { filteredProducts, ...filterProps } = useProductFilters(products);
  const formControls = useProductForm({ onSuccess: () => mutate() });

  // Bulk upload functionality moved to BulkActionsDropdown component

  const handleDelete = (productId: string) => {
    toast("Are you sure you want to delete this product?", {
      action: {
        label: "Delete",
        onClick: async () => {
          try {
            await deleteProduct({ id: productId });
            toast.success("Product deleted successfully!");
            mutate(); // Re-fetch data
          } catch (error) {
            toast.error("Failed to delete product.");
          }
        },
      },
      cancel: {
        label: "Cancel",
        onClick: async () => {},
      },
    });
  };

  const handleOpenInventoryDialog = (product: Product) => {
    setInventoryDialog({
      isOpen: true,
      product,
    });
  };

  const handleCloseInventoryDialog = () => {
    setInventoryDialog({
      isOpen: false,
      product: null,
    });
  };

  if (isLoading) {
    return (
      <Layout isClient={false}>
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout isClient={false}>
        <div className="text-center text-destructive">
          Failed to load products. Please try again later.
        </div>
      </Layout>
    );
  }

  return (
    <PageGuard resource={RESOURCES.PRODUCTS} action="view">
      <Layout isClient={false}>
        <div className="w-full min-w-0 max-w-full overflow-x-hidden">
          <div className="flex flex-col gap-4 sm:gap-6">
            <div className="shrink-0 space-y-4 sm:space-y-6">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 overflow-hidden">
              <div className="min-w-0 flex-1">
                <h1 className="text-xl sm:text-2xl font-bold">Product Management</h1>
                <p className="text-sm sm:text-base text-muted-foreground">
                  Manage your product catalog and inventory
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-2 w-full lg:w-auto">
                <Button
                  variant="outline"
                  onClick={() => setCategoryDialogOpen(true)}
                  className="flex items-center justify-center gap-2 text-sm h-9"
                  size="sm"
                >
                  <Settings className="h-4 w-4" />
                  <span>Manage Categories</span>
                </Button>
                <div className="flex gap-2 w-full sm:w-auto">
                  {actions.products.create && (
                    <Button onClick={formControls.openNewDialog} className="flex-1 sm:flex-none text-sm h-9" size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Product
                    </Button>
                  )}
                  {actions.products.create && (
                    <div className="flex-shrink-0">
                      <BulkActionsDropdown />
                    </div>
                  )}
                </div>
              </div>
            </div>

          <StatsGrid products={products || []} />
          <ProductFilters {...filterProps} />
        </div>
        <div className="flex-1">
          <ProductList
            products={filteredProducts}
            allProducts={products ?? []}
            selectedSort={filterProps.sortBy}
            onEdit={formControls.openEditDialog}
            onDelete={handleDelete}
            onManageInventory={handleOpenInventoryDialog}
            hasProductsInitially={(products?.length ?? 0) > 0}
          />
        </div>
      </div>
      </div>

      <ProductFormDialog {...formControls} />
        <UpdateInventoryDialog
          product={inventoryDialog.product}
          isOpen={inventoryDialog.isOpen}
          onClose={handleCloseInventoryDialog}
        />
        <CategoryManagementDialog
          isOpen={categoryDialogOpen}
          onClose={() => setCategoryDialogOpen(false)}
        />
      </Layout>
    </PageGuard>
  );
}