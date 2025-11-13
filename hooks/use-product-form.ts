import { useState, useEffect, useMemo, useRef } from "react";
import { Product, Prisma, Category, Company } from "@/lib/generated/prisma";
import { toast } from "sonner";
import { useCreateProduct, useUpdateProduct } from "@/data/product/admin.hooks";
import { useCompanies } from "@/data/company/admin.hooks";
import { useCategories } from "./use-category-management";

interface UseProductFormProps {
  onSuccess: () => void;
}

export function useProductForm({ onSuccess }: UseProductFormProps) {
  const { createProduct } = useCreateProduct();
  const { updateProduct } = useUpdateProduct();
  const { companies } = useCompanies();
  const { categories } = useCategories();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Refs to track previous values and prevent infinite loops
  const prevCompanyRef = useRef<string>('');
  const prevCategoriesRef = useRef<string>('');

  // Hardcoded maps for short names
  const companyShortMap: Record<string, string> = useMemo(() => ({
    'Github': 'GH',
    // Add more as needed
  }), []);

  // Create dynamic category short map from database categories
  const categoryShortMap: Record<string, string> = useMemo(() => {
    return categories.reduce((acc, category) => {
      acc[category.name] = category.shortCode;
      return acc;
    }, {} as Record<string, string>);
  }, [categories]);

  const [formData, setFormData] = useState({
    name: "",
    company: "",
    companyShort: "",
    categories: "",
    categoryShort: "",
    skuSuffix: "",
    price: "",
    availableStock: "",
    description: "",
    image: "",
  });

  // Auto-set companyShort when company changes
  useEffect(() => {
    if (formData.company !== prevCompanyRef.current) {
      prevCompanyRef.current = formData.company;
      if (formData.company) {
        const company = companies?.find((c: Company) => c.id === formData.company);
        const companyName: string = company?.name || '';
        const short = companyShortMap[companyName] || companyName.slice(0,2).toUpperCase();
        setFormData(prev => ({ ...prev, companyShort: short }));
      } else {
        setFormData(prev => ({ ...prev, companyShort: '' }));
      }
    }
  }, [formData.company, companies, companyShortMap]);

  // Auto-set categoryShort when categories change
  useEffect(() => {
    if (formData.categories !== prevCategoriesRef.current) {
      prevCategoriesRef.current = formData.categories;
      if (formData.categories) {
        const short = categoryShortMap[formData.categories] || formData.categories.slice(0, 3).toUpperCase();
        setFormData(prev => ({ ...prev, categoryShort: short }));
      } else {
        setFormData(prev => ({ ...prev, categoryShort: '' }));
      }
    }
  }, [formData.categories, categoryShortMap]);

  const sku = formData.companyShort && formData.categoryShort && formData.skuSuffix ? `${formData.companyShort}-${formData.categoryShort}-${formData.skuSuffix}` : "";

  const openNewDialog = () => {
    setEditingProduct(null);
    setFormData({
      name: "",
      company: "",
      companyShort: "",
      categories: "",
      categoryShort: "",
      skuSuffix: "",
      price: "",
      availableStock: "",
      description: "",
      image: "",
    });
    setIsDialogOpen(true);
  };

  const openEditDialog = (product: Product) => {
    setEditingProduct(product);

    // Parse SKU into parts
    const skuParts = product.sku.split('-');
    const companyShort = skuParts[0] || '';
    const categoryShort = skuParts[1] || '';
    const skuSuffix = skuParts[2] || '';

    setFormData({
      name: product.name,
      company: "", // TODO: if we have company relation, set it
      companyShort,
      categories: product.categories,
      categoryShort,
      skuSuffix,
      price: product.price?.toString() || "",
      availableStock: product.availableStock.toString(),
      description: product.description,
      image: product.images[0] || "",
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const availableStock = parseInt(formData.availableStock);
    const price = formData.price ? parseInt(formData.price) : undefined;

    if (isNaN(availableStock)) {
      toast.error("Please enter valid numbers for stock.");
      setIsSubmitting(false);
      return;
    }

    if (formData.price && isNaN(price!)) {
      toast.error("Please enter a valid price.");
      setIsSubmitting(false);
      return;
    }

    try {
      // Check if categories are loaded
      if (!categories || categories.length === 0) {
        toast.error("Categories are not loaded yet. Please wait and try again.");
        setIsSubmitting(false);
        return;
      }

      // Find the category based on the selected category name
      const selectedCategory = categories?.find(cat => cat.name === formData.categories);
      
      // Validate that the selected category exists
      if (!selectedCategory && formData.categories) {
        toast.error(`Selected category "${formData.categories}" not found. Please refresh and try again.`);
        setIsSubmitting(false);
        return;
      }

      // Check if the category exists in the old enum (for backward compatibility)
      const isLegacyCategory = ['stationery', 'accessories', 'funAndStickers', 'drinkware', 'apparel', 'travelAndTech', 'books', 'welcomeKit'].includes(formData.categories);

      if (editingProduct) {
        const productUpdateData: Prisma.ProductUpdateInput = {
          id: editingProduct.id,
          name: formData.name,
          sku,
          price,
          availableStock,
          // Only set categories enum field if it's a legacy category
          ...(isLegacyCategory && { categories: formData.categories as Category }),
          category: selectedCategory ? { connect: { id: selectedCategory.id } } : { disconnect: true }, // Set the new relationship
          description: formData.description,
          images: [
            formData.image ||
              "https://static.vecteezy.com/system/resources/thumbnails/004/141/669/small_2x/no-photo-or-blank-image-icon-loading-images-or-missing-image-mark-image-not-available-or-image-coming-soon-sign-simple-nature-silhouette-in-frame-isolated-illustration-vector.jpg",
          ],
          companies: formData.company ? { set: [{ id: formData.company }] } : undefined,
        };
        await updateProduct(productUpdateData);
        toast.success("Product updated successfully!");
      } else {
        const productCreateData: Prisma.ProductCreateInput = {
          name: formData.name,
          sku,
          price,
          availableStock,
          // Only set categories enum field if it's a legacy category
          ...(isLegacyCategory && { categories: formData.categories as Category }),
          category: selectedCategory ? { connect: { id: selectedCategory.id } } : undefined, // Set the new relationship
          description: formData.description,
          images: [
            formData.image ||
              "https://static.vecteezy.com/system/resources/thumbnails/004/141/669/small_2x/no-photo-or-blank-image-icon-loading-images-or-missing-image-mark-image-not-available-or-image-coming-soon-sign-simple-nature-silhouette-in-frame-isolated-illustration-vector.jpg",
          ],
          companies: formData.company ? { connect: [{ id: formData.company }] } : undefined,
        };
        await createProduct(productCreateData);
        toast.success("Product added successfully!");
      }
      onSuccess();
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Product creation error:", error);
      let errorMessage = "An unknown error occurred.";
      
      if (error instanceof Error) {
        errorMessage = error.message;
        console.log("Error message:", errorMessage);
      }
      
      // Show a more user-friendly message
      toast.error(errorMessage.length > 200 ? "Product creation failed. Check console for details." : errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    isDialogOpen,
    setIsDialogOpen,
    isSubmitting,
    editingProduct,
    formData,
    setFormData,
    openNewDialog,
    openEditDialog,
    handleSubmit,
    companies,
  };
}
