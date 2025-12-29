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
        <div className="space-y-4 sm:space-y-6 px-2 sm:px-0">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="min-w-0 flex-1">
              <h1 className="text-xl sm:text-2xl font-bold">Order Management</h1>
              <p className="text-sm sm:text-base text-muted-foreground">
                Review and manage dispatch orders from clients
              </p>
            </div>
            <div className="shrink-0 w-full sm:w-auto">
              {actions.orders.create && (
                <Button asChild className="w-full sm:w-auto text-sm h-9">
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