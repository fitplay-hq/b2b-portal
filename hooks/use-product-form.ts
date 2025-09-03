import { useState } from "react";
import { Product, Prisma, Category } from "@/lib/generated/prisma";
import { toast } from "sonner";
import { useCreateProduct, useUpdateProduct } from "@/data/product/admin.hooks";

interface UseProductFormProps {
  onSuccess: () => void;
}

type Specification = {
  key: string;
  value: string;
};

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
        };
        await updateProduct(productUpdateData);
        toast.success("Product updated successfully!");
      } else {
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
  };
}
