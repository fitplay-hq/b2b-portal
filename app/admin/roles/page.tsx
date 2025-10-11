"use client";

import { useState, useEffect } from "react";
import Layout from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Shield, UserPlus, Search, Settings, Eye, Trash2 } from "lucide-react";
import Link from "next/link";

interface Role {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  permissions: Array<{
    id: string;
    resource: string;
    action: string;
    description: string;
  }>;
  _count: {
    permissions: number;
  };
}

export default function RolesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterByPermissions, setFilterByPermissions] = useState("all");
  const [roles, setRoles] = useState<Role[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch roles from API
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("/api/admin/roles");
        if (response.ok) {
          const data = await response.json();
          setRoles(Array.isArray(data) ? data : data.roles || []);
        } else {
          const errorData = await response.json();
          setError(errorData.message || "Failed to fetch roles");
        }
      } catch (error) {
        console.error("Error fetching roles:", error);
        setError("Network error while fetching roles");
      } finally {
        setIsLoading(false);
      }
    };

    fetchRoles();
  }, []);

  // Delete role function
  const handleDeleteRole = async (roleId: string, roleName: string) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete the role "${roleName}"? This action cannot be undone.`
    );
    
    if (!confirmDelete) return;

    try {
      const response = await fetch(`/api/admin/roles/${roleId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        // Remove the role from the local state
        setRoles(roles.filter(role => role.id !== roleId));
        alert(`Role "${roleName}" has been deleted successfully.`);
      } else {
        const errorData = await response.json();
        alert(`Failed to delete role: ${errorData.message || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Error deleting role:", error);
      alert("Network error while deleting role. Please try again.");
    }
  };
  
  const RoleManagementContent = () => (
    <div className="space-y-8 max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-purple-600" />
            <h1 className="text-2xl font-bold text-gray-900">Role Management</h1>
          </div>
          <p className="text-gray-600">Manage system roles and permissions</p>
        </div>
        <Button asChild className="bg-purple-600 hover:bg-purple-700">
          <Link href="/admin/roles/new">
            <UserPlus className="h-4 w-4 mr-2" />
            Create Role
          </Link>
        </Button>
      </div>

      {/* Filters Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="search">Search Roles</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
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
                  <SelectItem value="all">All permissions</SelectItem>
                  <SelectItem value="users">User Management</SelectItem>
                  <SelectItem value="roles">Role Management</SelectItem>
                  <SelectItem value="products">Product Management</SelectItem>
                  <SelectItem value="orders">Order Management</SelectItem>
                  <SelectItem value="clients">Client Management</SelectItem>
                  <SelectItem value="companies">Company Management</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Roles List */}
      {isLoading ? (
        <Card className="text-center py-12">
          <CardContent>
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading roles...</p>
          </CardContent>
        </Card>
      ) : error ? (
        <Card className="text-center py-12">
          <CardContent>
            <div className="text-red-600 mb-4">⚠️</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Error loading roles</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <Button onClick={() => window.location.reload()} variant="outline">
              Try Again
            </Button>
          </CardContent>
        </Card>
      ) : roles.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No roles configured yet
            </h3>
            <p className="text-gray-600 mb-6">
              Get started by creating your first role with custom permissions.
            </p>
            <Button asChild className="bg-purple-600 hover:bg-purple-700">
              <Link href="/admin/roles/new">
                <UserPlus className="h-4 w-4 mr-2" />
                Create Role
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {roles.map((role) => (
            <Card key={role.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{role.name}</CardTitle>
                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                    role.isActive 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-red-100 text-red-700'
                  }`}>
                    {role.isActive ? 'Active' : 'Inactive'}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {role.description}
                </p>
                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <span>Permissions: {role._count?.permissions || role.permissions?.length || 0}</span>
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="destructive" 
                    size="sm" 
                    className="flex-1"
                    onClick={() => handleDeleteRole(role.id, role.name)}
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Separator />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
              <Settings className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Permission Types</p>
                <p className="text-2xl font-bold text-gray-900">6</p>
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
                <p className="text-2xl font-bold text-gray-900">{roles.filter(role => role.isActive).length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  return (
    <Layout isClient={false}>
      <RoleManagementContent />
    </Layout>
  );
}