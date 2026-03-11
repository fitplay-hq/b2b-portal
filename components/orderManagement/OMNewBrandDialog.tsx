"use client";

import { useState, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Plus, Loader2, Check, ChevronsUpDown, Search } from "lucide-react";
import { toast } from "sonner";
import { OMBrand } from "@/types/order-management";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Command as CommandPrimitive } from "cmdk";
import { cn } from "@/lib/utils";

interface OMNewBrandDialogProps {
  onBrandAdded: (brand: OMBrand) => void;
  trigger?: React.ReactNode;
  productId?: string;
  currentBrandIds?: string[];
  brands: OMBrand[];
}

export function OMNewBrandDialog({
  onBrandAdded,
  trigger,
  productId,
  currentBrandIds = [],
  brands,
}: OMNewBrandDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedBrand, setSelectedBrand] = useState<OMBrand | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const currentFiltered = useMemo(() => {
    if (!search) return brands;
    const q = search.toLowerCase();
    return brands.filter((b) => b.name.toLowerCase().includes(q));
  }, [brands, search]);

  const exactMatch = useMemo(() => 
    brands.find((b) => b.name.toLowerCase() === search.toLowerCase()),
    [brands, search]
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();

    let brandToProcess: OMBrand | null = selectedBrand;

    if (!brandToProcess && search) {
      if (exactMatch) {
        brandToProcess = exactMatch;
      }
    }

    if (!brandToProcess && !search.trim()) return;

    setIsSubmitting(true);
    try {
      let brandResult: OMBrand;

      if (brandToProcess) {
        brandResult = brandToProcess;
      } else {
        const res = await fetch("/api/admin/om/brands", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: search.trim() }),
        });

        if (res.ok) {
          const data = await res.json();
          brandResult = data.data || data;
        } else {
          const err = await res.json();
          toast.error(err.error || "Failed to create brand");
          setIsSubmitting(false);
          return;
        }
      }

      if (productId && brandResult.id) {
        try {
          await fetch(`/api/admin/om/products/${productId}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              brandIds: Array.from(new Set([...currentBrandIds, brandResult.id])),
            }),
          });
        } catch (assocError) {
          console.error("Failed to associate brand with product:", assocError);
        }
      }

      onBrandAdded(brandResult);
      toast.success(
        brandToProcess ? "Brand associated successfully" : "Brand created and associated successfully",
      );
      handleOpenChange(false);
    } catch {
      toast.error("An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      setSearch("");
      setSelectedBrand(null);
      setPopoverOpen(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {trigger || (
          <Button type="button" variant="outline" size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Brand
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Add Brand to Product</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label>Search or Enter Brand Name *</Label>
            <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={popoverOpen}
                  className="w-full justify-between font-normal"
                >
                  <span className="truncate">
                    {selectedBrand ? selectedBrand.name : search || "Select or type brand..."}
                  </span>
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
                <CommandPrimitive shouldFilter={false} className="flex h-full w-full flex-col overflow-hidden rounded-md bg-popover text-popover-foreground">
                  <div className="flex items-center border-b px-3">
                    <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                    <CommandPrimitive.Input
                      value={search}
                      onValueChange={(val) => {
                        setSearch(val);
                        setSelectedBrand(null);
                      }}
                      placeholder="Search brands..."
                      className="flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground"
                    />
                  </div>
                  <CommandPrimitive.List className="max-h-60 overflow-y-auto overflow-x-hidden p-1">
                    {currentFiltered.length === 0 && !search && (
                      <div className="py-6 text-center text-sm text-muted-foreground">
                        No brands found. Type to create.
                      </div>
                    )}
                    {currentFiltered.map((brand: OMBrand) => (
                      <CommandPrimitive.Item
                        key={brand.id}
                        onSelect={() => {
                          setSelectedBrand(brand);
                          setSearch(brand.name);
                          setPopoverOpen(false);
                        }}
                        className="relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none data-[selected=true]:bg-accent data-[selected=true]:text-accent-foreground"
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            selectedBrand?.id === brand.id ? "opacity-100" : "opacity-0",
                          )}
                        />
                        {brand.name}
                      </CommandPrimitive.Item>
                    ))}
                    {search && !exactMatch && (
                      <CommandPrimitive.Item
                        onSelect={() => {
                          setPopoverOpen(false);
                        }}
                        className="relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none text-primary font-medium"
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        Create "{search}"
                      </CommandPrimitive.Item>
                    )}
                  </CommandPrimitive.List>
                </CommandPrimitive>
              </PopoverContent>
            </Popover>
          </div>
          <Button
            type="submit"
            className="w-full"
            disabled={isSubmitting || (!selectedBrand && !search.trim())}
          >
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {selectedBrand || exactMatch ? "Associate Brand" : "Create & Associate Brand"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
