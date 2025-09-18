"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Layout from "@/components/layout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Package, Save, Loader2 } from "lucide-react";
import Link from "next/link";

export default function EditClientPage() {
  const router = useRouter();
  const params = useParams();
  const clientId = params.id as string;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Mock data for products
  const mockProducts = [
    {
      id: "1",
      name: "Premium Notebook",
      sku: "NB001",
      category: "stationery",
      stock: 150,
    },
    {
      id: "2",
      name: "Executive Pen Set",
      sku: "PS001",
      category: "stationery",
      stock: 75,
    },
    {
      id: "3",
      name: "Travel Mug",
      sku: "TM001",
      category: "drinkware",
      stock: 200,
    },
    {
      id: "4",
      name: "Wireless Mouse",
      sku: "WM001",
      category: "travelAndTech",
      stock: 50,
    },
    {
      id: "5",
      name: "Branded T-Shirt",
      sku: "TS001",
      category: "apparel",
      stock: 100,
    },
  ];

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
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
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
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Client Details Form - Left Side */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Client Information</CardTitle>
                  <CardDescription>
                    Update the client account details
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name *</Label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        placeholder="Enter full name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        placeholder="Enter email address"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="companyName">Company Name *</Label>
                      <Input
                        id="companyName"
                        name="companyName"
                        value={formData.companyName}
                        onChange={handleInputChange}
                        required
                        placeholder="Enter company name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number *</Label>
                      <Input
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        required
                        placeholder="Enter phone number"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">
                      New Password (leave empty to keep current)
                    </Label>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder="Enter new password"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">Address *</Label>
                    <Textarea
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      required
                      placeholder="Enter full address"
                      rows={3}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Product Access Summary - Right Side */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="h-5 w-5" />
                    Product Access Summary
                  </CardTitle>
                  <CardDescription>
                    Current product access overview
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary">
                      {selectedProductCount}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      of {totalProducts} products selected
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Selected Products:</span>
                      <span className="font-medium">
                        {selectedProductCount}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Available Products:</span>
                      <span className="font-medium">{totalProducts}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Access Percentage:</span>
                      <span className="font-medium">
                        {totalProducts > 0
                          ? Math.round(
                              (selectedProductCount / totalProducts) * 100
                            )
                          : 0}
                        %
                      </span>
                    </div>
                  </div>

                  {selectedProducts.length > 0 && (
                    <>
                      <Separator />
                      <div>
                        <h4 className="text-sm font-medium mb-2">
                          Selected Products:
                        </h4>
                        <div className="space-y-1 max-h-32 overflow-y-auto">
                          {selectedProducts.map((productId) => {
                            const product = mockProducts.find(
                              (p) => p.id === productId
                            );
                            return product ? (
                              <Badge
                                key={productId}
                                variant="secondary"
                                className="text-xs"
                              >
                                {product.name}
                              </Badge>
                            ) : null;
                          })}
                        </div>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Product Selection Table - Bottom */}
          <Card>
            <CardHeader>
              <CardTitle>Product Access Selection</CardTitle>
              <CardDescription>
                Modify the products this client should have access to
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <table className="w-full">
                  <thead className="bg-muted/50">
                    <tr className="border-b">
                      <th className="text-left p-4 font-medium">Select</th>
                      <th className="text-left p-4 font-medium">
                        Product Name
                      </th>
                      <th className="text-left p-4 font-medium">SKU</th>
                      <th className="text-left p-4 font-medium">Category</th>
                      <th className="text-left p-4 font-medium">Stock</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockProducts.map((product) => (
                      <tr
                        key={product.id}
                        className="border-b hover:bg-muted/50"
                      >
                        <td className="p-4">
                          <Checkbox
                            checked={selectedProducts.includes(product.id)}
                            onCheckedChange={() =>
                              handleProductToggle(product.id)
                            }
                          />
                        </td>
                        <td className="p-4 font-medium">{product.name}</td>
                        <td className="p-4 text-sm text-muted-foreground">
                          {product.sku}
                        </td>
                        <td className="p-4">
                          <Badge variant="outline" className="capitalize">
                            {product.category.replace(/([A-Z])/g, " $1").trim()}
                          </Badge>
                        </td>
                        <td className="p-4 text-sm">{product.stock} units</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex items-center justify-between mt-4">
                <div className="text-sm text-muted-foreground">
                  {selectedProductCount} of {totalProducts} products selected
                </div>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setSelectedProducts([])}
                  >
                    Clear All
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() =>
                      setSelectedProducts(mockProducts.map((p) => p.id))
                    }
                  >
                    Select All
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

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
