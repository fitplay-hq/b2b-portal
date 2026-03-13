"use client";

import { Calendar } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  SearchableSelect,
  type ComboboxOption,
} from "@/components/ui/combobox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface POFiltersProps {
  filters: {
    fromDate: string;
    toDate: string;
    clientName: string;
    poNumber: string;
    status: string;
    locationId: string;
  };
  setFilters: (filters: any) => void;
  clientOptions: ComboboxOption[];
  poOptions: ComboboxOption[];
  locationOptions: ComboboxOption[];
}

export function POFilters({
  filters,
  setFilters,
  clientOptions,
  poOptions,
  locationOptions,
}: POFiltersProps) {
  const updateFilter = (key: string, value: string) => {
    setFilters((prev: any) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
      <div className="space-y-2">
        <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80 mb-1.5 block ml-1">
          From Date
        </Label>
        <div className="relative">
          <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />
          <Input
            type="date"
            value={filters.fromDate}
            max={filters.toDate || new Date().toISOString().split("T")[0]}
            onChange={(e) => updateFilter("fromDate", e.target.value)}
            className="pl-10 h-10 text-sm focus-visible:ring-blue-500"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80 mb-1.5 block ml-1">
          To Date
        </Label>
        <div className="relative">
          <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />
          <Input
            type="date"
            value={filters.toDate}
            min={filters.fromDate}
            max={new Date().toISOString().split("T")[0]}
            onChange={(e) => updateFilter("toDate", e.target.value)}
            className="pl-10 h-10 text-sm focus-visible:ring-blue-500"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80 mb-1.5 block ml-1">
          Client Name
        </Label>
        <SearchableSelect
          options={clientOptions}
          value={filters.clientName}
          onValueChange={(val) => updateFilter("clientName", val)}
          placeholder="Select client..."
          className="h-10 text-sm"
        />
      </div>

      <div className="space-y-2">
        <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80 mb-1.5 block ml-1">
          PO Number
        </Label>
        <SearchableSelect
          options={poOptions}
          value={filters.poNumber}
          onValueChange={(val) => updateFilter("poNumber", val)}
          placeholder="Select PO #..."
          className="h-10 text-sm"
        />
      </div>

      <div className="space-y-2">
        <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80 mb-1.5 block ml-1">
          Delivery Location
        </Label>
        <SearchableSelect
          options={locationOptions}
          value={filters.locationId}
          onValueChange={(val) => updateFilter("locationId", val)}
          placeholder="Select location..."
          className="h-10 text-sm"
        />
      </div>

      <div className="space-y-2">
        <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80 mb-1.5 block ml-1">
          Status
        </Label>
        <Select
          value={filters.status}
          onValueChange={(val) => updateFilter("status", val)}
        >
          <SelectTrigger className="h-10 text-sm focus:ring-blue-500">
            <SelectValue placeholder="Select status..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="DRAFT">Draft</SelectItem>
            <SelectItem value="CONFIRMED">Confirmed</SelectItem>
            <SelectItem value="PARTIALLY_DISPATCHED">
              Partially Dispatched
            </SelectItem>
            <SelectItem value="FULLY_DISPATCHED">Fully Dispatched</SelectItem>
            <SelectItem value="CLOSED">Closed</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
