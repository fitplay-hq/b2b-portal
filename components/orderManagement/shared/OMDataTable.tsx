"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface OMDataTableProps<T> {
  data: T[];
  isLoading: boolean;
  header: React.ReactNode;
  renderRow: (item: T, index: number) => React.ReactNode;
  columnCount: number;
  emptyMessage?: string;
  skeletonRows?: number;
  title?: string;
  subtitle?: string;
  className?: string; // For the outer card
  tableWrapperClassName?: string; // For the div with border
}

export function OMDataTable<T>({
  data,
  isLoading,
  header,
  renderRow,
  columnCount,
  emptyMessage = "No data found.",
  skeletonRows = 5,
  title,
  subtitle,
  className,
  tableWrapperClassName,
}: OMDataTableProps<T>) {
  return (
    <Card className={cn("shadow-sm", className)}>
      {(title || subtitle) && (
        <CardHeader className="gap-1">
          {title && <CardTitle className="pl-1">{title}</CardTitle>}
          {subtitle && <CardDescription className="text-xs pl-1">{subtitle}</CardDescription>}
        </CardHeader>
      )}
      <CardContent className={cn(!title && !subtitle && "")}>
        <div className={cn("border rounded-lg overflow-hidden", tableWrapperClassName)}>
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
                    {emptyMessage}
                  </TableCell>
                </TableRow>
              ) : (
                data.map((item, index) => renderRow(item, index))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
