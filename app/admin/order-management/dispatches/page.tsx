import { OMDispatchesClient } from "@/components/orderManagement/dispatches/OMDispatchesClient";
import { getOMDispatches, getOMStaticOptions, getOMClients, getOMDispatchOptions } from "@/lib/om-data";

export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: Promise<{
    page?: string;
    limit?: string;
    q?: string;
    search?: string;
    status?: string;
    clientId?: string;
    fromDate?: string;
    toDate?: string;
    sortBy?: string;
    view?: string;
  }>;
}

export default async function OMDispatchesPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const page = params.page ? parseInt(params.page as string) : 1;
  const limit = params.limit ? parseInt(params.limit as string) : 50;
  const search = (params.q as string) || (params.search as string) || "";
  const clientId = params.clientId as string;
  const status = params.status as string;
  const fromDate = params.fromDate as string;
  const toDate = params.toDate as string;
  const sortBy = params.sortBy as string;

  const [dispatchesData, staticOptions, clientsData, invoiceOptions, docketOptions] = await Promise.all([
    getOMDispatches({
      page,
      limit,
      search,
      clientId,
      status,
      fromDate,
      toDate,
      sortBy,
    }),
    getOMStaticOptions(),
    getOMClients({ limit: 100 }),
    getOMDispatchOptions("invoice"),
    getOMDispatchOptions("docket"),
  ]);

  return (
    <OMDispatchesClient 
      initialData={dispatchesData} 
      clientOptions={clientsData.data.map(c => ({ value: c.id, label: c.name }))}
      logisticsOptions={staticOptions.logisticsOptions}
      invoiceOptions={invoiceOptions}
      docketOptions={docketOptions}
    />
  );
}
