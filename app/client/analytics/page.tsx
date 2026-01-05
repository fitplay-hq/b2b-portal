'use client';

import { useState } from 'react';
import Layout from "@/components/layout";
import { 
  Download, 
  Filter, 
  TrendingUp, 
  Package, 
  ShoppingCart, 
  DollarSign,
  AlertCircle,
  RefreshCw,
  RotateCcw,
  FileSpreadsheet,
  Calendar as CalendarIcon,
  FileText,
  ChevronDown,
  BarChart3
} from 'lucide-react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAnalytics, type AnalyticsFilters } from '@/hooks/use-analytics';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7c7c', '#8dd1e1'];

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

const formatNumber = (num: number) => {
  return new Intl.NumberFormat('en-US').format(num);
};

const exportToCSV = (data: any[], filename: string, type: 'orders' | 'inventory') => {
  if (data.length === 0) return;
  
  let headers: string[];
  let rows: string[][];

  if (type === 'orders') {
    headers = ['Order ID', 'Status', 'Total Amount', 'Created Date', 'Item Count'];
    rows = data.map(order => [
      order.id,
      order.status,
      order.totalAmount?.toString() || '0',
      new Date(order.createdAt).toLocaleDateString(),
      order.itemCount?.toString() || '0'
    ]);
  } else {
    headers = ['Product ID', 'Name', 'Category', 'Stock Quantity', 'Unit Price', 'Companies'];
    rows = data.map(item => [
      item.id,
      item.name,
      item.category || 'N/A',
      item.stockQuantity?.toString() || '0',
      item.unitPrice?.toString() || '0',
      item.companyNames || 'N/A'
    ]);
  }

  const csvContent = [headers, ...rows]
    .map(row => row.map(cell => `"${cell}"`).join(','))
    .join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};

