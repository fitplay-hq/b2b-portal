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
  expandedOrders?: Set<string>;
  onToggleOrder?: (orderId: string) => void;
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

export function ClientOrdersTable({ orders, expandedOrders, onToggleOrder }: ClientOrdersTableProps) {
  const [selectedOrder, setSelectedOrder] = useState<OrderWithItems | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleToggleOrder = (orderId: string) => {
    if (onToggleOrder) {
      onToggleOrder(orderId);
    }
  };

  const handleRowClick = (order: OrderWithItems) => {
    setSelectedOrder(order);
    setIsDialogOpen(true);
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Order Created</TableHead>
            <TableHead>Order ID</TableHead>
            <TableHead>Items</TableHead>
            <TableHead>Order Status</TableHead>
            <TableHead>Total Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                No orders found
              </TableCell>
            </TableRow>
          ) : (
            <>
              {orders.map((order) => {
                const isExpanded = expandedOrders?.has(order.id) || false;
                return (
                  <>
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
                        <div className="text-xs text-muted-foreground">
                          Required: {new Date(order.requiredByDate).toLocaleDateString()}
                        </div>
                      </TableCell>
                      
                      {/* Items */}
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Package className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm font-medium">
                            {order.orderItems.length} items
                          </span>
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {order.orderItems.slice(0, 2).map((item, idx) => (
                            <div key={idx}>
                              {item.product.name} x{item.quantity}
                            </div>
                          ))}
                          {order.orderItems.length > 2 && (
                            <div className="text-muted-foreground">
                              +{order.orderItems.length - 2} more items
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
                      <TableCell>
                        {order.totalAmount > 0 && (
                          <div className="flex items-center gap-1 font-medium">
                            <IndianRupee className="h-4 w-4" />
                            {order.totalAmount.toFixed(2)}
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                    
                    {/* Expanded Row with Timeline */}
                    {isExpanded && (
                      <TableRow>
                        <TableCell colSpan={5} className="bg-muted/20 p-0">
                          <div className="p-4 space-y-4">
                            {/* Order Timeline */}
                            <div>
                              <h4 className="font-medium mb-3">Order Timeline</h4>
                              <div className="space-y-3 mb-4">
                                {[
                                  { status: "PENDING", label: "Order Placed", description: "Your order has been submitted" },
                                  { status: "APPROVED", label: "Order Approved", description: "Your order has been approved" },
                                  { status: "READY_FOR_DISPATCH", label: "Ready for Dispatch", description: "Your order is packed and ready" },
                                  { status: "DISPATCHED", label: "Order Dispatched", description: "Your order has been dispatched" },
                                  { status: "AT_DESTINATION", label: "At Destination", description: "Your order has reached destination" },
                                  { status: "DELIVERED", label: "Delivered", description: "Your order has been delivered" },
                                  { status: "COMPLETED", label: "Completed", description: "Your order is complete" },
                                ].map((timelineItem, index) => {
                                  const currentStatusIndex = [
                                    "PENDING", "APPROVED", "READY_FOR_DISPATCH", 
                                    "DISPATCHED", "AT_DESTINATION", "DELIVERED", "COMPLETED"
                                  ].indexOf(order.status);
                                  const isCompleted = index <= currentStatusIndex;
                                  const isCurrent = index === currentStatusIndex;

                                  return (
                                    <div key={timelineItem.status} className={`flex items-center gap-3 ${
                                      isCompleted ? 'opacity-100' : 'opacity-40'
                                    }`}>
                                      <div className={`h-6 w-6 rounded-full flex items-center justify-center text-xs ${
                                        isCurrent ? 'bg-primary text-primary-foreground' : 
                                        isCompleted ? 'bg-green-100 text-green-600' : 'bg-muted'
                                      }`}>
                                        {isCompleted ? '✓' : index + 1}
                                      </div>
                                      <div className="flex-1">
                                        <p className={`font-medium text-sm ${isCurrent ? 'text-primary' : ''}`}>
                                          {timelineItem.label}
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                          {timelineItem.description}
                                        </p>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>

                            {/* Order Items */}
                            <div>
                              <h4 className="font-medium mb-3">Order Items</h4>
                              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                {order.orderItems.map((item) => (
                                  <div
                                    key={item.product.id}
                                    className="flex gap-3 rounded-lg bg-white p-3 border"
                                  >
                                    <ImageWithFallback
                                      src={item.product.images[0]}
                                      alt={item.product.name}
                                      className="h-12 w-12 rounded object-cover shrink-0"
                                    />
                                    <div className="min-w-0 flex-1">
                                      <p className="font-medium text-sm truncate">
                                        {item.product.name}
                                      </p>
                                      <p className="text-xs text-muted-foreground">
                                        Qty: {item.quantity}
                                      </p>
                                      {item.price > 0 && (
                                        <p className="text-xs font-medium">
                                          ₹{item.price.toFixed(2)}
                                        </p>
                                      )}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Delivery Details */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                              <div>
                                <h4 className="font-medium mb-2">Delivery Address</h4>
                                <div className="text-sm text-muted-foreground space-y-1 bg-white p-3 rounded-lg border">
                                  {order.consigneeName && (
                                    <p><strong>Consignee:</strong> {order.consigneeName}</p>
                                  )}
                                  {order.consigneePhone && (
                                    <p><strong>Phone:</strong> {order.consigneePhone}</p>
                                  )}
                                  {order.consigneeEmail && (
                                    <p><strong>Email:</strong> {order.consigneeEmail}</p>
                                  )}
                                  <p><strong>Address:</strong> {order.deliveryAddress}</p>
                                  {order.city && <p><strong>City:</strong> {order.city}</p>}
                                  {order.state && <p><strong>State:</strong> {order.state}</p>}
                                  {order.pincode && <p><strong>Pincode:</strong> {order.pincode}</p>}
                                </div>
                              </div>

                              {(order.note || order.packagingInstructions || order.deliveryReference) && (
                                <div>
                                  <h4 className="font-medium mb-2">Additional Information</h4>
                                  <div className="text-sm text-muted-foreground space-y-1 bg-white p-3 rounded-lg border">
                                    {order.note && (
                                      <p><strong>Notes:</strong> {order.note}</p>
                                    )}
                                    {order.packagingInstructions && (
                                      <p><strong>Packaging:</strong> {order.packagingInstructions}</p>
                                    )}
                                    {order.deliveryReference && (
                                      <p><strong>Reference:</strong> {order.deliveryReference}</p>
                                    )}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </>
                );
              })}
            </>
          )}
        </TableBody>
      </Table>

      <ClientOrderDetailsDialog
        order={selectedOrder}
        isOpen={isDialogOpen}
        onClose={() => {
          setIsDialogOpen(false);
          setSelectedOrder(null);
        }}
      />
    </div>
  );
}