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
import { Edit } from "lucide-react";

interface PartnerViewDialogProps {
  partner: any | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onEdit: (partner: any) => void;
}

export const PartnerViewDialog = memo(function PartnerViewDialog({
  partner,
  isOpen,
  onOpenChange,
  onEdit,
}: PartnerViewDialogProps) {
  if (!partner) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>View Logistics Partner Details</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1 col-span-2">
              <Label className="text-xs text-muted-foreground">Partner Name</Label>
              <div className="font-medium text-sm">{partner.name}</div>
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">Contact Person</Label>
              <div className="text-sm">{partner.contactPerson || "-"}</div>
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">Phone</Label>
              <div className="text-sm">{partner.phone || "-"}</div>
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">Email</Label>
              <div className="text-sm">{partner.email || "-"}</div>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Close
            </Button>
            <Button
              onClick={() => {
                onOpenChange(false);
                onEdit(partner);
              }}
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit Partner
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
});
