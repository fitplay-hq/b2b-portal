"use client";

import { useState, useEffect } from "react";
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
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  Truck,
  Loader2,
  Eye,
  FileDown,
  FileSpreadsheet,
  ChevronDown,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import type { OMLogisticsPartner } from "@/types/order-management";
import { DeleteConfirmationDialog } from "@/components/delete-confirmation-dialog";

export default function OMLogisticsPartners() {
  const [partners, setPartners] = useState<OMLogisticsPartner[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [editingPartner, setEditingPartner] =
    useState<OMLogisticsPartner | null>(null);
  const [viewingPartner, setViewingPartner] =
    useState<OMLogisticsPartner | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    contactPerson: "",
    phone: "",
    email: "",
    defaultMode: "Surface" as "Air" | "Surface" | "Road",
  });

  const fetchPartners = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/om/logistics-partners");
      if (res.ok) {
        const data = await res.json();
        setPartners(data);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to load logistics partners");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPartners();
  }, []);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const url = editingPartner
        ? `/api/admin/om/logistics-partners/${editingPartner.id}`
        : "/api/admin/om/logistics-partners";

      const method = editingPartner ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        toast.success(
          `Partner ${editingPartner ? "updated" : "added"} successfully`,
        );
        setIsAddDialogOpen(false);
        resetForm();
        fetchPartners();
      } else {
        const error = await res.json();
        toast.error(error.error || "Something went wrong");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to save client");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (partner: OMLogisticsPartner) => {
    setEditingPartner(partner);
    setFormData({
      name: partner.name,
      contactPerson: partner.contactPerson || "",
      phone: partner.phone || "",
      email: partner.email || "",
      defaultMode: partner.defaultMode || "Surface",
    });
    setIsAddDialogOpen(true);
  };

  const handleView = (partner: OMLogisticsPartner) => {
    setViewingPartner(partner);
    setIsViewDialogOpen(true);
  };

  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleDelete = (partnerId: string) => {
    setDeleteId(partnerId);
    setIsDeleteDialogOpen(true);
  };

  const onConfirmDelete = async () => {
    if (!deleteId) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/admin/om/logistics-partners/${deleteId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        toast.success("Logistics partner deleted successfully");
        fetchPartners();
        setIsDeleteDialogOpen(false);
      } else {
        const error = await res.json();
        toast.error(error.error || "Failed to delete partner");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error deleting partner");
    } finally {
      setIsDeleting(false);
      setDeleteId(null);
    }
  };

  const filteredPartners = partners.filter(
    (partner) =>
      partner.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (partner.contactPerson || "")
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      (partner.email || "").toLowerCase().includes(searchQuery.toLowerCase()),
  );

  // Export to CSV/Excel
  const exportToExcel = () => {
    const headers = [
      "Partner Name",
      "Contact Person",
      "Phone",
      "Email",
      "Default Mode",
    ];
    const rows = filteredPartners.map((partner) => [
      partner.name,
      partner.contactPerson || "-",
      partner.phone || "-",
      partner.email || "-",
      partner.defaultMode || "-",
    ]);
    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
    ].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.setAttribute("href", URL.createObjectURL(blob));
    link.setAttribute(
      "download",
      `logistics_partners_${new Date().toISOString().split("T")[0]}.csv`,
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Logistics Partners exported to Excel");
  };

  // Export to PDF
  const exportToPDF = async () => {
    const jsPDF = (await import("jspdf")).default;
    const autoTable = (await import("jspdf-autotable")).default;
    const doc = new jsPDF({
      orientation: "landscape",
      unit: "mm",
      format: "a4",
    });
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Logistics Partners Report", 8, 10);
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100, 100, 100);
    doc.text(
      `Generated: ${new Date().toLocaleString("en-IN")} | Total Records: ${filteredPartners.length}`,
      8,
      15,
    );
    doc.setTextColor(0, 0, 0);
    autoTable(doc, {
      head: [
        ["Partner Name", "Contact Person", "Phone", "Email", "Default Mode"],
      ],
      body: filteredPartners.map((partner) => [
        partner.name,
        partner.contactPerson || "-",
        partner.phone || "-",
        partner.email || "-",
        partner.defaultMode || "-",
      ]),
      startY: 18,
      margin: { left: 6, right: 6, top: 8, bottom: 8 },
      styles: {
        fontSize: 8,
        cellPadding: 2,
        valign: "middle",
        overflow: "linebreak",
      },
      headStyles: {
        fillColor: [55, 65, 81],
        textColor: [255, 255, 255],
        fontSize: 8,
        fontStyle: "bold",
        halign: "center",
      },
      alternateRowStyles: { fillColor: [250, 250, 250] },
      didDrawPage: (data) => {
        const pageCount = (doc as any).internal.getNumberOfPages();
        doc.setFontSize(8);
        doc.setTextColor(128, 128, 128);
        doc.text(
          `Page ${data.pageNumber} of ${pageCount}`,
          doc.internal.pageSize.width - 25,
          doc.internal.pageSize.height - 5,
        );
      },
    });
    doc.save(
      `logistics_partners_${new Date().toISOString().split("T")[0]}.pdf`,
    );
    toast.success("Logistics Partners exported to PDF");
  };

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
          <div className="flex gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <FileDown className="h-4 w-4 mr-2" />
                  Export
                  <ChevronDown className="h-4 w-4 ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={exportToExcel}>
                  <FileSpreadsheet className="h-4 w-4 mr-2" />
                  Export to Excel
                </DropdownMenuItem>
                <DropdownMenuItem onClick={exportToPDF}>
                  <FileDown className="h-4 w-4 mr-2" />
                  Export to PDF
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

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
                      <Label htmlFor="contactPerson">
                        Contact Person {editingPartner && "*"}
                      </Label>
                      <Input
                        id="contactPerson"
                        required={!!editingPartner}
                        disabled={!editingPartner}
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
                      <Label htmlFor="phone">
                        Phone {editingPartner && "*"}
                      </Label>
                      <Input
                        id="phone"
                        required={!!editingPartner}
                        disabled={!editingPartner}
                        value={formData.phone}
                        onChange={(e) =>
                          setFormData({ ...formData, phone: e.target.value })
                        }
                        placeholder="+91 XXXXX XXXXX"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">
                        Email {editingPartner && "*"}
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        required={!!editingPartner}
                        disabled={!editingPartner}
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        placeholder="email@example.com"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="defaultMode">
                        Default Mode {editingPartner && "*"}
                      </Label>
                      <Select
                        value={formData.defaultMode}
                        onValueChange={(value: "Air" | "Surface" | "Road") =>
                          setFormData({ ...formData, defaultMode: value })
                        }
                        disabled={!editingPartner}
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
                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting && (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      )}
                      {editingPartner ? "Update" : "Add"} Partner
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>

            <Dialog
              open={isViewDialogOpen}
              onOpenChange={(open) => {
                setIsViewDialogOpen(open);
                if (!open) setViewingPartner(null);
              }}
            >
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>View Logistics Partner Details</DialogTitle>
                </DialogHeader>

                {viewingPartner && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2 col-span-2">
                        <Label>Partner Name</Label>
                        <Input
                          value={viewingPartner.name}
                          readOnly
                          className="bg-muted"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Contact Person</Label>
                        <Input
                          value={viewingPartner.contactPerson || "-"}
                          readOnly
                          className="bg-muted"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Phone</Label>
                        <Input
                          value={viewingPartner.phone || "-"}
                          readOnly
                          className="bg-muted"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Email</Label>
                        <Input
                          value={viewingPartner.email || "-"}
                          readOnly
                          className="bg-muted"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Default Mode</Label>
                        <Input
                          value={viewingPartner.defaultMode || "-"}
                          readOnly
                          className="bg-muted"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end gap-2 pt-4 border-t">
                      <Button
                        variant="outline"
                        onClick={() => setIsViewDialogOpen(false)}
                      >
                        Close
                      </Button>
                      <Button
                        onClick={() => {
                          setIsViewDialogOpen(false);
                          handleEdit(viewingPartner);
                        }}
                      >
                        <Pencil className="h-4 w-4 mr-2" />
                        Edit Partner
                      </Button>
                    </div>
                  </div>
                )}
              </DialogContent>
            </Dialog>
          </div>
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
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8">
                        <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2" />
                        Loading partners...
                      </TableCell>
                    </TableRow>
                  ) : filteredPartners.length === 0 ? (
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
                      <TableRow
                        key={partner.id}
                        className="cursor-pointer hover:bg-muted/50"
                        onClick={() => handleView(partner)}
                      >
                        <TableCell className="font-medium text-xs truncate max-w-25">
                          {partner.id}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Truck className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">{partner.name}</span>
                          </div>
                        </TableCell>
                        <TableCell>{partner.contactPerson || "-"}</TableCell>
                        <TableCell>{partner.phone || "-"}</TableCell>
                        <TableCell>{partner.email || "-"}</TableCell>
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
                              onClick={(e) => {
                                e.stopPropagation();
                                handleView(partner);
                              }}
                              title="View Partner"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEdit(partner);
                              }}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDelete(partner.id);
                              }}
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

        <DeleteConfirmationDialog
          isOpen={isDeleteDialogOpen}
          onOpenChange={setIsDeleteDialogOpen}
          onConfirm={onConfirmDelete}
          isLoading={isDeleting}
          title="Delete Logistics Partner"
          description="Are you sure you want to delete this logistics partner? This action cannot be undone."
        />
      </div>
    </Layout>
  );
}
