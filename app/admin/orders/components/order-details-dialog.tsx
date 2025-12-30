import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ImageWithFallback } from "@/components/image";
import {
  Clock,
  CheckCircle,
  Package,
  XCircle,
  Building2,
  Calendar,
  Download,
  ExternalLink,
  Mail,
  FileText,
  MapPin,
  User,
  IndianRupee,
  Phone,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { AdminOrder } from "@/data/order/admin.actions";
import { Order } from "@/lib/generated/prisma";
import { formatStatus } from "@/lib/utils";
import { useSendOrderEmail } from "@/data/order/admin.hooks";
import { toast } from "sonner";
import { usePermissions } from "@/hooks/use-permissions";
import Link from "next/link";

const getStatusVisuals = (
  status: Order["status"]
): { color: string; Icon: LucideIcon } => {
  switch (status) {
    case "PENDING":
      return {
        color: "border-transparent bg-yellow-100 text-yellow-800",
        Icon: Clock,
      };
    case "APPROVED":
      return {
        color: "border-transparent bg-blue-100 text-blue-800",
        Icon: CheckCircle,
      };
    case "CANCELLED":
      return {
        color: "border-transparent bg-red-100 text-red-800",
        Icon: XCircle,
      };
    case "READY_FOR_DISPATCH":
      return {
        color: "border-transparent bg-purple-100 text-purple-800",
        Icon: Download,
      };
    case "DISPATCHED":
      return {
        color: "border-transparent bg-green-100 text-green-800",
        Icon: Package,
      };
    case "AT_DESTINATION":
      return {
        color: "border-transparent bg-green-100 text-green-800",
        Icon: Package,
      };
    case "DELIVERED":
      return {
        color: "border-transparent bg-green-200 text-green-900",
        Icon: Building2,
      };
    default:
      return {
        color: "border-transparent bg-gray-100 text-gray-800",
        Icon: Clock,
      };
  }
};

interface OrderDetailsDialogProps {
  order: AdminOrder | null;
  isOpen: boolean;
  onClose: () => void;
  onStatusUpdate: (order: AdminOrder) => void;
  onOrderUpdate?: (updatedOrder: AdminOrder) => void;
}

export function OrderDetailsDialog({
  order,
  isOpen,
  onClose,
  onStatusUpdate,
  onOrderUpdate,
}: OrderDetailsDialogProps) {
  const { actions } = usePermissions();
  const { sendOrderEmail, isSending } = useSendOrderEmail();

  if (!order) return null;

  const { color, Icon } = getStatusVisuals(order.status);
  const statusText = formatStatus(order.status);

  const handleSendEmail = async () => {
    try {
      await sendOrderEmail({ orderId: order.id });
      toast.success("Order email sent successfully!");
      if (onOrderUpdate) {
        onOrderUpdate(order);
      }
    } catch (error) {
      toast.error("Failed to send order email");
    }
  };

  const orderTimeline = [
    { status: "PENDING", label: "Order Placed", timestamp: order.createdAt },
    { status: "APPROVED", label: "Order Approved", timestamp: order.updatedAt },
    { status: "READY_FOR_DISPATCH", label: "Ready for Dispatch", timestamp: order.updatedAt },
    { status: "DISPATCHED", label: "Order Dispatched", timestamp: order.updatedAt },
    { status: "AT_DESTINATION", label: "At Destination", timestamp: order.updatedAt },
    { status: "DELIVERED", label: "Delivered", timestamp: order.updatedAt },
  ];

  const currentStatusIndex = orderTimeline.findIndex(item => item.status === order.status);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <span>Order Details - {order.id}</span>
            <Badge className={`${color} text-xs`}>
              <Icon className="mr-1 h-3 w-3" />
              {statusText}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Order Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-medium flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Order Information
              </h4>
              <div className="text-sm space-y-1">
                <p><span className="font-medium">Order ID:</span> {order.id}</p>
                <p><span className="font-medium">Created:</span> {new Date(order.createdAt).toLocaleDateString()}</p>
                <p><span className="font-medium">Last Updated:</span> {new Date(order.updatedAt).toLocaleDateString()}</p>
                {order.consignmentNumber && (
                  <p><span className="font-medium">AWB:</span> {order.consignmentNumber}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium flex items-center gap-2">
                <User className="h-4 w-4" />
                Client Information
              </h4>
              <div className="text-sm space-y-1">
                <p><span className="font-medium">Name:</span> {order.client.name}</p>
                <p><span className="font-medium">Company:</span> {order.client.companyName || order.client.company.name}</p>
                <p><span className="font-medium">Email:</span> {order.client.email}</p>
                {order.client.phoneNumber && (
                  <p><span className="font-medium">Phone:</span> {order.client.phoneNumber}</p>
                )}
              </div>
            </div>
          </div>

          <Separator />

          {/* Order Items */}
          <div className="space-y-4">
            <h4 className="font-medium flex items-center gap-2">
              <Package className="h-4 w-4" />
              Order Items ({(() => {
                const regularItems = order.orderItems?.length || 0;
                const bundleItems = order.bundleOrderItems?.length || 0;
                const bundles = order.numberOfBundles || 0;
                if (bundles > 0 && regularItems > 0) {
                  return `${regularItems} items + ${bundles} bundles`;
                } else if (bundles > 0) {
                  return `${bundles} bundles`;
                } else if (bundleItems > 0) {
                  return `${bundleItems} bundle items`;
                } else {
                  return `${regularItems} items`;
                }
              })()})
            </h4>
            <div className="space-y-3">
              {order.orderItems && order.orderItems.map((item, index) => (
                <div key={index} className="flex items-center gap-4 p-3 border rounded-lg">
                  <div className="h-12 w-12 rounded overflow-hidden">
                    <ImageWithFallback
                      src={item.product.images[0]}
                      alt={item.product.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{item.product.name}</p>
                    <p className="text-sm text-muted-foreground">SKU: {item.product.sku}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">Qty: {item.quantity}</p>
                    <p className="text-sm text-muted-foreground">
                      ₹{item.price} each
                    </p>
                  </div>
                </div>
              ))}
              {order.bundleOrderItems && order.bundleOrderItems
                .filter(bundleItem => bundleItem.bundle?.items)
                .map((bundleItem, index) =>
                bundleItem.bundle!.items.map((item, itemIndex) => (
                  <div key={`bundle-${index}-${itemIndex}`} className="flex items-center gap-4 p-3 border rounded-lg">
                    <div className="h-12 w-12 rounded overflow-hidden">
                      <ImageWithFallback
                        src={item.product?.images?.[0] || ''}
                        alt={item.product?.name || 'Bundle Product'}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{item.product?.name || 'Bundle Product'}</p>
                      <p className="text-sm text-muted-foreground">SKU: {item.product?.sku || 'N/A'}</p>
                      <p className="text-xs text-blue-600 font-medium">Bundle Item</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">Qty: {Math.floor(bundleItem.quantity / item.bundleProductQuantity)} x {item.bundleProductQuantity}</p>
                      {item.product?.price && item.product.price > 0 && (
                        <p className="text-sm text-muted-foreground">
                          ₹{item.product.price.toFixed(2)} each
                        </p>
                      )}
                    </div>
                  </div>
                ))
              )}
              {(!order.orderItems || order.orderItems.length === 0) && (!order.bundleOrderItems || order.bundleOrderItems.length === 0) && (
                <div className="text-center py-8 text-muted-foreground">
                  <Package className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>No items found in this order</p>
                </div>
              )}
            </div>
            <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
              <span className="font-medium">Total Amount:</span>
              <span className="font-bold text-lg flex items-center gap-1">
                <IndianRupee className="h-4 w-4" />
                {order.totalAmount.toLocaleString()}
              </span>
            </div>
          </div>

          <Separator />

          {/* Order Timeline */}
          <div className="space-y-4">
            <h4 className="font-medium flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Order Timeline
            </h4>
            <div className="space-y-3">
              {orderTimeline.slice(0, currentStatusIndex + 1).map((item, index) => {
                const isCompleted = index < currentStatusIndex + 1;
                const isCurrent = index === currentStatusIndex;
                const { Icon: TimelineIcon } = getStatusVisuals(item.status);
                
                return (
                  <div key={item.status} className="flex items-center gap-3">
                    <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
                      isCurrent ? 'bg-primary text-primary-foreground' : 
                      isCompleted ? 'bg-green-100 text-green-600' : 'bg-muted'
                    }`}>
                      <TimelineIcon className="h-4 w-4" />
                    </div>
                    <div className="flex-1">
                      <p className={`font-medium ${isCurrent ? 'text-primary' : ''}`}>
                        {item.label}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(item.timestamp).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <Separator />

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-2">
            <Button
              onClick={handleSendEmail}
              disabled={isSending || order.isMailSent}
              variant="outline"
              size="sm"
            >
              <Mail className="h-4 w-4 mr-2" />
              {order.isMailSent
                ? "Mail Sent"
                : isSending
                ? "Sending..."
                : "Send Email"}
            </Button>
            
            {actions.orders.edit && (
              <Button
                onClick={() => onStatusUpdate(order)}
                variant="outline"
                size="sm"
              >
                <FileText className="h-4 w-4 mr-2" />
                Update Status
              </Button>
            )}
            
            {order.shippingLabelUrl && (
              <Button asChild variant="outline" size="sm">
                <Link href={order.shippingLabelUrl} target="_blank">
                  <Download className="h-4 w-4 mr-2" />
                  Download Label
                </Link>
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}