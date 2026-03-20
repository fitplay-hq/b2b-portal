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
import { format } from "date-fns";
import { OMSortableHeader } from "./shared/OMSortableHeader";

interface OMPurchaseOrderListTableProps {
  purchaseOrders: OMPurchaseOrder[];
  onDeleteRequest: (po: OMPurchaseOrder) => void;
  sortBy: string;
  onSort: (val: string) => void;
}

export function OMPurchaseOrderListTable({
  purchaseOrders,
  onDeleteRequest,
  sortBy,
  onSort,
}: OMPurchaseOrderListTableProps) {
  const router = useRouter();
  return (
    <div className="border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <OMSortableHeader
              title="PO Date"
              currentSort={sortBy}
              onSort={onSort}
              ascOption="po_date_asc"
              descOption="po_date_desc"
            />
            <OMSortableHeader
              title="PO / Estimate"
              currentSort={sortBy}
              onSort={onSort}
              ascOption="po_number_asc"
              descOption="po_number_desc"
            />
            <OMSortableHeader
              title="Client"
              currentSort={sortBy}
              onSort={onSort}
              ascOption="client_asc"
              descOption="client_desc"
            />
            <OMSortableHeader
              title="Total Ordered"
              currentSort={sortBy}
              onSort={onSort}
              ascOption="ordered_asc"
              descOption="ordered_desc"
              className="text-right"
            />
            <OMSortableHeader
              title="Dispatched"
              currentSort={sortBy}
              onSort={onSort}
              ascOption="dispatched_asc"
              descOption="dispatched_desc"
              className="text-right"
            />
            <OMSortableHeader
              title="Remaining"
              currentSort={sortBy}
              onSort={onSort}
              ascOption="remaining_asc"
              descOption="remaining_desc"
              className="text-right"
            />
            <OMSortableHeader
              title="Total Value"
              currentSort={sortBy}
              onSort={onSort}
              ascOption="value_asc"
              descOption="value_desc"
              className="text-right"
            />
            <OMSortableHeader
              title="Status"
              currentSort={sortBy}
              onSort={onSort}
              ascOption="status_asc"
              descOption="status_desc"
            />
            <TableHead className="text-right w-[100px] pr-7">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {purchaseOrders.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={8}
                className="text-center py-8 text-muted-foreground"
              >
                No purchase orders found.
              </TableCell>
            </TableRow>
          ) : (
            purchaseOrders.map((po) => {
              const totalQty = po.totalQuantity || 0;
              const totalDispatched = po.dispatchedQuantity || 0;
              const totalRemaining = po.remainingQuantity || 0;
              const totalAmount = po.grandTotal || 0;

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
                    {po.poDate ? format(po.poDate, "dd MMM yyyy") : "N/A"}
                  </TableCell>
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
                  <TableCell className="text-right">{totalQty}</TableCell>
                  <TableCell className="text-right">{totalDispatched}</TableCell>
                  <TableCell className="text-right">{totalRemaining}</TableCell>
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
