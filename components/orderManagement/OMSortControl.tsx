"use client";

import { useMemo } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { ArrowUpDown } from "lucide-react";
import { BASE_SORT_OPTIONS } from "@/constants/om-sort-options";

export type SortOption =
  | "name_asc"
  | "name_desc"
  | "newest"
  | "oldest"
  | "latest_update"
  | "inv_date_desc"
  | "inv_date_asc"
  | "sku_asc"
  | "sku_desc"
  | "brand_asc"
  | "brand_desc"
  | "rate_asc"
  | "rate_desc"
  | "gst_asc"
  | "gst_desc"
  | "total_ordered_asc"
  | "total_ordered_desc"
  | "inv_number_asc"
  | "inv_number_desc"
  | "po_num_asc"
  | "po_num_desc"
  | "qty_asc"
  | "qty_desc"
  | "courier_asc"
  | "courier_desc"
  | "tracking_asc"
  | "tracking_desc"
  | "status_asc"
  | "status_desc"
  | "po_date_asc"
  | "po_date_desc"
  | "remaining_asc"
  | "remaining_desc"
  | "value_asc"
  | "value_desc"
  | "po_number_asc"
  | "po_number_desc"
  | "client_asc"
  | "client_desc"
  | "contact_asc"
  | "contact_desc"
  | "email_asc"
  | "email_desc"
  | "phone_asc"
  | "phone_desc"
  | "ordered_asc"
  | "ordered_desc"
  | "dispatched_asc"
  | "dispatched_desc"
  | "dispatch_date_asc"
  | "dispatch_date_desc";

interface OMSortControlProps {
  value: SortOption;
  onValueChange: (value: SortOption) => void;
  options?: SortOption[];
  nameLabel?: string;
  hideNameSort?: boolean;
  className?: string;
}

export function OMSortControl({
  value,
  onValueChange,
  options: providedOptions,
  nameLabel = "Name",
  hideNameSort = false,
  className,
}: OMSortControlProps) {
  // Helper to get human-friendly labels
  const getSortLabel = (option: SortOption): string => {
    switch (option) {
      case "newest":
        return "Newest First";
      case "oldest":
        return "Oldest First";
      case "latest_update":
        return "Latest Update";
      default: {
        const fieldMapping: Record<string, string> = {
          name: nameLabel,
          sku: "SKU",
          brand: "Brand",
          rate: "Rate",
          gst: "GST",
          total_ordered: "Total Ordered",
          inv_number: "Invoice Number",
          inv_date: "Invoice Date",
          po_num: "PO Number",
          qty: "Quantity",
          courier: "Courier",
          tracking: "Tracking",
          status: "Status",
          po_date: "PO Date",
          remaining: "Remaining",
          value: "Value",
          po_number: "PO Number",
          client: "Client",
          contact: "Contact Person",
          email: "Email",
          phone: "Phone",
          ordered: "Ordered",
          dispatched: "Dispatched",
          dispatch_date: "Dispatch Date",
        };

        const lastUnderscoreIndex = (option as string).lastIndexOf("_");
        if (lastUnderscoreIndex === -1) return option;

        const field = (option as string).substring(0, lastUnderscoreIndex);
        const direction = (option as string).substring(lastUnderscoreIndex + 1);

        if (!field || !direction) return option;

        const friendlyField =
          fieldMapping[field] ||
          field
            .split("_")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ");

        let friendlyDirection = "";
        if (["newest", "oldest", "po_date", "inv_date", "dispatch_date"].includes(field)) {
          friendlyDirection = direction === "asc" ? "Oldest" : "Newest";
        } else if (["qty", "total_ordered", "rate", "value", "remaining", "ordered", "dispatched"].includes(field)) {
          friendlyDirection = direction === "asc" ? "Low to High" : "High to Low";
        } else {
          friendlyDirection = direction === "asc" ? "A-Z" : "Z-A";
        }

        return `${friendlyField} (${friendlyDirection})`;
      }
    }
  };

  // Helper to get the opposite sort direction for a field
  const getOppositeOption = (option: SortOption): SortOption | null => {
    const lastUnderscoreIndex = (option as string).lastIndexOf("_");
    if (lastUnderscoreIndex === -1) return null;

    const field = (option as string).substring(0, lastUnderscoreIndex);
    const direction = (option as string).substring(lastUnderscoreIndex + 1);
    return (direction === "asc" ? `${field}_desc` : `${field}_asc`) as SortOption;
  };

  const currentOptions = useMemo(() => {
    const list: SortOption[] = [];

    // 1. Add the current value and its opposite to the top if they are NOT default/provided
    // This ensures header-clicked options appear "on top" as requested
    if (value) {
      if (!list.includes(value)) list.push(value);
      
      const opposite = getOppositeOption(value);
      if (opposite && opposite !== value && !list.includes(opposite)) {
        list.push(opposite);
      }
    }

    // 2. Add provided options (high priority)
    if (providedOptions) {
      providedOptions.forEach(opt => {
        if (!list.includes(opt)) list.push(opt);
      });
    }

    // 3. Add default options (base list)
    let defaults = [...BASE_SORT_OPTIONS];
    if (hideNameSort) {
      defaults = defaults.filter(opt => opt !== "name_asc" && opt !== "name_desc");
    }
    
    defaults.forEach(opt => {
      if (!list.includes(opt)) list.push(opt);
    });

    return Array.from(new Set(list));
  }, [value, providedOptions, hideNameSort]);

  return (
    <div className={cn("relative w-full", className)}>
      <ArrowUpDown className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none z-10" />
      <Select
        value={value}
        onValueChange={(val) => onValueChange(val as SortOption)}
      >
        <SelectTrigger className="pl-10 h-10 w-full bg-background relative">
          <SelectValue placeholder="Sort By" />
        </SelectTrigger>
        <SelectContent>
          {currentOptions.map((opt) => (
            <SelectItem key={opt} value={opt}>
              {getSortLabel(opt)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
