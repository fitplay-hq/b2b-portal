"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Layout from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Shield, ArrowLeft, Save, Loader2 } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { PageGuard } from "@/components/page-guard";

interface Permission {
  id: string;
  resource: string;
  action: string;
  description: string;
}

interface Role {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  permissions: Permission[];
  userCount: number;
}

interface EditRolePageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function EditRolePage({ params }: EditRolePageProps) {
  const router = useRouter();
  const resolvedParams = React.use(params);
  const [role, setRole] = useState<Role | null>(null);
  const [roleName, setRoleName] = useState("");
  const [roleDescription, setRoleDescription] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [allPermissions, setAllPermissions] = useState<Permission[]>([]);
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Fetch role data and permissions on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch role data
        const roleResponse = await fetch(`/api/admin/roles/${resolvedParams.id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include', // Include cookies for session
        });
        if (roleResponse.ok) {
          const roleData = await roleResponse.json();
          const fetchedRole = roleData.role;
          setRole(fetchedRole);
          setRoleName(fetchedRole.name);
          setRoleDescription(fetchedRole.description || "");
          setIsActive(fetchedRole.isActive);
          setSelectedPermissions(fetchedRole.permissions.map((p: Permission) => p.id));
        } else {
          const errorData = await roleResponse.json().catch(() => ({}));
          console.error(`Role fetch failed with status ${roleResponse.status}:`, errorData);
          toast.error("Failed to fetch role data. You may not have permission to access this.");
          router.push("/admin/roles");
          return;
        }

        // Fetch all permissions
        const permissionsResponse = await fetch("/api/admin/permissions", {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include', // Include cookies for session
        });
        if (permissionsResponse.ok) {
          const permissionsData = await permissionsResponse.json();
          setAllPermissions(permissionsData.permissions || []);
        } else {
          console.error("Permissions fetch failed");
          toast.error("Failed to fetch permissions");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Network error while loading data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [resolvedParams.id, router]);

  const handlePermissionChange = (permissionId: string, checked: boolean) => {
    if (checked) {
      setSelectedPermissions(prev => [...prev, permissionId]);
    } else {
      setSelectedPermissions(prev => prev.filter(id => id !== permissionId));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!roleName.trim()) {
      toast.error("Role name is required");
      return;
    }

    if (selectedPermissions.length === 0) {
      toast.error("Please select at least one permission");
      return;
    }

    setIsSaving(true);

    try {
      const response = await fetch(`/api/admin/roles/${resolvedParams.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: roleName.trim(),
          description: roleDescription.trim(),
          permissionIds: selectedPermissions,
          isActive: isActive,
        }),
      });

      if (response.ok) {
        toast.success("Role updated successfully!");
        router.push("/admin/roles");
      } else {
        const error = await response.json();
        console.error("Failed to update role:", error);
        toast.error(`Failed to update role: ${error.message || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Network error:", error);
      toast.error("Network error. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  // Group permissions by resource
  const groupedPermissions = allPermissions.reduce((groups: { [key: string]: Permission[] }, permission) => {
    const resource = permission.resource;
    if (!groups[resource]) {
      groups[resource] = [];
    }
    groups[resource].push(permission);
    return groups;
  }, {});

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex items-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Loading role data...</span>
        </div>
      </div>
    );
  }

  if (!role) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h2 className="text-lg font-semibold text-gray-900">Role not found</h2>
            <p className="text-gray-600">The role you're looking for doesn't exist.</p>
            <Button asChild className="mt-4">
              <Link href="/admin/roles">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Roles
              </Link>
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <PageGuard adminOnly={true}>
        <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/admin/roles">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Roles
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Shield className="h-6 w-6" />
              Edit Role: {role.name}
            </h1>
            <p className="text-gray-600">
              Modify role details and permissions
            </p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Role Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Role Information</CardTitle>
                <CardDescription>
                  Update the basic information for this role
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="roleName">Role Name *</Label>
                    <Input
                      id="roleName"
                      type="text"
                      value={roleName}
                      onChange={(e) => setRoleName(e.target.value)}
                      placeholder="Enter role name"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="roleDescription">Description</Label>
                    <Textarea
                      id="roleDescription"
                      value={roleDescription}
                      onChange={(e) => setRoleDescription(e.target.value)}
                      placeholder="Enter role description"
                      rows={3}
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="isActive"
                      checked={isActive}
                      onCheckedChange={setIsActive}
                    />
                    <Label htmlFor="isActive">Active Role</Label>
                  </div>

                  <Separator />

                  {/* Permissions Section */}
                  <div>
                    <h3 className="text-lg font-medium mb-4">Permissions</h3>
                    <div className="space-y-6">
                      {Object.entries(groupedPermissions).map(([resource, permissions]) => (
                        <div key={resource} className="space-y-3">
                          <h4 className="font-medium text-gray-900 capitalize">
                            {resource} Permissions
                          </h4>
                          <div className="grid gap-3 sm:grid-cols-2">
                            {permissions.map((permission) => (
                              <div key={permission.id} className="flex items-start space-x-3 p-3 border rounded-lg">
                                <Checkbox
                                  id={permission.id}
                                  checked={selectedPermissions.includes(permission.id)}
                                  onCheckedChange={(checked) => 
                                    handlePermissionChange(permission.id, checked as boolean)
                                  }
                                />
                                <div className="flex-1 min-w-0">
                                  <Label 
                                    htmlFor={permission.id}
                                    className="text-sm font-medium cursor-pointer"
                                  >
                                    {permission.action}
                                  </Label>
                                  <p className="text-xs text-gray-500 mt-1">
                                    {permission.description}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <Button type="submit" disabled={isSaving}>
                      {isSaving ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Updating...
                        </>
                      ) : (
                        <>
                          <Save className="mr-2 h-4 w-4" />
                          Update Role
                        </>
                      )}
                    </Button>
                    <Button type="button" variant="outline" asChild>
                      <Link href="/admin/roles">Cancel</Link>
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Role Info Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Role Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Status</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    role.isActive 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {role.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Users</span>
                  <span className="text-sm font-medium">{role.userCount}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Permissions</span>
                  <span className="text-sm font-medium">{role.permissions.length}</span>
                </div>
              </CardContent>
            </Card>

            {role.userCount > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>⚠️ Warning</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-amber-600">
                    This role is assigned to {role.userCount} user(s). 
                    Changes will affect their access permissions immediately.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
      </PageGuard>
    </Layout>
  );
}