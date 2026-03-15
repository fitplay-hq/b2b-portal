"use client";

import { ChevronDown, ChevronUp, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState, useEffect, useRef } from "react";
import { MasterSearchInput } from "./MasterSearchInput";
import { MasterSearchDropdown } from "./MasterSearchDropdown";

interface MasterSearchProps {
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  onSearch: (val: string) => void;
  onClear: () => void;
  isSearching: boolean;
  showAdvancedFilters: boolean;
  setShowAdvancedFilters: (val: boolean) => void;
  matchedItems: any[];
  children?: React.ReactNode;
}

export function MasterSearch({
  searchQuery,
  setSearchQuery,
  onSearch,
  onClear,
  isSearching,
  showAdvancedFilters,
  setShowAdvancedFilters,
  matchedItems,
  children,
}: MasterSearchProps) {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  // Handlers for closing dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      onSearch(searchQuery);
      setShowDropdown(false);
    }
  };

  const handleManualSearch = (query: string) => {
    onSearch(query);
    setShowDropdown(false);
  };

  return (
    <Card className="relative z-20">
      <CardHeader className="pb-3 flex flex-row items-center justify-between space-y-0 text-sm sm:text-base">
        <CardTitle>Master Search</CardTitle>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
          className="h-8 flex gap-2 text-muted-foreground hover:text-foreground"
        >
          <Filter className="h-4 w-4" />
          {showAdvancedFilters ? "Hide Filters" : "Show Filters"}
          {showAdvancedFilters ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </Button>
      </CardHeader>
      <CardContent className="relative">
        <MasterSearchInput
          searchQuery={searchQuery}
          setSearchQuery={(val) => {
            setSearchQuery(val);
            setShowDropdown(true);
          }}
          onSearch={handleManualSearch}
          onClear={onClear}
          onFocus={() => setShowDropdown(true)}
          isSearching={isSearching}
          onKeyDown={handleKeyPress}
        />
        
        {showDropdown && (
          <MasterSearchDropdown
            ref={dropdownRef}
            searchQuery={searchQuery}
            matchedItems={matchedItems}
            onSearch={handleManualSearch}
            onItemClick={() => setShowDropdown(false)}
          />
        )}
        {children}
      </CardContent>
    </Card>
  );
}
