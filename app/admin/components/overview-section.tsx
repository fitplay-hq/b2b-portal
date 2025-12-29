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
import { AdminOrder } from "@/data/order/admin.actions";

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
  recentOrders: AdminOrder[];
  allOrders: AdminOrder[];
}

export function OverviewSection({
  pendingOrders,
  lowStockProducts,
  activeClients,
  allOrders
}: OverviewSectionProps) {
  // Calculate order status distribution from ALL orders data
  const allStatuses = ['PENDING', 'APPROVED', 'CANCELLED', 'READY_FOR_DISPATCH', 'DISPATCHED', 'AT_DESTINATION', 'DELIVERED'];
  
  // Create status distribution from all available orders
  const ordersByStatus = allStatuses.reduce((acc, status) => {
    acc[status] = allOrders.filter(order => order.status === status).length;
    return acc;
  }, {} as Record<string, number>);
  
  // Filter out statuses with 0 orders for cleaner chart display
  const chartData = Object.entries(ordersByStatus)
    .filter(([status, count]) => count > 0)
    .map(([status, count]) => ({
      name: status.replace(/_/g, ' '),
      value: count,
      status: status
    }));
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <Card className="overflow-hidden">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Order Status Overview</CardTitle>
        </CardHeader>
        <CardContent className="p-3">
          <ResponsiveContainer width="100%" height={350}>
            <PieChart margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
              <Pie
                data={chartData}
                cx="50%"
                cy="45%"
                outerRadius={100}
                innerRadius={0}
                fill="#8884d8"
                dataKey="value"
              >
                {chartData.map((entry, index) => (
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
                height={60}
                wrapperStyle={{
                  paddingTop: '10px',
                  fontSize: '11px',
                  lineHeight: '1.2'
                }}
                formatter={(value: string) => (
                  <span style={{ color: '#374151', fontSize: '10px' }}>{value}</span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      <Card className="overflow-hidden">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">System Alerts</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 p-3">
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
    <div className={`flex items-center gap-2 p-2.5 rounded-lg ${colors[color]}`}>
      <Icon className="h-4 w-4 flex-shrink-0" />
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium leading-tight">{title}</p>
        <p className="text-xs text-muted-foreground leading-tight">{description}</p>
      </div>
    </div>
  );
}