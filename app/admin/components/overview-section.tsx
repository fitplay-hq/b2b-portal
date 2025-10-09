import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, BarChart3, AlertTriangle, Clock, CheckCircle } from "lucide-react";

interface OverviewSectionProps {
  pendingOrders: number;
  approvedOrders: number;
  lowStockProducts: number;
  activeClients: number;
  rejectedOrders: number;
  totalOrders: number;
  isWideLayout?: boolean;
}

export function OverviewSection({
  pendingOrders,
  approvedOrders,
  lowStockProducts,
  activeClients,
  totalOrders,
}: OverviewSectionProps) {
  const orderStatusData = [
    { label: 'Approved', value: approvedOrders, color: 'bg-green-500', percentage: (approvedOrders / totalOrders) * 100 },
    { label: 'Pending', value: pendingOrders, color: 'bg-yellow-500', percentage: (pendingOrders / totalOrders) * 100 },
    { label: 'Processing', value: Math.floor(totalOrders * 0.1), color: 'bg-blue-500', percentage: 10 },
  ];

  return (
    <Card className="border border-gray-200 shadow-sm bg-white">
      <CardHeader className="pb-4 border-b border-gray-100">
        <CardTitle className="text-base font-semibold text-gray-900 flex items-center gap-2">
          <BarChart3 className="h-4 w-4 text-blue-600" />
          Order Analytics
        </CardTitle>
        <p className="text-sm text-gray-500 mt-1">Distribution and system status</p>
      </CardHeader>
      <CardContent className="p-4 space-y-6">
        {/* Order Status */}
        <div className="space-y-3">
          {orderStatusData.map((item) => (
            <div key={item.label} className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${item.color}`}></div>
                  <span className="font-medium text-gray-700">{item.label}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-600">{item.value}</span>
                  <span className="text-gray-500 text-xs">{item.percentage.toFixed(1)}%</span>
                </div>
              </div>
              <Progress value={item.percentage} className="h-1.5" />
            </div>
          ))}
        </div>

        {/* System Alerts */}
        <div className="border-t border-gray-100 pt-4 space-y-3">
          <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <TrendingUp className="h-3 w-3 text-green-600" />
            System Status
          </h4>
          <StatusItem
            icon="AlertTriangle"
            title="Low Stock Alert"
            value={lowStockProducts}
            description="Products below minimum threshold"
            color="text-amber-700"
            bgColor="hover:bg-amber-50"
          />
          <StatusItem
            icon="Clock"
            title="Pending Approvals"
            value={pendingOrders}
            description="Orders awaiting review and approval"
            color="text-blue-700"
            bgColor="hover:bg-blue-50"
          />
          <StatusItem
            icon="CheckCircle"
            title="Active Clients"
            value={activeClients}
            description="Clients with recent activity"
            color="text-green-700"
            bgColor="hover:bg-green-50"
          />
        </div>
      </CardContent>
    </Card>
  );
}

function StatusItem({
  icon,
  title,
  value,
  description,
  color,
  bgColor,
}: {
  icon: string;
  title: string;
  value: number;
  description: string;
  color: string;
  bgColor: string;
}) {
  const getIcon = () => {
    switch (icon) {
      case 'AlertTriangle':
        return <AlertTriangle className="h-5 w-5" />;
      case 'Clock':
        return <Clock className="h-5 w-5" />;
      case 'CheckCircle':
        return <CheckCircle className="h-5 w-5" />;
      default:
        return <AlertTriangle className="h-5 w-5" />;
    }
  };

  return (
    <div className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${bgColor}`}>
      <div className={`p-2 rounded-lg bg-gray-100 ${color} flex-shrink-0`}>
        {getIcon()}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <p className={`text-sm font-medium ${color}`}>{title}</p>
          <span className={`text-sm font-bold ${color}`}>{value}</span>
        </div>
        <p className="text-xs text-gray-500">{description}</p>
      </div>
    </div>
  );
}
