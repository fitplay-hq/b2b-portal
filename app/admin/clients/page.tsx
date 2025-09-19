"use client";

import { useRouter } from "next/navigation";
import Layout from "@/components/layout";
import { toast } from "sonner";
import { Loader2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useClients, useDeleteClient } from "@/data/client/admin.hooks";
import { useOrders } from "@/data/order/admin.hooks";
import { useClientFilters } from "@/hooks/use-client-filters";
import { useClientManagement } from "@/hooks/use-client-management";
import { ClientStatsGrid } from "./components/client-stats-grid";
import { ClientList } from "./components/client-list";
import { ClientFilters } from "./components/client-filters";
import Link from "next/link";

export default function AdminClientsPage() {
  const router = useRouter();

  // 1. DATA FETCHING
  const {
    clients,
    isLoading: clientsLoading,
    error: clientsError,
  } = useClients();
  const { orders, isLoading: ordersLoading, error: ordersError } = useOrders();
  const { deleteClient } = useDeleteClient();

  const isLoading = clientsLoading || ordersLoading;

  // 2. LOGIC & STATE
  const { filteredClients, ...filterProps } = useClientFilters(clients);
  const { stats, getClientStats } = useClientManagement(clients, orders);

  const handleDelete = async (clientId: string) => {
    const clientOrders = orders?.filter((o) => o.clientId === clientId) || [];
    if (clientOrders.length > 0) {
      toast.error("Cannot delete client with existing orders.");
      return;
    }
    if (confirm("Are you sure?")) {
      try {
        await deleteClient({
          id: clientId,
        });
        toast.success("Client deleted.");
      } catch (error) {
        toast.error("Failed to delete client.");
      }
    }
  };

  if (isLoading) {
    return (
      <Layout title="Client Management" isClient={false}>
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </Layout>
    );
  }

  if (clientsError || ordersError) {
    return (
      <Layout title="Client Management" isClient={false}>
        <div className="text-center text-destructive">
          Failed to load client. Please try again later.
        </div>
      </Layout>
    );
  }

  // 3. PRESENTATION
  return (
    <Layout title="Client Management" isClient={false}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Client Management</h1>
            <p className="text-muted-foreground">
              Manage client accounts and permissions
            </p>
          </div>
          <Link href="/admin/clients/new">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Client
            </Button>
          </Link>
        </div>

        <ClientStatsGrid {...stats} />
        <ClientFilters {...filterProps} />
        <ClientList
          clients={filteredClients}
          getClientStats={getClientStats}
          onDelete={handleDelete}
        />
      </div>
    </Layout>
  );
}
