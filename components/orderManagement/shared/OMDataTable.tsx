"use client";

import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { Inbox } from "lucide-react";

interface OMDataTableProps<T> {
  /** Array of data items to render */
  data: T[];
  /** Shows skeleton loading state when true */
  isLoading: boolean;
  /** Table header content (usually a <TableRow> with <TableHead> or <OMSortableHeader> elements) */
  header: React.ReactNode;
  /** Render function for each data row — return a <TableRow> */
  renderRow: (item: T, index: number) => React.ReactNode;
  /** Number of columns (used for skeleton & empty state colSpan) */
  columnCount: number;
  /** Message shown when data is empty */
  emptyMessage?: string;
  /** Icon shown above the empty message */
  emptyIcon?: React.ReactNode;
  /** Number of skeleton rows to show during loading */
  skeletonRows?: number;
  /** Optional card title */
  title?: string;
  /** Optional card subtitle */
  subtitle?: string;
  /** className for the outer Card */
  className?: string;
  /** className for the table wrapper div */
  tableWrapperClassName?: string;
  /** Row click handler — auto-adds cursor-pointer + hover styling */
  onRowClick?: (item: T, index: number) => void;
  /** Additional className applied to every data row */
  rowClassName?: string;
}

export function OMDataTable<T>({
  data,
  isLoading,
  header,
  renderRow,
  columnCount,
  emptyMessage = "No data found.",
  emptyIcon,
  skeletonRows = 5,
  title,
  subtitle,
  className,
  tableWrapperClassName,
  onRowClick,
  rowClassName,
}: OMDataTableProps<T>) {
  const wrapRow = (item: T, index: number) => {
    const row = renderRow(item, index);
    if (!onRowClick && !rowClassName) return row;

    // Clone the rendered TableRow to inject onClick and className
    if (React.isValidElement(row)) {
      const existingClassName = (row.props as any).className || "";
      const clickableClass = onRowClick
        ? "cursor-pointer hover:bg-muted/50"
        : "";
      return React.cloneElement(row as React.ReactElement<any>, {
        onClick: (e: React.MouseEvent) => {
          // Call existing onClick if any
          (row.props as any).onClick?.(e);
          onRowClick?.(item, index);
        },
        className: cn(existingClassName, clickableClass, rowClassName),
      });
    }
    return row;
  };

  return (
    <div
      className={cn(
        "border rounded-lg overflow-hidden",
        tableWrapperClassName,
      )}
    >
      <Table>
        <TableHeader>{header}</TableHeader>
        <TableBody>
          {isLoading ? (
            [...Array(skeletonRows)].map((_, i) => (
              <TableRow key={i}>
                {[...Array(columnCount)].map((_, j) => (
                  <TableCell key={j}>
                    <Skeleton className="h-4 w-full" />
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : data.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={columnCount}
                className="text-center py-12 text-muted-foreground"
              >
                <div className="flex flex-col items-center gap-2">
                  {emptyIcon || (
                    <Inbox className="h-8 w-8 text-muted-foreground/50" />
                  )}
                  {emptyMessage}
                </div>
              </TableCell>
            </TableRow>
          ) : (
            data.map((item, index) => wrapRow(item, index))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
