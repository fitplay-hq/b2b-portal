import { OMDeliveryLocationsClient } from "@/components/orderManagement/delivery-locations/OMDeliveryLocationsClient";
import { getOMDeliveryLocations } from "@/lib/om-data";

export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: Promise<{ 
    page?: string; 
    limit?: string;
    q?: string;
    sortBy?: string;
    cityName?: string;
  }>;
}

export default async function OMDeliveryLocationsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const page = params.page ? parseInt(params.page as string) : 1;
  const limit = params.limit ? parseInt(params.limit as string) : 50;
  const search = (params.q as string) || (params.cityName as string) || "";
  const sortBy = params.sortBy as string;

  const initialData = await getOMDeliveryLocations({ page, limit, search });

  return (
    <OMDeliveryLocationsClient initialData={initialData} />
  );
}
