import useSWR, { useSWRConfig } from "swr";
import { useCallback, useEffect } from "react";
import { OMPurchaseOrder, OMDispatchOrder, OMPaginationMeta } from "@/types/order-management";
import { type PaginatedResponse } from "@/lib/om-data";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const EMPTY_ARRAY: any[] = [];

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
    revalidateIfStale: true,
    ...options
  });

  return {
    purchaseOrders: data?.data || EMPTY_ARRAY,
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
  const { cache } = useSWRConfig();
  const url = id ? `/api/admin/om/purchase-orders/${id}` : null;
  
  // Try to find the PO in the list cache (used by OMPurchaseOrdersClient)
  // This allows the detail page to show data instantly while the full version loads
  const listCacheKey = "/api/admin/om/purchase-orders?limit=500";
  const listState = cache.get(listCacheKey) as any;
  // SWR cache.get returns the State object in SWR 2.x
  // State.data is the PaginatedResponse, PaginatedResponse.data is the array
  const listData = listState?.data?.data || listState?.data || [];
  const foundInList = Array.isArray(listData) ? listData.find((po: any) => po.id === id) : null;

  const { data, error, isLoading, mutate } = useSWR<OMPurchaseOrder>(url, fetcher, {
    fallbackData: foundInList,
    revalidateOnFocus: false,
    revalidateIfStale: true,
    ...options
  });

  return {
    purchaseOrder: data,
    error,
    isLoading: !data && isLoading, // Only show loading if we don't even have fallback data
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
    revalidateIfStale: true,
    ...options
  });

  return {
    dispatches: data?.data || EMPTY_ARRAY,
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
  const { cache } = useSWRConfig();
  const url = id ? `/api/admin/om/dispatch-orders/${id}` : null;

  // Try to find the Dispatch in the list cache (used by OMDispatchesClient)
  // This allows the detail page to show data instantly while the full version loads
  const listCacheKey = "/api/admin/om/dispatch-orders?limit=500";
  const listState = cache.get(listCacheKey) as any;
  const listData = listState?.data?.data || listState?.data || [];
  const foundInList = Array.isArray(listData) ? listData.find((d: any) => d.id === id) : null;

  const { data, error, isLoading, mutate } = useSWR<OMDispatchOrder>(url, fetcher, {
    fallbackData: foundInList,
    revalidateOnFocus: false,
    revalidateIfStale: true,
    ...options
  });

  return {
    dispatch: data,
    error,
    isLoading: !data && isLoading, // Only show loading if we don't even have fallback data
    mutate,
  };
}

/**
 * Hook to fetch all clients for options
 */
export function useOMClients() {
  const { data, error, isLoading } = useSWR<OMResponse<any[]>>("/api/admin/om/clients?limit=500", fetcher, {
    revalidateOnFocus: false,
    revalidateIfStale: true,
  });

  return {
    clients: data?.data || EMPTY_ARRAY,
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
    revalidateIfStale: true,
  });

  return {
    locations: data?.data || EMPTY_ARRAY,
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
    revalidateIfStale: true,
  });

  return {
    partners: data?.data || EMPTY_ARRAY,
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
    revalidateIfStale: true,
    ...options
  });

  return {
    locations: data?.data || EMPTY_ARRAY,
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
    revalidateIfStale: true,
    ...options
  });

  return {
    partners: data?.data || EMPTY_ARRAY,
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
    revalidateIfStale: true,
    ...options
  });

  return {
    brands: data?.data || EMPTY_ARRAY,
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
    revalidateIfStale: true,
  });

  return {
    poNumbers: data || EMPTY_ARRAY,
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
    revalidateIfStale: true,
    ...options
  });

  return {
    products: data?.data || EMPTY_ARRAY,
    meta: data?.meta,
    error,
    isLoading,
    mutate,
  };
}

/**
 * Update the status of a purchase order
 */
export async function updateOMPurchaseOrderStatus(id: string, status: string) {
  try {
    const res = await fetch(`/api/admin/om/purchase-orders/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    return res.ok;
  } catch (error) {
    console.error("Error updating PO status:", error);
    return false;
  }
}

/**
 * Hook providing mutation functions for Purchase Orders
 */
export function useMutatePurchaseOrders() {
  const { mutate } = useSWRConfig();
  const { revalidateOM } = useOMMutate();

  const deletePurchaseOrder = useCallback(
    async (id: string) => {
      try {
        const res = await fetch(`/api/admin/om/purchase-orders/${id}`, {
          method: "DELETE",
        });
        if (res.ok) {
          revalidateOM();
          return true;
        }
        return false;
      } catch (error) {
        console.error("Error deleting PO:", error);
        return false;
      }
    },
    [revalidateOM]
  );

  return { deletePurchaseOrder };
}

/**
 * Hook providing mutation functions for Dispatch Orders
 */
export function useMutateDispatches() {
  const { mutate } = useSWRConfig();
  const { revalidateOM } = useOMMutate();

  const updateDispatchStatus = useCallback(
    async (id: string, status: string) => {
      try {
        const res = await fetch(`/api/admin/om/dispatch-orders/${id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status }),
        });
        if (res.ok) {
          revalidateOM();
          return true;
        }
        return false;
      } catch (error) {
        console.error("Error updating dispatch status:", error);
        return false;
      }
    },
    [revalidateOM]
  );

  const deleteDispatch = useCallback(
    async (id: string) => {
      try {
        const res = await fetch(`/api/admin/om/dispatch-orders/${id}`, {
          method: "DELETE",
        });
        if (res.ok) {
          revalidateOM();
          return true;
        }
        return false;
      } catch (error) {
        console.error("Error deleting dispatch:", error);
        return false;
      }
    },
    [revalidateOM]
  );

  return { updateDispatchStatus, deleteDispatch };
}

