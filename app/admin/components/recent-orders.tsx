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
import { Clock, CheckCircle, Download, Package, Building2, XCircle } from "lucide-react";

// This helper function is now co-located with the component that uses it.
const getStatusColor = (status: Order["status"]) => {
  switch (status) {
    case "PENDING":
      return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100/80";
    case "APPROVED":
      return "bg-blue-100 text-blue-800 hover:bg-blue-100/80";
    case "READY_FOR_DISPATCH":
      return "bg-purple-100 text-purple-800 hover:bg-purple-100/80";
    case "DISPATCHED":
      return "bg-indigo-100 text-indigo-800 hover:bg-indigo-100/80";
    case "AT_DESTINATION":
      return "bg-orange-100 text-orange-800 hover:bg-orange-100/80";
    case "DELIVERED":
      return "bg-green-100 text-green-800 hover:bg-green-100/80";
    case "COMPLETED":
      return "bg-green-100 text-green-800 hover:bg-green-100/80";
    case "CANCELLED":
    case "REJECTED":
      return "bg-red-100 text-red-800 hover:bg-red-100/80";
    case "IN_PROGRESS":
      return "bg-purple-100 text-purple-800 hover:bg-purple-100/80";
    default:
      return "bg-gray-100 text-gray-800 hover:bg-gray-100/80";
  }
};

const getStatusIcon = (status: Order["status"]) => {
  switch (status) {
    case "PENDING":
      return Clock;
    case "APPROVED":
      return CheckCircle;
    case "READY_FOR_DISPATCH":
      return Download;
    case "DISPATCHED":
    case "AT_DESTINATION":
      return Package;
    case "DELIVERED":
    case "COMPLETED":
      return Building2;
    case "CANCELLED":
    case "REJECTED":
      return XCircle;
    case "IN_PROGRESS":
      return Package;
    default:
      return Clock;
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
                    {(() => {
                      const StatusIcon = getStatusIcon(order.status);
                      return <StatusIcon className="mr-1 h-3 w-3" />;
                    })()}
                    {formatStatus(order.status)}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  {order.client?.company?.name || "Unknown Company"} •{" "}
                  {new Date(order.createdAt).toLocaleDateString('en-GB')}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}