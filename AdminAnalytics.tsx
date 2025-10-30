import { useState, useEffect, useMemo } from 'react';
import Layout from '../Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Calendar } from '../ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { 
  Download, 
  Filter,
  RotateCcw,
  Search,
  TrendingUp,
  TrendingDown,
  Package,
  ShoppingCart,
  CheckCircle,
  Clock,
  Calendar as CalendarIcon,
  FileSpreadsheet,
  ArrowUpDown,
  ArrowUp,
  ArrowDown
} from 'lucide-react';
import { motion } from 'motion/react';
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
import { 
  getStoredData, 
  MOCK_ORDERS, 
  MOCK_INVENTORY_LOGS,
  MOCK_CLIENTS,
  PurchaseOrder, 
  InventoryLog,
  Client
} from '../mockData';
import { format } from 'date-fns';
import { cn } from '../ui/utils';

type SortDirection = 'asc' | 'desc' | null;

export default function AdminAnalytics() {
  const [orders, setOrders] = useState<PurchaseOrder[]>([]);
  const [inventoryLogs, setInventoryLogs] = useState<InventoryLog[]>([]);
  const [clients] = useState<Client[]>(MOCK_CLIENTS);

  // Orders filters
  const [ordersDateFrom, setOrdersDateFrom] = useState<Date | undefined>();
  const [ordersDateTo, setOrdersDateTo] = useState<Date | undefined>();
  const [ordersStatus, setOrdersStatus] = useState<string>('all');
  const [ordersClient, setOrdersClient] = useState<string>('all');
  const [ordersSearch, setOrdersSearch] = useState('');
  const [ordersSortField, setOrdersSortField] = useState<string>('');
  const [ordersSortDirection, setOrdersSortDirection] = useState<SortDirection>(null);

  // Inventory filters
  const [invDateFrom, setInvDateFrom] = useState<Date | undefined>();
  const [invDateTo, setInvDateTo] = useState<Date | undefined>();
  const [invProduct, setInvProduct] = useState<string>('all');
  const [invChangeType, setInvChangeType] = useState<string>('all');
  const [invUser, setInvUser] = useState<string>('all');
  const [invReason, setInvReason] = useState<string>('all');
  const [invSearch, setInvSearch] = useState('');
  const [invSortField, setInvSortField] = useState<string>('');
  const [invSortDirection, setInvSortDirection] = useState<SortDirection>(null);

  // Pagination
  const [ordersPage, setOrdersPage] = useState(1);
  const [ordersPerPage, setOrdersPerPage] = useState(10);
  const [invPage, setInvPage] = useState(1);
  const [invPerPage, setInvPerPage] = useState(10);

  useEffect(() => {
    const allOrders = getStoredData<PurchaseOrder[]>('fitplay_orders', MOCK_ORDERS);
    const allInventoryLogs = getStoredData<InventoryLog[]>('fitplay_inventory_logs', MOCK_INVENTORY_LOGS);
    setOrders(allOrders);
    setInventoryLogs(allInventoryLogs);
  }, []);

  // Filter and sort orders
  const filteredOrders = useMemo(() => {
    let filtered = orders.filter(order => {
      const orderDate = new Date(order.createdAt);
      
      // Date filter
      if (ordersDateFrom && orderDate < ordersDateFrom) return false;
      if (ordersDateTo && orderDate > ordersDateTo) return false;
      
      // Status filter
      if (ordersStatus !== 'all' && order.status !== ordersStatus) return false;
      
      // Client filter
      if (ordersClient !== 'all' && order.clientId !== ordersClient) return false;
      
      // Search filter
      if (ordersSearch) {
        const searchLower = ordersSearch.toLowerCase();
        return (
          order.poNumber.toLowerCase().includes(searchLower) ||
          order.clientName.toLowerCase().includes(searchLower) ||
          order.company.toLowerCase().includes(searchLower) ||
          order.status.toLowerCase().includes(searchLower)
        );
      }
      
      return true;
    });

    // Sorting
    if (ordersSortField && ordersSortDirection) {
      filtered.sort((a, b) => {
        let aVal: any = a[ordersSortField as keyof PurchaseOrder];
        let bVal: any = b[ordersSortField as keyof PurchaseOrder];

        if (ordersSortField === 'createdAt') {
          aVal = new Date(aVal).getTime();
          bVal = new Date(bVal).getTime();
        }

        if (aVal < bVal) return ordersSortDirection === 'asc' ? -1 : 1;
        if (aVal > bVal) return ordersSortDirection === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return filtered;
  }, [orders, ordersDateFrom, ordersDateTo, ordersStatus, ordersClient, ordersSearch, ordersSortField, ordersSortDirection]);

  // Filter and sort inventory logs
  const filteredInventory = useMemo(() => {
    let filtered = inventoryLogs.filter(log => {
      const logDate = new Date(log.createdAt);
      
      // Date filter
      if (invDateFrom && logDate < invDateFrom) return false;
      if (invDateTo && logDate > invDateTo) return false;
      
      // Product filter
      if (invProduct !== 'all' && log.productId !== invProduct) return false;
      
      // Change type filter
      if (invChangeType !== 'all' && log.changeType !== invChangeType) return false;
      
      // User filter
      if (invUser !== 'all' && log.user !== invUser) return false;
      
      // Reason filter
      if (invReason !== 'all' && log.reason !== invReason) return false;
      
      // Search filter
      if (invSearch) {
        const searchLower = invSearch.toLowerCase();
        return (
          log.productName.toLowerCase().includes(searchLower) ||
          log.sku.toLowerCase().includes(searchLower) ||
          log.reason.toLowerCase().includes(searchLower) ||
          log.remarks.toLowerCase().includes(searchLower)
        );
      }
      
      return true;
    });

    // Sorting
    if (invSortField && invSortDirection) {
      filtered.sort((a, b) => {
        let aVal: any = a[invSortField as keyof InventoryLog];
        let bVal: any = b[invSortField as keyof InventoryLog];

        if (invSortField === 'createdAt') {
          aVal = new Date(aVal).getTime();
          bVal = new Date(bVal).getTime();
        }

        if (aVal < bVal) return invSortDirection === 'asc' ? -1 : 1;
        if (aVal > bVal) return invSortDirection === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return filtered;
  }, [inventoryLogs, invDateFrom, invDateTo, invProduct, invChangeType, invUser, invReason, invSearch, invSortField, invSortDirection]);

  // Calculate orders metrics
  const ordersMetrics = useMemo(() => {
    const total = filteredOrders.length;
    const delivered = filteredOrders.filter(o => o.status === 'completed').length;
    const pending = filteredOrders.filter(o => o.status === 'pending').length;
    const revenue = filteredOrders.reduce((sum, o) => sum + o.total, 0);
    
    return { total, delivered, pending, revenue };
  }, [filteredOrders]);

  // Calculate inventory metrics
  const invMetrics = useMemo(() => {
    const total = filteredInventory.length;
    const added = filteredInventory.filter(log => log.changeType === '+').reduce((sum, log) => sum + log.quantity, 0);
    const deducted = filteredInventory.filter(log => log.changeType === '-').reduce((sum, log) => sum + log.quantity, 0);
    
    // Find most updated product
    const productCounts: { [key: string]: number } = {};
    filteredInventory.forEach(log => {
      productCounts[log.productName] = (productCounts[log.productName] || 0) + 1;
    });
    const mostUpdated = Object.entries(productCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A';
    
    return { total, added, deducted, mostUpdated };
  }, [filteredInventory]);

  // Chart data - Orders over time
  const ordersOverTimeData = useMemo(() => {
    const data: { [key: string]: { date: string; orders: number; revenue: number } } = {};
    
    filteredOrders.forEach(order => {
      const date = format(new Date(order.createdAt), 'MMM dd');
      if (!data[date]) {
        data[date] = { date, orders: 0, revenue: 0 };
      }
      data[date].orders += 1;
      data[date].revenue += order.total;
    });
    
    return Object.values(data).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [filteredOrders]);

  // Chart data - Top 5 clients by orders
  const topClientsData = useMemo(() => {
    const clientStats: { [key: string]: { name: string; orders: number; revenue: number } } = {};
    
    filteredOrders.forEach(order => {
      if (!clientStats[order.company]) {
        clientStats[order.company] = { name: order.company, orders: 0, revenue: 0 };
      }
      clientStats[order.company].orders += 1;
      clientStats[order.company].revenue += order.total;
    });
    
    return Object.values(clientStats)
      .sort((a, b) => b.orders - a.orders)
      .slice(0, 5);
  }, [filteredOrders]);

  // Chart data - Order status distribution
  const orderStatusData = useMemo(() => {
    const statusCounts: { [key: string]: number } = {};
    
    filteredOrders.forEach(order => {
      statusCounts[order.status] = (statusCounts[order.status] || 0) + 1;
    });
    
    const colors: { [key: string]: string } = {
      'pending': '#f59e0b',
      'approved': '#3b82f6',
      'in-progress': '#8b5cf6',
      'completed': '#10b981',
      'cancelled': '#ef4444'
    };
    
    return Object.entries(statusCounts).map(([status, value]) => ({
      name: status.charAt(0).toUpperCase() + status.slice(1),
      value,
      color: colors[status] || '#6b7280'
    }));
  }, [filteredOrders]);

  // Chart data - Inventory changes over time
  const invOverTimeData = useMemo(() => {
    const data: { [key: string]: { date: string; added: number; deducted: number } } = {};
    
    filteredInventory.forEach(log => {
      const date = format(new Date(log.createdAt), 'MMM dd');
      if (!data[date]) {
        data[date] = { date, added: 0, deducted: 0 };
      }
      if (log.changeType === '+') {
        data[date].added += log.quantity;
      } else {
        data[date].deducted += log.quantity;
      }
    });
    
    return Object.values(data).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [filteredInventory]);

  // Chart data - Top 5 products by inventory updates
  const topProductsData = useMemo(() => {
    const productStats: { [key: string]: { name: string; updates: number } } = {};
    
    filteredInventory.forEach(log => {
      if (!productStats[log.productName]) {
        productStats[log.productName] = { name: log.productName, updates: 0 };
      }
      productStats[log.productName].updates += 1;
    });
    
    return Object.values(productStats)
      .sort((a, b) => b.updates - a.updates)
      .slice(0, 5);
  }, [filteredInventory]);

  // Chart data - Movement type distribution
  const movementTypeData = useMemo(() => {
    const added = filteredInventory.filter(log => log.changeType === '+').length;
    const deducted = filteredInventory.filter(log => log.changeType === '-').length;
    
    return [
      { name: 'Added', value: added, color: '#10b981' },
      { name: 'Deducted', value: deducted, color: '#ef4444' }
    ];
  }, [filteredInventory]);

  // Export functions
  const exportToCSV = (data: any[], filename: string) => {
    if (data.length === 0) {
      alert('No data to export');
      return;
    }

    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(','),
      ...data.map(row => headers.map(header => {
        const value = row[header];
        // Escape commas and quotes
        if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
          return `"${value.replace(/"/g, '""')}"`;
        }
        return value;
      }).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportOrdersToCSV = () => {
    const data = filteredOrders.map(order => ({
      'Date': format(new Date(order.createdAt), 'yyyy-MM-dd HH:mm'),
      'Order ID': order.poNumber,
      'Client': order.clientName,
      'Company': order.company,
      'Product Count': order.items.length,
      'Total Quantity': order.items.reduce((sum, item) => sum + item.quantity, 0),
      'Status': order.status,
      'Total (₹)': order.total.toFixed(2)
    }));
    
    exportToCSV(data, `orders-report-${format(new Date(), 'yyyy-MM-dd')}.csv`);
  };

  const exportInventoryToCSV = () => {
    const data = filteredInventory.map(log => ({
      'Date': format(new Date(log.createdAt), 'yyyy-MM-dd HH:mm'),
      'Product': log.productName,
      'SKU': log.sku,
      'Change': `${log.changeType}${log.quantity}`,
      'Reason': log.reason,
      'Remarks': log.remarks,
      'User': log.user,
      'Role': log.role
    }));
    
    exportToCSV(data, `inventory-report-${format(new Date(), 'yyyy-MM-dd')}.csv`);
  };

  const resetOrdersFilters = () => {
    setOrdersDateFrom(undefined);
    setOrdersDateTo(undefined);
    setOrdersStatus('all');
    setOrdersClient('all');
    setOrdersSearch('');
    setOrdersPage(1);
  };

  const resetInvFilters = () => {
    setInvDateFrom(undefined);
    setInvDateTo(undefined);
    setInvProduct('all');
    setInvChangeType('all');
    setInvUser('all');
    setInvReason('all');
    setInvSearch('');
    setInvPage(1);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'approved': return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'in-progress': return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'completed': return 'bg-green-100 text-green-800 border-green-300';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const handleSort = (field: string, isOrders: boolean) => {
    if (isOrders) {
      if (ordersSortField === field) {
        setOrdersSortDirection(
          ordersSortDirection === 'asc' ? 'desc' : ordersSortDirection === 'desc' ? null : 'asc'
        );
        if (ordersSortDirection === 'desc') {
          setOrdersSortField('');
        }
      } else {
        setOrdersSortField(field);
        setOrdersSortDirection('asc');
      }
    } else {
      if (invSortField === field) {
        setInvSortDirection(
          invSortDirection === 'asc' ? 'desc' : invSortDirection === 'desc' ? null : 'asc'
        );
        if (invSortDirection === 'desc') {
          setInvSortField('');
        }
      } else {
        setInvSortField(field);
        setInvSortDirection('asc');
      }
    }
  };

  const SortIcon = ({ field, currentField, currentDirection }: { field: string; currentField: string; currentDirection: SortDirection }) => {
    if (field !== currentField) return <ArrowUpDown className="h-4 w-4 ml-1 opacity-40" />;
    if (currentDirection === 'asc') return <ArrowUp className="h-4 w-4 ml-1 text-primary" />;
    if (currentDirection === 'desc') return <ArrowDown className="h-4 w-4 ml-1 text-primary" />;
    return <ArrowUpDown className="h-4 w-4 ml-1 opacity-40" />;
  };

  // Pagination
  const paginatedOrders = filteredOrders.slice((ordersPage - 1) * ordersPerPage, ordersPage * ordersPerPage);
  const totalOrdersPages = Math.ceil(filteredOrders.length / ordersPerPage);

  const paginatedInventory = filteredInventory.slice((invPage - 1) * invPerPage, invPage * invPerPage);
  const totalInvPages = Math.ceil(filteredInventory.length / invPerPage);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 }
    }
  };

  return (
    <Layout title="Reports & Analytics">
      <motion.div 
        className="space-y-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header */}
        <motion.div variants={itemVariants}>
          <Card className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white border-0 overflow-hidden relative">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDE2YzAtMi4yMSAxLjc5LTQgNC00czQgMS43OSA0IDQtMS43OSA0LTQgNC00LTEuNzktNC00em0wIDI0YzAtMi4yMSAxLjc5LTQgNC00czQgMS43OSA0IDQtMS43OSA0LTQgNC00LTEuNzktNC00ek0xMiAxNmMwLTIuMjEgMS43OS00IDQtNHM0IDEuNzkgNCA0LTEuNzkgNC00IDQtNC0xLjc5LTQtNHptMCAyNGMwLTIuMjEgMS43OS00IDQtNHM0IDEuNzkgNCA0LTEuNzkgNC00IDQtNC0xLjc5LTQtNHoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-40"></div>
            <CardContent className="p-6 relative z-10">
              <div className="space-y-1">
                <h1 className="text-3xl">Reports & Analytics</h1>
                <p className="text-slate-300">
                  Track order performance, inventory movements, and export detailed reports
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Tabs */}
        <Tabs defaultValue="orders" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2 lg:w-auto">
            <TabsTrigger value="orders">Orders Analytics</TabsTrigger>
            <TabsTrigger value="inventory">Inventory Analytics</TabsTrigger>
          </TabsList>

          {/* ORDERS TAB */}
          <TabsContent value="orders" className="space-y-4">
            {/* Filters */}
            <motion.div variants={itemVariants}>
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <Filter className="h-5 w-5" />
                        Filters
                      </CardTitle>
                      <CardDescription>Refine your orders data</CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={resetOrdersFilters}>
                        <RotateCcw className="h-4 w-4 mr-2" />
                        Reset
                      </Button>
                      <Button variant="outline" size="sm" onClick={exportOrdersToCSV}>
                        <FileSpreadsheet className="h-4 w-4 mr-2" />
                        Export CSV
                      </Button>
                      <Button variant="default" size="sm" onClick={exportOrdersToCSV}>
                        <Download className="h-4 w-4 mr-2" />
                        Export Excel
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Date From */}
                    <div className="space-y-2">
                      <Label>Date From</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className={cn("w-full justify-start text-left", !ordersDateFrom && "text-muted-foreground")}>
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {ordersDateFrom ? format(ordersDateFrom, 'PP') : 'Pick a date'}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar mode="single" selected={ordersDateFrom} onSelect={setOrdersDateFrom} initialFocus />
                        </PopoverContent>
                      </Popover>
                    </div>

                    {/* Date To */}
                    <div className="space-y-2">
                      <Label>Date To</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className={cn("w-full justify-start text-left", !ordersDateTo && "text-muted-foreground")}>
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {ordersDateTo ? format(ordersDateTo, 'PP') : 'Pick a date'}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar mode="single" selected={ordersDateTo} onSelect={setOrdersDateTo} initialFocus />
                        </PopoverContent>
                      </Popover>
                    </div>

                    {/* Status */}
                    <div className="space-y-2">
                      <Label>Status</Label>
                      <Select value={ordersStatus} onValueChange={setOrdersStatus}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Status</SelectItem>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="approved">Approved</SelectItem>
                          <SelectItem value="in-progress">In Progress</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                          <SelectItem value="cancelled">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Client */}
                    <div className="space-y-2">
                      <Label>Client</Label>
                      <Select value={ordersClient} onValueChange={setOrdersClient}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Clients</SelectItem>
                          {clients.map(client => (
                            <SelectItem key={client.id} value={client.id}>{client.company}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Search */}
                    <div className="space-y-2 md:col-span-2 lg:col-span-4">
                      <Label>Search</Label>
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="Search orders, clients, company..."
                          value={ordersSearch}
                          onChange={(e) => setOrdersSearch(e.target.value)}
                          className="pl-9"
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Summary Cards */}
            <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4" variants={itemVariants}>
              <Card className="border-l-4 border-l-blue-500">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm">Total Orders</CardTitle>
                  <ShoppingCart className="h-4 w-4 text-blue-600" />
                </CardHeader>
                <CardContent>
                  <p className="text-3xl">{ordersMetrics.total}</p>
                  <p className="text-xs text-muted-foreground mt-1">In selected period</p>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-green-500">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm">Orders Delivered</CardTitle>
                  <CheckCircle className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <p className="text-3xl">{ordersMetrics.delivered}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {ordersMetrics.total > 0 ? ((ordersMetrics.delivered / ordersMetrics.total) * 100).toFixed(1) : 0}% completion rate
                  </p>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-amber-500">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm">Orders Pending</CardTitle>
                  <Clock className="h-4 w-4 text-amber-600" />
                </CardHeader>
                <CardContent>
                  <p className="text-3xl">{ordersMetrics.pending}</p>
                  <p className="text-xs text-muted-foreground mt-1">Need attention</p>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-purple-500">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm">Total Revenue</CardTitle>
                  <TrendingUp className="h-4 w-4 text-purple-600" />
                </CardHeader>
                <CardContent>
                  <p className="text-3xl">₹{(ordersMetrics.revenue / 1000).toFixed(1)}K</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Avg: ₹{ordersMetrics.total > 0 ? (ordersMetrics.revenue / ordersMetrics.total / 1000).toFixed(1) : 0}K per order
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <motion.div variants={itemVariants}>
                <Card>
                  <CardHeader>
                    <CardTitle>Orders Over Time</CardTitle>
                    <CardDescription>Order volume trend</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={ordersOverTimeData}>
                        <defs>
                          <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis dataKey="date" stroke="#6b7280" />
                        <YAxis stroke="#6b7280" />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: '#fff', 
                            border: '1px solid #e5e7eb',
                            borderRadius: '8px'
                          }}
                        />
                        <Legend />
                        <Line 
                          type="monotone" 
                          dataKey="orders" 
                          stroke="#3b82f6" 
                          strokeWidth={3}
                          fill="url(#colorOrders)"
                          name="Orders"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div variants={itemVariants}>
                <Card>
                  <CardHeader>
                    <CardTitle>Top 5 Clients</CardTitle>
                    <CardDescription>By order count</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={topClientsData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis dataKey="name" stroke="#6b7280" angle={-45} textAnchor="end" height={100} />
                        <YAxis stroke="#6b7280" />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: '#fff', 
                            border: '1px solid #e5e7eb',
                            borderRadius: '8px'
                          }}
                        />
                        <Bar dataKey="orders" fill="#10b981" radius={[8, 8, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div variants={itemVariants} className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Order Status Distribution</CardTitle>
                    <CardDescription>Current status breakdown</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={orderStatusData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, value }) => `${name}: ${value}`}
                          outerRadius={100}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {orderStatusData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: '#fff', 
                            border: '1px solid #e5e7eb',
                            borderRadius: '8px'
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Detailed Table */}
            <motion.div variants={itemVariants}>
              <Card>
                <CardHeader>
                  <CardTitle>Detailed Orders Report</CardTitle>
                  <CardDescription>
                    Showing {paginatedOrders.length} of {filteredOrders.length} orders
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="cursor-pointer" onClick={() => handleSort('createdAt', true)}>
                            <div className="flex items-center">
                              Date
                              <SortIcon field="createdAt" currentField={ordersSortField} currentDirection={ordersSortDirection} />
                            </div>
                          </TableHead>
                          <TableHead className="cursor-pointer" onClick={() => handleSort('poNumber', true)}>
                            <div className="flex items-center">
                              Order ID
                              <SortIcon field="poNumber" currentField={ordersSortField} currentDirection={ordersSortDirection} />
                            </div>
                          </TableHead>
                          <TableHead className="cursor-pointer" onClick={() => handleSort('clientName', true)}>
                            <div className="flex items-center">
                              Client
                              <SortIcon field="clientName" currentField={ordersSortField} currentDirection={ordersSortDirection} />
                            </div>
                          </TableHead>
                          <TableHead className="cursor-pointer" onClick={() => handleSort('company', true)}>
                            <div className="flex items-center">
                              Company
                              <SortIcon field="company" currentField={ordersSortField} currentDirection={ordersSortDirection} />
                            </div>
                          </TableHead>
                          <TableHead>Products</TableHead>
                          <TableHead>Quantity</TableHead>
                          <TableHead className="cursor-pointer" onClick={() => handleSort('status', true)}>
                            <div className="flex items-center">
                              Status
                              <SortIcon field="status" currentField={ordersSortField} currentDirection={ordersSortDirection} />
                            </div>
                          </TableHead>
                          <TableHead className="cursor-pointer text-right" onClick={() => handleSort('total', true)}>
                            <div className="flex items-center justify-end">
                              Total
                              <SortIcon field="total" currentField={ordersSortField} currentDirection={ordersSortDirection} />
                            </div>
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {paginatedOrders.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={8} className="text-center text-muted-foreground h-24">
                              No orders found
                            </TableCell>
                          </TableRow>
                        ) : (
                          paginatedOrders.map((order) => (
                            <TableRow key={order.id}>
                              <TableCell>{format(new Date(order.createdAt), 'MMM dd, yyyy')}</TableCell>
                              <TableCell className="font-medium">{order.poNumber}</TableCell>
                              <TableCell>{order.clientName}</TableCell>
                              <TableCell>{order.company}</TableCell>
                              <TableCell>{order.items.length}</TableCell>
                              <TableCell>{order.items.reduce((sum, item) => sum + item.quantity, 0)}</TableCell>
                              <TableCell>
                                <Badge variant="outline" className={getStatusColor(order.status)}>
                                  {order.status}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-right">₹{order.total.toFixed(2)}</TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </div>

                  {/* Pagination */}
                  {totalOrdersPages > 1 && (
                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center gap-2">
                        <Label>Rows per page:</Label>
                        <Select value={ordersPerPage.toString()} onValueChange={(val) => { setOrdersPerPage(Number(val)); setOrdersPage(1); }}>
                          <SelectTrigger className="w-20">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="10">10</SelectItem>
                            <SelectItem value="25">25</SelectItem>
                            <SelectItem value="50">50</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setOrdersPage(p => Math.max(1, p - 1))}
                          disabled={ordersPage === 1}
                        >
                          Previous
                        </Button>
                        <span className="text-sm">
                          Page {ordersPage} of {totalOrdersPages}
                        </span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setOrdersPage(p => Math.min(totalOrdersPages, p + 1))}
                          disabled={ordersPage === totalOrdersPages}
                        >
                          Next
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          {/* INVENTORY TAB */}
          <TabsContent value="inventory" className="space-y-4">
            {/* Filters */}
            <motion.div variants={itemVariants}>
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <Filter className="h-5 w-5" />
                        Filters
                      </CardTitle>
                      <CardDescription>Refine your inventory data</CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={resetInvFilters}>
                        <RotateCcw className="h-4 w-4 mr-2" />
                        Reset
                      </Button>
                      <Button variant="outline" size="sm" onClick={exportInventoryToCSV}>
                        <FileSpreadsheet className="h-4 w-4 mr-2" />
                        Export CSV
                      </Button>
                      <Button variant="default" size="sm" onClick={exportInventoryToCSV}>
                        <Download className="h-4 w-4 mr-2" />
                        Export Excel
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Date From */}
                    <div className="space-y-2">
                      <Label>Date From</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className={cn("w-full justify-start text-left", !invDateFrom && "text-muted-foreground")}>
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {invDateFrom ? format(invDateFrom, 'PP') : 'Pick a date'}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar mode="single" selected={invDateFrom} onSelect={setInvDateFrom} initialFocus />
                        </PopoverContent>
                      </Popover>
                    </div>

                    {/* Date To */}
                    <div className="space-y-2">
                      <Label>Date To</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className={cn("w-full justify-start text-left", !invDateTo && "text-muted-foreground")}>
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {invDateTo ? format(invDateTo, 'PP') : 'Pick a date'}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar mode="single" selected={invDateTo} onSelect={setInvDateTo} initialFocus />
                        </PopoverContent>
                      </Popover>
                    </div>

                    {/* Product */}
                    <div className="space-y-2">
                      <Label>Product</Label>
                      <Select value={invProduct} onValueChange={setInvProduct}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Products</SelectItem>
                          {Array.from(new Set(inventoryLogs.map(log => log.productId))).map(productId => {
                            const log = inventoryLogs.find(l => l.productId === productId);
                            return log ? <SelectItem key={productId} value={productId}>{log.productName}</SelectItem> : null;
                          })}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Change Type */}
                    <div className="space-y-2">
                      <Label>Change Type</Label>
                      <Select value={invChangeType} onValueChange={setInvChangeType}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Types</SelectItem>
                          <SelectItem value="+">Added (+)</SelectItem>
                          <SelectItem value="-">Deducted (-)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* User */}
                    <div className="space-y-2">
                      <Label>User</Label>
                      <Select value={invUser} onValueChange={setInvUser}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Users</SelectItem>
                          {Array.from(new Set(inventoryLogs.map(log => log.user))).map(user => (
                            <SelectItem key={user} value={user}>{user}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Reason */}
                    <div className="space-y-2">
                      <Label>Reason</Label>
                      <Select value={invReason} onValueChange={setInvReason}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Reasons</SelectItem>
                          {Array.from(new Set(inventoryLogs.map(log => log.reason))).map(reason => (
                            <SelectItem key={reason} value={reason}>{reason}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Search */}
                    <div className="space-y-2 md:col-span-2">
                      <Label>Search</Label>
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="Search products, SKU, remarks..."
                          value={invSearch}
                          onChange={(e) => setInvSearch(e.target.value)}
                          className="pl-9"
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Summary Cards */}
            <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4" variants={itemVariants}>
              <Card className="border-l-4 border-l-blue-500">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm">Total Movements</CardTitle>
                  <Package className="h-4 w-4 text-blue-600" />
                </CardHeader>
                <CardContent>
                  <p className="text-3xl">{invMetrics.total}</p>
                  <p className="text-xs text-muted-foreground mt-1">In selected period</p>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-green-500">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm">Total Added</CardTitle>
                  <TrendingUp className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <p className="text-3xl">+{invMetrics.added}</p>
                  <p className="text-xs text-muted-foreground mt-1">Units added to inventory</p>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-red-500">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm">Total Deducted</CardTitle>
                  <TrendingDown className="h-4 w-4 text-red-600" />
                </CardHeader>
                <CardContent>
                  <p className="text-3xl">-{invMetrics.deducted}</p>
                  <p className="text-xs text-muted-foreground mt-1">Units removed from inventory</p>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-purple-500">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm">Most Updated</CardTitle>
                  <Package className="h-4 w-4 text-purple-600" />
                </CardHeader>
                <CardContent>
                  <p className="text-lg truncate" title={invMetrics.mostUpdated}>{invMetrics.mostUpdated}</p>
                  <p className="text-xs text-muted-foreground mt-1">Most frequent product</p>
                </CardContent>
              </Card>
            </motion.div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <motion.div variants={itemVariants}>
                <Card>
                  <CardHeader>
                    <CardTitle>Inventory Changes Over Time</CardTitle>
                    <CardDescription>Daily additions and deductions</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={invOverTimeData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis dataKey="date" stroke="#6b7280" />
                        <YAxis stroke="#6b7280" />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: '#fff', 
                            border: '1px solid #e5e7eb',
                            borderRadius: '8px'
                          }}
                        />
                        <Legend />
                        <Line type="monotone" dataKey="added" stroke="#10b981" strokeWidth={2} name="Added" />
                        <Line type="monotone" dataKey="deducted" stroke="#ef4444" strokeWidth={2} name="Deducted" />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div variants={itemVariants}>
                <Card>
                  <CardHeader>
                    <CardTitle>Top 5 Products</CardTitle>
                    <CardDescription>By update frequency</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={topProductsData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis dataKey="name" stroke="#6b7280" angle={-45} textAnchor="end" height={100} />
                        <YAxis stroke="#6b7280" />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: '#fff', 
                            border: '1px solid #e5e7eb',
                            borderRadius: '8px'
                          }}
                        />
                        <Bar dataKey="updates" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div variants={itemVariants} className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Movement Type Distribution</CardTitle>
                    <CardDescription>Added vs. Deducted breakdown</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={movementTypeData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, value }) => `${name}: ${value}`}
                          outerRadius={100}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {movementTypeData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: '#fff', 
                            border: '1px solid #e5e7eb',
                            borderRadius: '8px'
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Detailed Table */}
            <motion.div variants={itemVariants}>
              <Card>
                <CardHeader>
                  <CardTitle>Detailed Inventory Report</CardTitle>
                  <CardDescription>
                    Showing {paginatedInventory.length} of {filteredInventory.length} movements
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="cursor-pointer" onClick={() => handleSort('createdAt', false)}>
                            <div className="flex items-center">
                              Date
                              <SortIcon field="createdAt" currentField={invSortField} currentDirection={invSortDirection} />
                            </div>
                          </TableHead>
                          <TableHead className="cursor-pointer" onClick={() => handleSort('productName', false)}>
                            <div className="flex items-center">
                              Product
                              <SortIcon field="productName" currentField={invSortField} currentDirection={invSortDirection} />
                            </div>
                          </TableHead>
                          <TableHead className="cursor-pointer" onClick={() => handleSort('sku', false)}>
                            <div className="flex items-center">
                              SKU
                              <SortIcon field="sku" currentField={invSortField} currentDirection={invSortDirection} />
                            </div>
                          </TableHead>
                          <TableHead>Change</TableHead>
                          <TableHead className="cursor-pointer" onClick={() => handleSort('reason', false)}>
                            <div className="flex items-center">
                              Reason
                              <SortIcon field="reason" currentField={invSortField} currentDirection={invSortDirection} />
                            </div>
                          </TableHead>
                          <TableHead>Remarks</TableHead>
                          <TableHead className="cursor-pointer" onClick={() => handleSort('user', false)}>
                            <div className="flex items-center">
                              User
                              <SortIcon field="user" currentField={invSortField} currentDirection={invSortDirection} />
                            </div>
                          </TableHead>
                          <TableHead>Role</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {paginatedInventory.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={8} className="text-center text-muted-foreground h-24">
                              No inventory movements found
                            </TableCell>
                          </TableRow>
                        ) : (
                          paginatedInventory.map((log) => (
                            <TableRow key={log.id}>
                              <TableCell>{format(new Date(log.createdAt), 'MMM dd, yyyy')}</TableCell>
                              <TableCell className="font-medium">{log.productName}</TableCell>
                              <TableCell>{log.sku}</TableCell>
                              <TableCell>
                                <Badge variant="outline" className={log.changeType === '+' ? 'bg-green-100 text-green-800 border-green-300' : 'bg-red-100 text-red-800 border-red-300'}>
                                  {log.changeType}{log.quantity}
                                </Badge>
                              </TableCell>
                              <TableCell>{log.reason}</TableCell>
                              <TableCell className="max-w-xs truncate" title={log.remarks}>{log.remarks}</TableCell>
                              <TableCell>{log.user}</TableCell>
                              <TableCell>
                                <Badge variant="outline">{log.role}</Badge>
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </div>

                  {/* Pagination */}
                  {totalInvPages > 1 && (
                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center gap-2">
                        <Label>Rows per page:</Label>
                        <Select value={invPerPage.toString()} onValueChange={(val) => { setInvPerPage(Number(val)); setInvPage(1); }}>
                          <SelectTrigger className="w-20">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="10">10</SelectItem>
                            <SelectItem value="25">25</SelectItem>
                            <SelectItem value="50">50</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setInvPage(p => Math.max(1, p - 1))}
                          disabled={invPage === 1}
                        >
                          Previous
                        </Button>
                        <span className="text-sm">
                          Page {invPage} of {totalInvPages}
                        </span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setInvPage(p => Math.min(totalInvPages, p + 1))}
                          disabled={invPage === totalInvPages}
                        >
                          Next
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>
        </Tabs>
      </motion.div>
    </Layout>
  );
}
