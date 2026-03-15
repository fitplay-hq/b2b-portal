import { OMDashboardPO, OMDashboardDispatch } from "@/types/order-management";

/**
 * Filters Purchase Orders based on the search query.
 */
export const filterPOs = (pos: OMDashboardPO[], query: string): OMDashboardPO[] => {
  if (!query) return pos;
  const lowerQuery = query.toLowerCase();
  
  return pos.map(po => {
    const isOrderMatch = 
      (po.clientName ?? "").toLowerCase().includes(lowerQuery) ||
      (po.estimateNumber ?? "").toLowerCase().includes(lowerQuery) ||
      (po.poNumber ?? "").toLowerCase().includes(lowerQuery) ||
      po.deliveryLocations.some((loc) => loc.toLowerCase().includes(lowerQuery));

    // Filter line items that match
    const matchedLineItems = po.lineItems.filter(item => 
      (item.itemName ?? "").toLowerCase().includes(lowerQuery) ||
      (item.brandName ?? "").toLowerCase().includes(lowerQuery) ||
      (item.itemSku ?? "").toLowerCase().includes(lowerQuery)
    );

    // If the order matches but no items match (e.g. matched PO number), 
    // we should probably show all items or at least the PO itself.
    // However, if some items match, we ONLY show those items.
    // If NO items match but the PO matches, we show ALL items for that PO.
    const finalItems = matchedLineItems.length > 0 ? matchedLineItems : (isOrderMatch ? po.lineItems : []);

    if (finalItems.length === 0) return null as any;

    // Recalculate totals for this PO based on filtered items
    const totalQuantity = finalItems.reduce((sum, i) => sum + i.quantity, 0);
    const grandTotal = finalItems.reduce((sum, i) => sum + i.totalAmount, 0);

    return {
      ...po,
      lineItems: finalItems,
      totalQuantity,
      grandTotal,
    };
  }).filter(Boolean);
};

/**
 * Filters Dispatches based on the search query.
 */
export const filterDispatches = (dispatches: OMDashboardDispatch[], query: string): OMDashboardDispatch[] => {
  if (!query) return dispatches;
  const lowerQuery = query.toLowerCase();

  return dispatches.map(d => {
    const isDispatchMatch = 
      (d.clientName ?? "").toLowerCase().includes(lowerQuery) ||
      (d.invoiceNumber ?? "").toLowerCase().includes(lowerQuery) ||
      (d.poNumber ?? "").toLowerCase().includes(lowerQuery);

    const matchedLineItems = d.lineItems.filter(item => 
      (item.itemName ?? "").toLowerCase().includes(lowerQuery) ||
      (item.brandName ?? "").toLowerCase().includes(lowerQuery) ||
      (item.itemSku ?? "").toLowerCase().includes(lowerQuery)
    );

    const finalItems = matchedLineItems.length > 0 ? matchedLineItems : (isDispatchMatch ? d.lineItems : []);

    if (finalItems.length === 0) return null as any;

    const totalDispatchQty = finalItems.reduce((sum, i) => sum + i.dispatchQty, 0);

    return {
      ...d,
      lineItems: finalItems,
      totalDispatchQty,
    };
  }).filter(Boolean);
};

/**
 * Calculates matched items summary across POs based on search query.
 */
export const calculateItemMatches = (
  pos: OMDashboardPO[],
  dispatches: OMDashboardDispatch[],
  query: string
) => {
  if (!query) return [];
  const lowerQuery = query.toLowerCase();
  const itemsMap = new Map<string, any>();

  pos.forEach((po) => {
    po.lineItems.forEach((item) => {
      if (
        (item.itemName ?? "").toLowerCase().includes(lowerQuery) ||
        (item.brandName ?? "").toLowerCase().includes(lowerQuery) ||
        (item.itemSku ?? "").toLowerCase().includes(lowerQuery)
      ) {
        const existing = itemsMap.get(item.itemName) || {
          itemName: item.itemName,
          itemSku: item.itemSku,
          brandName: item.brandName,
          ordered: 0,
          dispatched: 0,
          remaining: 0,
        };

        existing.ordered += item.quantity;
        
        // Calculate dispatched for this item in this PO
        const itemDispatched = dispatches
          .filter((d) => d.poId === po.id)
          .reduce((sum, d) => {
            const dItem = d.lineItems.find(
              (di) => di.itemName === item.itemName,
            );
            return sum + (dItem?.dispatchQty || 0);
          }, 0);

        existing.dispatched += itemDispatched;
        existing.remaining = existing.ordered - existing.dispatched;
        itemsMap.set(item.itemName, existing);
      }
    });
  });

  return Array.from(itemsMap.values());
};

/**
 * Applies all filters (Master Search query + Advanced Filters) locally.
 */
