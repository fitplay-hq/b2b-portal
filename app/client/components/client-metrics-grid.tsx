import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShoppingCart, Package, TrendingUp, CheckCircle } from "lucide-react";

interface ClientMetricsProps {
  totalOrders: number;
  pendingOrders: number;
  deliveredOrders: number;
  totalProducts: number;
  deliveryRate: number;
  approvalRate: number;
}

export function ClientMetricsGrid({
  totalOrders,
  pendingOrders,
  deliveredOrders,
  totalProducts,
  deliveryRate,
  approvalRate
}: ClientMetricsProps) {
  const metrics = [
    {
      title: "Total Orders",
      value: totalOrders,
      description: "All time orders",
      icon: ShoppingCart,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Pending Orders",
      value: pendingOrders,
      description: "Awaiting approval",
      icon: Package,
      color: "text-amber-600",
      bgColor: "bg-amber-50",
    },
    {
      title: "Delivered Orders",
      value: deliveredOrders,
      description: "Successfully completed",
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Available Products",
      value: totalProducts,
      description: "Products in catalog",
      icon: Package,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      title: "Delivery Rate",
      value: `${Math.round(deliveryRate)}%`,
      description: "Order completion rate",
      icon: TrendingUp,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
    },
    {
      title: "Approval Rate",
      value: `${Math.round(approvalRate)}%`,
      description: "Orders approved",
      icon: CheckCircle,
      color: "text-indigo-600",
      bgColor: "bg-indigo-50",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {metrics.map((metric) => {
        const IconComponent = metric.icon;
        return (
          <Card key={metric.title} className="border-0 shadow-sm bg-white/50 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                {metric.title}
              </CardTitle>
              <div className={`p-2 rounded-lg ${metric.bgColor}`}>
                <IconComponent className={`h-4 w-4 ${metric.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{metric.value}</div>
              <p className="text-xs text-gray-500 mt-1">{metric.description}</p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}