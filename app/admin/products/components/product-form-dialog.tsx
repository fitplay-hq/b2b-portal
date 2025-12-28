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
import { useSubcategoryManagement } from "@/hooks/use-subcategory-management";
import { Loader2 } from "lucide-react";

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
  const { getSubcategoriesByCategory } = useSubcategoryManagement();
  
  // Get subcategories for the selected category
  const selectedCategory = categories.find(cat => cat.name === formData.categories);
  const availableSubcategories = selectedCategory ? getSubcategoriesByCategory(selectedCategory.id) : [];

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogContent className="max-w-2xl max-h-[90vh] my-4 overflow-hidden flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle>
            {editingProduct ? "Edit Product" : "Add New Product"}
          </DialogTitle>
          <DialogDescription>
            {editingProduct
              ? "Update the product information. Fields marked with * are required. Note: Stock levels are managed through inventory management with proper tracking reasons."
              : "Fill in the details to add a new product. Fields marked with * are required. After creation, stock changes must be done through inventory management."}
          </DialogDescription>
        </DialogHeader>
        
        <div 
          className="flex-1 overflow-y-auto overflow-x-hidden px-1 min-h-0"
          style={{
            scrollbarWidth: 'thin',
            msOverflowStyle: 'auto'
          }}
        >
          <style jsx>{`
            div::-webkit-scrollbar {
              display: none;
            }
          `}</style>
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              
              // Validate all required fields
              if (!formData.name.trim()) {
                toast.error("Product name is required");
                return;
              }
              if (!formData.price || Number(formData.price) <= 0) {
                toast.error("Price is required and must be greater than 0");
                return;
              }
              if (!formData.company) {
                toast.error("Company selection is required");
                return;
              }
              // Category and subcategory are only required for new products, not edits
              if (!editingProduct) {
                if (!formData.categories) {
                  toast.error("Category selection is required");
                  return;
                }
                if (!formData.subcategories) {
                  toast.error("Subcategory selection is required");
                  return;
                }
              }
              if (!formData.skuSuffix.trim()) {
                toast.error("SKU is required");
                return;
              }
              // Stock validation only for new products
              if (!editingProduct && (!formData.availableStock || Number(formData.availableStock) < 0)) {
                toast.error("Initial stock is required for new products and cannot be negative");
                return;
              }
              // Minimum stock threshold validation - only check if provided
              if (formData.minStockThreshold && Number(formData.minStockThreshold) < 0) {
                toast.error("Minimum stock threshold cannot be negative");
                return;
              }
              if (!formData.description.trim()) {
                toast.error("Description is required");
                return;
              }
              
              handleSubmit(e);
            }} 
          className="space-y-4 pt-2 pb-4"
        >
          <div className="space-y-2">
            <Label htmlFor="name">Product Name <span className="text-red-500">*</span></Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">Price <span className="text-red-500">*</span></Label>
              <Input
                id="price"
                type="number"
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: e.target.value })
                }
                placeholder="Enter price"
                required
                min="0"
                step="0.01"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="brand">Brand</Label>
              <Input
                id="brand"
                value={formData.brand}
                onChange={(e) =>
                  setFormData({ ...formData, brand: e.target.value })
                }
                placeholder="Enter brand name"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="minThreshold">Minimum Stock Threshold</Label>
              <Input
                id="minThreshold"
                type="number"
                min="0"
                value={formData.minStockThreshold}
                onChange={(e) =>
                  setFormData({ ...formData, minStockThreshold: e.target.value })
                }
                placeholder="Enter threshold"
                title="When stock falls below this number, email alerts will be sent"
              />
            </div>
            <div></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="company">Company <span className="text-red-500">*</span></Label>
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
                  {companies?.map((company: { id: string; name: string }) => (
                    <SelectItem key={company.id} value={company.id}>
                      {company.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Category {!editingProduct && <span className="text-red-500">*</span>}</Label>
              <Select
                value={formData.categories}
                onValueChange={(value) =>
                  setFormData({ ...formData, categories: value })
                }
                required={!editingProduct}
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

          <div className="space-y-2">
            <Label htmlFor="subcategory">Subcategory {!editingProduct && <span className="text-red-500">*</span>}</Label>
            <Select
              value={formData.subcategories}
              onValueChange={(value) =>
                setFormData({ ...formData, subcategories: value })
              }
              required={!editingProduct}
              disabled={!formData.categories || !availableSubcategories || availableSubcategories.length === 0}
            >
              <SelectTrigger>
                <SelectValue placeholder={
                  !formData.categories ? "Select category first" :
                  !availableSubcategories || availableSubcategories.length === 0 ? "No subcategories available" :
                  "Select subcategory"
                } />
              </SelectTrigger>
              <SelectContent className="max-w-full">
                {availableSubcategories && availableSubcategories.map((subcategory) => (
                  <SelectItem key={subcategory.id} value={subcategory.name}>
                    {subcategory.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>SKU <span className="text-red-500">*</span></Label>
              <div className="flex items-center gap-1">
                <Input
                  value={formData.companyShort}
                  readOnly
                  className="w-14 border-0 bg-gray-50 px-2 text-center font-mono text-sm"
                  placeholder="CO"
                />
                <span className="font-mono text-gray-400">-</span>
                <Input
                  value={formData.categoryShort}
                  readOnly
                  className="w-14 border-0 bg-gray-50 px-2 text-center font-mono text-sm"
                  placeholder="CAT"
                />
                <span className="font-mono text-gray-400">-</span>
                <Input
                  value={formData.subcategoryShort}
                  readOnly
                  className="w-14 border-0 bg-gray-50 px-2 text-center font-mono text-sm"
                  placeholder="SUB"
                />
                <span className="font-mono text-gray-400">-</span>
                <Input
                  value={formData.skuSuffix}
                  onChange={(e) =>
                    setFormData({ ...formData, skuSuffix: e.target.value })
                  }
                  className="w-20 font-mono text-center focus:bg-white"
                  placeholder="001"
                  title="Auto-generated sequentially, but can be manually edited"
                  required
                />
              </div>
            </div>
            {!editingProduct && (
              <div className="space-y-2">
                <Label htmlFor="stock">Stock <span className="text-red-500">*</span></Label>
                <Input
                  id="stock"
                  type="number"
                  value={formData.availableStock}
                  onChange={(e) =>
                    setFormData({ ...formData, availableStock: e.target.value })
                  }
                  required
                  placeholder="Enter initial stock quantity"
                />
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description <span className="text-red-500">*</span></Label>
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
            <Label>Product Image (Optional)</Label>
            <div className="space-y-4">
              {/* Show upload dropzone only if no image is uploaded */}
              {!formData.image && (
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
                      // Better error messages based on error type
                      let errorMessage = "Failed to upload image. Please try again.";
                      if (error.message.includes("FileSizeMismatch") || error.message.includes("size")) {
                        errorMessage = "Image is too large. Please choose an image smaller than 4MB.";
                      } else if (error.message.includes("FileType") || error.message.includes("type")) {
                        errorMessage = "Invalid file type. Please choose a valid image file (JPEG, PNG, GIF).";
                      }
                      toast.error(errorMessage);
                    }}
                    className="w-full ut-button:bg-primary ut-button:text-primary-foreground ut-button:hover:bg-primary/90 ut-button:ut-readying:bg-muted"
                    appearance={{
                      uploadIcon: "hidden",
                    }}
                  />
                </div>
              )}

              {/* Image preview (shows after upload or when URL entered) */}
              {formData.image && (
                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-md border">
                  <div className="w-20 h-20 flex-shrink-0 rounded-md overflow-hidden border border-gray-200 bg-white">
                    <img
                      src={formData.image}
                      alt={formData.name || 'Product image'}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        // hide broken image by clearing src display
                        (e.currentTarget as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">Image uploaded</p>
                    <p className="text-xs text-gray-500 truncate mt-1">{formData.image}</p>
                    <div className="mt-2 flex gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setFormData({ ...formData, image: "" })}
                      >
                        Remove & Upload New
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => window.open(formData.image, "_blank")}
                      >
                        View Full Size
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {/* Separator and URL input - only show when no image is uploaded */}
              {!formData.image && (
                <>
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
                </>
              )}
            </div>
          </div>
          </form>
        </div>

        <div className="flex justify-end gap-2 pt-4 border-t flex-shrink-0">
          <Button
            type="button"
            variant="outline"
            onClick={() => setIsDialogOpen(false)}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            disabled={isSubmitting}
            onClick={(e) => {
              e.preventDefault();
              const formElement = document.querySelector('form');
              formElement?.dispatchEvent(new Event('submit', { bubbles: true }));
            }}
          >
            {isSubmitting ? (
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Saving...
              </div>
            ) : (
              editingProduct ? "Update Product" : "Add Product"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}