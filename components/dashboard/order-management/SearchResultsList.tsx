"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  Package,
  Truck,
  Box,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import {
  OMDashboardPO,
  OMDashboardDispatch,
  OMItemSummary,
} from "@/types/order-management";
import {
  PO_STATUS_LABELS,
  getPoStatusClass,
  getDispatchStatusClass,
} from "@/constants/order-management";
import { OMSortableHeader } from "@/components/orderManagement/shared/OMSortableHeader";

interface OMSearchSummary {
  totalPOs: number;
  totalDispatches: number;
  totalValue: number;
}

interface SearchResultsListProps {
  searchResults: {
    pos: OMDashboardPO[];
    dispatches: OMDashboardDispatch[];
    items: OMItemSummary[];
  };
  searchSummary: OMSearchSummary | null;
  searchQuery: string;
  expandedSections: Record<string, boolean>;
  toggleSection: (section: string) => void;
  getTotalDispatchedForItem: (poLineItemId: string) => number;
  omPurchaseOrders: OMDashboardPO[];
}

export function SearchResultsList({
  searchResults,
  searchSummary,
  searchQuery,
  expandedSections,
  toggleSection,
  getTotalDispatchedForItem,
  omPurchaseOrders,
}: SearchResultsListProps) {
  const [poSortBy, setPoSortBy] = useState<string>("date_desc");
  const [dispatchSortBy, setDispatchSortBy] = useState<string>("date_desc");
  const [itemSortBy, setItemSortBy] = useState<string>("name_asc");

  // --- Purchase Orders Sorting ---
  const sortedPOs = useMemo(() => {
    const flattened = searchResults.pos.flatMap((po) =>
      po.lineItems.map((item) => ({
        ...item,
        poId: po.id,
        poNumber: po.poNumber || po.estimateNumber,
        poDate: po.poDate,
        clientName: po.clientName,
        status: po.status,
        deliveryLocations: po.deliveryLocations,
      }))
    );

    return [...flattened].sort((a, b) => {
      const [key, direction] = poSortBy.split("_");
      const isAsc = direction === "asc";
      let comparison = 0;

      switch (key) {
        case "date":
          comparison = new Date(a.poDate || 0).getTime() - new Date(b.poDate || 0).getTime();
          break;
        case "po":
          comparison = (a.poNumber || "").localeCompare(b.poNumber || "");
          break;
        case "client":
          comparison = (a.clientName || "").localeCompare(b.clientName || "");
          break;
        case "item":
          comparison = (a.itemName || "").localeCompare(b.itemName || "");
          break;
        case "qty":
          comparison = a.quantity - b.quantity;
          break;
        case "value":
          comparison = a.totalAmount - b.totalAmount;
          break;
        case "status":
          comparison = (a.status || "").localeCompare(b.status || "");
          break;
        default:
          comparison = 0;
      }

      return isAsc ? comparison : -comparison;
    });
  }, [searchResults.pos, poSortBy]);

  // --- Dispatches Sorting ---
  const sortedDispatches = useMemo(() => {
    const flattened = searchResults.dispatches.flatMap((dispatch) =>
      dispatch.lineItems.map((item, idx) => {
        const parentPOItem = omPurchaseOrders
          .flatMap((po) => po.lineItems)
          .find((pi) => pi.id === item.poLineItemId);
        const orderedQty = parentPOItem?.quantity || item.dispatchQty;

        return {
          ...item,
          dispatchId: dispatch.id,
          invoiceNumber: dispatch.invoiceNumber,
          poNumber: dispatch.poNumber,
          clientName: dispatch.clientName,
          dispatchDate: dispatch.dispatchDate || dispatch.invoiceDate,
          logisticsPartnerName: dispatch.logisticsPartnerName,
          status: dispatch.status,
          orderedQty,
          uniqueKey: `${dispatch.id}-${idx}`,
        };
      })
    );

    return [...flattened].sort((a, b) => {
      const [key, direction] = dispatchSortBy.split("_");
      const isAsc = direction === "asc";
      let comparison = 0;

      switch (key) {
        case "date":
          comparison = new Date(a.dispatchDate || 0).getTime() - new Date(b.dispatchDate || 0).getTime();
          break;
        case "inv":
          comparison = (a.invoiceNumber || "").localeCompare(b.invoiceNumber || "");
          break;
        case "po":
          comparison = (a.poNumber || "").localeCompare(b.poNumber || "");
          break;
        case "client":
          comparison = (a.clientName || "").localeCompare(b.clientName || "");
          break;
        case "item":
          comparison = (a.itemName || "").localeCompare(b.itemName || "");
          break;
        case "status":
          comparison = (a.status || "").localeCompare(b.status || "");
          break;
        default:
          comparison = 0;
      }

      return isAsc ? comparison : -comparison;
    });
  }, [searchResults.dispatches, dispatchSortBy, omPurchaseOrders]);

  // --- Items Sorting ---
  const sortedItemsList = useMemo(() => {
    return [...searchResults.items].sort((a, b) => {
      const [key, direction] = itemSortBy.split("_");
      const isAsc = direction === "asc";
      let comparison = 0;

      switch (key) {
        case "name":
          comparison = (a.itemName || "").localeCompare(b.itemName || "");
          break;
        case "ordered":
          comparison = a.ordered - b.ordered;
          break;
        case "dispatched":
          comparison = a.dispatched - b.dispatched;
          break;
        case "remaining":
          comparison = a.remaining - b.remaining;
          break;
        case "fulfillment":
          const fA = a.ordered > 0 ? a.dispatched / a.ordered : 0;
          const fB = b.ordered > 0 ? b.dispatched / b.ordered : 0;
          comparison = fA - fB;
          break;
        default:
          comparison = 0;
      }

      return isAsc ? comparison : -comparison;
    });
  }, [searchResults.items, itemSortBy]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl flex items-center gap-2">
          <Search className="h-5 w-5" />
          Search Results for &quot;{searchQuery}&quot;
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-8 pt-6">
        {/* Dynamic Results Header */}
        {searchSummary && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-muted/30 rounded-lg border border-muted">
            <div>
              <p className="text-sm text-muted-foreground">Found POs</p>
              <p className="text-2xl font-bold">{searchSummary?.totalPOs}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Found Dispatches</p>
              <p className="text-2xl font-bold">
                {searchSummary?.totalDispatches}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Value</p>
              <p className="text-2xl font-bold">
                ₹{searchSummary?.totalValue.toLocaleString("en-IN")}
              </p>
            </div>
          </div>
        )}

        {/* Purchase Order Context Results */}
        {searchResults.pos.length > 0 && (
          <div className="space-y-4">
            <div
              className="flex items-center justify-between cursor-pointer hover:bg-neutral-100 rounded-xl p-2"
              onClick={() => toggleSection("pos")}
            >
              <h3 className="text-lg font-bold flex items-center gap-2 pl-2">
                <Package className="h-5 w-5 text-primary" />
                Matching Purchase Orders
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleSection("pos");
                }}
              >
                {expandedSections.pos ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </Button>
            </div>
            {expandedSections.pos && (
              <div className="border rounded-lg overflow-hidden animate-in fade-in slide-in-from-top-4 duration-300">
                <Table>
                  <thead className="bg-muted/50 border-b">
                    <TableRow>
                      <OMSortableHeader
                        title="Date"
                        currentSort={poSortBy}
                        onSort={setPoSortBy}
                        ascOption="date_asc"
                        descOption="date_desc"
                        className="text-left px-3 text-xs"
                      />
                      <OMSortableHeader
                        title="PO Number"
                        currentSort={poSortBy}
                        onSort={setPoSortBy}
                        ascOption="po_asc"
                        descOption="po_desc"
                        className="text-left px-3"
                      />
                      <OMSortableHeader
                        title="Client"
                        currentSort={poSortBy}
                        onSort={setPoSortBy}
                        ascOption="client_asc"
                        descOption="client_desc"
                        className="text-left px-3"
                      />
                      <OMSortableHeader
                        title="Item Name"
                        currentSort={poSortBy}
                        onSort={setPoSortBy}
                        ascOption="item_asc"
                        descOption="item_desc"
                        className="text-left px-3"
                      />
                      <OMSortableHeader
                        title="Total Qty"
                        currentSort={poSortBy}
                        onSort={setPoSortBy}
                        ascOption="qty_asc"
                        descOption="qty_desc"
                        className="text-left px-3"
                      />
                      <th className="h-10 px-3 text-left align-middle font-medium text-muted-foreground text-xs">Dispatched</th>
                      <th className="h-10 px-3 text-left align-middle font-medium text-muted-foreground text-xs">Remaining</th>
                      <OMSortableHeader
                        title="Value"
                        currentSort={poSortBy}
                        onSort={setPoSortBy}
                        ascOption="value_asc"
                        descOption="value_desc"
                        className="text-left px-3"
                      />
                      <OMSortableHeader
                        title="Status"
                        currentSort={poSortBy}
                        onSort={setPoSortBy}
                        ascOption="status_asc"
                        descOption="status_desc"
                        className="text-left px-3"
                      />
                      <th className="h-10 px-3 text-left align-middle font-medium text-muted-foreground text-xs">Location</th>
                      <th className="h-10 pr-6 text-right align-middle font-medium text-muted-foreground text-xs">Action</th>
                    </TableRow>
                  </thead>
                  <TableBody>
                    {sortedPOs.map((item) => {
                      const dispatched = getTotalDispatchedForItem(item.id);
                      const remaining = item.quantity - dispatched;
                      return (
                        <TableRow key={item.id}>
                          <TableCell className="text-left px-3 text-xs">
                            {item.poDate
                              ? new Date(item.poDate).toLocaleDateString(
                                  "en-IN",
                                )
                              : "N/A"}
                          </TableCell>
                          <TableCell className="text-left px-3 font-medium text-xs">
                            <Link
                              href={`/admin/order-management/purchase-orders/${item.poId}`}
                              className=" hover:underline cursor-pointer"
                            >
                              {item.poNumber}
                            </Link>
                          </TableCell>
                          <TableCell className="text-left px-3 max-w-[150px] truncate text-xs">
                            {item.clientName || "N/A"}
                          </TableCell>
                          <TableCell className="text-left px-3 font-medium text-xs max-w-[200px] truncate">
                            {item.itemName || "N/A"}
                          </TableCell>
                          <TableCell className="text-left px-3 text-xs">
                            {item.quantity}
                          </TableCell>
                          <TableCell className="text-left px-3 text-blue-600 font-medium text-xs">
                            {dispatched}
                          </TableCell>
                          <TableCell
                            className={`text-left px-3 font-medium text-xs ${remaining > 0 ? "text-amber-600" : "text-green-600"}`}
                          >
                            {remaining}
                          </TableCell>
                          <TableCell className="text-left px-3 text-xs">
                            ₹{item.totalAmount.toLocaleString("en-IN")}
                          </TableCell>
                          <TableCell className="text-left px-3 text-xs">
                            <Badge className={getPoStatusClass(item.status)}>
                              {PO_STATUS_LABELS[item.status] ?? item.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-left px-3 text-[10px] text-muted-foreground whitespace-nowrap">
                            {item.deliveryLocations.join(", ") || "N/A"}
                          </TableCell>
                          <TableCell className="text-right pr-6">
                            <Link
                              href={`/admin/order-management/purchase-orders/${item.poId}`}
                            >
                              <Button variant="outline" size="sm">
                                View
                              </Button>
                            </Link>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
        )}

        {/* Dispatch Context Results */}
        {searchResults.dispatches.length > 0 && (
          <div className="space-y-4">
            <div
              className="flex items-center justify-between cursor-pointer hover:bg-neutral-100 rounded-xl p-2"
              onClick={() => toggleSection("dispatches")}
            >
              <h3 className="text-lg font-bold flex items-center gap-2 pl-2">
                <Truck className="h-5 w-5 text-primary" />
                Matching Dispatches
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleSection("dispatches");
                }}
              >
                {expandedSections.dispatches ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </Button>
            </div>
            {expandedSections.dispatches && (
              <div className="border rounded-lg overflow-hidden animate-in fade-in slide-in-from-top-4 duration-300">
                <Table>
                  <thead className="bg-muted/50 border-b">
                    <TableRow>
                      <OMSortableHeader
                        title="Date"
                        currentSort={dispatchSortBy}
                        onSort={setDispatchSortBy}
                        ascOption="date_asc"
                        descOption="date_desc"
                        className="text-left px-3 text-xs"
                      />
                      <OMSortableHeader
                        title="Invoice #"
                        currentSort={dispatchSortBy}
                        onSort={setDispatchSortBy}
                        ascOption="inv_asc"
                        descOption="inv_desc"
                        className="text-left px-3"
                      />
                      <OMSortableHeader
                        title="PO Number"
                        currentSort={dispatchSortBy}
                        onSort={setDispatchSortBy}
                        ascOption="po_asc"
                        descOption="po_desc"
                        className="text-left px-3"
                      />
                      <OMSortableHeader
                        title="Client"
                        currentSort={dispatchSortBy}
                        onSort={setDispatchSortBy}
                        ascOption="client_asc"
                        descOption="client_desc"
                        className="text-left px-3"
                      />
                      <OMSortableHeader
                        title="Item Name"
                        currentSort={dispatchSortBy}
                        onSort={setDispatchSortBy}
                        ascOption="item_asc"
                        descOption="item_desc"
                        className="text-left px-3"
                      />
                      <th className="h-10 px-3 text-left align-middle font-medium text-muted-foreground text-xs">Total Qty</th>
                      <th className="h-10 px-3 text-left align-middle font-medium text-muted-foreground text-xs">Dispatched</th>
                      <th className="h-10 px-3 text-left align-middle font-medium text-muted-foreground text-xs">Remaining</th>
                      <th className="h-10 px-3 text-left align-middle font-medium text-muted-foreground text-xs">Courier</th>
                      <OMSortableHeader
                        title="Status"
                        currentSort={dispatchSortBy}
                        onSort={setDispatchSortBy}
                        ascOption="status_asc"
                        descOption="status_desc"
                        className="text-left px-3"
                      />
                      <th className="h-10 pr-6 text-right align-middle font-medium text-muted-foreground text-xs">Action</th>
                    </TableRow>
                  </thead>
                  <TableBody>
                    {sortedDispatches.map((item) => {
                      const dispatchedSoFar = getTotalDispatchedForItem(
                        item.poLineItemId || "",
                      );
                      const remaining = item.orderedQty - dispatchedSoFar;

                      return (
                        <TableRow key={item.uniqueKey}>
                          <TableCell className="text-left px-3 text-xs">
                            {item.dispatchDate
                              ? new Date(item.dispatchDate).toLocaleDateString("en-IN")
                              : "N/A"}
                          </TableCell>
                          <TableCell className="text-left px-3 font-medium text-xs">
                            <Link
                              href={`/admin/order-management/dispatches/${item.dispatchId}`}
                              className=" hover:underline cursor-pointer"
                            >
                              {item.invoiceNumber}
                            </Link>
                          </TableCell>
                          <TableCell className="text-left px-3 text-xs">
                            {item.poNumber || "N/A"}
                          </TableCell>
                          <TableCell className="text-left px-3 max-w-[150px] truncate text-xs">
                            {item.clientName || "N/A"}
                          </TableCell>
                          <TableCell className="text-left px-3 font-medium text-xs max-w-[200px] truncate">
                            {item.itemName || "N/A"}
                          </TableCell>
                          <TableCell className="text-left px-3 text-xs">
                            {item.orderedQty}
                          </TableCell>
                          <TableCell className="text-left px-3 text-blue-600 font-medium text-xs">
                            {item.dispatchQty}
                          </TableCell>
                          <TableCell
                            className={`text-left px-3 font-medium text-xs ${remaining > 0 ? "text-amber-600" : "text-green-600"}`}
                          >
                            {remaining}
                          </TableCell>
                           <TableCell className="text-left px-3 text-xs">
                            {item.logisticsPartnerName || "N/A"}
                          </TableCell>
                          <TableCell className="text-left px-3 text-xs">
                            <Badge
                              className={getDispatchStatusClass(
                                item.status,
                              )}
                            >
                              {item.status.charAt(0).toUpperCase() +
                                item.status.slice(1).toLowerCase()}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right pr-6">
                            <Link
                              href={`/admin/order-management/dispatches/${item.dispatchId}`}
                            >
                              <Button variant="outline" size="sm">
                                View
                              </Button>
                            </Link>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
        )}

        {/* SKU / Item Results */}
        {searchResults.items.length > 0 && (
          <div className="space-y-4">
            <div
              className="flex items-center justify-between cursor-pointer hover:bg-neutral-100 rounded-xl p-2"
              onClick={() => toggleSection("items")}
            >
              <h3 className="text-lg font-bold flex items-center gap-2 pl-2">
                <Box className="h-5 w-5 text-primary" />
                Matching Items
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleSection("items");
                }}
              >
                {expandedSections.items ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </Button>
            </div>
            {expandedSections.items && (
              <div className="border rounded-lg animate-in fade-in slide-in-from-top-4 duration-300 overflow-hidden">
                <Table>
                  <thead className="bg-muted/50 border-b">
                    <TableRow>
                      <OMSortableHeader
                        title="Item Name"
                        currentSort={itemSortBy}
                        onSort={setItemSortBy}
                        ascOption="name_asc"
                        descOption="name_desc"
                        className="text-left px-3 wrap-break-word"
                      />
                      <OMSortableHeader
                        title="Total Ordered"
                        currentSort={itemSortBy}
                        onSort={setItemSortBy}
                        ascOption="ordered_asc"
                        descOption="ordered_desc"
                        className="text-left px-3"
                      />
                      <OMSortableHeader
                        title="Total Dispatched"
                        currentSort={itemSortBy}
                        onSort={setItemSortBy}
                        ascOption="dispatched_asc"
                        descOption="dispatched_desc"
                        className="text-left px-3"
                      />
                      <OMSortableHeader
                        title="Remaining"
                        currentSort={itemSortBy}
                        onSort={setItemSortBy}
                        ascOption="remaining_asc"
                        descOption="remaining_desc"
                        className="text-left px-3"
                      />
                      <OMSortableHeader
                        title="Fulfillment"
                        currentSort={itemSortBy}
                        onSort={setItemSortBy}
                        ascOption="fulfillment_asc"
                        descOption="fulfillment_desc"
                        className="text-center pr-6 pl-0"
                      />
                    </TableRow>
                  </thead>
                  <TableBody>
                    {sortedItemsList.map((item, index) => {
                      const fulfillment =
                        item.ordered > 0
                          ? ((item.dispatched / item.ordered) * 100).toFixed(1)
                          : "0";
                      return (
                        <TableRow key={index}>
                          <TableCell className="text-left px-3 font-medium wrap-break-word text-xs">
                            <Link
                              href={`/admin/order-management/items?search=${encodeURIComponent(item.itemName)}`}
                              className=" hover:underline cursor-pointer"
                            >
                              {item.itemName || "N/A"}
                            </Link>
                            {item.itemSku && (
                              <span className="block text-[10px] text-muted-foreground font-mono">
                                {item.itemSku}
                              </span>
                            )}
                          </TableCell>
                          <TableCell className="text-left px-3 text-xs">
                            {item.ordered}
                          </TableCell>
                          <TableCell className="text-left px-3 text-xs">
                            {item.dispatched}
                          </TableCell>
                          <TableCell className="text-left px-3 text-xs">
                            {item.remaining}
                          </TableCell>
                          <TableCell className="text-center pr-6 pl-0">
                            <Badge
                              variant={
                                parseFloat(fulfillment) === 100
                                  ? "default"
                                  : "secondary"
                              }
                              className="text-[10px]"
                            >
                              {fulfillment}%
                            </Badge>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
        )}

        {searchResults.pos.length === 0 &&
          searchResults.dispatches.length === 0 &&
          searchResults.items.length === 0 && (
            <div className="text-center py-12 border-2 border-dashed rounded-xl border-muted">
              <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium text-muted-foreground">
                No results found for &quot;{searchQuery}&quot;
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                Try searching by SKU, PO #, or Invoice #
              </p>
            </div>
          )}
      </CardContent>
    </Card>
  );
}
