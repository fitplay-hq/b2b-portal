"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Layout from "@/components/layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { OMPurchaseOrderForm } from "@/components/orderManagement/OMPurchaseOrderForm";
import type {
  OMClient,
  OMDeliveryLocation,
  OMProduct,
  OMBrand,
} from "@/types/order-management";

function LoadingSkeleton() {
  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-10 w-full" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-6">
          <Skeleton className="h-40 w-full" />
        </CardContent>
      </Card>
    </div>
  );
}

export default function OMCreatePurchaseOrder() {
  const router = useRouter();
  const [clients, setClients] = useState<OMClient[]>([]);
  const [locations, setLocations] = useState<OMDeliveryLocation[]>([]);
  const [products, setProducts] = useState<OMProduct[]>([]);
  const [brands, setBrands] = useState<OMBrand[]>([]);
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchData = async () => {
    setIsDataLoading(true);
    try {
      const [clientsRes, locationsRes, productsRes, brandsRes] =
        await Promise.all([
          fetch("/api/admin/om/clients"),
          fetch("/api/admin/om/delivery-locations"),
          fetch("/api/admin/om/products"),
          fetch("/api/admin/om/brands"),
        ]);

      if (clientsRes.ok) setClients(await clientsRes.json());
      if (locationsRes.ok) setLocations(await locationsRes.json());
      if (productsRes.ok) setProducts(await productsRes.json());
      if (brandsRes.ok) setBrands(await brandsRes.json());
    } catch (err) {
      console.error("Error fetching master data:", err);
      toast.error("Failed to load form data");
    } finally {
      setIsDataLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (payload: any) => {
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/admin/om/purchase-orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        toast.success("Purchase Order created successfully");
        router.push("/admin/order-management/purchase-orders");
      } else {
        const err = await res.json();
        toast.error(err.error || "Failed to create Purchase Order");
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout isClient={false}>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() =>
              router.push("/admin/order-management/purchase-orders")
            }
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-semibold">Create Purchase Order</h1>
            <p className="text-muted-foreground">
              Create a new purchase order for a client
            </p>
          </div>
        </div>

        {isDataLoading ? (
          <LoadingSkeleton />
        ) : (
          <OMPurchaseOrderForm
            clients={clients}
            locations={locations}
            products={products}
            brands={brands}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
            onRefreshData={fetchData}
          />
        )}
      </div>
    </Layout>
  );
}
