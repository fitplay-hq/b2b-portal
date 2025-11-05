import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { AlertCircle, Clock, CheckCircle, LucideProps } from "lucide-react";
import { ForwardRefExoticComponent, RefAttributes } from "react";
import {
  PieChart,
  Pie,
  ResponsiveContainer,
  Tooltip,
  Cell,
  Legend
} from 'recharts';
import { useAnalytics } from "@/hooks/use-analytics";

// Colors for pie chart - extended for all possible statuses
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82ca9d', '#ffc658', '#8dd1e1'];

interface OverviewSectionProps {
  pendingOrders: number;
  approvedOrders: number;
  rejectedOrders: number;
  completionRate: number;
  lowStockProducts: number;
  activeClients: number;
  totalOrders: number;
}

export function OverviewSection({
  pendingOrders,
  approvedOrders,
  rejectedOrders,
  lowStockProducts,
  activeClients,
}: OverviewSectionProps) {
  // Use analytics data to get real order status distribution  
  const { data: analyticsData } = useAnalytics({ period: '90d' });
  
  // Define all possible order statuses to ensure they all show up
  const allStatuses = ['PENDING', 'APPROVED', 'CANCELLED', 'READY_FOR_DISPATCH', 'DISPATCHED', 'AT_DESTINATION', 'DELIVERED'];
  
  // Create complete status data with all statuses (even if count is 0)
  const ordersByStatus = allStatuses.reduce((acc, status) => {
    acc[status] = analyticsData?.ordersByStatus?.[status] || 0;
    return acc;
  }, {} as Record<string, number>);
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Order Status Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <PieChart margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
              <Pie
                data={Object.entries(ordersByStatus).map(([status, count]) => ({
                  name: status.replace(/_/g, ' '),
                  value: count,
                  status: status
                }))}
                cx="50%"
                cy="40%"
                outerRadius={90}
                fill="#8884d8"
                dataKey="value"
              >
                {Object.entries(ordersByStatus).map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#fff', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
                formatter={(value: number) => [value, 'Orders']}
              />
              <Legend 
                verticalAlign="bottom" 
                height={80}
                wrapperStyle={{
                  paddingTop: '20px',
                  fontSize: '12px'
                }}
                formatter={(value: string) => (
                  <span style={{ color: '#374151', fontSize: '11px' }}>{value}</span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
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