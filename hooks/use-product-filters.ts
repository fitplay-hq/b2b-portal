import { useState, useMemo } from "react";
import { Product } from "@/lib/generated/prisma";

export function useProductFilters(products: Product[] = []) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");

  const filteredProducts = useMemo(() => {
    let filtered = products;

    if (searchTerm) {
      const lowercasedTerm = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(lowercasedTerm) ||
          product.sku.toLowerCase().includes(lowercasedTerm)
      );
    }

    if (selectedCategory !== "All Categories") {
      filtered = filtered.filter(
        (product) => product.categories === selectedCategory
      );
    }

    return filtered;
  }, [products, searchTerm, selectedCategory]);

  return {
    searchTerm,
    setSearchTerm,
    selectedCategory,
    setSelectedCategory,
    filteredProducts,
  };
}