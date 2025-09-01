"use client";

import useSwr from "swr";
import { toast } from "sonner";

import { Product } from "@/lib/generated/prisma";
import Layout from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Plus, Loader2 } from "lucide-react";
import { useProductFilters } from "@/hooks/use-product-filters";
import { useProductForm } from "@/hooks/use-product-form";
import { getProducts, deleteProduct } from "@/actions/product.actions";

import { StatsGrid } from "./stats-grid";
import { ProductFilters } from "./product-filters";
import { ProductList } from "./product-list";
import { ProductFormDialog } from "./product-form-dialog";

export default function AdminProductsPage() {
  const {
    data: products,
    error,
    isLoading,
    mutate,
  } = useSwr<Product[]>("/api/admin/products", getProducts);

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

      {/* The dialog is now its own component, cleanly managed by its hook */}
      <ProductFormDialog {...formControls} />
    </Layout>
  );
}
