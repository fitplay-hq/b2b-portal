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
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { SetStateAction } from "react";
import { AdminOrder } from "@/data/order/admin.actions";
import { $Enums, Order } from "@/lib/generated/prisma";
import { formatStatus } from "@/lib/utils";
import { Mail, Clock } from "lucide-react";

const ORDER_STATUSES: Order["status"][] = Object.values($Enums.Status);

// Define the props based on the state and handlers from the useOrderManagement hook
interface UpdateStatusDialogProps {
  dialogState: {
    isOpen: boolean;
    order: AdminOrder | null;
    newStatus: string;
    consignmentNumber: string;
    deliveryService: string;
    sendEmail: boolean;
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

          <Separator className="my-4" />

          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="sendEmail"
                checked={dialogState.sendEmail}
                onCheckedChange={(checked) =>
                  setDialogState((prev: any) => ({ ...prev, sendEmail: checked }))
                }
              />
              <Label htmlFor="sendEmail" className="text-sm font-medium">
                Send email notification to client
              </Label>
            </div>

            {dialogState.order && (
              <div className="space-y-2">
                <Label className="text-sm font-medium flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Email History
                </Label>
                <div className="border rounded-md p-3 bg-gray-50">
                  <div className="flex items-center justify-between text-sm">
                    <span>Last email sent:</span>
                    <Badge variant={dialogState.order.isMailSent ? "default" : "secondary"}>
                      {dialogState.order.isMailSent ? "Sent" : "Not sent"}
                    </Badge>
                  </div>
                  {dialogState.order.isMailSent && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Email was sent when order was created
                    </p>
                  )}
                </div>
              </div>
            )}
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
