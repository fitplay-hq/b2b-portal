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

interface Product {
  id: string;
  name: string;
  sku: string;
  categories: string;
  availableStock: number;
}

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

  const selectedProductCount = selectedProducts.length;
  const totalProducts = (products || []).length;

  if (isLoadingProducts) {
    return (
      <Layout title="Create New Company" isClient={false}>
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Create New Company" isClient={false}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/admin/companies">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Companies
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold">Create New Company</h1>
              <p className="text-muted-foreground">
                Add a new company with product access permissions
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Company Details Form - Left Side */}
            <div className="space-y-6">
              <CompanyForm
                formData={formData}
                handleInputChange={handleInputChange}
              />
            </div>

            {/* Product Access Summary - Right Side */}
            <div className="space-y-6">
              <ProductAccessSummary
                selectedProducts={selectedProducts}
                products={products || []}
              />
            </div>
          </div>

          {/* Product Selection Table - Bottom */}
          <ProductSelectionTable
            selectedProducts={selectedProducts}
            products={products || []}
            onProductToggle={handleProductToggle}
            onClearAll={() => setSelectedProducts([])}
            onSelectAll={() =>
              setSelectedProducts((products || []).map((p) => p.id))
            }
          />

          {/* Action Buttons */}
          <div className="flex justify-end gap-4">
            <Link href="/admin/companies">
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </Link>
            <Button type="submit" disabled={isCreating}>
              <Save className="h-4 w-4 mr-2" />
              {isCreating ? "Creating..." : "Create Company"}
            </Button>
          </div>
        </form>
      </div>
    </Layout>
  );
}
