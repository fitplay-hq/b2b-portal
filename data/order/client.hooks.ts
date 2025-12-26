import useSWR from "swr";
import useSWRMutation from "swr/mutation";
import { getOrders, createOrder, CreateOrderData } from "./client.actions";

export function useOrders() {
  const { data, error, isLoading, mutate } = useSWR("/api/clients/orders", (url) => getOrders(url));

  return {
    orders: data,
    error,
    isLoading,
    mutate,
  };
}

export function useCreateOrder() {
  const { trigger, isMutating, error } = useSWRMutation(
    "/api/clients/orders/order",
    (url, { arg }: { arg: CreateOrderData }) => createOrder(url, arg)
  );

  return {
    createOrder: trigger,
    isCreating: isMutating,
    error,
  };
}
