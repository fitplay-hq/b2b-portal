"use client";

import {
  SearchableSelect,
  type ComboboxOption,
} from "@/components/ui/combobox";
import { Label } from "@/components/ui/label";

interface ClientFiltersProps {
  filters: {
    clientName: string;
  };
  setFilters: (filters: any) => void;
  clientOptions: ComboboxOption[];
}

export function ClientFilters({
  filters,
  setFilters,
  clientOptions,
}: ClientFiltersProps) {
  const updateFilter = (key: string, value: string) => {
    setFilters((prev: any) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
    </div>
  );
}
