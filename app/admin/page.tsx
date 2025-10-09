"use client";

import Layout from "@/components/layout";
import { Loader2 } from "lucide-react";
import { useDashboardMetrics } from "@/hooks/use-dashboard-metrics";

import { MetricsGrid } from "./components/metric-grid";
import { OverviewSection } from "./components/overview-section";
import { QuickActions } from "./components/quick-actions";
import { RecentOrders } from "./components/recent-orders";
import { AnalyticsChart } from "./components/analytics-chart";
import { ActivityFeed } from "./components/activity-feed";

export default function AdminDashboardPage() {
  const { metrics, isLoading, error } = useDashboardMetrics();

  const DashboardHeader = () => {
    const currentHour = new Date().getHours();
    const greeting = currentHour < 12 ? 'Good morning' : currentHour < 18 ? 'Good afternoon' : 'Good evening';
    
    return (
      <div className="bg-white border border-gray-200 rounded-2xl p-8 mb-8 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="flex-1">
            <div className="mb-4">
              <h1 className="text-3xl font-semibold text-gray-900 mb-2">
                {greeting}, Admin
              </h1>
              <p className="text-gray-600 text-base leading-relaxed">
                Here&apos;s your business overview for today. Monitor key metrics and stay updated with recent activities.
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="text-right">
              <p className="text-xs text-gray-500 uppercase tracking-wider font-medium mb-1">
                Today
              </p>
              <p className="text-sm font-semibold text-gray-900">
                {new Date().toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  month: 'long', 
                  day: 'numeric',
                  year: 'numeric'
                })}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };

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
      <div className="min-h-[calc(100vh-4rem)] bg-gray-50 -m-6">
        <div className="p-8">
          <DashboardHeader />
          
          <div className="space-y-8">
            <MetricsGrid {...metrics} />
            
            {/* Main Dashboard Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column - Charts & Recent Activity */}
              <div className="lg:col-span-2 space-y-8">
                <AnalyticsChart 
                  totalOrders={metrics.totalOrders}
                  approvedOrders={metrics.approvedOrders}
                  pendingOrders={metrics.pendingOrders}
                />
                <ActivityFeed 
                  recentOrders={metrics.recentOrders}
                  pendingOrders={metrics.pendingOrders}
                  lowStockProducts={metrics.lowStockProducts}
                />
              </div>
              
              {/* Right Column - Quick Actions & Order Analytics */}
              <div className="space-y-8">
                <QuickActions 
                  totalProducts={metrics.totalProducts}
                  totalOrders={metrics.totalOrders}
                  activeClients={metrics.activeClients}
                />
                <OverviewSection {...metrics} />
              </div>
            </div>
            
            {/* Bottom Section */}
            <RecentOrders orders={metrics.recentOrders} />
          </div>
        </div>
      </div>
    </Layout>
  );
}
