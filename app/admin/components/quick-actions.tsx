import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Package, ShoppingCart, Users, ArrowUpRight, LucideIcon } from "lucide-react";

interface QuickActionsProps {
  totalProducts?: number;
  totalOrders?: number;
  activeClients?: number;
}

export function QuickActions({ totalProducts = 0, totalOrders = 0, activeClients = 0 }: QuickActionsProps) {
  const actions = [
    {
      title: "Manage Products",
      description: "View and manage products",
      href: "/admin/products",
      icon: Package,
      color: "bg-gradient-to-r from-blue-600 to-blue-700",
      hoverColor: "hover:from-blue-700 hover:to-blue-800",
      borderColor: "border-blue-200"
    },
    {
      title: "View Orders", 
      description: "Review orders",
      href: "/admin/orders",
      icon: ShoppingCart,
      color: "bg-gradient-to-r from-emerald-600 to-emerald-700",
      hoverColor: "hover:from-emerald-700 hover:to-emerald-800",
      borderColor: "border-emerald-200"
    },
    {
      title: "Manage Clients",
      description: "View client accounts", 
      href: "/admin/clients",
      icon: Users,
      color: "bg-gradient-to-r from-purple-600 to-purple-700",
      hoverColor: "hover:from-purple-700 hover:to-purple-800",
      borderColor: "border-purple-200"
    }
  ];

  return (
    <Card className="border border-gray-200 shadow-sm bg-white rounded-2xl">
      <CardContent className="p-8">
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Quick Actions</h3>
          <p className="text-sm text-gray-500">Access key management areas quickly</p>
        </div>
        
        <div className="space-y-3">
          {actions.map((action) => {
            const Icon = action.icon;
            return (
              <Link
                key={action.title}
                href={action.href}
                className={`flex items-center gap-4 p-5 rounded-xl border ${action.borderColor} ${action.color} ${action.hoverColor} text-white transition-all duration-300 group shadow-sm hover:shadow-lg transform hover:-translate-y-1 hover:scale-[1.02]`}
              >
                <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                  <Icon className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-base">{action.title}</p>
                  <p className="text-sm opacity-90 mt-1">{action.description}</p>
                </div>
                <ArrowUpRight className="h-5 w-5 opacity-70 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
              </Link>
            );
          })}
        </div>
        
        <div className="mt-8 pt-6 border-t border-gray-200">
          <h4 className="text-base font-semibold text-gray-900 mb-4">Overview</h4>
          <div className="grid grid-cols-1 gap-3">
            <ManagementLink 
              href="/admin/products" 
              icon={Package} 
              label="Products" 
              count={totalProducts.toString()}
            />
            <ManagementLink 
              href="/admin/orders" 
              icon={ShoppingCart} 
              label="Orders" 
              count={totalOrders.toString()}
            />
            <ManagementLink 
              href="/admin/clients" 
              icon={Users} 
              label="Clients" 
              count={activeClients.toString()}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function ManagementLink({ 
  href, 
  icon: Icon, 
  label, 
  count 
}: { 
  href: string; 
  icon: LucideIcon; 
  label: string; 
  count: string;
}) {
  return (
    <Link
      href={href}
      className="flex items-center justify-between p-4 rounded-xl hover:bg-gray-50 transition-all duration-200 group border border-gray-100 hover:border-gray-200 hover:shadow-sm"
    >
      <div className="flex items-center gap-3">
        <div className="p-2 bg-gray-100 rounded-lg group-hover:bg-gray-200 transition-colors">
          <Icon className="h-4 w-4 text-gray-600" />
        </div>
        <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">{label}</span>
      </div>
      <div className="flex items-center gap-3">
        <span className="text-sm font-bold bg-gray-100 text-gray-700 px-3 py-1.5 rounded-full group-hover:bg-gray-200">{count}</span>
        <ArrowUpRight className="h-4 w-4 text-gray-400 group-hover:text-gray-600 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      </div>
    </Link>
  );
}
