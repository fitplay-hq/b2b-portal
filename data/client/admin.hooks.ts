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
    (url, { arg }: { arg: Prisma.ClientCreateInput }) => createClient(url, arg),
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
 * Hook to fetch a single client by ID.
 */
export function useClient(clientId: string | null) {
  const { data, error, isLoading, mutate } = useSWR(
    clientId ? `/api/admin/clients/client?clientId=${clientId}` : null,
    async (url) => {
      const response = await fetch(url, { credentials: 'include' });
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Client not found');
        }
        throw new Error(`Failed to fetch client: ${response.status}`);
      }
      const result = await response.json();
      return result.data;
    }
  );

  return {
    client: data,
    error,
    isLoading,
    mutate,
    isClientNotFound: error?.message === 'Client not found',
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
