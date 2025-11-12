import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { UploadDropzone } from "@/components/uploadthing";
import { toast } from "sonner";
import { useCategories } from "@/hooks/use-category-management";

import { useProductForm } from "@/hooks/use-product-form";
type ProductFormProps = ReturnType<typeof useProductForm>;

export function ProductFormDialog({
  isDialogOpen,
  setIsDialogOpen,
  isSubmitting,
  editingProduct,
  formData,
  setFormData,
  handleSubmit,
  companies,
}: ProductFormProps) {
  const { categories, isLoading: categoriesLoading } = useCategories();

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {editingProduct ? "Edit Product" : "Add New Product"}
          </DialogTitle>
          <DialogDescription>
            {editingProduct
              ? "Update the product information."
              : "Fill in the details to add a new product."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div className="space-y-2">
            <Label htmlFor="name">Product Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">Price</Label>
              <Input
                id="price"
                type="number"
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: e.target.value })
                }
                placeholder="Enter price"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="company">Company</Label>
              <Select
                value={formData.company}
                onValueChange={(value) =>
                  setFormData({ ...formData, company: value })
                }
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select company" />
                </SelectTrigger>
                <SelectContent>
                  {companies?.map((company: any) => (
                    <SelectItem key={company.id} value={company.id}>
                      {company.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select
                value={formData.categories}
                onValueChange={(value) =>
                  setFormData({ ...formData, categories: value })
                }
                required
                disabled={categoriesLoading}
              >
                <SelectTrigger>
                  <SelectValue placeholder={categoriesLoading ? "Loading categories..." : "Select category"} />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.name}>
                      {category.displayName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>SKU</Label>
              <div className="flex items-center gap-1">
                <Input
                  value={formData.companyShort}
                  readOnly
                  className="w-12 border-0 bg-transparent px-0 text-center font-mono"
                  placeholder="CO"
                />
                <span className="font-mono">-</span>
                <Input
                  value={formData.categoryShort}
                  readOnly
                  className="w-12 border-0 bg-transparent px-0 text-center font-mono"
                  placeholder="CAT"
                />
                <span className="font-mono">-</span>
                <Input
                  value={formData.skuSuffix}
                  onChange={(e) =>
                    setFormData({ ...formData, skuSuffix: e.target.value })
                  }
                  className="flex-1 font-mono"
                  placeholder="001"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="stock">Stock</Label>
              <Input
                id="stock"
                type="number"
                value={formData.availableStock}
                onChange={(e) =>
                  setFormData({ ...formData, availableStock: e.target.value })
                }
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              rows={3}
              required
            />
          </div>

          <div className="space-y-4">
            <Label>Product Image</Label>
            <div className="space-y-4">
              <div className="flex flex-col gap-2">
                <Label className="text-sm text-muted-foreground">
                  Upload Image
                </Label>
                <UploadDropzone
                  endpoint="imageUploader"
                  config={{
                    mode: "auto",
                  }}
                  onClientUploadComplete={(res) => {
                    if (res && res[0]) {
                      setFormData((x) => ({ ...x, image: res[0].ufsUrl }));
                      toast.success("Image uploaded successfully!");
                    }
                  }}
                  onUploadError={(error: Error) => {
                    console.error("Upload error:", error);
                    toast.error("Failed to upload image. Please try again.");
                  }}
                  className="w-full ut-button:bg-primary ut-button:text-primary-foreground ut-button:hover:bg-primary/90 ut-button:ut-readying:bg-muted py-6!"
                  appearance={{
                    uploadIcon: "hidden",
                  }}
                />
              </div>

              <div className="flex items-center gap-2">
                <div className="flex-1 h-px bg-border"></div>
                <span className="text-xs text-muted-foreground uppercase tracking-wider">
                  or
                </span>
                <div className="flex-1 h-px bg-border"></div>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="image"
                  className="text-sm text-muted-foreground"
                >
                  Image URL
                </Label>
                <Input
                  id="image"
                  type="url"
                  value={formData.image}
                  onChange={(e) =>
                    setFormData({ ...formData, image: e.target.value })
                  }
                  placeholder="https://..."
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsDialogOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting
                ? "Saving..."
                : editingProduct
                ? "Update Product"
                : "Add Product"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