export const applyAllFilters = (
  pos: OMDashboardPO[],
  dispatches: OMDashboardDispatch[],
  query: string,
  advancedFilters: any,
  timeRange?: string
) => {
  // 1. Initial filter for basic constraints (Master Search + specific advanced fields)
  let filteredPOs = pos;
  let filteredDispatches = dispatches;

  // Apply timeRange filter
  if (timeRange && timeRange !== "all") {
    const now = new Date();
    now.setHours(23, 59, 59, 999);

    filteredPOs = filteredPOs.filter((po) => {
      const dateStr = po.poDate || po.estimateDate;
      if (!dateStr) return false;
      const poDate = new Date(dateStr);
      const diffTime = Math.abs(now.getTime() - poDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (timeRange === "today") return diffDays <= 1;
      if (timeRange === "7d") return diffDays <= 7;
      if (timeRange === "30d") return diffDays <= 30;
      return true;
    });
  }

  const lowerQuery = query.toLowerCase();

  // Apply Advanced Filters first (AND logic)
  if (advancedFilters) {
    const {
      fromDate, toDate, clientName, itemName, brandName,
      status, logisticsPartnerId, poNumber, invoiceNumber,
      sku, docketNumber, minAmount, maxAmount
    } = advancedFilters;

    if (fromDate || toDate) {
      const start = fromDate ? new Date(fromDate) : null;
      const end = toDate ? new Date(toDate) : null;
      if (end) end.setHours(23, 59, 59, 999);

      const filterByDate = (dateStr: string | null) => {
        if (!dateStr) return false;
        const d = new Date(dateStr);
        if (start && d < start) return false;
        if (end && d > end) return false;
        return true;
      };

      filteredPOs = filteredPOs.filter(po => filterByDate(po.poDate || po.estimateDate));
      // For dispatches, we don't have a direct date often in the summary, usually grouped by PO
      // But we can filter by the parent PO date if available
    }

    if (clientName) {
      filteredPOs = filteredPOs.filter(po => (po.clientName ?? "").toLowerCase().includes(clientName.toLowerCase()));
      filteredDispatches = filteredDispatches.filter(d => (d.clientName ?? "").toLowerCase().includes(clientName.toLowerCase()));
    }

    if (status) {
      filteredPOs = filteredPOs.filter(po => po.status === status);
      filteredDispatches = filteredDispatches.filter(d => d.status === status);
    }

    if (logisticsPartnerId) {
      filteredDispatches = filteredDispatches.filter(d => {
        // Since logisticsPartnerId in filters might be an ID or Name depending on how it's stored
        // In OMDashboardDispatch, we have logisticsPartnerName
        return (d.logisticsPartnerName ?? "").toLowerCase().includes(logisticsPartnerId.toLowerCase());
      });
    }

    if (poNumber) {
      filteredPOs = filteredPOs.filter(po => (po.poNumber ?? "").toLowerCase().includes(poNumber.toLowerCase()));
      filteredDispatches = filteredDispatches.filter(d => (d.poNumber ?? "").toLowerCase().includes(poNumber.toLowerCase()));
    }

    if (invoiceNumber) {
      filteredDispatches = filteredDispatches.filter(d => (d.invoiceNumber ?? "").toLowerCase().includes(invoiceNumber.toLowerCase()));
    }

    if (minAmount) {
      filteredPOs = filteredPOs.filter(po => po.grandTotal >= parseFloat(minAmount));
    }
    if (maxAmount) {
      filteredPOs = filteredPOs.filter(po => po.grandTotal <= parseFloat(maxAmount));
    }

    // Item-level filters (itemName, brandName, sku)
    if (itemName || brandName || sku) {
      const filterItemArr = (items: any[]) => items.filter(i => {
        let match = true;
        if (itemName && !(i.itemName ?? "").toLowerCase().includes(itemName.toLowerCase())) match = false;
        if (brandName && !(i.brandName ?? "").toLowerCase().includes(brandName.toLowerCase())) match = false;
        if (sku && !(i.itemSku ?? "").toLowerCase().includes(sku.toLowerCase())) match = false;
        return match;
      });

      filteredPOs = filteredPOs.map(po => {
        const matchedItems = filterItemArr(po.lineItems);
        if (matchedItems.length === 0) return null as any;
        return {
          ...po,
          lineItems: matchedItems,
          totalQuantity: matchedItems.reduce((s, i) => s + i.quantity, 0),
          grandTotal: matchedItems.reduce((s, i) => s + i.totalAmount, 0)
        };
      }).filter(Boolean);

      filteredDispatches = filteredDispatches.map(d => {
        const matchedItems = filterItemArr(d.lineItems);
        if (matchedItems.length === 0) return null as any;
        return {
          ...d,
          lineItems: matchedItems,
          totalDispatchQty: matchedItems.reduce((s, i) => s + i.dispatchQty, 0)
        };
      }).filter(Boolean);
    }
  }

  // 2. Apply Master Search Filter (using the logic we already have, which clones and recalculates)
  // This will further narrow down based on the query string
  if (query) {
    filteredPOs = filterPOs(filteredPOs, query);
    filteredDispatches = filterDispatches(filteredDispatches, query);
  }

  return {
    filteredPOs,
    filteredDispatches,
    filteredItems: calculateItemMatches(filteredPOs, filteredDispatches, query || "")
  };
};

/**
 * Calculates search summary metrics based on already filtered data.
 */
export const calculateSearchSummary = (
  filteredPOs: OMDashboardPO[],
  filteredDispatches: OMDashboardDispatch[],
  getFilteredDispatchedForPO: (id: string) => number
) => {
  if (filteredPOs.length === 0 && filteredDispatches.length === 0) return null;

  return {
    totalPOs: filteredPOs.length,
    totalDispatches: filteredDispatches.length,
    totalOrdered: filteredPOs.reduce((sum, po) => sum + po.totalQuantity, 0),
    totalDispatched: filteredPOs.reduce((sum, po) => {
      return sum + getFilteredDispatchedForPO(po.id);
    }, 0),
    totalValue: filteredPOs.reduce((sum, po) => sum + po.grandTotal, 0),
  };
};
