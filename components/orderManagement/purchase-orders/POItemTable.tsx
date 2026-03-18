"use client";

import { memo } from "react";
import Link from "next/link";
import { TableRow, TableCell, TableHead } from "@/components/ui/table";
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
  onRowClick: (poId: string) => void;
}

export const POItemTable = memo(function POItemTable({
  data,
  isLoading,
  sortBy,
  onSort,
  onRowClick,
}: POItemTableProps) {
  return (
    <OMDataTable
      data={data}
      isLoading={isLoading}
      columnCount={7}
      emptyMessage="No purchase order items found."
      header={
        <TableRow>
          <OMSortableHeader
            title="Date"
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
          <TableHead>Item</TableHead>
          <TableHead className="text-right">Qty</TableHead>
          <TableHead className="text-right">Value</TableHead>
          <TableHead>Status</TableHead>
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
          <TableCell className="truncate max-w-[150px]">
            {item.clientName || "N/A"}
          </TableCell>
          <TableCell className="truncate max-w-[200px]">
            {item.itemName || "N/A"}
          </TableCell>
          <TableCell className="text-right">
            {item.quantity}
          </TableCell>
          <TableCell className="text-right font-medium">
            ₹{item.totalAmount.toLocaleString("en-IN")}
          </TableCell>
          <TableCell>
            <Badge className={getPoStatusClass(item.status)}>
              {PO_STATUS_LABELS[item.status] ?? formatStatus(item.status)}
            </Badge>
          </TableCell>
        </TableRow>
      )}
    />
  );
});
