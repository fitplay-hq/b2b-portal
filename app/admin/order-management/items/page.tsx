"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Layout from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MultiSearchableSelect } from "@/components/ui/combobox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { TableCell, TableHead, TableRow } from "@/components/ui/table";

import {
  Plus,
  Search,
  Edit,
  Trash2,
  Loader2,
  Eye,
  FileDown,
  FileSpreadsheet,
  ChevronDown,
  Tags,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { useMemo } from "react";
import type { OMProduct, OMBrand } from "@/types/order-management";
import { formatDateToYYYYMMDD } from "@/lib/utils";
import { DeleteConfirmationDialog } from "@/components/delete-confirmation-dialog";
import { OMNewItemDialog } from "@/components/orderManagement/OMNewItemDialog";
import {
  OMSortControl,
  type SortOption,
} from "@/components/orderManagement/OMSortControl";
import { OMFilterCard } from "@/components/orderManagement/shared/OMFilterCard";
import { OMActiveFilters } from "@/components/orderManagement/shared/OMActiveFilters";
import { ItemFilters } from "@/components/orderManagement/items/ItemFilters";
import { OMDataTable } from "@/components/orderManagement/shared/OMDataTable";
import { OMSortableHeader } from "@/components/orderManagement/shared/OMSortableHeader";
import { useOMFilters } from "@/hooks/use-om-filters";
import { ITEM_SORT_OPTIONS } from "@/constants/om-sort-options";

function skuBrandPart(brandName: string | undefined): string {
  return brandName
    ? brandName
        .replace(/[^a-zA-Z0-9]/g, "")
        .substring(0, 3)
        .toUpperCase()
    : "NIL";
}

function skuProductPart(productName: string): string {
  return productName
    .replace(/[^a-zA-Z0-9]/g, "")
    .substring(0, 3)
    .toUpperCase();
}

export default function OMItems() {
  const router = useRouter();
  const [items, setItems] = useState<OMProduct[]>([]);
  const [brands, setBrands] = useState<OMBrand[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<OMProduct | null>(null);
  const [viewingItem, setViewingItem] = useState<OMProduct | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>("name_asc");
  const [showFilters, setShowFilters] = useState(false);

  const valueLabels = useMemo(
    () => ({
      brandIds: (val: any) => {
        if (Array.isArray(val)) {
          return val
            .map((id) => brands.find((b) => b.id === id)?.name || id)
            .join(", ");
        }
        return brands.find((b) => b.id === val)?.name || val;
      },
      gst: (val: string) => (val === "all" ? "All" : `${val}%`),
    }),
    [brands],
  );

  const { filters, setFilters, resetFilters, activeFilters, removeFilter } =
    useOMFilters({
      initialFilters: {
        brandIds: [] as string[],
        minPrice: "",
        maxPrice: "",
        gst: "all",
        minTotalOrdered: "",
        maxTotalOrdered: "",
      },
      labels: {
        brandIds: "Brand",
        minPrice: "Min Price",
        maxPrice: "Max Price",
        gst: "GST",
        minTotalOrdered: "Min Ordered",
        maxTotalOrdered: "Max Ordered",
      },
      valueLabels,
    });

  const [formData, setFormData] = useState({
    name: "",
    sku: "",
    price: "",
    defaultGstPct: "0",
    description: "",
    brandIds: [] as string[],
    code: "",
    skuProductPart: "",
    isPrdManuallyEdited: false,
    skuNotApplicable: true,
  });

  const fetchItems = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/om/products");
      if (res.ok) {
        const data = await res.json();
        setItems(data);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to load items");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchBrands = async () => {
    try {
      const res = await fetch("/api/admin/om/brands");
      if (res.ok) {
        setBrands(await res.json());
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchItems();
    fetchBrands();
  }, []);

  const brandOptions = brands.map((b) => ({ value: b.id, label: b.name }));

  const selectedBrandNames = brands
    .filter((b) => formData.brandIds.includes(b.id))
    .map((b) => b.name);
  const brandPart = skuBrandPart(selectedBrandNames[0]);
  const productPart = skuProductPart(formData.name);

  const resetForm = () => {
    setFormData({
      name: "",
      sku: "",
      price: "",
      defaultGstPct: "0",
      description: "",
      brandIds: [],
      code: "",
      skuProductPart: "",
      isPrdManuallyEdited: false,
      skuNotApplicable: true,
    });
    setEditingItem(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const brand = brands.find((b) => formData.brandIds.includes(b.id));
    const brandPart = skuBrandPart(brand?.name);
    const prdPart = formData.skuProductPart;
    const finalSku = formData.skuNotApplicable
      ? null
      : `FP-${brandPart}-${prdPart || "PRD"}-${formData.code}`;

    const submissionData = {
      ...formData,
      sku: finalSku,
      price: formData.price ? parseFloat(formData.price) : null,
      defaultGstPct: parseFloat(formData.defaultGstPct),
      brandIds: formData.brandIds.length > 0 ? formData.brandIds : [],
    };
    delete (submissionData as any).skuNotApplicable;

    try {
      const url = editingItem
        ? `/api/admin/om/products/${editingItem.id}`
        : "/api/admin/om/products";

      const method = editingItem ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submissionData),
      });

      if (res.ok) {
        toast.success(`Item ${editingItem ? "updated" : "added"} successfully`);
        setIsAddDialogOpen(false);
        resetForm();
        fetchItems();
      } else {
        const error = await res.json();
        toast.error(error.error || "Something went wrong");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to save item");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (item: OMProduct) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      sku: item.sku || "",
      price: item.price?.toString() ?? "",
      defaultGstPct: item.defaultGstPct.toString(),
      description: item.description || "",
      brandIds: item.brands?.map((b: any) => b.id) || [],
      code: item.sku?.split("-").pop() || "",
      skuProductPart: item.sku?.split("-")[2] || skuProductPart(item.name),
      isPrdManuallyEdited: true, // Treat existing items as manually edited to prevent auto-refill on rename
      skuNotApplicable: !item.sku,
    });
    setIsAddDialogOpen(true);
  };

  const handleView = (item: OMProduct) => {
    setViewingItem(item);
    setIsViewDialogOpen(true);
  };

  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleDelete = (itemId: string) => {
    setDeleteId(itemId);
    setIsDeleteDialogOpen(true);
  };

  const onConfirmDelete = async () => {
    if (!deleteId) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/admin/om/products/${deleteId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        toast.success("Item deleted successfully");
        fetchItems();
        setIsDeleteDialogOpen(false);
      } else {
        const error = await res.json();
        toast.error(error.error || "Failed to delete item");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error deleting item");
    } finally {
      setIsDeleting(false);
      setDeleteId(null);
    }
  };

  const resetFiltersAll = () => {
    setSearchTerm("");
    resetFilters();
  };

  const filteredItems = useMemo(() => {
    return items
      .filter((item) => {
        // Advanced filters
        const matchesBrands =
          filters.brandIds.length === 0 ||
          item.brands?.some((b: any) => filters.brandIds.includes(b.id));

        const matchesMinPrice =
          !filters.minPrice ||
          (item.price || 0) >= parseFloat(filters.minPrice);
        const matchesMaxPrice =
          !filters.maxPrice ||
          (item.price || 0) <= parseFloat(filters.maxPrice);

        const matchesGst =
          filters.gst === "all" ||
          item.defaultGstPct.toString() === filters.gst;

        const matchesMinTotalOrdered =
          !filters.minTotalOrdered ||
          (item.totalOrdered || 0) >= parseInt(filters.minTotalOrdered);
        const matchesMaxTotalOrdered =
          !filters.maxTotalOrdered ||
          (item.totalOrdered || 0) <= parseInt(filters.maxTotalOrdered);

        if (
          !matchesBrands ||
          !matchesMinPrice ||
          !matchesMaxPrice ||
          !matchesGst ||
          !matchesMinTotalOrdered ||
          !matchesMaxTotalOrdered
        )
          return false;

        const searchLower = searchTerm.toLowerCase();
        return (
          item.name.toLowerCase().includes(searchLower) ||
          (item.sku || "").toLowerCase().includes(searchLower)
        );
      })
      .sort((a, b) => {
        if (sortBy === "name_asc") return a.name.localeCompare(b.name);
        if (sortBy === "name_desc") return b.name.localeCompare(a.name);

        if (sortBy === "sku_asc")
          return (a.sku || "").localeCompare(b.sku || "");
        if (sortBy === "sku_desc")
          return (b.sku || "").localeCompare(a.sku || "");

        if (sortBy === "brand_asc") {
          const aBrand = a.brands?.[0]?.name || "";
          const bBrand = b.brands?.[0]?.name || "";
          return aBrand.localeCompare(bBrand);
        }
        if (sortBy === "brand_desc") {
          const aBrand = a.brands?.[0]?.name || "";
          const bBrand = b.brands?.[0]?.name || "";
          return bBrand.localeCompare(aBrand);
        }

        if (sortBy === "rate_asc") return (a.price || 0) - (b.price || 0);
        if (sortBy === "rate_desc") return (b.price || 0) - (a.price || 0);

        if (sortBy === "gst_asc") return a.defaultGstPct - b.defaultGstPct;
        if (sortBy === "gst_desc") return b.defaultGstPct - a.defaultGstPct;

        if (sortBy === "total_ordered_asc")
          return (a.totalOrdered || 0) - (b.totalOrdered || 0);
        if (sortBy === "total_ordered_desc")
          return (b.totalOrdered || 0) - (a.totalOrdered || 0);

        if (sortBy === "newest")
          return (
            new Date(b.createdAt || 0).getTime() -
            new Date(a.createdAt || 0).getTime()
          );
        if (sortBy === "oldest")
          return (
            new Date(a.createdAt || 0).getTime() -
            new Date(b.createdAt || 0).getTime()
          );
        if (sortBy === "latest_update")
          return (
            new Date(b.updatedAt || 0).getTime() -
            new Date(a.updatedAt || 0).getTime()
          );
        return 0;
      });
  }, [items, searchTerm, filters, sortBy]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      // Search logic for enter key if needed
    }
  };


  // Export to CSV/Excel
  const exportToExcel = () => {
    const headers = [
      "Item Name",
      "Brand",
      "SKU",
      "Default Rate",
      "Default GST %",
      "Description",
    ];
    const rows = filteredItems.map((item) => [
      item.name,
      item.brands?.map((b) => b.name).join(", ") || "-",
      item.sku || "-",
      item.price ?? "-",
      `${item.defaultGstPct}%`,
      item.description || "-",
    ]);
    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
    ].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.setAttribute("href", URL.createObjectURL(blob));
    link.setAttribute(
      "download",
      `items_${formatDateToYYYYMMDD(new Date())}.csv`,
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Items exported to Excel");
  };

  // Export to PDF
  const exportToPDF = async () => {
    const jsPDF = (await import("jspdf")).default;
    const autoTable = (await import("jspdf-autotable")).default;
    const doc = new jsPDF({
      orientation: "landscape",
      unit: "mm",
      format: "a4",
    });
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Items Master Report", 8, 10);
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100, 100, 100);
    doc.text(
      `Generated: ${new Date().toLocaleString("en-IN")} | Total Records: ${filteredItems.length}`,
      8,
      15,
    );
    doc.setTextColor(0, 0, 0);
    autoTable(doc, {
      head: [
        [
          "Item Name",
          "Brand",
          "SKU",
          "Default Rate",
          "Default GST %",
          "Description",
        ],
      ],
      body: filteredItems.map((item) => [
        item.name,
        item.brands?.map((b) => b.name).join(", ") || "-",
        item.sku || "-",
        item.price ? `₹${item.price.toLocaleString("en-IN")}` : "-",
        `${item.defaultGstPct}%`,
        item.description || "-",
      ]),
      startY: 18,
      margin: { left: 6, right: 6, top: 8, bottom: 8 },
      styles: {
        fontSize: 8,
        cellPadding: 2,
        valign: "middle",
        overflow: "linebreak",
      },
      headStyles: {
        fillColor: [55, 65, 81],
        textColor: [255, 255, 255],
        fontSize: 8,
        fontStyle: "bold",
        halign: "center",
      },
      alternateRowStyles: { fillColor: [250, 250, 250] },
      didDrawPage: (data) => {
        const pageCount = (doc as any).internal.getNumberOfPages();
        doc.setFontSize(8);
        doc.setTextColor(128, 128, 128);
        doc.text(
          `Page ${data.pageNumber} of ${pageCount}`,
          doc.internal.pageSize.width - 25,
          doc.internal.pageSize.height - 5,
        );
      },
    });
    doc.save(`items_${formatDateToYYYYMMDD(new Date())}.pdf`);
    toast.success("Items exported to PDF");
  };

  return (
    <Layout isClient={false}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold">Items Master</h1>
            <p className="text-muted-foreground">Manage your product catalog</p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => router.push("/admin/order-management/brands")}
            >
              <Tags className="h-4 w-4 mr-2" />
              Manage Brands
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <FileDown className="h-4 w-4 mr-2" />
                  Export
                  <ChevronDown className="h-4 w-4 ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={exportToExcel}>
                  <FileSpreadsheet className="h-4 w-4 mr-2" />
                  Export to Excel
                </DropdownMenuItem>
                <DropdownMenuItem onClick={exportToPDF}>
                  <FileDown className="h-4 w-4 mr-2" />
                  Export to PDF
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <OMNewItemDialog
              brands={brands}
              onItemAdded={() => {
                fetchItems();
                setIsAddDialogOpen(false);
              }}
              trigger={
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Item
                </Button>
              }
            />

            <Dialog
              open={isAddDialogOpen}
              onOpenChange={(open) => {
                setIsAddDialogOpen(open);
                if (!open) resetForm();
              }}
            >
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Edit Item</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-sm font-medium border-b pb-2">
                      Item Information
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Item Name *</Label>
                        <Input
                          id="name"
                          required
                          value={formData.name}
                          onChange={(e) => {
                            const newName = e.target.value;
                            setFormData((prev) => ({
                              ...prev,
                              name: newName,
                              skuProductPart: !prev.isPrdManuallyEdited
                                ? skuProductPart(newName)
                                : prev.skuProductPart,
                            }));
                          }}
                          placeholder="Enter item name"
                        />
                      </div>
                      <div className="space-y-2 col-span-2">
                        <Label>Brands</Label>
                        <MultiSearchableSelect
                          options={brandOptions}
                          value={formData.brandIds}
                          onValueChange={(val) =>
                            setFormData({
                              ...formData,
                              brandIds: val,
                            })
                          }
                          placeholder="Select brands"
                          searchPlaceholder="Search brands..."
                        />
                        {brands.length === 0 && (
                          <p className="text-xs text-muted-foreground">
                            No brands found. Go to Manage Brands to create some.
                          </p>
                        )}
                      </div>
                      <div className="col-span-2 space-y-2">
                        <div
                          className={`flex items-center border rounded-md overflow-hidden h-10 ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 ${formData.skuNotApplicable ? "bg-muted opacity-50 pointer-events-none" : "bg-muted/50"}`}
                        >
                          <div className="px-3 h-full flex items-center bg-muted text-xs font-mono font-bold border-r">
                            FP
                          </div>
                          <div className="px-1 text-muted-foreground">-</div>
                          <div className="px-2 h-full flex items-center bg-muted text-xs font-mono min-w-[3ch] justify-center border-x">
                            {brands
                              .find((b) => formData.brandIds.includes(b.id))
                              ?.name.replace(/[^a-zA-Z0-9]/g, "")
                              .substring(0, 3)
                              .toUpperCase() || "NIL"}
                          </div>
                          <div className="px-1 text-muted-foreground">-</div>
                          <input
                            className="px-2 h-full w-16 flex items-center bg-background text-xs font-mono text-center outline-none border-x focus:bg-accent disabled:bg-muted"
                            value={formData.skuProductPart}
                            disabled={formData.skuNotApplicable}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                skuProductPart: e.target.value
                                  .replace(/[^a-zA-Z0-9]/g, "")
                                  .toUpperCase()
                                  .substring(0, 6),
                                isPrdManuallyEdited: true,
                              })
                            }
                            placeholder="PRD"
                          />
                          <div className="px-1 text-muted-foreground">-</div>
                          <input
                            className="px-3 h-full flex-1 min-w-0 bg-background text-xs font-mono font-bold text-primary outline-none focus:bg-accent disabled:bg-muted"
                            value={formData.code}
                            disabled={formData.skuNotApplicable}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                code: e.target.value
                                  .replace(/[^a-zA-Z0-9]/g, "")
                                  .toUpperCase(),
                              })
                            }
                            placeholder="SUFFIX"
                          />
                        </div>
                        <div className="flex items-center space-x-2 ml-1">
                          <Checkbox
                            id="skuNotApplicable"
                            checked={formData.skuNotApplicable}
                            onCheckedChange={(checked) =>
                              setFormData({
                                ...formData,
                                skuNotApplicable: !!checked,
                              })
                            }
                          />
                          <Label
                            htmlFor="skuNotApplicable"
                            className="text-[10px] font-normal cursor-pointer"
                          >
                            SKU is not applicable
                          </Label>
                        </div>
                        <p className="ml-1 text-[10px] text-muted-foreground">
                          {formData.skuNotApplicable
                            ? "SKU is marked as not applicable."
                            : "Format: FP-[BRAND]-[PRODUCT]-[SUFFIX]. Product & Suffix are editable."}
                        </p>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="price">Default Rate (₹)</Label>
                        <Input
                          id="price"
                          type="number"
                          step="0.01"
                          value={formData.price}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              price: e.target.value,
                            })
                          }
                          placeholder="Enter default rate"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="defaultGstPct">Default GST %</Label>
                        <Select
                          value={formData.defaultGstPct}
                          onValueChange={(value) =>
                            setFormData({ ...formData, defaultGstPct: value })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="0">0%</SelectItem>
                            <SelectItem value="5">5%</SelectItem>
                            <SelectItem value="18">18%</SelectItem>
                            <SelectItem value="28">28%</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          description: e.target.value,
                        })
                      }
                      placeholder="Enter item description"
                      rows={3}
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setIsAddDialogOpen(false);
                        resetForm();
                      }}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting && (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      )}
                      {editingItem ? "Update" : "Add"} Item
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>

            <Dialog
              open={isViewDialogOpen}
              onOpenChange={(open) => {
                setIsViewDialogOpen(open);
                if (!open) setViewingItem(null);
              }}
            >
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>View Item Details</DialogTitle>
                </DialogHeader>

                {viewingItem && (
                  <div className="space-y-6">
                    <div className="space-y-4">
                      <h3 className="text-sm font-medium border-b pb-2">
                        Item Information
                      </h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Item Name</Label>
                          <Input
                            value={viewingItem.name}
                            readOnly
                            className="bg-muted"
                          />
                        </div>
                        <div className="col-span-2 space-y-2">
                          <Label>Brands</Label>
                          <div className="flex flex-wrap gap-1.5 max-w-[400px]">
                            {viewingItem.brands &&
                            viewingItem.brands.length > 0 ? (
                              viewingItem.brands.map((brand) => (
                                <span
                                  key={brand.id}
                                  className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary border border-primary/20 whitespace-nowrap"
                                >
                                  {brand.name}
                                </span>
                              ))
                            ) : (
                              <span className="text-sm text-muted-foreground">
                                -
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label>SKU</Label>
                          <Input
                            value={viewingItem.sku || "-"}
                            readOnly
                            className="bg-muted"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Default Rate (₹)</Label>
                          <Input
                            value={viewingItem.price ?? "-"}
                            readOnly
                            className="bg-muted"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Default GST %</Label>
                          <Input
                            value={`${viewingItem.defaultGstPct}%`}
                            readOnly
                            className="bg-muted"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Description</Label>
                      <Textarea
                        value={viewingItem.description || "-"}
                        readOnly
                        className="bg-muted"
                        rows={3}
                      />
                    </div>

                    <div className="flex justify-end gap-2 pt-4 border-t">
                      <Button
                        variant="outline"
                        onClick={() => setIsViewDialogOpen(false)}
                      >
                        Close
                      </Button>
                      <Button
                        onClick={() => {
                          setIsViewDialogOpen(false);
                          handleEdit(viewingItem);
                        }}
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Item
                      </Button>
                    </div>
                  </div>
                )}
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <OMFilterCard
          subtitle={`Showing ${filteredItems.length} of ${items.length} items`}
          searchPlaceholder="Search by name or SKU..."
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          sortBy={sortBy}
          onSortChange={setSortBy}
          sortOptions={ITEM_SORT_OPTIONS}
          sortNameLabel="Item Name"
          showFilters={showFilters}
          setShowFilters={setShowFilters}
          onReset={resetFiltersAll}
        >
          <ItemFilters
            filters={filters}
            setFilters={setFilters}
            brandOptions={brandOptions}
          />
          <OMActiveFilters
            activeFilters={activeFilters}
            onRemove={removeFilter}
            onClearAll={resetFiltersAll}
          />
        </OMFilterCard>

        <OMDataTable
          data={filteredItems}
          isLoading={isLoading}
          columnCount={7}
          emptyMessage="No items found"
          onRowClick={(item) => handleView(item)}
          header={
            <TableRow>
              <OMSortableHeader
                title="Item Name"
                currentSort={sortBy}
                onSort={setSortBy}
                ascOption="name_asc"
                descOption="name_desc"
              />
              <OMSortableHeader
                title="Brand"
                currentSort={sortBy}
                onSort={setSortBy}
                ascOption="brand_asc"
                descOption="brand_desc"
              />
              <OMSortableHeader
                title="SKU"
                currentSort={sortBy}
                onSort={setSortBy}
                ascOption="sku_asc"
                descOption="sku_desc"
              />
              <OMSortableHeader
                title="Default Rate"
                currentSort={sortBy}
                onSort={setSortBy}
                ascOption="rate_asc"
                descOption="rate_desc"
              />
              <OMSortableHeader
                title="Default GST"
                currentSort={sortBy}
                onSort={setSortBy}
                ascOption="gst_asc"
                descOption="gst_desc"
              />
              <OMSortableHeader
                title="Total Ordered"
                currentSort={sortBy}
                onSort={setSortBy}
                ascOption="total_ordered_asc"
                descOption="total_ordered_desc"
                className="text-right"
              />
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          }
          renderRow={(item: OMProduct) => (
            <TableRow key={item.id}>
              <TableCell>
                <div>
                  <div className="font-medium">{item.name}</div>
                  {item.description && (
                    <div className="text-sm text-muted-foreground">
                      {item.description}
                    </div>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex flex-wrap gap-1 max-w-[200px]">
                  {item.brands && item.brands.length > 0 ? (
                    item.brands.map((brand) => (
                      <span
                        key={brand.id}
                        className="inline-flex items-center rounded-full bg-muted px-1.5 py-0.5 text-[10px] font-medium border whitespace-nowrap"
                      >
                        {brand.name}
                      </span>
                    ))
                  ) : (
                    <span className="text-muted-foreground">-</span>
                  )}
                </div>
              </TableCell>
              <TableCell>{item.sku || "-"}</TableCell>
              <TableCell>
                {item.price ? `₹${item.price.toLocaleString("en-IN")}` : "-"}
              </TableCell>
              <TableCell>{item.defaultGstPct}%</TableCell>
              <TableCell className="text-right">
                {item.totalOrdered ?? 0}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleView(item);
                    }}
                    title="View Item"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEdit(item);
                    }}
                    title="Edit Item"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(item.id);
                    }}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          )}
        />

        <DeleteConfirmationDialog
          isOpen={isDeleteDialogOpen}
          onOpenChange={setIsDeleteDialogOpen}
          onConfirm={onConfirmDelete}
          isLoading={isDeleting}
          title="Delete Item"
          description="Are you sure you want to delete this item? This action cannot be undone."
        />
      </div>
    </Layout>
  );
}
