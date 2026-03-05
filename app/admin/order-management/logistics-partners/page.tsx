"use client";

import { useState } from "react";
import Layout from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Plus, Search, Pencil, Trash2, Truck } from "lucide-react";
import {
  omLogisticsPartners,
  type OMLogisticsPartner,
} from "../_mock/omMockData";
import { toast } from "sonner";

export default function OMLogisticsPartners() {
  const [partners, setPartners] =
    useState<OMLogisticsPartner[]>(omLogisticsPartners);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingPartner, setEditingPartner] =
    useState<OMLogisticsPartner | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    contactPerson: "",
    phone: "",
    email: "",
    defaultMode: "Surface" as "Air" | "Surface" | "Road",
  });

  const resetForm = () => {
    setFormData({
      name: "",
      contactPerson: "",
      phone: "",
      email: "",
      defaultMode: "Surface",
    });
    setEditingPartner(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (editingPartner) {
      // Update existing partner
      setPartners(
        partners.map((partner) =>
          partner.id === editingPartner.id
            ? { ...partner, ...formData }
            : partner,
        ),
      );
      toast.success("Logistics partner updated successfully");
    } else {
      // Add new partner
      const newPartner: OMLogisticsPartner = {
        id: `OM-LOG-${String(partners.length + 1).padStart(3, "0")}`,
        ...formData,
      };
      setPartners([...partners, newPartner]);
      toast.success("Logistics partner added successfully");
    }

    setIsAddDialogOpen(false);
    resetForm();
  };

  const handleEdit = (partner: OMLogisticsPartner) => {
    setEditingPartner(partner);
    setFormData({
      name: partner.name,
      contactPerson: partner.contactPerson,
      phone: partner.phone,
      email: partner.email,
      defaultMode: partner.defaultMode,
    });
    setIsAddDialogOpen(true);
  };

  const handleDelete = (partnerId: string) => {
    if (confirm("Are you sure you want to delete this logistics partner?")) {
      setPartners(partners.filter((p) => p.id !== partnerId));
      toast.success("Logistics partner deleted successfully");
    }
  };

  const filteredPartners = partners.filter(
    (partner) =>
      partner.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      partner.contactPerson.toLowerCase().includes(searchQuery.toLowerCase()) ||
      partner.email.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <Layout isClient={false}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold">Logistics Partners</h1>
            <p className="text-muted-foreground">
              Manage your logistics and courier partners
            </p>
          </div>

          <Dialog
            open={isAddDialogOpen}
            onOpenChange={(open) => {
              setIsAddDialogOpen(open);
              if (!open) resetForm();
            }}
          >
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Partner
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>
                  {editingPartner
                    ? "Edit Logistics Partner"
                    : "Add New Logistics Partner"}
                </DialogTitle>
              </DialogHeader>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2 col-span-2">
                    <Label htmlFor="name">Partner Name *</Label>
                    <Input
                      id="name"
                      required
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      placeholder="Enter partner name"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="contactPerson">Contact Person *</Label>
                    <Input
                      id="contactPerson"
                      required
                      value={formData.contactPerson}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          contactPerson: e.target.value,
                        })
                      }
                      placeholder="Enter contact person"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone *</Label>
                    <Input
                      id="phone"
                      required
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      placeholder="+91 XXXXX XXXXX"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      placeholder="email@example.com"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="defaultMode">Default Mode *</Label>
                    <Select
                      value={formData.defaultMode}
                      onValueChange={(value: "Air" | "Surface" | "Road") =>
                        setFormData({ ...formData, defaultMode: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Air">Air</SelectItem>
                        <SelectItem value="Surface">Surface</SelectItem>
                        <SelectItem value="Road">Road</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setIsAddDialogOpen(false);
                      resetForm();
                    }}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">
                    {editingPartner ? "Update" : "Add"} Partner
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Logistics Partners List</CardTitle>
            <CardDescription>
              Total {partners.length} logistics partners registered
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name, contact person, or email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Partner ID</TableHead>
                    <TableHead>Partner Name</TableHead>
                    <TableHead>Contact Person</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Default Mode</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPartners.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={7}
                        className="text-center text-muted-foreground py-8"
                      >
                        No logistics partners found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredPartners.map((partner) => (
                      <TableRow key={partner.id}>
                        <TableCell className="font-medium">
                          {partner.id}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Truck className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">{partner.name}</span>
                          </div>
                        </TableCell>
                        <TableCell>{partner.contactPerson}</TableCell>
                        <TableCell>{partner.phone}</TableCell>
                        <TableCell>{partner.email}</TableCell>
                        <TableCell>
                          <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-primary/10 text-primary">
                            {partner.defaultMode}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEdit(partner)}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(partner.id)}
                              className="text-destructive hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
