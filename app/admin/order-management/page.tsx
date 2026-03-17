import { getOMDashboardData, getOMStaticOptions } from "@/lib/om-data";
import { OMDashboardClient } from "@/components/orderManagement/dashboard/OMDashboardClient";
import { Suspense } from "react";
import Layout from "@/components/layout";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

function DashboardSkeleton() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="min-w-0 flex-1 space-y-2">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-48" />
        </div>
      </div>
      <Card>
        <CardHeader className="pb-0">
          <Skeleton className="h-6 w-32" />
        </CardHeader>
        <CardContent className="pt-6">
          <div className="flex gap-2">
            <Skeleton className="h-10 flex-1" />
            <Skeleton className="h-10 w-24" />
          </div>
        </CardContent>
      </Card>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="pb-2">
              <Skeleton className="h-4 w-28" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-20 mb-1" />
              <Skeleton className="h-3 w-40" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

async function DashboardServer({ params }: { params: any }) {
  const [initialData, options] = await Promise.all([
    getOMDashboardData({
      query: (params.q as string) || "",
      fromDate: (params.fromDate as string) || "",
      toDate: (params.toDate as string) || "",
      clientName: (params.clientName as string) || "",
      itemName: (params.itemName as string) || "",
      brandName: (params.brandName as string) || "",
      poNumber: (params.poNumber as string) || "",
      invoiceNumber: (params.invoiceNumber as string) || "",
      locationId: (params.locationId as string) || "",
      logisticsPartnerId: (params.logisticsPartnerId as string) || "",
      sku: (params.sku as string) || "",
      docketNumber: (params.docketNumber as string) || "",
      gstPercentage: (params.gstPercentage as string) || "",
      minAmount: (params.minAmount as string) || "",
      maxAmount: (params.maxAmount as string) || "",
      statuses: (Array.isArray(params.status) ? params.status : params.status ? [params.status] : []) as string[],
      timeRange: (params.timeRange as string) || "all",
    }),
    getOMStaticOptions(),
  ]);

  return (
    <OMDashboardClient 
      initialData={initialData} 
      options={options} 
      searchParams={params}
    />
  );
}

export default async function Page({ searchParams }: PageProps) {
  const params = await searchParams;
  
  return (
    <Suspense fallback={<Layout isClient={false}><DashboardSkeleton /></Layout>}>
      <DashboardServer params={params} />
    </Suspense>
  );
}
