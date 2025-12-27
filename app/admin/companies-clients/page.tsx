"use client";

import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Layout from "@/components/layout";
import { PageGuard } from "@/components/page-guard";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Building2, Users, Package, Search, ChevronDown, ChevronUp, Grid3x3, Table } from "lucide-react";
import Link from "next/link";
import { useCompanies } from "@/data/company/admin.hooks";
import { useClients, useDeleteClient } from "@/data/client/admin.hooks";
import { usePermissions } from "@/hooks/use-permissions";
import { UnifiedStatsGrid } from "./components/unified-stats-grid";
import { CompanyCard } from "./components/company-card";
import { ClientsTable } from "./components/clients-table";
import { Input } from "@/components/ui/input";
import { RESOURCES } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function CompaniesClientsPage() {
  const searchParams = useSearchParams();
  const { companies, isLoading: companiesLoading, error: companiesError } = useCompanies();
  const { clients, isLoading: clientsLoading, error: clientsError, mutate: mutateClients } = useClients();
  const { actions } = usePermissions();
  const { deleteClient } = useDeleteClient();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [viewType, setViewType] = useState<"row" | "table">("row");
  const [expandedCompanies, setExpandedCompanies] = useState<Set<string>>(new Set());
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [clientToDelete, setClientToDelete] = useState<string | null>(null);

  // Handle refresh parameter to force data reload
  useEffect(() => {
    if (searchParams.get('refresh') === 'true') {
      mutateClients();
      // Clean up the URL parameter
      window.history.replaceState({}, '', '/admin/companies-clients');
    }
  }, [searchParams, mutateClients]);

  const isLoading = companiesLoading || clientsLoading;
  const error = companiesError || clientsError;

  // Group clients by company
  const clientsByCompany = useMemo(() => {
    if (!clients) return new Map();
    const map = new Map<string, typeof clients>();
    clients.forEach((client) => {
      const companyId = client.companyID || "unassigned";
      if (!map.has(companyId)) {
        map.set(companyId, []);
      }
      map.get(companyId)!.push(client);
    });
    return map;
  }, [clients]);

  // Filter companies based on search term
  const filteredCompanies = useMemo(() => {
    if (!companies) return [];
    const term = searchTerm.toLowerCase();
    if (!term) return companies;

    return companies.filter((company) => {
      const companyMatches = 
        company.name.toLowerCase().includes(term) ||
        company.address.toLowerCase().includes(term);
      
      const companyClients = clientsByCompany.get(company.id) || [];
      const clientsMatch = companyClients.some(
        (client) =>
          client.name.toLowerCase().includes(term) ||
          client.email.toLowerCase().includes(term)
      );

      return companyMatches || clientsMatch;
    });
  }, [companies, searchTerm, clientsByCompany]);

  // Filter clients for table view
  const filteredClients = useMemo(() => {
    if (!clients) return [];
    const term = searchTerm.toLowerCase();
    if (!term) return clients;

    return clients.filter((client) =>
      client.name.toLowerCase().includes(term) ||
      client.email.toLowerCase().includes(term) ||
      client.phone.toLowerCase().includes(term) ||
      client.address.toLowerCase().includes(term) ||
      (client.companyName && client.companyName.toLowerCase().includes(term))
    );
  }, [clients, searchTerm]);

  // Calculate stats
  const stats = useMemo(() => {
    if (!companies || !clients) {
      return {
        totalCompanies: 0,
        totalClients: 0,
        totalProducts: 0,
        avgProductsPerCompany: 0,
      };
    }

    const totalCompanies = companies.length;
    const totalClients = clients.length;
    const totalProducts = companies.reduce(
      (sum, company) => sum + (company._count?.products || 0),
      0
    );
    const avgProductsPerCompany =
      totalCompanies > 0 ? Math.round(totalProducts / totalCompanies) : 0;

    return {
      totalCompanies,
      totalClients,
      totalProducts,
      avgProductsPerCompany,
    };
  }, [companies, clients]);

  const toggleCompany = (companyId: string) => {
    setExpandedCompanies((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(companyId)) {
        newSet.delete(companyId);
      } else {
        newSet.add(companyId);
      }
      return newSet;
    });
  };

  const expandAll = () => {
    if (filteredCompanies) {
      setExpandedCompanies(new Set(filteredCompanies.map((c) => c.id)));
    }
  };

  const collapseAll = () => {
    setExpandedCompanies(new Set());
  };

  const handleDeleteClient = (clientId: string) => {
    setClientToDelete(clientId);
    setShowDeleteDialog(true);
  };

  const handleConfirmDelete = async () => {
    if (!clientToDelete) return;

    try {
      await deleteClient({
        id: clientToDelete,
      });
      toast.success("Client deleted successfully.");
      setShowDeleteDialog(false);
      setClientToDelete(null);
      mutateClients(); // Refresh the clients list
    } catch (error) {
      console.error("Client deletion error:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to delete client.";
      toast.error(errorMessage);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteDialog(false);
    setClientToDelete(null);
  };

  if (isLoading) {
    return (
      <PageGuard resource={RESOURCES.COMPANIES} action="view">
        <Layout isClient={false}>
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        </Layout>
      </PageGuard>
    );
  }

  if (error) {
    return (
      <PageGuard resource={RESOURCES.COMPANIES} action="view">
        <Layout isClient={false}>
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <h2 className="text-xl font-semibold">Error loading data</h2>
              <p className="text-muted-foreground mt-2">
                {error instanceof Error ? error.message : "Failed to load companies and clients"}
              </p>
            </div>
          </div>
        </Layout>
      </PageGuard>
    );
  }

  return (
    <PageGuard resource={RESOURCES.COMPANIES} action="view">
      <Layout isClient={false}>
        <div className="bg-gray-50 -m-6">
          <div className="p-8">
            <div className="space-y-8">
              {/* Enhanced Header */}
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-3xl font-semibold text-gray-900 mb-2">
                      Companies & Clients
                    </h1>
                    <p className="text-gray-600 text-base">
                      Manage companies, client users (POCs), assigned products, and analytics scope
                    </p>
                  </div>
                  {actions.companies.create && (
                    <Link href="/admin/companies/new">
                      <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl font-medium shadow-sm hover:shadow-md transition-all duration-200">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Company
                      </Button>
                    </Link>
                  )}
                </div>
              </div>

              {/* Unified Stats Grid */}
              <UnifiedStatsGrid {...stats} />

              {/* Search Controls */}
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                <div className="flex items-center justify-start">
                  <div className="relative max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-5 w-5" />
                    <Input
                      placeholder="Search companies or clients..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
              </div>

              {/* Companies and Clients with Tabs */}
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="p-8 border-b border-gray-200 bg-gray-50">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900 mb-2">
                        Companies & Clients ({viewType === "row" ? filteredCompanies.length : filteredClients.length})
                      </h2>
                      <p className="text-sm text-gray-500">
                        {viewType === "row" 
                          ? "Click on a company to view its clients (POCs) and assigned products"
                          : "Table view of all clients with their details and actions"
                        }
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant={viewType === "row" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setViewType("row")}
                      >
                        <Grid3x3 className="h-4 w-4 mr-2" />
                        Row View
                      </Button>
                      <Button
                        variant={viewType === "table" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setViewType("table")}
                      >
                        <Table className="h-4 w-4 mr-2" />
                        Table View
                      </Button>
                    </div>
                  </div>

                  {viewType === "row" && (
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={expandAll}
                        disabled={filteredCompanies.length === 0}
                      >
                        <ChevronDown className="h-4 w-4 mr-2" />
                        Expand All
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={collapseAll}
                        disabled={expandedCompanies.size === 0}
                      >
                        <ChevronUp className="h-4 w-4 mr-2" />
                        Collapse All
                      </Button>
                    </div>
                  )}
                </div>

                <div className="p-8">
                  {viewType === "row" ? (
                    // Row View - Companies with expandable clients
                    <>
                      {filteredCompanies.length === 0 ? (
                        <div className="text-center py-12">
                          <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                          <h3 className="text-lg font-semibold text-muted-foreground mb-2">
                            No companies found
                          </h3>
                          <p className="text-sm text-muted-foreground mb-4">
                            {searchTerm
                              ? "Try adjusting your search terms."
                              : "Get started by creating your first company."}
                          </p>
                          {!searchTerm && actions.companies.create && (
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
                          {filteredCompanies.map((company) => (
                            <CompanyCard
                              key={company.id}
                              company={company}
                              clients={clientsByCompany.get(company.id) || []}
                              isExpanded={expandedCompanies.has(company.id)}
                              onToggle={() => toggleCompany(company.id)}
                              onDeleteClient={handleDeleteClient}
                            />
                          ))}
                        </div>
                      )}
                    </>
                  ) : (
                    // Table View - All clients in table format
                    <>
                      {filteredClients.length === 0 ? (
                        <div className="text-center py-12">
                          <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                          <h3 className="text-lg font-semibold text-muted-foreground mb-2">
                            No clients found
                          </h3>
                          <p className="text-sm text-muted-foreground mb-4">
                            {searchTerm
                              ? "Try adjusting your search terms."
                              : "Get started by creating your first client."}
                          </p>
                          {!searchTerm && actions.clients.create && (
                            <Link href="/admin/clients/new">
                              <Button>
                                <Users className="h-4 w-4 mr-2" />
                                Create First Client
                              </Button>
                            </Link>
                          )}
                        </div>
                      ) : (
                        <ClientsTable 
                          clients={filteredClients}
                          onDeleteClient={handleDeleteClient}
                        />
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout>

      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Client</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this client? This action cannot be
              undone.
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
    </PageGuard>
  );
}

