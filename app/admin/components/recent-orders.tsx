import Link from "next/link";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PurchaseOrder } from "@/lib/mockData";

// This helper function is now co-located with the component that uses it.
const getStatusColor = (status: PurchaseOrder["status"]) => {
  switch (status) {
    case "pending":
      return "border-transparent bg-yellow-100 text-yellow-800 hover:bg-yellow-100/80";
    case "approved":
      return "border-transparent bg-blue-100 text-blue-800 hover:bg-blue-100/80";
    case "completed":
      return "border-transparent bg-green-100 text-green-800 hover:bg-green-100/80";
    default:
      return "border-transparent bg-gray-100 text-gray-800 hover:bg-gray-100/80";
  }
};

interface RecentOrdersProps {
  orders: PurchaseOrder[];
}

export function RecentOrders({ orders }: RecentOrdersProps) {
  // The component won't render at all if there are no orders.
  if (orders.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Recent Orders</CardTitle>
            <CardDescription>
              Latest purchase orders from clients
            </CardDescription>
          </div>
          <Button asChild variant="outline" size="sm">
            <Link href="/admin/orders">View All</Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {orders.map((order) => (
            <div
              key={order.id}
              className="flex flex-wrap items-center justify-between gap-2 rounded-lg border p-3"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-3">
                  <p className="font-medium">{order.poNumber}</p>
                  <Badge className={getStatusColor(order.status)}>
                    {order.status.charAt(0).toUpperCase() +
                      order.status.slice(1)}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  {order.company} •{" "}
                  {new Date(order.createdAt).toLocaleDateString()} • $
                  {order.total.toFixed(2)}
                </p>
              </div>
              <Button asChild variant="secondary" size="sm">
                {/* This link should ideally go to the specific order's detail page */}
                <Link href={`/admin/orders/${order.id}`}>View Details</Link>
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
