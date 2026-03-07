"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface OMClientFormData {
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  billingAddress: string;
  gstNumber: string;
  notes: string;
}

interface OMClientFormProps {
  formData: OMClientFormData;
  onChange: (data: OMClientFormData) => void;
  onSubmit: (e: React.FormEvent) => void;
  isSubmitting: boolean;
  isEdit?: boolean;
}

export function OMClientForm({
  formData,
  onChange,
  onSubmit,
  isSubmitting,
  isEdit = false,
}: OMClientFormProps) {
  const handleChange = (field: keyof OMClientFormData, value: string) => {
    onChange({ ...formData, [field]: value });
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Client Name *</Label>
          <Input
            id="name"
            required
            value={formData.name}
            onChange={(e) => handleChange("name", e.target.value)}
            placeholder="Enter client name"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="contactPerson">Contact Person</Label>
          <Input
            id="contactPerson"
            disabled
            value={formData.contactPerson}
            onChange={(e) => handleChange("contactPerson", e.target.value)}
            placeholder="Enter contact person"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            disabled
            value={formData.email}
            onChange={(e) => handleChange("email", e.target.value)}
            placeholder="email@example.com"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            disabled
            value={formData.phone}
            onChange={(e) => handleChange("phone", e.target.value)}
            placeholder="+91 XXXXX XXXXX"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="gstNumber">GST Number</Label>
          <Input
            id="gstNumber"
            disabled
            value={formData.gstNumber}
            onChange={(e) => handleChange("gstNumber", e.target.value)}
            placeholder="Enter GST number"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="billingAddress">Billing Address</Label>
        <Textarea
          id="billingAddress"
          disabled
          value={formData.billingAddress}
          onChange={(e) => handleChange("billingAddress", e.target.value)}
          placeholder="Enter complete billing address"
          rows={3}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          disabled
          value={formData.notes}
          onChange={(e) => handleChange("notes", e.target.value)}
          placeholder="Any additional notes or preferences"
          rows={3}
        />
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isEdit ? "Update" : "Add"} Client
        </Button>
      </div>
    </form>
  );
}
