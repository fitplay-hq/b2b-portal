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
        <div className="flex items-center justify-between">
          <CardTitle>Companies ({companies.length})</CardTitle>
          <div className="relative w-72">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search companies..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10"
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
          <div className="space-y-4">
            {companies.map((company) => (
              <div
                key={company.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <Building2 className="h-5 w-5" />
                    <h3 className="font-semibold">{company.name}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    {company.address}
                  </p>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      <span className="text-sm text-muted-foreground">
                        {company._count.clients} client
                        {company._count.clients !== 1 ? "s" : ""}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Package className="h-4 w-4" />
                      <span className="text-sm text-muted-foreground">
                        {company._count.products} product
                        {company._count.products !== 1 ? "s" : ""}
                      </span>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      Created {new Date(company.createdAt).toLocaleDateString()}
                    </Badge>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Link href={`/admin/companies/${company.id}`}>
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                  </Link>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(company.id, company.name)}
                    disabled={isDeleting || company._count.clients > 0}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </Button>
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
