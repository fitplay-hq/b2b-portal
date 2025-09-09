import { useState, useMemo } from "react";
import { Product } from "@/lib/generated/prisma";

export type SortOption = "name-asc" | "name-desc" | "newest" | "oldest" | "lowest-stock" | "highest-stock" | "latest-update" | "category";

export function useProductFilters(products: Product[] = []) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [sortBy, setSortBy] = useState<SortOption>();

  const filteredProducts = useMemo(() => {
    let filtered = products;

    // Filter by search term
    if (searchTerm) {
      const lowercasedTerm = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(lowercasedTerm) ||
          product.sku.toLowerCase().includes(lowercasedTerm)
      );
    }

    // Filter by category
    if (selectedCategory !== "All Categories") {
      filtered = filtered.filter(
        (product) => product.categories === selectedCategory
      );
    }

    // Apply sorting
    let sortedProducts = [...filtered];

    switch (sortBy) {
      case "name-asc":
        sortedProducts = sortedProducts.sort((a, b) =>
          a.name.toLowerCase().localeCompare(b.name.toLowerCase())
        );
        break;
      case "name-desc":
        sortedProducts = sortedProducts.sort((a, b) =>
          b.name.toLowerCase().localeCompare(a.name.toLowerCase())
        );
        break;
      case "newest":
        sortedProducts = sortedProducts.sort((a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        break;
      case "oldest":
        sortedProducts = sortedProducts.sort((a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
        break;
      case "lowest-stock":
        sortedProducts = sortedProducts.sort((a, b) => a.availableStock - b.availableStock);
        break;
      case "highest-stock":
        sortedProducts = sortedProducts.sort((a, b) => b.availableStock - a.availableStock);
        break;
      case "latest-update":
        sortedProducts = sortedProducts.sort((a, b) =>
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        );
        break;
    }

    return sortedProducts;
  }, [products, searchTerm, selectedCategory, sortBy]);

  return {
    searchTerm,
    setSearchTerm,
    selectedCategory,
    setSelectedCategory,
    sortBy,
    setSortBy,
    filteredProducts,
  };
}