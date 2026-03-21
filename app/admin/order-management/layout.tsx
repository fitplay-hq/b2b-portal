"use client";

import { SWRConfig } from "swr";
import { fetcher } from "@/lib/fetcher";
import { ReactNode } from "react";

export default function OrderManagementLayout({ children }: { children: ReactNode }) {
  return (
    <SWRConfig
      value={{
        fetcher,
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
        revalidateIfStale: false,
        dedupingInterval: 1000 * 60 * 5, // 5 min cache
      }}
    >
      {children}
    </SWRConfig>
  );
}
