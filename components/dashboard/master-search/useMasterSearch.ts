import { useState, useMemo, useCallback } from "react";
import { useDebounce } from "@/hooks/use-debounce";
import { OMDashboardPO, OMDashboardDispatch } from "@/types/order-management";
import { filterPOs, filterDispatches, calculateItemMatches, calculateSearchSummary, applyAllFilters } from "./masterSearchUtils";

interface UseMasterSearchProps {
  omPurchaseOrders: OMDashboardPO[];
  omDispatches: OMDashboardDispatch[];
  advancedFilters?: any;
  timeRange?: string;
  onManualSearch?: (query: string) => void;
  getTotalDispatchedForPO?: (id: string) => number;
}

export function useMasterSearch({
  omPurchaseOrders,
  omDispatches,
  advancedFilters,
  timeRange,
  onManualSearch,
  getTotalDispatchedForPO,
}: UseMasterSearchProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  // Persistence for searchQuery
  useMemo(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("om-master-search-query");
      if (saved) {
        setSearchQuery(saved);
        setIsSearching(true);
      }
    }
  }, []);

  useMemo(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("om-master-search-query", searchQuery);
    }
  }, [searchQuery]);

  // Default implementation if not provided
  const getDispatched = useCallback((poId: string) => {
    if (getTotalDispatchedForPO) return getTotalDispatchedForPO(poId);
    return omDispatches
      .filter((d) => d.poId === poId)
      .reduce((sum, d) => sum + d.totalDispatchQty, 0);
  }, [omDispatches, getTotalDispatchedForPO]);

  const debouncedSearchQuery = useDebounce(searchQuery, 2000);

  const searchResults = useMemo(() => {
    return applyAllFilters(omPurchaseOrders, omDispatches, searchQuery, advancedFilters, timeRange);
  }, [omPurchaseOrders, omDispatches, searchQuery, advancedFilters, timeRange]);

  const searchSummary = useMemo(() => {
    const getFilteredDispatched = (poId: string) => {
      return searchResults.filteredDispatches
        .filter((d) => d.poId === poId)
        .reduce((sum, d) => sum + d.totalDispatchQty, 0);
    };

    return calculateSearchSummary(searchResults.filteredPOs, searchResults.filteredDispatches, getFilteredDispatched);
  }, [searchResults.filteredPOs, searchResults.filteredDispatches]);

  const handleManualSearch = useCallback((query: string) => {
    setIsSearching(true);
    if (onManualSearch) {
      onManualSearch(query);
    }
  }, [onManualSearch]);

  const clearSearch = useCallback(() => {
    setSearchQuery("");
    setIsSearching(false);
    if (onManualSearch) {
      onManualSearch("");
    }
  }, [onManualSearch]);

  return {
    searchQuery,
    setSearchQuery,
    debouncedSearchQuery,
    isSearching,
    setIsSearching,
    searchResults: {
      pos: searchResults.filteredPOs,
      dispatches: searchResults.filteredDispatches,
      items: searchResults.filteredItems,
    },
    searchSummary,
    handleManualSearch,
    clearSearch,
  };
}
