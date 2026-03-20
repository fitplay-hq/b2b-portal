import { OMDispatchesClient } from "@/components/orderManagement/dispatches/OMDispatchesClient";

export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: Promise<any>;
}

export default async function OMDispatchesPage({ searchParams }: PageProps) {
  await searchParams; 

  return (
    <OMDispatchesClient />
  );
}
