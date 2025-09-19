"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  BarChart3,
  History,
  Package,
  Package2,
  ShoppingCart,
  Users,
  ChevronDown,
  Plus,
  Edit,
  List,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface NavItemsProps {
  isClient: boolean;
}

export default function NavItems({ isClient }: NavItemsProps) {
  const pathname = usePathname();
  const [clientsOpen, setClientsOpen] = useState(
    pathname.startsWith("/admin/clients")
  );
  const [companiesOpen, setCompaniesOpen] = useState(
    pathname.startsWith("/admin/companies")
  );

  if (isClient) {
    const clientNavItems = [
      { href: "/client", label: "Dashboard", icon: BarChart3 },
      { href: "/client/products", label: "Products", icon: Package },
      { href: "/client/cart", label: "Cart", icon: ShoppingCart },
      { href: "/client/orders", label: "Order History", icon: History },
    ];

    return (
      <nav className="space-y-2">
        {clientNavItems.map((item) => {
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
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    );
  }

  // Admin navigation with collapsible Clients
  return (
    <nav className="space-y-2">
      {/* Dashboard */}
      <Link
        href="/admin"
        className={cn(
          "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors",
          pathname === "/admin"
            ? "bg-primary text-primary-foreground"
            : "text-muted-foreground hover:text-foreground hover:bg-muted"
        )}
      >
        <BarChart3 className="h-4 w-4" />
        Dashboard
      </Link>

      {/* Products */}
      <Link
        href="/admin/products"
        className={cn(
          "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors",
          pathname === "/admin/products"
            ? "bg-primary text-primary-foreground"
            : "text-muted-foreground hover:text-foreground hover:bg-muted"
        )}
      >
        <Package2 className="h-4 w-4" />
        Products
      </Link>

      {/* Clients Collapsible */}
      <Collapsible open={clientsOpen} onOpenChange={setClientsOpen}>
        <CollapsibleTrigger asChild>
          <button
            className={cn(
              "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors w-full text-left",
              "text-muted-foreground hover:text-foreground hover:bg-muted"
            )}
          >
            Clients
            <ChevronDown
              className={cn(
                "h-4 w-4 ml-auto transition-transform duration-200",
                clientsOpen ? "rotate-180" : ""
              )}
            />
          </button>
        </CollapsibleTrigger>
        <CollapsibleContent className="space-y-1 ml-6">
          <Link
            href="/admin/clients"
            className={cn(
              "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors",
              pathname === "/admin/clients"
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground hover:bg-muted"
            )}
          >
            <List className="h-4 w-4" />
            Manage Clients
          </Link>
          {pathname.startsWith("/admin/clients/") &&
            pathname !== "/admin/clients/new" && (
              <Link
                href={pathname}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors",
                  "bg-primary text-primary-foreground"
                )}
              >
                <Edit className="h-4 w-4" />
                Edit Client
              </Link>
            )}
          <Link
            href="/admin/clients/new"
            className={cn(
              "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors",
              pathname === "/admin/clients/new"
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground hover:bg-muted"
            )}
          >
            <Plus className="h-4 w-4" />
            Add Client
          </Link>
        </CollapsibleContent>
      </Collapsible>

      {/* Companies Collapsible */}
      <Collapsible open={companiesOpen} onOpenChange={setCompaniesOpen}>
        <CollapsibleTrigger asChild>
          <button
            className={cn(
              "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors w-full text-left",
              "text-muted-foreground hover:text-foreground hover:bg-muted"
            )}
          >
            Companies
            <ChevronDown
              className={cn(
                "h-4 w-4 ml-auto transition-transform duration-200",
                companiesOpen ? "rotate-180" : ""
              )}
            />
          </button>
        </CollapsibleTrigger>
        <CollapsibleContent className="space-y-1 ml-6">
          <Link
            href="/admin/companies"
            className={cn(
              "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors",
              pathname === "/admin/companies"
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground hover:bg-muted"
            )}
          >
            <List className="h-4 w-4" />
            Manage Companies
          </Link>
          {pathname.startsWith("/admin/companies/") &&
            pathname !== "/admin/companies/new" && (
              <Link
                href={pathname}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors",
                  "bg-primary text-primary-foreground"
                )}
              >
                <Edit className="h-4 w-4" />
                Edit Company
              </Link>
            )}
          <Link
            href="/admin/companies/new"
            className={cn(
              "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors",
              pathname === "/admin/companies/new"
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground hover:bg-muted"
            )}
          >
            <Plus className="h-4 w-4" />
            Add Company
          </Link>
        </CollapsibleContent>
      </Collapsible>

      {/* Orders */}
      <Link
        href="/admin/orders"
        className={cn(
          "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors",
          pathname === "/admin/orders"
            ? "bg-primary text-primary-foreground"
            : "text-muted-foreground hover:text-foreground hover:bg-muted"
        )}
      >
        <History className="h-4 w-4" />
        Orders
      </Link>
    </nav>
  );
}
