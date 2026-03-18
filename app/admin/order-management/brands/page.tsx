import { OMBrandsClient } from "@/components/orderManagement/brands/OMBrandsClient";
import { getOMBrands } from "@/lib/om-data";
import Layout from "@/components/layout";

export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: Promise<{ page?: string; limit?: string }>;
}

export default async function OMBrandsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const page = params.page ? parseInt(params.page) : 1;
  const limit = params.limit ? parseInt(params.limit) : 50;

  const brandsData = await getOMBrands({ page, limit });

  return (
    <OMBrandsClient initialData={brandsData} />
  );
}
