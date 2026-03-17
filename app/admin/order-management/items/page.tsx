import { OMItemsClient } from "@/components/orderManagement/items/OMItemsClient";
import { getOMProducts, getOMBrands } from "@/lib/om-data";
import Layout from "@/components/layout";

export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: Promise<{ page?: string; limit?: string }>;
}

export default async function OMItemsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const page = params.page ? parseInt(params.page) : 1;
  const limit = params.limit ? parseInt(params.limit) : 50;

  const [itemsData, brandsData] = await Promise.all([
    getOMProducts({ page, limit }),
    getOMBrands(),
  ]);

  return (
    <Layout isClient={false}>
      <OMItemsClient initialData={itemsData} initialBrands={brandsData} />
    </Layout>
  );
}
