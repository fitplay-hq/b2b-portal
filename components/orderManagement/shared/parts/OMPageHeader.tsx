"use client";

import { memo } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Download, ChevronDown, Plus, FileSpreadsheet, FileDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";

interface OMPageHeaderProps {
  title: string;
  description: string;
  onExportExcel?: () => void;
  onExportPDF?: () => void;
  addButton?: {
    label: string;
    href?: string;
    onClick?: () => void;
  };
  children?: React.ReactNode;
  className?: string;
}

export const OMPageHeader = memo(function OMPageHeader({
  title,
  description,
  onExportExcel,
  onExportPDF,
  addButton,
  children,
  className,
}: OMPageHeaderProps) {
  return (
    <div className={cn("flex flex-col md:flex-row md:items-center justify-between gap-4", className)}>
      <div>
        <h1 className="text-2xl font-semibold">{title}</h1>
        <p className="text-muted-foreground">{description}</p>
      </div>
      <div className="flex flex-wrap gap-2">
        {(onExportExcel || onExportPDF) && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export
                <ChevronDown className="h-4 w-4 ml-2" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {onExportExcel && (
                <DropdownMenuItem onClick={onExportExcel}>
                  <FileSpreadsheet className="h-4 w-4 mr-2" />
                  Export to Excel
                </DropdownMenuItem>
              )}
              {onExportPDF && (
                <DropdownMenuItem onClick={onExportPDF}>
                  <FileDown className="h-4 w-4 mr-2" />
                  Export to PDF
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        )}

        {children}

        {addButton && (
          addButton.href ? (
            <Link href={addButton.href}>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                {addButton.label}
              </Button>
            </Link>
          ) : (
            <Button onClick={addButton.onClick}>
              <Plus className="h-4 w-4 mr-2" />
              {addButton.label}
            </Button>
          )
        )}
      </div>
    </div>
  );
});
