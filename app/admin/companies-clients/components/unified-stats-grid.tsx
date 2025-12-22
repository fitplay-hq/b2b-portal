import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, Users, Package, BarChart3 } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: number;
  description: string;
  Icon: LucideIcon;
  iconColor?: string;
}

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

interface UnifiedStatsGridProps {
  totalCompanies: number;
  totalClients: number;
  totalProducts: number;
  avgProductsPerCompany: number;
}

export function UnifiedStatsGrid({
  totalCompanies,
  totalClients,
  totalProducts,
  avgProductsPerCompany,
}: UnifiedStatsGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard
        title="Total Companies"
        value={totalCompanies}
        description="Registered companies"
        Icon={Building2}
        iconColor="text-blue-600"
      />
      <StatCard
        title="Total Clients"
        value={totalClients}
        description="Client users (POCs)"
        Icon={Users}
        iconColor="text-green-600"
      />
      <StatCard
        title="Assigned Products"
        value={totalProducts}
        description="Products across companies"
        Icon={Package}
        iconColor="text-purple-600"
      />
      <StatCard
        title="Avg Products/Company"
        value={avgProductsPerCompany}
        description="Average product access"
        Icon={BarChart3}
        iconColor="text-orange-600"
      />
    </div>
  );
}

