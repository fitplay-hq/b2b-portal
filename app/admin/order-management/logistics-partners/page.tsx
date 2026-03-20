import { OMLogisticsPartnersClient } from "@/components/orderManagement/logistics-partners/OMLogisticsPartnersClient";
import { getOMLogisticsPartners } from "@/lib/om-data";

export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: Promise<{ 
    page?: string; 
    limit?: string;
    q?: string;
    sortBy?: string;
    partnerName?: string;
  }>;
}

export default async function OMLogisticsPartnersPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const page = params.page ? parseInt(params.page as string) : 1;
  const limit = params.limit ? parseInt(params.limit as string) : 50;
  const search = (params.q as string) || (params.partnerName as string) || "";
  const sortBy = params.sortBy as string;

  const initialData = await getOMLogisticsPartners({ page, limit, search });

  return (
    <OMLogisticsPartnersClient initialData={initialData} />
  );
}
