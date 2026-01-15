"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Package, History, Loader2, Clock, CheckCircle, XCircle, Download, Building2 } from "lucide-react";
import { getStoredData, CartItem } from "@/lib/mockData";
import Link from "next/link";
import Layout from "@/components/layout";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useOrders } from "@/data/order/client.hooks";
import { formatStatus } from "@/lib/utils";
import { useClientAnalytics } from "@/hooks/use-client-analytics";
import { ClientChartsSection } from "./components/client-charts-section";

export default function ClientDashboard() {
  const { data: session, status } = useSession();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  // Use the useOrders hook as requested
  const { orders, isLoading, error } = useOrders();
  
  // Add analytics for charts
  const { data: analytics, isLoading: analyticsLoading } = useClientAnalytics();

  const user = session?.user;

  useEffect(() => {
    // Load cart items (keeping this as it's not related to orders)
    const cart = getStoredData<CartItem[]>(`fitplay_cart_${user?.id}`, []);
    setCartItems(cart);
  }, [user?.id]);

  const totalOrders = orders?.length;
  const pendingOrders = orders?.filter(
    (order) => order.status === "PENDING"
  ).length;
  const approvedOrders = orders?.filter(
    (order) => order.status === "APPROVED" || order.status === "IN_PROGRESS" || order.status === "COMPLETED" || order.status === "DELIVERED"
  ).length;
  const cancelledOrders = orders?.filter(
    (order) => order.status === "CANCELLED" || order.status === "REJECTED"
  ).length;
  const cartItemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const recentOrders = orders
    ?.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    .slice(0, 3);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100/80";
      case "APPROVED":
        return "bg-blue-100 text-blue-800 hover:bg-blue-100/80";
      case "READY_FOR_DISPATCH":
        return "bg-purple-100 text-purple-800 hover:bg-purple-100/80";
      case "DISPATCHED":
        return "bg-indigo-100 text-indigo-800 hover:bg-indigo-100/80";
      case "AT_DESTINATION":
        return "bg-orange-100 text-orange-800 hover:bg-orange-100/80";
      case "DELIVERED":
        return "bg-green-100 text-green-800 hover:bg-green-100/80";
      case "COMPLETED":
        return "bg-green-100 text-green-800 hover:bg-green-100/80";
      case "CANCELLED":
      case "REJECTED":
        return "bg-red-100 text-red-800 hover:bg-red-100/80";
      case "IN_PROGRESS":
        return "bg-purple-100 text-purple-800 hover:bg-purple-100/80";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100/80";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "PENDING":
        return Clock;
      case "APPROVED":
        return CheckCircle;
      case "READY_FOR_DISPATCH":
        return Download;
      case "DISPATCHED":
      case "AT_DESTINATION":
        return Package;
      case "DELIVERED":
      case "COMPLETED":
        return Building2;
      case "CANCELLED":
      case "REJECTED":
        return XCircle;
      case "IN_PROGRESS":
        return Package;
      default:
        return Clock;
    }
  };

  if (status === "loading" || isLoading || analyticsLoading) {
    return (
      <Layout title="Dashboard" isClient>
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </Layout>
    );
  }

  // Handle unauthenticated users
  if (status === "unauthenticated" || !session?.user) {
    return (
      <Layout title="Dashboard" isClient>
        <div className="text-center py-8">
          <p className="text-muted-foreground">
            Please sign in to access your dashboard
          </p>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout title="Dashboard" isClient>
        <div className="text-center text-destructive">
          Failed to load dashboard data. Please try again later.
        </div>
      </Layout>
    );
  }

  if (!analytics) {
    return (
      <Layout title="Dashboard" isClient>
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </Layout>
    );
  }
  return (
    <Layout title="Dashboard" isClient>
      <div className="space-y-4 sm:space-y-6 px-2 sm:px-0">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 sm:p-6">
          <h1 className="text-xl sm:text-2xl font-bold mb-2">
            Welcome back, {user?.name}!
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Manage your orders and browse our product catalog
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Orders
              </CardTitle>
              <History className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalOrders}</div>
              <p className="text-xs text-muted-foreground">All time orders</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Pending Orders
              </CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingOrders}</div>
              <p className="text-xs text-muted-foreground">Awaiting approval</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Active Orders
              </CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {approvedOrders}
              </div>
              <p className="text-xs text-muted-foreground">In progress/completed</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Cancelled Orders</CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{cancelledOrders}</div>
              <p className="text-xs text-muted-foreground">Cancelled/rejected</p>
            </CardContent>
          </Card>
        </div>

        {/* Cart Items - Moved to separate row if needed */}
        {cartItemCount > 0 && (
          <Card className="w-full">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Cart Items</CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold">{cartItemCount}</div>
                  <p className="text-xs text-muted-foreground">Ready to order</p>
                </div>
                <Button asChild>
                  <Link href="/client/cart">View Cart</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Charts Section - NEW */}
        {analytics && (
          <ClientChartsSection
            orderStatusDistribution={analytics.orderStatusDistribution}
            monthlyTrends={analytics.monthlyTrends}
            orderValueTrends={analytics.orderValueTrends}
          />
        )}

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Browse Products</CardTitle>
              <CardDescription>
                Discover our complete product catalog
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full">
                <Link href="/client/products">View Products</Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Review Cart</CardTitle>
              <CardDescription>
                {cartItemCount > 0
                  ? `${cartItemCount} items ready for checkout`
                  : "Your cart is empty"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                asChild
                variant={cartItemCount > 0 ? "default" : "outline"}
                className="w-full"
              >
                <Link href="/client/cart">
                  {cartItemCount > 0 ? "Checkout Cart" : "View Cart"}
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Order History</CardTitle>
              <CardDescription>
                Track your dispatch orders and delivery status
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild variant="outline" className="w-full">
                <Link href="/client/orders">View Orders</Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Recent Orders */}
        {recentOrders && recentOrders.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Recent Orders</CardTitle>
              <CardDescription>Your latest dispatch orders</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentOrders?.map((order) => (
                  <div
                    key={order.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="space-y-1">
                      <p className="font-medium">{order.id}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(order.createdAt).toLocaleDateString('en-GB')}
                      </p>
                    </div>
                    <Badge className={getStatusColor(order.status)}>
                      {(() => {
                        const StatusIcon = getStatusIcon(order.status);
                        return <StatusIcon className="mr-1 h-3 w-3" />;
                      })()}
                      {formatStatus(order.status)}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
}
