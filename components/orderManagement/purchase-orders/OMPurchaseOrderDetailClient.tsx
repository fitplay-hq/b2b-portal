"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { 
  ArrowLeft, 
  Calendar, 

  User, 
  Package, 
  TrendingUp, 
  Clock,
  Printer,
  Download,
  AlertCircle,
  Edit,
  Plus
} from "lucide-react";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  useOMPurchaseOrder, 
  updateOMPurchaseOrderStatus,
  useOMMutate 
} from "@/data/om/admin.hooks";
import { 
  OM_PO_STATUS_CONFIG, 
  type OMPurchaseOrderStatus,
  type OMPurchaseOrder
} from "@/types/order-management";
import { OMPurchaseOrderSummaryCards } from "@/components/orderManagement/OMPurchaseOrderSummaryCards";
import { OMPurchaseOrderItemsTable } from "@/components/orderManagement/OMPurchaseOrderItemsTable";
import { OMDispatchHistory } from "@/components/orderManagement/OMDispatchHistory";
import { toast } from "sonner";

interface OMPurchaseOrderDetailClientProps {
  initialData: OMPurchaseOrder;
}

export function OMPurchaseOrderDetailClient({ initialData }: OMPurchaseOrderDetailClientProps) {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const { revalidateOM } = useOMMutate();

  // 1. Fetch data via SWR
  const swrOptions = useMemo(() => ({
    revalidateOnMount: true, // Forces fresh fetch on detail mount (after coming from edit)
    revalidateIfStale: true
  }), []);

  const { purchaseOrder: swrData, isLoading, mutate } = useOMPurchaseOrder(id, {
    fallbackData: initialData,
    ...swrOptions
  });

  const [po, setPo] = useState<OMPurchaseOrder>(initialData);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  // Sync with initialData (from server refresh)
  useEffect(() => {
    if (initialData) {
      setPo(initialData);
    }
  }, [initialData]);

  // Sync with SWR data (for background updates)
  useEffect(() => {
    if (swrData && swrData !== po) {
      setPo(swrData);
    }
  }, [swrData]);


  const handleStatusChange = async (newStatus: OMPurchaseOrderStatus) => {
    if (po.status === newStatus) return;
    
    setIsUpdatingStatus(true);
    try {
      // Optimistic update
      setPo(prev => ({ ...prev, status: newStatus }));
      
      const success = await updateOMPurchaseOrderStatus(po.id, newStatus);
      if (success) {
        toast.success(`Status updated to ${OM_PO_STATUS_CONFIG[newStatus].label}`);
        mutate(); // Immediate local revalidation
        revalidateOM(); // Global revalidation
        router.refresh(); // Refresh server components
      } else {
        // Revert on failure
        setPo(swrData || initialData);
        toast.error("Failed to update status");
      }
    } catch (error) {
      console.error("Error updating status:", error);
      setPo(swrData || initialData);
      toast.error("An error occurred while updating status");
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  if (!po && isLoading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-48" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (!po) {
    return (
      <div className="p-6 text-center">
        <h2 className="text-xl font-bold mb-4">Purchase Order Not Found</h2>
        <Link href="/admin/order-management/purchase-orders">
          <Button variant="outline">Back to Purchase Orders</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Navigation & Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link href="/admin/order-management/purchase-orders">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              {po.poNumber || po.estimateNumber}
              <Badge
                className={
                  po.status === "DRAFT"
                    ? "bg-gray-100 text-gray-800 hover:bg-gray-100 border-transparent"
                    : po.status === "CONFIRMED"
                      ? "bg-blue-100 text-blue-800 hover:bg-blue-100 border-transparent"
                      : po.status === "PARTIALLY_DISPATCHED"
                        ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-100 border-transparent"
                        : po.status === "FULLY_DISPATCHED"
                          ? "bg-green-100 text-green-800 hover:bg-green-100 border-transparent"
                          : po.status === "CLOSED"
                            ? "bg-red-100 text-red-800 hover:bg-red-100 border-transparent"
                            : "bg-gray-100 text-gray-800 hover:bg-gray-100 border-transparent"
                }
              >
                {po.status}
              </Badge>
            </h1>
            <p className="text-sm text-muted-foreground flex items-center gap-4 mt-1">
              <span className="flex items-center gap-1">
                <User className="h-3 w-3" /> {po.client?.name}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="h-3 w-3" /> {po.createdAt ? format(new Date(po.createdAt), "dd MMM yyyy") : "N/A"}
              </span>
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Link href={`/admin/order-management/purchase-orders/${po.id}/edit`}>
            <Button size="sm" variant="outline">
              <Edit className="h-4 w-4 mr-2" />
              Edit PO
            </Button>
          </Link>
          <Link href={`/admin/order-management/dispatches/create?poId=${po.id}`}>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Dispatch Items
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Overview */}
      <OMPurchaseOrderSummaryCards po={po} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Items & History */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">Order Items</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
               <OMPurchaseOrderItemsTable 
                 poId={po.id} 
                 items={po.items || []} 
                 dispatches={po.dispatchOrders || []} 
               />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Dispatch History</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
               <OMDispatchHistory 
                 dispatches={po.dispatchOrders || []} 
                 poItems={po.items || []} 
               />
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Order Details & Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Client & Shipping</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1">
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">Client Name</p>
                <p className="text-sm font-medium">{po.client?.name || "N/A"}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">Delivery Locations</p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {po.deliveryLocations?.length ? (
                    po.deliveryLocations.map(loc => (
                      <Badge key={loc.id} variant="secondary" className="text-[10px] px-1.5 py-0.5">
                        {loc.name}
                      </Badge>
                    ))
                  ) : (
                    <span className="text-xs text-muted-foreground italic">No locations specified</span>
                  )}
                </div>
              </div>
              <div className="pt-4 border-t space-y-2">
                 <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">Quick Actions</p>
                 <Link href={`/admin/order-management/dispatches/create?poId=${po.id}`}>
                    <Button variant="outline" size="sm" className="w-full text-xs h-8 justify-start" disabled={po.remainingQuantity === 0}>
                      Create New Dispatch
                    </Button>
                 </Link>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Order Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center text-xs">
                 <span className="text-muted-foreground">Estimate Number</span>
                 <span className="font-mono">{po.estimateNumber || "N/A"}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                 <span className="text-muted-foreground">PO Number</span>
                 <span className="font-mono">{po.poNumber || "N/A"}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                 <span className="text-muted-foreground">PO Date</span>
                 <span>{po.poDate ? format(new Date(po.poDate), "dd MMM yyyy") : "N/A"}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                 <span className="text-muted-foreground">Payment Terms</span>
                 <span className="font-medium">{po.paymentTerms || "Standard"}</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-orange-200 bg-orange-50/20">
             <CardHeader className="pb-2">
               <CardTitle className="text-sm flex items-center gap-2">
                  Notes & Comments
               </CardTitle>
             </CardHeader>
             <CardContent>
                <p className="text-xs text-muted-foreground italic leading-relaxed">
                  {po.notes || "No special instructions or notes provided for this order."}
                </p>
             </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
