"use client";

import { useState, useEffect } from "react";
import Layout from "@/components/layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { ImageWithFallback } from "@/components/image";
import { ArrowLeft, FileText } from "lucide-react";
import { toast } from "sonner";
import {
  CartItem,
  PurchaseOrder,
  getStoredData,
  setStoredData,
  generatePONumber,
  MOCK_ORDERS,
} from "@/lib/mockData";
import { useRouter } from "next/navigation";

export default function ClientCheckout() {
  const user = {
    id: "1",
    email: "client@acmecorp.com",
    name: "John Smith",
    role: "client",
    company: "ACME Corporation",
  };

  const router = useRouter();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);

  // Form state
  const [poNumber, setPONumber] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [billingContact, setBillingContact] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    const cart = getStoredData<CartItem[]>(`fitplay_cart_${user?.id}`, []);
    if (cart.length === 0) {
      router.push("/client/cart");
      toast.error("Your cart is empty");
    }

    setCartItems(cart);

    // Generate PO number
    setPONumber(generatePONumber());

    // Pre-fill billing contact with user info
    setBillingContact(`${user?.name} - ${user?.email}`);
  }, [user?.name, user?.email]);

  const calculateTotal = () => {
    return cartItems.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0
    );
  };

  const total = calculateTotal();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!deliveryAddress.trim()) {
      toast.error("Please enter a delivery address");
      return;
    }

    setLoading(true);

    try {
      // Create purchase order
      const newOrder: PurchaseOrder = {
        id: Date.now().toString(),
        clientId: user!.id,
        clientName: user!.name,
        clientEmail: user!.email,
        company: user!.company || "",
        items: cartItems,
        total,
        status: "pending",
        deliveryAddress: deliveryAddress.trim(),
        billingContact: billingContact.trim(),
        notes: notes.trim(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // Save order
      const existingOrders = getStoredData<PurchaseOrder[]>(
        "fitplay_orders",
        MOCK_ORDERS
      );
      const updatedOrders = [...existingOrders, newOrder];
      setStoredData("fitplay_orders", updatedOrders);

      // Clear cart
      setStoredData(`fitplay_cart_${user?.id}`, []);

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast.success("Dispatch Order created successfully!");
      router.push("/client/orders");
    } catch (error) {
      toast.error("Failed to create dispatch order");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout title="Checkout" isClient>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push("/client/cart")}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Cart
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Create Dispatch Order</h1>
            <p className="text-muted-foreground">
              Review your order and provide delivery details
            </p>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 lg:grid-cols-3 gap-6"
        >
          {/* Order Details Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* PO Information */}
            <Card>
              <CardHeader>
                <CardTitle>Dispatch Order Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {cartItems.map((item) => (
                  <div
                    key={item.product.id}
                    className="flex gap-4 p-4 border rounded-lg"
                  >
                    <div className="w-20 h-20 flex-shrink-0">
                      <ImageWithFallback
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-full h-full object-cover rounded"
                      />
                    </div>

                    <div className="flex-1 space-y-2">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-medium">{item.product.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            SKU: {item.product.sku}
                          </p>
                          <p className="text-sm font-medium">
                            ₹{item.product.price.toFixed(2)} each
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2"></div>

                        <div className="text-right">
                          <p className="font-medium">
                            ₹{(item.product.price * item.quantity).toFixed(2)}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {item.quantity} quantity
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Delivery Information */}
            <Card>
              <CardHeader>
                <CardTitle>Delivery Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="deliveryAddress">Delivery Address *</Label>
                  <Textarea
                    id="deliveryAddress"
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    placeholder="Enter complete delivery address including street, city, state, and ZIP code"
                    rows={4}
                    required
                  />
                </div>
              </CardContent>
            </Card>

            {/* Billing Information */}
            <Card>
              <CardHeader>
                <CardTitle>Billing Contact</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="billingContact">
                    Billing Contact Information
                  </Label>
                  <Input
                    id="billingContact"
                    value={billingContact}
                    onChange={(e) => setBillingContact(e.target.value)}
                    placeholder="Name and email for billing inquiries"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Additional Notes (Optional)</Label>
                  <Textarea
                    id="notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Special delivery instructions, timeline requirements, etc."
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            {/* Items Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {cartItems.map((item) => (
                  <div key={item.product.id} className="flex gap-3">
                    <div className="w-12 h-12 flex-shrink-0">
                      <ImageWithFallback
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-full h-full object-cover rounded"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {item.product.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        ₹{item.product.price} × {item.quantity}
                      </p>
                    </div>
                    <div className="text-sm font-medium">
                      ₹{(item.product.price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                ))}

                <Separator />

                <div className="flex justify-between font-medium">
                  <span>Total</span>
                  <span>₹{total.toFixed(2)}</span>
                </div>
              </CardContent>
            </Card>

            {/* Submit Button */}
            <Card>
              <CardContent className="p-4">
                <Button
                  type="submit"
                  className="w-full"
                  size="lg"
                  disabled={loading}
                >
                  <FileText className="h-4 w-4 mr-2" />
                  {loading ? "Creating DO..." : "Create Dispatch Order"}
                </Button>

                <div className="mt-4 text-xs text-muted-foreground text-center space-y-1">
                  <p>
                    Your dispatch order will be sent to Fitplay for approval.
                  </p>
                  <p>You will receive an email confirmation once submitted.</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </form>
      </div>
    </Layout>
  );
}
