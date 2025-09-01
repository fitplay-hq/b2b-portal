import useSWR from "swr";
import { getProducts } from "./client.actions";

export function useProducts() {
  const { data, error, isLoading, mutate } = useSWR("/api/clients/products", (url) => getProducts(url));

  return {
    products: data,
    error,
    isLoading,
    mutate,
  };
}
