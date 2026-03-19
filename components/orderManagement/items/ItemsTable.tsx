"use client";

import { memo } from "react";
import { TableRow, TableCell, TableHead } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, Eye } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { OMDataTable } from "@/components/orderManagement/shared/OMDataTable";
import { OMSortableHeader } from "@/components/orderManagement/shared/OMSortableHeader";
import type { SortOption } from "@/components/orderManagement/OMSortControl";

interface ItemsTableProps {
  data: any[];
  isLoading: boolean;
  sortBy: SortOption;
  onSort: (newSort: SortOption) => void;
  onEdit: (item: any) => void;
  onDelete: (id: string) => void;
  onView: (item: any) => void;
}

export const ItemsTable = memo(function ItemsTable({
  data,
  isLoading,
  sortBy,
  onSort,
  onEdit,
  onDelete,
  onView,
}: ItemsTableProps) {
  return (
    <OMDataTable
      data={data}
      isLoading={isLoading}
      columnCount={6}
      emptyMessage="No items found."
      onRowClick={onView}
      header={
        <TableRow>
          <OMSortableHeader
            title="Item"
            currentSort={sortBy}
            onSort={onSort}
            ascOption="name_asc"
            descOption="name_desc"
          />
          <OMSortableHeader
            title="Brand"
            currentSort={sortBy}
            onSort={onSort}
            ascOption="brand_asc"
            descOption="brand_desc"
          />
          <OMSortableHeader
            title="SKU"
            currentSort={sortBy}
            onSort={onSort}
            ascOption="sku_asc"
            descOption="sku_desc"
          />
          <OMSortableHeader
            title="Rate"
            currentSort={sortBy}
            onSort={onSort}
            ascOption="rate_asc"
            descOption="rate_desc"
          />
          <OMSortableHeader
            title="GST %"
            currentSort={sortBy}
            onSort={onSort}
            ascOption="gst_asc"
            descOption="gst_desc"
          />
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      }
      renderRow={(item: any) => (
        <TableRow key={item.id}>
          <TableCell className="font-medium">{item.name}</TableCell>
          <TableCell>
            <div className="flex flex-wrap gap-1">
              {item.brands && item.brands.length > 0 ? (
                item.brands.map((b: any) => (
                  <Badge key={b.id} variant="secondary" className="text-[10px] px-1 py-0 h-4">
                    {b.name}
                  </Badge>
                ))
              ) : (
                <span className="text-muted-foreground">-</span>
              )}
            </div>
          </TableCell>
          <TableCell className="font-mono text-[10px]">{item.sku || "-"}</TableCell>
          <TableCell>{item.price ? `₹${item.price.toLocaleString("en-IN")}` : "-"}</TableCell>
          <TableCell>{item.defaultGstPct}%</TableCell>
          <TableCell className="text-right">
            <div className="flex justify-end gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={(e) => {
                  e.stopPropagation();
                  onView(item);
                }}
              >
                <Eye className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(item);
                }}
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-destructive"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(item.id);
                }}
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
