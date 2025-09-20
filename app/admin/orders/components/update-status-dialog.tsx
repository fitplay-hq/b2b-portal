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
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { SetStateAction } from "react";
import { AdminOrder } from "@/data/order/admin.actions";
import { $Enums, Order } from "@/lib/generated/prisma";
import { formatStatus } from "@/lib/utils";

const ORDER_STATUSES: Order["status"][] = Object.values($Enums.Status);

// Define the props based on the state and handlers from the useOrderManagement hook
interface UpdateStatusDialogProps {
  dialogState: {
    isOpen: boolean;
    order: AdminOrder | null;
    newStatus: string;
    consignmentNumber: string;
    deliveryService: string;
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
                    {formatStatus(status)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {dialogState.newStatus === "DISPATCHED" && (
            <>
              <div className="space-y-2">
                <Label htmlFor="consignmentNumber">Consignment Number</Label>
                <Input
                  id="consignmentNumber"
                  value={dialogState.consignmentNumber}
                  onChange={(e) =>
                    setDialogState((prev: any) => ({
                      ...prev,
                      consignmentNumber: e.target.value,
                    }))
                  }
                  placeholder="Enter consignment number"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="deliveryService">Delivery Service</Label>
                <Input
                  id="deliveryService"
                  value={dialogState.deliveryService}
                  onChange={(e) =>
                    setDialogState((prev: any) => ({
                      ...prev,
                      deliveryService: e.target.value,
                    }))
                  }
                  placeholder="Enter delivery service"
                  required
                />
              </div>
            </>
          )}
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
