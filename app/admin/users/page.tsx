"use client";

import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import { UserCog, UserPlus, Edit2, Trash2, Search, Mail, Calendar, Shield, Eye, EyeOff, MoreHorizontal } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import Link from "next/link";

// User data - Initially hardcoded, will be moved to API later
const defaultUsers = [
  {
    id: "1",
    name: "John Smith",
    email: "john.smith@company.com",
    avatar: "",
    role: "Master Admin",
    roleColor: "bg-red-100 text-red-700 border-red-200",
    status: "active",
    lastLogin: "2024-01-15T10:30:00Z",
    createdAt: "2024-01-01T00:00:00Z",
    permissions: 24
  },
  {
    id: "2",
    name: "Sarah Johnson",
    email: "sarah.johnson@company.com",
    avatar: "",
    role: "Warehouse Manager",
    roleColor: "bg-blue-100 text-blue-700 border-blue-200",
    status: "active",
    lastLogin: "2024-01-15T09:15:00Z",
    createdAt: "2024-01-02T00:00:00Z",
    permissions: 6
  },
  {
    id: "3",
    name: "Mike Chen",
    email: "mike.chen@company.com",
    avatar: "",
    role: "Warehouse Manager",
    roleColor: "bg-blue-100 text-blue-700 border-blue-200",
    status: "active",
    lastLogin: "2024-01-14T16:45:00Z",
    createdAt: "2024-01-03T00:00:00Z",
    permissions: 6
  },
  {
    id: "4",
    name: "Emma Davis",
    email: "emma.davis@company.com",
    avatar: "",
    role: "Category Manager",
    roleColor: "bg-green-100 text-green-700 border-green-200",
    status: "active",
    lastLogin: "2024-01-15T08:20:00Z",
    createdAt: "2024-01-04T00:00:00Z",
    permissions: 6
  },
  {
    id: "5",
    name: "Alex Rodriguez",
    email: "alex.rodriguez@company.com",
    avatar: "",
    role: "Category Manager",
    roleColor: "bg-green-100 text-green-700 border-green-200",
    status: "inactive",
    lastLogin: "2024-01-10T14:30:00Z",
    createdAt: "2024-01-05T00:00:00Z",
    permissions: 6
  },
  {
    id: "6",
    name: "Lisa Wang",
    email: "lisa.wang@company.com",
    avatar: "",
    role: "Category Manager",
    roleColor: "bg-green-100 text-green-700 border-green-200",
    status: "active",
    lastLogin: "2024-01-15T07:10:00Z",
    createdAt: "2024-01-06T00:00:00Z",
    permissions: 6
  },
  {
    id: "7",
    name: "Tom Wilson",
    email: "tom.wilson@company.com",
    avatar: "",
    role: "Delivery Person",
    roleColor: "bg-yellow-100 text-yellow-700 border-yellow-200",
    status: "active",
    lastLogin: "2024-01-15T11:00:00Z",
    createdAt: "2024-01-07T00:00:00Z",
    permissions: 3
  }
];

const roles = [
  "Master Admin", 
  "Warehouse Manager", 
  "Category Manager", 
  "Delivery Person", 
  "View Only"
];

export default function UsersPage() {
  const [users] = useState(defaultUsers);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterByRole, setFilterByRole] = useState("");
  const [filterByStatus, setFilterByStatus] = useState("");

  // Filter users based on search term, role, and status
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = !filterByRole || user.role === filterByRole;
    const matchesStatus = !filterByStatus || user.status === filterByStatus;
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatLastLogin = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
    return formatDate(dateString);
  };

  const toggleUserStatus = (userId: string) => {
    // This would be an API call in a real application
    console.log(`Toggling status for user ${userId}`);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <UserCog className="h-6 w-6" />
            User Management
          </h1>
          <p className="text-gray-600 mt-1">
            Manage system users and their role assignments
          </p>
        </div>
        <Link href="/admin/users/new">
          <Button className="bg-indigo-600 hover:bg-indigo-700">
            <UserPlus className="h-4 w-4 mr-2" />
            Add User
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="search">Search Users</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  id="search"
                  placeholder="Search by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Filter by Role</Label>
              <Select value={filterByRole} onValueChange={setFilterByRole}>
                <SelectTrigger>
                  <SelectValue placeholder="All roles" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All roles</SelectItem>
                  {roles.map((role) => (
                    <SelectItem key={role} value={role}>
                      {role}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Filter by Status</Label>
              <Select value={filterByStatus} onValueChange={setFilterByStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="All statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All statuses</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>Users ({filteredUsers.length})</CardTitle>
          <CardDescription>
            {searchTerm || filterByRole || filterByStatus
              ? `Showing filtered results`
              : `All system users`
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredUsers.map((user) => (
              <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-4 flex-1">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback className="bg-indigo-100 text-indigo-600 font-medium">
                      {getInitials(user.name)}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-medium text-gray-900 truncate">{user.name}</h3>
                      <Badge 
                        variant={user.status === 'active' ? 'default' : 'secondary'}
                        className={user.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}
                      >
                        {user.status}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Mail className="h-3 w-3" />
                        {user.email}
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        Joined {formatDate(user.createdAt)}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <Badge className={user.roleColor}>
                      {user.role}
                    </Badge>
                    <div className="text-xs text-gray-500 mt-1">
                      {user.permissions} permissions
                    </div>
                  </div>
                  
                  <div className="text-right min-w-[100px]">
                    <div className="text-sm text-gray-900">Last login</div>
                    <div className="text-xs text-gray-500">
                      {formatLastLogin(user.lastLogin)}
                    </div>
                  </div>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link href={`/admin/users/${user.id}/edit`} className="flex items-center gap-2">
                          <Edit2 className="h-4 w-4" />
                          Edit User
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => toggleUserStatus(user.id)}>
                        {user.status === 'active' ? (
                          <>
                            <EyeOff className="h-4 w-4 mr-2" />
                            Deactivate
                          </>
                        ) : (
                          <>
                            <Eye className="h-4 w-4 mr-2" />
                            Activate
                          </>
                        )}
                      </DropdownMenuItem>
                      {user.role !== "Master Admin" && (
                        <DropdownMenuItem className="text-red-600">
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete User
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Empty State */}
      {filteredUsers.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <UserCog className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No users found</h3>
            <p className="text-gray-500 mb-4">
              {searchTerm || filterByRole || filterByStatus
                ? "Try adjusting your search criteria."
                : "Get started by adding your first user."
              }
            </p>
            {!searchTerm && !filterByRole && !filterByStatus && (
              <Link href="/admin/users/new">
                <Button>
                  <UserPlus className="h-4 w-4 mr-2" />
                  Add User
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
              <UserCog className="h-8 w-8 text-indigo-600" />
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
              <Eye className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Users</p>
                <p className="text-2xl font-bold text-gray-900">
                  {users.filter(user => user.status === 'active').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Shield className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Admin Users</p>
                <p className="text-2xl font-bold text-gray-900">
                  {users.filter(user => user.role === 'Master Admin').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Calendar className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">New This Month</p>
                <p className="text-2xl font-bold text-gray-900">
                  {users.filter(user => {
                    const userDate = new Date(user.createdAt);
                    const now = new Date();
                    return userDate.getMonth() === now.getMonth() && userDate.getFullYear() === now.getFullYear();
                  }).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}