"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Building2,
  Users,
  Package,
  ChevronDown,
  ChevronUp,
  Edit,
  Trash2,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Plus,
} from "lucide-react";
import Link from "next/link";
import { usePermissions } from "@/hooks/use-permissions";
import { ClientCard } from "./client-card";
import { useDeleteCompany } from "@/data/company/admin.hooks";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface Company {
  id: string;
  name: string;
  address: string;
  createdAt: string;
  updatedAt: string;
  _count: {
    clients: number;
    products: number;
  };
}

interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  companyID: string | null;
  companyName: string | null;
  createdAt: string;
}

interface CompanyCardProps {
  company: Company;
  clients: Client[];
  isExpanded: boolean;
  onToggle: () => void;
  onDeleteClient?: (clientId: string) => void;
}

export function CompanyCard({
  company,
  clients,
  isExpanded,
  onToggle,
  onDeleteClient,
}: CompanyCardProps) {
  const { actions } = usePermissions();
  const { deleteCompany, isDeleting } = useDeleteCompany();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const handleDelete = async () => {
    try {
      await deleteCompany(company.id);
      toast.success("Company deleted successfully.");
      setShowDeleteDialog(false);
    } catch (error) {
      toast.error("Failed to delete company.");
      console.error("Failed to delete company:", error);
    }
  };

  return (
    <>
      <Card className="overflow-hidden">
        <CardContent className="p-0">
          {/* Company Header */}
          <div
            className="p-6 hover:bg-gray-50 transition-colors cursor-pointer"
            onClick={onToggle}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 flex-1">
                <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-blue-100 text-blue-600">
                  <Building2 className="h-6 w-6" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {company.name}
                    </h3>
                    <Badge variant="outline" className="text-xs">
                      {company._count.clients} client
                      {company._count.clients !== 1 ? "s" : ""}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {company._count.products} product
                      {company._count.products !== 1 ? "s" : ""}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1.5">
                      <MapPin className="h-3 w-3" />
                      {company.address}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Calendar className="h-3 w-3" />
                      Created {new Date(company.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {actions.companies.edit && (
                  <Link
                    href={`/admin/companies/${company.id}`}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                  </Link>
                )}
                {actions.companies.delete && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowDeleteDialog(true);
                    }}
                    disabled={isDeleting || company._count.clients > 0}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  className="ml-2"
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggle();
                  }}
                >
                  {isExpanded ? (
                    <ChevronUp className="h-5 w-5" />
                  ) : (
                    <ChevronDown className="h-5 w-5" />
                  )}
                </Button>
              </div>
            </div>
          </div>

          {/* Expanded Content - Clients List */}
          {isExpanded && (
            <div className="border-t border-gray-200 bg-gray-50">
              <div className="p-6">
                <div className="space-y-3">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      Clients (POCs) - {clients.length}
                    </h4>
                    {actions.clients.create && (
                      <Link href={`/admin/clients/new?companyId=${company.id}`}>
                        <Button variant="outline" size="sm" className="bg-green-50 hover:bg-green-100 border-green-200 text-green-700">
                          <Plus className="h-4 w-4 mr-2" />
                          Add Client
                        </Button>
                      </Link>
                    )}
                  </div>
                  {clients.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground border border-dashed border-gray-300 rounded-lg">
                      <Users className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm mb-4">
                        No clients assigned to this company yet.
                      </p>
                      {actions.clients.create && (
                        <Link href={`/admin/clients/new?companyId=${company.id}`}>
                          <Button variant="outline" size="sm" className="bg-green-50 hover:bg-green-100 border-green-200 text-green-700">
                            <Plus className="h-4 w-4 mr-2" />
                            Add First Client
                          </Button>
                        </Link>
                      )}
                    </div>
                  ) : (
                    clients.map((client) => (
                      <ClientCard 
                        key={client.id} 
                        client={client} 
                        onDelete={onDeleteClient}
                      />
                    ))
                  )}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Company</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{company.name}"? This action
              cannot be undone.
              {company._count.clients > 0 && (
                <span className="block mt-2 text-red-600">
                  Warning: This company has {company._count.clients} client(s)
                  assigned. Please reassign or remove them first.
                </span>
              )}
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setShowDeleteDialog(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting || company._count.clients > 0}
            >
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

