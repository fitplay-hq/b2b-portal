"use client";

import { OMDeliveryLocationsClient } from "@/components/orderManagement/delivery-locations/OMDeliveryLocationsClient";

export default function OMDeliveryLocationsPage() {
  const initialData = {
    data: [],
    meta: {
      total: 0,
      unfilteredTotal: 0,
      page: 1,
      limit: 50,
      totalPages: 0,
    },
  };

  return (
    <OMDeliveryLocationsClient initialData={initialData as any} />
  );
}
