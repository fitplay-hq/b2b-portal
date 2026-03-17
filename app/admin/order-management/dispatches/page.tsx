import { OMDispatchesClient } from "@/components/orderManagement/dispatches/OMDispatchesClient";
import {
  getOMDispatches,
  getOMClients,
  getOMLogisticsPartners,
  getOMDispatchOptions,
} from "@/lib/om-data";
import Layout from "@/components/layout";

export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: Promise<{ page?: string; limit?: string }>;
}

export default async function OMDispatchesPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const page = params.page ? parseInt(params.page) : 1;
  const limit = params.limit ? parseInt(params.limit) : 50;

  const [dispatchesData, clientsData, logisticsData, invoices, dockets] = await Promise.all([
    getOMDispatches({ page, limit }),
    getOMClients(),
    getOMLogisticsPartners(),
    getOMDispatchOptions("invoice"),
    getOMDispatchOptions("docket"),
  ]);

  const clientOptions = clientsData.data.map((c: any) => ({ value: c.name, label: c.name }));
  const logisticsOptions = logisticsData.data.map((l: any) => ({ value: l.id, label: l.name }));

  return (
    <Layout isClient={false}>
      <OMDispatchesClient
        initialData={dispatchesData}
        clientOptions={clientOptions}
        logisticsOptions={logisticsOptions}
        invoiceOptions={invoices}
        docketOptions={dockets}
      />
    </Layout>
  );
}
