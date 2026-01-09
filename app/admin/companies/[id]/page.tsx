"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { toast } from "sonner";
import Layout from "@/components/layout";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import Link from "next/link";
import { CompanyForm } from "../components/company-form";
import { ProductAccessSummary } from "../components/product-access-summary";
import { ProductSelectionTable } from "../components/product-selection-table";
import { useCompany, useUpdateCompany } from "@/data/company/admin.hooks";
import { useProducts } from "@/data/product/admin.hooks";
import { mutate as globalMutate } from "swr";

interface Product {
  id: string;
  name: string;
  sku: string;
  categories: string;
  availableStock: number;
}

export default function EditCompanyPage() {
  const router = useRouter();
  const params = useParams();
  const companyId = params.id as string;

  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    name: "",
    address: "",
  });

  // Use SWR hooks for data fetching
  const {
    company,
    isLoading: isLoadingCompany,
    isCompanyNotFound,
  } = useCompany(companyId);
  const { products, isLoading: isLoadingProducts } = useProducts();
  const { updateCompany, isUpdating } = useUpdateCompany();

  // Populate form data when company data is loaded
  useEffect(() => {
    if (company) {
      console.log("Populating form with company data:", company);
      setFormData({
        name: company.name || "",
        address: company.address || "",
      });
    }
  }, [company]);

  // Initialize selectedProducts when both company and products are loaded
  useEffect(() => {
    if (company && products && company.products) {
      const companyProductIds = company.products.map(
        (product: any) => product.id
      );
      setSelectedProducts(companyProductIds);
    }
  }, [company, products]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Update company basic information first
      await updateCompany({
        id: companyId,
        name: formData.name,
        address: formData.address,
      });

      // Invalidate the specific company cache
      globalMutate(`/api/admin/companies/${companyId}`);

      // Sync selected products with company's product assignments
      if (company?.products) {
        // Get current company products
        const currentProductIds = company.products.map(
          (product: any) => product.id
        );

        // Find products to add and remove
        const productsToAdd = selectedProducts.filter(
          (id) => !currentProductIds.includes(id)
        );
        const productsToRemove = currentProductIds.filter(
          (id: string) => !selectedProducts.includes(id)
        );

        // Add new products to company
        if (productsToAdd.length > 0) {
          await fetch("/api/admin/companies/products", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({
              companyId: companyId,
              productIds: productsToAdd,
            }),
          });
        }

        // Remove deselected products from company
        if (productsToRemove.length > 0) {
          const removeUrl = `/api/admin/companies/products?companyId=${companyId}&${productsToRemove
            .map((id: string) => `productIds=${id}`)
            .join("&")}`;
          await fetch(removeUrl, {
            method: "DELETE",
            credentials: "include",
          });
        }
      }

      toast.success("Company updated successfully!");
      router.push("/admin/companies-clients");
    } catch (error) {
      console.error("Failed to update company:", error);
      toast.error("Failed to update company. Please try again.");
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
  const totalProducts = products?.length || 0;

  if (isLoadingCompany || isLoadingProducts) {
    return (
      <Layout
        title={`Edit Company - ${formData.name || companyId}`}
        isClient={false}
      >
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </Layout>
    );
  }

  if (isCompanyNotFound) {
    return (
      <Layout title={`Company Not Found - ${companyId}`} isClient={false}>
        <div className="flex flex-col items-center justify-center h-64 space-y-4">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-600">
              Company Not Found
            </h1>
            <p className="text-muted-foreground mt-2">
              No company found with ID:{" "}
              <code className="bg-muted px-2 py-1 rounded">{companyId}</code>
            </p>
            <p className="text-sm text-muted-foreground mt-4">
              The company may have been deleted or the ID may be incorrect.
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
    <Layout title="Edit Company" isClient={false}>
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
              <h1 className="text-2xl font-bold">Edit Company</h1>
              <p className="text-muted-foreground">
                Update company information and product access permissions
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
            <Link href="/admin/companies-clients">
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </Link>
            <Button type="submit" disabled={isUpdating}>
              <Save className="h-4 w-4 mr-2" />
              {isUpdating ? "Updating..." : "Update Company"}
            </Button>
          </div>
        </form>
      </div>
    </Layout>
  );
}
