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
import { Eye, Edit, Trash2 } from "lucide-react";
import { formatStatus } from "@/lib/utils";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { OMPurchaseOrder, OMPurchaseOrderItem } from "@/types/order-management";

interface OMPurchaseOrderListTableProps {
  purchaseOrders: OMPurchaseOrder[];
  onDeleteRequest: (po: OMPurchaseOrder) => void;
}

export function OMPurchaseOrderListTable({
  purchaseOrders,
  onDeleteRequest,
}: OMPurchaseOrderListTableProps) {
  const router = useRouter();
  return (
    <div className="border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>PO / Estimate</TableHead>
            <TableHead>Client</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="text-right">Qty</TableHead>
            <TableHead className="text-right">Amount</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {purchaseOrders.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={7}
                className="text-center py-8 text-muted-foreground"
              >
                No purchase orders found.
              </TableCell>
            </TableRow>
          ) : (
            purchaseOrders.map((po) => {
              const totalQty =
                po.items?.reduce(
                  (sum: number, i: OMPurchaseOrderItem) => sum + i.quantity,
                  0,
                ) || 0;
              const totalAmount =
                po.items?.reduce(
                  (sum: number, i: OMPurchaseOrderItem) => sum + i.totalAmount,
                  0,
                ) || 0;

              return (
                <TableRow
                  key={po.id}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() =>
                    router.push(
                      `/admin/order-management/purchase-orders/${po.id}`,
                    )
                  }
                >
                  <TableCell>
                    <div className="font-medium">
                      {po.poNumber || po.estimateNumber}
                    </div>
                    {po.poNumber && po.estimateNumber && (
                      <div className="text-xs text-muted-foreground">
                        Est: {po.estimateNumber}
                      </div>
                    )}
                  </TableCell>
                  <TableCell>{po.client?.name || "N/A"}</TableCell>
                  <TableCell>
                    {po.poDate
                      ? new Date(po.poDate).toLocaleDateString()
                      : po.estimateDate
                        ? new Date(po.estimateDate).toLocaleDateString()
                        : po.createdAt
                          ? new Date(po.createdAt).toLocaleDateString()
                          : "N/A"}
                  </TableCell>
                  <TableCell className="text-right">{totalQty}</TableCell>
                  <TableCell className="text-right font-medium">
                    ₹
                    {totalAmount.toLocaleString("en-IN", {
                      minimumFractionDigits: 2,
                    })}
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={
                        po.status === "DRAFT"
                          ? "bg-gray-100 text-gray-800 hover:bg-gray-100 border-transparent line-clamp-1"
                          : po.status === "CONFIRMED"
                            ? "bg-blue-100 text-blue-800 hover:bg-blue-100 border-transparent line-clamp-1"
                            : po.status === "PARTIALLY_DISPATCHED"
                              ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-100 border-transparent line-clamp-1"
                              : po.status === "FULLY_DISPATCHED"
                                ? "bg-green-100 text-green-800 hover:bg-green-100 border-transparent line-clamp-1"
                                : po.status === "CLOSED"
                                  ? "bg-red-100 text-red-800 hover:bg-red-100 border-transparent line-clamp-1"
                                  : "bg-gray-100 text-gray-800 hover:bg-gray-100 border-transparent line-clamp-1"
                      }
                    >
                      {formatStatus(po.status)}
                    </Badge>
                  </TableCell>
                  <TableCell
                    className="text-right"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        asChild
                        title="View Details"
                      >
                        <Link
                          href={`/admin/order-management/purchase-orders/${po.id}`}
                        >
                          <Eye className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        asChild
                        title="Edit PO"
                      >
                        <Link
                          href={`/admin/order-management/purchase-orders/${po.id}/edit`}
                        >
                          <Edit className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                        onClick={() => onDeleteRequest(po)}
                        title="Delete PO"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </div>
  );
}
