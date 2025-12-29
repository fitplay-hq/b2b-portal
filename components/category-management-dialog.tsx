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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Loader2,
  Folder,
  ChevronDown,
  ChevronRight
} from 'lucide-react';
import { useCategoryManagement, type ProductCategory } from '@/hooks/use-category-management';
import { useSubcategoryManagement, type SubCategory } from '@/hooks/use-subcategory-management';
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

interface SubcategoryFormData {
  name: string;
  categoryId: string;
  shortCode: string;
}

type FormMode = 'category' | 'subcategory';

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

  const {
    subcategories,
    getSubcategoriesByCategory,
    createSubcategory,
    updateSubcategory,
    deleteSubcategory,
    isCreating: isCreatingSubcategory,
    isUpdating: isUpdatingSubcategory,
    isDeleting: isDeletingSubcategory,
  } = useSubcategoryManagement();

  const [showAddForm, setShowAddForm] = useState(false);
  const [formMode, setFormMode] = useState<FormMode>('category');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const [deleteConfirm, setDeleteConfirm] = useState<{ type: 'category' | 'subcategory'; id: string; name: string } | null>(null);
  
  const [categoryFormData, setCategoryFormData] = useState<CategoryFormData>({
    name: '',
    displayName: '',
    description: '',
    shortCode: '',
  });

  const [subcategoryFormData, setSubcategoryFormData] = useState<SubcategoryFormData>({
    name: '',
    categoryId: '',
    shortCode: '',
  });

  const resetForm = () => {
    setCategoryFormData({
      name: '',
      displayName: '',
      description: '',
      shortCode: '',
    });
    setSubcategoryFormData({
      name: '',
      categoryId: '',
      shortCode: '',
    });
    setEditingId(null);
    setShowAddForm(false);
    setFormMode('category');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formMode === 'category') {
      if (!categoryFormData.displayName.trim()) {
        toast.error('Category name is required');
        return;
      }

      const processedData = {
        ...categoryFormData,
        name: categoryFormData.name || categoryFormData.displayName.toLowerCase().replace(/\s+/g, ''),
        shortCode: categoryFormData.shortCode || generateShortCode(categoryFormData.displayName),
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
    } else {
      // Subcategory form
      if (!subcategoryFormData.name.trim()) {
        toast.error('Subcategory name is required');
        return;
      }
      if (!subcategoryFormData.categoryId) {
        toast.error('Please select a category');
        return;
      }

      const processedData = {
        ...subcategoryFormData,
        shortCode: subcategoryFormData.shortCode || generateShortCode(subcategoryFormData.name),
      };

      let success = false;
      if (editingId) {
        success = await updateSubcategory(editingId, processedData);
      } else {
        success = await createSubcategory(processedData);
      }

      if (success) {
        resetForm();
      }
    }
  };

  const handleEdit = (category: ProductCategory) => {
    setCategoryFormData({
      name: category.name,
      displayName: category.displayName,
      description: category.description || '',
      shortCode: category.shortCode,
    });
    setEditingId(category.id);
    setFormMode('category');
    setShowAddForm(true);
  };

  const handleEditSubcategory = (subcategory: SubCategory) => {
    setSubcategoryFormData({
      name: subcategory.name,
      categoryId: subcategory.categoryId,
      shortCode: subcategory.shortCode,
    });
    setEditingId(subcategory.id);
    setFormMode('subcategory');
    setShowAddForm(true);
  };

  const handleDelete = (categoryId: string, categoryName: string) => {
    setDeleteConfirm({ type: 'category', id: categoryId, name: categoryName });
  };

  const handleDeleteSubcategory = (subcategoryId: string, subcategoryName: string) => {
    setDeleteConfirm({ type: 'subcategory', id: subcategoryId, name: subcategoryName });
  };

  const confirmDelete = async () => {
    if (!deleteConfirm) return;
    
    try {
      if (deleteConfirm.type === 'category') {
        await deleteCategory(deleteConfirm.id);
      } else {
        await deleteSubcategory(deleteConfirm.id);
      }
    } finally {
      setDeleteConfirm(null);
    }
  };

  const toggleCategoryExpanded = (categoryId: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedCategories(newExpanded);
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
    setCategoryFormData(prev => ({
      ...prev,
      displayName: value,
      name: value.toLowerCase().replace(/\s+/g, ''),
      shortCode: generateShortCode(value),
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) {
        onClose();
      }
    }}>
      <DialogContent className="w-[95vw] sm:w-[85vw] lg:w-[70vw] max-w-6xl mx-2 sm:mx-4 max-h-[90vh] p-3 sm:p-6 gap-0 overflow-hidden flex flex-col" onPointerDownOutside={(e) => e.preventDefault()} onEscapeKeyDown={(e) => e.preventDefault()}>
        <DialogHeader className="pb-3 sm:pb-4 border-b shrink-0">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
            <div className="flex-1">
              <DialogTitle className="text-lg sm:text-xl lg:text-2xl font-semibold leading-tight">
                Manage Product Categories & Subcategories
              </DialogTitle>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                Add, edit, or delete product categories and subcategories.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 shrink-0">
              <Button
                onClick={() => {
                  setFormMode('category');
                  setEditingId(null);
                  setCategoryFormData({ name: '', displayName: '', description: '', shortCode: '' });
                  setShowAddForm(true);
                }}
                className="bg-black hover:bg-gray-800 text-white w-full sm:w-auto text-xs sm:text-sm"
                size="sm"
              >
                <Plus className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Add New Category</span>
                <span className="sm:hidden">Category</span>
              </Button>
              <Button
                onClick={() => {
                  setFormMode('subcategory');
                  setEditingId(null);
                  setSubcategoryFormData({ name: '', categoryId: '', shortCode: '' });
                  setShowAddForm(true);
                }}
                className="bg-gray-600 hover:bg-gray-700 text-white w-full sm:w-auto text-xs sm:text-sm"
                size="sm"
              >
                <Plus className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Add Subcategory</span>
                <span className="sm:hidden">Subcategory</span>
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto">
          {/* Add/Edit Form */}
          {showAddForm && (
            <div className="p-3 sm:p-6 bg-muted/30 border-b shrink-0">
              <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
                {formMode === 'category' ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
                    <div>
                      <Input
                        placeholder="Category name (e.g., CATALOGUE PRODUCTS)"
                        value={categoryFormData.displayName}
                        onChange={(e) => handleDisplayNameChange(e.target.value)}
                        required
                        className="w-full"
                      />
                    </div>
                    <div>
                      <Input
                        placeholder="Short code (e.g., CAT)"
                        value={categoryFormData.shortCode}
                        onChange={(e) => setCategoryFormData(prev => ({ ...prev, shortCode: e.target.value.toUpperCase() }))}
                        maxLength={10}
                        className="w-full"
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button
                        type="submit"
                        disabled={isCreating || isUpdating || !categoryFormData.displayName.trim()}
                        size="sm"
                        className="flex-1"
                      >
                        {(isCreating || isUpdating) ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : editingId ? (
                          'Update'
                        ) : (
                          'Add'
                        )}
                      </Button>
                      <Button type="button" variant="outline" onClick={resetForm} size="sm" className="flex-1">
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
                    <div>
                      <Select
                        value={subcategoryFormData.categoryId}
                        onValueChange={(value) =>
                          setSubcategoryFormData(prev => ({ ...prev, categoryId: value }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories?.map((category) => (
                            <SelectItem key={category.id} value={category.id}>
                              {category.displayName}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Input
                        placeholder="Subcategory name"
                        value={subcategoryFormData.name}
                        onChange={(e) => setSubcategoryFormData(prev => ({ ...prev, name: e.target.value }))}
                        required
                        className="w-full"
                      />
                    </div>
                    <div>
                      <Input
                        placeholder="Short code"
                        value={subcategoryFormData.shortCode}
                        onChange={(e) => setSubcategoryFormData(prev => ({ ...prev, shortCode: e.target.value.toUpperCase() }))}
                        maxLength={10}
                        className="w-full"
                      />
                    </div>
                    <Button
                      type="submit"
                      disabled={isCreatingSubcategory || isUpdatingSubcategory || !subcategoryFormData.name.trim() || !subcategoryFormData.categoryId}
                      size="sm"
                      className="lg:col-span-1"
                    >
                      {(isCreatingSubcategory || isUpdatingSubcategory) ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : editingId ? (
                        'Update'
                      ) : (
                        'Add'
                      )}
                    </Button>
                    <Button type="button" variant="outline" onClick={resetForm} size="sm" className="lg:col-span-1">
                      Cancel
                    </Button>
                  </div>
                )}
              </form>
            </div>
          )}

          {/* Content Display */}
          <div className="flex-1 overflow-y-auto min-h-0">
            <div className="p-3 sm:p-6">
            {formMode === 'category' ? (
              <>
                <h3 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6">
                  Categories ({categories?.length || 0})
                </h3>

                {isLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="h-6 w-6 animate-spin mr-2" />
                    <span>Loading categories...</span>
                  </div>
                ) : categories && categories.length > 0 ? (
                  <div className="grid grid-cols-1 gap-2 sm:gap-3">
                    {categories.map((category) => {
                      const categorySubcategories = getSubcategoriesByCategory(category.id);
                      const isExpanded = expandedCategories.has(category.id);
                      const hasSubcategories = categorySubcategories && categorySubcategories.length > 0;

                      return (
                        <div key={category.id}>
                          <div className="flex items-center justify-between p-3 sm:p-4 border rounded-lg hover:bg-muted/50 gap-2 sm:gap-3">
                            <div className="flex items-center gap-3 flex-1 min-w-0">
                              {hasSubcategories && (
                                <button
                                  onClick={() => toggleCategoryExpanded(category.id)}
                                  className="p-1 hover:bg-muted rounded shrink-0"
                                >
                                  {isExpanded ? (
                                    <ChevronDown className="h-5 w-5" />
                                  ) : (
                                    <ChevronRight className="h-5 w-5" />
                                  )}
                                </button>
                              )}
                              {!hasSubcategories && <div className="w-6 shrink-0" />}
                              <Folder className="h-5 w-5 text-muted-foreground shrink-0" />
                              <div className="flex-1 min-w-0">
                                <div className="font-semibold text-base">
                                  {category.displayName}
                                  <span className="text-xs font-normal text-muted-foreground ml-2 bg-muted px-2 py-0.5 rounded">
                                    {category.shortCode}
                                  </span>
                                </div>
                                <div className="text-sm text-muted-foreground">
                                  {category._count.products} products
                                  {hasSubcategories && ` • ${categorySubcategories.length} subcategories`}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-1 shrink-0">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleEdit(category)}
                                disabled={isDeleting}
                                className="text-blue-600 hover:text-blue-700 px-1 sm:px-2 text-xs sm:text-sm"
                              >
                                <Edit className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-1" />
                                <span className="hidden sm:inline">Edit</span>
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDelete(category.id, category.displayName)}
                                disabled={isDeleting || category._count.products > 0}
                                className="text-red-600 hover:text-red-700 px-1 sm:px-2 text-xs sm:text-sm"
                              >
                                <Trash2 className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-1" />
                                <span className="hidden sm:inline">Delete</span>
                              </Button>
                            </div>
                          </div>

                          {/* Subcategories */}
                          {isExpanded && hasSubcategories && (
                            <div className="ml-8 mt-3 space-y-2 border-l-2 border-muted pl-4">
                              {categorySubcategories.map((subcategory) => (
                                <div
                                  key={subcategory.id}
                                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 bg-muted/20 gap-4"
                                >
                                  <div className="flex items-center gap-3 flex-1 min-w-0">
                                    <Folder className="h-4 w-4 text-muted-foreground opacity-60 shrink-0" />
                                    <div className="flex-1 min-w-0">
                                      <div className="font-medium">{subcategory.name}</div>
                                      <div className="text-xs text-muted-foreground">Code: {subcategory.shortCode}</div>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-2 shrink-0">
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => handleEditSubcategory(subcategory)}
                                      disabled={isDeletingSubcategory}
                                      className="text-blue-600 hover:text-blue-700"
                                    >
                                      <Edit className="h-4 w-4" />
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => handleDeleteSubcategory(subcategory.id, subcategory.name)}
                                      disabled={isDeletingSubcategory}
                                      className="text-red-600 hover:text-red-700"
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    <Folder className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p className="text-lg">No categories found</p>
                  </div>
                )}
              </>
            ) : (
              <>
                <h3 className="text-xl font-semibold mb-6">
                  All Subcategories ({subcategories?.length || 0})
                </h3>

                {isLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="h-6 w-6 animate-spin mr-2" />
                    <span>Loading subcategories...</span>
                  </div>
                ) : subcategories && subcategories.length > 0 ? (
                  <div className="grid grid-cols-1 gap-3">
                    {subcategories.map((subcategory) => {
                      const parentCategory = categories?.find(c => c.id === subcategory.categoryId);
                      return (
                        <div
                          key={subcategory.id}
                          className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 gap-4"
                        >
                          <div className="flex items-center gap-4 flex-1 min-w-0">
                            <Folder className="h-5 w-5 text-muted-foreground shrink-0" />
                            <div className="flex-1 min-w-0">
                              <div className="font-semibold">{subcategory.name}</div>
                              <div className="text-sm text-muted-foreground">
                                Parent: <span className="font-medium text-foreground">{parentCategory?.displayName || 'Unknown'}</span> • Code: <span className="font-mono font-medium">{subcategory.shortCode}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEditSubcategory(subcategory)}
                              disabled={isDeletingSubcategory}
                              className="text-blue-600 hover:text-blue-700"
                            >
                              <Edit className="h-4 w-4 mr-1" />
                              Edit
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteSubcategory(subcategory.id, subcategory.name)}
                              disabled={isDeletingSubcategory}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4 mr-1" />
                              Delete
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    <Folder className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p className="text-lg">No subcategories found</p>
                  </div>
                )}
              </>
            )}
            </div>
          </div>
        </div>
      </DialogContent>

      {deleteConfirm && (
        <Dialog open={!!deleteConfirm} onOpenChange={(open) => {
          if (!open) setDeleteConfirm(null);
        }}>
          <DialogContent className="max-w-sm" onPointerDownOutside={(e) => e.preventDefault()}>
            <DialogHeader>
              <DialogTitle className="text-lg">
                Delete {deleteConfirm.type === 'category' ? 'Category' : 'Subcategory'}?
              </DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <p className="text-sm text-muted-foreground mb-4">
                Are you sure you want to delete <strong>"{deleteConfirm.name}"</strong>? This action cannot be undone.
              </p>
            </div>
            <div className="flex gap-3 justify-end">
              <Button
                variant="outline"
                onClick={() => setDeleteConfirm(null)}
                disabled={isDeleting || isDeletingSubcategory}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={confirmDelete}
                disabled={isDeleting || isDeletingSubcategory}
              >
                {isDeleting || isDeletingSubcategory ? 'Deleting...' : 'Delete'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </Dialog>
  );
}