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

interface ClientViewDialogProps {
  client: any | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onEdit: (client: any) => void;
}

export const ClientViewDialog = memo(function ClientViewDialog({
  client,
  isOpen,
  onOpenChange,
  onEdit,
}: ClientViewDialogProps) {
  if (!client) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>View Client Details</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1 col-span-2">
              <Label className="text-xs text-muted-foreground">Client Name</Label>
              <div className="font-medium text-sm">{client.name}</div>
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">Contact Person</Label>
              <div className="text-sm">{client.contactPerson || "-"}</div>
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">Email</Label>
              <div className="text-sm">{client.email || "-"}</div>
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">Phone</Label>
              <div className="text-sm">{client.phone || "-"}</div>
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">GST Number</Label>
              <div className="text-sm font-mono">{client.gstNumber || "-"}</div>
            </div>
            <div className="space-y-1 col-span-2">
              <Label className="text-xs text-muted-foreground">Billing Address</Label>
              <div className="text-sm border p-3 rounded-md bg-muted/30 whitespace-pre-wrap min-h-20">
                {client.billingAddress || "-"}
              </div>
            </div>
            <div className="space-y-1 col-span-2">
              <Label className="text-xs text-muted-foreground">Notes</Label>
              <div className="text-sm border p-3 rounded-md bg-muted/30 whitespace-pre-wrap min-h-[60px]">
                {client.notes || "-"}
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Close
            </Button>
            <Button
              onClick={() => {
                onOpenChange(false);
                onEdit(client);
              }}
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit Client
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
});
