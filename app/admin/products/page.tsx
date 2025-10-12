"use client";

import { useState } from "react";
import { toast } from "sonner";

import Layout from "@/components/layout";
import PageGuard from "@/components/page-guard";
import { Button } from "@/components/ui/button";
import { Plus, Loader2, Boxes, Upload } from "lucide-react";
import { useProductFilters } from "@/hooks/use-product-filters";
import { useProductForm } from "@/hooks/use-product-form";
import { usePermissions } from "@/hooks/use-permissions";

import { StatsGrid } from "./components/stats-grid";
import { ProductFilters } from "./components/product-filters";
import { ProductList } from "./components/product-list";
import { ProductFormDialog } from "./components/product-form-dialog";
import { UpdateInventoryDialog } from "./components/update-inventory-dialog";
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
        <div className="flex flex-col h-full gap-6">
          <div className="shrink-0 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold">Product Management</h1>
                <p className="text-muted-foreground">
                  Manage your product catalog and inventory
                </p>
              </div>
              <div className="flex space-x-4">
                {actions.products.create && (
                  <Button onClick={formControls.openNewDialog}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Product
                  </Button>
                )}
                {actions.products.create && <BulkActionsDropdown />}
              </div>
            </div>

          <StatsGrid products={products || []} />
          <ProductFilters {...filterProps} />
        </div>
        <div className="flex-1 overflow-y-auto pr-2">
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

      <ProductFormDialog {...formControls} />
        <UpdateInventoryDialog
          product={inventoryDialog.product}
          isOpen={inventoryDialog.isOpen}
          onClose={handleCloseInventoryDialog}
        />
      </Layout>
    </PageGuard>
  );
}