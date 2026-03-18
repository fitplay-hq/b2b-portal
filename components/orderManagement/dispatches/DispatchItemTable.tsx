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
import { getDispatchStatusVisuals } from "@/types/order-management";

interface DispatchItemTableProps {
  data: any[];
  isLoading: boolean;
  sortBy: SortOption;
  onSort: (newSort: SortOption) => void;
  onRowClick: (dispatchId: string) => void;
}

export const DispatchItemTable = memo(function DispatchItemTable({
  data,
  isLoading,
  sortBy,
  onSort,
  onRowClick,
}: DispatchItemTableProps) {
  return (
    <OMDataTable
      data={data}
      isLoading={isLoading}
      columnCount={7}
      emptyMessage="No dispatch items found."
      header={
        <TableRow>
          <OMSortableHeader
            title="Date"
            currentSort={sortBy}
            onSort={onSort}
            ascOption="dispatch_date_asc"
            descOption="dispatch_date_desc"
          />
          <OMSortableHeader
            title="Invoice #"
            currentSort={sortBy}
            onSort={onSort}
            ascOption="inv_number_asc"
            descOption="inv_number_desc"
          />
          <OMSortableHeader
            title="PO #"
            currentSort={sortBy}
            onSort={onSort}
            ascOption="po_num_asc"
            descOption="po_num_desc"
          />
          <OMSortableHeader
            title="Client"
            currentSort={sortBy}
            onSort={onSort}
            ascOption="name_asc"
            descOption="name_desc"
          />
          <TableHead>Item</TableHead>
          <TableHead className="text-right">Qty</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      }
      renderRow={(item: any) => (
        <TableRow 
          key={item.uniqueKey} 
          className="cursor-pointer"
          onClick={() => onRowClick(item.dispatchId)}
        >
          <TableCell>
            {item.dispatchDate ? format(new Date(item.dispatchDate), "dd MMM yyyy") : "N/A"}
          </TableCell>
          <TableCell>
            <div className="font-medium hover:underline">
              {item.invoiceNumber || "N/A"}
            </div>
          </TableCell>
          <TableCell>
            {item.poNumber || "N/A"}
          </TableCell>
          <TableCell className="truncate max-w-[150px]">
            {item.clientName || "N/A"}
          </TableCell>
          <TableCell className="truncate max-w-[200px]">
            {item.itemName || "N/A"}
          </TableCell>
          <TableCell className="text-right font-medium text-blue-600">
            {item.dispatchQty}
          </TableCell>
          <TableCell>
            <Badge 
              variant="outline"
              className={getDispatchStatusVisuals(item.status || "PENDING").color}
            >
              {formatStatus(item.status || "PENDING")}
            </Badge>
          </TableCell>
        </TableRow>
      )}
    />
  );
});
