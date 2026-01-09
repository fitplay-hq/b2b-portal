import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, ResponsiveContainer, Tooltip, Cell, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { useEffect, useState } from 'react';

interface ClientChartsProps {
  orderStatusDistribution: Array<{
    name: string;
    value: number;
    color: string;
  }>;
  monthlyTrends: Array<{
    month: string;
    orders: number;
    delivered: number;
  }>;
  orderValueTrends: Array<{
    month: string;
    value: number;
  }>;
}

export function ClientChartsSection({ 
  orderStatusDistribution, 
  monthlyTrends,
  orderValueTrends 
}: ClientChartsProps) {
  const [isMounted, setIsMounted] = useState(false);

  // Ensure component is mounted before rendering charts (fixes hydration/SSR issues)
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const hasOrders = orderStatusDistribution.length > 0;
  const hasValueData = orderValueTrends.some(trend => trend.value > 0);
  const hasTrendData = monthlyTrends.some(trend => trend.orders > 0);

  // Don't render charts until mounted (prevents SSR issues)
  if (!isMounted) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-sm border-0 bg-white/50 backdrop-blur-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-semibold text-gray-900">
              Order Status Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center h-[300px]">
              <div className="animate-pulse text-gray-400">Loading chart...</div>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-sm border-0 bg-white/50 backdrop-blur-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-semibold text-gray-900">
              6-Month Order Trends
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center h-[300px]">
              <div className="animate-pulse text-gray-400">Loading chart...</div>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-sm border-0 bg-white/50 backdrop-blur-sm lg:col-span-2">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-semibold text-gray-900">
              Monthly Order Value Trends
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center h-[300px]">
              <div className="animate-pulse text-gray-400">Loading chart...</div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Order Status Distribution */}
      <Card className="shadow-sm border-0 bg-white/50 backdrop-blur-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-semibold text-gray-900">
            Order Status Distribution
          </CardTitle>
        </CardHeader>
        <CardContent>
          {hasOrders ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={orderStatusDistribution}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  innerRadius={40}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {orderStatusDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#fff', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '12px',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                  }}
                  formatter={(value: number) => [value, 'Orders']}
                />
                <Legend 
                  verticalAlign="bottom" 
                  height={36}
                  formatter={(value: string) => (
                    <span className="text-sm text-gray-600">{value}</span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-[300px]">
            </div>
          )}
        </CardContent>
      </Card>

      {/* Monthly Order Trends */}
      <Card className="shadow-sm border-0 bg-white/50 backdrop-blur-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-semibold text-gray-900">
            6-Month Order Trends
          </CardTitle>
        </CardHeader>
        <CardContent>
          {hasTrendData ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyTrends} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                <XAxis 
                  dataKey="month" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: '#6b7280' }}
                />
                <YAxis 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: '#6b7280' }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#fff', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '12px',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Bar 
                  dataKey="orders" 
                  fill="#3b82f6" 
                  radius={[6, 6, 0, 0]}
                  name="Total Orders"
                />
                <Bar 
                  dataKey="delivered" 
                  fill="#10b981" 
                  radius={[6, 6, 0, 0]}
                  name="Delivered Orders"
                />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-[300px]">
            </div>
          )}
        </CardContent>
      </Card>

      {/* Order Value Trends - Show for all clients with appropriate messaging */}
      <Card className="shadow-sm border-0 bg-white/50 backdrop-blur-sm lg:col-span-2">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-semibold text-gray-900">
            Monthly Order Value Trends
          </CardTitle>
        </CardHeader>
        <CardContent>
          {hasValueData ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart 
                data={orderValueTrends} 
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                <XAxis 
                  dataKey="month" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: '#6b7280' }}
                />
                <YAxis 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: '#6b7280' }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#fff', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '12px',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                  }}
                  formatter={(value: number) => [`₹${value.toLocaleString()}`, 'Order Value']}
                />
                <Bar 
                  dataKey="value" 
                  fill="#8b5cf6" 
                  radius={[6, 6, 0, 0]}
                  name="Order Value"
                />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-[300px]">
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}