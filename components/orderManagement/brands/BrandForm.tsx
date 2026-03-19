"use client";

import { memo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Loader2 } from "lucide-react";

interface BrandFormProps {
  name: string;
  setName: (name: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  isSubmitting: boolean;
  isEdit?: boolean;
}

export const BrandForm = memo(function BrandForm({
  name,
  setName,
  onSubmit,
  isSubmitting,
  isEdit = false,
}: BrandFormProps) {
  return (
    <Card>
      {!isEdit && (
        <CardHeader>
          <CardTitle>Add Brand</CardTitle>
          <CardDescription>
            Create a new brand to assign to items
          </CardDescription>
        </CardHeader>
      )}
      <CardContent className={isEdit ? "pt-4" : ""}>
        <form onSubmit={onSubmit} className="flex items-end gap-4">
          <div className="flex-1 space-y-2">
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
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              !isEdit && <Plus className="mr-2 h-4 w-4" />
            )}
            {isEdit ? "Save Changes" : "Add Brand"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
});
