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
    brandIds?: string;
    minPrice?: string;
    maxPrice?: string;
    gst?: string;
    minTotalOrdered?: string;
    maxTotalOrdered?: string;
  }>;
}

export default async function OMItemsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const page = params.page ? parseInt(params.page as string) : 1;
  const limit = params.limit ? parseInt(params.limit as string) : 50;
  const search = (params.q as string) || (params.search as string) || "";
  const brandIds = params.brandIds ? (params.brandIds as string).split(",") : [];
  const minPrice = params.minPrice ? parseFloat(params.minPrice as string) : undefined;
  const maxPrice = params.maxPrice ? parseFloat(params.maxPrice as string) : undefined;
  const gst = params.gst as string;
  const minTotalOrdered = params.minTotalOrdered ? parseInt(params.minTotalOrdered as string) : undefined;
  const maxTotalOrdered = params.maxTotalOrdered ? parseInt(params.maxTotalOrdered as string) : undefined;

  const [initialData, initialBrands] = await Promise.all([
    getOMProducts({ 
      page, 
      limit, 
      search, 
      brandIds,
      minPrice,
      maxPrice,
      gst,
      minTotalOrdered,
      maxTotalOrdered
    }),
    getOMBrands({ limit: 100 }), // Fetch more brands for filtering
  ]);

  return (
    <OMItemsClient
      initialData={initialData}
      initialBrands={initialBrands}
    />
  );
}
