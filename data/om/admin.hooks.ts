import useSWR, { useSWRConfig } from "swr";
import { useCallback } from "react";
import { OMPurchaseOrder, OMDispatchOrder, OMPaginationMeta } from "@/types/order-management";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export interface OMResponse<T> {
  success: boolean;
  data: T;
  meta?: OMPaginationMeta;
}

/**
 * Hook to fetch all purchase orders
 */
export function useOMPurchaseOrders(params?: string, options: any = {}) {
  const url = `/api/admin/om/purchase-orders${params ? `?${params}` : ""}`;
  const { data, error, isLoading, mutate } = useSWR<OMResponse<OMPurchaseOrder[]>>(url, fetcher, {
    revalidateOnFocus: false,
    revalidateIfStale: false,
    ...options
  });

  return {
    purchaseOrders: data?.data || [],
    meta: data?.meta,
    error,
    isLoading,
    mutate,
  };
}

/**
 * Hook to fetch a single purchase order by ID
 */
export function useOMPurchaseOrder(id?: string, options: any = {}) {
  const url = id ? `/api/admin/om/purchase-orders/${id}` : null;
  const { data, error, isLoading, mutate } = useSWR<OMPurchaseOrder>(url, fetcher, {
    revalidateOnFocus: false,
    revalidateIfStale: false,
    ...options
  });

  return {
    purchaseOrder: data,
    error,
    isLoading,
    mutate,
  };
}

/**
 * Hook to fetch all dispatch orders
 */
export function useOMDispatches(params?: string, options: any = {}) {
  const url = `/api/admin/om/dispatch-orders${params ? `?${params}` : ""}`;
  const { data, error, isLoading, mutate } = useSWR<OMResponse<OMDispatchOrder[]>>(url, fetcher, {
    revalidateOnFocus: false,
    revalidateIfStale: false,
    ...options
  });

  return {
    dispatches: data?.data || [],
    meta: data?.meta,
    error,
    isLoading,
    mutate,
  };
}

/**
 * Hook to fetch a single dispatch order by ID
 */
export function useOMDispatch(id?: string, options: any = {}) {
  const url = id ? `/api/admin/om/dispatch-orders/${id}` : null;
  const { data, error, isLoading, mutate } = useSWR<OMDispatchOrder>(url, fetcher, {
    revalidateOnFocus: false,
    revalidateIfStale: false,
    ...options
  });

  return {
    dispatch: data,
    error,
    isLoading,
    mutate,
  };
}

/**
 * Hook to fetch all clients for options
 */
export function useOMClients() {
  const { data, error, isLoading } = useSWR<OMResponse<any[]>>("/api/admin/om/clients?limit=500", fetcher, {
    revalidateOnFocus: false,
    revalidateIfStale: false,
  });

  return {
    clients: data?.data || [],
    isLoading,
    error,
  };
}

/**
 * Hook to fetch all delivery locations for options
 */
export function useOMDeliveryLocations() {
  const { data, error, isLoading } = useSWR<OMResponse<any[]>>("/api/admin/om/delivery-locations?limit=500", fetcher, {
    revalidateOnFocus: false,
    revalidateIfStale: false,
  });

  return {
    locations: data?.data || [],
    isLoading,
    error,
  };
}

/**
 * Hook to fetch all logistics partners for options
 */
export function useOMLogisticsPartners() {
  const { data, error, isLoading } = useSWR<OMResponse<any[]>>("/api/admin/om/logistics-partners?limit=500", fetcher, {
    revalidateOnFocus: false,
    revalidateIfStale: false,
  });

  return {
    partners: data?.data || [],
    isLoading,
    error,
  };
}

/**
 * Hook to fetch all delivery locations with pagination/params
 */
export function useOMDeliveryLocationsList(params?: string, options: any = {}) {
  const url = `/api/admin/om/delivery-locations${params ? `?${params}` : ""}`;
  const { data, error, isLoading, mutate } = useSWR<OMResponse<any[]>>(url, fetcher, {
    revalidateOnFocus: false,
    revalidateIfStale: false,
    ...options
  });

  return {
    locations: data?.data || [],
    meta: data?.meta,
    error,
    isLoading,
    mutate,
  };
}

/**
 * Hook to fetch all logistics partners with pagination/params
 */
export function useOMLogisticsPartnersList(params?: string, options: any = {}) {
  const url = `/api/admin/om/logistics-partners${params ? `?${params}` : ""}`;
  const { data, error, isLoading, mutate } = useSWR<OMResponse<any[]>>(url, fetcher, {
    revalidateOnFocus: false,
    revalidateIfStale: false,
    ...options
  });

  return {
    partners: data?.data || [],
    meta: data?.meta,
    error,
    isLoading,
    mutate,
  };
}

/**
 * Hook to fetch all brands for options
 */
export function useOMBrands(options: any = {}) {
  const { data, error, isLoading } = useSWR<OMResponse<any[]>>("/api/admin/om/brands?limit=500", fetcher, {
    revalidateOnFocus: false,
    revalidateIfStale: false,
    ...options
  });

  return {
    brands: data?.data || [],
    isLoading,
    error,
  };
}

/**
 * Hook to fetch PO numbers for options
 */
export function useOMPONumbers() {
  const { data, error, isLoading } = useSWR<any[]>("/api/admin/om/purchase-orders/options", fetcher, {
    revalidateOnFocus: false,
    revalidateIfStale: false,
  });

  return {
    poNumbers: data || [],
    isLoading,
    error,
  };
}

/**
 * Hook to fetch products (items)
 */
export function useOMProducts(params?: string, options: any = {}) {
  const url = `/api/admin/om/products${params ? `?${params}` : ""}`;
  const { data, error, isLoading, mutate } = useSWR<OMResponse<any[]>>(url, fetcher, {
    revalidateOnFocus: false,
    revalidateIfStale: false,
    ...options
  });

  return {
    products: data?.data || [],
    meta: data?.meta,
    error,
    isLoading,
    mutate,
  };
}

/**
 * Hook providing a global revalidation function for all Order Management lists.
 * This ensures that a mutation in one area (e.g. Dispatches) 
 * refreshes and shows up-to-date values in others (e.g. Purchase Orders).
 */
export function useOMMutate() {
  const { mutate } = useSWRConfig();

  const revalidateOM = useCallback(() => {
    // Revalidate all keys starting with /api/admin/om/
    // This clears caches for POs, Dispatches, Clients, Items, etc.
    mutate(
      (key: any) => typeof key === "string" && key.startsWith("/api/admin/om/"),
      undefined,
      { revalidate: true }
    );
  }, [mutate]);

  return { revalidateOM };
}
