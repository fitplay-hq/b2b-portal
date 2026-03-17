import { OMDeliveryLocationsClient } from "@/components/orderManagement/delivery-locations/OMDeliveryLocationsClient";
import { getOMDeliveryLocations } from "@/lib/om-data";
import Layout from "@/components/layout";

export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: Promise<{ page?: string; limit?: string }>;
}

export default async function OMDeliveryLocationsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const page = params.page ? parseInt(params.page) : 1;
  const limit = params.limit ? parseInt(params.limit) : 50;

  const locationsData = await getOMDeliveryLocations({ page, limit });

  return (
    <Layout isClient={false}>
      <OMDeliveryLocationsClient initialData={locationsData} />
    </Layout>
  );
}
