import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Clock, CheckCircle } from "lucide-react";
import type { LucideIcon } from "lucide-react";

// Props for a single reusable StatCard
interface StatCardProps {
  title: string;
  value: string | number;
  description: string;
  Icon: LucideIcon;
  iconColor?: string;
}

// Reusable sub-component for a single stat card
function StatCard({
  title,
  value,
  description,
  Icon,
  iconColor,
}: StatCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-3 sm:p-6">
        <CardTitle className="text-xs sm:text-sm font-medium leading-tight">{title}</CardTitle>
        <Icon className={`h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0 ${iconColor || "text-muted-foreground"}`} />
      </CardHeader>
      <CardContent className="p-3 sm:p-6 pt-0">
        <div className="text-lg sm:text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground leading-tight">{description}</p>
      </CardContent>
    </Card>
  );
}

// Props for the main grid component
interface OrderStatsGridProps {
  totalOrders: number;
  pendingOrders: number;
  completedOrders: number;
  totalRevenue: number;
}

export function OrderStatsGrid({
  totalOrders,
  pendingOrders,
  completedOrders,
  totalRevenue,
}: OrderStatsGridProps) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 md:gap-6 md:grid-cols-2 lg:grid-cols-4">
      <StatCard
        title="Total Orders"
        value={totalOrders}
        description="All dispatch orders"
        Icon={FileText}
      />
      <StatCard
        title="Pending Approval"
        value={pendingOrders}
        description="Need review"
        Icon={Clock}
        iconColor="text-yellow-600"
      />
      <StatCard
        title="Completed"
        value={completedOrders}
        description="Delivered"
        Icon={CheckCircle}
        iconColor="text-green-600"
      />
      <StatCard
        title="Order Metrics"
        value={totalRevenue.toFixed(0)}
        description="Order count metrics"
        Icon={FileText}
      />
    </div>
  );
}
