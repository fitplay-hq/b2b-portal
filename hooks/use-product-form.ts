import { useState, useEffect } from "react";
import { Product, Prisma, Category } from "@/lib/generated/prisma";
import { toast } from "sonner";
import { useCreateProduct, useUpdateProduct, useProducts } from "@/data/product/admin.hooks";
import { useCompanies } from "@/data/company/admin.hooks";

interface UseProductFormProps {
  onSuccess: () => void;
}

// Enhanced maps for short names with more robust fallbacks (moved outside component)
const companyShortMap: Record<string, string> = {
  'Github': 'GH',
  'Fitplay': 'FP',
  'Adacats': 'AD',
  'Fun And Stickers': 'FUN',
  // Add more as needed
};

const categoryShortMap: Record<string, string> = {
  // Primary enum values (camelCase from Prisma)
  'stationery': 'STN',
  'accessories': 'ACC',
  'funAndStickers': 'FUN',
  'drinkware': 'DRK',
  'apparel': 'APP',
  'travelAndTech': 'TNT',
  'books': 'BKS',
  'welcomeKit': 'WKT',
  // Fallbacks for other formats
  'STATIONERY': 'STN',
  'ACCESSORIES': 'ACC', 
  'FUN_AND_STICKERS': 'FUN',
  'DRINKWARE': 'DRK',
  'APPAREL': 'APP',
  'TRAVEL_AND_TECH': 'TNT',
  'BOOKS': 'BKS',
  'WELCOME_KIT': 'WKT',
};

export function useProductForm({ onSuccess }: UseProductFormProps) {
  const { createProduct } = useCreateProduct();
  const { updateProduct } = useUpdateProduct();
  const { companies } = useCompanies();
  const { products } = useProducts();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    if (formData.company) {
      const company = companies?.find((c: { id: string; name: string }) => c.id === formData.company);
      const companyName: string = company?.name || '';
      console.log('Selected company:', companyName);
      
      // Try exact match first, then fallback to auto-generation
      let short = companyShortMap[companyName];
      if (!short) {
        // Auto-generate from company name: take first 2-3 characters
        short = companyName.replace(/[^A-Za-z]/g, '').slice(0, 3).toUpperCase();
      }
      console.log('Generated company short:', short);
      setFormData(prev => ({ ...prev, companyShort: short }));
    } else {
      setFormData(prev => ({ ...prev, companyShort: '' }));
    }
  }, [formData.company, companies]);

  // Auto-set categoryShort when categories change
  useEffect(() => {
    if (formData.categories) {
      console.log('Selected category:', formData.categories);
      
      // Try exact match first, then fallback to auto-generation
      let short = categoryShortMap[formData.categories];
      if (!short) {
        // Auto-generate from category name: take first 3 characters, remove underscores
        short = formData.categories.replace(/[^A-Za-z]/g, '').slice(0, 3).toUpperCase();
      }
      console.log('Generated category short:', short);
      setFormData(prev => ({ ...prev, categoryShort: short }));
    } else {
      setFormData(prev => ({ ...prev, categoryShort: '' }));
    }
  }, [formData.categories]);

  // Auto-generate SKU suffix when both companyShort and categoryShort are available
  useEffect(() => {
    if (formData.companyShort && formData.categoryShort && !editingProduct) {
      // Find existing products with same company-category prefix
      const skuPrefix = `${formData.companyShort}-${formData.categoryShort}`;
      console.log('SKU Prefix:', skuPrefix);
      console.log('All products:', products?.map(p => p.sku));
      
      const existingSKUs = (products || [])
        .map(product => product.sku)
        .filter(sku => sku && sku.startsWith(skuPrefix))
        .map(sku => {
          const parts = sku.split('-');
          const suffix = parts[2];
          return parseInt(suffix) || 0;
        })
        .filter(num => !isNaN(num));

      console.log('Existing SKUs for prefix:', existingSKUs);

      // Find the next available number
      const nextNumber = existingSKUs.length === 0 ? 1 : Math.max(...existingSKUs) + 1;
      const paddedNumber = nextNumber.toString().padStart(3, '0');
      
      console.log('Generated suffix:', paddedNumber);
      setFormData(prev => ({ ...prev, skuSuffix: paddedNumber }));
    }
  }, [formData.companyShort, formData.categoryShort, products, editingProduct]);

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
      if (editingProduct) {
        const productUpdateData: Prisma.ProductUpdateInput = {
          id: editingProduct.id,
          name: formData.name,
          sku,
          price,
          availableStock,
          categories: formData.categories as Category,
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
          categories: formData.categories as Category,
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
    openEditDialog,
    handleSubmit,
    companies,
  };
}
