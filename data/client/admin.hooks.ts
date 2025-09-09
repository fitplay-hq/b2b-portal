import useSWR, { mutate as globalMutate } from "swr";
import useSWRMutation from "swr/mutation";
import { createClient, deleteClient, getClients, updateClient } from "./admin.actions";
import { Client, Prisma } from "@/lib/generated/prisma";

/**
 * Hook to fetch a list of clients.
 */
export function useClients() {
  const { data, error, isLoading, mutate } = useSWR(
    "/api/admin/clients",
    (url) => getClients(url)
  );

  return {
    clients: data,
    error,
    isLoading,
    mutate,
  };
}

/**
 * Hook to create a new client.
 */
export function useCreateClient() {
  const { trigger, isMutating, error } = useSWRMutation(
    "/api/admin/clients/client",
    (url, { arg }: { arg: Omit<Prisma.ClientCreateInput, 'password' | 'phone' | 'address'> }) => createClient(url, arg),
    {
      onSuccess: () => {
        globalMutate('/api/admin/clients')
      }
    }
  );

  return {
    createClient: trigger,
    isCreating: isMutating,
    createError: error,
  };
}

/**
 * Hook to update an existing client.
 */
export function useUpdateClient() {
  const { trigger, isMutating, error } = useSWRMutation(
    "/api/admin/clients/client",
    (url, { arg }: { arg: Prisma.ClientUpdateInput }) => updateClient(url, arg),
    {
      onSuccess: () => {
        globalMutate('/api/admin/clients')
      }
    }
  );

  return {
    updateClient: trigger,
    isUpdating: isMutating,
    updateError: error,
  };
}

/**
 * Hook to delete a client.
 */
export function useDeleteClient() {
  const { trigger, isMutating, error } = useSWRMutation(
    "/api/admin/clients/client",
    (url, { arg }: { arg: { id: string } }) => deleteClient(url, arg.id),
    {
      onSuccess: () => {
        globalMutate('/api/admin/clients')
      }
    }
  );

  return {
    deleteClient: trigger,
    isDeleting: isMutating,
    deleteError: error,
  };
}
