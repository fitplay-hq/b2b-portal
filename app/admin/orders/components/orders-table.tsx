import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Eye, Package, MapPin, User, Calendar, IndianRupee, Mail, Download, FileText } from "lucide-react";
import { AdminOrder } from "@/data/order/admin.actions";
import { formatStatus } from "@/lib/utils";
import { usePermissions } from "@/hooks/use-permissions";
import { useState } from "react";
import { OrderDetailsDialog } from "./order-details-dialog";
import { useSendOrderEmail } from "@/data/order/admin.hooks";
import { toast } from "sonner";
import Link from "next/link";

interface OrdersTableProps {
  orders: AdminOrder[];
  onStatusUpdate?: (order: AdminOrder) => void;
  expandedOrders?: Set<string>;
  onToggleOrder?: (orderId: string) => void;
  onOrderUpdate?: (updatedOrder: AdminOrder) => void;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'PENDING':
      return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100/80';
    case 'APPROVED':
      return 'bg-blue-100 text-blue-800 hover:bg-blue-100/80';
    case 'READY_FOR_DISPATCH':
      return 'bg-purple-100 text-purple-800 hover:bg-purple-100/80';
    case 'DISPATCHED':
      return 'bg-indigo-100 text-indigo-800 hover:bg-indigo-100/80';
    case 'AT_DESTINATION':
      return 'bg-orange-100 text-orange-800 hover:bg-orange-100/80';
    case 'DELIVERED':
      return 'bg-green-100 text-green-800 hover:bg-green-100/80';
    case 'CANCELLED':
      return 'bg-red-100 text-red-800 hover:bg-red-100/80';
    default:
      return 'bg-gray-100 text-gray-800 hover:bg-gray-100/80';
  }
};

export function OrdersTable({ 
  orders, 
  onStatusUpdate, 
  expandedOrders, 
  onToggleOrder, 
  onOrderUpdate 
}: OrdersTableProps) {
  const { actions } = usePermissions();
  const [selectedOrder, setSelectedOrder] = useState<AdminOrder | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { sendOrderEmail, isSending } = useSendOrderEmail();

  const handleStatusUpdate = (order: AdminOrder) => {
    if (onStatusUpdate) {
      onStatusUpdate(order);
    }
  };

  const handleRowClick = (order: AdminOrder) => {
    setSelectedOrder(order);
    setIsDialogOpen(true);
  };

  const handleSendEmail = async (order: AdminOrder, e: React.MouseEvent) => {
    e.stopPropagation();
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

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Order Created</TableHead>
            <TableHead>Order ID</TableHead>
            <TableHead>Client</TableHead>
            <TableHead>Items</TableHead>
            <TableHead>Order Status</TableHead>
            <TableHead>Total Amount</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                No orders found
              </TableCell>
            </TableRow>
          ) : (
            orders.map((order) => (
              <TableRow 
                key={order.id} 
                className="group cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => handleRowClick(order)}
              >
                {/* Order Created Date */}
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {new Date(order.createdAt).toLocaleTimeString()}
                  </div>
                </TableCell>

                {/* Order ID */}
                <TableCell>
                  <div className="font-medium text-sm">{order.id}</div>
                  {order.consignmentNumber && (
                    <div className="text-xs text-blue-600 font-mono">
                      AWB: {order.consignmentNumber}
                    </div>
                  )}
                </TableCell>
                
                {/* Client Details */}
                <TableCell>
                  <div className="space-y-1">
                    <div className="font-medium text-sm">{order.client.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {order.client.companyName || order.client.company.name}
                    </div>
                    <div className="text-xs text-muted-foreground">{order.client.email}</div>
                  </div>
                </TableCell>
                
                {/* Items */}
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Package className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">
                      {(() => {
                        const regularItems = order.orderItems?.length || 0;
                        const bundleItems = order.bundleOrderItems?.length || 0;
                        
                        if (bundleItems > 0 && regularItems > 0) {
                          return `${regularItems} items + ${bundleItems} bundle items`;
                        } else if (bundleItems > 0) {
                          return `${bundleItems} bundle items`;
                        } else {
                          return `${regularItems} items`;
                        }
                      })()} 
                    </span>
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {order.orderItems && order.orderItems.slice(0, 2).map((item, idx) => (
                      <div key={idx}>
                        {item.product?.name || 'Unknown Product'} x{item.quantity}
                      </div>
                    ))}
                    {order.bundleOrderItems && order.bundleOrderItems.slice(0, 2)
                      .map((bundleItem, idx) => {
                        // If bundle has detailed items, show them
                        if (bundleItem.bundle?.items && bundleItem.bundle.items.length > 0) {
                          return bundleItem.bundle.items.slice(0, 1).map((item, itemIdx) => (
                            <div key={`bundle-${idx}-${itemIdx}`}>
                              {item.product?.name || 'Bundle Product'} (Bundle) x{bundleItem.quantity}
                            </div>
                          ));
                        } else {
                          // Use the product info directly from bundleOrderItem
                          return [
                            <div key={`bundle-simple-${idx}`}>
                              {bundleItem.product?.name || 'Bundle Item'} (Bundle) x{bundleItem.quantity}
                            </div>
                          ];
                        }
                      })}
                    {(order.orderItems?.length || 0) + (order.bundleOrderItems?.length || 0) > 2 && (
                      <div className="text-muted-foreground">
                        +{(order.orderItems?.length || 0) + (order.bundleOrderItems?.length || 0) - 2} more items
                      </div>
                    )}
                  </div>
                </TableCell>
                
                {/* Order Status */}
                <TableCell>
                  <Badge className={`text-xs ${getStatusColor(order.status)}`}>
                    {formatStatus(order.status)}
                  </Badge>
                  <div className="text-xs text-muted-foreground mt-1">
                    Last updated: {new Date(order.updatedAt).toLocaleDateString()}
                  </div>
                </TableCell>
                
                {/* Total Amount */}
                <TableCell>
                  <div className="flex items-center gap-1 font-medium">
                    <IndianRupee className="h-4 w-4" />
                    {order.totalAmount.toLocaleString()}
                  </div>
                </TableCell>
                
                {/* Action Buttons */}
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    {actions.orders.email && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => handleSendEmail(order, e)}
                        disabled={isSending}
                        className="h-8 px-2 text-xs"
                        title="Send Email"
                      >
                        <Mail className="h-3 w-3" />
                      </Button>
                    )}
                    
                    {actions.orders.edit && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleStatusUpdate(order);
                        }}
                        className="h-8 px-2 text-xs"
                        title="Update Status"
                      >
                        <FileText className="h-3 w-3" />
                      </Button>
                    )}
                    
                    {order.shippingLabelUrl && (
                      <Button
                        asChild
                        variant="outline"
                        size="sm"
                        className="h-8 px-2 text-xs"
                        title="Download Label"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Link href={order.shippingLabelUrl} target="_blank">
                          <Download className="h-3 w-3" />
                        </Link>
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      <OrderDetailsDialog
        order={selectedOrder}
        isOpen={isDialogOpen}
        onClose={() => {
          setIsDialogOpen(false);
          setSelectedOrder(null);
        }}
        onStatusUpdate={handleStatusUpdate}
        onOrderUpdate={onOrderUpdate}
      />
    </div>
  );
}