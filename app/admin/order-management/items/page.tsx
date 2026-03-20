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

export default async function OMItemsPage() {
  const dummyMeta = { total: 0, page: 1, limit: 50, totalPages: 0 };

  return (
    <OMItemsClient
      initialData={{ data: [], meta: dummyMeta }}
      initialBrands={{ data: [], meta: dummyMeta }}
    />
  );
}
