import { useState } from "react";
import { Product, Prisma, Category } from "@/lib/generated/prisma";
import { toast } from "sonner";
import { useCreateProduct, useUpdateProduct } from "@/data/product/admin.hooks";

interface UseProductFormProps {
  onSuccess: () => void;
}

export function useProductForm({ onSuccess }: UseProductFormProps) {
  const { createProduct } = useCreateProduct();
  const { updateProduct } = useUpdateProduct();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    sku: "",
    price: "",
    availableStock: "",
    categories: "",
    description: "",
    image: "",
    brand: "",
    specifications: "",
  });

  const openNewDialog = () => {
    setEditingProduct(null);
    setFormData({
      name: "",
      sku: "",
      price: "",
      availableStock: "",
      categories: "",
      description: "",
      image: "",
      brand: "",
      specifications: "",
    });
    setIsDialogOpen(true);
  };

  const openEditDialog = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      sku: product.sku,
      price: product.price.toString(),
      availableStock: product.availableStock.toString(),
      categories: product.categories,
      description: product.description,
      image: product.images[0] || "",
      brand: product.brand,
      specifications: (product.specification as string) ?? "",
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const price = parseFloat(formData.price);
    const availableStock = parseInt(formData.availableStock);

    if (isNaN(price) || isNaN(availableStock)) {
      toast.error("Please enter valid numbers for price and stock.");
      setIsSubmitting(false);
      return;
    }

    try {
      if (editingProduct) {
        // Update logic
        const productUpdateData: Prisma.ProductUpdateInput = {
          id: editingProduct.id,
          name: formData.name,
          sku: formData.sku,
          price,
          availableStock,
          categories: formData.categories as Category,
          description: formData.description,
          images: [
            formData.image ||
              "https://images.unsplash.com/photo-1526401485004-46910ecc8e51?w=400",
          ],
          brand: formData.brand,
          specification: formData.specifications,
        };
        await updateProduct(productUpdateData);
        toast.success("Product updated successfully!");
      } else {
        // Create logic
        const productCreateData: Prisma.ProductCreateInput = {
          name: formData.name,
          sku: formData.sku,
          price,
          availableStock,
          categories: formData.categories as Category,
          description: formData.description,
          images: [
            formData.image ||
              "https://images.unsplash.com/photo-1526401485004-46910ecc8e51?w=400",
          ],
          brand: formData.brand,
          specification: formData.specifications,
        };
        await createProduct(productCreateData);
        toast.success("Product added successfully!");
      }
      onSuccess(); // Re-fetch data
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
  };
}

