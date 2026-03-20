"use client";

import { OMLogisticsPartnersClient } from "@/components/orderManagement/logistics-partners/OMLogisticsPartnersClient";

export default function OMLogisticsPartnersPage() {
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
    <OMLogisticsPartnersClient initialData={initialData as any} />
  );
}
