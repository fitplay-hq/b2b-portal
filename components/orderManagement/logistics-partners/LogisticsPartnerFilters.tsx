"use client";

import {
  SearchableSelect,
  type ComboboxOption,
} from "@/components/ui/combobox";
import { Label } from "@/components/ui/label";

interface LogisticsPartnerFiltersProps {
  filters: {
    partnerName: string;
  };
  setFilters: (filters: any) => void;
  partnerOptions: ComboboxOption[];
}

export function LogisticsPartnerFilters({
  filters,
  setFilters,
  partnerOptions,
}: LogisticsPartnerFiltersProps) {
  const updateFilter = (key: string, value: string) => {
    setFilters((prev: any) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      <div className="space-y-2">
        <Label className="text-[10px) font-bold uppercase tracking-wider text-muted-foreground/80 mb-1.5 block ml-1">
          Partner Name
        </Label>
        <SearchableSelect
          options={partnerOptions}
          value={filters.partnerName}
          onValueChange={(val) => updateFilter("partnerName", val)}
          placeholder="Select partner..."
          className="h-10 text-sm"
        />
      </div>
    </div>
  );
}
