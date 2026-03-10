"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { OMBrand } from "@/types/order-management";

interface OMNewBrandDialogProps {
  onBrandAdded: (brand: OMBrand) => void;
  trigger?: React.ReactNode;
}

export function OMNewBrandDialog({
  onBrandAdded,
  trigger,
}: OMNewBrandDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/admin/om/brands", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim() }),
      });

      if (res.ok) {
        const data = await res.json();
        // The API returns the brand object directly or wrapped in data.data
        // Based on brands/page.tsx, it seems to be handled locally after fetchBrands
        // But for this component, we'll assume the API returns the created brand
        onBrandAdded(data);
        toast.success("Brand added successfully");
        setIsOpen(false);
        setName("");
      } else {
        const err = await res.json();
        toast.error(err.error || "Failed to add brand");
      }
    } catch {
      toast.error("Failed to add brand");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button type="button" variant="outline" size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add New Brand
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Add New Brand</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="brandName">Brand Name *</Label>
            <Input
              id="brandName"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter brand name"
              maxLength={100}
            />
          </div>
          <Button
            type="submit"
            className="w-full"
            disabled={isSubmitting || !name.trim()}
          >
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Add Brand
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
