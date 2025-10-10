"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, UserCog, Save, AlertTriangle, Upload, X } from "lucide-react";
import Link from "next/link";

// Available roles with their permission counts (sync with roles page)
const availableRoles = [
  {
    id: "1",
    name: "Master Admin",
    description: "Full system access with all permissions",
    permissions: 24,
    color: "bg-red-100 text-red-700 border-red-200"
  },
  {
    id: "2",
    name: "Warehouse Manager",
    description: "Manage inventory, products, and stock levels",
    permissions: 6,
    color: "bg-blue-100 text-blue-700 border-blue-200"
  },
  {
    id: "3",
    name: "Category Manager",
    description: "Manage product categories and client assignments",
    permissions: 6,
    color: "bg-green-100 text-green-700 border-green-200"
  },
  {
    id: "4",
    name: "Delivery Person",
    description: "View and update order delivery status",
    permissions: 3,
    color: "bg-yellow-100 text-yellow-700 border-yellow-200"
  },
  {
    id: "5",
    name: "View Only",
    description: "Read-only access to view data without modifications",
    permissions: 4,
    color: "bg-gray-100 text-gray-700 border-gray-200"
  }
];

export default function NewUserPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    roleId: "",
    status: "active",
    avatar: "",
    notes: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const selectedRole = availableRoles.find(role => role.id === formData.roleId);

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.firstName.trim() || !formData.lastName.trim() || !formData.email.trim() || !formData.roleId) {
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call - replace with actual API later
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log("Creating user:", formData);
      router.push("/admin/users");
    } catch (error) {
      console.error("Error creating user:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // In a real app, you'd upload to a server
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, avatar: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const clearAvatar = () => {
    setFormData(prev => ({ ...prev, avatar: "" }));
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/admin/users">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <UserCog className="h-6 w-6" />
            Add New User
          </h1>
          <p className="text-gray-600 mt-1">
            Create a new user account with role assignment
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Profile Information */}
        <Card>
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
            <CardDescription>
              Basic information about the user
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Avatar Upload */}
            <div className="flex items-center gap-6">
              <div className="relative">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={formData.avatar} alt="User avatar" />
                  <AvatarFallback className="bg-indigo-100 text-indigo-600 text-lg font-medium">
                    {formData.firstName && formData.lastName
                      ? getInitials(formData.firstName, formData.lastName)
                      : "??"
                    }
                  </AvatarFallback>
                </Avatar>
                {formData.avatar && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-red-100 hover:bg-red-200 text-red-600"
                    onClick={clearAvatar}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="avatar">Profile Picture</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="avatar"
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarUpload}
                    className="hidden"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => document.getElementById('avatar')?.click()}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Image
                  </Button>
                </div>
                <p className="text-xs text-gray-500">
                  Recommended: Square image, at least 200x200px
                </p>
              </div>
            </div>

            {/* Name Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name *</Label>
                <Input
                  id="firstName"
                  placeholder="Enter first name"
                  value={formData.firstName}
                  onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name *</Label>
                <Input
                  id="lastName"
                  placeholder="Enter last name"
                  value={formData.lastName}
                  onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter email address"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                required
              />
              <p className="text-xs text-gray-500">
                The user will receive login credentials at this email address
              </p>
            </div>

            {/* Notes */}
            <div className="space-y-2">
              <Label htmlFor="notes">Notes (Optional)</Label>
              <Textarea
                id="notes"
                placeholder="Add any additional notes about this user..."
                value={formData.notes}
                onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Role Assignment */}
        <Card>
          <CardHeader>
            <CardTitle>Role Assignment</CardTitle>
            <CardDescription>
              Assign a role to determine the user&apos;s permissions
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {!formData.roleId && (
              <div className="flex items-center gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                <AlertTriangle className="h-4 w-4 text-amber-600" />
                <p className="text-sm text-amber-700">
                  Please select a role for this user.
                </p>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="role">User Role *</Label>
              <Select value={formData.roleId} onValueChange={(value) => setFormData(prev => ({ ...prev, roleId: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  {availableRoles.map((role) => (
                    <SelectItem key={role.id} value={role.id}>
                      <div className="flex items-center justify-between w-full">
                        <span>{role.name}</span>
                        <Badge className={`ml-2 ${role.color} text-xs`}>
                          {role.permissions} permissions
                        </Badge>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Selected Role Details */}
            {selectedRole && (
              <div className="p-4 bg-gray-50 rounded-lg border">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900">{selectedRole.name}</h4>
                  <Badge className={selectedRole.color}>
                    {selectedRole.permissions} permissions
                  </Badge>
                </div>
                <p className="text-sm text-gray-600">{selectedRole.description}</p>
              </div>
            )}

            {/* Account Status */}
            <div className="space-y-2">
              <Label htmlFor="status">Account Status</Label>
              <Select value={formData.status} onValueChange={(value) => setFormData(prev => ({ ...prev, status: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-gray-500">
                Active users can log in and access the system
              </p>
            </div>
          </CardContent>
        </Card>

        {/* User Preview */}
        {formData.firstName && formData.lastName && formData.email && selectedRole && (
          <Card>
            <CardHeader>
              <CardTitle>User Preview</CardTitle>
              <CardDescription>
                Preview how this user will appear in the system
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4 p-4 border rounded-lg">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={formData.avatar} alt="User avatar" />
                  <AvatarFallback className="bg-indigo-100 text-indigo-600 font-medium">
                    {getInitials(formData.firstName, formData.lastName)}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-medium text-gray-900">
                      {formData.firstName} {formData.lastName}
                    </h3>
                    <Badge 
                      variant={formData.status === 'active' ? 'default' : 'secondary'}
                      className={formData.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}
                    >
                      {formData.status}
                    </Badge>
                  </div>
                  <div className="text-sm text-gray-500">{formData.email}</div>
                </div>
                
                <Badge className={selectedRole.color}>
                  {selectedRole.name}
                </Badge>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Actions */}
        <div className="flex justify-end gap-3">
          <Link href="/admin/users">
            <Button variant="outline" type="button">
              Cancel
            </Button>
          </Link>
          <Button 
            type="submit" 
            disabled={!formData.firstName.trim() || !formData.lastName.trim() || !formData.email.trim() || !formData.roleId || isSubmitting}
            className="bg-indigo-600 hover:bg-indigo-700"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                Creating...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Create User
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}