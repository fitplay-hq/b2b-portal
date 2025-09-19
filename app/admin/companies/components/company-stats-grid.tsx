import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, Users, Package } from "lucide-react";
import type { LucideIcon } from "lucide-react";

// Props for the new, reusable StatCard sub-component
interface StatCardProps {
  title: string;
  value: number;
  description: string;
  Icon: LucideIcon;
}

/**
 * A reusable StatCard sub-component to display a single metric.
 */
function StatCard({ title, value, description, Icon }: StatCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}

// Props for the main grid component
interface CompanyStatsGridProps {
  totalCompanies: number;
  totalClients: number;
  avgProductsPerCompany: number;
}

/**
 * The main CompanyStatsGrid component, matching the client's design pattern.
 */
export function CompanyStatsGrid({
  totalCompanies,
  totalClients,
  avgProductsPerCompany,
}: CompanyStatsGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <StatCard
        title="Total Companies"
        value={totalCompanies}
        description="Registered companies"
        Icon={Building2}
      />
      <StatCard
        title="Total Clients"
        value={totalClients}
        description="Across all companies"
        Icon={Users}
      />
      <StatCard
        title="Avg Products/Company"
        value={avgProductsPerCompany}
        description="Average product access"
        Icon={Package}
      />
    </div>
  );
}
