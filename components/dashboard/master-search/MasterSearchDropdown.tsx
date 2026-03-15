"use client";

import { Box, Search } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { forwardRef } from "react";

interface MasterSearchDropdownProps {
  searchQuery: string;
  matchedItems: any[];
  onSearch: (val: string) => void;
  onItemClick: () => void;
}

export const MasterSearchDropdown = forwardRef<HTMLDivElement, MasterSearchDropdownProps>(
  ({ searchQuery, matchedItems, onSearch, onItemClick }, ref) => {
    if (searchQuery.length < 2) return null;

    return (
      <div 
        ref={ref}
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
                  onClick={onItemClick}
                  className="flex flex-col px-3 py-2.5 hover:bg-neutral-50 transition-colors border-b last:border-0 border-neutral-100 group"
                >
                  <div className="flex justify-between items-start gap-2">
                    <span className="text-sm font-medium text-neutral-800 group-hover:text-primary transition-colors">
                      {item.itemName}
                    </span>
                    <Badge variant="outline" className="text-[10px] h-5 bg-blue-50/50">
                      {(item.ordered > 0 ? (item.dispatched / item.ordered) * 100 : 0).toFixed(0)}% Shipped
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
                  onClick={() => onSearch(searchQuery)}
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
    );
  }
);

MasterSearchDropdown.displayName = "MasterSearchDropdown";
