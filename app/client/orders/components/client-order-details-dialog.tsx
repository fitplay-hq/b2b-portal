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
  MapPin,
  User,
  IndianRupee,
  Phone,
  Mail,
  FileText,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Order } from "@/lib/generated/prisma";
import { formatStatus } from "@/lib/utils";
import type { OrderWithItems } from "@/data/order/client.actions";
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
    case "REJECTED":
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
    case "COMPLETED":
      return {
        color: "border-transparent bg-green-200 text-green-900",
        Icon: Building2,
      };
    case "IN_PROGRESS":
      return {
        color: "border-transparent bg-purple-100 text-purple-800",
        Icon: Package,
      };
    default:
      return {
        color: "border-transparent bg-gray-100 text-gray-800",
        Icon: Clock,
      };
  }
};

interface ClientOrderDetailsDialogProps {
  order: OrderWithItems | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ClientOrderDetailsDialog({
  order,
  isOpen,
  onClose,
}: ClientOrderDetailsDialogProps) {
  if (!order) return null;

  const { color, Icon } = getStatusVisuals(order.status);
  const statusText = formatStatus(order.status);

  const orderTimeline = [
    { 
      status: "PENDING", 
      label: "Order Placed", 
      timestamp: order.createdAt,
      description: "Your order has been submitted and is awaiting review"
    },
    { 
      status: "APPROVED", 
      label: "Order Approved", 
      timestamp: order.updatedAt,
      description: "Your order has been approved and is being prepared"
    },
    { 
      status: "READY_FOR_DISPATCH", 
      label: "Ready for Dispatch", 
      timestamp: order.updatedAt,
      description: "Your order is packed and ready to be dispatched"
    },
    { 
      status: "DISPATCHED", 
      label: "Order Dispatched", 
      timestamp: order.updatedAt,
      description: "Your order has been dispatched and is on its way"
    },
    { 
      status: "AT_DESTINATION", 
      label: "At Destination", 
      timestamp: order.updatedAt,
      description: "Your order has reached the delivery location"
    },
    { 
      status: "DELIVERED", 
      label: "Delivered", 
      timestamp: order.updatedAt,
      description: "Your order has been successfully delivered"
    },
    { 
      status: "COMPLETED", 
      label: "Completed", 
      timestamp: order.updatedAt,
      description: "Your order is complete"
    },
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
                <p><span className="font-medium">Required By:</span> {new Date(order.requiredByDate).toLocaleDateString()}</p>
                <p><span className="font-medium">Last Updated:</span> {new Date(order.updatedAt).toLocaleDateString()}</p>
                {order.consignmentNumber && (
                  <p><span className="font-medium">AWB:</span> {order.consignmentNumber}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Delivery Information
              </h4>
              <div className="text-sm space-y-1">
                {order.consigneeName && (
                  <p><span className="font-medium">Consignee:</span> {order.consigneeName}</p>
                )}
                {order.consigneePhone && (
                  <p><span className="font-medium">Phone:</span> {order.consigneePhone}</p>
                )}
                {order.consigneeEmail && (
                  <p><span className="font-medium">Email:</span> {order.consigneeEmail}</p>
                )}
                <p><span className="font-medium">Address:</span> {order.deliveryAddress}</p>
                {order.city && order.state && (
                  <p><span className="font-medium">Location:</span> {order.city}, {order.state}</p>
                )}
                {order.pincode && (
                  <p><span className="font-medium">Pincode:</span> {order.pincode}</p>
                )}
              </div>
            </div>
          </div>

          <Separator />

          {/* Order Items */}
          <div className="space-y-4">
            <h4 className="font-medium flex items-center gap-2">
              <Package className="h-4 w-4" />
              Order Items ({order.orderItems.length} items)
            </h4>
            <div className="space-y-3">
              {order.orderItems.map((item, index) => (
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
                    {item.price > 0 && (
                      <p className="text-sm text-muted-foreground">
                        ₹{item.price.toFixed(2)} each
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
            {order.totalAmount > 0 && (
              <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                <span className="font-medium">Total Amount:</span>
                <span className="font-bold text-lg flex items-center gap-1">
                  <IndianRupee className="h-4 w-4" />
                  {order.totalAmount.toFixed(2)}
                </span>
              </div>
            )}
          </div>

          <Separator />

          {/* Order Timeline */}
          <div className="space-y-4">
            <h4 className="font-medium flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Order Timeline
            </h4>
            <div className="space-y-3">
              {orderTimeline.map((item, index) => {
                const isCompleted = index <= currentStatusIndex;
                const isCurrent = index === currentStatusIndex;
                const { Icon: TimelineIcon } = getStatusVisuals(item.status);
                
                return (
                  <div key={item.status} className={`flex items-start gap-3 ${
                    isCompleted ? 'opacity-100' : 'opacity-40'
                  }`}>
                    <div className={`h-8 w-8 rounded-full flex items-center justify-center mt-1 ${
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
                        {item.description}
                      </p>
                      {isCompleted && (
                        <p className="text-xs text-muted-foreground mt-1">
                          {new Date(item.timestamp).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Additional Information */}
          {(order.note || order.packagingInstructions || order.deliveryReference) && (
            <>
              <Separator />
              <div className="space-y-2">
                <h4 className="font-medium">Additional Information</h4>
                <div className="text-sm space-y-2 p-3 bg-muted/50 rounded-lg">
                  {order.note && (
                    <p><span className="font-medium">Notes:</span> {order.note}</p>
                  )}
                  {order.packagingInstructions && (
                    <p><span className="font-medium">Packaging Instructions:</span> {order.packagingInstructions}</p>
                  )}
                  {order.deliveryReference && (
                    <p><span className="font-medium">Delivery Reference:</span> {order.deliveryReference}</p>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}