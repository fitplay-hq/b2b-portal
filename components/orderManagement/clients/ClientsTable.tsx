"use client";

import { memo } from "react";
import { TableRow, TableCell, TableHead } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, Eye } from "lucide-react";
import { OMDataTable } from "@/components/orderManagement/shared/OMDataTable";
import { OMSortableHeader } from "@/components/orderManagement/shared/OMSortableHeader";

interface ClientsTableProps {
  data: any[];
  isLoading: boolean;
  sortBy: string;
  onSort: (newSort: string) => void;
  onEdit: (client: any) => void;
  onDelete: (id: string) => void;
  onView: (client: any) => void;
  onRowClick?: (client: any) => void;
}

export const ClientsTable = memo(function ClientsTable({
  data,
  isLoading,
  sortBy,
  onSort,
  onEdit,
  onDelete,
  onView,
  onRowClick,
}: ClientsTableProps) {
  return (
    <OMDataTable
      data={data}
      isLoading={isLoading}
      columnCount={6}
      emptyMessage="No clients found"
      onRowClick={onView}
      header={
        <TableRow>
          <OMSortableHeader
            title="Client Name"
            currentSort={sortBy}
            onSort={onSort}
            ascOption="name_asc"
            descOption="name_desc"
          />
          <TableHead>Contact Person</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Phone</TableHead>
          <TableHead>GST Number</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      }
      renderRow={(client: any) => (
        <TableRow key={client.id}>
          <TableCell>{client.name}</TableCell>
          <TableCell>{client.contactPerson || "-"}</TableCell>
          <TableCell>{client.email || "-"}</TableCell>
          <TableCell>{client.phone || "-"}</TableCell>
          <TableCell>{client.gstNumber || "-"}</TableCell>
          <TableCell className="text-right">
            <div className="flex justify-end gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onView(client);
                }}
              >
                <Eye className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(client);
                }}
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(client.id);
                }}
              >
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>
          </TableCell>
        </TableRow>
      )}
    />
  );
});
