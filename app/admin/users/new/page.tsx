"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Layout from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UserCog, ArrowLeft, Save, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { PageGuard } from "@/components/page-guard";

interface Role {
  id: string;
  name: string;
  description: string;
}

export default function NewUserPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [roles, setRoles] = useState<Role[]>([]);
  const [isLoadingRoles, setIsLoadingRoles] = useState(true);

  // Check if user is authorized (only ADMIN can create users)
  const isUnauthorized = session && session.user?.role !== "ADMIN";

  useEffect(() => {
    if (status === "loading") return; // Still loading
    
    if (!session) {
      router.push('/login');
      return;
    }

    // Don't redirect, just stop loading
    if (session.user?.role !== "ADMIN") {
      setIsLoadingRoles(false);
      return;
    }
  }, [session, status, router]);

  // Fetch roles from API
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await fetch("/api/admin/roles");
        if (response.ok) {
          const rolesData = await response.json();
          console.log("Fetched roles:", rolesData); // Debug log
          
          // Ensure rolesData is an array
          if (Array.isArray(rolesData)) {
            setRoles(rolesData);
          } else {
            console.error("Roles data is not an array:", rolesData);
            setRoles([]);
          }
        } else {
          console.error("Failed to fetch roles, status:", response.status);
          setRoles([]);
        }
      } catch (error) {
        console.error("Error fetching roles:", error);
        setRoles([]);
      } finally {
        setIsLoadingRoles(false);
      }
    };

    fetchRoles();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    try {
      const response = await fetch("/api/admin/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
          roleId: role,
        }),
      });

      if (response.ok) {
        const newUser = await response.json();
        console.log("User created successfully:", newUser);
        
        // Reset form
        setName("");
        setEmail("");
        setPassword("");
        setConfirmPassword("");
        setRole("");
        
        // Show success message and redirect
        toast.success("User created successfully!");
        
        // Redirect to users list
        router.push("/admin/users");
      } else {
        const error = await response.json();
        console.error("Failed to create user:", error);
        toast.error(`Failed to create user: ${error.message || "Unknown error"}`);
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
              <UserCog className="h-16 w-16 text-red-500 mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Access Denied</h2>
              <p className="text-gray-600 mb-4">
                You do not have permission to create users. User management is restricted to administrators only.
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
    <PageGuard adminOnly={true}>
      <Layout isClient={false}>
        <div className="bg-gray-50 -m-6">
          <div className="p-8">
            <div className="space-y-8 max-w-2xl">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/admin/users">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Users
          </Link>
        </Button>
        <div className="flex items-center gap-2">
          <UserCog className="h-6 w-6 text-indigo-600" />
          <h1 className="text-2xl font-bold text-gray-900">Add New User</h1>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* User Information */}
        <Card>
          <CardHeader>
            <CardTitle>User Information</CardTitle>
            <CardDescription>
              Enter the basic details for the new user
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                placeholder="Enter full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </CardContent>
        </Card>

        {/* Password */}
        <Card>
          <CardHeader>
            <CardTitle>Password</CardTitle>
            <CardDescription>
              Set a secure password for the user
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">Password *</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={8}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-400" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-400" />
                  )}
                </Button>
              </div>
              <p className="text-sm text-gray-500">
                Password must be at least 8 characters long
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password *</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  minLength={8}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-400" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-400" />
                  )}
                </Button>
              </div>
            </div>
            {password && confirmPassword && password !== confirmPassword && (
              <p className="text-sm text-red-600">
                Passwords do not match
              </p>
            )}
          </CardContent>
        </Card>

        {/* Role Assignment */}
        <Card>
          <CardHeader>
            <CardTitle>Role Assignment</CardTitle>
            <CardDescription>
              Assign a role to determine user permissions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="role">Role *</Label>
              <Select value={role} onValueChange={setRole} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  {isLoadingRoles ? (
                    <SelectItem value="loading" disabled>Loading roles...</SelectItem>
                  ) : roles && roles.length > 0 ? (
                    roles.map((roleItem) => (
                      <SelectItem key={roleItem.id} value={roleItem.id}>
                        <div className="flex flex-col">
                          <span className="font-medium">{roleItem.name}</span>
                          <span className="text-sm text-gray-500">{roleItem.description}</span>
                        </div>
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="no-roles" disabled>No roles available</SelectItem>
                  )}
                </SelectContent>
              </Select>
              <p className="text-sm text-gray-500">
                Role determines what actions this user can perform
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex justify-end gap-3">
          <Button variant="outline" asChild>
            <Link href="/admin/users">
              Cancel
            </Link>
          </Button>
          <Button 
            type="submit" 
            className="bg-indigo-600 hover:bg-indigo-700"
            disabled={
              !name.trim() || 
              !email.trim() || 
              !password.trim() || 
              !role || 
              password !== confirmPassword ||
              password.length < 8
            }
          >
            <Save className="h-4 w-4 mr-2" />
            Add User
          </Button>
        </div>
      </form>
            </div>
          </div>
        </div>
      </Layout>
    </PageGuard>
  );
}