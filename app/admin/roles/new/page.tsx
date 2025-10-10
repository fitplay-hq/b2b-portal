"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Shield, Save, AlertTriangle } from "lucide-react";
import Link from "next/link";

// Permission definitions with descriptions
const permissionDefinitions = {
  users: {
    label: "User Management",
    description: "Manage system users and their accounts",
    color: "bg-indigo-100 text-indigo-700 border-indigo-200",
    permissions: {
      create: "Create new user accounts",
      read: "View user information",
      update: "Edit user profiles and settings",
      delete: "Remove user accounts"
    }
  },
  roles: {
    label: "Role Management",
    description: "Manage system roles and permissions",
    color: "bg-purple-100 text-purple-700 border-purple-200",
    permissions: {
      create: "Create new roles",
      read: "View role information",
      update: "Edit role permissions",
      delete: "Remove roles"
    }
  },
  products: {
    label: "Product Management",
    description: "Manage product catalog and inventory",
    color: "bg-green-100 text-green-700 border-green-200",
    permissions: {
      create: "Add new products",
      read: "View product information",
      update: "Edit product details and inventory",
      delete: "Remove products"
    }
  },
  orders: {
    label: "Order Management",
    description: "Manage customer orders and fulfillment",
    color: "bg-orange-100 text-orange-700 border-orange-200",
    permissions: {
      create: "Create new orders",
      read: "View order information",
      update: "Update order status and details",
      delete: "Cancel or remove orders"
    }
  },
  clients: {
    label: "Client Management",
    description: "Manage client accounts and relationships",
    color: "bg-blue-100 text-blue-700 border-blue-200",
    permissions: {
      create: "Add new clients",
      read: "View client information",
      update: "Edit client profiles",
      delete: "Remove client accounts"
    }
  },
  companies: {
    label: "Company Management",
    description: "Manage company profiles and settings",
    color: "bg-teal-100 text-teal-700 border-teal-200",
    permissions: {
      create: "Add new companies",
      read: "View company information",
      update: "Edit company details",
      delete: "Remove companies"
    }
  }
};

export default function NewRolePage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    permissions: [] as string[]
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handlePermissionChange = (permission: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      permissions: checked
        ? [...prev.permissions, permission]
        : prev.permissions.filter(p => p !== permission)
    }));
  };

  const handleSelectAllCategory = (category: string, checked: boolean) => {
    const categoryPermissions = Object.keys(permissionDefinitions[category as keyof typeof permissionDefinitions].permissions)
      .map(action => `${category}:${action}`);
    
    setFormData(prev => ({
      ...prev,
      permissions: checked
        ? [...prev.permissions.filter(p => !p.startsWith(`${category}:`)), ...categoryPermissions]
        : prev.permissions.filter(p => !p.startsWith(`${category}:`))
    }));
  };

  const getCategoryPermissionCount = (category: string) => {
    const categoryPermissions = Object.keys(permissionDefinitions[category as keyof typeof permissionDefinitions].permissions);
    const selectedCount = formData.permissions.filter(p => p.startsWith(`${category}:`)).length;
    return { selected: selectedCount, total: categoryPermissions.length };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || formData.permissions.length === 0) {
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call - replace with actual API later
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log("Creating role:", formData);
      router.push("/admin/roles");
    } catch (error) {
      console.error("Error creating role:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/admin/roles">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Shield className="h-6 w-6" />
            Create New Role
          </h1>
          <p className="text-gray-600 mt-1">
            Define a new role with specific permissions
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>
              Provide basic details about the role
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Role Name *</Label>
              <Input
                id="name"
                placeholder="Enter role name (e.g., Sales Manager)"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Describe what this role does and its responsibilities..."
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
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
              Select the permissions this role should have. Choose carefully as these determine what users with this role can do.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {formData.permissions.length === 0 && (
              <div className="flex items-center gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg mb-6">
                <AlertTriangle className="h-4 w-4 text-amber-600" />
                <p className="text-sm text-amber-700">
                  Please select at least one permission for this role.
                </p>
              </div>
            )}

            <div className="space-y-6">
              {Object.entries(permissionDefinitions).map(([category, categoryData]) => {
                const { selected, total } = getCategoryPermissionCount(category);
                const isAllSelected = selected === total;
                const isPartiallySelected = selected > 0 && selected < total;

                return (
                  <div key={category} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <Checkbox
                          id={`category-${category}`}
                          checked={isAllSelected}
                          onCheckedChange={(checked) => handleSelectAllCategory(category, !!checked)}
                          className={isPartiallySelected ? "data-[state=checked]:bg-gray-500" : ""}
                        />
                        <div>
                          <Label htmlFor={`category-${category}`} className="text-base font-medium cursor-pointer">
                            {categoryData.label}
                          </Label>
                          <p className="text-sm text-gray-500">{categoryData.description}</p>
                        </div>
                      </div>
                      <Badge className={categoryData.color}>
                        {selected}/{total}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 ml-6">
                      {Object.entries(categoryData.permissions).map(([action, description]) => {
                        const permission = `${category}:${action}`;
                        return (
                          <div key={permission} className="flex items-start gap-2">
                            <Checkbox
                              id={permission}
                              checked={formData.permissions.includes(permission)}
                              onCheckedChange={(checked) => handlePermissionChange(permission, !!checked)}
                            />
                            <div className="grid gap-1.5 leading-none">
                              <Label
                                htmlFor={permission}
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                              >
                                {action.charAt(0).toUpperCase() + action.slice(1)}
                              </Label>
                              <p className="text-xs text-muted-foreground">
                                {description}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Selected Permissions Summary */}
        {formData.permissions.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Selected Permissions ({formData.permissions.length})</CardTitle>
              <CardDescription>
                Review the permissions that will be assigned to this role
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {formData.permissions.map((permission) => {
                  const [category, action] = permission.split(":");
                  const categoryData = permissionDefinitions[category as keyof typeof permissionDefinitions];
                  return (
                    <Badge key={permission} className={categoryData?.color || "bg-gray-100 text-gray-700"}>
                      {categoryData?.label.replace(" Management", "")}: {action}
                    </Badge>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Actions */}
        <div className="flex justify-end gap-3">
          <Link href="/admin/roles">
            <Button variant="outline" type="button">
              Cancel
            </Button>
          </Link>
          <Button 
            type="submit" 
            disabled={!formData.name.trim() || formData.permissions.length === 0 || isSubmitting}
            className="bg-purple-600 hover:bg-purple-700"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                Creating...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Create Role
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}