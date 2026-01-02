"use client";

import Layout from "@/components/layout";
import { Loader2 } from "lucide-react";
import { useFastDashboardMetrics } from "@/hooks/use-fast-dashboard-metrics";

import { MetricsGrid } from "./components/metric-grid";
import { OverviewSection } from "./components/overview-section";
import { QuickActions } from "./components/quick-actions";
import { RecentOrders } from "./components/recent-orders";

export default function AdminDashboardPage() {
  const { metrics, isLoading, error } = useFastDashboardMetrics();

  const WelcomeHeader = () => (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 sm:p-6">
      <h1 className="text-xl sm:text-2xl font-bold mb-2">Fitplay B2B Management</h1>
      <p className="text-sm sm:text-base text-muted-foreground">
        Monitor orders, manage products, and oversee client relationships
      </p>
    </div>
  );

  if (isLoading || !metrics) {
    return (
      <Layout isClient={false}>
        <div className="space-y-4 px-2 sm:px-0">
          <WelcomeHeader />
          
          {/* Skeleton loading for metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white rounded-lg border p-6 animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-3"></div>
                <div className="h-8 bg-gray-200 rounded w-3/4"></div>
              </div>
            ))}
          </div>
          
          {/* Skeleton for chart */}
          <div className="bg-white rounded-lg border p-6 animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout isClient={false}>
        <div className="text-center text-destructive">
          Failed to load dashboard data. Please try again later.
        </div>
      </Layout>
    );
  }

  return (
    <Layout isClient={false}>
      <div className="space-y-4 px-2 sm:px-0">
        <WelcomeHeader />
        <MetricsGrid {...metrics} />
        <OverviewSection {...metrics} allOrders={metrics.allOrders} /> {/* Pass allOrders for chart */}
        <QuickActions />
        <RecentOrders orders={metrics.recentOrders} />
      </div>
    </Layout>
  );
}