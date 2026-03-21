import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { TableCell, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { formatStatus } from "@/lib/utils";
import {
  OMDispatchOrder,
  OMDispatchOrderItem,
  OMPurchaseOrderItem,
  getDispatchStatusVisuals,
} from "@/types/order-management";
import { OMDataTable } from "@/components/orderManagement/shared/OMDataTable";
import { format } from "date-fns";
import { OMSortableHeader } from "@/components/orderManagement/shared/OMSortableHeader";

interface OMDispatchHistoryProps {
  dispatches: OMDispatchOrder[];
  poItems: OMPurchaseOrderItem[];
  itemId?: string;
}

interface FlattenedDispatchItem {
  id: string;
  dispatchId: string;
  invoiceNumber: string;
  date: string;
  itemName: string;
  itemSku: string;
  quantity: number;
  totalOrdered: number;
  remainingQty: number;
  logisticsPartner: string;
  trackingNumber: string;
  status: string;
}

type HistorySortOption =
  | "date_asc"
  | "date_desc"
  | "inv_asc"
  | "inv_desc"
  | "item_asc"
  | "item_desc"
  | "total_asc"
  | "total_desc"
  | "dispatch_asc"
  | "dispatch_desc"
  | "rem_asc"
  | "rem_desc"
  | "log_asc"
  | "log_desc"
  | "track_asc"
  | "track_desc"
  | "status_asc"
  | "status_desc";

export function OMDispatchHistory({
  dispatches,
  poItems,
  itemId,
}: OMDispatchHistoryProps) {
  const router = useRouter();
  const [sortBy, setSortBy] = useState<HistorySortOption>("date_desc");

  // Flatten dispatches into item-level rows with date-wise remaining quantity
  const flattenedItems: FlattenedDispatchItem[] = useMemo(() => {
    // 1. Sort dispatches by date ascending to process chronologically for running totals
    const sortedDispatches = [...dispatches].sort((a, b) => {
      const dateA = new Date(a.dispatchDate || a.invoiceDate || 0).getTime();
      const dateB = new Date(b.dispatchDate || b.invoiceDate || 0).getTime();
      if (dateA !== dateB) return dateA - dateB;
      // Secondary sort to ensure consistent order for same-day dispatches
      return (a.invoiceNumber || "").localeCompare(b.invoiceNumber || "");
    });

    const runningTotals: Record<string, number> = {};

    return sortedDispatches.flatMap((dispatch) => {
      const itemsToFlatten = itemId
        ? dispatch.items?.filter((item) => item.purchaseOrderItemId === itemId)
        : dispatch.items;

      return (
        itemsToFlatten?.map((item: OMDispatchOrderItem) => {
          const poItem = poItems.find(
            (pi) => pi.id === item.purchaseOrderItemId,
          );

          // Track running total for this specific PO item
          const poItemId = item.purchaseOrderItemId;
          if (poItemId) {
            runningTotals[poItemId] =
              (runningTotals[poItemId] || 0) + (item.quantity || 0);
          }

          const remainingQty = poItemId ? Math.max(
            0,
            (poItem?.quantity || 0) - (runningTotals[poItemId] || 0),
          ) : 0;

          return {
            id: item.id,
            dispatchId: dispatch.id,
            invoiceNumber: dispatch.invoiceNumber,
            date: dispatch.dispatchDate || dispatch.invoiceDate,
            itemName:
              poItem?.product?.name ||
              item.product?.name ||
              item.purchaseOrderItem?.product?.name ||
              "Unknown Product",
            itemSku:
              poItem?.product?.sku ||
              item.product?.sku ||
              item.purchaseOrderItem?.product?.sku ||
              "N/A",
            quantity: item.quantity,
            totalOrdered: poItem?.quantity || 0,
            remainingQty: remainingQty,
            logisticsPartner: dispatch.logisticsPartner?.name || "N/A",
            trackingNumber: dispatch.docketNumber || "N/A",
            status: dispatch.status,
          };
        }) || []
      );
    });
  }, [dispatches, poItems, itemId]);

  // Sort the flattened items
  const sortedItems = useMemo(() => {
    return [...flattenedItems].sort((a, b) => {
      switch (sortBy) {
        case "date_asc":
          const diffAsc =
            new Date(a.date || 0).getTime() - new Date(b.date || 0).getTime();
          if (diffAsc !== 0) return diffAsc;
          return b.remainingQty - a.remainingQty; // Tie-breaker: higher remaining qty (older) first
        case "date_desc":
          const diffDesc =
            new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime();
          if (diffDesc !== 0) return diffDesc;
          return a.remainingQty - b.remainingQty; // Tie-breaker: lower remaining qty (more recent) first
        case "inv_asc":
          return (a.invoiceNumber || "").localeCompare(b.invoiceNumber || "");
        case "inv_desc":
          return (b.invoiceNumber || "").localeCompare(a.invoiceNumber || "");
        case "item_asc":
          return a.itemName.localeCompare(b.itemName);
        case "item_desc":
          return b.itemName.localeCompare(a.itemName);
        case "total_asc":
          return a.totalOrdered - b.totalOrdered;
        case "total_desc":
          return b.totalOrdered - a.totalOrdered;
        case "dispatch_asc":
          return a.quantity - b.quantity;
        case "dispatch_desc":
          return b.quantity - a.quantity;
        case "rem_asc":
          return a.remainingQty - b.remainingQty;
        case "rem_desc":
          return b.remainingQty - a.remainingQty;
        case "log_asc":
          return a.logisticsPartner.localeCompare(b.logisticsPartner);
        case "log_desc":
          return b.logisticsPartner.localeCompare(a.logisticsPartner);
        case "track_asc":
          return a.trackingNumber.localeCompare(b.trackingNumber);
        case "track_desc":
          return b.trackingNumber.localeCompare(a.trackingNumber);
        case "status_asc":
          return a.status.localeCompare(b.status);
        case "status_desc":
          return b.status.localeCompare(a.status);
        default:
          return 0;
      }
    });
  }, [flattenedItems, sortBy]);

  const getStatusColor = (status: string) => {
    return getDispatchStatusVisuals(status).color;
  };

  return (
    <OMDataTable
      data={sortedItems}
      isLoading={false}
      columnCount={9}
      onRowClick={(item) => router.push(`/admin/order-management/dispatches/${item.dispatchId}`)}
      emptyMessage="No dispatch history found for this purchase order."
      header={
        <TableRow>
          <OMSortableHeader
            title="Date"
            currentSort={sortBy}
            onSort={setSortBy}
            ascOption="date_asc"
            descOption="date_desc"
          />
          <OMSortableHeader
            title="Invoice Number"
            currentSort={sortBy}
            onSort={setSortBy}
            ascOption="inv_asc"
            descOption="inv_desc"
            className="px-3"
          />
          <OMSortableHeader
            title="Item Name"
            currentSort={sortBy}
            onSort={setSortBy}
            ascOption="item_asc"
            descOption="item_desc"
            className="px-3"
          />
          <OMSortableHeader
            title="Total Qty"
            currentSort={sortBy}
            onSort={setSortBy}
            ascOption="total_asc"
            descOption="total_desc"
            className="px-3"
          />
          <OMSortableHeader
            title="Dispatched Qty"
            currentSort={sortBy}
            onSort={setSortBy}
            ascOption="dispatch_asc"
            descOption="dispatch_desc"
            className="px-3"
          />
          <OMSortableHeader
            title="Remaining Qty"
            currentSort={sortBy}
            onSort={setSortBy}
            ascOption="rem_asc"
            descOption="rem_desc"
            className="px-3"
          />
          <OMSortableHeader
            title="Logistics Partner"
            currentSort={sortBy}
            onSort={setSortBy}
            ascOption="log_asc"
            descOption="log_desc"
            className="px-3"
          />
          <OMSortableHeader
            title="Tracking Number"
            currentSort={sortBy}
            onSort={setSortBy}
            ascOption="track_asc"
            descOption="track_desc"
            className="px-3"
          />
          <OMSortableHeader
            title="Status"
            currentSort={sortBy}
            onSort={setSortBy}
            ascOption="status_asc"
            descOption="status_desc"
            className="px-3 text-center"
          />
        </TableRow>
      }
      renderRow={(item: FlattenedDispatchItem) => (
        <TableRow
          key={item.id}
          className="cursor-pointer hover:bg-muted/50"
        >
          <TableCell className="pr-2">
            {item.date ? format(new Date(item.date), "dd MMM yyyy") : "N/A"}
          </TableCell>
          <TableCell className="px-3 font-medium">
            {item.invoiceNumber || "N/A"}
          </TableCell>
          <TableCell className="px-3">
            <div className="font-medium">{item.itemName}</div>
          </TableCell>
          <TableCell className="px-3 text-right">{item.totalOrdered}</TableCell>
          <TableCell className="px-3 text-right font-medium text-blue-600">
            {item.quantity}
          </TableCell>
          <TableCell className="px-3 text-right text-muted-foreground">
            {item.remainingQty}
          </TableCell>
          <TableCell className="px-3">{item.logisticsPartner}</TableCell>
          <TableCell className="px-3 font-mono text-sm max-w-[120px] truncate">
            {item.trackingNumber}
          </TableCell>
          <TableCell className="px-3 text-center">
            <Badge className={getStatusColor(item.status)}>
              {formatStatus(item.status)}
            </Badge>
          </TableCell>
        </TableRow>
      )}
    />
  );
}

