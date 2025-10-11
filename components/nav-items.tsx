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
  List,
  Building2,
  Shield,
  UserCog,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface NavItemsProps {
  isClient: boolean;
  isCollapsed?: boolean;
}

export default function NavItems({ isClient, isCollapsed = false }: NavItemsProps) {
  const pathname = usePathname();
  const [clientsOpen, setClientsOpen] = useState(
    pathname.startsWith("/admin/clients")
  );
  const [companiesOpen, setCompaniesOpen] = useState(
    pathname.startsWith("/admin/companies")
  );
  const [rolesOpen, setRolesOpen] = useState(
    pathname.startsWith("/admin/roles")
  );
  const [usersOpen, setUsersOpen] = useState(
    pathname.startsWith("/admin/users")
  );

  if (isClient) {
    const clientNavItems = [
      { href: "/client", label: "Dashboard", icon: BarChart3 },
      { href: "/client/products", label: "Products", icon: Package },
      { href: "/client/cart", label: "Cart", icon: ShoppingCart },
      { href: "/client/orders", label: "Order History", icon: History },
    ];

    return (
      <nav className="space-y-1">
        {clientNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center rounded-lg transition-all duration-200 text-sm font-medium group relative",
                isCollapsed ? "px-2 py-2.5 justify-center" : "gap-3 px-3 py-2.5",
                isActive
                  ? "bg-blue-50 text-blue-700 border-r-2 border-blue-700"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              )}
              title={isCollapsed ? item.label : undefined}
              onClick={(e) => {
                if (isCollapsed) {
                  e.stopPropagation();
                }
              }}
            >
              <Icon className="h-4 w-4 flex-shrink-0" />
              {!isCollapsed && <span>{item.label}</span>}
              {isCollapsed && (
                <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                  {item.label}
                </div>
              )}
            </Link>
          );
        })}
      </nav>
    );
  }

  // Professional Admin Navigation
  const adminNavItems = [
    { 
      href: "/admin", 
      label: "Dashboard", 
      icon: BarChart3,
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    { 
      href: "/admin/products", 
      label: "Products", 
      icon: Package2,
      color: "text-purple-600",
      bgColor: "bg-purple-50"
    },
    { 
      href: "/admin/orders", 
      label: "Orders", 
      icon: ShoppingCart,
      color: "text-green-600",
      bgColor: "bg-green-50"
    },
  ];

  return (
    <div className={cn("transition-all duration-300", isCollapsed ? "space-y-2" : "space-y-6")}>
      {/* Main Navigation */}
      <div>
        {!isCollapsed && (
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
            Main Menu
          </h3>
        )}
        <nav className="space-y-1">
          {adminNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center rounded-lg transition-all duration-200 text-sm font-medium group relative",
                  isCollapsed ? "px-2 py-2.5 justify-center" : "gap-3 px-3 py-2.5",
                  isActive
                    ? `${item.bgColor} ${item.color} shadow-sm`
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                )}
                title={isCollapsed ? item.label : undefined}
                onClick={(e) => {
                  if (isCollapsed) {
                    e.stopPropagation();
                  }
                }}
              >
                <Icon className={cn(
                  "h-4 w-4 transition-colors flex-shrink-0",
                  isActive ? item.color : "text-gray-400 group-hover:text-gray-600"
                )} />
                {!isCollapsed && (
                  <>
                    <span>{item.label}</span>
                    {isActive && (
                      <div className="ml-auto w-1.5 h-1.5 rounded-full bg-current"></div>
                    )}
                  </>
                )}
                {isCollapsed && (
                  <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                    {item.label}
                  </div>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Management Section */}
      {!isCollapsed && (
        <div>
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
            Management
          </h3>
          <nav className="space-y-1">
            {/* Clients Collapsible */}
            <Collapsible open={clientsOpen} onOpenChange={setClientsOpen}>
              <CollapsibleTrigger asChild>
                <button
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 w-full text-left text-sm font-medium group",
                    clientsOpen || pathname.startsWith("/admin/clients")
                      ? "bg-orange-50 text-orange-700"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  )}
                >
                  <Users className={cn(
                    "h-4 w-4 transition-colors",
                    clientsOpen || pathname.startsWith("/admin/clients")
                      ? "text-orange-600"
                      : "text-gray-400 group-hover:text-gray-600"
                  )} />
                  Clients
                  <ChevronDown
                    className={cn(
                      "h-4 w-4 ml-auto transition-transform duration-200",
                      clientsOpen ? "rotate-180" : ""
                    )}
                  />
                </button>
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-1 ml-6 space-y-1">
                <Link
                  href="/admin/clients"
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-sm",
                    pathname === "/admin/clients"
                      ? "bg-orange-100 text-orange-800"
                      : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                  )}
                >
                  <List className="h-3 w-3" />
                  All Clients
                </Link>
                <Link
                  href="/admin/clients/new"
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-sm",
                    pathname === "/admin/clients/new"
                      ? "bg-orange-100 text-orange-800"
                      : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                  )}
                >
                  <Plus className="h-3 w-3" />
                  Add Client
                </Link>
              </CollapsibleContent>
            </Collapsible>

            {/* Companies Collapsible */}
            <Collapsible open={companiesOpen} onOpenChange={setCompaniesOpen}>
              <CollapsibleTrigger asChild>
                <button
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 w-full text-left text-sm font-medium group",
                    companiesOpen || pathname.startsWith("/admin/companies")
                      ? "bg-teal-50 text-teal-700"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  )}
                >
                  <Building2 className={cn(
                    "h-4 w-4 transition-colors",
                    companiesOpen || pathname.startsWith("/admin/companies")
                      ? "text-teal-600"
                      : "text-gray-400 group-hover:text-gray-600"
                  )} />
                  Companies
                  <ChevronDown
                    className={cn(
                      "h-4 w-4 ml-auto transition-transform duration-200",
                      companiesOpen ? "rotate-180" : ""
                    )}
                  />
                </button>
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-1 ml-6 space-y-1">
                <Link
                  href="/admin/companies"
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-sm",
                    pathname === "/admin/companies"
                      ? "bg-teal-100 text-teal-800"
                      : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                  )}
                >
                  <List className="h-3 w-3" />
                  All Companies
                </Link>
                <Link
                  href="/admin/companies/new"
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-sm",
                    pathname === "/admin/companies/new"
                      ? "bg-teal-100 text-teal-800"
                      : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                  )}
                >
                  <Plus className="h-3 w-3" />
                  Add Company
                </Link>
              </CollapsibleContent>
            </Collapsible>

            {/* Role Management Collapsible */}
            <Collapsible open={rolesOpen} onOpenChange={setRolesOpen}>
              <CollapsibleTrigger asChild>
                <button
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 w-full text-left text-sm font-medium group",
                    rolesOpen || pathname.startsWith("/admin/roles")
                      ? "bg-purple-50 text-purple-700"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  )}
                  suppressHydrationWarning
                >
                  <Shield className={cn(
                    "h-4 w-4 transition-colors",
                    rolesOpen || pathname.startsWith("/admin/roles")
                      ? "text-purple-600"
                      : "text-gray-400 group-hover:text-gray-600"
                  )} />
                  Roles
                  <ChevronDown
                    className={cn(
                      "h-4 w-4 ml-auto transition-transform duration-200",
                      rolesOpen ? "rotate-180" : ""
                    )}
                  />
                </button>
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-1 ml-6 space-y-1">
                <Link
                  href="/admin/roles"
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-sm",
                    pathname === "/admin/roles"
                      ? "bg-purple-100 text-purple-800"
                      : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                  )}
                >
                  <List className="h-3 w-3" />
                  All Roles
                </Link>
                <Link
                  href="/admin/roles/new"
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-sm",
                    pathname === "/admin/roles/new"
                      ? "bg-purple-100 text-purple-800"
                      : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                  )}
                >
                  <Plus className="h-3 w-3" />
                  Create Role
                </Link>
              </CollapsibleContent>
            </Collapsible>

            {/* User Management Collapsible */}
            <Collapsible open={usersOpen} onOpenChange={setUsersOpen}>
              <CollapsibleTrigger asChild>
                <button
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 w-full text-left text-sm font-medium group",
                    usersOpen || pathname.startsWith("/admin/users")
                      ? "bg-indigo-50 text-indigo-700"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  )}
                  suppressHydrationWarning
                >
                  <UserCog className={cn(
                    "h-4 w-4 transition-colors",
                    usersOpen || pathname.startsWith("/admin/users")
                      ? "text-indigo-600"
                      : "text-gray-400 group-hover:text-gray-600"
                  )} />
                  Users
                  <ChevronDown
                    className={cn(
                      "h-4 w-4 ml-auto transition-transform duration-200",
                      usersOpen ? "rotate-180" : ""
                    )}
                  />
                </button>
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-1 ml-6 space-y-1">
                <Link
                  href="/admin/users"
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-sm",
                    pathname === "/admin/users"
                      ? "bg-indigo-100 text-indigo-800"
                      : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                  )}
                >
                  <List className="h-3 w-3" />
                  All Users
                </Link>
                <Link
                  href="/admin/users/new"
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-sm",
                    pathname === "/admin/users/new"
                      ? "bg-indigo-100 text-indigo-800"
                      : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                  )}
                >
                  <Plus className="h-3 w-3" />
                  Add User
                </Link>
              </CollapsibleContent>
            </Collapsible>
          </nav>
        </div>
      )}

      {/* Collapsed Management Icons with Dropdowns */}
      {isCollapsed && (
        <div className="space-y-1 mt-4">
          {/* Separator line */}
          <div className="w-8 h-px bg-gray-200 mx-auto mb-2"></div>
          
          {/* Clients Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className={cn(
                  "flex items-center justify-center px-2 py-2.5 rounded-lg transition-all duration-200 text-sm font-medium group relative w-full",
                  pathname.startsWith("/admin/clients")
                    ? "bg-orange-50 text-orange-700"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                )}
                onClick={(e) => e.stopPropagation()}
              >
                <Users className="h-4 w-4 flex-shrink-0" />
                <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50 group-focus:opacity-0">
                  Clients
                </div>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent side="right" className="w-48 ml-2">
              <DropdownMenuLabel>Clients</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/admin/clients" className="flex items-center gap-2 cursor-pointer">
                  <List className="h-4 w-4" />
                  All Clients
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/admin/clients/new" className="flex items-center gap-2 cursor-pointer">
                  <Plus className="h-4 w-4" />
                  Add Client
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Companies Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className={cn(
                  "flex items-center justify-center px-2 py-2.5 rounded-lg transition-all duration-200 text-sm font-medium group relative w-full",
                  pathname.startsWith("/admin/companies")
                    ? "bg-teal-50 text-teal-700"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                )}
                onClick={(e) => e.stopPropagation()}
              >
                <Building2 className="h-4 w-4 flex-shrink-0" />
                <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50 group-focus:opacity-0">
                  Companies
                </div>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent side="right" className="w-48 ml-2">
              <DropdownMenuLabel>Companies</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/admin/companies" className="flex items-center gap-2 cursor-pointer">
                  <List className="h-4 w-4" />
                  All Companies
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/admin/companies/new" className="flex items-center gap-2 cursor-pointer">
                  <Plus className="h-4 w-4" />
                  Add Company
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Role Management Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className={cn(
                  "flex items-center justify-center px-2 py-2.5 rounded-lg transition-all duration-200 text-sm font-medium group relative w-full",
                  pathname.startsWith("/admin/roles")
                    ? "bg-purple-50 text-purple-700"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                )}
                onClick={(e) => e.stopPropagation()}
              >
                <Shield className="h-4 w-4 flex-shrink-0" />
                <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50 group-focus:opacity-0">
                  Role Management
                </div>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent side="right" className="w-48 ml-2">
              <DropdownMenuLabel>Role Management</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/admin/roles" className="flex items-center gap-2 cursor-pointer">
                  <List className="h-4 w-4" />
                  All Roles
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/admin/roles/new" className="flex items-center gap-2 cursor-pointer">
                  <Plus className="h-4 w-4" />
                  Create Role
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* User Management Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className={cn(
                  "flex items-center justify-center px-2 py-2.5 rounded-lg transition-all duration-200 text-sm font-medium group relative w-full",
                  pathname.startsWith("/admin/users")
                    ? "bg-indigo-50 text-indigo-700"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                )}
                onClick={(e) => e.stopPropagation()}
              >
                <UserCog className="h-4 w-4 flex-shrink-0" />
                <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50 group-focus:opacity-0">
                  User Management
                </div>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent side="right" className="w-48 ml-2">
              <DropdownMenuLabel>User Management</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/admin/users" className="flex items-center gap-2 cursor-pointer">
                  <List className="h-4 w-4" />
                  All Users
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/admin/users/new" className="flex items-center gap-2 cursor-pointer">
                  <Plus className="h-4 w-4" />
                  Add User
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}


    </div>
  );
}
