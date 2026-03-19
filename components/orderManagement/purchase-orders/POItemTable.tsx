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
import { PO_STATUS_LABELS, getPoStatusClass } from "@/constants/order-management";

interface POItemTableProps {
  data: any[];
  isLoading: boolean;
  sortBy: SortOption;
  onSort: (newSort: SortOption) => void;
  onDelete: (po: any) => void;
  onRowClick: (poId: string) => void;
}

export const POItemTable = memo(function POItemTable({
  data,
  isLoading,
  sortBy,
  onSort,
  onDelete,
  onRowClick,
}: POItemTableProps) {
  return (
    <OMDataTable
      data={data}
      isLoading={isLoading}
      columnCount={10}
      emptyMessage="No purchase order items found."
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
            title="PO Number"
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
            title="Item"
            currentSort={sortBy}
            onSort={onSort}
            ascOption="name_asc"
            descOption="name_desc"
          />
          <OMSortableHeader
            title="Qty"
            currentSort={sortBy}
            onSort={onSort}
            ascOption="qty_asc"
            descOption="qty_desc"
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
            title="Status"
            currentSort={sortBy}
            onSort={onSort}
            ascOption="status_asc"
            descOption="status_desc"
          />
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      }
      renderRow={(item: any) => (
        <TableRow 
          key={item.id} 
          className="cursor-pointer"
          onClick={() => onRowClick(item.poId)}
        >
          <TableCell>
            {item.poDate ? format(new Date(item.poDate), "dd MMM yyyy") : "N/A"}
          </TableCell>
          <TableCell>
            <div className="font-medium hover:underline">
              {item.poNumber}
            </div>
          </TableCell>
          <TableCell className="truncate max-w-[150px] text-wrap wrap-break-word">
            {item.clientName || "N/A"}
          </TableCell>
          <TableCell className="truncate max-w-[200px] wrap-break-word">
            {item.itemName || "N/A"}
          </TableCell>
          <TableCell className="text-right">
            {item.quantity}
          </TableCell>
          <TableCell className="text-right">
            {item.itemDispatched}
          </TableCell>
          <TableCell className="text-right">
            {item.itemRemaining}
          </TableCell>
          <TableCell>
            <Badge className={getPoStatusClass(item.status)}>
              {PO_STATUS_LABELS[item.status] ?? formatStatus(item.status)}
            </Badge>
          </TableCell>
          <TableCell
            className="text-right"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-end gap-2">
              <Button variant="ghost" size="icon" asChild>
                <Link href={`/admin/order-management/purchase-orders/${item.poId}`}>
                  <Eye className="h-4 w-4" />
                </Link>
              </Button>
              <Button variant="ghost" size="icon" asChild>
                <Link href={`/admin/order-management/purchase-orders/${item.poId}/edit`}>
                  <Edit className="h-4 w-4" />
                </Link>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="text-destructive h-8 w-8"
                onClick={() => onDelete({ id: item.poId, poNumber: item.poNumber })}
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
