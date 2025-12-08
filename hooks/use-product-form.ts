import { useState, useEffect, useRef } from "react";
import { Product, Category, Company } from "@/lib/generated/prisma";
import { toast } from "sonner";
import { useCreateProduct, useUpdateProduct, useProducts } from "@/data/product/admin.hooks";
import { useCompanies } from "@/data/company/admin.hooks";
import { useCategories } from "./use-category-management";

type ProductWithCompanies = Product & {
  companies: Company[];
};

interface UseProductFormProps {
  onSuccess: () => void;
}



export function useProductForm({ onSuccess }: UseProductFormProps) {
  const { createProduct } = useCreateProduct();
  const { updateProduct } = useUpdateProduct();
  const { companies } = useCompanies();
  const { products } = useProducts();
  const { categories } = useCategories();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Note: companyShortMap is now created directly in the useEffect to avoid dependency issues

  // Note: categoryShortMap is now created directly in the useEffect to avoid dependency issues

  // Refs to track previous values and prevent infinite loops
  const prevCompanyRef = useRef<string>('');
  const prevCategoriesRef = useRef<string>('');

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
        const company = companies?.find((c: { id: string; name: string }) => c.id === formData.company);
        const companyName: string = company?.name || '';
        console.log('Selected company:', companyName);
        
        // Create map directly in the effect to avoid dependency issues
        const dynamicCompanyShortMap: Record<string, string> = {
          'Github': 'GH',
          // Add more as needed
        };
        
        // Try exact match first, then fallback to auto-generation
        let short = dynamicCompanyShortMap[companyName];
        if (!short) {
          // Auto-generate from company name: take first 2-3 characters
          short = companyName.replace(/[^A-Za-z]/g, '').slice(0, 3).toUpperCase();
        }
        console.log('Generated company short:', short);
        setFormData(prev => ({ ...prev, companyShort: short }));
      } else {
        setFormData(prev => ({ ...prev, companyShort: '' }));
      }
    }
  }, [formData.company, companies]);

  // Auto-set categoryShort when categories change
  useEffect(() => {
    if (formData.categories !== prevCategoriesRef.current) {
      prevCategoriesRef.current = formData.categories;
      if (formData.categories) {
        console.log('Selected category:', formData.categories);
        
        // Create map directly in the effect to avoid dependency issues
        const dynamicCategoryShortMap = categories.reduce((acc, category) => {
          acc[category.name] = category.shortCode;
          return acc;
        }, {} as Record<string, string>);
        
        // Try exact match first, then fallback to auto-generation
        let short = dynamicCategoryShortMap[formData.categories];
        if (!short) {
          // Auto-generate from category name: take first 3 characters, remove underscores
          short = formData.categories.replace(/[^A-Za-z]/g, '').slice(0, 3).toUpperCase();
        }
        console.log('Generated category short:', short);
        setFormData(prev => ({ ...prev, categoryShort: short }));
      } else {
        setFormData(prev => ({ ...prev, categoryShort: '' }));
      }
    }
  }, [formData.categories, categories]);

  // Auto-generate SKU suffix when both companyShort and categoryShort are available
  useEffect(() => {
    // Only generate for new products (not editing) and when we have both company and category
    if (formData.companyShort && formData.categoryShort && !editingProduct) {
      console.log('🔧 SKU Generation triggered');
      console.log('Company Short:', formData.companyShort);
      console.log('Category Short:', formData.categoryShort);
      console.log('Products loaded:', !!products);
      console.log('Products count:', products?.length || 0);
      
      if (!products) {
        console.log('⏳ Products not loaded yet, skipping SKU generation');
        return;
      }

      // Find existing products with same company-category prefix
      const skuPrefix = `${formData.companyShort}-${formData.categoryShort}`;
      console.log('🎯 SKU Prefix:', skuPrefix);
      
      // Filter products that match our prefix and extract numeric suffixes
      const matchingProducts = products.filter(product => 
        product.sku && product.sku.startsWith(skuPrefix + '-')
      );
      
      console.log('📋 Matching products:', matchingProducts.map(p => ({ name: p.name, sku: p.sku })));
      
      const existingSKUs = matchingProducts
        .map(product => {
          const parts = product.sku.split('-');
          // Make sure we have exactly 3 parts and the third part is numeric
          if (parts.length === 3) {
            const suffix = parts[2];
            const num = parseInt(suffix, 10);
            return !isNaN(num) ? num : 0;
          }
          return 0;
        })
        .filter(num => num > 0); // Only keep valid numbers > 0

      console.log('🔢 Existing numeric suffixes:', existingSKUs);
      console.log(`📊 Found ${existingSKUs.length} existing products with prefix "${skuPrefix}"`);

      // Find the next available number
      const nextNumber = existingSKUs.length === 0 ? 1 : Math.max(...existingSKUs) + 1;
      const paddedNumber = nextNumber.toString().padStart(3, '0');
      
      console.log('✨ Generated suffix:', paddedNumber, `(next after ${existingSKUs.length} existing products)`);
      setFormData(prev => ({ ...prev, skuSuffix: paddedNumber }));
    }
  }, [formData.companyShort, formData.categoryShort, products, editingProduct]);

  // Force regenerate SKU suffix when company or category changes (even if suffix already exists)
  useEffect(() => {
    if (formData.companyShort && formData.categoryShort && !editingProduct && products && 
        (prevCompanyRef.current !== formData.company || prevCategoriesRef.current !== formData.categories)) {
      // Clear the suffix first to trigger regeneration
      setFormData(prev => ({ ...prev, skuSuffix: '' }));
    }
  }, [formData.company, formData.categories, formData.companyShort, formData.categoryShort, products, editingProduct]);

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

  const openEditDialog = (product: ProductWithCompanies) => {
    setEditingProduct(product);

    // Parse SKU into parts
    const skuParts = product.sku.split('-');
    const companyShort = skuParts[0] || '';
    const categoryShort = skuParts[1] || '';
    const skuSuffix = skuParts[2] || '';

    // Get the first company associated with the product (if any)
    const associatedCompany = product.companies?.[0]?.id || "";

    setFormData({
      name: product.name,
      company: associatedCompany,
      companyShort,
      categories: product.categories || "",
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
      // Find the selected category from the database categories
      const selectedCategory = categories.find(cat => cat.name === formData.categories);
      
      // Check if it's a legacy category (exists in enum)
      const isLegacyCategory = ['stationery', 'accessories', 'funAndStickers', 'drinkware', 'apparel', 'travelAndTech', 'books', 'welcomeKit'].includes(formData.categories);

      if (editingProduct) {
        // Prepare the data for the API (not Prisma format)
        const productUpdateData: any = {
          id: editingProduct.id,
          name: formData.name,
          sku,
          price,
          // Don't send availableStock for updates - use inventory management instead
          // Only set categories enum field if it's a legacy category
          ...(isLegacyCategory && { categories: formData.categories as Category }),
          categoryId: selectedCategory?.id, // Send categoryId directly
          categories: formData.categories, // Send category name for API lookup
          description: formData.description,
          images: [
            formData.image ||
              "https://static.vecteezy.com/system/resources/thumbnails/004/141/669/small_2x/no-photo-or-blank-image-icon-loading-images-or-missing-image-mark-image-not-available-or-image-coming-soon-sign-simple-nature-silhouette-in-frame-isolated-illustration-vector.jpg",
          ],
        };
        await updateProduct(productUpdateData as any);
        toast.success("Product updated successfully!");
      } else {
        // Prepare the data for the API (not Prisma format)
        const productCreateData = {
          name: formData.name,
          sku,
          price,
          availableStock,
          // Only set categories enum field if it's a legacy category
          ...(isLegacyCategory && { categories: formData.categories as Category }),
          categoryId: selectedCategory?.id, // Send categoryId directly
          categories: formData.categories, // Send category name for API lookup
          description: formData.description,
          images: [
            formData.image ||
              "https://static.vecteezy.com/system/resources/thumbnails/004/141/669/small_2x/no-photo-or-blank-image-icon-loading-images-or-missing-image-mark-image-not-available-or-image-coming-soon-sign-simple-nature-silhouette-in-frame-isolated-illustration-vector.jpg",
          ],
          companies: formData.company ? [{ id: formData.company }] : undefined,
        };
        await createProduct(productCreateData as any);
        toast.success("Product added successfully!");
      }
      onSuccess();
      setIsDialogOpen(false);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "An unknown error occurred."
      );
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
    openEditDialog: openEditDialog as (product: Product) => void, // Type assertion for compatibility
    handleSubmit,
    companies,
  };
}
