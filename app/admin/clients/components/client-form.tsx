"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Building2, Plus } from "lucide-react";

interface Company {
  id: string;
  name: string;
  address: string;
}

interface ClientFormProps {
  formData: {
    name: string;
    email: string;
    password?: string;
    companyName: string;
    phone: string;
    address: string;
    isShowPrice?: boolean;
    isNewCompany?: boolean;
    companyAddress?: string;
    selectedCompanyId?: string;
  };
  handleInputChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  handleCheckboxChange?: (checked: boolean) => void;
  handleShowPriceChange?: (checked: boolean) => void;
  handleCompanySelect?: (companyId: string) => void;
  companies?: Company[];
  isNewClient?: boolean;
}

export function ClientForm({
  formData,
  handleInputChange,
  handleCheckboxChange,
  handleShowPriceChange,
  handleCompanySelect,
  companies = [],
  isNewClient = false,
}: ClientFormProps) {
  const selectedCompany = companies.find(
    (c) => c.id === formData.selectedCompanyId
  );
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

        {/* Company Selection */}
        <div className="space-y-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="companySelect">Select Company</Label>
              <Select
                value={formData.selectedCompanyId || "new"}
                onValueChange={(value) => {
                  if (value === "new") {
                    handleCompanySelect?.("");
                  } else {
                    handleCompanySelect?.(value);
                  }
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choose a company" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="new">
                    <div className="flex items-center gap-2">
                      <Plus className="h-4 w-4" />
                      Create New Company
                    </div>
                  </SelectItem>
                  {companies.map((company) => (
                    <SelectItem key={company.id} value={company.id}>
                      {company.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Show selected company details */}
            {selectedCompany && !formData.isNewCompany && (
              <Card className="bg-muted/50 p-0">
                <CardContent className="p-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Building2 className="h-4 w-4" />
                      <span className="font-medium">
                        {selectedCompany.name}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {selectedCompany.address}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Create new company option */}
            {formData.isNewCompany && isNewClient && (
              <div className="space-y-4">
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
                  <Label htmlFor="companyAddress">Company Address *</Label>
                  <Textarea
                    id="companyAddress"
                    name="companyAddress"
                    value={formData.companyAddress || ""}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter company address"
                    rows={2}
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

        {isNewClient && (
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="isNewCompany"
                checked={formData.isNewCompany || false}
                onCheckedChange={handleCheckboxChange}
              />
              <Label htmlFor="isNewCompany" className="text-sm">
                Create new company
              </Label>
            </div>

            {formData.isNewCompany && (
              <div className="space-y-2">
                <Label htmlFor="companyAddress">Company Address *</Label>
                <Textarea
                  id="companyAddress"
                  name="companyAddress"
                  value={formData.companyAddress || ""}
                  onChange={handleInputChange}
                  required={formData.isNewCompany}
                  placeholder="Enter company address"
                  rows={2}
                />
              </div>
            )}
          </div>
        )}

        <div className="flex items-center space-x-2">
          <Checkbox
            id="isShowPrice"
            checked={formData.isShowPrice || false}
            onCheckedChange={(checked) =>
              handleShowPriceChange?.(checked as boolean)
            }
          />
          <Label htmlFor="isShowPrice" className="text-sm">
            Show product and order prices to this client
          </Label>
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
