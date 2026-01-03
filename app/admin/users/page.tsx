"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Layout from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { UserCog, UserPlus, Search, Users, Shield, Clock } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { ClientOnly } from "@/components/client-only";
import { PageGuard } from "@/components/page-guard";
import { RESOURCES } from "@/lib/utils";

interface Role {
  id: string;
  name: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
  createdAt: string;
}

export default function UsersPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterByRole, setFilterByRole] = useState("all");
  const [filterByStatus, setFilterByStatus] = useState("all");
  const [roles, setRoles] = useState<Role[]>([]);
  const [isLoadingRoles, setIsLoadingRoles] = useState(true);
  const [users, setUsers] = useState<User[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(true);
  const [usersError, setUsersError] = useState<string | null>(null);

  // Check if user is authorized (ADMIN or SYSTEM_USER with admin role can access users)
  const isAdmin = session?.user?.role === "ADMIN";
  const isSystemAdmin = session?.user?.role === 'SYSTEM_USER' && 
                       session?.user?.systemRole && 
                       session?.user?.systemRole.toLowerCase() === 'admin';
  const hasAdminAccess = isAdmin || isSystemAdmin;
  const isUnauthorized = session && !hasAdminAccess;

  useEffect(() => {
    if (status === "loading") return; // Still loading
    
    if (!session) {
      router.push('/login');
      return;
    }

    // Don't redirect, just set loading to false so we can show error message
    if (session.user?.role !== "ADMIN") {
      setIsLoadingUsers(false);
      setIsLoadingRoles(false);
      return;
    }
  }, [session, status, router]);

  // Fetch roles for filter dropdown
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await fetch("/api/admin/roles");
        if (response.ok) {
          const rolesData = await response.json();
          setRoles(Array.isArray(rolesData) ? rolesData : rolesData.roles || []);
        } else {
          console.error("Failed to fetch roles");
        }
      } catch (error) {
        console.error("Error fetching roles:", error);
      } finally {
        setIsLoadingRoles(false);
      }
    };

    fetchRoles();
  }, []);

  // Fetch users for listing
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setIsLoadingUsers(true);
        const res = await fetch('/api/admin/users');
        if (res.ok) {
          const data = await res.json();
          const list = Array.isArray(data) ? data : data.users || [];
          setUsers(list);
        } else {
          const err = await res.json().catch(() => ({}));
          setUsersError(err?.error || 'Failed to fetch users');
        }
      } catch (err) {
        console.error('Error fetching users:', err);
        setUsersError('Network error while fetching users');
      } finally {
        setIsLoadingUsers(false);
      }
    };

    fetchUsers();
  }, []);

  // Perform actual user deletion
  const performDeleteUser = async (userId: string, userName: string) => {
    try {
      const res = await fetch(`/api/admin/users/${userId}`, { method: 'DELETE' });
      if (res.ok) {
        setUsers((prev) => prev.filter(u => u.id !== userId));
        toast.success(`User "${userName}" deleted`);
      } else {
        const err = await res.json().catch(() => ({}));
        toast.error(`Failed to delete user: ${err?.error || 'Unknown error'}`);
      }
    } catch (err) {
      console.error('Error deleting user:', err);
      toast.error('Network error while deleting user');
    }
  };

  const handleDeleteUser = async (userId: string, userName: string) => {
    toast(`Are you sure you want to delete user "${userName}"?`, {
      description: "This action cannot be undone.",
      action: {
        label: "Delete",
        onClick: () => performDeleteUser(userId, userName),
      },
      cancel: {
        label: "Cancel",
        onClick: () => {},
      },
    });
  };

  const UserManagementContent = () => (
    <div className="space-y-8 max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <UserCog className="h-6 w-6 text-indigo-600" />
            <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
          </div>
          <p className="text-gray-600">Manage system users and their roles</p>
        </div>
        <Button asChild className="bg-indigo-600 hover:bg-indigo-700">
          <Link href="/admin/users/new">
            <UserPlus className="h-4 w-4 mr-2" />
            Add User
          </Link>
        </Button>
      </div>

      {/* Filters Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="search">Search Users</Label>
              <ClientOnly>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="search"
                    placeholder="Search by name or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </ClientOnly>
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Filter by Role</Label>
              <ClientOnly>
                <Select value={filterByRole} onValueChange={setFilterByRole}>
                  <SelectTrigger>
                    <SelectValue placeholder="All roles" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All roles</SelectItem>
                    {isLoadingRoles ? (
                      <SelectItem value="loading" disabled>Loading roles...</SelectItem>
                    ) : (
                      roles.map((role) => (
                        <SelectItem key={role.id} value={role.id}>
                          {role.name}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </ClientOnly>
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Filter by Status</Label>
              <ClientOnly>
                <Select value={filterByStatus} onValueChange={setFilterByStatus}>
                  <SelectTrigger>
                    <SelectValue placeholder="All statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All statuses</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                  </SelectContent>
                </Select>
              </ClientOnly>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Users List / Empty / Loading / Error */}
      {isLoadingUsers ? (
        <Card className="text-center py-12">
          <CardContent>
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading users...</p>
          </CardContent>
        </Card>
      ) : usersError ? (
        <Card className="text-center py-12">
          <CardContent>
            <div className="text-red-600 mb-4">⚠️</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Error loading users</h3>
            <p className="text-gray-600 mb-6">{usersError}</p>
            <Button onClick={() => window.location.reload()} variant="outline">Try again</Button>
          </CardContent>
        </Card>
      ) : users.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <UserCog className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No users configured yet
            </h3>
            <p className="text-gray-600 mb-6">
              Get started by adding your first user with role-based permissions.
            </p>
            <Button asChild className="bg-indigo-600 hover:bg-indigo-700">
              <Link href="/admin/users/new">
                <UserPlus className="h-4 w-4 mr-2" />
                Add User
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-6">
            {users.map((u) => (
              <Card key={u.id}>
                <CardContent className="p-6 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center text-lg font-medium text-gray-700">{(u.name || u.email || 'U').split(' ').map((s:string)=>s[0]).slice(0,2).join('')}</div>
                    <div>
                      <div className="flex items-center gap-3">
                        <h3 className="text-lg font-medium text-gray-900">{u.name}</h3>
                        {u.isActive && <span className="px-2 py-0.5 text-xs bg-green-100 text-green-700 rounded">Active</span>}
                      </div>
                      <div className="text-sm text-gray-500 mt-1 flex items-center gap-3">
                        <span className="flex items-center gap-2">{u.email}</span>
                        <span className="hidden sm:inline">•</span>
                        <span className="text-xs">{u.role?.name || '—'}</span>
                        <span className="hidden sm:inline">•</span>
                        <span className="text-xs">Joined {new Date(u.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Button variant="outline" size="sm" onClick={() => window.location.href = `/admin/users/${u.id}`}>Edit</Button>
                    <Button variant="destructive" size="sm" onClick={() => handleDeleteUser(u.id, u.name)}>
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      <Separator />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-indigo-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-2xl font-bold text-gray-900">{users.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Shield className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Users</p>
                <p className="text-2xl font-bold text-gray-900">{users.filter(u => u.isActive).length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending Users</p>
                <p className="text-2xl font-bold text-gray-900">{users.filter(u => !u.isActive).length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

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
                You do not have permission to access this page. User management is restricted to administrators only.
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
    <PageGuard resource={RESOURCES.USERS} action="view">
      <Layout isClient={false}>
        <UserManagementContent />
      </Layout>
    </PageGuard>
  );
}