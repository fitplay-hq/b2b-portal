import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { AlertCircle, Clock, CheckCircle, LucideProps } from "lucide-react";
import { ForwardRefExoticComponent, RefAttributes } from "react";

interface OverviewSectionProps {
  pendingOrders: number;
  approvedOrders: number; // Assuming you'd calculate this in the hook too
  completionRate: number;
  lowStockProducts: number;
  activeClients: number;
  rejectedOrders: number;
}

export function OverviewSection({
  pendingOrders,
  completionRate,
  lowStockProducts,
  activeClients,
}: OverviewSectionProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Order Status Distribution</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {/* ... status details ... */}
          <div className="pt-2">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm">Completion Rate</span>
              <span className="text-sm font-medium">
                {completionRate.toFixed(1)}%
              </span>
            </div>
            <Progress value={completionRate} className="h-2" />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>System Alerts</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <AlertItem
            Icon={AlertCircle}
            title="Low Stock Items"
            description={`${lowStockProducts} products below 50 units`}
            color="yellow"
          />
          <AlertItem
            Icon={Clock}
            title="Pending Approvals"
            description={`${pendingOrders} orders awaiting review`}
            color="blue"
          />
          <AlertItem
            Icon={CheckCircle}
            title="Active Clients"
            description={`${activeClients} clients actively ordering`}
            color="green"
          />
        </CardContent>
      </Card>
    </div>
  );
}

// Sub-component for alert items
function AlertItem({
  Icon,
  title,
  description,
  color,
}: {
  Icon: ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
  >;
  title: string;
  description: string;
  color: "yellow" | "blue" | "green";
}) {
  const colors = {
    yellow: "bg-yellow-50 text-yellow-600",
    blue: "bg-blue-50 text-blue-600",
    green: "bg-green-50 text-green-600",
  };
  return (
    <div className={`flex items-center gap-3 p-3 rounded-lg ${colors[color]}`}>
      <Icon className="h-5 w-5" />
      <div>
        <p className="text-sm font-medium">{title}</p>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}