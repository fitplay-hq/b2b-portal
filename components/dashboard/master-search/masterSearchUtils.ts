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

  return pos
    .map((po) => {
      const isOrderMatch =
        (po.clientName ?? "").toLowerCase().includes(lowerQuery) ||
        (po.estimateNumber ?? "").toLowerCase().includes(lowerQuery) ||
        (po.poNumber ?? "").toLowerCase().includes(lowerQuery) ||
        po.deliveryLocations.some((loc) =>
          loc.toLowerCase().includes(lowerQuery),
        );

      // Filter line items that match
      const matchedLineItems = po.lineItems.filter(
        (item) =>
          (item.itemName ?? "").toLowerCase().includes(lowerQuery) ||
          (item.brandName ?? "").toLowerCase().includes(lowerQuery) ||
          (item.itemSku ?? "").toLowerCase().includes(lowerQuery),
      );

      // If the order matches but no items match (e.g. matched PO number),
      // we should probably show all items or at least the PO itself.
      // However, if some items match, we ONLY show those items.
      // If NO items match but the PO matches, we show ALL items for that PO.
      const finalItems =
        matchedLineItems.length > 0
          ? matchedLineItems
          : isOrderMatch
            ? po.lineItems
            : [];

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

  return dispatches
    .map((d) => {
      const isDispatchMatch =
        (d.clientName ?? "").toLowerCase().includes(lowerQuery) ||
        (d.invoiceNumber ?? "").toLowerCase().includes(lowerQuery) ||
        (d.poNumber ?? "").toLowerCase().includes(lowerQuery);

      const matchedLineItems = d.lineItems.filter(
        (item) =>
          (item.itemName ?? "").toLowerCase().includes(lowerQuery) ||
          (item.brandName ?? "").toLowerCase().includes(lowerQuery) ||
          (item.itemSku ?? "").toLowerCase().includes(lowerQuery),
      );

      const finalItems =
        matchedLineItems.length > 0
          ? matchedLineItems
          : isDispatchMatch
            ? d.lineItems
            : [];

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
