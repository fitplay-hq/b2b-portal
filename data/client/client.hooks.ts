import useSWR from "swr";
import { getClients } from "./client.actions";

export function useClients() {
  const { data, error, isLoading, mutate } = useSWR("/api/clients/clients", (url) => getClients(url));

  return {
    clients: data,
    error,
    isLoading,
    mutate,
  };
}
