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
export function useOMPurchaseOrders(params?: string) {
  const url = `/api/admin/om/purchase-orders${params ? `?${params}` : ""}`;
  const { data, error, isLoading, mutate } = useSWR<OMResponse<OMPurchaseOrder[]>>(url, fetcher);

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
export function useOMPurchaseOrder(id?: string) {
  const url = id ? `/api/admin/om/purchase-orders/${id}` : null;
  const { data, error, isLoading, mutate } = useSWR<OMResponse<OMPurchaseOrder>>(url, fetcher);

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
export function useOMDispatches(params?: string) {
  const url = `/api/admin/om/dispatch-orders${params ? `?${params}` : ""}`;
  const { data, error, isLoading, mutate } = useSWR<OMResponse<OMDispatchOrder[]>>(url, fetcher);

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
export function useOMDispatch(id?: string) {
  const url = id ? `/api/admin/om/dispatch-orders/${id}` : null;
  const { data, error, isLoading, mutate } = useSWR<OMResponse<OMDispatchOrder>>(url, fetcher);

  return {
    dispatch: data?.data,
    error,
    isLoading,
    mutate,
  };
}
