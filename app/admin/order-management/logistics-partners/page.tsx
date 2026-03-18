import { OMLogisticsPartnersClient } from "@/components/orderManagement/logistics-partners/OMLogisticsPartnersClient";
import { getOMLogisticsPartners } from "@/lib/om-data";

export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: Promise<{ 
    page?: string; 
    limit?: string;
    q?: string;
    search?: string;
  }>;
}

export default async function OMLogisticsPartnersPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const page = params.page ? parseInt(params.page as string) : 1;
  const limit = params.limit ? parseInt(params.limit as string) : 50;
  const search = (params.q as string) || (params.search as string) || "";

  const partnersData = await getOMLogisticsPartners({ page, limit, search });

  return (
    <OMLogisticsPartnersClient initialData={partnersData} />
  );
}
