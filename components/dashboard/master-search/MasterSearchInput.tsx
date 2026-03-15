"use client";

import { Search, X, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface MasterSearchInputProps {
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  onSearch: (val: string) => void;
  onClear: () => void;
  onFocus: () => void;
  isSearching: boolean;
  onKeyDown?: (e: React.KeyboardEvent) => void;
}

export function MasterSearchInput({
  searchQuery,
  setSearchQuery,
  onSearch,
  onClear,
  onFocus,
  isSearching,
  onKeyDown,
}: MasterSearchInputProps) {
  return (
    <div className="flex gap-2 relative">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by client, item, brand, PO/Estimate #, invoice, location, SKU"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={onFocus}
          onKeyDown={onKeyDown}
          className="pl-10 h-10"
        />
      </div>
      
      {searchQuery && (
        <Button 
          variant="outline" 
          size="icon" 
          onClick={onClear}
          className="h-10 w-10 shrink-0"
        >
          <X className="h-4 w-4" />
        </Button>
      )}
      
      <Button 
        onClick={() => onSearch(searchQuery)} 
        disabled={isSearching}
        className="h-10 px-6 shrink-0"
      >
        {isSearching ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          "Search"
        )}
      </Button>
    </div>
  );
}
