"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
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
import { 
  useOMMutate, 
  useOMClients, 
  useOMDeliveryLocations, 
  useOMProducts, 
  useOMBrands,
  useOMPurchaseOrder
} from "@/data/om/admin.hooks";

function LoadingSkeleton() {
  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
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

export default function OMEditPurchaseOrder() {
  const router = useRouter();
  const { id } = useParams() as { id: string };
  const { revalidateOM } = useOMMutate();

  const { clients, isLoading: loadingClients } = useOMClients();
  const { locations, isLoading: loadingLocations } = useOMDeliveryLocations();
  const { products, isLoading: loadingProducts } = useOMProducts("limit=1000");
  const { brands, isLoading: loadingBrands } = useOMBrands();
  
  const { purchaseOrder: poDataResponse, isLoading: loadingPO } = useOMPurchaseOrder(id);
  const poData = poDataResponse;
  
  const isDataLoading = loadingClients || loadingLocations || loadingProducts || loadingBrands || loadingPO;
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const refreshData = async () => {
    revalidateOM();
  };

  const handleSubmit = async (payload: any) => {
    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/admin/om/purchase-orders/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        toast.success("Purchase Order updated successfully");
        revalidateOM();
        router.refresh(); // Refresh server components
        router.push("/admin/order-management/purchase-orders");
      } else {
        const err = await res.json();
        toast.error(err.error || "Failed to update Purchase Order");
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
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
            <h1 className="text-2xl font-semibold">Edit Purchase Order</h1>
            <p className="text-muted-foreground">
              Modify an existing purchase order
            </p>
          </div>
        </div>

        {isDataLoading || !poData ? (
          <LoadingSkeleton />
        ) : (
          <OMPurchaseOrderForm
            initialData={poData}
            clients={clients}
            locations={locations}
            products={products}
            brands={brands}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
            onRefreshData={refreshData}
          />
        )}
    </div>
  );
}
