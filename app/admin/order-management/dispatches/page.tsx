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
  searchParams: Promise<{ 
    page?: string; 
    limit?: string;
    q?: string;
    search?: string;
    status?: string;
    clientId?: string;
    logisticsPartnerId?: string;
    deliveryLocationId?: string;
    fromDate?: string;
    toDate?: string;
    sortBy?: string;
  }>;
}

export default async function OMDispatchesPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const page = params.page ? parseInt(params.page as string) : 1;
  const limit = params.limit ? parseInt(params.limit as string) : 500;
  const search = (params.q as string) || (params.search as string) || "";
  const status = params.status as string;
  const clientId = params.clientId as string;
  const logisticsPartnerId = params.logisticsPartnerId as string;
  const deliveryLocationId = params.deliveryLocationId as string;
  const fromDate = params.fromDate as string;
  const toDate = params.toDate as string;
  const sortBy = params.sortBy as string;

  const [dispatchesData, clientsData, logisticsData, invoices, dockets] = await Promise.all([
    getOMDispatches({ 
      page, 
      limit, 
      search, 
      status, 
      clientId, 
      logisticsPartnerId, 
      deliveryLocationId, 
      fromDate, 
      toDate, 
      sortBy 
    }),
    getOMClients(),
    getOMLogisticsPartners(),
    getOMDispatchOptions("invoice"),
    getOMDispatchOptions("docket"),
  ]);

  const clientOptions = clientsData.data.map((c: any) => ({ value: c.name, label: c.name }));
  const logisticsOptions = logisticsData.data.map((l: any) => ({ value: l.id, label: l.name }));

  return (
    <OMDispatchesClient
      initialData={dispatchesData}
      clientOptions={clientOptions}
      logisticsOptions={logisticsOptions}
      invoiceOptions={invoices}
      docketOptions={dockets}
    />
  );
}
