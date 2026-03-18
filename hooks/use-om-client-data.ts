"use client";

import { useMemo } from "react";

interface useOMClientDataProps<T, S extends string = string> {
  data: T[];
  searchTerm: string;
  sortBy: S;
  filters: Record<string, any>;
  filterFn: (item: T, searchTerm: string, filters: Record<string, any>) => boolean;
  sortFn: (a: T, b: T, sortBy: S) => number;
}

export function useOMClientData<T, S extends string = string>({
  data,
  searchTerm,
  sortBy,
  filters,
  filterFn,
  sortFn,
}: useOMClientDataProps<T, S>) {
  const processedData = useMemo(() => {
    return data
      .filter((item) => filterFn(item, searchTerm, filters))
      .sort((a, b) => sortFn(a, b, sortBy));
  }, [data, searchTerm, sortBy, filters, filterFn, sortFn]);

  return processedData;
}