/**
 * Hook providing mutation functions for Products/Items
 */
export function useMutateItems() {
  const { revalidateOM } = useOMMutate();

  const saveItem = useCallback(
    async (data: any, id?: string) => {
      try {
        const url = id ? `/api/admin/om/products/${id}` : "/api/admin/om/products";
        const method = id ? "PATCH" : "POST";
        const res = await fetch(url, {
          method,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
        if (res.ok) {
          revalidateOM();
          return { success: true };
        }
        const error = await res.json();
        return { success: false, error: error.error || "Failed to save item" };
      } catch (error) {
        console.error("Error saving item:", error);
        return { success: false, error: "Something went wrong" };
      }
    },
    [revalidateOM]
  );

  const deleteItem = useCallback(
    async (id: string) => {
      try {
        const res = await fetch(`/api/admin/om/products/${id}`, {
          method: "DELETE",
        });
        if (res.ok) {
          revalidateOM();
          return true;
        }
        return false;
      } catch (error) {
        console.error("Error deleting item:", error);
        return false;
      }
    },
    [revalidateOM]
  );

  return { saveItem, deleteItem };
}

/**
 * Hook providing mutation functions for Clients
 */
export function useMutateClients() {
  const { revalidateOM } = useOMMutate();

  const saveClient = useCallback(
    async (data: any, id?: string) => {
      try {
        const url = id ? `/api/admin/om/clients/${id}` : "/api/admin/om/clients";
        const method = id ? "PATCH" : "POST";
        const res = await fetch(url, {
          method,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
        if (res.ok) {
          revalidateOM();
          return { success: true };
        }
        const error = await res.json();
        return { success: false, error: error.error || "Failed to save client" };
      } catch (error) {
        console.error("Error saving client:", error);
        return { success: false, error: "Something went wrong" };
      }
    },
    [revalidateOM]
  );

  const deleteClient = useCallback(
    async (id: string) => {
      try {
        const res = await fetch(`/api/admin/om/clients/${id}`, {
          method: "DELETE",
        });
        if (res.ok) {
          revalidateOM();
          return true;
        }
        return false;
      } catch (error) {
        console.error("Error deleting client:", error);
        return false;
      }
    },
    [revalidateOM]
  );

  return { saveClient, deleteClient };
}

/**
 * Hook providing mutation functions for Delivery Locations
 */
export function useMutateLocations() {
  const { revalidateOM } = useOMMutate();

  const saveLocation = useCallback(
    async (name: string, id?: string) => {
      try {
        const url = id ? `/api/admin/om/delivery-locations/${id}` : "/api/admin/om/delivery-locations";
        const method = id ? "PATCH" : "POST";
        const res = await fetch(url, {
          method,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name }),
        });
        if (res.ok) {
          revalidateOM();
          return { success: true };
        }
        const error = await res.json();
        return { success: false, error: error.error || "Failed to save location" };
      } catch (error) {
        console.error("Error saving location:", error);
        return { success: false, error: "Something went wrong" };
      }
    },
    [revalidateOM]
  );

  const deleteLocation = useCallback(
    async (id: string) => {
      try {
        const res = await fetch(`/api/admin/om/delivery-locations/${id}`, {
          method: "DELETE",
        });
        if (res.ok) {
          revalidateOM();
          return true;
        }
        return false;
      } catch (error) {
        console.error("Error deleting location:", error);
        return false;
      }
    },
    [revalidateOM]
  );

  return { saveLocation, deleteLocation };
}

/**
 * Hook providing mutation functions for Logistics Partners
 */
export function useMutatePartners() {
  const { revalidateOM } = useOMMutate();

  const savePartner = useCallback(
    async (data: any, id?: string) => {
      try {
        const url = id ? `/api/admin/om/logistics-partners/${id}` : "/api/admin/om/logistics-partners";
        const method = id ? "PATCH" : "POST";
        const res = await fetch(url, {
          method,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
        if (res.ok) {
          revalidateOM();
          return { success: true };
        }
        const error = await res.json();
        return { success: false, error: error.error || "Failed to save partner" };
      } catch (error) {
        console.error("Error saving partner:", error);
        return { success: false, error: "Something went wrong" };
      }
    },
    [revalidateOM]
  );

  const deletePartner = useCallback(
    async (id: string) => {
      try {
        const res = await fetch(`/api/admin/om/logistics-partners/${id}`, {
          method: "DELETE",
        });
        if (res.ok) {
          revalidateOM();
          return true;
        }
        return false;
      } catch (error) {
        console.error("Error deleting partner:", error);
        return false;
      }
    },
    [revalidateOM]
  );

  return { savePartner, deletePartner };
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

/**
 * Generic SWR cache hook for OM pages.
 * Uses server-provided `initialData` as SWR fallback so that:
 * - First load: server data is used immediately (no extra fetch)
 * - Re-navigation: SWR serves cached data instantly (snappy!)
 * - Background revalidation keeps data fresh
 */
export function useOMSWRCache<T>(
  apiUrl: string | null,
  initialData?: PaginatedResponse<T>
) {
  const { data, mutate } = useSWR<PaginatedResponse<T>>(
    apiUrl,
    fetcher,
    {
      fallbackData: initialData,
      revalidateOnFocus: false,
      revalidateIfStale: true,
      dedupingInterval: 0,
    }
  );

  // Sync SWR cache when server data changes (after router.refresh)
  useEffect(() => {
    if (initialData) {
      mutate(initialData, false);
    }
  }, [initialData, mutate]);

  return data || initialData;
}
