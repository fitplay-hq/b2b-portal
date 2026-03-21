import { OMPurchaseOrderDetailClient } from "@/components/orderManagement/purchase-orders/OMPurchaseOrderDetailClient";


interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function OMPurchaseOrderPage({ params }: PageProps) {
  const { id } = await params;

  return <OMPurchaseOrderDetailClient id={id} />;
}
