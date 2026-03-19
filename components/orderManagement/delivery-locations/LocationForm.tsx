"use client";

import { memo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MapPin, Loader2, Plus } from "lucide-react";

interface LocationFormProps {
  name: string;
  setName: (name: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  isSubmitting: boolean;
  isEdit?: boolean;
  onCancel?: () => void;
}

export const LocationForm = memo(function LocationForm({
  name,
  setName,
  onSubmit,
  isSubmitting,
  isEdit = false,
  onCancel,
}: LocationFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-4 pt-4">
      <div className="space-y-2">
        <Label htmlFor="locationName">City Name *</Label>
        <div className="relative">
          <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            id="locationName"
            required
            className="pl-9"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Mumbai, Bangalore"
            maxLength={100}
          />
        </div>
      </div>
      <div className="flex justify-end gap-2">
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
          >
            Cancel
          </Button>
        )}
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            !isEdit && <Plus className="mr-2 h-4 w-4" />
          )}
          {isEdit ? "Save Changes" : "Add Location"}
        </Button>
      </div>
    </form>
  );
});
