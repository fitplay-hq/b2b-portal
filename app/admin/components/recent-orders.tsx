import Link from "next/link";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AdminOrder } from "@/data/order/admin.actions";
import { Order } from "@/lib/generated/prisma";
import { formatStatus } from "@/lib/utils";
import { ArrowUpRight, Clock, CheckCircle, AlertCircle, ShoppingCart } from "lucide-react";

const getStatusConfig = (status: Order["status"]) => {
  switch (status) {
    case "PENDING":
      return {
        color: "bg-yellow-100 text-yellow-800 border-yellow-200",
        icon: Clock,
        dotColor: "bg-yellow-500"
      };
    case "APPROVED":
      return {
        color: "bg-green-100 text-green-800 border-green-200",
        icon: CheckCircle,
        dotColor: "bg-green-500"
      };
    default:
      return {
        color: "bg-gray-100 text-gray-800 border-gray-200",
        icon: AlertCircle,
        dotColor: "bg-gray-500"
      };
  }
};

interface RecentOrdersProps {
  orders: AdminOrder[];
}

export function RecentOrders({ orders }: RecentOrdersProps) {
  if (orders.length === 0) {
    return null;
  }

  return (
    <Card className="border border-gray-200 shadow-sm bg-white rounded-2xl">
      <CardHeader className="pb-6 px-8 pt-8 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl font-semibold text-gray-900 flex items-center gap-3">
              <div className="p-2 bg-blue-50 rounded-xl">
                <ShoppingCart className="h-5 w-5 text-blue-600" />
              </div>
              Recent Orders
            </CardTitle>
            <p className="text-sm text-gray-500 mt-2">
              Latest orders from your clients
            </p>
          </div>
          <Button asChild variant="outline" size="sm" className="border-blue-200 text-blue-600 hover:text-blue-700 hover:bg-blue-50 hover:border-blue-300">
            <Link href="/admin/orders" className="flex items-center gap-2">
              View All Orders
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y divide-gray-100">
          {orders.map((order) => {
            const statusConfig = getStatusConfig(order.status);
            const StatusIcon = statusConfig.icon;
            
            return (
              <div
                key={order.id}
                className="flex items-center justify-between p-6 hover:bg-gray-50 transition-all duration-200 group"
              >
                <div className="flex items-center gap-4 flex-1">
                  <div className={`w-3 h-3 rounded-full ${statusConfig.dotColor} shadow-sm`}></div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <p className="font-semibold text-gray-900 text-base">#{order.id}</p>
                      <Badge className={`${statusConfig.color} text-xs px-3 py-1 font-medium rounded-full flex items-center gap-1.5`}>
                        <StatusIcon className="h-3 w-3" />
                        {formatStatus(order.status)}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-600">
                      <span className="truncate font-medium">
                        {order.client?.company?.name || "Unknown Company"}
                      </span>
                      <span className="text-gray-400">•</span>
                      <span className="text-xs font-medium">
                        {new Date(order.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </span>
                    </div>
                  </div>
                </div>
                <Button asChild variant="ghost" size="sm" className="h-8 px-2 text-xs text-gray-600 hover:text-gray-900">
                  <Link href={`/admin/orders/${order.id}`} className="flex items-center gap-1">
                    <ArrowUpRight className="h-3 w-3" />
                  </Link>
                </Button>
              </div>
            );
          })}
        </div>
        
        {orders.length === 0 && (
          <div className="p-8 text-center">
            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <ShoppingCart className="h-6 w-6 text-gray-400" />
            </div>
            <p className="text-sm font-medium text-gray-900 mb-1">No orders yet</p>
            <p className="text-xs text-gray-500">Orders will appear here once clients start placing them.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
