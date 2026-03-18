import { OMClientsClient } from "@/components/orderManagement/clients/OMClientsClient";
import { getOMClients } from "@/lib/om-data";
import Layout from "@/components/layout";

export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: Promise<{ page?: string; limit?: string }>;
}

export default async function OMClientsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const page = params.page ? parseInt(params.page) : 1;
  const limit = params.limit ? parseInt(params.limit) : 50;

  const clientsData = await getOMClients({ page, limit });

  return (
    <OMClientsClient initialData={clientsData} />
  );
}
