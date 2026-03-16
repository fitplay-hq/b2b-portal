"use client";

import { Search, X, ChevronDown, ChevronUp, Filter, Loader2, Box } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState, useEffect, useRef } from "react";
import { useDebounce } from "@/hooks/use-debounce";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

interface OMMasterSearchProps {
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  onSearch: (val: string) => void;
  isSearching: boolean;
  showAdvancedFilters: boolean;
  setShowAdvancedFilters: (val: boolean) => void;
  matchedItems: any[];
}

export function OMMasterSearch({
  searchQuery,
  setSearchQuery,
  onSearch,
  isSearching,
  showAdvancedFilters,
  setShowAdvancedFilters,
  matchedItems,
}: OMMasterSearchProps) {
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
      <CardContent>
        <div className="flex gap-2 relative">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by client, item, brand, PO/Estimate #, invoice, location, SKU"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowDropdown(true);
              }}
              onFocus={() => setShowDropdown(true)}
              onKeyDown={handleKeyPress}
              className="pl-10 h-10"
            />
            
            {/* Live Search Dropdown */}
            {showDropdown && searchQuery.length >= 2 && (
              <div 
                ref={dropdownRef}
                className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-xl border border-neutral-200 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200"
              >
                <div className="max-h-[300px] overflow-y-auto">
                  {matchedItems.length > 0 ? (
                    <div className="p-1">
                      <div className="px-3 py-2 text-[10px] font-bold text-muted-foreground uppercase tracking-widest bg-neutral-50 flex items-center gap-2">
                        <Box className="h-3 w-3" />
                        Matched Items ({matchedItems.length})
                      </div>
                      {matchedItems.map((item, idx) => (
                        <Link
                          key={idx}
                          href={`/admin/order-management/items?search=${encodeURIComponent(item.itemName)}`}
                          onClick={() => setShowDropdown(false)}
                          className="flex flex-col px-3 py-2.5 hover:bg-neutral-50 transition-colors border-b last:border-0 border-neutral-100 group"
                        >
                          <div className="flex justify-between items-start gap-2">
                            <span className="text-sm font-medium text-neutral-800 group-hover:text-primary transition-colors">
                              {item.itemName}
                            </span>
                            <Badge variant="outline" className="text-[10px] h-5 bg-blue-50/50">
                              {((item.dispatched / item.ordered) * 100).toFixed(0)}% Shipped
                            </Badge>
                          </div>
                          <div className="flex gap-3 mt-1 text-[11px] text-muted-foreground">
                            {item.itemSku && (
                              <span className="font-mono bg-neutral-100 px-1 rounded flex items-center">
                                {item.itemSku}
                              </span>
                            )}
                            {item.brandName && (
                              <span className="flex items-center gap-1 italic">
                                Brand: {item.brandName}
                              </span>
                            )}
                            <span>Ordered: {item.ordered}</span>
                          </div>
                        </Link>
                      ))}
                      <div className="p-2 border-t bg-neutral-50/50">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="w-full text-xs text-primary h-8"
                          onClick={() => {
                            onSearch(searchQuery);
                            setShowDropdown(false);
                          }}
                        >
                          View all results for &quot;{searchQuery}&quot;
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="p-8 text-center">
                      <Search className="h-8 w-8 text-neutral-200 mx-auto mb-2" />
                      <p className="text-sm text-neutral-500">No matching items found</p>
                      <p className="text-xs text-neutral-400 mt-1">Try a different keyword</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
          
          {searchQuery && (
            <Button 
              variant="outline" 
              size="icon" 
              onClick={() => {
                setSearchQuery("");
                onSearch("");
                setShowDropdown(false);
              }}
              className="h-10 w-10 shrink-0"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
          
          <Button 
            onClick={() => {
              onSearch(searchQuery);
              setShowDropdown(false);
            }} 
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
      </CardContent>
    </Card>
  );
}
