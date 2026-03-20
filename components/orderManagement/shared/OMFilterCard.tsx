"use client";

import { Search, Filter, ChevronDown, ChevronUp, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardDescription,
} from "@/components/ui/card";
import { OMSortControl, type SortOption } from "../OMSortControl";
import { cn } from "@/lib/utils";
import { Label } from "recharts";

interface OMFilterCardProps {
  title?: string;
  subtitle?: string; // Optional custom subtitle
  filteredCount?: number;
  totalCount?: number;
  unit?: string;
  searchPlaceholder?: string;
  searchTerm: string;
  onSearchChange: (value: string) => void;
  sortBy: SortOption;
  onSortChange: (value: SortOption) => void;
  sortOptions?: SortOption[];
  sortNameLabel?: string;
  showFilters: boolean;
  setShowFilters: (show: boolean) => void;
  onReset?: () => void;
  children: React.ReactNode;
  className?: string;
  isHydrating?: boolean;
}

export function OMFilterCard({
  title,
  subtitle: customSubtitle,
  filteredCount,
  totalCount,
  unit = "items",
  searchPlaceholder = "Search...",
  searchTerm,
  onSearchChange,
  sortBy,
  onSortChange,
  sortOptions,
  sortNameLabel,
  showFilters,
  setShowFilters,
  onReset,
  children,
  className,
  isHydrating = false,
}: OMFilterCardProps) {
  const subtitle = customSubtitle || (
    filteredCount !== undefined && totalCount !== undefined 
      ? `Showing ${filteredCount} of ${totalCount} ${unit}`
      : undefined
  );
  return (
    <Card className={cn("shadow-sm", className)}>
      <CardHeader className="flex flex-row items-center justify-start space-y-0">
        <div className="">
          {subtitle && (
            <CardDescription className="text-xs">{subtitle}</CardDescription>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-end gap-4 w-full">
          {/* Search Field */}
          <div className="flex-1 space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground ml-1">
              Search
            </Label>
            <div className="relative">
              {isHydrating ? (
                <Loader2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary animate-spin" />
              ) : (
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              )}
              <Input
                placeholder={searchPlaceholder}
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-10 h-9"
              />
            </div>
          </div>

          {/* Sort Control */}
          <div className="w-60 space-y-1.5 shrink-0">
            <Label className="text-xs font-medium text-muted-foreground ml-1">
              Sort By
            </Label>
            <OMSortControl
              value={sortBy}
              onValueChange={onSortChange}
              options={sortOptions}
              nameLabel={sortNameLabel}
              className="h-9"
            />
          </div>

          {/* Filter Toggle Button */}
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-transparent select-none pointer-events-none">
              Filter
            </Label>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className="h-10 flex gap-2 text-muted-foreground hover:text-foreground border border-transparent hover:border-muted-foreground/10 transition-all font-medium"
            >
              <Filter className="h-4 w-4" />
              {showFilters ? "Hide Filters" : "Show Filters"}
              {showFilters ? (
                <ChevronUp className="h-4 w-4 ml-1 opacity-50" />
              ) : (
                <ChevronDown className="h-4 w-4 ml-1 opacity-50" />
              )}
            </Button>
          </div>
        </div>

        {showFilters && (
          <div className="mt-6 pt-6 border-t animate-in fade-in slide-in-from-top-4 duration-300">
            {children}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
