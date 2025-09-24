import { useState, useEffect } from "react";
import { Product, Prisma, Category } from "@/lib/generated/prisma";
import { toast } from "sonner";
import { useCreateProduct, useUpdateProduct } from "@/data/product/admin.hooks";
import { useCompanies } from "@/data/company/admin.hooks";

interface UseProductFormProps {
  onSuccess: () => void;
}

export function useProductForm({ onSuccess }: UseProductFormProps) {
  const { createProduct } = useCreateProduct();
  const { updateProduct } = useUpdateProduct();
  const { companies } = useCompanies();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Hardcoded maps for short names
  const companyShortMap: Record<string, string> = {
    'Github': 'GH',
    // Add more as needed
  };
  const categoryShortMap: Record<string, string> = {
    'stationery': 'STN',
    'accessories': 'ACC',
    'funAndStickers': 'FUN',
    'drinkware': 'DRK',
    'apparel': 'APP',
    'travelAndTech': 'TNT',
    'books': 'BKS',
    'welcomeKit': 'WKT',
  };

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
      const company = companies?.find((c: any) => c.id === formData.company);
      const companyName: string = company?.name || '';
      const short = companyShortMap[companyName] || companyName.slice(0,2).toUpperCase();
      setFormData(prev => ({ ...prev, companyShort: short }));
    } else {
      setFormData(prev => ({ ...prev, companyShort: '' }));
    }
  }, [formData.company, companies]);

  // Auto-set categoryShort when categories change
  useEffect(() => {
    if (formData.categories) {
      const short = categoryShortMap[formData.categories] || formData.categories.slice(0, 3).toUpperCase();
      setFormData(prev => ({ ...prev, categoryShort: short }));
    } else {
      setFormData(prev => ({ ...prev, categoryShort: '' }));
    }
  }, [formData.categories]);

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