export default function ClientAnalyticsPage() {
  const [filters, setFilters] = useState<AnalyticsFilters>({
    period: '30d'
  });
  
  const [dateRange, setDateRange] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({
    from: undefined,
    to: undefined,
  });
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();
  const [exportingOrders, setExportingOrders] = useState<string | null>(null); // 'xlsx' or 'pdf' or null
  const [exportingInventory, setExportingInventory] = useState<string | null>(null); // 'xlsx' or 'pdf' or null

  const [calendarOpen, setCalendarOpen] = useState(false);

  const { data: analytics, error, isLoading, mutate, exportData } = useAnalytics('/api/clients/analytics', filters);

  const applyDateRange = () => {
    if (startDate && endDate) {
      setFilters(prev => ({
        ...prev,
        dateFrom: startDate.toISOString(),
        dateTo: endDate.toISOString(),
        period: undefined // Clear period when custom range is set
      }));
      // Also update dateRange for any other components that might use it
      setDateRange({ from: startDate, to: endDate });
    }
    setCalendarOpen(false);
  };

  const clearDateRange = () => {
    setDateRange({ from: undefined, to: undefined });
    setStartDate(undefined);
    setEndDate(undefined);
    setFilters(prev => ({
      ...prev,
      dateFrom: undefined,
      dateTo: undefined,
      period: '30d'
    }));
  };

  const resetAllFilters = () => {
    setDateRange({ from: undefined, to: undefined });
    setStartDate(undefined);
    setEndDate(undefined);
    setFilters({
      period: '30d'
    });
  };

  const refreshData = () => {
    mutate();
  };

  if (error) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2 text-red-600">
              <AlertCircle className="h-5 w-5" />
              <span>Failed to load analytics data</span>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const orderStatusData = analytics?.ordersByStatus ? Object.entries(analytics.ordersByStatus).map(([status, count]) => ({
    name: status.charAt(0).toUpperCase() + status.slice(1),
    value: count as number
  })) : [];

  const inventoryStatusData = analytics?.inventoryStatus ? [
    { name: 'In Stock', value: analytics.inventoryStatus.inStock, color: '#22c55e' },
    { name: 'Low Stock', value: analytics.inventoryStatus.lowStock, color: '#f59e0b' },
    { name: 'Out of Stock', value: analytics.inventoryStatus.outOfStock, color: '#ef4444' }
  ].filter(item => item.value > 0) : [];

  const categoryData = analytics?.categoryDistribution ? Object.entries(analytics.categoryDistribution).map(([category, count]) => ({
    name: category.charAt(0).toUpperCase() + category.slice(1),
    value: count as number
  })) : [];

  return (
    <Layout isClient={true}>
      <div className="space-y-4 sm:space-y-6 px-2 sm:px-0">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="min-w-0 flex-1">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">My Analytics</h1>
            <p className="text-sm sm:text-base text-gray-600">Track your orders, inventory, and performance metrics</p>
          </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Button
            variant="outline"
            size="sm"
            onClick={refreshData}
            disabled={isLoading}
            className="gap-2 w-full sm:w-auto text-xs sm:text-sm"
          >
            <RefreshCw className={cn("h-3 w-3 sm:h-4 sm:w-4", isLoading && "animate-spin")} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-3 sm:p-6">
          <div className="space-y-4 sm:space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
                <h3 className="text-base sm:text-lg font-semibold">Filters & Date Range</h3>
              </div>
              <Button 
                onClick={resetAllFilters}
                variant="outline"
                size="sm"
                className="border-gray-300 w-full sm:w-auto text-xs sm:text-sm"
              >
                <RotateCcw className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                Reset All
              </Button>
            </div>
            
            {/* Filters Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              {/* Period Filter */}
              <div>
                <Label className="text-sm font-medium text-gray-700 mb-2 block">Time Period</Label>
                <Select
                  value={filters.period || 'custom'}
                  onValueChange={(value) => {
                    if (value === 'custom') {
                      setFilters(prev => ({ ...prev, period: undefined }));
                    } else {
                      setFilters(prev => ({
                        ...prev,
                        period: value as '7d' | '30d' | '90d',
                        dateFrom: undefined,
                        dateTo: undefined
                      }));
                      setDateRange({ from: undefined, to: undefined });
                      setStartDate(undefined);
                      setEndDate(undefined);
                    }
                  }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select time period" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7d">Last 7 days</SelectItem>
                    <SelectItem value="30d">Last 30 days</SelectItem>
                    <SelectItem value="90d">Last 90 days</SelectItem>
                    <SelectItem value="custom">Custom range</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Status Filter */}
              <div>
                <Label className="text-sm font-medium text-gray-700 mb-2 block">Order Status</Label>
                <Select
                  value={filters.status || 'all'}
                  onValueChange={(value) => {
                    setFilters(prev => ({
                      ...prev,
                      status: value === 'all' ? undefined : value
                    }));
                  }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="confirmed">Confirmed</SelectItem>
                    <SelectItem value="shipped">Shipped</SelectItem>
                    <SelectItem value="delivered">Delivered</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Custom Date Range - Always Visible */}
            <div className="border-t pt-4">
              <Label className="text-sm font-medium text-gray-700 mb-3 block">Custom Date Range</Label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label className="text-xs text-gray-500 mb-2 block">Start Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal h-10"
                        disabled={!!filters.period}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {startDate ? format(startDate, "MMM dd, yyyy") : "Select start date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={startDate}
                        onSelect={setStartDate}
                        disabled={(date) => date > new Date() || (endDate && date > endDate)}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                
                <div>
                  <Label className="text-xs text-gray-500 mb-2 block">End Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal h-10"
                        disabled={!!filters.period}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {endDate ? format(endDate, "MMM dd, yyyy") : "Select end date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={endDate}
                        onSelect={setEndDate}
                        disabled={(date) => date > new Date() || (startDate && date < startDate)}
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="flex items-end">
                  <Button 
                    onClick={applyDateRange} 
                    disabled={!startDate || !endDate || !!filters.period}
                    className="w-full bg-blue-600 hover:bg-blue-700"
                  >
                    Apply Date Range
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {isLoading ? (
        <div className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <Skeleton className="h-4 w-24 mb-2" />
                  <Skeleton className="h-8 w-16 mb-1" />
                  <Skeleton className="h-3 w-20" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ) : (
        <>
          {/* Overview Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <ShoppingCart className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Orders</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {formatNumber(analytics?.overview?.totalOrders || 0)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <DollarSign className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Spent</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {formatCurrency(analytics?.overview?.totalRevenue || 0)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-yellow-100 rounded-lg">
                    <TrendingUp className="h-6 w-6 text-yellow-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Avg. Order Value</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {formatCurrency(analytics?.overview?.averageOrderValue || 0)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Package className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Available Products</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {formatNumber(analytics?.overview?.totalProducts || 0)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Charts Section */}
          <Tabs defaultValue="orders" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="orders">Order Analysis</TabsTrigger>
              <TabsTrigger value="products">Product Insights</TabsTrigger>
            </TabsList>

            {/* Order Analysis Tab */}
            <TabsContent value="orders" className="space-y-6">
              {/* Export Buttons for Orders */}
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={async () => {
                    setExportingOrders('xlsx');
                    try {
                      console.log('Exporting orders as Excel...');
                      const result = await exportData('orders', 'xlsx');
                      if (!result.success) {
                        console.error('Export failed:', result.error);
                      }
                    } finally {
                      setExportingOrders(null);
                    }
                  }}
                  className="gap-2"
                  disabled={exportingOrders !== null}
                >
                  {exportingOrders === 'xlsx' ? (
                    <>
                      <div className="h-4 w-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
                      Exporting...
                    </>
                  ) : (
                    <>
                      <FileSpreadsheet className="h-4 w-4" />
                      Export Excel
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={async () => {
                    setExportingOrders('pdf');
                    try {
                      console.log('Exporting orders as PDF...');
                      const result = await exportData('orders', 'pdf');
                      if (!result.success) {
                        console.error('Export failed:', result.error);
                      }
                    } finally {
                      setExportingOrders(null);
                    }
                  }}
                  className="gap-2"
                  disabled={exportingOrders !== null}
                >
                  {exportingOrders === 'pdf' ? (
                    <>
                      <div className="h-4 w-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
                      Exporting...
                    </>
                  ) : (
                    <>
                      <FileText className="h-4 w-4" />
                      Export PDF
                    </>
                  )}
                </Button>
              </div>
              
              <div className="grid gap-6 lg:grid-cols-2">
                {/* Order Status Distribution */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="h-5 w-5" />
                      Order Status Distribution
                    </CardTitle>
                    <CardDescription>
                      Breakdown of your orders by current status
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {orderStatusData.length > 0 ? (
                      <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                          <Pie
                            data={orderStatusData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, value, percent }) => 
                              `${name}: ${value} (${(percent * 100).toFixed(0)}%)`
                            }
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                          >
                            {orderStatusData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="flex items-center justify-center h-[300px] text-gray-500">
                        No order data available
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Top Products */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Package className="h-5 w-5" />
                      Top Products Ordered
                    </CardTitle>
                    <CardDescription>
                      Most frequently ordered products
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {analytics?.topProducts?.length > 0 ? (
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={analytics.topProducts.slice(0, 5)} margin={{ bottom: 60, left: 10, right: 10, top: 10 }}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis 
                            dataKey="name" 
                            tick={{ fontSize: 10 }}
                            interval={0}
                            angle={-35}
                            textAnchor="end"
                            height={80}
                            width={60}
                          />
                          <YAxis tick={{ fontSize: 10 }} />
                          <Tooltip 
                            formatter={(value, name) => [
                              formatNumber(value as number), 
                              name === 'quantity' ? 'Quantity' : 'Revenue'
                            ]}
                            labelStyle={{ fontSize: '12px' }}
                            contentStyle={{ fontSize: '12px' }}
                          />
                          <Legend wrapperStyle={{ fontSize: '12px' }} />
                          <Bar dataKey="quantity" fill="#8884d8" name="Quantity" />
                          <Bar dataKey="revenue" fill="#82ca9d" name="Revenue ($)" />
                        </BarChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="flex items-center justify-center h-[300px] text-gray-500">
                        No product data available
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Product Insights Tab */}
            <TabsContent value="products" className="space-y-6">
              {/* Export Buttons for Products */}
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={async () => {
                    setExportingInventory('xlsx');
                    try {
                      console.log('Exporting products as Excel...');
                      const result = await exportData('inventory', 'xlsx');
                      if (!result.success) {
                        console.error('Export failed:', result.error);
                      }
                    } finally {
                      setExportingInventory(null);
                    }
                  }}
                  className="gap-2"
                  disabled={exportingInventory !== null}
                >
                  {exportingInventory === 'xlsx' ? (
                    <>
                      <div className="h-4 w-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
                      Exporting...
                    </>
                  ) : (
                    <>
                      <FileSpreadsheet className="h-4 w-4" />
                      Export Excel
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={async () => {
                    setExportingInventory('pdf');
                    try {
                      console.log('Exporting products as PDF...');
                      const result = await exportData('inventory', 'pdf');
                      if (!result.success) {
                        console.error('Export failed:', result.error);
                      }
                    } finally {
                      setExportingInventory(null);
                    }
                  }}
                  className="gap-2"
                  disabled={exportingInventory !== null}
                >
                  {exportingInventory === 'pdf' ? (
                    <>
                      <div className="h-4 w-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
                      Exporting...
                    </>
                  ) : (
                    <>
                      <FileText className="h-4 w-4" />
                      Export PDF
                    </>
                  )}
                </Button>
              </div>
              
              <div className="grid gap-6 lg:grid-cols-2">
                {/* Inventory Status */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <AlertCircle className="h-5 w-5" />
                      Inventory Status
                    </CardTitle>
                    <CardDescription>
                      Current stock levels across all products
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {inventoryStatusData.length > 0 ? (
                      <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                          <Pie
                            data={inventoryStatusData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, value, percent }) => 
                              `${name}: ${value} (${(percent * 100).toFixed(0)}%)`
                            }
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                          >
                            {inventoryStatusData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="flex items-center justify-center h-[300px] text-gray-500">
                        No inventory data available
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Category Distribution */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Package className="h-5 w-5" />
                      Product Categories
                    </CardTitle>
                    <CardDescription>
                      Distribution of products by category
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {categoryData.length > 0 ? (
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={categoryData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis 
                            dataKey="name" 
                            tick={{ fontSize: 12 }}
                            interval={0}
                            angle={-45}
                            textAnchor="end"
                            height={80}
                          />
                          <YAxis />
                          <Tooltip formatter={(value) => [formatNumber(value as number), 'Count']} />
                          <Bar dataKey="value" fill="#8884d8" />
                        </BarChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="flex items-center justify-center h-[300px] text-gray-500">
                        No category data available
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>


          </Tabs>
        </>
      )}
      </div>
    </Layout>
  );
}