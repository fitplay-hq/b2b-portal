"use client";

import { useState } from "react";
import Layout from "@/components/layout";
import { PageGuard } from "@/components/page-guard";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import { useCompanies } from "@/data/company/admin.hooks";
import { usePermissions } from "@/hooks/use-permissions";
import { CompanyList } from "./components/company-list";
import { CompanyStatsGrid } from "./components/company-stats-grid";
import { RESOURCES } from "@/lib/utils";

export default function CompaniesPage() {
  const { companies, isLoading, error } = useCompanies();
  const [searchTerm, setSearchTerm] = useState("");
  const { actions } = usePermissions();

  const filteredCompanies =
    companies?.filter(
      (company: any) =>
        company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        company.address.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

  if (error) {
    return (
      <PageGuard resource={RESOURCES.COMPANIES} action="view">
        <Layout isClient={false}>
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <h2 className="text-xl font-semibold">Error loading companies</h2>
              <p className="text-muted-foreground mt-2">{error.message}</p>
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
        <div className="p-4 sm:p-6 lg:p-8">
          <div className="space-y-6 sm:space-y-8">
            {/* Enhanced Header */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 sm:p-6 lg:p-8">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-2">Companies</h1>
                  <p className="text-gray-600 text-sm sm:text-base">
                    Manage company information and product access permissions
                  </p>
                </div>
                {actions.companies.create && (
                <Link href="/admin/companies/new" className="flex-shrink-0">
                  <Button className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-4 sm:px-6 py-2.5 rounded-xl font-medium shadow-sm hover:shadow-md transition-all duration-200">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Company
                  </Button>
                </Link>
                )}
              </div>
            </div>

            <CompanyStatsGrid
              totalCompanies={companies?.length || 0}
              totalClients={
                companies?.reduce(
                  (sum: number, company: any) => sum + company._count.clients,
                  0
                ) || 0
              }
              avgProductsPerCompany={
                companies && companies.length > 0
                  ? Math.round(
                      companies.reduce(
                        (sum: number, company: any) =>
                          sum + company._count.products,
                        0
                      ) / companies.length
                    )
                  : 0
              }
            />

            {/* Company List */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="p-4 sm:p-6 lg:p-8 border-b border-gray-200 bg-gray-50">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">All Companies</h2>
                <p className="text-xs sm:text-sm text-gray-500">Search and manage your company accounts</p>
              </div>
              <div className="p-4 sm:p-6 lg:p-8">
                <CompanyList
                  companies={filteredCompanies}
                  isLoading={isLoading}
                  searchTerm={searchTerm}
                  onSearchChange={setSearchTerm}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
    </PageGuard>
  );
}
