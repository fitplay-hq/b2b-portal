"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Layout from "@/components/layout";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ClientForm } from "../components/client-form";
import { ProductAccessSummary } from "../components/product-access-summary";
import { ProductSelectionTable } from "../components/product-selection-table";
import { useCreateClient } from "@/data/client/admin.hooks";
import { useProducts } from "@/data/product/admin.hooks";
import { useCompanies } from "@/data/company/admin.hooks";

interface Product {
  id: string;
  name: string;
  sku: string;
  categories: string;
  availableStock: number;
}

export default function NewClientPage() {
  const router = useRouter();
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    companyName: "",
    phone: "",
    address: "",
    isNewCompany: true, // Default to creating new company
    companyAddress: "",
    selectedCompanyId: "",
  });

  // Use SWR hooks for data fetching
  const { products, isLoading: isLoadingProducts } = useProducts();
  const { createClient, isCreating } = useCreateClient();
  const { companies, isLoading: isLoadingCompanies } = useCompanies();

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, isNewCompany: checked }));
  };

  const handleCompanySelect = async (companyId: string) => {
    const selectedCompany = companies?.find((c: any) => c.id === companyId);

    if (companyId === "") {
      // Creating new company - clear selected products
      setSelectedProducts([]);
      setFormData((prev) => ({
        ...prev,
        selectedCompanyId: "",
        companyName: "",
        companyAddress: "",
        isNewCompany: true,
      }));
    } else if (selectedCompany) {
      // Existing company selected - fetch and set company's products
      try {
        const response = await fetch(
          `/api/admin/companies/products?companyId=${companyId}`,
          {
            credentials: "include",
          }
        );

        if (response.ok) {
          const data = await response.json();
          const companyProductIds = data.data.map((product: any) => product.id);
          setSelectedProducts(companyProductIds);
        } else {
          setSelectedProducts([]);
        }
      } catch (error) {
        console.error("Failed to fetch company products:", error);
        setSelectedProducts([]);
      }

      setFormData((prev) => ({
        ...prev,
        selectedCompanyId: companyId,
        companyName: selectedCompany.name || "",
        companyAddress: selectedCompany.address || "",
        isNewCompany: false,
      }));
    }
  };

  const handleProductToggle = (productId: string) => {
    setSelectedProducts((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // First create the client
      const clientResponse = await createClient(formData);

      // If products are selected and we have a company ID, assign products to the company
      if (selectedProducts.length > 0 && clientResponse?.companyID) {
        await fetch("/api/admin/companies/products", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            companyId: clientResponse.companyID,
            productIds: selectedProducts,
          }),
        });
      }

      router.push("/admin/clients");
    } catch (error) {
      console.error("Failed to create client:", error);
      // Handle error - could show toast notification
    }
  };

  const selectedProductCount = selectedProducts.length;
  const totalProducts = (products || []).length;

  if (isLoadingProducts || isLoadingCompanies) {
    return (
      <Layout title="Create New Client" isClient={false}>
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Create New Client" isClient={false}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/admin/clients">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Clients
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold">Create New Client</h1>
              <p className="text-muted-foreground">
                Add a new client account with product access permissions
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Client Details Form - Left Side */}
            <div className="space-y-6">
              <ClientForm
                formData={formData}
                handleInputChange={handleInputChange}
                handleCheckboxChange={handleCheckboxChange}
                handleCompanySelect={handleCompanySelect}
                companies={companies}
                isNewClient={true}
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
            <Link href="/admin/clients">
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </Link>
            <Button type="submit" disabled={isCreating}>
              <Save className="h-4 w-4 mr-2" />
              {isCreating ? "Creating..." : "Create Client"}
            </Button>
          </div>
        </form>
      </div>
    </Layout>
  );
}
