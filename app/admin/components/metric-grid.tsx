import { ShoppingCart, Clock, TrendingUp, Users } from "lucide-react";
import { MetricCard } from "./metric-card";

interface MetricsGridProps {
  totalOrders: number;
  pendingOrders: number;
  totalRevenue: number;
  activeClients: number;
}

export function MetricsGrid({
  totalOrders,
  pendingOrders,
  totalRevenue,
  activeClients,
}: MetricsGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <MetricCard
        title="Total Orders"
        value={totalOrders}
        description="All time orders"
        Icon={ShoppingCart}
      />
      <MetricCard
        title="Pending Orders"
        value={pendingOrders}
        description="Need approval"
        Icon={Clock}
      />
      <MetricCard
        title="Total Revenue"
        value={`₹${totalRevenue.toFixed(2)}`}
        description="From all orders"
        Icon={TrendingUp}
      />
      <MetricCard
        title="Active Clients"
        value={activeClients}
        description="Registered clients"
        Icon={Users}
      />
    </div>
  );
}
