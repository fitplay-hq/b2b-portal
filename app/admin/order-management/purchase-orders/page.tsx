import { OMPurchaseOrdersClient } from "@/components/orderManagement/purchase-orders/OMPurchaseOrdersClient";

export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: Promise<any>;
}

export default async function OMPurchaseOrdersPage({ searchParams }: PageProps) {
  // We resolve searchParams but DON'T await any database calls here
  // to ensure instant navigation without triggering loading.tsx skeleton.
  await searchParams; 

  return (
    <OMPurchaseOrdersClient />
  );
}
