import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { PurchaseOrder } from "@/lib/mockData";
import { SetStateAction } from "react";
import { AdminOrder } from "@/data/order/admin.actions";
import { $Enums, Order } from "@/lib/generated/prisma";

const ORDER_STATUSES: Order["status"][] = Object.values($Enums.Status);

// Define the props based on the state and handlers from the useOrderManagement hook
interface UpdateStatusDialogProps {
  dialogState: {
    isOpen: boolean;
    order: AdminOrder | null;
    newStatus: string;
    notes: string;
  };
  setDialogState: React.Dispatch<SetStateAction<any>>;
  closeStatusDialog: () => void;
  handleStatusUpdate: () => void;
}

export function UpdateStatusDialog({
  dialogState,
  setDialogState,
  closeStatusDialog,
  handleStatusUpdate,
}: UpdateStatusDialogProps) {
  // Don't render anything if there's no order selected
  if (!dialogState.order) {
    return null;
  }

  return (
    <Dialog open={dialogState.isOpen} onOpenChange={closeStatusDialog}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Order Status</DialogTitle>
          <DialogDescription>
            Change the status for order <strong>{dialogState.order.id}</strong>.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 pt-2">
          <div className="space-y-2">
            <Label htmlFor="status">New Status</Label>
            <Select
              value={dialogState.newStatus}
              onValueChange={(value) =>
                setDialogState((prev: any) => ({ ...prev, newStatus: value }))
              }
            >
              <SelectTrigger id="status">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {ORDER_STATUSES.map((status) => (
                  <SelectItem
                    key={status}
                    value={status}
                    className="capitalize"
                  >
                    {status.replace("-", " ")}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="notes">Status Update Notes (Optional)</Label>
            <Textarea
              id="notes"
              value={dialogState.notes}
              onChange={(e) =>
                setDialogState((prev: any) => ({
                  ...prev,
                  notes: e.target.value,
                }))
              }
              placeholder="Add any notes about this status change..."
              rows={3}
            />
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={closeStatusDialog}>
              Cancel
            </Button>
            <Button onClick={handleStatusUpdate}>Update Status</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
