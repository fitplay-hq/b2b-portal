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
            className="p-3 sm:p-4 hover:bg-gray-50 transition-colors cursor-pointer"
            onClick={onToggle}
          >
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
              <div className="flex items-start sm:items-center gap-3 sm:gap-4 flex-1 min-w-0">
                <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-blue-100 text-blue-600 flex-shrink-0">
                  <Building2 className="h-5 w-5 sm:h-6 sm:w-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 mb-1">
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900 truncate">
                      {company.name}
                    </h3>
                    <div className="flex flex-wrap gap-1 sm:gap-2">
                      <Badge variant="outline" className="text-xs whitespace-nowrap">
                        {company._count.clients} client
                        {company._count.clients !== 1 ? "s" : ""}
                      </Badge>
                      <Badge variant="outline" className="text-xs whitespace-nowrap">
                        {company._count.products} product
                        {company._count.products !== 1 ? "s" : ""}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 text-xs sm:text-sm text-muted-foreground">
                    <span className="flex items-center gap-1.5 min-w-0">
                      <MapPin className="h-3 w-3 flex-shrink-0" />
                      <span className="truncate">{company.address}</span>
                    </span>
                    <span className="flex items-center gap-1.5 whitespace-nowrap">
                      <Calendar className="h-3 w-3 flex-shrink-0" />
                      Created {new Date(company.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between sm:justify-end gap-2 w-full sm:w-auto">
                <div className="flex items-center gap-1 sm:gap-2">
                  {actions.companies.edit && (
                    <Link
                      href={`/admin/companies/${company.id}`}
                      onClick={(e) => e.stopPropagation()}
                      className="flex-1 sm:flex-initial"
                    >
                      <Button variant="outline" size="sm" className="w-full sm:w-auto text-xs sm:text-sm">
                        <Edit className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
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
                      className="flex-1 sm:flex-initial text-xs sm:text-sm"
                    >
                      <Trash2 className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                      Delete
                    </Button>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggle();
                  }}
                  className="flex-shrink-0"
                >
                  {isExpanded ? (
                    <ChevronUp className="h-4 w-4 sm:h-5 sm:w-5" />
                  ) : (
                    <ChevronDown className="h-4 w-4 sm:h-5 sm:w-5" />
                  )}
                </Button>
              </div>
            </div>
          </div>

          {/* Expanded Content - Clients List */}
          {isExpanded && (
            <div className="border-t border-gray-200 bg-gray-50">
              <div className="p-3 sm:p-4">
                <div className="space-y-2 sm:space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0 mb-3">
                    <h4 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      Clients (POCs) - {clients.length}
                    </h4>
                    {actions.clients.create && (
                      <Link href={`/admin/clients/new?companyId=${company.id}`}>
                        <Button variant="outline" size="sm" className="w-full sm:w-auto bg-green-50 hover:bg-green-100 border-green-200 text-green-700 text-xs sm:text-sm">
                          <Plus className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                          Add Client
                        </Button>
                      </Link>
                    )}
                  </div>
                  {clients.length === 0 ? (
                    <div className="text-center py-6 text-muted-foreground border border-dashed border-gray-300 rounded-lg">
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

