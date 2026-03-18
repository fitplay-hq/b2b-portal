import { OMBrandsClient } from "@/components/orderManagement/brands/OMBrandsClient";
import { getOMBrands } from "@/lib/om-data";
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

export default async function OMBrandsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const page = params.page ? parseInt(params.page as string) : 1;
  const limit = params.limit ? parseInt(params.limit as string) : 50;
  const search = (params.q as string) || (params.search as string) || "";

  const brandsData = await getOMBrands({ page, limit, search });

  return (
    <OMBrandsClient initialData={brandsData} />
  );
}
