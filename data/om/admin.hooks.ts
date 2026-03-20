import useSWR from "swr";
import { OMPurchaseOrder, OMDispatchOrder, OMPaginationMeta } from "@/types/order-management";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

interface OMResponse<T> {
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
  const { data, error, isLoading, mutate } = useSWR<OMResponse<OMPurchaseOrder>>(url, fetcher, {
    revalidateOnFocus: false,
    revalidateIfStale: false,
    ...options
  });

  return {
    purchaseOrder: data?.data,
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
  const { data, error, isLoading, mutate } = useSWR<OMResponse<OMDispatchOrder>>(url, fetcher, {
    revalidateOnFocus: false,
    revalidateIfStale: false,
    ...options
  });

  return {
    dispatch: data?.data,
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
