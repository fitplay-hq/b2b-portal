import { OMDashboardPO, OMDashboardDispatch } from "@/types/order-management";

/**
 * Filters Purchase Orders based on the search query.
 */
export const filterPOs = (
  pos: OMDashboardPO[],
  query: string,
): OMDashboardPO[] => {
  if (!query) return pos;
  const lowerQuery = query.toLowerCase();
  const numericQuery = parseFloat(query);

  return pos
    .map((po) => {
      const isOrderMatch =
        (po.clientName ?? "").toLowerCase().includes(lowerQuery) ||
        (po.estimateNumber ?? "").toLowerCase().includes(lowerQuery) ||
        (po.poNumber ?? "").toLowerCase().includes(lowerQuery) ||
        (po.status ?? "").toLowerCase().includes(lowerQuery) ||
        (!isNaN(numericQuery) && po.grandTotal === numericQuery) ||
        po.deliveryLocations?.some((loc) =>
          loc.toLowerCase().includes(lowerQuery),
        );

      // Check if any nested dispatch matches logistics partner
      const isLogisticsMatch = po.lineItems.some((item) =>
        // This is a bit tricky as OMDashboardPO doesn't directly have dispatches
        // But the dashboard page logic fetches them together. 
        // We'll rely on the dispatches filter for logistics, 
        // but let's check if we can find it in the items or if we should just match the PO if any dispatch matches.
        false // OMDashboardPO doesn't have dispatches in its type directly here, 
              // but filterDispatches will handle the dispatch-side matching.
      );

      // Filter line items that match
      const matchedLineItems = po.lineItems.filter(
        (item) =>
          (item.itemName ?? "").toLowerCase().includes(lowerQuery) ||
          (item.brandName ?? "").toLowerCase().includes(lowerQuery) ||
          (item.itemSku ?? "").toLowerCase().includes(lowerQuery),
      );

      // If the order metadata matches, show ALL items. 
      // Otherwise, only show matched items.
      const finalItems = isOrderMatch ? po.lineItems : matchedLineItems;

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
    })
    .filter(Boolean);
};

/**
 * Filters Dispatches based on the search query.
 */
export const filterDispatches = (
  dispatches: OMDashboardDispatch[],
  query: string,
): OMDashboardDispatch[] => {
  if (!query) return dispatches;
  const lowerQuery = query.toLowerCase();
  const numericQuery = parseFloat(query);

  return dispatches
    .map((d) => {
      const isDispatchMatch =
        (d.clientName ?? "").toLowerCase().includes(lowerQuery) ||
        (d.invoiceNumber ?? "").toLowerCase().includes(lowerQuery) ||
        (d.poNumber ?? "").toLowerCase().includes(lowerQuery) ||
        (d.docketNumber ?? "").toLowerCase().includes(lowerQuery) ||
        (d.logisticsPartnerName ?? "").toLowerCase().includes(lowerQuery) ||
        (d.status ?? "").toLowerCase().includes(lowerQuery);

      const matchedLineItems = d.lineItems.filter(
        (item) =>
          (item.itemName ?? "").toLowerCase().includes(lowerQuery) ||
          (item.brandName ?? "").toLowerCase().includes(lowerQuery) ||
          (item.itemSku ?? "").toLowerCase().includes(lowerQuery),
      );

      // If dispatch metadata matches, show ALL items.
      const finalItems = isDispatchMatch ? d.lineItems : matchedLineItems;

      if (finalItems.length === 0) return null as any;

      const totalDispatchQty = finalItems.reduce(
        (sum, i) => sum + i.dispatchQty,
        0,
      );

      return {
        ...d,
        lineItems: finalItems,
        totalDispatchQty,
      };
    })
    .filter(Boolean);
};

/**
 * Calculates matched items summary across POs based on search query.
 */
export const calculateItemMatches = (
  pos: OMDashboardPO[],
  dispatches: OMDashboardDispatch[],
  query: string,
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
 * Calculates categorized matches for the search dropdown.
 */
export const calculateDropdownMatches = (
  pos: OMDashboardPO[],
  dispatches: OMDashboardDispatch[],
  query: string,
) => {
  if (!query || query.length < 2) {
    return {
      clients: [],
      locations: [],
      items: [],
      pos: [],
      dispatches: [],
      logistics: [],
    };
  }

  const lowerQuery = query.toLowerCase();
  
  // 1. Match Clients
  const clientsMap = new Map<string, any>();
  pos.forEach(po => {
    if ((po.clientName ?? "").toLowerCase().includes(lowerQuery)) {
      clientsMap.set(po.clientName, { name: po.clientName });
    }
  });

  // 2. Match Locations
  const locationsMap = new Map<string, any>();
  pos.forEach(po => {
    po.deliveryLocations.forEach(loc => {
      if (loc.toLowerCase().includes(lowerQuery)) {
        locationsMap.set(loc, { name: loc });
      }
    });
  });

  // 3. Match Items (existing logic repurposed)
  const items = calculateItemMatches(pos, dispatches, query);

  // 4. Match PO numbers
  const poMatches = pos
    .filter(po => 
      (po.poNumber ?? "").toLowerCase().includes(lowerQuery) || 
      (po.estimateNumber ?? "").toLowerCase().includes(lowerQuery)
    )
    .slice(0, 5)
    .map(po => ({
      id: po.id,
      number: po.poNumber || po.estimateNumber,
      clientName: po.clientName
    }));

  // 5. Match Dispatch numbers
  const dispatchMatches = dispatches
    .filter(d => 
      (d.invoiceNumber ?? "").toLowerCase().includes(lowerQuery) || 
      (d.docketNumber ?? "").toLowerCase().includes(lowerQuery)
    )
    .slice(0, 5)
    .map(d => ({
      id: d.id,
      number: d.invoiceNumber,
      docketNumber: d.docketNumber,
      clientName: d.clientName
    }));

  // 6. Match Logistics Partners
  const logisticsMap = new Map<string, any>();
  dispatches.forEach(d => {
    if ((d.logisticsPartnerName ?? "").toLowerCase().includes(lowerQuery)) {
      logisticsMap.set(d.logisticsPartnerName, { name: d.logisticsPartnerName });
    }
  });

  return {
    clients: Array.from(clientsMap.values()).slice(0, 5),
    locations: Array.from(locationsMap.values()).slice(0, 5),
    items: items.slice(0, 5),
    pos: poMatches,
    dispatches: dispatchMatches,
    logistics: Array.from(logisticsMap.values()).slice(0, 5),
  };
};

/**
 * Calculates search summary metrics.
 */
export const calculateSearchSummary = (
  filteredPOs: OMDashboardPO[],
  filteredDispatches: OMDashboardDispatch[],
  getTotalDispatchedForPO: (id: string) => number,
) => {
  if (filteredPOs.length === 0 && filteredDispatches.length === 0) return null;

  return {
    totalPOs: filteredPOs.length,
    totalDispatches: filteredDispatches.length,
    totalOrdered: filteredPOs.reduce((sum, po) => sum + po.totalQuantity, 0),
    totalDispatched: filteredPOs.reduce((sum, po) => {
      return sum + getTotalDispatchedForPO(po.id);
    }, 0),
    totalValue: filteredPOs.reduce((sum, po) => sum + po.grandTotal, 0),
  };
};
