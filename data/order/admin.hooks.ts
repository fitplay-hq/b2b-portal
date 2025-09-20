import useSWR, { mutate as globalMutate } from "swr";
import useSWRMutation from "swr/mutation";
import { updateOrderStatus, createOrder, deleteOrder, getOrder, getOrders, updateOrder, sendOrderEmail } from "./admin.actions";
import { $Enums, Prisma } from "@/lib/generated/prisma";

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
    "/api/admin/orders/order",
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

export function useUpdateOrderStatus() {
  const { trigger, isMutating, error } = useSWRMutation(
    "/api/admin/orders/order/approve",
    (url, { arg }: { arg: { orderId: string, status: $Enums.Status, consignmentNumber?: string, deliveryService?: string } }) => updateOrderStatus(url, arg),
    {
      onSuccess: () => {
        globalMutate('/api/admin/orders')
      }
    }
  );

  return {
    updateOrderStatus: trigger,
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

export function useSendOrderEmail() {
  const { trigger, isMutating, error } = useSWRMutation(
    "/api/admin/orders/send-email",
    (url, { arg }: { arg: { orderId: string; clientEmail: string } }) => sendOrderEmail(url, arg),
    {
      onSuccess: () => {
        globalMutate('/api/admin/orders')
      }
    }
  );

  return {
    sendOrderEmail: trigger,
    isSending: isMutating,
    sendError: error,
  };
}
