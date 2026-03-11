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
import {
  OM_DISPATCH_STATUS_CONFIG,
  type OMDispatchStatus,
} from "@/types/order-management";
import type { SortOption } from "../OMSortControl";

interface DispatchFiltersProps {
  filters: {
    fromDate: string;
    toDate: string;
    clientName: string;
    logisticsPartnerId: string;
    status: string;
    invoiceNumber: string;
    docketNumber: string;
  };
  setFilters: (filters: any) => void;
  sortBy: SortOption;
  onSortChange: (value: SortOption) => void;
  clientOptions: ComboboxOption[];
  logisticsOptions: ComboboxOption[];
  invoiceOptions: ComboboxOption[];
  docketOptions: ComboboxOption[];
}

export function DispatchFilters({
  filters,
  setFilters,
  sortBy,
  onSortChange,
  clientOptions,
  logisticsOptions,
  invoiceOptions,
  docketOptions,
}: DispatchFiltersProps) {
  const updateFilter = (key: string, value: string) => {
    setFilters((prev: any) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
          Logistics Partner
        </Label>
        <SearchableSelect
          options={logisticsOptions}
          value={filters.logisticsPartnerId}
          onValueChange={(val) => updateFilter("logisticsPartnerId", val)}
          placeholder="Select partner..."
          className="h-10 text-sm"
        />
      </div>

      <div className="space-y-2">
        <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80 mb-1.5 block ml-1">
          Invoice Number
        </Label>
        <SearchableSelect
          options={invoiceOptions}
          value={filters.invoiceNumber}
          onValueChange={(val) => updateFilter("invoiceNumber", val)}
          placeholder="Select invoice..."
          className="h-10 text-sm"
        />
      </div>

      <div className="space-y-2">
        <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80 mb-1.5 block ml-1">
          Tracking/Docket #
        </Label>
        <SearchableSelect
          options={docketOptions}
          value={filters.docketNumber}
          onValueChange={(val) => updateFilter("docketNumber", val)}
          placeholder="Select tracking #..."
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
            {(
              Object.entries(OM_DISPATCH_STATUS_CONFIG) as [
                string,
                { label: string; color: string },
              ][]
            ).map(([key, config]) => (
              <SelectItem key={key} value={key}>
                {config.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80 mb-1.5 block ml-1">
          Sort By
        </Label>
        <Select
          value={sortBy}
          onValueChange={onSortChange}
        >
          <SelectTrigger className="h-10 text-sm focus:ring-neutral-900">
            <SelectValue placeholder="Sort by..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest First</SelectItem>
            <SelectItem value="oldest">Oldest First</SelectItem>
            <SelectItem value="inv_date_desc">Invoice Date (Newest)</SelectItem>
            <SelectItem value="inv_date_asc">Invoice Date (Oldest)</SelectItem>
            <SelectItem value="name_asc">Client Name (A-Z)</SelectItem>
            <SelectItem value="name_desc">Client Name (Z-A)</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
