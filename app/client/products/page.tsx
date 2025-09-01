"use client";

import { useState, useEffect } from "react";
import Layout from "@/components/layout";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { ShoppingCart, Search, Filter, Plus, Minus } from "lucide-react";
import { toast } from "sonner";
import {
  MOCK_PRODUCTS,
  PRODUCT_CATEGORIES,
  Product,
  CartItem,
  getStoredData,
  setStoredData,
} from "@/lib/mockData";
import { ImageWithFallback } from "@/components/image";

export default function ClientProducts() {
  const user = {
    id: "1",
    email: "client@acmecorp.com",
    name: "John Smith",
    role: "client",
    company: "ACME Corporation",
  };

  const [products] = useState<Product[]>(MOCK_PRODUCTS);
  const [filteredProducts, setFilteredProducts] =
    useState<Product[]>(MOCK_PRODUCTS);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [quantityDialogOpen, setQuantityDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedQuantity, setSelectedQuantity] = useState(1);

  useEffect(() => {
    // Load cart items
    const cart = getStoredData<CartItem[]>(`fitplay_cart_${user?.id}`, []);
    setCartItems(cart);
  }, [user?.id]);

  useEffect(() => {
    // Filter products based on search and category
    let filtered = products;

    if (searchTerm) {
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.description.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    if (selectedCategory !== "All Categories") {
      filtered = filtered.filter(
        (product) => product.category === selectedCategory,
      );
    }

    setFilteredProducts(filtered);
  }, [products, searchTerm, selectedCategory]);

  const openQuantityDialog = (product: Product) => {
    setSelectedProduct(product);
    setSelectedQuantity(1);
    setQuantityDialogOpen(true);
  };

  const addToCart = (product: Product, quantity: number) => {
    const existingItemIndex = cartItems.findIndex(
      (item) => item.product.id === product.id,
    );
    let updatedCart: CartItem[];

    if (existingItemIndex >= 0) {
      // Update quantity if item already exists
      updatedCart = cartItems.map((item, index) =>
        index === existingItemIndex
          ? { ...item, quantity: item.quantity + quantity }
          : item,
      );
    } else {
      // Add new item to cart
      updatedCart = [...cartItems, { product, quantity }];
    }

    setCartItems(updatedCart);
    setStoredData(`fitplay_cart_${user?.id}`, updatedCart);
    toast.success(`${quantity} x ${product.name} added to cart`);
    setQuantityDialogOpen(false);
  };

  const getCartQuantity = (productId: string) => {
    const item = cartItems.find((item) => item.product.id === productId);
    return item ? item.quantity : 0;
  };

  const totalCartItems = cartItems.reduce(
    (sum, item) => sum + item.quantity,
    0,
  );

  const updateQuantity = (delta: number) => {
    if (!selectedProduct) return;
    const newQuantity = Math.max(
      1,
      Math.min(selectedQuantity + delta, selectedProduct.stock),
    );
    setSelectedQuantity(newQuantity);
  };

  return (
    <Layout title="Products" isClient>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Product Catalog</h1>
            <p className="text-muted-foreground">
              Browse and order from our complete product range
            </p>
          </div>
          <div className="flex items-center gap-2">
            <ShoppingCart className="h-4 w-4" />
            <span className="text-sm">
              {totalCartItems} item{totalCartItems !== 1 ? "s" : ""} in cart
            </span>
          </div>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Search products, SKUs, or descriptions..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="sm:w-48">
                <Select
                  value={selectedCategory}
                  onValueChange={setSelectedCategory}
                >
                  <SelectTrigger>
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {PRODUCT_CATEGORIES.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Results Info */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {filteredProducts.length} of {products.length} products
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => {
            const cartQuantity = getCartQuantity(product.id);
            const isInStock = product.stock > 0;

            return (
              <Card key={product.id} className="overflow-hidden">
                <CardHeader className="p-0">
                  <div className="aspect-square relative">
                    <ImageWithFallback
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                    {!isInStock && (
                      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                        <Badge variant="destructive">Out of Stock</Badge>
                      </div>
                    )}
                  </div>
                </CardHeader>

                <CardContent className="p-4">
                  <div className="space-y-2">
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-lg leading-tight">
                        {product.name}
                      </CardTitle>
                      <Badge variant="secondary" className="text-xs">
                        {product.category}
                      </Badge>
                    </div>

                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {product.description}
                    </p>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-lg font-bold">₹{product.price}</p>
                        <p className="text-xs text-muted-foreground">
                          SKU: {product.sku}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">
                          Stock: {product.stock}
                        </p>
                        {cartQuantity > 0 && (
                          <p className="text-xs text-blue-600">
                            {cartQuantity} in cart
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>

                <CardFooter className="p-4 pt-0">
                  <Button
                    onClick={() => openQuantityDialog(product)}
                    disabled={!isInStock}
                    className="w-full"
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    {isInStock ? "Add to Cart" : "Out of Stock"}
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>

        {/* No Results */}
        {filteredProducts.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center">
              <div className="space-y-2">
                <h3 className="text-lg font-medium">No products found</h3>
                <p className="text-muted-foreground">
                  Try adjusting your search terms or category filter
                </p>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedCategory("All Categories");
                  }}
                >
                  Clear Filters
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Quantity Dialog */}
        <Dialog open={quantityDialogOpen} onOpenChange={setQuantityDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Add to Cart</DialogTitle>
            </DialogHeader>

            {selectedProduct && (
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="w-16 h-16 flex-shrink-0">
                    <ImageWithFallback
                      src={selectedProduct.image}
                      alt={selectedProduct.name}
                      className="w-full h-full object-cover rounded"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium">{selectedProduct.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      ₹{selectedProduct.price} each
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {selectedProduct.stock} available
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Quantity</Label>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateQuantity(-1)}
                      disabled={selectedQuantity <= 1}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <Input
                      type="number"
                      value={selectedQuantity}
                      onChange={(e) => {
                        const value = parseInt(e.target.value) || 1;
                        setSelectedQuantity(
                          Math.max(1, Math.min(value, selectedProduct.stock)),
                        );
                      }}
                      className="w-24 text-center"
                      min="1"
                      max={selectedProduct.stock}
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateQuantity(1)}
                      disabled={selectedQuantity >= selectedProduct.stock}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Total: ₹
                    {(selectedProduct.price * selectedQuantity).toFixed(2)}
                  </p>
                </div>
              </div>
            )}

            <DialogFooter className="gap-2 sm:gap-0">
              <Button
                variant="outline"
                onClick={() => setQuantityDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={() =>
                  selectedProduct &&
                  addToCart(selectedProduct, selectedQuantity)
                }
              >
                Add to Cart
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
}
