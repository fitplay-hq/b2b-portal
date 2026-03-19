"use client";

import { memo } from "react";
import { TableRow, TableCell, TableHead } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, MapPin, Eye } from "lucide-react";
import { OMDataTable } from "@/components/orderManagement/shared/OMDataTable";
import { OMSortableHeader } from "@/components/orderManagement/shared/OMSortableHeader";

interface LocationsTableProps {
  data: any[];
  isLoading: boolean;
  sortBy: string;
  onSort: (newSort: string) => void;
  onEdit: (location: any) => void;
  onDelete: (id: string) => void;
  onView: (location: any) => void;
  onRowClick?: (location: any) => void;
}

export const LocationsTable = memo(function LocationsTable({
  data,
  isLoading,
  sortBy,
  onSort,
  onEdit,
  onDelete,
  onView,
  onRowClick,
}: LocationsTableProps) {
  return (
    <OMDataTable
      data={data}
      isLoading={isLoading}
      columnCount={2}
      emptyMessage="No delivery locations found."
      onRowClick={onView}
      header={
        <TableRow>
          <OMSortableHeader
            title="Location / City Name"
            currentSort={sortBy}
            onSort={onSort}
            ascOption="name_asc"
            descOption="name_desc"
          />
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      }
      renderRow={(location: any) => (
        <TableRow key={location.id} className="group">
          <TableCell className="font-medium">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
              {location.name}
            </div>
          </TableCell>
          <TableCell className="text-right flex justify-end gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onView(location);
              }}
            >
              <Eye className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onEdit(location);
              }}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(location.id);
              }}
              className="text-destructive hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </TableCell>
        </TableRow>
      )}
    />
  );
});
