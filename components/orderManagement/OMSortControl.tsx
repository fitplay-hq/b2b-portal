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
  | "inv_date_asc";

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
