"use client";

import { useState } from "react";
import Layout from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Plus, Building2, Users, Package } from "lucide-react";
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
      <Layout title="Companies" isClient={false}>
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
    <Layout title="Companies" isClient={false}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold">Companies</h1>
              <p className="text-muted-foreground">
                Manage company information and product access
              </p>
            </div>
          </div>

          <Link href="/admin/companies/new">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Company
            </Button>
          </Link>
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
        <CompanyList
          companies={filteredCompanies}
          isLoading={isLoading}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
        />
      </div>
    </Layout>
  );
}
