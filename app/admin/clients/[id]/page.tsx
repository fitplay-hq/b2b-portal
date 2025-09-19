"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Layout from "@/components/layout";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import Link from "next/link";
import { ClientForm } from "../components/client-form";
import { ProductAccessSummary } from "../components/product-access-summary";
import { ProductSelectionTable } from "../components/product-selection-table";
import { mockProducts } from "../data/mock-products";

export default function EditClientPage() {
  const router = useRouter();
  const params = useParams();
  const clientId = params.id as string;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Mock client data - in real app this would come from API
  const mockClientData = {
    id: clientId,
    name: "John Doe",
    email: "john.doe@company.com",
    companyName: "Tech Solutions Inc.",
    phone: "+1234567890",
    address: "123 Business St, City, State 12345",
    password: "", // Not shown for security
  };

  // Mock selected products for this client
  const mockAccessibleProducts = ["1", "3", "5"];

  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    companyName: "",
    phone: "",
    address: "",
  });

  // Load client data on mount
  useEffect(() => {
    const loadClientData = async () => {
      setIsLoading(true);
      // Simulate API call
      setTimeout(() => {
        setFormData({
          name: mockClientData.name,
          email: mockClientData.email,
          companyName: mockClientData.companyName,
          phone: mockClientData.phone,
          address: mockClientData.address,
          password: mockClientData.password,
        });
        setSelectedProducts(mockAccessibleProducts);
        setIsLoading(false);
      }, 500);
    };

    loadClientData();
  }, [clientId]);

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
      console.log("Updating client:", {
        id: clientId,
        ...formData,
        accessibleProducts: selectedProducts,
      });
      setIsSubmitting(false);
      router.push("/admin/clients");
    }, 1000);
  };

  const selectedProductCount = selectedProducts.length;
  const totalProducts = mockProducts.length;

  if (isLoading) {
    return (
      <Layout title="Edit Client" isClient={false}>
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
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
                formData={formData}
                handleInputChange={handleInputChange}
                isNewClient={false}
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
              {isSubmitting ? "Updating..." : "Update Client"}
            </Button>
          </div>
        </form>
      </div>
    </Layout>
  );
}
