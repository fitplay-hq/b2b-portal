"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

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
}

export function OMSortControl({
  value,
  onValueChange,
  nameLabel = "Name",
  className,
}: OMSortControlProps) {
  return (
    <div className="flex flex-col gap-1.5 text-left">
      <Label className="text-xs font-medium text-muted-foreground ml-1">
        Sort By
      </Label>
      <Select
        value={value}
        onValueChange={(val) => onValueChange(val as SortOption)}
      >
        <SelectTrigger className={className}>
          <SelectValue placeholder="Sort By" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="name_asc">{nameLabel} (A-Z)</SelectItem>
          <SelectItem value="name_desc">{nameLabel} (Z-A)</SelectItem>
          <SelectItem value="newest">Newest First</SelectItem>
          <SelectItem value="oldest">Oldest First</SelectItem>
          <SelectItem value="latest_update">Latest Update</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
