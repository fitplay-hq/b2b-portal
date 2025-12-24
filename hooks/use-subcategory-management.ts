import { useState, useCallback } from 'react';
import useSWR from 'swr';
import { toast } from 'sonner';

export interface SubCategory {
  id: string;
  name: string;
  categoryId: string;
  shortCode: string;
  createdAt: Date;
  updatedAt: Date;
}

interface SubcategoryFormData {
  name: string;
  categoryId: string;
  shortCode: string;
}

interface UseSubcategoryManagementReturn {
  subcategories: SubCategory[] | undefined;
  isLoading: boolean;
  error: Error | null;
  getSubcategoriesByCategory: (categoryId: string) => SubCategory[] | undefined;
  createSubcategory: (data: SubcategoryFormData) => Promise<boolean>;
  updateSubcategory: (id: string, data: SubcategoryFormData) => Promise<boolean>;
  deleteSubcategory: (id: string) => Promise<boolean>;
  refreshSubcategories: () => void;
  isCreating: boolean;
  isUpdating: boolean;
  isDeleting: boolean;
}

const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error('Failed to fetch subcategories');
  }
  const data = await res.json();
  return data.success ? data.data : [];
};

export function useSubcategoryManagement(): UseSubcategoryManagementReturn {
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const {
    data: subcategories,
    error,
    isLoading,
    mutate: refreshSubcategories,
  } = useSWR<SubCategory[]>('/api/admin/subcategories', fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 30000, // 30 seconds
  });

  const getSubcategoriesByCategory = useCallback(
    (categoryId: string): SubCategory[] | undefined => {
      if (!subcategories) return undefined;
      return subcategories.filter((sub) => sub.categoryId === categoryId);
    },
    [subcategories]
  );

  const createSubcategory = useCallback(
    async (data: SubcategoryFormData): Promise<boolean> => {
      setIsCreating(true);
      try {
        const res = await fetch('/api/admin/subcategories', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });

        const result = await res.json();

        if (!result.success) {
          toast.error(result.error || 'Failed to create subcategory');
          return false;
        }

        toast.success('Subcategory created successfully');
        await refreshSubcategories(); // Refresh the list
        return true;
      } catch (error) {
        console.error('Create subcategory error:', error);
        toast.error('Failed to create subcategory');
        return false;
      } finally {
        setIsCreating(false);
      }
    },
    [refreshSubcategories]
  );

  const updateSubcategory = useCallback(
    async (id: string, data: SubcategoryFormData): Promise<boolean> => {
      setIsUpdating(true);
      try {
        const res = await fetch(`/api/admin/subcategories/subcategory/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });

        const result = await res.json();

        if (!result.success) {
          toast.error(result.error || 'Failed to update subcategory');
          return false;
        }

        toast.success('Subcategory updated successfully');
        await refreshSubcategories(); // Refresh the list
        return true;
      } catch (error) {
        console.error('Update subcategory error:', error);
        toast.error('Failed to update subcategory');
        return false;
      } finally {
        setIsUpdating(false);
      }
    },
    [refreshSubcategories]
  );

  const deleteSubcategory = useCallback(
    async (id: string): Promise<boolean> => {
      setIsDeleting(true);
      try {
        const res = await fetch(`/api/admin/subcategories/subcategory/${id}`, {
          method: 'DELETE',
        });

        const result = await res.json();

        if (!result.success) {
          toast.error(result.error || 'Failed to delete subcategory');
          return false;
        }

        toast.success('Subcategory deleted successfully');
        await refreshSubcategories(); // Refresh the list
        return true;
      } catch (error) {
        console.error('Delete subcategory error:', error);
        toast.error('Failed to delete subcategory');
        return false;
      } finally {
        setIsDeleting(false);
      }
    },
    [refreshSubcategories]
  );

  return {
    subcategories,
    isLoading,
    error: error || null,
    getSubcategoriesByCategory,
    createSubcategory,
    updateSubcategory,
    deleteSubcategory,
    refreshSubcategories,
    isCreating,
    isUpdating,
    isDeleting,
  };
}
