"use client";

import { memo } from "react";
import { TableRow, TableCell, TableHead } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import { OMDataTable } from "@/components/orderManagement/shared/OMDataTable";
import { OMSortableHeader } from "@/components/orderManagement/shared/OMSortableHeader";

interface BrandsTableProps {
  data: any[];
  isLoading: boolean;
  sortBy: string;
  onSort: (newSort: string) => void;
  onEdit: (brand: any) => void;
  onDelete: (id: string) => void;
}

export const BrandsTable = memo(function BrandsTable({
  data,
  isLoading,
  sortBy,
  onSort,
  onEdit,
  onDelete,
}: BrandsTableProps) {
  return (
    <OMDataTable
      data={data}
      isLoading={isLoading}
      columnCount={3}
      emptyMessage="No brands found"
      header={
        <TableRow>
          <OMSortableHeader
            title="Brand Name"
            currentSort={sortBy}
            onSort={onSort}
            ascOption="name_asc"
            descOption="name_desc"
          />
          <TableHead>Description</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      }
      renderRow={(brand: any) => (
        <TableRow key={brand.id}>
          <TableCell className="font-medium">{brand.name}</TableCell>
          <TableCell className="max-w-md truncate">{brand.description || "-"}</TableCell>
          <TableCell className="text-right">
            <div className="flex justify-end gap-2">
              <Button variant="ghost" size="sm" onClick={() => onEdit(brand)}>
                <Edit className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={() => onDelete(brand.id)}>
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>
          </TableCell>
        </TableRow>
      )}
    />
  );
});
