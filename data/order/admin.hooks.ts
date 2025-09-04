import useSWR, { mutate as globalMutate } from "swr";
import useSWRMutation from "swr/mutation";
import { approveOrder, createOrder, deleteOrder, getOrder, getOrders, updateOrder } from "./admin.actions";

/**
 * Hook to fetch a list of orders.
 */
export function useOrders() {
  const { data, error, isLoading, mutate } = useSWR(
    "/api/admin/orders",
    (url) => getOrders(url)
  );

  return {
    orders: data,
    error,
    isLoading,
    mutate,
  };
}

/**
 * Hook to fetch an order by ID
 */
export function useOrder(orderId?: string) {
  const { data, error, isLoading, mutate } = useSWR(
    orderId ? `/api/admin/orders/order?id=${orderId}` : null,
    (url) => getOrder(url, orderId!)
  )

  return {
    order: data,
    error,
    isLoading,
    mutate
  }
}

/**
 * Hook to create a new order.
 */
export function useCreateOrder() {
  const { trigger, isMutating, error } = useSWRMutation(
    "/api/admin/orders/product",
    (url, { arg }: { arg: any }) => createOrder(url, arg),
    {
      onSuccess: () => {
        globalMutate('/api/admin/orders')
      }
    }
  );

  return {
    createOrder: trigger,
    isCreating: isMutating,
    createError: error,
  };
}

/**
 * Hook to update an existing order.
 */
export function useUpdateOrder() {
  const { trigger, isMutating, error } = useSWRMutation(
    "/api/admin/orders/order",
    (url, { arg }: { arg: any }) => updateOrder(url, arg),
    {
      onSuccess: () => {
        globalMutate('/api/admin/orders')
      }
    }
  );

  return {
    updateOrder: trigger,
    isUpdating: isMutating,
    updateError: error,
  };
}

export function useApproveOrder() {
  const { trigger, isMutating, error } = useSWRMutation(
    "/api/admin/orders/order/approve",
    (url, { arg }: { arg: { orderId: string } }) => approveOrder(url, arg.orderId),
    {
      onSuccess: () => {
        globalMutate('/api/admin/orders')
      }
    }
  );

  return {
    approveOrder: trigger,
    isUpdating: isMutating,
    updateError: error,
  };
}

/**
 * Hook to delete a order.
 */
export function useDeleteOrder() {
  const { trigger, isMutating, error } = useSWRMutation(
    "/api/admin/orders/order",
    (url, { arg }: { arg: { id: string } }) => deleteOrder(url, arg.id),
    {
      onSuccess: () => {
        globalMutate('/api/admin/orders')
      }
    }
  );

  return {
    deleteOrder: trigger,
    isDeleting: isMutating,
    deleteError: error,
  };
}
