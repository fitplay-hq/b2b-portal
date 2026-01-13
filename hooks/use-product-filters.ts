import { useState, useMemo } from "react";
import { Product } from "@/lib/generated/prisma";

export type SortOption = "name-asc" | "name-desc" | "newest" | "oldest" | "lowest-stock" | "highest-stock" | "latest-update" | "subcategory";

export function useProductFilters(products: Product[] = []) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [selectedSubCategory, setSelectedSubCategory] = useState("All SubCategories");
  const [stockStatus, setStockStatus] = useState("all");
  const [sortBy, setSortBy] = useState<SortOption>('name-asc');

  const filteredProducts = useMemo(() => {
    let filtered = products;

    // Filter by search term
    if (searchTerm) {
      const lowercasedTerm = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (product) => {
          // Search in product name, SKU, brand
          const basicMatch = 
            product.name.toLowerCase().includes(lowercasedTerm) ||
            product.sku.toLowerCase().includes(lowercasedTerm) ||
            product.brand?.toLowerCase().includes(lowercasedTerm);
          
          // Search in company names
          const companyMatch = (product as any).companies?.some((company: any) =>
            company.name?.toLowerCase().includes(lowercasedTerm)
          );
          
          return basicMatch || companyMatch;
        }
      );
    }

    // Filter by category
    if (selectedCategory !== "All Categories") {
      filtered = filtered.filter(
        (product) => {
          // Check both the new relation (product.category?.name) and old enum field (product.categories)
          const categoryName = (product as any).category?.name || product.categories;
          return categoryName === selectedCategory;
        }
      );
    }

    // Filter by subcategory
    if (selectedSubCategory !== "All SubCategories") {
      filtered = filtered.filter(
        (product) => {
          const subCategoryName = (product as any).subCategory?.name;
          return subCategoryName === selectedSubCategory;
        }
      );
    }

    // Filter by stock status
    if (stockStatus !== "all") {
      filtered = filtered.filter((product) => {
        const stock = product.availableStock;
        const minThreshold = product.minStockThreshold || 0;
        
        if (stockStatus === "in-stock") {
          return stock > minThreshold;
        } else if (stockStatus === "low-stock") {
          return stock > 0 && stock <= minThreshold;
        } else if (stockStatus === "out-of-stock") {
          return stock === 0;
        }
        return true;
      });
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
      case "subcategory":
        sortedProducts = sortedProducts.sort((a, b) => {
          // Sort by subcategory name
          const subCategoryA = (a as any).subCategory?.name || "";
          const subCategoryB = (b as any).subCategory?.name || "";
          if (subCategoryA === subCategoryB) {
            return a.name.toLowerCase().localeCompare(b.name.toLowerCase());
          }
          return subCategoryA.localeCompare(subCategoryB);
        });
        break;
    }

    return sortedProducts;
  }, [products, searchTerm, selectedCategory, selectedSubCategory, stockStatus, sortBy]);

  return {
    searchTerm,
    setSearchTerm,
    selectedCategory,
    setSelectedCategory,
    selectedSubCategory,
    setSelectedSubCategory,
    stockStatus,
    setStockStatus,
    sortBy,
    setSortBy,
    filteredProducts,
  };
}