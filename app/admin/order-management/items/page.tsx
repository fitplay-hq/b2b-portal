import { OMItemsClient } from "@/components/orderManagement/items/OMItemsClient";
import { getOMProducts, getOMBrands } from "@/lib/om-data";
import Layout from "@/components/layout";

export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: Promise<{ 
    page?: string; 
    limit?: string;
    q?: string;
    search?: string;
    brandId?: string;
  }>;
}

export default async function OMItemsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const page = params.page ? parseInt(params.page as string) : 1;
  const limit = params.limit ? parseInt(params.limit as string) : 50;
  const search = (params.q as string) || (params.search as string) || "";
  const brandId = params.brandId as string;

  const [itemsData, brandsData] = await Promise.all([
    getOMProducts({ page, limit, search, brandId }),
    getOMBrands({ limit: 500 }), // Fetch more brands for filtering
  ]);

  return (
    <OMItemsClient initialData={itemsData} initialBrands={brandsData} />
  );
}
