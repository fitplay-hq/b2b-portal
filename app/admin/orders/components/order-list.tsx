import { PurchaseOrder } from "@/lib/mockData";
import { Card, CardContent } from "@/components/ui/card";
import { FileText } from "lucide-react";
import { OrderCard } from "./order-card";
import { AdminOrder } from "@/data/order/admin.actions";

interface OrderListProps {
  orders: AdminOrder[];
  expandedOrders: Set<string>;
  toggleOrderExpansion: (orderId: string) => void;
  openStatusDialog: (order: AdminOrder) => void;
}

export function OrderList({ orders, ...props }: OrderListProps) {
  if (orders.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium">No orders found</h3>
          <p className="text-muted-foreground">
            Try adjusting your search or filter criteria.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <OrderCard
          key={order.id}
          order={order}
          isExpanded={props.expandedOrders.has(order.id)}
          onToggleExpansion={() => props.toggleOrderExpansion(order.id)}
          onOpenStatusDialog={() => props.openStatusDialog(order)}
        />
      ))}
    </div>
  );
}
