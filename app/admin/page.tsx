"use client";

import Layout from "@/components/layout";
import { Loader2 } from "lucide-react";
import { useDashboardMetrics } from "@/hooks/use-dashboard-metrics";

import { MetricsGrid } from "./components/metric-grid";
import { OverviewSection } from "./components/overview-section";
import { QuickActions } from "./components/quick-actions";
import { RecentOrders } from "./components/recent-orders";

export default function AdminDashboardPage() {
  const { metrics, isLoading, error } = useDashboardMetrics();

  const WelcomeHeader = () => (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6">
      <h1 className="text-2xl font-bold mb-2">Fitplay B2B Management</h1>
      <p className="text-muted-foreground">
        Monitor orders, manage products, and oversee client relationships
      </p>
    </div>
  );

  if (isLoading || !metrics) {
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
          Failed to load dashboard data. Please try again later.
        </div>
      </Layout>
    );
  }

  return (
    <Layout isClient={false}>
      <div className="space-y-6">
        <WelcomeHeader />
        <MetricsGrid {...metrics} />
        <OverviewSection {...metrics} /> {/* Pass all required metrics */}
        <QuickActions />
        <RecentOrders orders={metrics.recentOrders} />
      </div>
    </Layout>
  );
}