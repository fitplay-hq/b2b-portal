import { OMPurchaseOrdersClient } from "@/components/orderManagement/purchase-orders/OMPurchaseOrdersClient";
import {
  getOMPurchaseOrders,
  getOMClients,
  getOMDeliveryLocations,
  getOMPONumberOptions,
} from "@/lib/om-data";
import Layout from "@/components/layout";

export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: Promise<{ page?: string; limit?: string }>;
}

export default async function OMPurchaseOrdersPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const page = params.page ? parseInt(params.page) : 1;
  const limit = params.limit ? parseInt(params.limit) : 50;

  const [purchaseOrdersData, clientsData, locationsData, poOptions] = await Promise.all([
    getOMPurchaseOrders({ page, limit }),
    getOMClients(),
    getOMDeliveryLocations(),
    getOMPONumberOptions(),
  ]);

  const clientOptions = clientsData.data.map((c: any) => ({ value: c.name, label: c.name }));
  const locationOptions = locationsData.data.map((l: any) => ({ value: l.id, label: l.name }));

  return (
    <Layout isClient={false}>
      <OMPurchaseOrdersClient
        initialData={purchaseOrdersData}
        clientOptions={clientOptions}
        locationOptions={locationOptions}
        poOptions={poOptions}
      />
    </Layout>
  );
}
