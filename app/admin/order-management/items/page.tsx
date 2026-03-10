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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import type { OMProduct, OMBrand } from "@/types/order-management";
import { DeleteConfirmationDialog } from "@/components/delete-confirmation-dialog";
import { OMNewItemDialog } from "@/components/orderManagement/OMNewItemDialog";

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
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<OMProduct | null>(null);
  const [viewingItem, setViewingItem] = useState<OMProduct | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      price: formData.price ? parseFloat(formData.price) : undefined,
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

  const filteredItems = items.filter(
    (item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.sku || "").toLowerCase().includes(searchQuery.toLowerCase()),
  );

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
      `items_${new Date().toISOString().split("T")[0]}.csv`,
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
    doc.save(`items_${new Date().toISOString().split("T")[0]}.pdf`);
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

        <Card>
          <CardHeader>
            <CardTitle>Item List</CardTitle>
            <CardDescription>
              Total {items.length} items in catalog
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name or SKU..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item Name</TableHead>
                    <TableHead>Brand</TableHead>
                    <TableHead>SKU</TableHead>
                    <TableHead>Default Rate</TableHead>
                    <TableHead>Default GST</TableHead>
                    <TableHead className="text-right">Total Ordered</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    [...Array(5)].map((_, i) => (
                      <TableRow key={i}>
                        <TableCell>
                          <Skeleton className="h-4 w-32" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-4 w-40" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-4 w-24" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-4 w-12" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-4 w-32" />
                        </TableCell>
                        <TableCell className="text-right">
                          <Skeleton className="h-4 w-16 ml-auto" />
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Skeleton className="h-8 w-8" />
                            <Skeleton className="h-8 w-8" />
                            <Skeleton className="h-8 w-8" />
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : filteredItems.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={7}
                        className="text-center text-muted-foreground py-8"
                      >
                        No items found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredItems.map((item) => (
                      <TableRow
                        key={item.id}
                        className="cursor-pointer hover:bg-muted/50"
                        onClick={() => handleView(item)}
                      >
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
                          {item.price
                            ? `₹${item.price.toLocaleString("en-IN")}`
                            : "-"}
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
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

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
