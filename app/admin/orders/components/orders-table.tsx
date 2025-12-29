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
import { Edit, Eye, Package, MapPin, User, Calendar, IndianRupee } from "lucide-react";
import { AdminOrder } from "@/data/order/admin.actions";
import { formatStatus } from "@/lib/utils";
import { usePermissions } from "@/hooks/use-permissions";

interface OrdersTableProps {
  orders: AdminOrder[];
  onStatusUpdate?: (order: AdminOrder) => void;
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
      return 'bg-green-100 text-green-800 hover:bg-green-100/80';
    case 'CANCELLED':
      return 'bg-red-100 text-red-800 hover:bg-red-100/80';
    default:
      return 'bg-gray-100 text-gray-800 hover:bg-gray-100/80';
  }
};

export function OrdersTable({ orders, onStatusUpdate, expandedOrders, onToggleOrder }: OrdersTableProps) {
  const { actions } = usePermissions();

  const handleStatusUpdate = (order: AdminOrder) => {
    if (onStatusUpdate) {
      onStatusUpdate(order);
    }
  };

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
            <TableHead>Client</TableHead>
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
              <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                No orders found
              </TableCell>
            </TableRow>
          ) : (
            orders.map((order) => (
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
                  </div>
                </TableCell>
                
                <TableCell>
                  <div className="space-y-1">
                    <div className="font-medium text-sm">{order.client.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {order.client.companyName || order.client.company.name}
                    </div>
                    <div className="text-xs text-muted-foreground">{order.client.email}</div>
                  </div>
                </TableCell>
                
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Package className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">
                      {order.orderItems.length} items
                    </span>
                  </div>
                  {expandedOrders?.has(order.id) && (
                    <div className="mt-2 space-y-1">
                      {order.orderItems.slice(0, 3).map((item, idx) => (
                        <div key={idx} className="text-xs text-muted-foreground">
                          {item.product.name} x{item.quantity}
                        </div>
                      ))}
                      {order.orderItems.length > 3 && (
                        <div className="text-xs text-muted-foreground">
                          +{order.orderItems.length - 3} more items
                        </div>
                      )}
                    </div>
                  )}
                </TableCell>
                
                <TableCell>
                  <div className="flex items-center gap-1 font-medium">
                    <IndianRupee className="h-3 w-3" />
                    {order.totalAmount.toLocaleString()}
                  </div>
                </TableCell>
                
                <TableCell>
                  <div className="space-y-1">
                    <div className="flex items-center gap-1 text-xs">
                      <MapPin className="h-3 w-3 text-muted-foreground" />
                      <span className="font-medium">{order.consigneeName}</span>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {order.city}, {order.state}
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {order.modeOfDelivery}
                    </Badge>
                  </div>
                </TableCell>
                
                <TableCell>
                  <Badge className={`text-xs ${getStatusColor(order.status)}`}>
                    {formatStatus(order.status)}
                  </Badge>
                </TableCell>
                
                <TableCell className="text-right">
                  <div className="flex items-center justify-end">
                    {actions.orders.edit && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleStatusUpdate(order)}
                        className="h-8 px-3 text-xs font-medium"
                      >
                        Update Status
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}