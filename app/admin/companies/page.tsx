"use client";

import { useState } from "react";
import Layout from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import { useCompanies } from "@/data/company/admin.hooks";
import { CompanyList } from "./components/company-list";
import { CompanyStatsGrid } from "./components/company-stats-grid";

export default function CompaniesPage() {
  const { companies, isLoading, error } = useCompanies();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredCompanies =
    companies?.filter(
      (company: any) =>
        company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        company.address.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

  if (error) {
    return (
      <Layout isClient={false}>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <h2 className="text-xl font-semibold">Error loading companies</h2>
            <p className="text-muted-foreground mt-2">{error.message}</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout isClient={false}>
      <div className="min-h-[calc(100vh-4rem)] bg-gray-50 -m-6">
        <div className="p-8">
          <div className="space-y-8">
            {/* Enhanced Header */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-semibold text-gray-900 mb-2">Companies</h1>
                  <p className="text-gray-600 text-base">
                    Manage company information and product access permissions
                  </p>
                </div>
                <Link href="/admin/companies/new">
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl font-medium shadow-sm hover:shadow-md transition-all duration-200">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Company
                  </Button>
                </Link>
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
              <div className="p-8 border-b border-gray-200 bg-gray-50">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">All Companies</h2>
                <p className="text-sm text-gray-500">Search and manage your company accounts</p>
              </div>
              <div className="p-8">
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
  );
}
