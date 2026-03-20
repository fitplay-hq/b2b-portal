import { getOMDispatchById } from "@/lib/om-data";
import DispatchDetailClient from "../../../../../components/orderManagement/dispatches/DispatchDetailClient";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function OMDispatchDetailPage({ params }: PageProps) {
  const { id } = await params;
  const dispatch = await getOMDispatchById(id);

  if (!dispatch) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-semibold mb-2">Dispatch Not Found</h3>
        <p className="text-muted-foreground mb-4">
          The dispatch you're looking for doesn't exist or has been deleted.
        </p>
        <Link href="/admin/order-management/dispatches">
          <Button>Back to Dispatches</Button>
        </Link>
      </div>
    );
  }

  return <DispatchDetailClient initialData={dispatch} />;
}
