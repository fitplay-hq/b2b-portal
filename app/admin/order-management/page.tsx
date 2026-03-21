import { getOMDashboardData, getOMStaticOptions } from "@/lib/om-data";
import { OMDashboardClient } from "@/components/orderManagement/dashboard/OMDashboardClient";

export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
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
  
  return <DashboardServer params={params} />;
}
