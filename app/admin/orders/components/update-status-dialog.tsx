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
import { Mail, Clock, CheckCircle, Loader2 } from "lucide-react";

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
  isUpdating?: boolean;
}

export function UpdateStatusDialog({
  dialogState,
  setDialogState,
  closeStatusDialog,
  handleStatusUpdate,
  isUpdating = false,
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
                <div className="border rounded-md p-3 bg-gray-50 max-h-40 overflow-y-auto">
                  <div className="space-y-3">
                    {(() => {
                      // Create a comprehensive timeline by combining all events
                      const timelineEvents = [];
                      
                      // 1. Order Created Event
                      timelineEvents.push({
                        type: 'order_created',
                        timestamp: new Date(dialogState.order.createdAt),
                        title: 'Order Created',
                        icon: 'check',
                        color: 'green'
                      });

                      // 2. Initial Email Sent (if applicable)
                      if (dialogState.order.isMailSent) {
                        timelineEvents.push({
                          type: 'initial_email',
                          timestamp: new Date(dialogState.order.createdAt), // Use createdAt as approximation
                          title: 'Initial Email Sent',
                          description: 'Order confirmation email sent to client',
                          icon: 'mail',
                          color: 'blue'
                        });
                      }

                      // 3. Add email events with their actual timestamps
                      if (dialogState.order.emails && dialogState.order.emails.length > 0) {
                        dialogState.order.emails.forEach(email => {
                          timelineEvents.push({
                            type: 'email',
                            timestamp: new Date(email.sentAt || email.createdAt),
                            title: `${formatStatus(email.purpose)} Email ${email.isSent ? 'Sent' : 'Failed'}`,
                            icon: email.isSent ? 'check' : 'clock',
                            color: email.isSent ? 'green' : 'gray',
                            email: email
                          });
                        });
                      }

                      // Sort all events chronologically
                      timelineEvents.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());

                      // Render the sorted timeline
                      return timelineEvents.length > 0 ? timelineEvents.map((event, index) => (
                        <div key={`${event.type}-${index}`} className="flex items-start gap-3">
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                            event.color === 'green' ? 'bg-green-100' :
                            event.color === 'blue' ? 'bg-blue-100' : 'bg-gray-100'
                          }`}>
                            {event.icon === 'check' && <CheckCircle className={`h-3 w-3 ${
                              event.color === 'green' ? 'text-green-600' : 'text-gray-600'
                            }`} />}
                            {event.icon === 'mail' && <Mail className="h-3 w-3 text-blue-600" />}
                            {event.icon === 'clock' && <Clock className="h-3 w-3 text-gray-600" />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium">{event.title}</p>
                            {event.description && (
                              <p className="text-xs text-muted-foreground">{event.description}</p>
                            )}
                            <p className="text-xs text-muted-foreground">
                              {event.timestamp.toLocaleString()}
                            </p>
                          </div>
                        </div>
                      )) : (
                        <div className="flex items-start gap-3">
                          <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                            <Clock className="h-3 w-3 text-gray-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-muted-foreground">No emails sent yet</p>
                            <p className="text-xs text-muted-foreground">
                              Email notifications will be sent when status is updated
                            </p>
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={closeStatusDialog} disabled={isUpdating}>
              Cancel
            </Button>
            <Button onClick={handleStatusUpdate} disabled={isUpdating}>
              {isUpdating ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Updating...
                </>
              ) : (
                'Update Status'
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
