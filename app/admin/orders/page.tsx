"use client";

import Layout from "@/components/layout";
import { useOrders } from "@/data/order/admin.hooks";
import { useOrderFilters } from "@/hooks/use-order-filters";
import { useOrderManagement } from "@/hooks/use-order-management";
import { Loader2 } from "lucide-react";
import { OrderStatsGrid } from "./components/order-stats-grid";
import { OrderFilters } from "./components/order-filters";
import { OrderList } from "./components/order-list";
import { UpdateStatusDialog } from "./components/update-status-dialog";

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";

export default function AdminOrdersPage() {
  // 1. DATA FETCHING
  const { orders, isLoading, error, mutate } = useOrders();

  // 2. LOGIC & STATE
  const { filteredOrders, ...filterProps } = useOrderFilters(orders);
  const { metrics, ...managementProps } = useOrderManagement(orders, mutate);

  if (isLoading) {
    return (
      <Layout isClient={false}>
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </Layout>
    );
  }
  if (error) {
    return (
      <Layout isClient={false}>
        <div className="text-center text-destructive">
          Failed to load orders. Please try again later.
        </div>
      </Layout>
    );
  }

  // 3. PRESENTATION
  return (
    <Layout isClient={false}>
      <div className="min-h-[calc(100vh-4rem)] bg-gray-50 -m-6">
        <div className="p-8">
          <div className="space-y-8">
            {/* Enhanced Header */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-semibold text-gray-900 mb-2">Orders</h1>
                  <p className="text-gray-600 text-base">
                    Review and manage dispatch orders from clients
                  </p>
                </div>
                <div className="flex-shrink-0">
                  <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl font-medium shadow-sm hover:shadow-md transition-all duration-200">
                    <Link href="/admin/orders/create">
                      <Plus className="h-4 w-4 mr-2" />
                      Create Order
                    </Link>
                  </Button>
                </div>
              </div>
            </div>

            <OrderStatsGrid {...metrics} />
            
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="p-8 border-b border-gray-200 bg-gray-50">
                <OrderFilters {...filterProps} />
              </div>
              <div className="p-8">
                <OrderList orders={filteredOrders} {...managementProps} />
              </div>
            </div>
          </div>
        </div>
        
        <UpdateStatusDialog {...managementProps} />
      </div>
    </Layout>
  );
}
