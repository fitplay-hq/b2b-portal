import { Card, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { $Enums } from "@/lib/generated/prisma";
import { Search } from "lucide-react";

// Function to convert enum values to human-friendly names
export const getHumanFriendlyCategoryName = (category: string | null): string => {
  // Handle null or undefined categories
  if (!category) {
    return "Uncategorized";
  }

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

type SortOption =
  | "category"
  | "name-asc"
  | "name-desc"
  | "newest"
  | "oldest"
  | "lowest-stock"
  | "highest-stock"
  | "latest-update";

interface ProductFiltersProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  sortBy: SortOption;
  setSortBy: (sortBy: SortOption) => void;
}

const sortOptions = [
  { value: "category", label: "Category" },
  { value: "name-asc", label: "Name" },
  { value: "highest-stock", label: "Highest Stock" },
  { value: "lowest-stock", label: "Lowest Stock" },
  { value: "newest", label: "Newest" },
  { value: "latest-update", label: "Latest Update" },
  { value: "oldest", label: "Oldest" },
  { value: "name-desc", label: "Name (Z-A)" },
];

export function ProductFilters({
  searchTerm,
  setSearchTerm,
  selectedCategory,
  setSelectedCategory,
  sortBy,
  setSortBy,
}: ProductFiltersProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-5 w-5" />
          <Input
            placeholder="Search products or SKUs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        {/* Sort By */}
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            {sortOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {/* Category Filter */}
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-[150px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All Categories">All Categories</SelectItem>
            {Object.values($Enums.Category).map((category) => (
              <SelectItem key={category} value={category}>
                {getHumanFriendlyCategoryName(category)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
