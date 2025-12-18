"use client";

import Layout from "@/components/layout";
import PageGuard from "@/components/page-guard";
import { useOrders } from "@/data/order/admin.hooks";
import { useOrderFilters } from "@/hooks/use-order-filters";
import { useOrderManagement } from "@/hooks/use-order-management";
import { usePermissions } from "@/hooks/use-permissions";
import { Loader2 } from "lucide-react";
import { OrderStatsGrid } from "./components/order-stats-grid";
import { OrderFilters } from "./components/order-filters";
import { OrderList } from "./components/order-list";
import { UpdateStatusDialog } from "./components/update-status-dialog";
import { formatStatus } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import { AdminOrder } from "@/data/order/admin.actions";

export default function AdminOrdersPage() {
  // 1. DATA FETCHING
  const { orders, isLoading, error, mutate } = useOrders();
  const { actions, RESOURCES } = usePermissions();

  // 2. LOGIC & STATE
  const { filteredOrders, ...filterProps } = useOrderFilters(orders);
  const { metrics, ...managementProps } = useOrderManagement(orders, mutate);

  // Handle order updates (for shipping label regeneration)
  const handleOrderUpdate = (updatedOrder: AdminOrder) => {
    // Refresh the orders data
    mutate();
  };

  if (isLoading) {
    return (
      <PageGuard resource={RESOURCES.ORDERS} action="view">
        <Layout isClient={false}>
          <div className="flex justify-center p-8">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        </Layout>
      </PageGuard>
    );
  }
  if (error) {
    return (
      <PageGuard resource={RESOURCES.ORDERS} action="view">
        <Layout isClient={false}>
          <div className="text-center text-destructive p-8">
            Failed to load orders.
          </div>
        </Layout>
      </PageGuard>
    );
  }

  // 3. PRESENTATION
  return (
    <PageGuard resource={RESOURCES.ORDERS} action="view">
      <Layout isClient={false}>
        <div className="space-y-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold">Order Management</h1>
              <p className="text-muted-foreground">
                Review and manage dispatch orders from clients
              </p>
            </div>
            <div className="flex-shrink-0">
              {actions.orders.create && (
                <Button asChild>
                  <Link href="/admin/orders/create">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Dispatch Order
                  </Link>
                </Button>
              )}
            </div>
          </div>

        <OrderStatsGrid {...metrics} />
        <OrderFilters {...filterProps} />
          <OrderList orders={filteredOrders} onOrderUpdate={handleOrderUpdate} {...managementProps} />
          <UpdateStatusDialog {...managementProps} />
        </div>
      </Layout>
    </PageGuard>
  );
}