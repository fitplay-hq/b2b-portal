import { getOMDispatchById } from "@/lib/om-data";
import { notFound } from "next/navigation";
import DispatchDetailClient from "../../../../../components/orderManagement/dispatches/DispatchDetailClient";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function OMDispatchDetailPage({ params }: PageProps) {
  const { id } = await params;
  
  // Note: We no longer await initialData here to enable instant navigation.
  // The client component handles data fetching via SWR.
  return <DispatchDetailClient id={id} />;
}
