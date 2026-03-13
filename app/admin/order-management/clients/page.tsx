"use client";

import { useState, useMemo } from "react";
import Layout from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { TableCell, TableHead, TableRow } from "@/components/ui/table";

import {
  Plus,
  Edit,
  Trash2,
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
import type { OMClient } from "@/types/order-management";
import { DeleteConfirmationDialog } from "@/components/delete-confirmation-dialog";
import { OMClientForm } from "@/components/orderManagement/OMClientForm";
import type { SortOption } from "@/components/orderManagement/OMSortControl";
import { OMFilterCard } from "@/components/orderManagement/shared/OMFilterCard";
import { OMActiveFilters } from "@/components/orderManagement/shared/OMActiveFilters";
import { ClientFilters } from "@/components/orderManagement/clients/ClientFilters";
import { useClients } from "@/hooks/use-clients";
import { OMDataTable } from "@/components/orderManagement/shared/OMDataTable";
import { OMSortableHeader } from "@/components/orderManagement/shared/OMSortableHeader";

export default function OMClients() {
  const { clients, isLoading, mutate } = useClients();
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<OMClient | null>(null);
  const [viewingClient, setViewingClient] = useState<OMClient | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>("name_asc");
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    clientName: "",
  });

  const [formData, setFormData] = useState({
    name: "",
    contactPerson: "",
    email: "",
    phone: "",
    billingAddress: "",
    gstNumber: "",
    notes: "",
  });

  const resetForm = () => {
    setFormData({
      name: "",
      contactPerson: "",
      email: "",
      phone: "",
      billingAddress: "",
      gstNumber: "",
      notes: "",
    });
    setEditingClient(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const url = editingClient
        ? `/api/admin/om/clients/${editingClient.id}`
        : "/api/admin/om/clients";

      const method = editingClient ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        toast.success(
          `Client ${editingClient ? "updated" : "added"} successfully`,
        );
        setIsAddDialogOpen(false);
        resetForm();
        mutate();
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

  const handleEdit = (client: OMClient) => {
    setEditingClient(client);
    setFormData({
      name: client.name,
      contactPerson: client.contactPerson || "",
      email: client.email || "",
      phone: client.phone || "",
      billingAddress: client.billingAddress || "",
      gstNumber: client.gstNumber || "",
      notes: client.notes || "",
    });
    setIsAddDialogOpen(true);
  };

  const handleView = (client: OMClient) => {
    setViewingClient(client);
    setIsViewDialogOpen(true);
  };

  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleDelete = (clientId: string) => {
    setDeleteId(clientId);
    setIsDeleteDialogOpen(true);
  };

  const onConfirmDelete = async () => {
    if (!deleteId) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/admin/om/clients/${deleteId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        toast.success("Client deleted successfully");
        mutate();
        setIsDeleteDialogOpen(false);
      } else {
        const errorData = await res.json();
        toast.error(errorData.error || "Failed to delete client");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error deleting client");
    } finally {
      setIsDeleting(false);
      setDeleteId(null);
    }
  };

  const filteredClients = useMemo(() => {
    return clients
      .filter((client) => {
        // Text search
        const matchesSearch =
          !searchQuery ||
          client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (client.contactPerson || "")
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          (client.email || "")
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          (client.gstNumber || "")
            .toLowerCase()
            .includes(searchQuery.toLowerCase());

        // Advanced filters
        const matchesClient =
          !filters.clientName || client.name === filters.clientName;

        return matchesSearch && matchesClient;
      })
      .sort((a, b) => {
        if (sortBy === "newest")
          return (
            new Date(b.createdAt || 0).getTime() -
            new Date(a.createdAt || 0).getTime()
          );
        if (sortBy === "oldest")
          return (
            new Date(a.createdAt || 0).getTime() -
            new Date(b.createdAt || 0).getTime()
          );
        if (sortBy === "latest_update")
          return (
            new Date(b.updatedAt || 0).getTime() -
            new Date(a.updatedAt || 0).getTime()
          );

        const [field, direction] = sortBy.split("_");
        const modifier = direction === "desc" ? -1 : 1;

        // Map SortOption field to OMClient property
        const fieldMap: Record<string, keyof OMClient> = {
          name: "name",
          contact: "contactPerson",
          email: "email",
          phone: "phone",
          gst: "gstNumber",
        };

        const property = fieldMap[field] || (field as keyof OMClient);
        const valA = String(a[property] || "").toLowerCase();
        const valB = String(b[property] || "").toLowerCase();

        return valA.localeCompare(valB) * modifier;
      });
  }, [clients, searchQuery, filters, sortBy]);

  const resetFilters = () => {
    setFilters({
      clientName: "",
    });
    setSearchQuery("");
  };

  const removeFilter = (key: string) => {
    setFilters((prev: any) => ({ ...prev, [key]: "" }));
  };

  const activeFilters = useMemo(() => {
    const active = [];
    if (filters.clientName) {
      active.push({
        key: "clientName",
        label: "Client",
        value: filters.clientName,
      });
    }
    return active;
  }, [filters]);

  const clientOptions = useMemo(() => {
    return Array.from(new Set(clients.map((c) => c.name))).map((name) => ({
      value: name,
      label: name,
    }));
  }, [clients]);

  // Export to CSV/Excel
  const exportToExcel = () => {
    const headers = [
      "Client Name",
      "Contact Person",
      "Email",
      "Phone",
      "GST Number",
      "Billing Address",
      "Notes",
    ];
    const rows = filteredClients.map((client) => [
      client.name,
      client.contactPerson || "-",
      client.email || "-",
      client.phone || "-",
      client.gstNumber || "-",
      client.billingAddress || "-",
      client.notes || "-",
    ]);
    const csvContent = [
      headers.join(","),
      ...rows.map((row) =>
        row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","),
      ),
    ].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.setAttribute("href", URL.createObjectURL(blob));
    link.setAttribute(
      "download",
      `clients_${new Date().toISOString().split("T")[0]}.csv`,
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Clients exported to Excel");
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
    doc.text("Clients Master Report", 8, 10);
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100, 100, 100);
    doc.text(
      `Generated: ${new Date().toLocaleString("en-IN")} | Total Records: ${filteredClients.length}`,
      8,
      15,
    );
    doc.setTextColor(0, 0, 0);
    autoTable(doc, {
      head: [
        [
          "Client Name",
          "Contact Person",
          "Email",
          "Phone",
          "GST Number",
          "Billing Address",
        ],
      ],
      body: filteredClients.map((client) => [
        client.name,
        client.contactPerson || "-",
        client.email || "-",
        client.phone || "-",
        client.gstNumber || "-",
        client.billingAddress || "-",
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
    doc.save(`clients_${new Date().toISOString().split("T")[0]}.pdf`);
    toast.success("Clients exported to PDF");
  };

  return (
    <Layout isClient={false}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold">Clients Master</h1>
            <p className="text-muted-foreground">Manage your client database</p>
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
                  Add Client
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>
                    {editingClient ? "Edit Client" : "Add New Client"}
                  </DialogTitle>
                </DialogHeader>

                <OMClientForm
                  formData={formData}
                  onChange={setFormData}
                  onSubmit={handleSubmit}
                  isSubmitting={isSubmitting}
                  isEdit={!!editingClient}
                />
              </DialogContent>
            </Dialog>

            <Dialog
              open={isViewDialogOpen}
              onOpenChange={(open) => {
                setIsViewDialogOpen(open);
                if (!open) setViewingClient(null);
              }}
            >
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>View Client Details</DialogTitle>
                </DialogHeader>

                {viewingClient && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Client Name</Label>
                        <Input
                          value={viewingClient.name}
                          readOnly
                          className="bg-muted"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Contact Person</Label>
                        <Input
                          value={viewingClient.contactPerson || "-"}
                          readOnly
                          className="bg-muted"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Email</Label>
                        <Input
                          value={viewingClient.email || "-"}
                          readOnly
                          className="bg-muted"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Phone</Label>
                        <Input
                          value={viewingClient.phone || "-"}
                          readOnly
                          className="bg-muted"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>GST Number</Label>
                        <Input
                          value={viewingClient.gstNumber || "-"}
                          readOnly
                          className="bg-muted"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Billing Address</Label>
                      <Textarea
                        value={viewingClient.billingAddress || "-"}
                        readOnly
                        className="bg-muted"
                        rows={3}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Notes</Label>
                      <Textarea
                        value={viewingClient.notes || "-"}
                        readOnly
                        className="bg-muted"
                        rows={3}
                      />
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
                          handleEdit(viewingClient);
                        }}
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Client
                      </Button>
                    </div>
                  </div>
                )}
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <OMFilterCard
          title="Filters"
          subtitle={`Total ${clients.length} clients registered`}
          searchPlaceholder="Search by name, contact, email, or GST number..."
          searchTerm={searchQuery}
          onSearchChange={setSearchQuery}
          sortBy={sortBy}
          onSortChange={setSortBy}
          sortNameLabel="Client Name"
          showFilters={showFilters}
          setShowFilters={setShowFilters}
          onReset={resetFilters}
        >
          <ClientFilters
            filters={filters}
            setFilters={setFilters}
            clientOptions={clientOptions}
          />
          <OMActiveFilters
            activeFilters={activeFilters}
            onRemove={removeFilter}
            onClearAll={resetFilters}
          />
        </OMFilterCard>

        <OMDataTable
          data={filteredClients}
          isLoading={isLoading}
          columnCount={6}
          emptyMessage="No clients found"
          onRowClick={(client) => handleView(client)}
          header={
            <TableRow>
              <OMSortableHeader
                title="Client Name"
                currentSort={sortBy}
                onSort={setSortBy}
                ascOption="name_asc"
                descOption="name_desc"
              />
              <OMSortableHeader
                title="Contact Person"
                currentSort={sortBy}
                onSort={setSortBy}
                ascOption="contact_asc"
                descOption="contact_desc"
              />
              <OMSortableHeader
                title="Email"
                currentSort={sortBy}
                onSort={setSortBy}
                ascOption="email_asc"
                descOption="email_desc"
              />
              <OMSortableHeader
                title="Phone"
                currentSort={sortBy}
                onSort={setSortBy}
                ascOption="phone_asc"
                descOption="phone_desc"
              />
              <OMSortableHeader
                title="GST Number"
                currentSort={sortBy}
                onSort={setSortBy}
                ascOption="gst_asc"
                descOption="gst_desc"
              />
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          }
          renderRow={(client: OMClient) => (
            <TableRow key={client.id}>
              <TableCell>{client.name}</TableCell>
              <TableCell>{client.contactPerson || "-"}</TableCell>
              <TableCell>{client.email || "-"}</TableCell>
              <TableCell>{client.phone || "-"}</TableCell>
              <TableCell>{client.gstNumber || "-"}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleView(client);
                    }}
                    title="View Client"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEdit(client);
                    }}
                    title="Edit Client"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(client.id);
                    }}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          )}
        />

        <DeleteConfirmationDialog
          isOpen={isDeleteDialogOpen}
          onOpenChange={setIsDeleteDialogOpen}
          onConfirm={onConfirmDelete}
          isLoading={isDeleting}
          title="Delete Client"
          description="Are you sure you want to delete this client? This action cannot be undone."
        />
      </div>
    </Layout>
  );
}
