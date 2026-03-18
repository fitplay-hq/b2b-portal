"use client";

import { memo } from "react";
import Link from "next/link";
import { TableRow, TableCell, TableHead } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Eye, Edit, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { OMDataTable } from "@/components/orderManagement/shared/OMDataTable";
import { OMSortableHeader } from "@/components/orderManagement/shared/OMSortableHeader";
import { format } from "date-fns";
import { formatStatus } from "@/lib/utils";
import type { SortOption } from "@/components/orderManagement/OMSortControl";

interface POTableProps {
  data: any[];
  isLoading: boolean;
  sortBy: SortOption;
  onSort: (newSort: SortOption) => void;
  onDelete: (po: any) => void;
  onRowClick: (po: any) => void;
}

export const POTable = memo(function POTable({
  data,
  isLoading,
  sortBy,
  onSort,
  onDelete,
  onRowClick,
}: POTableProps) {
  return (
    <OMDataTable
      data={data}
      isLoading={isLoading}
      columnCount={9}
      emptyMessage="No purchase orders found."
      onRowClick={onRowClick}
      header={
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
          <TableHead className="text-right">Ordered</TableHead>
          <TableHead className="text-right">Dispatched</TableHead>
          <TableHead className="text-right">Remaining</TableHead>
          <TableHead className="text-right">Total Value</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      }
      renderRow={(po: any) => (
        <TableRow key={po.id}>
          <TableCell>
            {po.poDate ? format(new Date(po.poDate), "dd MMM yyyy") : "N/A"}
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
          <TableCell className="text-right">{po._totalQty}</TableCell>
          <TableCell className="text-right">{po._totalDispatched}</TableCell>
          <TableCell className="text-right">{po._totalRemaining}</TableCell>
          <TableCell className="text-right font-medium">
            ₹{po._totalAmount.toLocaleString("en-IN")}
          </TableCell>
          <TableCell>
            <Badge
              className={
                po.status === "DRAFT"
                  ? "bg-gray-100 text-gray-800"
                  : po.status === "CONFIRMED"
                    ? "bg-blue-100 text-blue-800"
                    : po.status === "PARTIALLY_DISPATCHED"
                      ? "bg-yellow-100 text-yellow-800"
                      : po.status === "FULLY_DISPATCHED"
                        ? "bg-green-100 text-green-800"
                        : po.status === "CLOSED"
                          ? "bg-red-100 text-red-800"
                          : "bg-gray-100 text-gray-800"
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
              <Button variant="ghost" size="icon" asChild>
                <Link href={`/admin/order-management/purchase-orders/${po.id}`}>
                  <Eye className="h-4 w-4" />
                </Link>
              </Button>
              <Button variant="ghost" size="icon" asChild>
                <Link href={`/admin/order-management/purchase-orders/${po.id}/edit`}>
                  <Edit className="h-4 w-4" />
                </Link>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="text-destructive h-8 w-8"
                onClick={() => onDelete(po)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </TableCell>
        </TableRow>
      )}
    />
  );
});
