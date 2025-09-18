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
import { AdminOrder } from "@/data/order/admin.actions";
import { Order } from "@/lib/generated/prisma";
import { formatStatus } from "@/lib/utils";

// This helper function is now co-located with the component that uses it.
const getStatusColor = (status: Order["status"]) => {
  switch (status) {
    case "PENDING":
      return "border-transparent bg-yellow-100 text-yellow-800 hover:bg-yellow-100/80";
    case "APPROVED":
      return "border-transparent bg-green-100 text-green-800 hover:bg-green-100/80";
    default:
      return "border-transparent bg-gray-100 text-gray-800 hover:bg-gray-100/80";
  }
};

interface RecentOrdersProps {
  orders: AdminOrder[];
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
              Latest dispatch orders from clients
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
                  <p className="font-medium">{order.id}</p>
                  <Badge className={getStatusColor(order.status)}>
                    {formatStatus(order.status)}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  {order.client.companyName} •{" "}
                  {new Date(order.createdAt).toLocaleDateString()}
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
