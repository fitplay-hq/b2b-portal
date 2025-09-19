"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Layout from "@/components/layout";
import { ArrowLeft, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ClientForm } from "../components/client-form";
import { ProductAccessSummary } from "../components/product-access-summary";
import { ProductSelectionTable } from "../components/product-selection-table";
import { mockProducts } from "../data/mock-products";

export default function NewClientPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    companyName: "",
    phone: "",
    address: "",
  });

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
    setIsSubmitting(true);

    // Mock API call
    setTimeout(() => {
      console.log("Creating client:", {
        ...formData,
        accessibleProducts: selectedProducts,
      });
      setIsSubmitting(false);
      router.push("/admin/clients");
    }, 1000);
  };

  const selectedProductCount = selectedProducts.length;
  const totalProducts = mockProducts.length;

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
                isNewClient={true}
              />
            </div>

            {/* Product Access Summary - Right Side */}
            <div className="space-y-6">
              <ProductAccessSummary
                selectedProducts={selectedProducts}
                products={mockProducts}
              />
            </div>
          </div>

          {/* Product Selection Table - Bottom */}
          <ProductSelectionTable
            selectedProducts={selectedProducts}
            products={mockProducts}
            onProductToggle={handleProductToggle}
            onClearAll={() => setSelectedProducts([])}
            onSelectAll={() =>
              setSelectedProducts(mockProducts.map((p) => p.id))
            }
          />

          {/* Action Buttons */}
          <div className="flex justify-end gap-4">
            <Link href="/admin/clients">
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </Link>
            <Button type="submit" disabled={isSubmitting}>
              <Save className="h-4 w-4 mr-2" />
              {isSubmitting ? "Creating..." : "Create Client"}
            </Button>
          </div>
        </form>
      </div>
    </Layout>
  );
}
