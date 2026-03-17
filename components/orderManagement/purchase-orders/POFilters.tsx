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

const PO_STATUS_LABELS: Record<string, string> = {
  DRAFT: "Draft",
  CONFIRMED: "Confirmed",
  PARTIALLY_DISPATCHED: "Partially Dispatched",
  FULLY_DISPATCHED: "Fully Dispatched",
  CLOSED: "Closed",
};

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
            className="pl-10 h-10 text-sm focus-visible:ring-neutral-900"
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
            className="pl-10 h-10 text-sm focus-visible:ring-neutral-900"
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
          Location
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
          <SelectTrigger className="h-10 text-sm focus:ring-neutral-900">
            <SelectValue placeholder="Select status..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            {Object.entries(PO_STATUS_LABELS).map(([key, label]) => (
              <SelectItem key={key} value={key}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
