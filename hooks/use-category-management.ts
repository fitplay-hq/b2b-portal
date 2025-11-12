import { useState, useCallback } from 'react';
import useSWR from 'swr';
import { toast } from 'sonner';

export interface ProductCategory {
  id: string;
  name: string;
  displayName: string;
  description: string | null;
  shortCode: string;
  isActive: boolean;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
  _count: {
    products: number;
  };
}

interface CategoryFormData {
  name: string;
  displayName: string;
  description?: string;
  shortCode: string;
}

interface UseCategoryManagementReturn {
  categories: ProductCategory[] | undefined;
  isLoading: boolean;
  error: Error | null;
  createCategory: (data: CategoryFormData) => Promise<boolean>;
  updateCategory: (id: string, data: CategoryFormData) => Promise<boolean>;
  deleteCategory: (id: string) => Promise<boolean>;
  refreshCategories: () => void;
  isCreating: boolean;
  isUpdating: boolean;
  isDeleting: boolean;
}

const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error('Failed to fetch categories');
  }
  const data = await res.json();
  return data.success ? data.data : [];
};

export function useCategoryManagement(): UseCategoryManagementReturn {
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const {
    data: categories,
    error,
    isLoading,
    mutate: refreshCategories,
  } = useSWR<ProductCategory[]>('/api/admin/categories', fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 30000, // 30 seconds
  });

  const createCategory = useCallback(
    async (data: CategoryFormData): Promise<boolean> => {
      setIsCreating(true);
      try {
        const res = await fetch('/api/admin/categories', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });

        const result = await res.json();

        if (!result.success) {
          toast.error(result.error || 'Failed to create category');
          return false;
        }

        toast.success('Category created successfully');
        await refreshCategories(); // Refresh the list
        return true;
      } catch (error) {
        console.error('Create category error:', error);
        toast.error('Failed to create category');
        return false;
      } finally {
        setIsCreating(false);
      }
    },
    [refreshCategories]
  );

  const updateCategory = useCallback(
    async (id: string, data: CategoryFormData): Promise<boolean> => {
      setIsUpdating(true);
      try {
        const res = await fetch(`/api/admin/categories/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });

        const result = await res.json();

        if (!result.success) {
          toast.error(result.error || 'Failed to update category');
          return false;
        }

        toast.success('Category updated successfully');
        await refreshCategories(); // Refresh the list
        return true;
      } catch (error) {
        console.error('Update category error:', error);
        toast.error('Failed to update category');
        return false;
      } finally {
        setIsUpdating(false);
      }
    },
    [refreshCategories]
  );

  const deleteCategory = useCallback(
    async (id: string): Promise<boolean> => {
      setIsDeleting(true);
      try {
        const res = await fetch(`/api/admin/categories/${id}`, {
          method: 'DELETE',
        });

        const result = await res.json();

        if (!result.success) {
          toast.error(result.error || 'Failed to delete category');
          return false;
        }

        toast.success('Category deleted successfully');
        await refreshCategories(); // Refresh the list
        return true;
      } catch (error) {
        console.error('Delete category error:', error);
        toast.error('Failed to delete category');
        return false;
      } finally {
        setIsDeleting(false);
      }
    },
    [refreshCategories]
  );

  return {
    categories,
    isLoading,
    error,
    createCategory,
    updateCategory,
    deleteCategory,
    refreshCategories,
    isCreating,
    isUpdating,
    isDeleting,
  };
}

// Hook for just fetching categories (for use in forms and filters)
export function useCategories() {
  const { data: categories, error, isLoading } = useSWR<ProductCategory[]>(
    '/api/admin/categories',
    fetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 60000, // 1 minute - categories don't change often
    }
  );

  return {
    categories: categories?.filter(cat => cat.isActive) || [],
    allCategories: categories || [],
    isLoading,
    error,
  };
}