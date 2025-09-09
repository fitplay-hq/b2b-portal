import useSWR, { mutate as globalMutate } from "swr";
import useSWRMutation from "swr/mutation";
import { createProduct, createProducts, deleteProduct, getProducts, updateInventory, updateProduct, updateBulkInventory } from "./admin.actions";
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
  const { trigger, error, isMutating } = useSWRMutation(
    "/api/admin/products",
    (url, {arg}: {arg: Prisma.ProductCreateInput[]}) => createProducts(url, arg)
  );

  return {
    createProducts: trigger,
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

/**
 * Hook to update product inventory.
 */
export function useUpdateInventory() {
  const { trigger, isMutating, error } = useSWRMutation(
    "/api/admin/products/product/inventory",
    (url, { arg }: { arg: { productId: string; quantity: number; reason: string; direction: 1 | -1 } }) => updateInventory(url, arg),
    {
      onSuccess: () => {
        globalMutate('/api/admin/products')
      }
    }
  );

  return {
    updateInventory: trigger,
    isUpdatingInventory: isMutating,
    updateInventoryError: error,
  };
}

/**
 * Hook to bulk update product inventory.
 * Uses the InventoryUpdateSchema from the API for type safety.
 */
export function useBulkInventory() {
  const { trigger, isMutating, error } = useSWRMutation(
    "/api/admin/products", // PATCH route from the API
    (url, { arg }: {
      arg: Array<{
        productId: string;
        quantity: number;
        direction: "incr" | "dec"; // From API Zod schema
        inventoryUpdateReason: "NEW_PURCHASE" | "PHYSICAL_STOCK_CHECK" | "RETURN_FROM_PREVIOUS_DISPATCH"; // From API Zod schema
      }>
    }) => updateBulkInventory(url, arg),
    {
      onSuccess: () => {
        globalMutate('/api/admin/products') // Refresh products list after update
      }
    }
  );

  return {
    updateBulkInventory: trigger,
    isBulkUpdating: isMutating,
    bulkUpdateError: error,
  };
}
