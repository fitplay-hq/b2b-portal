import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Package, History, Eye } from "lucide-react";
import Link from "next/link";
import { formatStatus } from "@/lib/utils";

interface ClientOrder {
  id: string;
  status: string;
  createdAt: string;
  totalAmount: number;
}

interface ClientQuickActionsProps {
  recentOrders: ClientOrder[];
  cartItemCount: number;
}

export function ClientQuickActions({ recentOrders, cartItemCount }: ClientQuickActionsProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "APPROVED":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "DISPATCHED":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "DELIVERED":
        return "bg-green-100 text-green-800 border-green-200";
      case "CANCELLED":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Quick Actions */}
      <div className="lg:col-span-1 grid grid-cols-1 gap-4">
        <Card className="shadow-sm border-0 bg-gradient-to-br from-blue-50 to-indigo-50">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <ShoppingCart className="h-5 w-5 text-blue-600" />
              Browse Products
            </CardTitle>
            <CardDescription>
              Discover our complete product catalog
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full bg-blue-600 hover:bg-blue-700">
              <Link href="/client/products">
                <Package className="h-4 w-4 mr-2" />
                View Products
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-0 bg-gradient-to-br from-purple-50 to-pink-50">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <ShoppingCart className="h-5 w-5 text-purple-600" />
              Shopping Cart
            </CardTitle>
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
              className={`w-full ${cartItemCount > 0 
                ? 'bg-purple-600 hover:bg-purple-700' 
                : 'border-purple-300 text-purple-600 hover:bg-purple-50'
              }`}
            >
              <Link href="/client/cart">
                <ShoppingCart className="h-4 w-4 mr-2" />
                {cartItemCount > 0 ? "Checkout Cart" : "View Cart"}
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-0 bg-gradient-to-br from-emerald-50 to-teal-50">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <History className="h-5 w-5 text-emerald-600" />
              Order History
            </CardTitle>
            <CardDescription>
              Track your orders and delivery status
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="outline" className="w-full border-emerald-300 text-emerald-600 hover:bg-emerald-50">
              <Link href="/client/orders">
                <Eye className="h-4 w-4 mr-2" />
                View Orders
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders */}
      <Card className="lg:col-span-2 shadow-sm border-0 bg-white/70 backdrop-blur-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <History className="h-5 w-5 text-gray-600" />
            Recent Orders
          </CardTitle>
          <CardDescription>Your latest order activity</CardDescription>
        </CardHeader>
        <CardContent>
          {recentOrders && recentOrders.length > 0 ? (
            <div className="space-y-3">
              {recentOrders.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between p-4 bg-white border border-gray-100 rounded-xl hover:shadow-sm transition-all duration-200"
                >
                  <div className="space-y-1">
                    <p className="font-semibold text-gray-900 text-sm">
                      Order #{order.id.slice(-8)}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                    {order.totalAmount && (
                      <p className="text-xs font-medium text-gray-700">
                        ₹{order.totalAmount.toLocaleString()}
                      </p>
                    )}
                  </div>
                  <Badge 
                    className={`${getStatusColor(order.status)} text-xs font-medium px-2 py-1`}
                  >
                    {formatStatus(order.status)}
                  </Badge>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="text-4xl mb-3">📦</div>
              <p className="text-gray-500 mb-2">No orders yet</p>
              <p className="text-sm text-gray-400">Start shopping to see your orders here</p>
              <Button asChild variant="outline" className="mt-4">
                <Link href="/client/products">Browse Products</Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}