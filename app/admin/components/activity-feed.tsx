import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Package, Users, ShoppingCart, AlertCircle } from "lucide-react";

interface ActivityItem {
  id: string;
  type: 'order' | 'product' | 'client' | 'alert';
  title: string;
  description: string;
  time: string;
  status?: 'success' | 'warning' | 'error';
}

interface ActivityFeedProps {
  recentOrders?: Array<{
    id: string;
    status: string;
    createdAt: Date | string;
    client?: {
      company?: {
        name: string;
      } | null;
    } | null;
  }>;
  pendingOrders?: number;
  lowStockProducts?: number;
}

export function ActivityFeed({ recentOrders = [], pendingOrders = 0, lowStockProducts = 0 }: ActivityFeedProps) {
  // Generate real activities based on actual data
  const generateActivities = (): ActivityItem[] => {
    const activities: ActivityItem[] = [];
    
    // Add recent order activities
    if (recentOrders.length > 0) {
      const latestOrder = recentOrders[0];
      activities.push({
        id: 'order-' + latestOrder.id,
        type: 'order',
        title: 'Recent order',
        description: `Order #${latestOrder.id} from ${latestOrder.client?.company?.name || 'Unknown'}`,
        time: formatRelativeTime(latestOrder.createdAt),
        status: latestOrder.status === 'APPROVED' ? 'success' : 'warning'
      });
    }

    // Add system alerts based on real data
    if (pendingOrders > 0) {
      activities.push({
        id: 'pending-orders',
        type: 'alert',
        title: 'Pending approvals',
        description: `${pendingOrders} orders awaiting review`,
        time: 'Active',
        status: 'warning'
      });
    }

    if (lowStockProducts > 0) {
      activities.push({
        id: 'low-stock',
        type: 'product',
        title: 'Low stock alert',
        description: `${lowStockProducts} products below threshold`,
        time: 'Active',
        status: 'error'
      });
    }

    // Add system status
    activities.push({
      id: 'system-status',
      type: 'alert',
      title: 'System status',
      description: 'All systems operational',
      time: 'Live',
      status: 'success'
    });

    return activities.slice(0, 5); // Show only 5 most recent
  };

  const formatRelativeTime = (date: Date | string) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - dateObj.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  const activities = generateActivities();

  const getIcon = (type: string) => {
    switch (type) {
      case 'order': return ShoppingCart;
      case 'product': return Package;
      case 'client': return Users;
      case 'alert': return AlertCircle;
      default: return Clock;
    }
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'success': return 'bg-green-100 text-green-800';
      case 'warning': return 'bg-yellow-100 text-yellow-800';
      case 'error': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="border-0 shadow-sm bg-white">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <Clock className="h-5 w-5 text-gray-600" />
          Recent Activity
        </CardTitle>
        <p className="text-sm text-gray-500 mt-1">Latest system events and notifications</p>
      </CardHeader>
      <CardContent className="pt-0">
        {activities.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activities.map((activity) => {
              const Icon = getIcon(activity.type);
              return (
                <div key={activity.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="p-2 bg-white rounded-lg shadow-sm flex-shrink-0">
                    <Icon className="h-4 w-4 text-gray-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <p className="font-medium text-gray-900 text-sm">{activity.title}</p>
                      {activity.status && (
                        <Badge className={`${getStatusColor(activity.status)} text-xs px-2 py-1 flex-shrink-0`}>
                          {activity.status}
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mb-2">{activity.description}</p>
                    <p className="text-xs text-gray-400">{activity.time}</p>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8">
            <Clock className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 text-sm">No recent activity</p>
            <p className="text-gray-400 text-xs mt-1">Activity will appear here as it happens</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}