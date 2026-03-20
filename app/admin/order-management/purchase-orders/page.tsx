import { OMPurchaseOrdersClient } from "@/components/orderManagement/purchase-orders/OMPurchaseOrdersClient";
import { getOMPurchaseOrders } from "@/lib/om-data";

export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: Promise<{
    page?: string;
    limit?: string;
    q?: string;
    search?: string;
    status?: string;
    clientId?: string;
    locationId?: string;
    fromDate?: string;
    toDate?: string;
    sortBy?: string;
  }>;
}

export default async function OMPurchaseOrdersPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const page = params.page ? parseInt(params.page as string) : 1;
  const limit = params.limit ? parseInt(params.limit as string) : 50;
  const search = (params.q as string) || (params.search as string) || "";
  const clientId = params.clientId as string;
  const status = params.status as string;
  const locationId = params.locationId as string;
  const fromDate = params.fromDate as string;
  const toDate = params.toDate as string;
  const sortBy = params.sortBy as string;

  const purchaseOrdersData = await getOMPurchaseOrders({ 
    page, 
    limit, 
    search,
    clientId,
    status,
    locationId,
    fromDate,
    toDate,
    sortBy
  });

  return (
    <OMPurchaseOrdersClient initialData={purchaseOrdersData} />
  );
}
