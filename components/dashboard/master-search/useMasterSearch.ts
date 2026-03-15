import { useState, useMemo, useCallback } from "react";
import { useDebounce } from "@/hooks/use-debounce";
import { OMDashboardPO, OMDashboardDispatch } from "@/types/order-management";
import {
  filterPOs,
  filterDispatches,
  calculateItemMatches,
  calculateSearchSummary,
} from "./masterSearchUtils";

interface UseMasterSearchProps {
  omPurchaseOrders: OMDashboardPO[];
  omDispatches: OMDashboardDispatch[];
  onManualSearch?: (query: string) => void;
  getTotalDispatchedForPO?: (id: string) => number;
}

export function useMasterSearch({
  omPurchaseOrders,
  omDispatches,
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
  const getDispatched = useCallback(
    (poId: string) => {
      if (getTotalDispatchedForPO) return getTotalDispatchedForPO(poId);
      return omDispatches
        .filter((d) => d.poId === poId)
        .reduce((sum, d) => sum + d.totalDispatchQty, 0);
    },
    [omDispatches, getTotalDispatchedForPO],
  );

  const debouncedSearchQuery = useDebounce(searchQuery, 1500);

  const searchResults = useMemo(() => {
    const pos = filterPOs(omPurchaseOrders, searchQuery);
    const dispatches = filterDispatches(omDispatches, searchQuery);
    const items = calculateItemMatches(
      omPurchaseOrders,
      omDispatches,
      searchQuery,
    );

    return { pos, dispatches, items };
  }, [omPurchaseOrders, omDispatches, searchQuery]);

  const searchSummary = useMemo(() => {
    const getFilteredDispatched = (poId: string) => {
      return searchResults.dispatches
        .filter((d) => d.poId === poId)
        .reduce((sum, d) => sum + d.totalDispatchQty, 0);
    };

    return calculateSearchSummary(
      searchResults.pos,
      searchResults.dispatches,
      getFilteredDispatched,
    );
  }, [searchResults.pos, searchResults.dispatches]);

  const handleManualSearch = useCallback(
    async (query: string) => {
      setIsSearching(true);
      if (onManualSearch) {
        await onManualSearch(query);
      }
    },
    [onManualSearch],
  );

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
    searchResults,
    searchSummary,
    handleManualSearch,
    clearSearch,
  };
}
