import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ImageWithFallback } from "@/components/image";
import {
  ChevronDown,
  Clock,
  CheckCircle,
  Package,
  XCircle,
  Building2,
  Calendar,
  Download,
  ExternalLink,
  CalendarDays,
  Mail,
  FileText,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { AdminOrder } from "@/data/order/admin.actions";
import { Order } from "@/lib/generated/prisma";
import { useSendOrderEmail } from "@/data/order/admin.hooks";
import Link from "next/link";
import { formatStatus } from "@/lib/utils";
import { toast } from "sonner";
import { usePermissions } from "@/hooks/use-permissions";

// --- Helper Function ---
// A utility to get style and icon based on order status
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

// --- Sub-component for the Card's Visible Header ---
const OrderSummary = ({ order }: { order: AdminOrder }) => {
  const { color, Icon } = getStatusVisuals(order.status);
  const statusText = formatStatus(order.status);

  return (
    <div className="flex w-full items-start justify-between gap-4">
      <div className="space-y-1">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <CardTitle className="text-lg">{order.id}</CardTitle>
          <Badge className={color}>
            <Icon className="mr-1.5 h-4 w-4" />
            {statusText}
          </Badge>
        </div>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <Building2 className="h-3 w-3" />
            {order.client?.company?.name || "Unknown Company"}
          </span>
          <span className="flex items-center gap-1.5">
            <Calendar className="h-3 w-3" />
            {new Date(order.createdAt).toLocaleDateString()}
          </span>
          {order.createdAt && (
            <span className="flex items-center gap-1.5">
              <CalendarDays className="h-3 w-3" />
              Updated: {new Date(order.updatedAt).toLocaleDateString()}
            </span>
          )}
          <span className="flex items-center gap-1.5">
            <Package className="h-3 w-3" />
            {order.orderItems.length} items
          </span>
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-2 text-muted-foreground">
        <span>Details</span>
        <ChevronDown className="h-4 w-4 transition-transform duration-200 group-data-[state=open]:rotate-180" />
      </div>
    </div>
  );
};

// --- Sub-component for the Expandable Details ---
const OrderDetails = ({
  order,
  onOpenStatusDialog,
}: {
  order: AdminOrder;
  onOpenStatusDialog: () => void;
}) => {
  const { actions } = usePermissions();
  const { sendOrderEmail, isSending } = useSendOrderEmail();

  const handleSendEmail = async () => {
    try {
      await sendOrderEmail({
        orderId: order.id,
        clientEmail: order.client.email,
      });
      toast.success("Email sent successfully");
    } catch {
      toast.error("Failed to send email");
    }
  };

  const handleGenerateLabel = async (orderId: string) => {
    try {
      console.log("Starting label regeneration for order:", orderId);
      
      const response = await fetch(`/api/admin/orders/regenerate-label`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ orderId }),
      });

      console.log("Regeneration API response status:", response.status);

      if (!response.ok) {
        let errorMessage = 'Failed to regenerate shipping label';
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorMessage;
        } catch (parseError) {
          console.error('Error parsing error response:', parseError);
        }
        throw new Error(errorMessage);
      }

      const result = await response.json();
      console.log("Regeneration result:", result);
      
      if (result.shippingLabelUrl) {
        toast.success("Shipping label regenerated successfully");
        // Trigger a page refresh to show the new label
        window.location.reload();
      } else {
        throw new Error('No shipping label URL received from server');
      }
    } catch (error) {
      console.error('Error regenerating label:', error);
      const errorMessage = error instanceof Error ? error.message : "Failed to regenerate shipping label";
      toast.error(errorMessage);
    }
  };

  return (
    <CardContent className="pt-0">
      <div className="space-y-6">
        <div className="flex flex-wrap items-center gap-2 border-b pb-4">
          {actions.orders.view && (
            <Link href={`/admin/orders/${order.id}`}>
              <Button size="sm" variant="secondary">
                <ExternalLink className="mr-2 h-4 w-4" />
                View Details
              </Button>
            </Link>
          )}
          {actions.orders.edit && (
            <Button size="sm" onClick={onOpenStatusDialog}>
              Update Status
            </Button>
          )}
          {(order.status === "READY_FOR_DISPATCH" || 
            order.status === "DISPATCHED" || 
            order.status === "AT_DESTINATION" || 
            order.status === "DELIVERED") && (
            <>
              {order.shippingLabelUrl ? (
                <Link href={order.shippingLabelUrl || ""} target="_blank" rel="noopener noreferrer">
                  <Button size="sm" variant="outline">
                    <Download className="mr-2 h-4 w-4" />
                    Download Shipping Label
                  </Button>
                </Link>
              ) : order.status === "READY_FOR_DISPATCH" ? (
                <Button size="sm" variant="outline" onClick={() => handleGenerateLabel(order.id)}>
                  <FileText className="mr-2 h-4 w-4" />
                  Generate Label
                </Button>
              ) : (
                <Button size="sm" variant="outline" onClick={() => handleGenerateLabel(order.id)}>
                  <FileText className="mr-2 h-4 w-4" />
                  Regenerate Label
                </Button>
              )}
            </>
          )}
          {actions.orders.edit && (
            <Button
              size="sm"
              variant="outline"
              onClick={handleSendEmail}
              disabled={isSending || order.isMailSent}
            >
              <Mail className="mr-2 h-4 w-4" />
              {order.isMailSent
                ? "Mail Sent"
                : isSending
                ? "Sending..."
                : "Send Email"}
            </Button>
          )}
          {actions.orders.edit && order.status === "PENDING" && (
            <Link href={`/admin/orders/${order.id}/approve`}>
              <Button size="sm" variant="default">
                <CheckCircle className="mr-2 h-4 w-4" />
                Approve Order
              </Button>
            </Link>
          )}
        </div>
        <div>
          <h4 className="mb-3 font-medium">Order Items</h4>
          <div className="space-y-3">
            {order.orderItems.map((item) => (
              <div
                key={item.product.id}
                className="flex gap-3 rounded-lg bg-muted/40 p-3"
              >
                <ImageWithFallback
                  src={item.product.images[0]}
                  alt={item.product.name}
                  className="h-16 w-16 rounded object-cover"
                />
                <div>
                  <p className="font-medium">{item.product.name}</p>
                  <p className="text-sm text-muted-foreground">
                    SKU: {item.product.sku}
                  </p>
                  <p className="text-sm">Quantity: {item.quantity}</p>
                  <p className="text-sm">Price: ₹{item.price.toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t">
            <div className="flex justify-between items-center">
              <span className="font-medium">Total Amount:</span>
              <span className="font-bold text-lg">
                ₹{order.totalAmount.toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-x-4 gap-y-6 pt-4 border-t md:grid-cols-2">
          <div>
            <h4 className="font-medium mb-2">Delivery Address</h4>
            <div className="text-sm text-muted-foreground space-y-1">
              <p>
                <strong>Consignee:</strong> {order.consigneeName}
              </p>
              <p>
                <strong>Phone:</strong> {order.consigneePhone}
              </p>
              <p>
                <strong>Email:</strong> {order.consigneeEmail}
              </p>
              <p>
                <strong>Address:</strong> {order.deliveryAddress}
              </p>
              <p>
                <strong>City:</strong> {order.city}
              </p>
              <p>
                <strong>State:</strong> {order.state}
              </p>
              <p>
                <strong>Pincode:</strong> {order.pincode}
              </p>
              <p>
                <strong>Mode:</strong> {order.modeOfDelivery}
              </p>
              {order.consignmentNumber && (
                <p>
                  <strong>Consignment Number:</strong> {order.consignmentNumber}
                </p>
              )}
              {order.deliveryService && (
                <p>
                  <strong>Delivery Service:</strong> {order.deliveryService}
                </p>
              )}
              {order.deliveryReference && (
                <p>
                  <strong>Reference:</strong> {order.deliveryReference}
                </p>
              )}
              {order.packagingInstructions && (
                <p>
                  <strong>Packaging:</strong> {order.packagingInstructions}
                </p>
              )}
            </div>
          </div>
          <div>
            <h4 className="font-medium mb-2">Billing Contact</h4>
            <p className="text-sm text-muted-foreground">
              {order.client.email}
            </p>
          </div>
          {order.note && (
            <div className="md:col-span-2">
              <h4 className="font-medium mb-2">Notes from Client</h4>
              <p className="text-sm text-muted-foreground whitespace-pre-line">
                {order.note}
              </p>
            </div>
          )}
          <div className="md:col-span-2">
            <h4 className="font-medium mb-2">Order Timeline</h4>
            <div className="text-sm text-muted-foreground space-y-1">
              <p>
                <strong>Created:</strong>{" "}
                {new Date(order.createdAt).toLocaleString()}
              </p>
              <p>
                <strong>Last Updated:</strong>{" "}
                {new Date(order.updatedAt).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>
    </CardContent>
  );
};

// --- Main Collapsible Container Component ---
interface OrderCardProps {
  order: AdminOrder;
  isExpanded: boolean;
  onToggleExpansion: () => void;
  onOpenStatusDialog: () => void;
}

export function OrderCard({
  order,
  isExpanded,
  onToggleExpansion,
  onOpenStatusDialog,
}: OrderCardProps) {
  return (
    <Card>
      <Collapsible open={isExpanded} onOpenChange={onToggleExpansion}>
        <CollapsibleTrigger asChild>
          <div className="group cursor-pointer transition-colors hover:bg-muted/50">
            <CardHeader>
              <OrderSummary order={order} />
            </CardHeader>
          </div>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <OrderDetails order={order} onOpenStatusDialog={onOpenStatusDialog} />
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}
