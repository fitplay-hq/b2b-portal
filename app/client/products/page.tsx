"use client";

import Layout from "@/components/layout";
import { Loader2 } from "lucide-react";
import { useCart } from "@/hooks/use-cart";
import { useProductFilters } from "@/hooks/use-product-filters";
import { useQuantityDialog } from "@/hooks/use-quantity-dialog";

import { PageHeader } from "./components/page-header";
import { ProductGrid } from "./components/product-grid";
import { QuantityDialog } from "./components/quantity-dialog";
import { useProducts } from "@/data/product/client.hooks";

// In a real app, this would come from an auth context
const mockUser = { id: "1" };

export default function ClientProductsPage() {
  const { products, error, isLoading } = useProducts();

  const { totalCartItems, addToCart, getCartQuantity } = useCart(mockUser.id);
  const { filteredProducts, ...filterProps } = useProductFilters(products);
  const quantityDialog = useQuantityDialog();

  const handleClearFilters = () => {
    filterProps.setSearchTerm("");
    filterProps.setSelectedCategory("All Categories");
  };

  if (isLoading) {
    return (
      <Layout title="Products" isClient>
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout title="Products" isClient>
        <div className="text-center text-destructive">
          Failed to load products.
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Products" isClient>
      <div className="space-y-6">
        <PageHeader totalCartItems={totalCartItems} />

        {/* Assuming ProductFilterBar is similar to the admin one */}
        {/* <ProductFilterBar {...filterProps} /> */}

        <div className="text-sm text-muted-foreground">
          Showing {filteredProducts.length} of {products?.length ?? 0} products
        </div>

        <ProductGrid
          products={filteredProducts}
          getCartQuantity={getCartQuantity}
          onAddToCartClick={quantityDialog.openDialog}
          onClearFilters={handleClearFilters}
        />
      </div>

      <QuantityDialog dialog={quantityDialog} onConfirm={addToCart} />
    </Layout>
  );
}
