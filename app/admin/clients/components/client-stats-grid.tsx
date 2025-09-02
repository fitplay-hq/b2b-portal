import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Building2 } from "lucide-react";
import type { LucideIcon } from "lucide-react";

// Props for the new, reusable StatCard sub-component
interface StatCardProps {
  title: string;
  value: number;
  description: string;
  Icon: LucideIcon;
  iconColor?: string;
}

/**
 * A new reusable StatCard sub-component to display a single metric.
 * It's defined here because it's only used by the ClientStatsGrid.
 */
function StatCard({
  title,
  value,
  description,
  Icon,
  iconColor,
}: StatCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className={`h-4 w-4 ${iconColor || "text-muted-foreground"}`} />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}

// Props for the main grid component
interface ClientStatsGridProps {
  totalClients: number;
  activeClients: number;
  inactiveClients: number;
}

/**
 * The main ClientStatsGrid component, now cleaner and more declarative.
 */
export function ClientStatsGrid({
  totalClients,
  activeClients,
  inactiveClients,
}: ClientStatsGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <StatCard
        title="Total Clients"
        value={totalClients}
        description="Registered accounts"
        Icon={Users}
      />
      <StatCard
        title="Active Clients"
        value={activeClients}
        description="Can place orders"
        Icon={Building2}
        iconColor="text-green-600"
      />
      <StatCard
        title="Inactive Clients"
        value={inactiveClients}
        description="Access suspended"
        Icon={Building2}
        iconColor="text-red-600"
      />
    </div>
  );
}
