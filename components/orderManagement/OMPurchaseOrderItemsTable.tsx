"use client";
import React from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useMemo, useState } from "react";
import { Plus, ChevronDown, ChevronRight } from "lucide-react";
import Link from "next/link";
import { OMDispatchHistory } from "./OMDispatchHistory";
import {
  OMPurchaseOrderItem,
  OMDispatchOrderItem,
  OMDispatchOrder,
} from "@/types/order-management";
import { getPoStatusClass } from "@/constants/order-management";

interface OMPurchaseOrderItemsTableProps {
  poId: string;
  items: OMPurchaseOrderItem[];
  dispatches: OMDispatchOrder[];
}

export function OMPurchaseOrderItemsTable({
  poId,
  items,
  dispatches,
}: OMPurchaseOrderItemsTableProps) {
  const [expandedItemId, setExpandedItemId] = useState<string | null>(null);

  const toggleExpand = (itemId: string) => {
    setExpandedItemId(expandedItemId === itemId ? null : itemId);
  };

  const { subtotal, totalGst, grandTotal } = useMemo(() => {
    return {
      subtotal: items?.reduce((sum, item) => sum + (item.amount || 0), 0) || 0,
      totalGst: items?.reduce((sum, item) => sum + (item.gstAmount || 0), 0) || 0,
      grandTotal: items?.reduce((sum, item) => sum + (item.totalAmount || 0), 0) || 0,
    };
  }, [items]);

  return (
    <div className="space-y-4">
      <div className="border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-10"></TableHead>
            <TableHead>Item Details</TableHead>
            <TableHead>Brand</TableHead>
            <TableHead className="text-right">Ordered Qty</TableHead>
            <TableHead className="text-right">Rate</TableHead>
            <TableHead className="text-right">Total (incl. GST)</TableHead>
            <TableHead className="text-right">Dispatched</TableHead>
            <TableHead className="text-right">Remaining</TableHead>
            <TableHead className="text-center w-24">Status</TableHead>
            <TableHead className="text-right w-24">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items?.map((item: OMPurchaseOrderItem) => {
            const dispatchedQty = item.dispatchedQuantity || 0;
            const remainingQty = item.remainingQuantity || 0;
            const status =
              dispatchedQty === 0
                ? "Pending"
                : dispatchedQty >= item.quantity
                  ? "Fulfilled"
                  : "Partial";

            return (
              <React.Fragment key={item.id}>
                <TableRow
                  className="cursor-pointer hover:bg-muted/50 group"
                  onClick={() => toggleExpand(item.id)}
                >
                  <TableCell>
                    {expandedItemId === item.id ? (
                      <ChevronDown className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{item.product?.name}</div>
                    <div className="text-xs text-muted-foreground font-mono">
                      {item.product?.sku}
                    </div>
                    {item.description && (
                      <div className="text-xs text-muted-foreground italic mt-1">
                        {item.description}
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    {item.OMBrand?.name ||
                      (item.product as any)?.brands?.[0]?.name ||
                      "N/A"}
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    {item.quantity}
                  </TableCell>
                  <TableCell className="text-right">
                    ₹
                    {item.rate.toLocaleString("en-IN", {
                      minimumFractionDigits: 2,
                    })}
                  </TableCell>
                  <TableCell className="text-right">
                    ₹
                    {item.totalAmount.toLocaleString("en-IN", {
                      minimumFractionDigits: 2,
                    })}
                  </TableCell>
                  <TableCell className="text-right text-blue-600 font-medium">
                    {dispatchedQty}
                  </TableCell>
                  <TableCell className="text-right text-muted-foreground">
                    {remainingQty}
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge
                      className={
                        status === "Fulfilled"
                          ? "bg-green-100 text-green-800 hover:bg-green-100 border-transparent"
                          : status === "Partial"
                            ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-100 border-transparent"
                            : "bg-gray-100 text-gray-800 hover:bg-gray-100 border-transparent"
                      }
                    >
                      {status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                    {remainingQty > 0 && (
                      <Link
                        href={`/admin/order-management/dispatches/create?poId=${poId}`}
                      >
                        <Button variant="outline" size="sm" className="h-8">
                          <Plus className="h-3 w-3 mr-1" />
                          Dispatch
                        </Button>
                      </Link>
                    )}
                  </TableCell>
                </TableRow>
                {expandedItemId === item.id && (
                  <TableRow className="bg-muted/30">
                    <TableCell colSpan={10} className="p-0">
                      <div className="p-4 border-t border-b bg-white">
                        <div className="mb-2 flex items-center justify-between">
                          <h4 className="text-sm font-semibold text-muted-foreground px-1">
                            Dispatch History for {item.product?.name}
                          </h4>
                        </div>
                        <OMDispatchHistory
                          dispatches={dispatches}
                          poItems={items}
                          itemId={item.id}
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </React.Fragment>
            );
          })}
        </TableBody>
      </Table>
      </div>

      <div className="space-y-2 max-w-md ml-auto p-4">
        <div className="flex justify-between">
          <span className="text-muted-foreground text-sm">Subtotal:</span>
          <span className="font-medium text-sm">
            ₹{subtotal.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground text-sm">Total GST:</span>
          <span className="font-medium text-sm">
            ₹{totalGst.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
          </span>
        </div>
        <div className="flex justify-between pt-2 border-t border-muted-foreground/20">
          <span className="font-bold">Grand Total:</span>
          <span className="font-bold text-lg text-primary">
            ₹{grandTotal.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
          </span>
        </div>
      </div>
    </div>
  );
}
