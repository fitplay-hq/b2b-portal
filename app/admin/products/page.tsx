"use client";

import { toast } from "sonner";

import Layout from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Plus, Loader2 } from "lucide-react";
import { useProductFilters } from "@/hooks/use-product-filters";
import { useProductForm } from "@/hooks/use-product-form";
import { deleteProduct } from "@/data/product/admin.actions";

import { StatsGrid } from "./components/stats-grid";
import { ProductFilters } from "./components/product-filters";
import { ProductList } from "./components/product-list";
import { ProductFormDialog } from "./components/product-form-dialog";
import { useProducts } from "@/data/product/admin.hooks";

export default function AdminProductsPage() {
  const { products, error, isLoading, mutate } = useProducts();

  const { filteredProducts, ...filterProps } = useProductFilters(products);
  const formControls = useProductForm({ onSuccess: () => mutate() });

  const handleDelete = (productId: string) => {
    toast("Are you sure you want to delete this product?", {
      action: {
        label: "Delete",
        onClick: async () => {
          try {
            await deleteProduct(productId);
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

  if (isLoading) {
    return (
      <Layout title="Product Management" isClient={false}>
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout title="Product Management" isClient={false}>
        <div className="text-center text-destructive">
          Failed to load products. Please try again later.
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Product Management" isClient={false}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Product Management</h1>
            <p className="text-muted-foreground">
              Manage your product catalog and inventory
            </p>
          </div>
          <Button onClick={formControls.openNewDialog}>
            <Plus className="h-4 w-4 mr-2" />
            Add Product
          </Button>
        </div>

        <StatsGrid products={products || []} />
        <ProductFilters {...filterProps} />
        <ProductList
          products={filteredProducts}
          onEdit={formControls.openEditDialog}
          onDelete={handleDelete}
          hasProductsInitially={(products?.length ?? 0) > 0}
        />
      </div>

      <ProductFormDialog {...formControls} />
    </Layout>
  );
}
