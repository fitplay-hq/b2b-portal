import { OMClientsClient } from "@/components/orderManagement/clients/OMClientsClient";
import { getOMClients } from "@/lib/om-data";
import Layout from "@/components/layout";

export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: Promise<{ 
    page?: string; 
    limit?: string;
    q?: string;
    search?: string;
    clientName?: string;
    sortBy?: string;
  }>;
}

export default async function OMClientsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const page = params.page ? parseInt(params.page as string) : 1;
  const limit = params.limit ? parseInt(params.limit as string) : 50;
  const search = (params.q as string) || (params.search as string) || (params.clientName as string) || "";
  const sortBy = params.sortBy as string;

  const clientsData = await getOMClients({ page, limit, search });

  return (
    <OMClientsClient initialData={clientsData} />
  );
}
