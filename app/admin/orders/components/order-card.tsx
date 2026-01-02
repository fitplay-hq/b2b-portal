import { useState } from "react";
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
    <div className="flex items-center justify-between gap-4">
      <div className="space-y-1">
        <div className="flex items-center gap-3">
          <h3 className="font-semibold text-lg">{order.id}</h3>
          <Badge className={`${color} text-xs`}>
            <Icon className="mr-1 h-3 w-3" />
            {statusText}
          </Badge>
        </div>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <Building2 className="h-4 w-4" />
            {order.client?.company?.name || "Unknown Company"}
          </span>
          <span className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            {new Date(order.createdAt).toLocaleDateString()}
          </span>
          <span className="flex items-center gap-1">
            <CalendarDays className="h-4 w-4" />
            Updated: {new Date(order.updatedAt).toLocaleDateString()}
          </span>
          <span className="flex items-center gap-1">
            <Package className="h-4 w-4" />
            {(() => {
              const regularItems = order.orderItems?.length || 0;
              const bundleItems = order.bundleOrderItems?.length || 0;
              
              if (bundleItems > 0 && regularItems > 0) {
                return `${regularItems} items + ${bundleItems} bundle items`;
              } else if (bundleItems > 0) {
                return `${bundleItems} bundle items`;
              } else if (regularItems > 0) {
                return `${regularItems} items`;
              } else {
                return '0 items';
              }
            })()} 
          </span>
        </div>
      </div>
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
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
  onOrderUpdate,
}: {
  order: AdminOrder;
  onOpenStatusDialog: () => void;
  onOrderUpdate?: (updatedOrder: AdminOrder) => void;
}) => {
  const { actions } = usePermissions();
  const { sendOrderEmail, isSending } = useSendOrderEmail();
  const [isGeneratingLabel, setIsGeneratingLabel] = useState(false);

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

  const handleDownloadLabel = async (url: string) => {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Failed to download shipping label');
      }
      
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `shipping-label-${order.id}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error('Error downloading label:', error);
      toast.error('Failed to download shipping label');
    }
  };

  const handleGenerateLabel = async (orderId: string) => {
    if (isGeneratingLabel) return; // Prevent multiple clicks
    
    try {
      setIsGeneratingLabel(true);
      console.log("Starting label regeneration for order:", orderId);

      const response = await fetch(`/api/admin/orders/regenerate-label`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ orderId }),
      });

      console.log("Regeneration API response status:", response.status);

      if (!response.ok) {
        let errorMessage = "Failed to regenerate shipping label";
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorMessage;
        } catch (parseError) {
          console.error("Error parsing error response:", parseError);
        }
        throw new Error(errorMessage);
      }

      const result = await response.json();
      console.log("Regeneration result:", result);

      if (result.shippingLabelUrl) {
        toast.success("Shipping label regenerated successfully");
        // Update the order data to reflect the new shipping label URL
        if (onOrderUpdate) {
          onOrderUpdate({ ...order, shippingLabelUrl: result.shippingLabelUrl });
        }
        // Trigger download of the new label
        handleDownloadLabel(result.shippingLabelUrl);
      } else {
        throw new Error("No shipping label URL received from server");
      }
    } catch (error) {
      console.error("Error regenerating label:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to regenerate shipping label";
      toast.error(errorMessage);
    } finally {
      setIsGeneratingLabel(false);
    }
  };

  return (
    <CardContent className="pt-0">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row flex-wrap items-start sm:items-center gap-2 border-b pb-4">
          {actions.orders.view && (
            <Link href={`/admin/orders/${order.id}`}>
              <Button size="sm" variant="secondary" className="text-xs sm:text-sm h-8 sm:h-9">
                <ExternalLink className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                View Details
              </Button>
            </Link>
          )}
          {actions.orders.edit && (
            <Button size="sm" onClick={onOpenStatusDialog} className="text-xs sm:text-sm h-8 sm:h-9">
              Update Status
            </Button>
          )}
          {(order.status === "READY_FOR_DISPATCH" ||
            order.status === "DISPATCHED" ||
            order.status === "AT_DESTINATION" ||
            order.status === "DELIVERED") && (
            <>
              {order.shippingLabelUrl ? (
                <>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handleDownloadLabel(order.shippingLabelUrl!)}
                    className="text-xs sm:text-sm h-8 sm:h-9"
                  >
                    <Download className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                    Download Label
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleGenerateLabel(order.id)}
                    disabled={isGeneratingLabel}
                    className="text-xs sm:text-sm h-8 sm:h-9"
                  >
                    {isGeneratingLabel ? (
                      <>
                        <div className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <FileText className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                        Regenerate Label
                      </>
                    )}
                  </Button>
                </>
              ) : (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleGenerateLabel(order.id)}
                  disabled={isGeneratingLabel}
                  className="text-xs sm:text-sm h-8 sm:h-9"
                >
                  {isGeneratingLabel ? (
                    <>
                      <div className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <FileText className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                      Generate Label
                    </>
                  )}
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
              className="text-xs sm:text-sm h-8 sm:h-9"
            >
              <Mail className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
              {order.isMailSent
                ? "Mail Sent"
                : isSending
                ? "Sending..."
                : "Send Email"}
            </Button>
          )}
          {actions.orders.edit && order.status === "PENDING" && (
            <Link href={`/admin/orders/${order.id}/approve`}>
              <Button size="sm" variant="default" className="text-xs sm:text-sm h-8 sm:h-9">
                <CheckCircle className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                Approve Order
              </Button>
            </Link>
          )}
        </div>
        <div>
          <h4 className="mb-3 font-medium text-sm sm:text-base">Order Items</h4>
          <div className="space-y-3">
            {order.orderItems && order.orderItems.map((item) => (
              <div
                key={item.product.id}
                className="flex gap-2 sm:gap-3 rounded-lg bg-muted/40 p-2 sm:p-3"
              >
                <ImageWithFallback
                  src={item.product.images[0]}
                  alt={item.product.name}
                  className="h-12 w-12 sm:h-16 sm:w-16 rounded object-cover shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-sm sm:text-base truncate">{item.product.name}</p>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    SKU: {item.product.sku}
                  </p>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 text-xs sm:text-sm">
                    <p>Quantity: {item.quantity}</p>
                    <p>Price: ₹{item.price.toFixed(2)}</p>
                  </div>
                </div>
              </div>
            ))}
            {order.bundleOrderItems && order.bundleOrderItems.length > 0 && (() => {
              // Group bundleOrderItems by bundle for card view
              const bundleGroups = order.bundleOrderItems.reduce((groups: any, bundleItem) => {
                const bundleId = bundleItem.bundleId;
                if (!groups[bundleId]) {
                  groups[bundleId] = {
                    bundle: bundleItem.bundle,
                    items: []
                  };
                }
                groups[bundleId].items.push(bundleItem);
                return groups;
              }, {});

              return Object.values(bundleGroups).map((group: any, groupIndex) => (
                <div key={`bundle-group-${groupIndex}`} className="space-y-2">
                  {/* Bundle Header */}
                  <div className="flex items-center gap-2 p-2 bg-blue-50 rounded-md border-l-2 border-blue-400">
                    <Package className="h-3 w-3 text-blue-600" />
                    <span className="font-medium text-xs text-blue-900">Bundle {groupIndex + 1}</span>
                    <span className="text-xs text-blue-600 ml-auto">
                      {group.items.length} items • Quantity: {order.numberOfBundles || 1} bundles
                    </span>
                  </div>
                  
                  {/* Show first 2 bundle items */}
                  {group.items.slice(0, 2).map((bundleItem: any, itemIndex: number) => (
                    <div key={`bundle-item-${groupIndex}-${itemIndex}`} className="flex gap-2 sm:gap-3 rounded-lg border p-2 sm:p-3 ml-2">
                      <div className="h-12 w-12 sm:h-16 sm:w-16 rounded overflow-hidden shrink-0">
                        <ImageWithFallback
                          src={bundleItem.product?.images?.[0] || ''}
                          alt={bundleItem.product?.name || 'Bundle Product'}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-sm sm:text-base truncate">{bundleItem.product?.name || 'Bundle Product'}</p>
                        <p className="text-xs sm:text-sm text-muted-foreground">
                          SKU: {bundleItem.product?.sku || 'N/A'}
                        </p>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 text-xs sm:text-sm">
                          <p>Qty: {bundleItem.quantity}</p>
                          <p className="text-blue-600 font-medium">Bundle Item</p>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {/* Show more items indicator */}
                  {group.items.length > 2 && (
                    <div className="text-center py-2 ml-2">
                      <span className="text-xs text-muted-foreground">
                        +{group.items.length - 2} more bundle items
                      </span>
                    </div>
                  )}
                </div>
              ));
            })()}
            {(!order.orderItems || order.orderItems.length === 0) && (!order.bundleOrderItems || order.bundleOrderItems.length === 0) && (
              <div className="text-center py-8 text-muted-foreground">
                <Package className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>No items found in this order</p>
              </div>
            )}
          </div>
          <div className="mt-4 pt-4 border-t">
            <div className="flex justify-between items-center">
              <span className="font-medium text-sm sm:text-base">Total Amount:</span>
              <span className="font-bold text-base sm:text-lg">
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
            <h4 className="font-medium mb-3">Order Timeline</h4>
            <div className="space-y-3">
              {(() => {
                // Create a comprehensive timeline by combining all events
                const timelineEvents = [];
                
                // 1. Order Created Event
                timelineEvents.push({
                  type: 'order_created',
                  timestamp: new Date(order.createdAt),
                  title: 'Order Created',
                  description: 'Order placed by client',
                  icon: 'check',
                  color: 'green'
                });

                // 2. Initial Email Sent (if applicable)
                if (order.isMailSent) {
                  timelineEvents.push({
                    type: 'initial_email',
                    timestamp: new Date(order.createdAt), // Use createdAt as approximation
                    title: 'Initial Email Sent',
                    description: 'Order confirmation email sent to client',
                    icon: 'mail',
                    color: 'blue'
                  });
                }

                // 3. Add email events with their actual timestamps
                if (order.emails && order.emails.length > 0) {
                  order.emails.forEach(email => {
                    timelineEvents.push({
                      type: 'email',
                      timestamp: new Date(email.sentAt || email.createdAt),
                      title: `${formatStatus(email.purpose)} Email ${email.isSent ? 'Sent' : 'Failed'}`,
                      description: email.isSent ? 'Email notification sent to client' : 'Email delivery failed',
                      icon: email.isSent ? 'check' : 'clock',
                      color: email.isSent ? 'green' : 'gray',
                      email: email
                    });
                  });
                }

                // 4. Current status event (only if not PENDING and no corresponding email exists)
                if (order.status !== 'PENDING') {
                  const hasStatusEmail = order.emails?.some(email => email.purpose === order.status);
                  if (!hasStatusEmail) {
                    timelineEvents.push({
                      type: 'status_change',
                      timestamp: new Date(order.updatedAt),
                      title: `Order ${formatStatus(order.status)}`,
                      description: `Status updated to ${formatStatus(order.status).toLowerCase()}${
                        order.consignmentNumber ? ` • Consignment: ${order.consignmentNumber}` : ''
                      }${order.deliveryService ? ` • Service: ${order.deliveryService}` : ''}`,
                      icon: order.status === 'APPROVED' ? 'check' :
                            order.status === 'READY_FOR_DISPATCH' ? 'package' :
                            order.status === 'DISPATCHED' ? 'package' :
                            order.status === 'AT_DESTINATION' ? 'building' :
                            order.status === 'DELIVERED' ? 'check' :
                            order.status === 'CANCELLED' ? 'x' : 'clock',
                      color: order.status === 'APPROVED' ? 'blue' :
                             order.status === 'READY_FOR_DISPATCH' ? 'purple' :
                             order.status === 'DISPATCHED' ? 'orange' :
                             order.status === 'AT_DESTINATION' ? 'yellow' :
                             order.status === 'DELIVERED' ? 'green' :
                             order.status === 'CANCELLED' ? 'red' : 'gray'
                    });
                  }
                }

                // Sort all events chronologically
                timelineEvents.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());

                // Render the sorted timeline
                return timelineEvents.map((event, index) => (
                  <div key={`${event.type}-${index}`} className="flex items-start gap-3">
                    <div className="flex flex-col items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        event.color === 'green' ? 'bg-green-100' :
                        event.color === 'blue' ? 'bg-blue-100' :
                        event.color === 'purple' ? 'bg-purple-100' :
                        event.color === 'orange' ? 'bg-orange-100' :
                        event.color === 'yellow' ? 'bg-yellow-100' :
                        event.color === 'red' ? 'bg-red-100' : 'bg-gray-100'
                      }`}>
                        {event.icon === 'check' && <CheckCircle className={`h-4 w-4 ${
                          event.color === 'green' ? 'text-green-600' :
                          event.color === 'blue' ? 'text-blue-600' :
                          event.color === 'purple' ? 'text-purple-600' :
                          event.color === 'orange' ? 'text-orange-600' :
                          event.color === 'yellow' ? 'text-yellow-600' :
                          event.color === 'red' ? 'text-red-600' : 'text-gray-600'
                        }`} />}
                        {event.icon === 'mail' && <Mail className={`h-4 w-4 ${
                          event.color === 'blue' ? 'text-blue-600' : 'text-gray-600'
                        }`} />}
                        {event.icon === 'package' && <Package className={`h-4 w-4 ${
                          event.color === 'purple' ? 'text-purple-600' :
                          event.color === 'orange' ? 'text-orange-600' : 'text-gray-600'
                        }`} />}
                        {event.icon === 'building' && <Building2 className={`h-4 w-4 ${
                          event.color === 'yellow' ? 'text-yellow-600' : 'text-gray-600'
                        }`} />}
                        {event.icon === 'x' && <XCircle className={`h-4 w-4 ${
                          event.color === 'red' ? 'text-red-600' : 'text-gray-600'
                        }`} />}
                        {event.icon === 'clock' && <Clock className="h-4 w-4 text-gray-600" />}
                      </div>
                      {index < timelineEvents.length - 1 && <div className="w-0.5 h-6 bg-gray-200 mt-1"></div>}
                    </div>
                    <div className="flex-1 pb-2">
                      <p className="text-sm font-medium">{event.title}</p>
                      <p className="text-xs text-muted-foreground">{event.description}</p>
                      <p className="text-xs text-muted-foreground">
                        {event.timestamp.toLocaleString()}
                      </p>
                    </div>
                  </div>
                ));
              })()}

              {/* No events yet */}
              {!order.isMailSent && (!order.emails || order.emails.length === 0) && order.status === 'PENDING' && (
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                    <Clock className="h-4 w-4 text-gray-600" />
                  </div>
                  <div className="flex-1 pb-2">
                    <p className="text-sm font-medium text-muted-foreground">No events yet</p>
                    <p className="text-xs text-muted-foreground">
                      Order is waiting for approval • {new Date(order.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              )}
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
  onToggleExpand: () => void;
  onOpenStatusDialog: () => void;
  onOrderUpdate?: (updatedOrder: AdminOrder) => void;
}

export function OrderCard({
  order,
  isExpanded,
  onToggleExpand,
  onOpenStatusDialog,
  onOrderUpdate,
}: OrderCardProps) {
  return (
    <Card>
      <Collapsible open={isExpanded} onOpenChange={onToggleExpand}>
        <CollapsibleTrigger asChild>
          <div className="group cursor-pointer transition-colors hover:bg-muted/50">
            <CardHeader>
              <OrderSummary order={order} />
            </CardHeader>
          </div>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <OrderDetails order={order} onOpenStatusDialog={onOpenStatusDialog} onOrderUpdate={onOrderUpdate} />
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}
