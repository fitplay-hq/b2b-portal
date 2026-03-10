"use client";

import { X, RotateCcw } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export interface ActiveFilter {
  key: string;
  label: string;
  value: string;
  id?: string;
}

interface OMActiveFiltersProps {
  activeFilters: ActiveFilter[];
  onRemove: (key: string, value?: string) => void;
  onClearAll: () => void;
}

export function OMActiveFilters({
  activeFilters,
  onRemove,
  onClearAll,
}: OMActiveFiltersProps) {
  if (activeFilters.length === 0) return null;

  return (
    <div className="mt-4 flex flex-wrap gap-2 items-center min-h-8">
      <span className="text-xs text-muted-foreground font-medium mr-1 uppercase tracking-wider">
        Active Filters:
      </span>
      {activeFilters.map((filter, idx) => (
        <Badge
          key={`${filter.key}-${idx}`}
          variant="secondary"
          className="flex gap-1.5 items-center px-2.5 py-1 bg-blue-50 text-blue-700 border-blue-100 hover:bg-blue-100 transition-all duration-200 group"
        >
          <span className="font-bold opacity-70 uppercase text-[9px] tracking-tight">
            {filter.label}:
          </span>
          <span className="text-xs">{filter.value}</span>
          <button
            onClick={() => onRemove(filter.key, filter.id)}
            className="ml-0.5 rounded-full p-0.5 hover:bg-blue-200 text-blue-400 hover:text-blue-900 transition-colors"
            title={`Remove ${filter.label} filter`}
          >
            <X className="h-3 w-3" />
          </button>
        </Badge>
      ))}
      <Button
        variant="ghost"
        size="sm"
        onClick={onClearAll}
        className="h-7 px-2 text-[11px] text-muted-foreground hover:text-destructive flex gap-1.5 font-medium transition-colors"
      >
        <RotateCcw className="h-3 w-3" />
        Clear all
      </Button>
    </div>
  );
}
