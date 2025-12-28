"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, Upload, Package, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { BulkInventoryDialog } from "./bulk-inventory-dialog";
import { BulkUploadButton } from "./bulk-upload-button";
import { Prisma } from "@/lib/generated/prisma";

export function BulkActionsDropdown() {
  const [isLoading, setIsLoading] = useState(false);
  const [showInventoryDialog, setShowInventoryDialog] = useState(false);

  // Handle bulk product upload
  const handleBulkProductUpload = async (products: any[]) => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(products),
      });

      if (!response.ok) {
        throw new Error("Failed to create products");
      }

      toast.success(`${products.length} products created successfully`);
    } catch (error) {
      toast.error("Failed to create products");
      console.error("Bulk product creation error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBulkInventoryClick = () => {
    // Open the bulk inventory update dialog
    setShowInventoryDialog(true);
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" disabled={isLoading} className="text-sm h-9 w-full sm:w-auto min-w-[100px]" size="sm">
            {isLoading ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <>
                <span className="hidden md:inline">Bulk Actions</span>
                <span className="md:hidden">Bulk</span>
                <ChevronDown className="h-4 w-4 ml-2" />
              </>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem asChild>
            <BulkUploadButton<Prisma.ProductCreateInput[]>
              onUpload={handleBulkProductUpload}
            />
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleBulkInventoryClick}>
            <Package className="h-4 w-4 mr-2" />
            Bulk Update Inventory
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Bulk Inventory Dialog */}
      <BulkInventoryDialog
        isOpen={showInventoryDialog}
        onClose={() => setShowInventoryDialog(false)}
      />
    </>
  );
}
