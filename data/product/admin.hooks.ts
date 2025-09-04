import useSWR, { mutate as globalMutate } from "swr";
import useSWRMutation from "swr/mutation";
import { createProduct, createProducts, deleteProduct, getProducts, updateProduct } from "./admin.actions";
import { Prisma } from "@/lib/generated/prisma";

/**
 * Hook to fetch a list of products.
 */
export function useProducts() {
  const { data, error, isLoading, mutate } = useSWR(
    "/api/admin/products",
    (url) => getProducts(url)
  );

  return {
    products: data,
    error,
    isLoading,
    mutate,
  };
}

/**
 * Hook to create products in bulk.
 */
export function useCreateProducts() {
  const { data, error, isMutating } = useSWRMutation(
    "/api/admin/products",
    (url, {arg}: {arg: Prisma.ProductCreateInput[]}) => createProducts(url, arg)
  );

  return {
    createProducts: data,
    isCreating: isMutating,
    createError: error
  };
}

/**
 * Hook to create a new product.
 */
export function useCreateProduct() {
  const { trigger, isMutating, error } = useSWRMutation(
    "/api/admin/products/product",
    (url, { arg }: { arg: Prisma.ProductCreateInput }) => createProduct(url, arg),
    {
      onSuccess: () => {
        globalMutate('/api/admin/products')
      }
    }
  );

  return {
    createProduct: trigger,
    isCreating: isMutating,
    createError: error,
  };
}

/**
 * Hook to update an existing product.
 */
export function useUpdateProduct() {
  const { trigger, isMutating, error } = useSWRMutation(
    "/api/admin/products/product",
    (url, { arg }: { arg: Prisma.ProductUpdateInput }) => updateProduct(url, arg),
    {
      onSuccess: () => {
        globalMutate('/api/admin/products')
      }
    }
  );

  return {
    updateProduct: trigger,
    isUpdating: isMutating,
    updateError: error,
  };
}

/**
 * Hook to delete a product.
 */
export function useDeleteProduct() {
  const { trigger, isMutating, error } = useSWRMutation(
    "/api/admin/products/product",
    (url, { arg }: { arg: { id: string } }) => deleteProduct(url, arg.id),
    {
      onSuccess: () => {
        globalMutate('/api/admin/products')
      }
    }
  );

  return {
    deleteProduct: trigger,
    isDeleting: isMutating,
    deleteError: error,
  };
}
