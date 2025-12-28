"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Search, Edit, Trash2, Building2, Users, Package } from "lucide-react";
import Link from "next/link";
import { useDeleteCompany } from "@/data/company/admin.hooks";
import { toast } from "sonner";
import { usePermissions } from "@/hooks/use-permissions";

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

interface CompanyListProps {
  companies: Company[];
  isLoading: boolean;
  searchTerm: string;
  onSearchChange: (term: string) => void;
}

export function CompanyList({
  companies,
  isLoading,
  searchTerm,
  onSearchChange,
}: CompanyListProps) {
  const { actions } = usePermissions();
  const { deleteCompany, isDeleting } = useDeleteCompany();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [companyToDelete, setCompanyToDelete] = useState<{
    id: string;
    name: string;
  } | null>(null);

  const handleDelete = async (companyId: string, companyName: string) => {
    setCompanyToDelete({ id: companyId, name: companyName });
    setShowDeleteDialog(true);
  };

  const handleConfirmDelete = async () => {
    if (!companyToDelete) return;
    try {
      await deleteCompany(companyToDelete.id);
      toast.success("Company deleted successfully.");
      setShowDeleteDialog(false);
      setCompanyToDelete(null);
    } catch (error) {
      toast.error("Failed to delete company.");
      console.error("Failed to delete company:", error);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteDialog(false);
    setCompanyToDelete(null);
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Companies</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-muted rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <CardTitle className="text-base sm:text-lg">Companies ({companies.length})</CardTitle>
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search companies..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10 text-sm"
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {companies.length === 0 ? (
          <div className="text-center py-8">
            <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-muted-foreground mb-2">
              No companies found
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              {searchTerm
                ? "Try adjusting your search terms."
                : "Get started by creating your first company."}
            </p>
            {!searchTerm && (
              <Link href="/admin/companies/new">
                <Button>
                  <Building2 className="h-4 w-4 mr-2" />
                  Create First Company
                </Button>
              </Link>
            )}
          </div>
        ) : (
          <div className="space-y-3 sm:space-y-4">
            {companies.map((company) => (
              <div
                key={company.id}
                className="flex flex-col sm:flex-row sm:items-center gap-4 p-3 sm:p-4 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <Building2 className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                    <h3 className="font-semibold text-sm sm:text-base truncate">{company.name}</h3>
                  </div>
                  <p className="text-xs sm:text-sm text-muted-foreground mb-3 line-clamp-2">
                    {company.address}
                  </p>
                  <div className="flex flex-wrap items-center gap-2 sm:gap-4">
                    <div className="flex items-center gap-1">
                      <Users className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                      <span className="text-xs sm:text-sm text-muted-foreground whitespace-nowrap">
                        {company._count.clients} client
                        {company._count.clients !== 1 ? "s" : ""}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Package className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                      <span className="text-xs sm:text-sm text-muted-foreground whitespace-nowrap">
                        {company._count.products} product
                        {company._count.products !== 1 ? "s" : ""}
                      </span>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      Created {new Date(company.createdAt).toLocaleDateString()}
                    </Badge>
                  </div>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  {actions.companies.edit && (
                    <Link href={`/admin/companies/${company.id}`} className="flex-1 sm:flex-initial">
                      <Button variant="outline" size="sm" className="w-full sm:w-auto">
                        <Edit className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                        <span className="text-xs sm:text-sm">Edit</span>
                      </Button>
                    </Link>
                  )}

                  {actions.companies.delete && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(company.id, company.name)}
                      disabled={isDeleting || company._count.clients > 0}
                      className="flex-1 sm:flex-initial"
                    >
                      <Trash2 className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                      <span className="text-xs sm:text-sm">Delete</span>
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>

      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Company</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{companyToDelete?.name}"? This
              action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={handleCancelDelete}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleConfirmDelete}>
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
