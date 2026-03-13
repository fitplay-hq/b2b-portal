"use client";

import { Input } from "@/components/ui/input";
import {
  MultiSearchableSelect,
  type ComboboxOption,
} from "@/components/ui/combobox";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ItemFiltersProps {
  filters: {
    brandIds: string[];
    minPrice: string;
    maxPrice: string;
    gst: string;
    minTotalOrdered: string;
    maxTotalOrdered: string;
  };
  setFilters: (filters: any) => void;
  brandOptions: ComboboxOption[];
}

export function ItemFilters({
  filters,
  setFilters,
  brandOptions,
}: ItemFiltersProps) {
  const updateFilter = (key: string, value: any) => {
    setFilters((prev: any) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
      <div className="space-y-2 lg:col-span-1">
        <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80 mb-1.5 block ml-1">
          Brands
        </Label>
        <MultiSearchableSelect
          options={brandOptions}
          value={filters.brandIds}
          onValueChange={(val) => updateFilter("brandIds", val)}
          placeholder="Select brands..."
          className="min-h-10 text-sm"
        />
      </div>

      <div className="space-y-2">
        <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80 mb-1.5 block ml-1">
          Min Price
        </Label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
            ₹
          </span>
          <Input
            type="number"
            placeholder="Min"
            value={filters.minPrice}
            onChange={(e) => updateFilter("minPrice", e.target.value)}
            className="pl-7 h-10 text-sm focus-visible:ring-blue-500"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80 mb-1.5 block ml-1">
          Max Price
        </Label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
            ₹
          </span>
          <Input
            type="number"
            placeholder="Max"
            value={filters.maxPrice}
            onChange={(e) => updateFilter("maxPrice", e.target.value)}
            className="pl-7 h-10 text-sm focus-visible:ring-blue-500"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80 mb-1.5 ml-1 grid-span-1">
          Default GST
        </Label>
        <Select
          value={filters.gst}
          onValueChange={(val) => updateFilter("gst", val)}
        >
          <SelectTrigger className="h-10 text-sm focus:ring-blue-500">
            <SelectValue placeholder="Select GST..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Taxes</SelectItem>
            <SelectItem value="0">0%</SelectItem>
            <SelectItem value="5">5%</SelectItem>
            <SelectItem value="12">12%</SelectItem>
            <SelectItem value="18">18%</SelectItem>
            <SelectItem value="28">28%</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80 mb-1.5 block ml-1">
          Min Total Ordered
        </Label>
        <Input
          type="number"
          placeholder="Min qty"
          value={filters.minTotalOrdered}
          onChange={(e) => updateFilter("minTotalOrdered", e.target.value)}
          className="h-10 text-sm focus-visible:ring-blue-500"
        />
      </div>

      <div className="space-y-2">
        <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80 mb-1.5 block ml-1">
          Max Total Ordered
        </Label>
        <Input
          type="number"
          placeholder="Max qty"
          value={filters.maxTotalOrdered}
          onChange={(e) => updateFilter("maxTotalOrdered", e.target.value)}
          className="h-10 text-sm focus-visible:ring-blue-500"
        />
      </div>
    </div>
  );
}
