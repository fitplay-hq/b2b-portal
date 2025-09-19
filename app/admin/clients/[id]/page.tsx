"use client";

import { useState } from "react";
import React from "react";
import { useRouter, useParams } from "next/navigation";
import Layout from "@/components/layout";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import Link from "next/link";
import { ClientForm } from "../components/client-form";
import { ProductAccessSummary } from "../components/product-access-summary";
import { ProductSelectionTable } from "../components/product-selection-table";
import { useClient, useUpdateClient } from "@/data/client/admin.hooks";
import { useProducts } from "@/data/product/admin.hooks";

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
  });

  // Use SWR hooks for data fetching
  const {
    client,
    isLoading: isLoadingClient,
    isClientNotFound,
  } = useClient(clientId);
  const { products, isLoading: isLoadingProducts } = useProducts();
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
      });

      // TODO: Initialize selectedProducts based on client's company products
      // For now, initialize as empty array (same as add client page)
      // Once company-based product filtering is implemented, this should be:
      // setSelectedProducts(client.company?.products?.map(p => p.id) || []);
      setSelectedProducts([]);
    }
  }, [client]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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
      await updateClient({
        ...formData,
        id: clientId,
      });
      router.push("/admin/clients");
    } catch (error) {
      console.error("Failed to update client:", error);
      // Handle error - could show toast notification
    }
  };

  const selectedProductCount = selectedProducts.length;
  const totalProducts = products?.length || 0;

  if (isLoadingClient || isLoadingProducts) {
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
            <h1 className="text-2xl font-bold text-red-600">
              Client Not Found
            </h1>
            <p className="text-muted-foreground mt-2">
              No client found with ID:{" "}
              <code className="bg-muted px-2 py-1 rounded">{clientId}</code>
            </p>
            <p className="text-sm text-muted-foreground mt-4">
              The client may have been deleted or the ID may be incorrect.
            </p>
          </div>
          <Link href="/admin/clients">
            <Button variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Clients
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
            <Link href="/admin/clients">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Clients
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
                key={JSON.stringify(formData)} // Force re-render when formData changes
                formData={formData}
                handleInputChange={handleInputChange}
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
            <Link href="/admin/clients">
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
