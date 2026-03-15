"use client";

import { 
  Box, 
  Search, 
  Users, 
  MapPin, 
  FileText, 
  Truck,
  ArrowRight
} from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { forwardRef } from "react";

interface MasterSearchDropdownProps {
  searchQuery: string;
  dropdownMatches: {
    clients: any[];
    locations: any[];
    items: any[];
    pos: any[];
    dispatches: any[];
    logistics: any[];
  };
  onSearch: (val: string) => void;
  onItemClick: () => void;
}

export const MasterSearchDropdown = forwardRef<HTMLDivElement, MasterSearchDropdownProps>(
  ({ searchQuery, dropdownMatches, onSearch, onItemClick }, ref) => {
    if (searchQuery.length < 2) return null;

    const hasResults = Object.values(dropdownMatches).some(arr => arr.length > 0);

    return (
      <div 
        ref={ref}
        className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-xl border border-neutral-200 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200"
      >
        <div className="max-h-[400px] overflow-y-auto">
          {hasResults ? (
            <div className="p-1 pb-0">
              {/* Clients Section */}
              {dropdownMatches.clients.length > 0 && (
                <div className="mb-2">
                  <div className="px-3 py-1.5 text-[10px] font-bold text-muted-foreground uppercase tracking-widest bg-neutral-50 flex items-center gap-2 rounded-t-lg">
                    <Users className="h-3 w-3" />
                    Clients
                  </div>
                  {dropdownMatches.clients.map((client, idx) => (
                    <button
                      key={`client-${idx}`}
                      onClick={() => {
                        onSearch(client.name);
                        onItemClick();
                      }}
                      className="w-full text-left px-3 py-2 hover:bg-neutral-50 transition-colors flex items-center justify-between group border-b border-neutral-100 last:border-0"
                    >
                      <span className="text-sm font-medium text-neutral-800">{client.name}</span>
                      <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity text-primary" />
                    </button>
                  ))}
                </div>
              )}

              {/* Locations Section */}
              {dropdownMatches.locations.length > 0 && (
                <div className="mb-2">
                  <div className="px-3 py-1.5 text-[10px] font-bold text-muted-foreground uppercase tracking-widest bg-neutral-50 flex items-center gap-2 rounded-t-lg">
                    <MapPin className="h-3 w-3" />
                    Locations
                  </div>
                  {dropdownMatches.locations.map((loc, idx) => (
                    <button
                      key={`loc-${idx}`}
                      onClick={() => {
                        onSearch(loc.name);
                        onItemClick();
                      }}
                      className="w-full text-left px-3 py-2 hover:bg-neutral-50 transition-colors flex items-center justify-between group border-b border-neutral-100 last:border-0"
                    >
                      <span className="text-sm font-medium text-neutral-800">{loc.name}</span>
                      <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity text-primary" />
                    </button>
                  ))}
                </div>
              )}

              {/* Items Section */}
              {dropdownMatches.items.length > 0 && (
                <div className="mb-2">
                  <div className="px-3 py-1.5 text-[10px] font-bold text-muted-foreground uppercase tracking-widest bg-neutral-50 flex items-center gap-2 rounded-t-lg">
                    <Box className="h-3 w-3" />
                    Items ({dropdownMatches.items.length})
                  </div>
                  {dropdownMatches.items.map((item, idx) => (
                    <button
                      key={`item-${idx}`}
                      onClick={() => {
                        onSearch(item.itemName);
                        onItemClick();
                      }}
                      className="w-full text-left flex flex-col px-3 py-2.5 hover:bg-neutral-50 transition-colors border-b last:border-0 border-neutral-100 group"
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
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {/* POs & Dispatches Section */}
              {(dropdownMatches.pos.length > 0 || dropdownMatches.dispatches.length > 0) && (
                <div className="mb-2">
                  <div className="px-3 py-1.5 text-[10px] font-bold text-muted-foreground uppercase tracking-widest bg-neutral-50 flex items-center gap-2 rounded-t-lg">
                    <FileText className="h-3 w-3" />
                    Orders / Dispatches
                  </div>
                  {dropdownMatches.pos.map((po, idx) => (
                    <button
                      key={`po-${idx}`}
                      onClick={() => {
                        onSearch(po.number);
                        onItemClick();
                      }}
                      className="w-full text-left flex items-center justify-between px-3 py-2 hover:bg-neutral-50 transition-colors border-b last:border-0 border-neutral-100 group"
                    >
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-neutral-800 group-hover:text-primary">PO: {po.number}</span>
                        <span className="text-[10px] text-muted-foreground">{po.clientName}</span>
                      </div>
                      <Badge variant="secondary" className="text-[9px]">PO</Badge>
                    </button>
                  ))}
                  {dropdownMatches.dispatches.map((d, idx) => (
                    <button
                      key={`d-${idx}`}
                      onClick={() => {
                        onSearch(d.number);
                        onItemClick();
                      }}
                      className="w-full text-left flex items-center justify-between px-3 py-2 hover:bg-neutral-50 transition-colors border-b last:border-0 border-neutral-100 group"
                    >
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-neutral-800 group-hover:text-primary">Inv: {d.number}</span>
                        <span className="text-[10px] text-muted-foreground">{d.clientName}</span>
                      </div>
                      <Badge variant="outline" className="text-[9px]">Disp</Badge>
                    </button>
                  ))}
                </div>
              )}

              {/* Logistics Section */}
              {dropdownMatches.logistics.length > 0 && (
                <div className="mb-2">
                  <div className="px-3 py-1.5 text-[10px] font-bold text-muted-foreground uppercase tracking-widest bg-neutral-50 flex items-center gap-2 rounded-t-lg">
                    <Truck className="h-3 w-3" />
                    Courier Partners
                  </div>
                  {dropdownMatches.logistics.map((l, idx) => (
                    <button
                      key={`log-${idx}`}
                      onClick={() => {
                        onSearch(l.name);
                        onItemClick();
                      }}
                      className="w-full text-left px-3 py-2 hover:bg-neutral-50 transition-colors flex items-center justify-between group border-b border-neutral-100 last:border-0"
                    >
                      <span className="text-sm font-medium text-neutral-800">{l.name}</span>
                      <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity text-primary" />
                    </button>
                  ))}
                </div>
              )}

              <div className="p-2 border-t bg-neutral-50 sticky bottom-0">
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
