import { OMDeliveryLocationsClient } from "@/components/orderManagement/delivery-locations/OMDeliveryLocationsClient";
import { getOMDeliveryLocations } from "@/lib/om-data";
import Layout from "@/components/layout";

export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: Promise<{ 
    page?: string; 
    limit?: string;
    q?: string;
    search?: string;
  }>;
}

export default async function OMDeliveryLocationsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const page = params.page ? parseInt(params.page as string) : 1;
  const limit = params.limit ? parseInt(params.limit as string) : 50;
  const search = (params.q as string) || (params.search as string) || "";

  const locationsData = await getOMDeliveryLocations({ page, limit, search });

  return (
    <OMDeliveryLocationsClient initialData={locationsData} />
  );
}
