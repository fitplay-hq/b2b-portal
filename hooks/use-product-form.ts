import { useState, useEffect, useRef } from "react";
import { Product, Category, Company } from "@/lib/generated/prisma";
import { toast } from "sonner";
import { useCreateProduct, useUpdateProduct, useProducts } from "@/data/product/admin.hooks";
import { useCompanies } from "@/data/company/admin.hooks";
import { useCategories } from "./use-category-management";
import { useSubcategoryManagement } from "./use-subcategory-management";

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
  const { getSubcategoriesByCategory } = useSubcategoryManagement();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Note: companyShortMap is now created directly in the useEffect to avoid dependency issues

  // Note: categoryShortMap is now created directly in the useEffect to avoid dependency issues

  // Refs to track previous values and prevent infinite loops
  const prevCompanyRef = useRef<string>('');
  const prevCategoriesRef = useRef<string>('');
  const prevSubcategoriesRef = useRef<string>('');

  const [formData, setFormData] = useState({
    name: "",
    brand: "",
    company: "",
    companyShort: "",
    categories: "",
    categoryShort: "",
    subcategories: "",
    subcategoryShort: "",
    skuSuffix: "",
    price: "",
    availableStock: "",
    minStockThreshold: "",
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
        setFormData(prev => ({ ...prev, categoryShort: short, subcategories: '', subcategoryShort: '' }));
      } else {
        setFormData(prev => ({ ...prev, categoryShort: '', subcategories: '', subcategoryShort: '' }));
      }
    }
  }, [formData.categories, categories]);

  // Auto-set subcategoryShort when subcategories change
  useEffect(() => {
    if (formData.subcategories !== prevSubcategoriesRef.current) {
      prevSubcategoriesRef.current = formData.subcategories;
      if (formData.subcategories && formData.categories) {
        console.log('Selected subcategory:', formData.subcategories);
        
        const subcategories = getSubcategoriesByCategory(
          categories.find(cat => cat.name === formData.categories)?.id || ''
        );
        
        const subcategoryShortMap = (subcategories || []).reduce((acc, subcategory) => {
          acc[subcategory.name] = subcategory.shortCode;
          return acc;
        }, {} as Record<string, string>);
        
        // Try exact match first, then fallback to auto-generation
        let short = subcategoryShortMap[formData.subcategories];
        if (!short) {
          // Auto-generate from subcategory name: take first 3 characters, remove spaces
          short = formData.subcategories.replace(/[^A-Za-z]/g, '').slice(0, 3).toUpperCase();
        }
        console.log('Generated subcategory short:', short);
        setFormData(prev => ({ ...prev, subcategoryShort: short }));
      } else {
        setFormData(prev => ({ ...prev, subcategoryShort: '' }));
      }
    }
  }, [formData.subcategories, formData.categories, categories, getSubcategoriesByCategory]);

  // Auto-generate SKU suffix when company, category, and subcategory are available
  useEffect(() => {
    // Only generate for new products (not editing) and when we have company, category, and subcategory
    if (formData.companyShort && formData.categoryShort && formData.subcategoryShort && !editingProduct) {
      console.log('🔧 SKU Generation triggered');
      console.log('Company Short:', formData.companyShort);
      console.log('Category Short:', formData.categoryShort);
      console.log('Subcategory Short:', formData.subcategoryShort);
      console.log('Products loaded:', !!products);
      console.log('Products count:', products?.length || 0);
      
      if (!products) {
        console.log('⏳ Products not loaded yet, skipping SKU generation');
        return;
      }

      // Find existing products with same company-category-subcategory prefix
      const skuPrefix = `${formData.companyShort}-${formData.categoryShort}-${formData.subcategoryShort}`;
      console.log('🎯 SKU Prefix:', skuPrefix);
      
      // Filter products that match our prefix and extract numeric suffixes
      const matchingProducts = products.filter(product => 
        product.sku && product.sku.startsWith(skuPrefix + '-')
      );
      
      console.log('📋 Matching products:', matchingProducts.map(p => ({ name: p.name, sku: p.sku })));
      
      const existingSKUs = matchingProducts
        .map(product => {
          const parts = product.sku.split('-');
          // Make sure we have exactly 4 parts and the fourth part is numeric
          if (parts.length === 4) {
            const suffix = parts[3];
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
  }, [formData.companyShort, formData.categoryShort, formData.subcategoryShort, products, editingProduct]);

  // Force regenerate SKU suffix when company, category, or subcategory changes
  useEffect(() => {
    if (formData.companyShort && formData.categoryShort && formData.subcategoryShort && !editingProduct && products && 
        (prevCompanyRef.current !== formData.company || prevCategoriesRef.current !== formData.categories || prevSubcategoriesRef.current !== formData.subcategories)) {
      // Clear the suffix first to trigger regeneration
      setFormData(prev => ({ ...prev, skuSuffix: '' }));
    }
  }, [formData.company, formData.categories, formData.subcategories, formData.companyShort, formData.categoryShort, formData.subcategoryShort, products, editingProduct]);

  const sku = formData.companyShort && formData.categoryShort && formData.subcategoryShort && formData.skuSuffix ? `${formData.companyShort}-${formData.categoryShort}-${formData.subcategoryShort}-${formData.skuSuffix}` : "";

  const openNewDialog = () => {
    setEditingProduct(null);
    setFormData({
      name: "",
      brand: "",
      company: "",
      companyShort: "",
      categories: "",
      categoryShort: "",
      subcategories: "",
      subcategoryShort: "",
      skuSuffix: "",
      price: "",
      availableStock: "",
      minStockThreshold: "",
      description: "",
      image: "",
    });
    setIsDialogOpen(true);
  };

  const openEditDialog = (product: ProductWithCompanies) => {
    setEditingProduct(product);

    // Parse SKU into parts (now 4 parts: COMPANY-CATEGORY-SUBCATEGORY-SUFFIX)
    const skuParts = product.sku.split('-');
    const companyShort = skuParts[0] || '';
    const categoryShort = skuParts[1] || '';
    const subcategoryShort = skuParts[2] || '';
    const skuSuffix = skuParts[3] || '';

    // Get the first company associated with the product (if any)
    const associatedCompany = product.companies?.[0]?.id || "";

    // Get category and subcategory names from the relationships
    const categoryName = (product as any).category?.name || product.categories || "";
    const subcategoryName = (product as any).subCategory?.name || "";

    setFormData({
      name: product.name,
      brand: product.brand || "",
      company: associatedCompany,
      companyShort,
      categories: categoryName,
      categoryShort,
      subcategories: subcategoryName,
      subcategoryShort,
      skuSuffix,
      price: product.price?.toString() || "",
      availableStock: product.availableStock.toString(),
      minStockThreshold: product.minStockThreshold?.toString() || "",
      description: product.description,
      image: product.images[0] || "",
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const availableStock = parseInt(formData.availableStock);
    const minStockThreshold = parseInt(formData.minStockThreshold);
    const price = formData.price ? parseInt(formData.price) : undefined;

    if (isNaN(availableStock)) {
      toast.error("Please enter valid numbers for stock.");
      setIsSubmitting(false);
      return;
    }

    // Only validate minStockThreshold if a value is provided
    if (formData.minStockThreshold && (isNaN(minStockThreshold) || minStockThreshold < 0)) {
      toast.error("Please enter a valid restock level (0 or greater).");
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
      
      // Find the selected subcategory
      const selectedSubcategories = getSubcategoriesByCategory(selectedCategory?.id || '');
      const selectedSubcategory = selectedSubcategories?.find(sub => sub.name === formData.subcategories);
      
      // Check if it's a legacy category (exists in enum)
      const isLegacyCategory = ['stationery', 'accessories', 'funAndStickers', 'drinkware', 'apparel', 'travelAndTech', 'books', 'welcomeKit'].includes(formData.categories);

      if (editingProduct) {
        // Prepare the data for the API (not Prisma format)
        const productUpdateData: any = {
          id: editingProduct.id,
          name: formData.name,
          sku,
          price,
          minStockThreshold,
          brand: formData.brand || null,
          // Don't send availableStock for updates - use inventory management instead
          // Only set categories enum field if it's a legacy category
          ...(isLegacyCategory && { categories: formData.categories as Category }),
          categoryId: selectedCategory?.id, // Send categoryId directly
          subCategoryId: selectedSubcategory?.id || null, // Send subCategoryId
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
          minStockThreshold,
          brand: formData.brand || undefined,
          // Only set categories enum field if it's a legacy category
          ...(isLegacyCategory && { categories: formData.categories as Category }),
          categoryId: selectedCategory?.id, // Send categoryId directly
          subCategoryId: selectedSubcategory?.id || null, // Send subCategoryId
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
