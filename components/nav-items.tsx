"use client";

import { cn } from "@/lib/utils";
import {
  BarChart3,
  History,
  Package,
  Package2,
  ShoppingCart,
  Users,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavItemsProps {
  isClient: boolean;
}

export default function NavItems({ isClient }: NavItemsProps) {
  const pathname = usePathname();

  const clientNavItems = [
    { href: "/client", label: "Dashboard", icon: BarChart3 },
    { href: "/client/products", label: "Products", icon: Package },
    { href: "/client/cart", label: "Cart", icon: ShoppingCart },
    { href: "/client/orders", label: "Order History", icon: History },
  ];

  const adminNavItems = [
    { href: "/admin", label: "Dashboard", icon: BarChart3 },
    { href: "/admin/products", label: "Products", icon: Package2 },
    { href: "/admin/clients", label: "Clients", icon: Users },
    { href: "/admin/orders", label: "Orders", icon: History },
  ];

  const navItems = isClient ? clientNavItems : adminNavItems;

  return (
    <nav className="space-y-2">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href;

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors",
              isActive
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground hover:bg-muted"
            )}
          >
            <Icon className="h-4  w-4" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
