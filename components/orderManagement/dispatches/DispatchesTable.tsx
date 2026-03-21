"use client";

import { memo, useState } from "react";
import { TableRow, TableCell, TableHead } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Edit, Trash2, ChevronDown, Loader2 } from "lucide-react";
import { format } from "date-fns";
import Link from "next/link";
import { OMDataTable } from "@/components/orderManagement/shared/OMDataTable";
import { OMSortableHeader } from "@/components/orderManagement/shared/OMSortableHeader";
import {
  getDispatchStatusVisuals,
  OM_DISPATCH_STATUS_CONFIG,
  OM_DISPATCH_TYPE_CONFIG,
  type OMDispatchOrder,
  type OMDispatchStatus,
  type OMDispatchType,
} from "@/types/order-management";
import type { SortOption } from "@/components/orderManagement/OMSortControl";
import { formatStatus } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type TableDispatchOrder = OMDispatchOrder & { _totalQty: number };

interface DispatchesTableProps {
  data: TableDispatchOrder[];
  isLoading: boolean;
  sortBy: SortOption;
  onSort: (newSort: SortOption) => void;
  onDelete: (id: string) => void;
  onRowClick: (id: string) => void;
  onStatusChange?: (id: string, newStatus: OMDispatchStatus) => void;
}

export const DispatchesTable = memo(function DispatchesTable({
  data,
  isLoading,
  sortBy,
  onSort,
  onDelete,
  onRowClick,
  onStatusChange,
}: DispatchesTableProps) {
  const [updatingStatusId, setUpdatingStatusId] = useState<string | null>(null);

  return (
    <OMDataTable
      data={data}
      isLoading={isLoading}
      columnCount={9}
      emptyMessage="No dispatch orders found."
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
            title="Total Qty"
            currentSort={sortBy}
            onSort={onSort}
            ascOption="qty_asc"
            descOption="qty_desc"
            className="text-left px-3"
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
            title="Tracking Number"
            currentSort={sortBy}
            onSort={onSort}
            ascOption="tracking_asc"
            descOption="tracking_desc"
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
          <TableHead className="px-3">Type</TableHead>
          <TableHead className="text-right pr-7">Actions</TableHead>
        </TableRow>
      }
      renderRow={(dispatch: TableDispatchOrder) => (
        <TableRow
          key={dispatch.id}
          className="cursor-pointer hover:bg-muted/50"
          onClick={() => onRowClick(dispatch.id)}
        >
          <TableCell className="pr-2">
            {dispatch.dispatchDate ? format(new Date(dispatch.dispatchDate), "dd MMM yyyy") : "N/A"}
          </TableCell>
          <TableCell className="px-3 font-medium">
            <Link href={`/admin/order-management/dispatches/${dispatch.id}`} className="hover:underline">
              {dispatch.invoiceNumber || "N/A"}
            </Link>
          </TableCell>
          <TableCell className="px-3">{dispatch.purchaseOrder?.poNumber || "—"}</TableCell>
          <TableCell className="px-3">{dispatch.purchaseOrder?.client?.name || "—"}</TableCell>
          <TableCell className="text-left px-3">{dispatch.totalQuantity || 0}</TableCell>
          <TableCell className="px-3">{dispatch.logisticsPartner?.name || "N/A"}</TableCell>
          <TableCell className="font-mono text-sm px-3 max-w-32 wrap-break-word">
            {dispatch.docketNumber || "N/A"}
          </TableCell>
          <TableCell className="px-3" onClick={(e) => e.stopPropagation()}>
            {onStatusChange ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    className="inline-flex items-center gap-1.5 cursor-pointer rounded-md transition-opacity hover:opacity-80 focus:outline-none"
                    disabled={updatingStatusId === dispatch.id}
                  >
                    <Badge
                      variant="outline"
                      className={getDispatchStatusVisuals(dispatch.status || "PENDING").color}
                    >
                      {updatingStatusId === dispatch.id && (
                        <Loader2 className="h-3 w-3 animate-spin mr-1" />
                      )}
                      {formatStatus(dispatch.status || "PENDING")}
                    </Badge>
                    <ChevronDown className="h-3 w-3 text-muted-foreground" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="min-w-[180px]">
                  {(Object.entries(OM_DISPATCH_STATUS_CONFIG) as [OMDispatchStatus, { label: string; color: string }][]).map(
                    ([statusKey, config]) => (
                      <DropdownMenuItem
                        key={statusKey}
                        onClick={() => {
                          if (dispatch.status !== statusKey) {
                            setUpdatingStatusId(dispatch.id);
                            onStatusChange(dispatch.id, statusKey);
                            // Clear loading after a short delay (parent handles actual state)
                            setTimeout(() => setUpdatingStatusId(null), 1500);
                          }
                        }}
                        className={`flex items-center gap-2 ${dispatch.status === statusKey ? "font-semibold" : ""}`}
                      >
                        <Badge variant="outline" className={`${config.color} text-xs`}>
                          {config.label}
                        </Badge>
                        {dispatch.status === statusKey && (
                          <span className="ml-auto text-xs text-muted-foreground">✓</span>
                        )}
                      </DropdownMenuItem>
                    )
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Badge
                variant="outline"
                className={getDispatchStatusVisuals(dispatch.status || "PENDING").color}
              >
                {formatStatus(dispatch.status || "PENDING")}
              </Badge>
            )}
          </TableCell>
          <TableCell className="px-3">
            <Badge
              variant="outline"
              className={OM_DISPATCH_TYPE_CONFIG[dispatch.dispatchType || "ORDER"]?.color || ""}
            >
              {OM_DISPATCH_TYPE_CONFIG[dispatch.dispatchType || "ORDER"]?.label || "Order"}
            </Badge>
          </TableCell>
          <TableCell className="text-right pr-2" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-end gap-2">
              <Button variant="ghost" size="icon" asChild>
                <Link href={`/admin/order-management/dispatches/${dispatch.id}`}>
                  <Eye className="h-4 w-4" />
                </Link>
              </Button>
              <Button variant="ghost" size="icon" asChild>
                <Link href={`/admin/order-management/dispatches/${dispatch.id}/edit`}>
                  <Edit className="h-4 w-4" />
                </Link>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="text-destructive h-8 w-8"
                onClick={() => onDelete(dispatch.id)}
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
