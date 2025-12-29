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
  const handleToggleOrder = (orderId: string) => {
    if (onToggleOrder) {
      onToggleOrder(orderId);
    }
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Order Details</TableHead>
            <TableHead>Items</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Delivery</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                No orders found
              </TableCell>
            </TableRow>
          ) : (
            <>
              {orders.map((order) => {
                const isExpanded = expandedOrders?.has(order.id) || false;
                return (
                  <>
                    <TableRow key={order.id} className="group">
                      <TableCell>
                        <div className="space-y-1">
                          <div className="font-medium text-sm">{order.id}</div>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Calendar className="h-3 w-3" />
                            {new Date(order.createdAt).toLocaleDateString()}
                          </div>
                          {order.consignmentNumber && (
                            <div className="text-xs text-blue-600 font-mono">
                              AWB: {order.consignmentNumber}
                            </div>
                          )}
                          <div className="text-xs text-muted-foreground">
                            Required: {new Date(order.requiredByDate).toLocaleDateString()}
                          </div>
                        </div>
                      </TableCell>
                      
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center gap-1 text-sm">
                            <Package className="h-3 w-3" />
                            {order.orderItems.length} item{order.orderItems.length !== 1 ? 's' : ''}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Total Qty: {order.orderItems.reduce((sum, item) => sum + item.quantity, 0)}
                          </div>
                        </div>
                      </TableCell>
                      
                      <TableCell>
                        {order.totalAmount > 0 && (
                          <div className="flex items-center gap-1 text-sm font-medium">
                            <IndianRupee className="h-3 w-3" />
                            {order.totalAmount.toFixed(2)}
                          </div>
                        )}
                      </TableCell>
                      
                      <TableCell>
                        <div className="space-y-1 max-w-[200px]">
                          <div className="flex items-center gap-1 text-xs">
                            <MapPin className="h-3 w-3" />
                            {order.city && order.state ? `${order.city}, ${order.state}` : 'Address on file'}
                          </div>
                          {order.modeOfDelivery && (
                            <div className="text-xs text-muted-foreground">
                              {order.modeOfDelivery}
                            </div>
                          )}
                          {order.deliveryService && (
                            <div className="text-xs text-blue-600">
                              {order.deliveryService}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      
                      <TableCell>
                        <div className="space-y-1">
                          <Badge className={getStatusColor(order.status)} variant="outline">
                            {formatStatus(order.status)}
                          </Badge>
                          <div className="text-xs text-muted-foreground max-w-[150px]">
                            {getStatusDescription(order.status)}
                          </div>
                        </div>
                      </TableCell>
                      
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleToggleOrder(order.id)}
                            className="h-8 w-8 p-0"
                          >
                            {isExpanded ? (
                              <ChevronUp className="h-4 w-4" />
                            ) : (
                              <ChevronDown className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                    
                    {/* Expanded Row */}
                    {isExpanded && (
                      <TableRow>
                        <TableCell colSpan={6} className="bg-muted/20 p-0">
                          <div className="p-4 space-y-4">
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
    </div>
  );
}