import { OMLogisticsPartnersClient } from "@/components/orderManagement/logistics-partners/OMLogisticsPartnersClient";
import { getOMLogisticsPartners } from "@/lib/om-data";
import Layout from "@/components/layout";

export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: Promise<{ page?: string; limit?: string }>;
}

export default async function OMLogisticsPartnersPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const page = params.page ? parseInt(params.page) : 1;
  const limit = params.limit ? parseInt(params.limit) : 50;

  const partnersData = await getOMLogisticsPartners({ page, limit });

  return (
    <OMLogisticsPartnersClient initialData={partnersData} />
  );
}
