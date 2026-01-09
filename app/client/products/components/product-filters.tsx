import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SortOption } from "@/hooks/use-product-filters";
import { Search, Filter, ArrowUpDown } from "lucide-react";
import useSWR from 'swr';

interface ProductCategory {
  id: string;
  name: string;
  displayName: string;
  description: string | null;
  shortCode: string;
  isActive: boolean;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
  _count: {
    products: number;
    subCategories: number;
  };
}

interface SubCategory {
  id: string;
  name: string;
  categoryId: string;
  shortCode: string;
  createdAt: Date;
  updatedAt: Date;
  category: {
    id: string;
    name: string;
    displayName: string;
  };
}

interface ProductFiltersProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  selectedSubCategory: string;
  setSelectedSubCategory: (subCategory: string) => void;
  stockStatus: string;
  setStockStatus: (status: string) => void;
  sortBy: SortOption | undefined;
  setSortBy: (sortBy: SortOption) => void;
  resultsCount: number;
  totalCount: number;
}

// Fetcher for categories
const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error('Failed to fetch categories');
  }
  const data = await res.json();
  return data.success ? data.data : [];
};

// Function to convert enum values to human-friendly names - fallback for legacy enum values
const getHumanFriendlyCategoryName = (category: string): string => {
  // Use the actual enum values from Prisma with friendly names
  const friendlyNames: Record<string, string> = {
    stationery: "Stationery",
    accessories: "Accessories",
    funAndStickers: "Fun & Stickers",
    drinkware: "Drinkware",
    apparel: "Apparel",
    travelAndTech: "Travel & Tech",
    books: "Books",
    welcomeKit: "Welcome Kit",
    newcategory: "New Category",
    consumables: "Consumables",
  };

  // Check if we have a specific friendly name for this category
  if (friendlyNames[category]) {
    return friendlyNames[category];
  }

  // Fallback: Handle unknown categories
  // Convert camelCase to Title Case by splitting on capital letters
  return category
    .replace(/([a-z])([A-Z])/g, "$1 $2") // Add space between lowercase and uppercase
    .replace(/([A-Z])([A-Z][a-z])/g, "$1 $2") // Handle consecutive uppercase letters
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

export function ProductFilters({
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
  resultsCount,
  totalCount,
}: ProductFiltersProps) {
  // Fetch categories from database
  const { data: categories } = useSWR<ProductCategory[]>('/api/admin/categories', fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 30000,
  });

  // Fetch subcategories from database
  const { data: subCategoriesData } = useSWR<{ success: boolean; data: SubCategory[] }>('/api/admin/subcategories', async (url) => {
    const res = await fetch(url);
    if (!res.ok) throw new Error('Failed to fetch subcategories');
    return res.json();
  }, {
    revalidateOnFocus: false,
    dedupingInterval: 30000,
  });

  const subCategories = subCategoriesData?.data || [];
  
  // Filter subcategories based on selected category
  const filteredSubCategories = selectedCategory === "All Categories" 
    ? subCategories 
    : subCategories.filter(sub => sub.category.name === selectedCategory);

  return (
    <div className="space-y-4">
      {/* Search Bar - Full Width */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder="Search products, SKUs, or brands..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Filters and Sort in One Row */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Filter Label */}
        <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
          <Filter className="h-4 w-4" />
          <span>Filters:</span>
        </div>

        {/* Category Filter */}
        <Select value={selectedCategory} onValueChange={(value) => {
          setSelectedCategory(value);
          setSelectedSubCategory("All SubCategories");
        }}>
          <SelectTrigger className="w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All Categories">All Categories</SelectItem>
            {categories?.filter(cat => cat.isActive).map((category) => (
              <SelectItem key={category.id} value={category.name}>
                {category.displayName}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* SubCategory Filter */}
        <Select value={selectedSubCategory} onValueChange={setSelectedSubCategory}>
          <SelectTrigger className="w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All SubCategories">All SubCategories</SelectItem>
            {filteredSubCategories.map((subCategory) => (
              <SelectItem key={subCategory.id} value={subCategory.name}>
                {subCategory.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Stock Status Filter */}
        <Select value={stockStatus} onValueChange={setStockStatus}>
          <SelectTrigger className="w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Stock Levels</SelectItem>
            <SelectItem value="in-stock">In Stock</SelectItem>
            <SelectItem value="low-stock">Low Stock</SelectItem>
            <SelectItem value="out-of-stock">Out of Stock</SelectItem>
          </SelectContent>
        </Select>

        {/* Divider */}
        <div className="h-8 w-px bg-border" />

        {/* Sort Label */}
        <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
          <ArrowUpDown className="h-4 w-4" />
          <span>Sort by:</span>
        </div>

        {/* Sort By */}
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select sorting" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="category">Category</SelectItem>
            <SelectItem value="name-asc">Name (A-Z)</SelectItem>
            <SelectItem value="name-desc">Name (Z-A)</SelectItem>
            <SelectItem value="highest-stock">Highest Stock</SelectItem>
            <SelectItem value="lowest-stock">Lowest Stock</SelectItem>
            <SelectItem value="newest">Newest First</SelectItem>
            <SelectItem value="oldest">Oldest First</SelectItem>
            <SelectItem value="latest-update">Latest Update</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
