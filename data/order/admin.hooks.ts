import useSWR, { mutate as globalMutate } from "swr";
import useSWRMutation from "swr/mutation";
import { createOrder, deleteOrder, getOrders, updateOrder } from "./admin.actions";
import { Prisma } from "@/lib/generated/prisma";

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
    "/api/admin/orders/product",
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

/**
 * Hook to delete a order.
 */
export function useDeleteOrder() {
  const { trigger, isMutating, error } = useSWRMutation(
    "/api/admin/orders/product",
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
