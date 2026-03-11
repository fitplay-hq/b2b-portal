"use client";

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
import { Plus } from "lucide-react";
import Link from "next/link";
import {
  OMPurchaseOrderItem,
  OMDispatchOrderItem,
  OMDispatchOrder,
} from "@/types/order-management";

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
  return (
    <div className="border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
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
            const dispatchedQty =
              dispatches?.reduce((sum: number, d) => {
                const dispatchItem = d.items?.find(
                  (di: OMDispatchOrderItem) =>
                    di.purchaseOrderItemId === item.id,
                );
                return sum + (dispatchItem?.quantity || 0);
              }, 0) || 0;

            const remainingQty = Math.max(0, item.quantity - dispatchedQty);
            const status =
              dispatchedQty === 0
                ? "Pending"
                : dispatchedQty >= item.quantity
                  ? "Fulfilled"
                  : "Partial";

            return (
              <TableRow key={item.id}>
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
                <TableCell className="text-right">
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
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
