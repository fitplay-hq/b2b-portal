"use client";

import { useMemo, useState, useCallback } from "react";
import { ActiveFilter } from "@/components/orderManagement/shared/OMActiveFilters";

interface UseOMFiltersOptions<T extends Record<string, any>> {
  initialFilters: T;
  labels: Partial<Record<keyof T, string>>;
  valueLabels?: Partial<Record<keyof T, (value: any) => string>>;
  persistenceKey?: string;
}

export function useOMFilters<T extends Record<string, any>>({
  initialFilters,
  labels,
  valueLabels,
  persistenceKey,
}: UseOMFiltersOptions<T>) {
  const [filters, setFilters] = useState<T>(initialFilters);

  // Load from persistence
  useMemo(() => {
    if (typeof window !== "undefined" && persistenceKey) {
      const saved = localStorage.getItem(persistenceKey);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          // Merge with initial filters to handle schema changes
          setFilters({ ...initialFilters, ...parsed });
        } catch (e) {
          console.error("Failed to parse persisted filters", e);
        }
      }
    }
  }, [persistenceKey]);

  // Save to persistence
  useMemo(() => {
    if (typeof window !== "undefined" && persistenceKey) {
      localStorage.setItem(persistenceKey, JSON.stringify(filters));
    }
  }, [filters, persistenceKey]);

  const updateFilters = useCallback((updater: (prev: T) => T) => {
    setFilters((prev) => {
      const next = updater(prev);
      return next;
    });
  }, []);

  const resetFilters = useCallback(() => {
    setFilters(initialFilters);
    if (persistenceKey && typeof window !== "undefined") {
      localStorage.removeItem(persistenceKey);
    }
  }, [initialFilters, persistenceKey]);

  const removeFilter = useCallback(
    (key: keyof T) => {
      setFilters((prev) => ({
        ...prev,
        [key]: initialFilters[key],
      }));
    },
    [initialFilters],
  );

  const activeFilters = useMemo(() => {
    const active: ActiveFilter[] = [];

    Object.entries(filters).forEach(([key, value]) => {
      // Skip if value matches initial value (not filtered)
      if (
        value === initialFilters[key] ||
        (Array.isArray(value) && value.length === 0) ||
        value === "all" ||
        value === "" ||
        value === undefined ||
        value === null
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
        id: String(value),
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
