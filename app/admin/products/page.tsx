"use client";

import { useState } from "react";
import { toast } from "sonner";

import Layout from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Plus, Loader2 } from "lucide-react";
import { useProductFilters } from "@/hooks/use-product-filters";
import { useProductForm } from "@/hooks/use-product-form";

import { StatsGrid } from "./components/stats-grid";
import { ProductFilters } from "./components/product-filters";
import { ProductList } from "./components/product-list";
import { ProductFormDialog } from "./components/product-form-dialog";
import { UpdateInventoryDialog } from "./components/update-inventory-dialog";
import {
  useDeleteProduct,
  useProducts,
} from "@/data/product/admin.hooks";

import { BulkActionsDropdown } from "./components/bulk-actions-dropdown";
import type { Product } from "@/lib/generated/prisma";

export default function AdminProductsPage() {
  const { products, error, isLoading, mutate } = useProducts();
  const { deleteProduct } = useDeleteProduct();


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
          } catch {
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
    <Layout isClient={false}>
      <div className="min-h-[calc(100vh-4rem)] bg-gray-50 -m-6">
        <div className="p-8">
          <div className="space-y-8">
            {/* Enhanced Header */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-semibold text-gray-900 mb-2">Products</h1>
                  <p className="text-gray-600 text-base">
                    Manage your product catalog and inventory with ease
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <BulkActionsDropdown />
                  <Button 
                    onClick={formControls.openNewDialog}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl font-medium shadow-sm hover:shadow-md transition-all duration-200"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Product
                  </Button>
                </div>
              </div>
            </div>

            <StatsGrid products={products || []} />

            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="p-8 border-b border-gray-200 bg-gray-50">
                <ProductFilters {...filterProps} />
              </div>
              <div className="p-8">
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
        </div>
      </div>

      <ProductFormDialog {...formControls} />
      <UpdateInventoryDialog
        product={inventoryDialog.product}
        isOpen={inventoryDialog.isOpen}
        onClose={handleCloseInventoryDialog}
      />
    </Layout>
  );
}
