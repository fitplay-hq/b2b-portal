"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { mutate } from "swr";
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
import { PageGuard } from "@/components/page-guard";

function NewClientForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const companyIdFromUrl = searchParams.get("companyId");
  
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    companyName: "",
    phone: "",
    address: "",
    companyAddress: "",
    selectedCompanyId: companyIdFromUrl || "create-new",
    isNewCompany: !companyIdFromUrl, // If companyId provided, it's existing company
  });

  // Use SWR hooks for data fetching
  const { products, isLoading: isLoadingProducts } = useProducts();
  const { createClient, isCreating } = useCreateClient();
  const { companies, isLoading: isLoadingCompanies } = useCompanies();

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    
    // Special validation for phone number - only allow digits and max 10 characters
    if (name === 'phone') {
      const phoneValue = value.replace(/\D/g, ''); // Remove non-digits
      if (phoneValue.length <= 10) {
        setFormData((prev) => ({ ...prev, [name]: phoneValue }));
      }
      return;
    }
    
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleShowPriceChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, isShowPrice: checked }));
  };

  const handleCompanySelect = async (companyId: string) => {
    const selectedCompany = companies?.find((c: { id: string }) => c.id === companyId);

    if (companyId === "create-new") {
      // Creating new company - clear selected products
      setSelectedProducts([]);
      setFormData((prev) => ({
        ...prev,
        selectedCompanyId: companyId,
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
          const companyProductIds = data.data.map((product: { id: string }) => product.id);
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

  // Pre-select company if companyId is provided in URL
  useEffect(() => {
    if (companyIdFromUrl && companies && companies.length > 0) {
      handleCompanySelect(companyIdFromUrl);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [companyIdFromUrl, companies]);

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
      console.log("Creating client with formData:", formData);
      console.log("Selected products:", selectedProducts);
      
      // First create the client
      const clientResponse = await createClient(formData);
      console.log("Client created successfully:", clientResponse);

      // If products are selected, assign products directly to the client
      if (selectedProducts.length > 0 && clientResponse.id) {
        console.log(`Assigning ${selectedProducts.length} products to client ${clientResponse.id}`);
        
        const clientProductResponse = await fetch(`/api/admin/clients/${clientResponse.id}/products`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            productIds: selectedProducts,
            action: "assign",
          }),
        });

        const productAssignmentResult = await clientProductResponse.json();
        console.log("Product assignment response:", productAssignmentResult);

        if (!clientProductResponse.ok) {
          console.error("Failed to assign products to client:", productAssignmentResult);
          throw new Error(
            `Failed to assign products to client: ${
              productAssignmentResult.error || "Unknown error"
            }`
          );
        } else {
          console.log("Products assigned successfully!");
        }

        // Force refresh client data after product assignment
        await mutate('/api/admin/clients');
        // Also refresh companies-clients data
        await mutate('/api/admin/companies');
        
        // Small delay to ensure data is propagated
        await new Promise(resolve => setTimeout(resolve, 500));
      }

      // Redirect to companies-clients page with a refresh parameter
      router.push("/admin/companies-clients?refresh=true");
    } catch (error) {
      console.error("Failed to create client:", error);
      // Handle error - could show toast notification
    }
  };



  if (isLoadingProducts || isLoadingCompanies) {
    return (
      <Layout isClient={false}>
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </Layout>
    );
  }

  return (
    <PageGuard resource="clients" action="create">
      <Layout isClient={false}>
        <div className="bg-gray-50 -m-6">
          <div className="p-8">
            <div className="space-y-8">
              {/* Enhanced Header */}
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
        <div className="flex items-center gap-6">
          <Link href="/admin/companies-clients">
            <Button variant="outline" size="sm" className="border-gray-300 hover:border-gray-400">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Companies & Clients
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-semibold text-gray-900 mb-2">Create New Client</h1>
            <p className="text-gray-600 text-base">
              Add a new client account with product access permissions
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Client Details Form - Left Side */}
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
                  <div className="mb-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">Client Information</h2>
                    <p className="text-sm text-gray-500">Enter the client&apos;s basic information and company details</p>
                  </div>
                  <ClientForm
                    formData={formData}
                    handleInputChange={handleInputChange}
                    handleShowPriceChange={handleShowPriceChange}
                    handleCompanySelect={handleCompanySelect}
                    companies={companies}
                    isNewClient={true}
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
                  <p className="text-sm text-gray-500">Choose which products this client can access and order</p>
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
                <Link href="/admin/companies-clients">
                  <Button type="button" variant="outline" className="px-6 py-2.5 rounded-xl font-medium">
                    Cancel
                  </Button>
                </Link>
                <Button 
                  type="submit" 
                  disabled={isCreating}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2.5 rounded-xl font-medium shadow-sm hover:shadow-md transition-all duration-200"
                >
                  {isCreating ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Creating...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Save className="h-4 w-4" />
                      Create Client
                    </div>
                  )}
                </Button>
              </div>
            </form>
            </div>
          </div>
        </div>
      </Layout>
    </PageGuard>
  );
}

export default function NewClientPage() {
  return (
    <Suspense fallback={
      <PageGuard resource="clients" action="create">
        <Layout isClient={false}>
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        </Layout>
      </PageGuard>
    }>
      <NewClientForm />
    </Suspense>
  );
}
