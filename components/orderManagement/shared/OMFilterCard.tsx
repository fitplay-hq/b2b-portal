"use client";

import { Search, Filter, ChevronDown, ChevronUp } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { OMSortControl, type SortOption } from "../OMSortControl";
import { cn } from "@/lib/utils";

interface OMFilterCardProps {
  title?: string;
  subtitle?: string;
  searchPlaceholder?: string;
  searchTerm: string;
  onSearchChange: (value: string) => void;
  sortBy: SortOption;
  onSortChange: (value: SortOption) => void;
  sortNameLabel?: string;
  showFilters: boolean;
  setShowFilters: (show: boolean) => void;
  onReset?: () => void;
  children: React.ReactNode;
  className?: string;
}

export function OMFilterCard({
  title = "Filters",
  subtitle,
  searchPlaceholder = "Search...",
  searchTerm,
  onSearchChange,
  sortBy,
  onSortChange,
  sortNameLabel,
  showFilters,
  setShowFilters,
  onReset,
  children,
  className,
}: OMFilterCardProps) {
  return (
    <Card className={cn("shadow-sm", className)}>
      <CardHeader className="pb-3 flex flex-row items-center justify-between space-y-0">
        <div>
          <CardTitle className="text-lg font-bold">{title}</CardTitle>
          {subtitle && (
            <CardDescription className="text-xs mt-1">
              {subtitle}
            </CardDescription>
          )}
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowFilters(!showFilters)}
          className="h-8 flex gap-2 text-muted-foreground hover:text-foreground"
        >
          <Filter className="h-4 w-4" />
          {showFilters ? "Hide Filters" : "Show Filters"}
          {showFilters ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </Button>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row gap-4 items-end">
          <div className="flex-1 w-full space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground ml-1">
              Search
            </Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={searchPlaceholder}
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-10 h-10"
              />
            </div>
          </div>
          <div className="w-full md:w-60">
            <OMSortControl
              value={sortBy}
              onValueChange={onSortChange}
              nameLabel={sortNameLabel}
              className="h-10"
            />
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
