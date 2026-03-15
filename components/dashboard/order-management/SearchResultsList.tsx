"use client";

import React from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
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
import { OMDashboardPO, OMDashboardDispatch } from "@/types/order-management";
import {
  PO_STATUS_LABELS,
  getPoStatusClass,
  getDispatchStatusClass,
} from "@/constants/order-management";

interface SearchResultsListProps {
  searchResults: {
    pos: OMDashboardPO[];
    dispatches: OMDashboardDispatch[];
    items: any[];
  };
  searchSummary: any;
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
                onClick={() => toggleSection("pos")}
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
                  <TableHeader className="bg-muted/50">
                    <TableRow>
                      <TableHead className="text-left px-3">Date</TableHead>
                      <TableHead className="text-left px-3">
                        PO Number
                      </TableHead>
                      <TableHead className="text-left px-3">Client</TableHead>
                      <TableHead className="text-left px-3">
                        Item Name
                      </TableHead>
                      <TableHead className="text-left px-3">
                        Total Qty
                      </TableHead>
                      <TableHead className="text-left px-3">
                        Dispatched
                      </TableHead>
                      <TableHead className="text-left px-3">
                        Remaining
                      </TableHead>
                      <TableHead className="text-left px-3">Value</TableHead>
                      <TableHead className="text-left px-3">Status</TableHead>
                      <TableHead className="text-right pr-6">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {searchResults.pos.flatMap((po) =>
                      po.lineItems.map((item) => {
                        const dispatched = getTotalDispatchedForItem(item.id);
                        const remaining = item.quantity - dispatched;
                        return (
                          <TableRow key={item.id}>
                            <TableCell className="text-left px-3 text-xs">
                              {po.poDate
                                ? new Date(po.poDate).toLocaleDateString(
                                    "en-IN",
                                  )
                                : "N/A"}
                            </TableCell>
                            <TableCell className="text-left px-3 font-medium">
                              <Link
                                href={`/admin/order-management/purchase-orders/${po.id}`}
                                className=" hover:underline cursor-pointer"
                              >
                                {po.poNumber || po.estimateNumber}
                              </Link>
                            </TableCell>
                            <TableCell className="text-left px-3 max-w-[150px] truncate">
                              {po.clientName || "N/A"}
                            </TableCell>
                            <TableCell className="text-left px-3 font-medium text-xs max-w-[200px] truncate">
                              {item.itemName || "N/A"}
                            </TableCell>
                            <TableCell className="text-left px-3">
                              {item.quantity}
                            </TableCell>
                            <TableCell className="text-left px-3 text-blue-600 font-medium">
                              {dispatched}
                            </TableCell>
                            <TableCell
                              className={`text-left px-3 font-medium ${remaining > 0 ? "text-amber-600" : "text-green-600"}`}
                            >
                              {remaining}
                            </TableCell>
                            <TableCell className="text-left px-3">
                              ₹{item.totalAmount.toLocaleString("en-IN")}
                            </TableCell>
                            <TableCell className="text-left px-3">
                              <Badge className={getPoStatusClass(po.status)}>
                                {PO_STATUS_LABELS[po.status] ?? po.status}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right pr-6">
                              <Link
                                href={`/admin/order-management/purchase-orders/${po.id}`}
                              >
                                <Button variant="outline" size="sm">
                                  View
                                </Button>
                              </Link>
                            </TableCell>
                          </TableRow>
                        );
                      }),
                    )}
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
                onClick={() => toggleSection("dispatches")}
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
                  <TableHeader className="bg-muted/50">
                    <TableRow>
                      <TableHead className="text-left px-3">
                        Invoice #
                      </TableHead>
                      <TableHead className="text-left px-3">
                        PO Number
                      </TableHead>
                      <TableHead className="text-left px-3">Client</TableHead>
                      <TableHead className="text-left px-3">
                        Item Name
                      </TableHead>
                      <TableHead className="text-left px-3">
                        Total Qty
                      </TableHead>
                      <TableHead className="text-left px-3">
                        Dispatched
                      </TableHead>
                      <TableHead className="text-left px-3">
                        Remaining
                      </TableHead>
                      <TableHead className="text-left px-3">Courier</TableHead>
                      <TableHead className="text-left px-3">Status</TableHead>
                      <TableHead className="text-right pr-6">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {searchResults.dispatches.flatMap((dispatch) =>
                      dispatch.lineItems.map((item, idx) => {
                        const dispatchedSoFar = getTotalDispatchedForItem(
                          item.poLineItemId || "",
                        );
                        const parentPOItem = omPurchaseOrders
                          .flatMap((po) => po.lineItems)
                          .find((pi) => pi.id === item.poLineItemId);
                        const orderedQty =
                          parentPOItem?.quantity || item.dispatchQty;
                        const remaining = orderedQty - dispatchedSoFar;

                        return (
                          <TableRow key={`${dispatch.id}-${idx}`}>
                            <TableCell className="text-left px-3 font-medium">
                              <Link
                                href={`/admin/order-management/dispatches/${dispatch.id}`}
                                className=" hover:underline cursor-pointer"
                              >
                                {dispatch.invoiceNumber}
                              </Link>
                            </TableCell>
                            <TableCell className="text-left px-3">
                              {dispatch.poNumber || "N/A"}
                            </TableCell>
                            <TableCell className="text-left px-3 max-w-[150px] truncate">
                              {dispatch.clientName || "N/A"}
                            </TableCell>
                            <TableCell className="text-left px-3 font-medium text-xs max-w-[200px] truncate">
                              {item.itemName || "N/A"}
                            </TableCell>
                            <TableCell className="text-left px-3">
                              {orderedQty}
                            </TableCell>
                            <TableCell className="text-left px-3 text-blue-600 font-medium">
                              {item.dispatchQty}
                            </TableCell>
                            <TableCell
                              className={`text-left px-3 font-medium ${remaining > 0 ? "text-amber-600" : "text-green-600"}`}
                            >
                              {remaining}
                            </TableCell>
                            <TableCell className="text-left px-3">
                              {dispatch.logisticsPartnerName || "N/A"}
                            </TableCell>
                            <TableCell className="text-left px-3">
                              <Badge
                                className={getDispatchStatusClass(
                                  dispatch.status,
                                )}
                              >
                                {dispatch.status.charAt(0).toUpperCase() +
                                  dispatch.status.slice(1).toLowerCase()}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right pr-6">
                              <Link
                                href={`/admin/order-management/dispatches/${dispatch.id}`}
                              >
                                <Button variant="outline" size="sm">
                                  View
                                </Button>
                              </Link>
                            </TableCell>
                          </TableRow>
                        );
                      }),
                    )}
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
                onClick={() => toggleSection("items")}
              >
                {expandedSections.items ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </Button>
            </div>
            {expandedSections.items && (
              <div className="border rounded-lg animate-in fade-in slide-in-from-top-4 duration-300">
                <Table>
                  <TableHeader className="bg-muted/50">
                    <TableRow>
                      <TableHead className="text-left px-3 wrap-break-word">
                        Item Name
                      </TableHead>
                      <TableHead className="text-left px-3">
                        Total Ordered
                      </TableHead>
                      <TableHead className="text-left px-3">
                        Total Dispatched
                      </TableHead>
                      <TableHead className="text-left px-3">
                        Remaining
                      </TableHead>
                      <TableHead className="text-center pr-6 pl-0">
                        Fulfillment
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {searchResults.items.map((item, index) => {
                      const fulfillment =
                        item.ordered > 0
                          ? ((item.dispatched / item.ordered) * 100).toFixed(1)
                          : "0";
                      return (
                        <TableRow key={index}>
                          <TableCell className="text-left px-3 font-medium wrap-break-word">
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
                          <TableCell className="text-left px-3">
                            {item.ordered}
                          </TableCell>
                          <TableCell className="text-left px-3">
                            {item.dispatched}
                          </TableCell>
                          <TableCell className="text-left px-3">
                            {item.remaining}
                          </TableCell>
                          <TableCell className="text-center pr-6 pl-0">
                            <Badge
                              variant={
                                parseFloat(fulfillment) === 100
                                  ? "default"
                                  : "secondary"
                              }
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
