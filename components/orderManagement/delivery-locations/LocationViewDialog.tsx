"use client";
import { memo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Edit, MapPin } from "lucide-react";

interface LocationViewDialogProps {
  location: any | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onEdit: (location: any) => void;
}

export const LocationViewDialog = memo(function LocationViewDialog({
  location,
  isOpen,
  onOpenChange,
  onEdit,
}: LocationViewDialogProps) {
  if (!location) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-muted-foreground" />
            View Delivery Location
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">Location / City Name</Label>
            <div className="font-medium text-sm">{location.name}</div>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Close
            </Button>
            <Button
              onClick={() => {
                onOpenChange(false);
                onEdit(location);
              }}
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit Location
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
});
