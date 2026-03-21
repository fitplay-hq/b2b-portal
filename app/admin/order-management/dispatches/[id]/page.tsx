import { getOMDispatchById } from "@/lib/om-data";
import { notFound } from "next/navigation";
import DispatchDetailClient from "../../../../../components/orderManagement/dispatches/DispatchDetailClient";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function OMDispatchDetailPage({ params }: PageProps) {
  const { id } = await params;
  const initialData = await getOMDispatchById(id);

  if (!initialData) {
    notFound();
  }

  return <DispatchDetailClient initialData={initialData} />;
}
