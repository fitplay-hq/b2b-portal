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
import { ShoppingCart, Package, History, TrendingUp } from "lucide-react";
import {
  getStoredData,
  MOCK_ORDERS,
  PurchaseOrder,
  CartItem,
} from "@/lib/mockData";
import Link from "next/link";
import Layout from "@/components/layout";
import { useEffect, useState } from "react";

export default function ClientDashboard() {
  const user = {
    id: "1",
    email: "client@acmecorp.com",
    name: "John Smith",
    role: "client",
    company: "ACME Corporation",
  };
  const [orders, setOrders] = useState<PurchaseOrder[]>([]);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  useEffect(() => {
    // Load user's orders
    const allOrders = getStoredData<PurchaseOrder[]>(
      "fitplay_orders",
      MOCK_ORDERS
    );
    const userOrders = allOrders.filter((order) => order.clientId === user?.id);
    setOrders(userOrders);

    // Load cart items
    const cart = getStoredData<CartItem[]>(`fitplay_cart_${user?.id}`, []);
    setCartItems(cart);
  }, [user?.id]);

  const totalOrders = orders.length;
  const pendingOrders = orders.filter(
    (order) => order.status === "pending"
  ).length;
  const totalSpent = orders.reduce((sum, order) => sum + order.total, 0);
  const cartItemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const recentOrders = orders
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    .slice(0, 3);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "approved":
        return "bg-blue-100 text-blue-800";
      case "in-progress":
        return "bg-purple-100 text-purple-800";
      case "completed":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Layout title="Dashboard" isClient>
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6">
          <h1 className="text-2xl font-bold mb-2">
            Welcome back, {user?.name}!
          </h1>
          <p className="text-muted-foreground">
            Manage your orders and browse our product catalog from{" "}
            {user?.company}
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
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
              <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹{totalSpent.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">All time spending</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Cart Items</CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{cartItemCount}</div>
              <p className="text-xs text-muted-foreground">Ready to order</p>
            </CardContent>
          </Card>
        </div>

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
                Track your purchase orders and delivery status
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
        {recentOrders.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Recent Orders</CardTitle>
              <CardDescription>Your latest purchase orders</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentOrders.map((order) => (
                  <div
                    key={order.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="space-y-1">
                      <p className="font-medium">{order.poNumber}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(order.createdAt).toLocaleDateString()} • $
                        {order.total.toFixed(2)}
                      </p>
                    </div>
                    <Badge className={getStatusColor(order.status)}>
                      {order.status.charAt(0).toUpperCase() +
                        order.status.slice(1)}
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
