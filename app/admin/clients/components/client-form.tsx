"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface ClientFormProps {
  formData: {
    name: string;
    email: string;
    password?: string;
    companyName: string;
    phone: string;
    address: string;
  };
  handleInputChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  isNewClient?: boolean;
}

export function ClientForm({
  formData,
  handleInputChange,
  isNewClient = false,
}: ClientFormProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Client Information</CardTitle>
        <CardDescription>
          {isNewClient
            ? "Enter the basic details for the new client account"
            : "Update the client account details"}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name *</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              placeholder="Enter full name"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email Address *</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              placeholder="Enter email address"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="companyName">Company Name *</Label>
            <Input
              id="companyName"
              name="companyName"
              value={formData.companyName}
              onChange={handleInputChange}
              required
              placeholder="Enter company name"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number *</Label>
            <Input
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              required
              placeholder="Enter phone number"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">
            {isNewClient
              ? "Password *"
              : "New Password (leave empty to keep current)"}
          </Label>
          <Input
            id="password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleInputChange}
            {...(isNewClient && { required: true })}
            placeholder={isNewClient ? "Enter password" : "Enter new password"}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="address">Address *</Label>
          <Textarea
            id="address"
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            required
            placeholder="Enter full address"
            rows={3}
          />
        </div>
      </CardContent>
    </Card>
  );
}
