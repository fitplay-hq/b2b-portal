"use client";

import { useState } from "react";
import React from "react";
import { useRouter, useParams } from "next/navigation";
import { mutate } from "swr";
import Layout from "@/components/layout";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import Link from "next/link";
import { ClientForm } from "../components/client-form";
import { ProductAccessSummary } from "../components/product-access-summary";
import { ProductSelectionTable } from "../components/product-selection-table";
import { useClient, useUpdateClient } from "@/data/client/admin.hooks";
import { useProducts } from "@/data/product/admin.hooks";
import { useCompanies } from "@/data/company/admin.hooks";

interface Product {
  id: string;
  name: string;
  sku: string;
  categories: string;
  availableStock: number;
}

export default function EditClientPage() {
  const router = useRouter();
  const params = useParams();
  const clientId = params.id as string;

  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    companyName: "",
    phone: "",
    address: "",
    selectedCompanyId: "",
    isShowPrice: false,
  });

  // Use SWR hooks for data fetching
  const {
    client,
    isLoading: isLoadingClient,
    isClientNotFound,
  } = useClient(clientId);
  const { products, isLoading: isLoadingProducts } = useProducts();
  const { companies, isLoading: isLoadingCompanies } = useCompanies();
  const { updateClient, isUpdating } = useUpdateClient();

  // Populate form data and selected products when client data is loaded
  React.useEffect(() => {
    if (client) {
      console.log("Populating form with client data:", client);
      setFormData({
        name: client.name || "",
        email: client.email || "",
        companyName: client.company?.name || client.companyName || "",
        phone: client.phone || "",
        address: client.address || "",
        password: "",
        selectedCompanyId: client.companyID || "",
        isShowPrice: client.isShowPrice || false,
      });
    }
  }, [client]);

  // Initialize selectedProducts when client data is loaded
  React.useEffect(() => {
    if (client && client.products) {
      // Load products directly from client's product associations
      const clientProductIds = client.products.map((cp: any) => cp.product.id);
      setSelectedProducts(clientProductIds);
    }
  }, [client]);

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
    const selectedCompany = companies?.find((c: any) => c.id === companyId);

    if (companyId === "create-new") {
      // For edit client, we don't allow creating new companies
      // This option shouldn't be available in edit mode, but if selected, do nothing
      console.warn("Cannot create new company when editing existing client");
      return;
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
      // Update client basic information first
      const { name, email, phone, address, isShowPrice } = formData;
      await updateClient({
        id: clientId,
        name,
        email,
        phone,
        address,
        isShowPrice,
      });

      // Update client's product associations
      if (client) {
        // Get current client products
        const currentProductIds = client.products?.map((cp: any) => cp.product.id) || [];
        
        // Find products to add and remove
        const productsToAdd = selectedProducts.filter(id => !currentProductIds.includes(id));
        const productsToRemove = currentProductIds.filter((id: string) => !selectedProducts.includes(id));

        // Add new products to client
        if (productsToAdd.length > 0) {
          const addResponse = await fetch(`/api/admin/clients/${clientId}/products`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({
              productIds: productsToAdd,
              action: "assign",
            }),
          });

          if (!addResponse.ok) {
            const errorData = await addResponse.json();
            console.error("Failed to add products to client:", errorData);
            throw new Error(`Failed to add products to client: ${errorData.error || "Unknown error"}`);
          }
        }

        // Remove deselected products from client
        if (productsToRemove.length > 0) {
          const removeResponse = await fetch(`/api/admin/clients/${clientId}/products`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({
              productIds: productsToRemove,
              action: "unassign",
            }),
          });

          if (!removeResponse.ok) {
            const errorData = await removeResponse.json();
            console.error("Failed to remove products from client:", errorData);
            throw new Error(`Failed to remove products from client: ${errorData.error || "Unknown error"}`);
          }
        }
      }

      // Invalidate the clients cache to refresh the overview page
      await mutate('/api/admin/clients');
      // Also invalidate companies cache since products may have been assigned to companies
      await mutate('/api/admin/companies');
      
      router.push("/admin/companies-clients");
    } catch (error) {
      console.error("Failed to update client:", error);
      // Handle error - could show toast notification
    }
  };

  const selectedProductCount = selectedProducts.length;
  const totalProducts = products?.length || 0;

  if (isLoadingClient || isLoadingProducts || isLoadingCompanies) {
    return (
      <Layout
        title={`Edit Client - ${formData.name || clientId}`}
        isClient={false}
      >
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </Layout>
    );
  }

  if (isClientNotFound) {
    return (
      <Layout title={`Client Not Found - ${clientId}`} isClient={false}>
        <div className="flex flex-col items-center justify-center h-64 space-y-4">
          <div className="text-center">
            <h1 className="text-2xl font-bold">Client Not Found</h1>
            <p className="text-muted-foreground mt-2">
              No client found with ID:{" "}
              <code className="bg-muted px-2 py-1 rounded">{clientId}</code>
            </p>
            <p className="text-sm text-muted-foreground mt-4">
              The client may have been deleted or the ID may be incorrect.
            </p>
          </div>
          <Link href="/admin/companies-clients">
            <Button variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Companies & Clients
            </Button>
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Edit Client" isClient={false}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center">
          <div className="flex items-center gap-6">
            <Link href="/admin/companies-clients">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Companies & Clients
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold">Edit Client</h1>
              <p className="text-muted-foreground">
                Update client information and product access permissions
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
                handleShowPriceChange={handleShowPriceChange}
                handleCompanySelect={handleCompanySelect}
                companies={companies}
                isNewClient={false}
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
            <Link href="/admin/companies-clients">
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </Link>
            <Button type="submit" disabled={isUpdating}>
              <Save className="h-4 w-4 mr-2" />
              {isUpdating ? "Updating..." : "Update Client"}
            </Button>
          </div>
        </form>
      </div>
    </Layout>
  );
}
