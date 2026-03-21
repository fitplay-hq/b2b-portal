import { OMPurchaseOrderDetailClient } from "./OMPurchaseOrderDetailClient";
import { getOMPurchaseOrderById } from "@/lib/om-data";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function OMPurchaseOrderPage({ params }: PageProps) {
  const { id } = await params;
  const initialData = await getOMPurchaseOrderById(id);

  if (!initialData) {
    notFound();
  }

  return <OMPurchaseOrderDetailClient id={id} initialData={initialData} />;
}
