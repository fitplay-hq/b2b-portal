"use client";

import { useState, useMemo } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { ArrowUpDown } from "lucide-react";
import { cn } from "@/lib/utils";

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
  | "dispatched_desc";

interface OMSortControlProps {
  value: SortOption;
  onValueChange: (value: SortOption) => void;
  nameLabel?: string;
  className?: string;
  hideLabel?: boolean;
}

export function OMSortControl({
  value,
  onValueChange,
  nameLabel = "Name",
  className,
  hideLabel = false,
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
        };

        const [field, direction] = (option as string).split("_");
        if (!field || !direction) return option;

        const friendlyField =
          fieldMapping[field] ||
          field.charAt(0).toUpperCase() + field.slice(1).replace("_", " ");
        const friendlyDirection = direction === "asc" ? "A-Z" : "Z-A";

        return `${friendlyField} (${friendlyDirection})`;
      }
    }
  };

  // Base options that are always shown
  const baseOptions: SortOption[] = [
    "name_asc",
    "name_desc",
    "newest",
    "oldest",
    "latest_update",
  ];

  // Dynamic options including the current value
  const currentOptions = useMemo(() => {
    const options = [...baseOptions];

    // If current value is not in base options, add it and its counterpart
    if (value && !baseOptions.includes(value)) {
      options.push(value);
      const [field, direction] = (value as string).split("_");
      if (field && direction) {
        const opposite = (direction === "asc"
          ? `${field}_desc`
          : `${field}_asc`) as SortOption;
        // Check if opposite exists in the type (heuristic)
        if (!options.includes(opposite)) {
          options.push(opposite);
        }
      }
    }
    return Array.from(new Set(options));
  }, [value, nameLabel]);

  return (
    <Select
      value={value}
      onValueChange={(val) => onValueChange(val as SortOption)}
    >
      <SelectTrigger className={cn("pl-10 relative h-10 w-full", className)}>
        <ArrowUpDown className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <SelectValue placeholder="Sort By" />
      </SelectTrigger>
      <SelectContent>
        {currentOptions.map((opt: SortOption) => (
          <SelectItem key={opt} value={opt}>
            {getSortLabel(opt)}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

