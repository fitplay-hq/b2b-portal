import useSWR from "swr";
import { getProducts } from "./client.actions";

export function useProducts() {
  const { data, error, isLoading, mutate } = useSWR("/api/clients/products", (url) => getProducts(url), {
    // Revalidate every 30 seconds to catch updates faster
    refreshInterval: 30000,
    // Revalidate when window gains focus
    revalidateOnFocus: true,
    // Revalidate when coming back online
    revalidateOnReconnect: true,
    // Dedupe requests within 5 seconds
    dedupingInterval: 5000,
  });

  return {
    products: data,
    error,
    isLoading,
    mutate,
  };
}
