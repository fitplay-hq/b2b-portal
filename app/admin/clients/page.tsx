"use client";

import Layout from "@/components/layout";
import { PageGuard } from "@/components/page-guard";
import { toast } from "sonner";
import { Loader2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useClients, useDeleteClient } from "@/data/client/admin.hooks";
import { useOrders } from "@/data/order/admin.hooks";
import { useClientFilters } from "@/hooks/use-client-filters";
import { useClientManagement } from "@/hooks/use-client-management";
import { usePermissions } from "@/hooks/use-permissions";
import { ClientStatsGrid } from "./components/client-stats-grid";
import { ClientList } from "./components/client-list";
import { ClientFilters } from "./components/client-filters";
import Link from "next/link";
import { useState } from "react";
import { RESOURCES } from "@/lib/utils";

export default function AdminClientsPage() {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [clientToDelete, setClientToDelete] = useState<string | null>(null);

  // Permission checks
  const { actions } = usePermissions();

  // 1. DATA FETCHING
  const {
    clients,
    isLoading: clientsLoading,
    error: clientsError,
  } = useClients();
  
  // Always call useOrders but handle permission errors gracefully
  const { orders: rawOrders, isLoading: ordersLoading, error: ordersError } = useOrders();
  
  // Only use orders data if user has permission, otherwise use empty array
  const orders = actions.orders?.view ? rawOrders : [];
  
  const { deleteClient } = useDeleteClient();

  // Only show loading for clients if orders are failing due to permissions
  const isLoading = clientsLoading || (actions.orders?.view && ordersLoading);

  // 2. LOGIC & STATE
  const { filteredClients, ...filterProps } = useClientFilters(clients);
  const { stats, getClientStats } = useClientManagement(clients, orders);

  const handleDelete = async (clientId: string) => {
    const clientOrders = orders?.filter((o) => o.clientId === clientId) || [];
    if (clientOrders.length > 0) {
      toast.error("Cannot delete client with existing orders.");
      return;
    }

    setShowDeleteDialog(true);
    setClientToDelete(clientId);
  };

  const handleConfirmDelete = async () => {
    if (!clientToDelete) return;

    try {
      await deleteClient({
        id: clientToDelete,
      });
      toast.success("Client deleted.");
      setShowDeleteDialog(false);
      setClientToDelete(null);
    } catch {
      toast.error("Failed to delete client.");
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteDialog(false);
    setClientToDelete(null);
  };

  if (isLoading) {
    return (
      <PageGuard resource={RESOURCES.CLIENTS} action="view">
        <Layout isClient={false}>
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        </Layout>
      </PageGuard>
    );
  }

  // Only fail if clients error - ignore orders error if user doesn't have permission
  const shouldFailOnOrdersError = actions.orders?.view && ordersError;
  if (clientsError || shouldFailOnOrdersError) {
    return (
      <PageGuard resource={RESOURCES.CLIENTS} action="view">
        <Layout isClient={false}>
          <div className="text-center text-destructive">
            Failed to load clients. Please try again later.
          </div>
        </Layout>
      </PageGuard>
    );
  }

  // 3. PRESENTATION
  return (
    <PageGuard resource={RESOURCES.CLIENTS} action="view">
      <Layout isClient={false}>
        <div className="bg-gray-50 -m-6">
          <div className="p-8">
            <div className="space-y-8">
            {/* Enhanced Header */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-semibold text-gray-900 mb-2">Client Management</h1>
                  <p className="text-gray-600 text-base">
                    Manage client accounts and permissions efficiently
                  </p>
                </div>
                {actions.clients.create && (
                <Link href="/admin/clients/new">
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl font-medium shadow-sm hover:shadow-md transition-all duration-200">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Client
                  </Button>
                </Link>
                )}
              </div>
            </div>

            <ClientStatsGrid {...stats} />
            
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="p-8 border-b border-gray-200 bg-gray-50">
                <ClientFilters {...filterProps} />
              </div>
              <div className="p-8">
                <ClientList
                  clients={filteredClients}
                  getClientStats={getClientStats}
                  onDelete={handleDelete}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

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
    </Layout>
    </PageGuard>
  );
}