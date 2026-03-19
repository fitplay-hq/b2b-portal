"use client";

import { memo } from "react";
import { TableRow, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, Eye, Truck } from "lucide-react";
import { OMDataTable } from "@/components/orderManagement/shared/OMDataTable";
import { OMSortableHeader } from "@/components/orderManagement/shared/OMSortableHeader";

interface PartnersTableProps {
  data: any[];
  isLoading: boolean;
  sortBy: string;
  onSort: (newSort: string) => void;
  onEdit: (partner: any) => void;
  onDelete: (id: string) => void;
  onView: (partner: any) => void;
}

export const PartnersTable = memo(function PartnersTable({
  data,
  isLoading,
  sortBy,
  onSort,
  onEdit,
  onDelete,
  onView,
}: PartnersTableProps) {
  return (
    <OMDataTable
      data={data}
      isLoading={isLoading}
      columnCount={5}
      emptyMessage="No logistics partners found"
      onRowClick={onView}
      header={
        <TableRow>
          <OMSortableHeader
            title="Partner Name"
            currentSort={sortBy}
            onSort={onSort}
            ascOption="name_asc"
            descOption="name_desc"
          />
          <OMSortableHeader
            title="Contact Person"
            currentSort={sortBy}
            onSort={onSort}
            ascOption="contact_asc"
            descOption="contact_desc"
          />
          <OMSortableHeader
            title="Phone"
            currentSort={sortBy}
            onSort={onSort}
            ascOption="phone_asc"
            descOption="phone_desc"
          />
          <OMSortableHeader
            title="Email"
            currentSort={sortBy}
            onSort={onSort}
            ascOption="email_asc"
            descOption="email_desc"
          />
          <TableCell className="text-right">Actions</TableCell>
        </TableRow>
      }
      renderRow={(partner: any) => (
        <TableRow key={partner.id}>
          <TableCell>
            <div className="flex items-center gap-2">
              <Truck className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">{partner.name}</span>
            </div>
          </TableCell>
          <TableCell>{partner.contactPerson || "-"}</TableCell>
          <TableCell>{partner.phone || "-"}</TableCell>
          <TableCell>{partner.email || "-"}</TableCell>
          <TableCell className="text-right">
            <div className="flex justify-end gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onView(partner);
                }}
              >
                <Eye className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(partner);
                }}
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(partner.id);
                }}
                className="text-destructive hover:text-destructive"
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
