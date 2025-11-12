"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Loader2,
  Folder
} from 'lucide-react';
import { useCategoryManagement, type ProductCategory } from '@/hooks/use-category-management';
import { toast } from 'sonner';

interface CategoryManagementDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

interface CategoryFormData {
  name: string;
  displayName: string;
  description: string;
  shortCode: string;
}

export function CategoryManagementDialog({ isOpen, onClose }: CategoryManagementDialogProps) {
  const {
    categories,
    isLoading,
    createCategory,
    updateCategory,
    deleteCategory,
    isCreating,
    isUpdating,
    isDeleting,
  } = useCategoryManagement();

  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<CategoryFormData>({
    name: '',
    displayName: '',
    description: '',
    shortCode: '',
  });

  const resetForm = () => {
    setFormData({
      name: '',
      displayName: '',
      description: '',
      shortCode: '',
    });
    setEditingId(null);
    setShowAddForm(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.displayName.trim()) {
      toast.error('Category name is required');
      return;
    }

    // Auto-generate name and shortCode if not provided
    const processedData = {
      ...formData,
      name: formData.name || formData.displayName.toLowerCase().replace(/\s+/g, ''),
      shortCode: formData.shortCode || generateShortCode(formData.displayName),
    };

    let success = false;
    if (editingId) {
      success = await updateCategory(editingId, processedData);
    } else {
      success = await createCategory(processedData);
    }

    if (success) {
      resetForm();
    }
  };

  const handleEdit = (category: ProductCategory) => {
    setFormData({
      name: category.name,
      displayName: category.displayName,
      description: category.description || '',
      shortCode: category.shortCode,
    });
    setEditingId(category.id);
    setShowAddForm(true);
  };

  const handleDelete = async (categoryId: string, categoryName: string) => {
    if (window.confirm(`Are you sure you want to delete the category "${categoryName}"? This action cannot be undone.`)) {
      await deleteCategory(categoryId);
    }
  };

  const generateShortCode = (displayName: string) => {
    const words = displayName.trim().split(/\s+/);
    if (words.length === 1) {
      return words[0].substring(0, 3).toUpperCase();
    } else {
      return words.slice(0, 3).map(word => word[0]).join('').toUpperCase();
    }
  };

  const handleDisplayNameChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      displayName: value,
      name: value.toLowerCase().replace(/\s+/g, ''),
      shortCode: generateShortCode(value),
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader className="pb-4 border-b">
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-xl font-semibold">
                Manage Product Categories
              </DialogTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Add, edit, or delete product categories. Note: Categories with existing products cannot be deleted.
              </p>
            </div>
            <Button
              onClick={() => setShowAddForm(!showAddForm)}
              className="bg-black hover:bg-gray-800 text-white"
              size="sm"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add New Category
            </Button>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto">
          {/* Add/Edit Form */}
          {showAddForm && (
            <div className="p-4 bg-muted/30 border-b">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Input
                      placeholder="Category name (e.g., Basketball)"
                      value={formData.displayName}
                      onChange={(e) => handleDisplayNameChange(e.target.value)}
                      required
                      className="w-full"
                    />
                  </div>
                  <div>
                    <Input
                      placeholder="Short code (e.g., BBL)"
                      value={formData.shortCode}
                      onChange={(e) => setFormData(prev => ({ ...prev, shortCode: e.target.value.toUpperCase() }))}
                      maxLength={10}
                      className="w-full"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button
                      type="submit"
                      disabled={isCreating || isUpdating || !formData.displayName.trim()}
                      size="sm"
                    >
                      {(isCreating || isUpdating) ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : editingId ? (
                        'Update'
                      ) : (
                        'Add'
                      )}
                    </Button>
                    <Button type="button" variant="outline" onClick={resetForm} size="sm">
                      Cancel
                    </Button>
                  </div>
                </div>
              </form>
            </div>
          )}

          {/* Categories List */}
          <div className="p-4">
            <h3 className="text-lg font-medium mb-4">
              Existing Categories ({categories?.length || 0})
            </h3>

            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin" />
                <span className="ml-2">Loading categories...</span>
              </div>
            ) : categories && categories.length > 0 ? (
              <div className="space-y-2">
                {categories.map((category) => (
                  <div
                    key={category.id}
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50"
                  >
                    <div className="flex items-center gap-3">
                      <Folder className="h-4 w-4 text-muted-foreground" />
                      <div className="flex-1">
                        <div className="font-medium">{category.displayName}</div>
                        <div className="text-sm text-muted-foreground">
                          {category._count.products} products
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(category)}
                        disabled={isDeleting}
                        className="text-blue-600 hover:text-blue-700"
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(category.id, category.displayName)}
                        disabled={isDeleting || category._count.products > 0}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Folder className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>No categories found</p>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}