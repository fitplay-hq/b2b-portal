"use client";

import { Search, X, Loader2, ArrowLeft } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface MasterSearchInputProps {
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  onSearch: (val: string) => void;
  onClear: () => void;
  onFocus: () => void;
  isSearching: boolean;
  isFetching?: boolean;
  onKeyDown?: (e: React.KeyboardEvent) => void;
}

export function MasterSearchInput({
  searchQuery,
  setSearchQuery,
  onSearch,
  onClear,
  onFocus,
  isSearching,
  isFetching,
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

      {searchQuery && !isSearching && (
        <Button
          variant="outline"
          size="icon"
          onClick={onClear}
          className="h-10 w-10 shrink-0 border-neutral-300"
        >
          <X className="h-4 w-4" />
        </Button>
      )}

      {isSearching ? (
        <Button
          variant="outline"
          onClick={onClear}
          disabled={isFetching}
          className="h-10 px-4 shrink-0 flex gap-2 items-center bg-[#1a1a1a] text-white border border-neutral-700 hover:bg-[#2a2a2a] transition-all duration-200"
        >
          {isFetching ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <>
              <ArrowLeft className="h-4 w-4" />
              <span>Back</span>
            </>
          )}
        </Button>
      ) : (
        <Button
          onClick={() => searchQuery.trim() && onSearch(searchQuery)}
          disabled={!searchQuery.trim() || isFetching}
          className="h-10 px-6 shrink-0 bg-[#1a1a1a] text-white border border-neutral-700 hover:bg-[#2a2a2a] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isFetching ? <Loader2 className="h-4 w-4 animate-spin" /> : "Search"}
        </Button>
      )}
    </div>
  );
}
