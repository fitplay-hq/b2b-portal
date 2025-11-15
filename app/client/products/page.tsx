"use client";

import Layout from "@/components/layout";
import { Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { useCart } from "@/hooks/use-cart";
import { useProductFilters } from "@/hooks/use-product-filters";
import { useQuantityDialog } from "@/hooks/use-quantity-dialog";

import { PageHeader } from "./components/page-header";
import { ProductGrid } from "./components/product-grid";
import ProductFilters from "./components/product-filters";
import { QuantityDialog } from "./components/quantity-dialog";
import { useProducts } from "@/data/product/client.hooks";

export default function ClientProductsPage() {
  const { data: session, status } = useSession();
  const { products, error, isLoading } = useProducts();

  const userId = session?.user.id || "1";
  const { totalCartItems, addToCart, getCartQuantity } = useCart(userId);
  const { filteredProducts, ...filterProps } = useProductFilters(products);
  const quantityDialog = useQuantityDialog();

  const handleClearFilters = () => {
    filterProps.setSearchTerm("");
    filterProps.setSelectedCategory("All Categories");
  };

  // Handle authentication
  if (status === "loading") {
    return (
      <Layout title="Products" isClient>
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </Layout>
    );
  }

  if (status === "unauthenticated" || !session?.user) {
    return (
      <Layout title="Products" isClient>
        <div className="text-center py-8">
          <p className="text-muted-foreground">
            Please sign in to view products
          </p>
        </div>
      </Layout>
    );
  }

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

        <ProductFilters
          {...filterProps}
          resultsCount={filteredProducts.length}
          totalCount={products?.length ?? 0}
        />

        <ProductGrid
          products={filteredProducts}
          allProducts={products ?? []}
          selectedSort={filterProps.sortBy}
          getCartQuantity={getCartQuantity}
          onAddToCartClick={quantityDialog.openDialog}
          onClearFilters={handleClearFilters}
        />
      </div>

      <QuantityDialog dialog={quantityDialog} onConfirm={addToCart} />
    </Layout>
  );
}
