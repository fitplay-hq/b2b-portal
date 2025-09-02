import useSWR from "swr";
import { getOrders } from "./client.actions";

export function useOrders() {
  const { data, error, isLoading, mutate } = useSWR("/api/clients/orders", (url) => getOrders(url));

  return {
    orders: data,
    error,
    isLoading,
    mutate,
  };
}
