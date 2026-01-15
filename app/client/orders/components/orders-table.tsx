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
import { Eye, Package, MapPin, Calendar, IndianRupee, ChevronDown, ChevronUp } from "lucide-react";
import { formatStatus } from "@/lib/utils";
import { ImageWithFallback } from "@/components/image";
import { useState } from "react";
import { ClientOrderDetailsDialog } from "./client-order-details-dialog";
import type { OrderWithItems } from "@/data/order/client.actions";

interface ClientOrdersTableProps {
  orders: OrderWithItems[];
  isShowPrice?: boolean;
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
    case 'COMPLETED':
      return 'bg-green-100 text-green-800 hover:bg-green-100/80';
    case 'CANCELLED':
    case 'REJECTED':
      return 'bg-red-100 text-red-800 hover:bg-red-100/80';
    case 'IN_PROGRESS':
      return 'bg-purple-100 text-purple-800 hover:bg-purple-100/80';
    default:
      return 'bg-gray-100 text-gray-800 hover:bg-gray-100/80';
  }
};

const getStatusDescription = (status: string) => {
  switch (status) {
    case "PENDING":
      return "Awaiting approval from Fitplay team";
    case "APPROVED":
      return "Order approved, preparing for shipment";
    case "IN_PROGRESS":
      return "Order is being processed and shipped";
    case "COMPLETED":
    case "DELIVERED":
      return "Order has been delivered";
    case "CANCELLED":
      return "Order was cancelled";
    case "REJECTED":
      return "Order was rejected";
    case "DISPATCHED":
      return "Order has been dispatched";
    case "AT_DESTINATION":
      return "Order has reached destination";
    default:
      return "";
  }
};

export function ClientOrdersTable({ orders, isShowPrice = false }: ClientOrdersTableProps) {
  const [selectedOrder, setSelectedOrder] = useState<OrderWithItems | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleRowClick = (order: OrderWithItems) => {
    setSelectedOrder(order);
    setIsDialogOpen(true);
  };

  return (
    <div className="rounded-md border overflow-x-auto">
      <Table className="min-w-[800px]">
        <TableHeader>
          <TableRow>
            <TableHead>Order Created</TableHead>
            <TableHead>Order ID</TableHead>
            <TableHead>Items</TableHead>
            <TableHead>Order Status</TableHead>
            {isShowPrice && <TableHead>Total Amount</TableHead>}
            <TableHead>City</TableHead>
            <TableHead>State</TableHead>
            <TableHead>Pincode</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.length === 0 ? (
            <TableRow>
              <TableCell colSpan={isShowPrice ? 8 : 7} className="text-center py-8 text-muted-foreground">
                No orders found
              </TableCell>
            </TableRow>
          ) : (
            <>
              {orders.map((order) => {
                return (
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
                            {new Date(order.createdAt).toLocaleDateString('en-GB')}
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
                        <div className="text-xs text-muted-foreground">
                          Required: {new Date(order.requiredByDate).toLocaleDateString('en-GB')}
                        </div>
                      </TableCell>
                      
                      {/* Items */}
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Package className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm font-medium">
                            {(() => {
                              const regularItems = order.orderItems?.length || 0;
                              const bundleOrderItems = order.bundleOrderItems || [];
                              
                              if (bundleOrderItems.length > 0) {
                                // Group bundle items by bundle ID to count unique bundles
                                const uniqueBundles = [...new Set(bundleOrderItems.map(item => item.bundleId))];
                                const bundleCount = uniqueBundles.length;
                                
                                if (regularItems > 0) {
                                  return `${regularItems} items + ${bundleCount} bundle${bundleCount > 1 ? 's' : ''}`;
                                } else {
                                  return `${bundleCount} bundle${bundleCount > 1 ? 's' : ''}`;
                                }
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
                          {order.bundleOrderItems && order.bundleOrderItems.slice(0, 2).map((bundleItem, idx) => {
                            // Group bundle items and show them properly
                            return (
                              <div key={`bundle-${idx}`} className="text-xs text-muted-foreground">
                                🔹 {bundleItem.product?.name || 'Bundle Item'} x{bundleItem.quantity} (Bundle)
                              </div>
                            );
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
                        <Badge className={getStatusColor(order.status)} variant="outline">
                          {formatStatus(order.status)}
                        </Badge>
                        <div className="text-xs text-muted-foreground mt-1 max-w-[200px]">
                          {getStatusDescription(order.status)}
                        </div>
                      </TableCell>
                      
                      {/* Total Amount */}
                      {isShowPrice && (
                        <TableCell>
                          {order.totalAmount > 0 && (
                            <div className="flex items-center gap-1 font-medium">
                              <IndianRupee className="h-4 w-4" />
                              {order.totalAmount.toFixed(2)}
                            </div>
                          )}
                        </TableCell>
                      )}
                      
                      {/* Address Details - always shown */}
                      <TableCell>
                        <div className="text-sm">{order.city || '-'}</div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">{order.state || '-'}</div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm font-mono">{order.pincode || '-'}</div>
                      </TableCell>
                    </TableRow>
                );
              })}
            </>
          )}
        </TableBody>
      </Table>

      <ClientOrderDetailsDialog
        order={selectedOrder}
        isShowPrice={isShowPrice}
        isOpen={isDialogOpen}
        onClose={() => {
          setIsDialogOpen(false);
          setSelectedOrder(null);
        }}
      />
    </div>
  );
}