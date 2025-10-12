"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Layout from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Shield, ArrowLeft, Save } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

// Interface for permissions fetched from API

interface Permission {
  id: string;
  resource: string;
  action: string;
  description: string;
}

export default function NewRolePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [roleName, setRoleName] = useState("");
  const [roleDescription, setRoleDescription] = useState("");
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [isLoadingPermissions, setIsLoadingPermissions] = useState(true);

  // Check if user is authorized (only ADMIN can create roles)
  const isUnauthorized = session && session.user?.role !== "ADMIN";

  useEffect(() => {
    if (status === "loading") return; // Still loading
    
    if (!session) {
      router.push('/login');
      return;
    }

    // Don't redirect, just stop loading
    if (session.user?.role !== "ADMIN") {
      setIsLoadingPermissions(false);
      return;
    }
  }, [session, status, router]);

  // Fetch permissions from API
  useEffect(() => {
    const fetchPermissions = async () => {
      try {
        console.log("Fetching permissions...");
        const response = await fetch("/api/admin/permissions");
        console.log("Response status:", response.status);
        
        if (response.ok) {
          const permissionsData = await response.json();
          console.log("Permissions data:", permissionsData);
          const perms = Array.isArray(permissionsData) ? permissionsData : permissionsData.permissions || [];
          console.log("Total permissions loaded:", perms.length);
          setPermissions(perms);
        } else {
          const errorData = await response.text();
          console.error("Failed to fetch permissions:", response.status, errorData);
        }
      } catch (error) {
        console.error("Error fetching permissions:", error);
      } finally {
        setIsLoadingPermissions(false);
      }
    };

    fetchPermissions();
  }, []);

  const handlePermissionChange = (permissionId: string, checked: boolean) => {
    const permission = permissions.find(p => p.id === permissionId);
    
    if (checked) {
      setSelectedPermissions(prev => {
        const newPermissions = [...prev, permissionId];
        
        // Auto-add inventory view when products view is selected
        if (permission?.resource === "products" && 
            (permission.action === "read" || permission.action === "view")) {
          const inventoryViewPermission = permissions.find(p => 
            p.resource === "inventory" && 
            (p.action === "read" || p.action === "view")
          );
          if (inventoryViewPermission && !newPermissions.includes(inventoryViewPermission.id)) {
            newPermissions.push(inventoryViewPermission.id);
          }
        }
        
        return newPermissions;
      });
    } else {
      setSelectedPermissions(prev => prev.filter(p => p !== permissionId));
    }
  };

  const handleCategoryToggle = (category: string, checked: boolean) => {
    const categoryPermissions = permissions
      .filter(perm => perm.resource === category)
      .map(perm => perm.id);

    if (checked) {
      setSelectedPermissions(prev => [...new Set([...prev, ...categoryPermissions])]);
    } else {
      setSelectedPermissions(prev => prev.filter(p => {
        const permission = permissions.find(perm => perm.id === p);
        return permission?.resource !== category;
      }));
    }
  };

  const isCategoryFullySelected = (category: string) => {
    const categoryPermissions = permissions
      .filter(perm => perm.resource === category)
      .map(perm => perm.id);
    
    return categoryPermissions.length > 0 && categoryPermissions.every(perm => selectedPermissions.includes(perm));
  };

  const isCategoryPartiallySelected = (category: string) => {
    const categoryPermissions = permissions
      .filter(perm => perm.resource === category)
      .map(perm => perm.id);
    
    return categoryPermissions.some(perm => selectedPermissions.includes(perm)) && 
           !categoryPermissions.every(perm => selectedPermissions.includes(perm));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch("/api/admin/roles", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: roleName,
          description: roleDescription,
          permissionIds: selectedPermissions
        }),
      });

      if (response.ok) {
        const newRole = await response.json();
        console.log("Role created successfully:", newRole);
        
        // Reset form
        setRoleName("");
        setRoleDescription("");
        setSelectedPermissions([]);
        
        // Show success message and redirect
        toast.success("Role created successfully!");
        
        // Redirect to roles list
        router.push("/admin/roles");
      } else {
        const error = await response.json();
        console.error("Failed to create role:", error);
        toast.error(`Failed to create role: ${error.message || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Network error:", error);
      toast.error("Network error. Please try again.");
    }
  };

  // Show unauthorized message if user doesn't have permission
  if (isUnauthorized) {
    return (
      <Layout isClient={false}>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Card className="w-full max-w-md">
            <CardContent className="flex flex-col items-center text-center p-8">
              <Shield className="h-16 w-16 text-red-500 mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Access Denied</h2>
              <p className="text-gray-600 mb-4">
                You do not have permission to create roles. Role management is restricted to administrators only.
              </p>
              <Button asChild variant="outline">
                <Link href="/admin">
                  Return to Dashboard
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <Layout isClient={false}>
      <div className="space-y-8 max-w-4xl">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/admin/roles">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Roles
          </Link>
        </Button>
        <div className="flex items-center gap-2">
          <Shield className="h-6 w-6 text-purple-600" />
          <h1 className="text-2xl font-bold text-gray-900">Create New Role</h1>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>
              Define the role name and description
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="roleName">Role Name *</Label>
              <Input
                id="roleName"
                placeholder="e.g., Warehouse Manager"
                value={roleName}
                onChange={(e) => setRoleName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="roleDescription">Description</Label>
              <Textarea
                id="roleDescription"
                placeholder="Describe what this role can do..."
                value={roleDescription}
                onChange={(e) => setRoleDescription(e.target.value)}
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Permissions */}
        <Card>
          <CardHeader>
            <CardTitle>Permissions</CardTitle>
            <CardDescription>
              Select the permissions this role should have
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {isLoadingPermissions ? (
              <div className="text-center py-4">Loading permissions...</div>
            ) : (
              ["users", "roles", "products", "orders", "clients", "companies", "inventory"].map((resource) => {
                const resourcePermissions = permissions.filter(p => p.resource === resource);
                const resourceLabel = {
                  users: "User Management",
                  roles: "Role Management", 
                  products: "Product Management",
                  orders: "Order Management",
                  clients: "Client Management",
                  companies: "Company Management",
                  inventory: "Inventory Management"
                }[resource] || resource;
                
                const resourceDescription = {
                  users: "Manage system users and their access",
                  roles: "Manage roles and permissions",
                  products: "Manage products and inventory", 
                  orders: "Manage orders and fulfillment",
                  clients: "Manage client accounts and relationships",
                  companies: "Manage company information and settings",
                  inventory: "Inventory (view by default if products view is chosen)"
                }[resource] || "";

                if (resourcePermissions.length === 0) return null;

                return (
                  <div key={resource} className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <Checkbox
                        id={`category-${resource}`}
                        checked={isCategoryFullySelected(resource)}
                        onCheckedChange={(checked) => 
                          handleCategoryToggle(resource, checked as boolean)
                        }
                        className={isCategoryPartiallySelected(resource) ? "data-[state=checked]:bg-gray-500" : ""}
                      />
                      <div className="flex-1">
                        <Label 
                          htmlFor={`category-${resource}`}
                          className="text-base font-medium cursor-pointer"
                        >
                          {resourceLabel}
                        </Label>
                        <p className="text-sm text-gray-500 mt-1">
                          {resourceDescription}
                        </p>
                      </div>
                    </div>
                    
                    <div className="ml-6 grid grid-cols-2 md:grid-cols-4 gap-3">
                      {/* Define standard actions with proper mapping */}
                      {["view", "create", "edit", "delete"].map((action) => {
                        // Skip delete for inventory and orders
                        if (action === "delete" && (resource === "inventory" || resource === "orders")) {
                          return null;
                        }
                        
                        // Find permission for this resource and action
                        const permission = resourcePermissions.find(p => 
                          p.action.toLowerCase() === action || 
                          (p.action.toLowerCase() === "read" && action === "view") ||
                          (p.action.toLowerCase() === "update" && action === "edit")
                        );
                        
                        if (!permission) return null;
                        
                        const actionLabels = {
                          view: "View",
                          create: "Create", 
                          edit: "Edit",
                          delete: "Delete"
                        };
                        
                        return (
                          <div key={`${resource}-${action}`} className="flex items-center space-x-2">
                            <Checkbox
                              id={permission.id}
                              checked={selectedPermissions.includes(permission.id)}
                              onCheckedChange={(checked) => 
                                handlePermissionChange(permission.id, checked as boolean)
                              }
                            />
                            <Label 
                              htmlFor={permission.id}
                              className="text-sm cursor-pointer"
                            >
                              {actionLabels[action as keyof typeof actionLabels]}
                            </Label>
                          </div>
                        );
                      })}
                    </div>
                    <Separator />
                  </div>
                );
              })
            )}
          </CardContent>
        </Card>

        {/* Summary */}
        {selectedPermissions.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Permission Summary</CardTitle>
              <CardDescription>
                {selectedPermissions.length} permission{selectedPermissions.length !== 1 ? 's' : ''} selected
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-gray-600">
                <p className="mb-2">This role will have the following permissions:</p>
                <div className="flex flex-wrap gap-1">
                  {selectedPermissions.map((permissionId) => {
                    const permission = permissions.find(p => p.id === permissionId);
                    const displayName = permission 
                      ? `${permission.resource.charAt(0).toUpperCase() + permission.resource.slice(1)}: ${permission.action.charAt(0).toUpperCase() + permission.action.slice(1)}`
                      : permissionId;
                    
                    return (
                      <span
                        key={permissionId}
                        className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-purple-100 text-purple-700"
                      >
                        {displayName}
                      </span>
                    );
                  })}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Actions */}
        <div className="flex justify-end gap-3">
          <Button variant="outline" asChild>
            <Link href="/admin/roles">
              Cancel
            </Link>
          </Button>
          <Button 
            type="submit" 
            className="bg-purple-600 hover:bg-purple-700"
            disabled={!roleName.trim() || selectedPermissions.length === 0}
          >
            <Save className="h-4 w-4 mr-2" />
            Create Role
          </Button>
        </div>
      </form>
      </div>
    </Layout>
  );
}