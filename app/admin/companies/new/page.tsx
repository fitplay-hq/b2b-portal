"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Layout from "@/components/layout";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import Link from "next/link";
import { CompanyForm } from "../components/company-form";
import { ProductAccessSummary } from "../components/product-access-summary";
import { ProductSelectionTable } from "../components/product-selection-table";
import { useCreateCompany } from "@/data/company/admin.hooks";
import { useProducts } from "@/data/product/admin.hooks";
import { PageGuard } from "@/components/page-guard";



export default function NewCompanyPage() {
  const router = useRouter();
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    name: "",
    address: "",
  });

  // Use SWR hooks for data fetching
  const { products, isLoading: isLoadingProducts } = useProducts();
  const { createCompany, isCreating } = useCreateCompany();

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // First create the company
      const companyResponse = await createCompany(formData);

      // If products are selected, assign products to the company
      if (selectedProducts.length > 0 && companyResponse?.data?.id) {
        await fetch("/api/admin/companies/products", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            companyId: companyResponse.data.id,
            productIds: selectedProducts,
          }),
        });
      }

      router.push("/admin/companies");
    } catch (error) {
      console.error("Failed to create company:", error);
      // Handle error - could show toast notification
    }
  };

  const handleProductToggle = (productId: string) => {
    setSelectedProducts((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };



  if (isLoadingProducts) {
    return (
      <Layout isClient={false}>
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </Layout>
    );
  }

  return (
    <PageGuard resource="companies" action="create">
      <Layout isClient={false}>
      {/* Enhanced Header */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8 mb-8">
        <div className="flex items-center gap-6">
          <Link href="/admin/companies">
            <Button variant="outline" size="sm" className="border-gray-300 hover:border-gray-400">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Companies
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-semibold text-gray-900 mb-2">Create New Company</h1>
            <p className="text-gray-600 text-base">
              Add a new company with product access permissions
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Company Details Form - Left Side */}
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
                  <div className="mb-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">Company Information</h2>
                    <p className="text-sm text-gray-500">Enter the company&apos;s basic information and details</p>
                  </div>
                  <CompanyForm
                    formData={formData}
                    handleInputChange={handleInputChange}
                  />
                </div>

                {/* Product Access Summary - Right Side */}
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
                  <div className="mb-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">Product Access</h2>
                    <p className="text-sm text-gray-500">Review selected products and access permissions</p>
                  </div>
                  <ProductAccessSummary
                    selectedProducts={selectedProducts}
                    products={products || []}
                  />
                </div>
              </div>

              {/* Product Selection Table - Bottom */}
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="p-8 border-b border-gray-200 bg-gray-50">
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">Product Selection</h2>
                  <p className="text-sm text-gray-500">Choose which products this company can access and order</p>
                </div>
                <div className="p-8">
                  <ProductSelectionTable
                    selectedProducts={selectedProducts}
                    products={products || []}
                    onProductToggle={handleProductToggle}
                    onClearAll={() => setSelectedProducts([])}
                    onSelectAll={() =>
                      setSelectedProducts((products || []).map((p) => p.id))
                    }
                  />
                </div>
              </div>

              {/* Enhanced Action Buttons */}
              <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
                <Link href="/admin/companies">
                  <Button type="button" variant="outline" className="px-6 py-2.5 rounded-xl font-medium">
                    Cancel
                  </Button>
                </Link>
                <Button 
                  type="submit" 
                  disabled={isCreating}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2.5 rounded-xl font-medium shadow-sm hover:shadow-md transition-all duration-200"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {isCreating ? "Creating..." : "Create Company"}
                </Button>
              </div>
            </form>
      </Layout>
    </PageGuard>
  );
}
