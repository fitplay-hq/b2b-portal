"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Shield, UserPlus, Edit2, Trash2, Search, Users, Settings, Eye, Package, Truck } from "lucide-react";
import Link from "next/link";

// Role data - Initially hardcoded, will be moved to API later
const defaultRoles = [
  {
    id: "1",
    name: "Master Admin",
    description: "Full system access with all permissions",
    permissions: ["users:create", "users:read", "users:update", "users:delete", "roles:create", "roles:read", "roles:update", "roles:delete", "products:create", "products:read", "products:update", "products:delete", "orders:create", "orders:read", "orders:update", "orders:delete", "clients:create", "clients:read", "clients:update", "clients:delete", "companies:create", "companies:read", "companies:update", "companies:delete"],
    userCount: 1,
    color: "bg-red-100 text-red-700 border-red-200",
    icon: <Shield className="h-4 w-4" />
  },
  {
    id: "2",
    name: "Warehouse Manager",
    description: "Manage inventory, products, and stock levels",
    permissions: ["products:create", "products:read", "products:update", "products:delete", "orders:read", "orders:update"],
    userCount: 2,
    color: "bg-blue-100 text-blue-700 border-blue-200",
    icon: <Package className="h-4 w-4" />
  },
  {
    id: "3",
    name: "Category Manager",
    description: "Manage product categories and client assignments",
    permissions: ["products:read", "products:update", "clients:read", "clients:update", "companies:read", "companies:update"],
    userCount: 3,
    color: "bg-green-100 text-green-700 border-green-200",
    icon: <Settings className="h-4 w-4" />
  },
  {
    id: "4",
    name: "Delivery Person",
    description: "View and update order delivery status",
    permissions: ["orders:read", "orders:update", "clients:read"],
    userCount: 1,
    color: "bg-yellow-100 text-yellow-700 border-yellow-200",
    icon: <Truck className="h-4 w-4" />
  },
  {
    id: "5",
    name: "View Only",
    description: "Read-only access to view data without modifications",
    permissions: ["products:read", "orders:read", "clients:read", "companies:read"],
    userCount: 0,
    color: "bg-gray-100 text-gray-700 border-gray-200",
    icon: <Eye className="h-4 w-4" />
  }
];

// Permission categories for better organization
const permissionCategories = {
  users: { label: "User Management", color: "indigo" },
  roles: { label: "Role Management", color: "purple" },
  products: { label: "Product Management", color: "green" },
  orders: { label: "Order Management", color: "orange" },
  clients: { label: "Client Management", color: "blue" },
  companies: { label: "Company Management", color: "teal" }
};

export default function RolesPage() {
  const [roles] = useState(defaultRoles);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterByPermissions, setFilterByPermissions] = useState("");

  // Filter roles based on search term and permissions
  const filteredRoles = roles.filter(role => {
    const matchesSearch = role.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         role.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesPermissions = !filterByPermissions || 
                              role.permissions.some(perm => perm.startsWith(filterByPermissions));
    
    return matchesSearch && matchesPermissions;
  });

  const getPermissionBadge = (permission: string) => {
    const [category, action] = permission.split(":");
    const categoryInfo = permissionCategories[category as keyof typeof permissionCategories];
    
    if (!categoryInfo) return null;
    
    const colorClass = {
      indigo: "bg-indigo-100 text-indigo-700",
      purple: "bg-purple-100 text-purple-700",
      green: "bg-green-100 text-green-700",
      orange: "bg-orange-100 text-orange-700",
      blue: "bg-blue-100 text-blue-700",
      teal: "bg-teal-100 text-teal-700"
    }[categoryInfo.color];

    return (
      <Badge key={permission} variant="secondary" className={`${colorClass} text-xs`}>
        {categoryInfo.label.replace(" Management", "")}: {action}
      </Badge>
    );
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Shield className="h-6 w-6" />
            Role Management
          </h1>
          <p className="text-gray-600 mt-1">
            Manage system roles and permissions
          </p>
        </div>
        <Link href="/admin/roles/new">
          <Button className="bg-purple-600 hover:bg-purple-700">
            <UserPlus className="h-4 w-4 mr-2" />
            Create Role
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="search">Search Roles</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  id="search"
                  placeholder="Search by name or description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="permissions">Filter by Permissions</Label>
              <Select value={filterByPermissions} onValueChange={setFilterByPermissions}>
                <SelectTrigger>
                  <SelectValue placeholder="All permissions" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All permissions</SelectItem>
                  {Object.entries(permissionCategories).map(([key, category]) => (
                    <SelectItem key={key} value={key}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Roles Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredRoles.map((role) => (
          <Card key={role.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`p-2 rounded-lg ${role.color}`}>
                    {role.icon}
                  </div>
                  <div>
                    <CardTitle className="text-lg">{role.name}</CardTitle>
                    <div className="flex items-center gap-1 text-sm text-gray-500">
                      <Users className="h-3 w-3" />
                      {role.userCount} user{role.userCount !== 1 ? 's' : ''}
                    </div>
                  </div>
                </div>
                <div className="flex gap-1">
                  <Button variant="ghost" size="sm" asChild>
                    <Link href={`/admin/roles/${role.id}/edit`}>
                      <Edit2 className="h-4 w-4" />
                    </Link>
                  </Button>
                  {role.name !== "Master Admin" && (
                    <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription className="mb-4">
                {role.description}
              </CardDescription>
              
              <Separator className="my-4" />
              
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-2">
                  Permissions ({role.permissions.length})
                </h4>
                <div className="flex flex-wrap gap-1 max-h-20 overflow-y-auto">
                  {role.permissions.map((permission) => getPermissionBadge(permission))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredRoles.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No roles found</h3>
            <p className="text-gray-500 mb-4">
              {searchTerm || filterByPermissions 
                ? "Try adjusting your search criteria."
                : "Get started by creating your first role."
              }
            </p>
            {!searchTerm && !filterByPermissions && (
              <Link href="/admin/roles/new">
                <Button>
                  <UserPlus className="h-4 w-4 mr-2" />
                  Create Role
                </Button>
              </Link>
            )}
          </CardContent>
        </Card>
      )}

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Shield className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Roles</p>
                <p className="text-2xl font-bold text-gray-900">{roles.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-2xl font-bold text-gray-900">
                  {roles.reduce((sum, role) => sum + role.userCount, 0)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Settings className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Permission Types</p>
                <p className="text-2xl font-bold text-gray-900">
                  {Object.keys(permissionCategories).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Eye className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Roles</p>
                <p className="text-2xl font-bold text-gray-900">
                  {roles.filter(role => role.userCount > 0).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}