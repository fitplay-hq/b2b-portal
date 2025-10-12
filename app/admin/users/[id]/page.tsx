"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Layout from "@/components/layout";
import { PageGuard } from "@/components/page-guard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { ArrowLeft, UserCog, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { RESOURCES } from "@/lib/utils";
import Link from "next/link";

interface Role {
  id: string;
  name: string;
  description: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  isActive: boolean;
  roleId: string;
  role: Role;
  createdAt: string;
  updatedAt: string;
}

export default function EditUserPage() {
  const router = useRouter();
  const params = useParams();
  const userId = params.id as string;

  const [user, setUser] = useState<User | null>(null);
  const [roles, setRoles] = useState<Role[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    roleId: "",
    isActive: true,
  });

  // Fetch user data and roles
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch user data
        const userResponse = await fetch(`/api/admin/users/${userId}`);
        if (!userResponse.ok) {
          if (userResponse.status === 404) {
            setError("User not found");
            return;
          }
          throw new Error("Failed to fetch user");
        }
        
        const userData = await userResponse.json();
        setUser(userData);
        setFormData({
          name: userData.name,
          email: userData.email,
          roleId: userData.roleId,
          isActive: userData.isActive,
        });

        // Fetch roles
        const rolesResponse = await fetch("/api/admin/roles");
        if (rolesResponse.ok) {
          const rolesData = await rolesResponse.json();
          setRoles(rolesData);
        }

      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to load user data");
      } finally {
        setIsLoading(false);
      }
    };

    if (userId) {
      fetchData();
    }
  }, [userId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.roleId) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success("User updated successfully");
        router.push("/admin/users");
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || "Failed to update user");
      }
    } catch (error) {
      console.error("Error updating user:", error);
      toast.error("An error occurred while updating the user");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (isLoading) {
    return (
      <PageGuard resource={RESOURCES.USERS} action="update" adminOnly>
        <Layout isClient={false}>
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        </Layout>
      </PageGuard>
    );
  }

  if (error || !user) {
    return (
      <PageGuard resource={RESOURCES.USERS} action="update" adminOnly>
        <Layout isClient={false}>
          <div className="min-h-[calc(100vh-4rem)] bg-gray-50 -m-6">
            <div className="p-8">
              <Card className="max-w-md mx-auto">
                <CardHeader>
                  <CardTitle className="text-center text-red-600">Error</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-gray-600 mb-4">{error || "User not found"}</p>
                  <Link href="/admin/users">
                    <Button variant="outline">
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Back to Users
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        </Layout>
      </PageGuard>
    );
  }

  return (
    <PageGuard resource={RESOURCES.USERS} action="update" adminOnly>
      <Layout isClient={false}>
        <div className="min-h-[calc(100vh-4rem)] bg-gray-50 -m-6">
          <div className="p-8">
            <div className="max-w-2xl mx-auto">
              {/* Header */}
              <div className="flex items-center gap-4 mb-8">
                <Link href="/admin/users">
                  <Button variant="outline" size="sm">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Users
                  </Button>
                </Link>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <UserCog className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-semibold text-gray-900">Edit User</h1>
                    <p className="text-gray-600">Update user information and permissions</p>
                  </div>
                </div>
              </div>

              {/* Form */}
              <Card>
                <CardHeader>
                  <CardTitle>User Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Name */}
                    <div>
                      <Label htmlFor="name">Name *</Label>
                      <Input
                        id="name"
                        type="text"
                        value={formData.name}
                        onChange={(e) => handleInputChange("name", e.target.value)}
                        required
                      />
                    </div>

                    {/* Email */}
                    <div>
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        required
                      />
                    </div>

                    {/* Role */}
                    <div>
                      <Label htmlFor="role">Role *</Label>
                      <Select value={formData.roleId} onValueChange={(value) => handleInputChange("roleId", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a role" />
                        </SelectTrigger>
                        <SelectContent>
                          {roles.map((role) => (
                            <SelectItem key={role.id} value={role.id}>
                              {role.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Active Status */}
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="active"
                        checked={formData.isActive}
                        onCheckedChange={(checked: boolean) => handleInputChange("isActive", checked)}
                      />
                      <Label htmlFor="active">Active User</Label>
                    </div>

                    {/* User Info */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="font-medium text-gray-900 mb-2">User Information</h3>
                      <div className="text-sm text-gray-600 space-y-1">
                        <p><strong>User ID:</strong> {user.id}</p>
                        <p><strong>Created:</strong> {new Date(user.createdAt).toLocaleDateString()}</p>
                        <p><strong>Last Updated:</strong> {new Date(user.updatedAt).toLocaleDateString()}</p>
                        <p><strong>Current Role:</strong> {user.role.name}</p>
                      </div>
                    </div>

                    {/* Submit Button */}
                    <div className="flex gap-4">
                      <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Updating...
                          </>
                        ) : (
                          "Update User"
                        )}
                      </Button>
                      <Link href="/admin/users">
                        <Button variant="outline" type="button">
                          Cancel
                        </Button>
                      </Link>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </Layout>
    </PageGuard>
  );
}