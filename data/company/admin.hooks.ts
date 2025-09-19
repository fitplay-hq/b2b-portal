import useSWR, { mutate as globalMutate } from "swr";
import useSWRMutation from "swr/mutation";
import { createCompany, deleteCompany, getCompanies, updateCompany } from "./admin.actions";
import { Company } from "@/lib/generated/prisma";

/**
 * Hook to fetch a list of companies.
 */
export function useCompanies() {
  const { data, error, isLoading, mutate } = useSWR(
    "/api/admin/companies",
    (url) => getCompanies(url)
  );

  return {
    companies: data,
    error,
    isLoading,
    mutate,
  };
}

/**
 * Hook to create a new company.
 */
export function useCreateCompany() {
  const { trigger, isMutating, error } = useSWRMutation(
    "/api/admin/companies",
    (url, { arg }: { arg: { name: string; address: string } }) => createCompany(url, arg),
    {
      onSuccess: () => {
        globalMutate('/api/admin/companies')
      }
    }
  );

  return {
    createCompany: trigger,
    isCreating: isMutating,
    createError: error,
  };
}

/**
 * Hook to update an existing company.
 */
export function useUpdateCompany() {
  const { trigger, isMutating, error } = useSWRMutation(
    "update-company",
    (key, { arg }: { arg: { id: string; name: string; address: string } }) => updateCompany(arg),
    {
      onSuccess: (data, key) => {
        globalMutate('/api/admin/companies')
        // The specific company cache will be invalidated when needed
      }
    }
  );

  return {
    updateCompany: trigger,
    isUpdating: isMutating,
    updateError: error,
  };
}

/**
 * Hook to fetch a single company by ID.
 */
export function useCompany(companyId: string | null) {
  const { data, error, isLoading, mutate } = useSWR(
    companyId ? `/api/admin/companies/${companyId}` : null,
    async (url) => {
      const response = await fetch(url, { credentials: 'include' });
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Company not found');
        }
        throw new Error(`Failed to fetch company: ${response.status}`);
      }
      const result = await response.json();
      return result.data;
    }
  );

  return {
    company: data,
    error,
    isLoading,
    mutate,
    isCompanyNotFound: error?.message === 'Company not found',
  };
}

/**
 * Hook to delete a company.
 */
export function useDeleteCompany() {
  const { trigger, isMutating, error } = useSWRMutation(
    (arg: string) => `/api/admin/companies/${arg}`,
    (url, { arg }) => deleteCompany(arg),
    {
      onSuccess: (data, key) => {
        globalMutate('/api/admin/companies')
        globalMutate(key)
      }
    }
  );

  return {
    deleteCompany: trigger,
    isDeleting: isMutating,
    deleteError: error,
  };
}