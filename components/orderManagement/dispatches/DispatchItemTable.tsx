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
import { getDispatchStatusVisuals } from "@/types/order-management";

interface DispatchItemTableProps {
  data: any[];
  isLoading: boolean;
  sortBy: SortOption;
  onSort: (newSort: SortOption) => void;
  onDelete: (id: string) => void;
  onRowClick: (dispatchId: string) => void;
}

export const DispatchItemTable = memo(function DispatchItemTable({
  data,
  isLoading,
  sortBy,
  onSort,
  onDelete,
  onRowClick,
}: DispatchItemTableProps) {
  return (
    <OMDataTable
      data={data}
      isLoading={isLoading}
      columnCount={9}
      emptyMessage="No dispatch items found."
      header={
        <TableRow>
          <OMSortableHeader
            title="Date"
            currentSort={sortBy}
            onSort={onSort}
            ascOption="dispatch_date_asc"
            descOption="dispatch_date_desc"
            className="pr-2"
          />
          <OMSortableHeader
            title="Invoice Number"
            currentSort={sortBy}
            onSort={onSort}
            ascOption="inv_number_asc"
            descOption="inv_number_desc"
            className="px-3"
          />
          <OMSortableHeader
            title="PO / Estimate"
            currentSort={sortBy}
            onSort={onSort}
            ascOption="po_num_asc"
            descOption="po_num_desc"
            className="px-3"
          />
          <OMSortableHeader
            title="Client"
            currentSort={sortBy}
            onSort={onSort}
            ascOption="name_asc"
            descOption="name_desc"
            className="px-3"
          />
          <OMSortableHeader
            title="Item"
            currentSort={sortBy}
            onSort={onSort}
            ascOption="name_asc"
            descOption="name_desc"
            className="px-3"
          />
          <OMSortableHeader
            title="Qty"
            currentSort={sortBy}
            onSort={onSort}
            ascOption="qty_asc"
            descOption="qty_desc"
            className="text-right px-3"
          />
          <OMSortableHeader
            title="Courier"
            currentSort={sortBy}
            onSort={onSort}
            ascOption="courier_asc"
            descOption="courier_desc"
            className="px-3"
          />
          <OMSortableHeader
            title="Status"
            currentSort={sortBy}
            onSort={onSort}
            ascOption="status_asc"
            descOption="status_desc"
            className="px-3"
          />
          <TableHead className="text-right pr-7">Actions</TableHead>
        </TableRow>
      }
      renderRow={(item: any) => (
        <TableRow 
          key={item.uniqueKey} 
          className="cursor-pointer"
          onClick={() => onRowClick(item.dispatchId)}
        >
          <TableCell className="pr-2">
            {item.dispatchDate ? format(new Date(item.dispatchDate), "dd MMM yyyy") : "N/A"}
          </TableCell>
          <TableCell className="px-3">
            <div className="font-medium hover:underline">
              {item.invoiceNumber || "N/A"}
            </div>
          </TableCell>
          <TableCell className="px-3">
            {item.poNumber || "N/A"}
          </TableCell>
          <TableCell className="truncate max-w-[150px] px-3">
            {item.clientName || "N/A"}
          </TableCell>
          <TableCell className="truncate max-w-[200px] px-3">
            {item.itemName || "N/A"}
          </TableCell>
          <TableCell className="text-right font-medium px-3">
            {item.dispatchQty}
          </TableCell>
          <TableCell className="px-3">
            {item.courierName || "N/A"}
          </TableCell>
          <TableCell className="px-3">
            <Badge 
              variant="outline"
              className={getDispatchStatusVisuals(item.status || "PENDING").color}
            >
              {formatStatus(item.status || "PENDING")}
            </Badge>
          </TableCell>
          <TableCell
            className="text-right pr-2"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-end gap-2">
              <Button variant="ghost" size="icon" asChild>
                <Link href={`/admin/order-management/dispatches/${item.dispatchId}`}>
                  <Eye className="h-4 w-4" />
                </Link>
              </Button>
              <Button variant="ghost" size="icon" asChild>
                <Link href={`/admin/order-management/dispatches/${item.dispatchId}/edit`}>
                  <Edit className="h-4 w-4" />
                </Link>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="text-destructive h-8 w-8"
                onClick={() => onDelete(item.dispatchId)}
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
