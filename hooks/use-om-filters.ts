"use client";

import { useMemo, useState, useCallback } from "react";
import { ActiveFilter } from "@/components/orderManagement/shared/OMActiveFilters";

interface UseOMFiltersOptions<T extends Record<string, any>> {
  initialFilters: T;
  labels: Partial<Record<keyof T, string>>;
  valueLabels?: Partial<Record<keyof T, (value: any) => string>>;
}

export function useOMFilters<T extends Record<string, any>>({
  initialFilters,
  labels,
  valueLabels,
}: UseOMFiltersOptions<T>) {
  const [filters, setFilters] = useState<T>(initialFilters);

  const updateFilters = useCallback((updater: (prev: T) => T) => {
    setFilters(updater);
  }, []);

  const resetFilters = useCallback(() => {
    setFilters(initialFilters);
  }, [initialFilters]);

  const removeFilter = useCallback((key: keyof T) => {
    setFilters((prev) => ({
      ...prev,
      [key]: initialFilters[key],
    }));
  }, [initialFilters]);

  const activeFilters = useMemo(() => {
    const active: ActiveFilter[] = [];

    Object.entries(filters).forEach(([key, value]) => {
      // Skip if value matches initial value (not filtered)
      if (
        value === initialFilters[key] ||
        (Array.isArray(value) && value.length === 0) ||
        value === "all" ||
        value === ""
      ) {
        return;
      }

      const label = labels[key as keyof T] || key;
      const displayValue = valueLabels?.[key as keyof T] 
        ? valueLabels[key as keyof T]!(value) 
        : String(value);

      active.push({
        key,
        label,
        value: displayValue,
      });
    });

    return active;
  }, [filters, initialFilters, labels, valueLabels]);

  return {
    filters,
    setFilters,
    updateFilters,
    resetFilters,
    removeFilter: removeFilter as (key: string) => void,
    activeFilters,
  };
}
