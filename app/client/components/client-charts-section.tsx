import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, ResponsiveContainer, Tooltip, Cell, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

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
  const hasOrders = orderStatusDistribution.length > 0;
  const hasValueData = orderValueTrends.some(trend => trend.value > 0);
  const hasTrendData = monthlyTrends.some(trend => trend.orders > 0);

  // Sample data for demonstration when no real data exists
  const sampleTrends = [
    { month: "Jan", orders: 5, delivered: 4 },
    { month: "Feb", orders: 8, delivered: 7 },
    { month: "Mar", orders: 12, delivered: 10 },
    { month: "Apr", orders: 6, delivered: 5 },
    { month: "May", orders: 15, delivered: 13 },
    { month: "Jun", orders: 10, delivered: 9 },
  ];

  const displayTrends = hasTrendData ? monthlyTrends : sampleTrends;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Order Status Distribution */}
      <Card className="shadow-sm border-0 bg-white/50 backdrop-blur-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-semibold text-gray-900 flex items-center justify-between">
            Order Status Distribution
            {!hasOrders && (
              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-normal">
                Sample View
              </span>
            )}
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
            <div className="relative">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={[
                      { name: 'Pending', value: 3, color: '#f59e0b' },
                      { name: 'Approved', value: 5, color: '#3b82f6' },
                      { name: 'Dispatched', value: 2, color: '#8b5cf6' },
                      { name: 'Delivered', value: 7, color: '#10b981' },
                    ]}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    innerRadius={40}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    <Cell fill="#f59e0b" />
                    <Cell fill="#3b82f6" />
                    <Cell fill="#8b5cf6" />
                    <Cell fill="#10b981" />
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
              <div className="absolute inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm rounded-lg">
                <div className="text-center p-4">
                  <div className="text-2xl mb-2">📊</div>
                  <p className="font-medium text-gray-700">Start placing orders</p>
                  <p className="text-sm text-gray-500">Your order analytics will appear here</p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Monthly Order Trends */}
      <Card className="shadow-sm border-0 bg-white/50 backdrop-blur-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-semibold text-gray-900 flex items-center justify-between">
            6-Month Order Trends
            {!hasTrendData && (
              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-normal">
                Sample View
              </span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={displayTrends} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
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
                  opacity={hasTrendData ? 1 : 0.6}
                />
                <Bar 
                  dataKey="delivered" 
                  fill="#10b981" 
                  radius={[6, 6, 0, 0]}
                  name="Delivered Orders"
                  opacity={hasTrendData ? 1 : 0.6}
                />
              </BarChart>
            </ResponsiveContainer>
            {!hasTrendData && (
              <div className="absolute inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm rounded-lg">
                <div className="text-center p-4">
                  <div className="text-2xl mb-2">📈</div>
                  <p className="font-medium text-gray-700">Build your order history</p>
                  <p className="text-sm text-gray-500">Monthly trends will show here</p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Order Value Trends - Show for all clients with appropriate messaging */}
      <Card className="shadow-sm border-0 bg-white/50 backdrop-blur-sm lg:col-span-2">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-semibold text-gray-900 flex items-center justify-between">
            Monthly Order Value Trends
            {!hasValueData && (
              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-normal">
                Sample View
              </span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart 
                data={hasValueData ? orderValueTrends : [
                  { month: "Jan", value: 25000 },
                  { month: "Feb", value: 35000 },
                  { month: "Mar", value: 28000 },
                  { month: "Apr", value: 42000 },
                  { month: "May", value: 38000 },
                  { month: "Jun", value: 45000 },
                ]} 
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
                  opacity={hasValueData ? 1 : 0.6}
                />
              </BarChart>
            </ResponsiveContainer>
            {!hasValueData && (
              <div className="absolute inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm rounded-lg">
                <div className="text-center p-4">
                  <div className="text-2xl mb-2">💰</div>
                  <p className="font-medium text-gray-700">Track your business growth</p>
                  <p className="text-sm text-gray-500">Order value analytics will appear here</p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}