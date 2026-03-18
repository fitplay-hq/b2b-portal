"use client";

import { memo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
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

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2 col-span-2">
              <Label>Partner Name</Label>
              <Input
                value={partner.name}
                readOnly
                className="bg-muted"
              />
            </div>
            <div className="space-y-2">
              <Label>Contact Person</Label>
              <Input
                value={partner.contactPerson || "-"}
                readOnly
                className="bg-muted"
              />
            </div>
            <div className="space-y-2">
              <Label>Phone</Label>
              <Input
                value={partner.phone || "-"}
                readOnly
                className="bg-muted"
              />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input
                value={partner.email || "-"}
                readOnly
                className="bg-muted"
              />
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
