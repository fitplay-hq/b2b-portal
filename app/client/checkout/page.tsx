"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Layout from "@/components/layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { ImageWithFallback } from "@/components/image";
import { ArrowLeft, FileText, Loader2 } from "lucide-react";
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
import { Prisma } from "@/lib/generated/prisma";
import { createOrder } from "@/data/order/admin.actions";

export default function ClientCheckout() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);

  // Form state
  const [poNumber, setPONumber] = useState("");
  const [consigneeName, setConsigneeName] = useState("");
  const [consigneePhone, setConsigneePhone] = useState("");
  const [consigneeEmail, setConsigneeEmail] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [pincode, setPincode] = useState("");
  const [deliveryReference, setDeliveryReference] = useState("");
  const [modeOfDelivery, setModeOfDelivery] = useState<"AIR" | "SURFACE">(
    "SURFACE"
  );
  const [requiredByDate, setRequiredByDate] = useState<string>("");
  const [note, setNote] = useState("");

  useEffect(() => {
    if (!session || !session.user) {
      setCartItems([]);
    } else {
      const cart = getStoredData<CartItem[]>(
        `fitplay_cart_${session.user.id}`,
        []
      );
      if (cart.length === 0) {
        router.push("/client/cart");
        toast.error("Your cart is empty");
      }

      setCartItems(cart);
    }
    // Client info is now displayed as read-only, no pre-filling needed
  }, [session?.user?.name, session?.user?.email]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!consigneeName.trim()) {
      toast.error("Please enter consignee name");
      return;
    }

    if (!consigneePhone.trim()) {
      toast.error("Please enter consignee phone number");
      return;
    }

    if (!consigneeEmail.trim()) {
      toast.error("Please enter consignee email");
      return;
    }

    if (!deliveryAddress.trim()) {
      toast.error("Please enter a delivery address");
      return;
    }

    if (!city.trim()) {
      toast.error("Please enter city");
      return;
    }

    if (!state.trim()) {
      toast.error("Please enter state");
      return;
    }

    if (!pincode.trim()) {
      toast.error("Please enter pincode");
      return;
    }

    if (!requiredByDate.trim()) {
      toast.error("Please select a required by date");
      return;
    }

    setLoading(true);

    try {
      const _orderItems: Prisma.OrderItemCreateManyOrderInput[] = cartItems.map(
        (item) => ({
          productId: item.product.id,
          price: item.product.price ?? 0,
          quantity: item.quantity,
        })
      );

      // Convert date string to ISO DateTime format for Prisma
      const dateTimeForPrisma = requiredByDate
        ? new Date(requiredByDate + "T23:59:59.999Z").toISOString()
        : new Date().toISOString();

      const _order = {
        consigneeName: consigneeName.trim(),
        consigneePhone: consigneePhone.trim(),
        consigneeEmail: consigneeEmail.trim(),
        deliveryAddress: deliveryAddress.trim(),
        deliveryReference: deliveryReference.trim(),
        city: city.trim(),
        state: state.trim(),
        pincode: pincode.trim(),
        modeOfDelivery,
        requiredByDate: dateTimeForPrisma,
        note: note.trim() || null,
        items: _orderItems,
      };

      await createOrder("/api/clients/orders/order", _order);

      // Clear the cart after successful order creation
      setStoredData(`fitplay_cart_${session?.user.id}`, []);

      toast.success("Dispatch Order created successfully!");
      router.push("/client/orders");
    } catch (error) {
      toast.error("Failed to create dispatch order");
    } finally {
      setLoading(false);
    }
  };

  // Handle authentication loading state
  if (status === "loading") {
    return (
      <Layout title="Checkout" isClient>
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </Layout>
    );
  }

  // Handle unauthenticated users
  if (status === "unauthenticated" || !session?.user) {
    return (
      <Layout title="Checkout" isClient>
        <div className="text-center py-8">
          <p className="text-muted-foreground">
            Please sign in to continue to checkout
          </p>
        </div>
      </Layout>
    );
  }

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
                        src={item.product.images[0]}
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
                          {item.product.price && (
                            <p className="text-sm font-medium">
                              Price: ₹{item.product.price}
                            </p>
                          )}
                          <p className="text-sm font-medium">Product Item</p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2"></div>

                        <div className="text-right">
                          <p className="font-medium">Qty: {item.quantity}</p>
                          {item.product.price && (
                            <p className="font-medium">
                              Total: ₹
                              {(item.product.price * item.quantity).toFixed(2)}
                            </p>
                          )}
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

            <Card>
              <CardHeader>
                <CardTitle>Order Reference</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 py-1">
                <Input
                  id="deliveryReference"
                  value={deliveryReference}
                  onChange={(e) => setDeliveryReference(e.target.value)}
                  placeholder="Any order reference for future use"
                />
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
                    placeholder="Enter complete delivery address"
                    rows={4}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">City *</Label>
                    <Input
                      id="city"
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="City"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="state">State *</Label>
                    <Input
                      id="state"
                      type="text"
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      placeholder="State"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="pincode">Pincode *</Label>
                    <Input
                      id="pincode"
                      type="number"
                      value={pincode}
                      maxLength={6}
                      onChange={(e) => setPincode(e.target.value)}
                      placeholder="PIN Code"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="requiredByDate">Required By Date *</Label>
                  <Input
                    id="requiredByDate"
                    value={requiredByDate}
                    onChange={(e) => setRequiredByDate(e.target.value)}
                    placeholder="Select required delivery date"
                    type="date"
                    required
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Packaging Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="modeOfDelivery">Mode of Delivery *</Label>
                  <Select
                    value={modeOfDelivery}
                    onValueChange={(value: "AIR" | "SURFACE") =>
                      setModeOfDelivery(value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select delivery mode" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="SURFACE">Surface</SelectItem>
                      <SelectItem value="AIR">Air</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="note">Additional Notes (Optional)</Label>
                  <Textarea
                    id="note"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Special delivery instructions, timeline requirements, etc."
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Consignee Information */}
            <Card>
              <CardHeader>
                <CardTitle>Consignee Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="consigneeName">Consignee Name * </Label>
                  <Input
                    id="consigneeName"
                    type="text"
                    value={consigneeName}
                    onChange={(e) => setConsigneeName(e.target.value)}
                    placeholder="Enter consignee name"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="consigneePhone">Phone Number *</Label>
                  <Input
                    id="consigneePhone"
                    type="tel"
                    value={consigneePhone}
                    onChange={(e) => setConsigneePhone(e.target.value)}
                    placeholder="10-digit phone number"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="consigneeEmail">Email Address *</Label>
                  <Input
                    id="consigneeEmail"
                    type="email"
                    value={consigneeEmail}
                    onChange={(e) => setConsigneeEmail(e.target.value)}
                    placeholder="consignee@example.com"
                    required
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
                        src={item.product.images[0]}
                        alt={item.product.name}
                        className="w-full h-full object-cover rounded"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {item.product.name}
                      </p>
                      {item.product.price && (
                        <div className="text-xs text-muted-foreground">
                          ₹{item.product.price} x {item.quantity} = ₹
                          {(item.product.price * item.quantity).toFixed(2)}
                        </div>
                      )}
                    </div>
                    <div className="text-sm font-medium">
                      Qty: {item.quantity}
                    </div>
                  </div>
                ))}

                <Separator />

                <div className="flex justify-between font-medium">
                  <span>Total Items</span>
                  <span>
                    {cartItems.reduce((sum, item) => sum + item.quantity, 0)}
                  </span>
                </div>
                {(() => {
                  const totalAmount = cartItems.reduce(
                    (sum, item) =>
                      sum +
                      (item.product.price
                        ? item.product.price * item.quantity
                        : 0),
                    0
                  );
                  return totalAmount > 0 ? (
                    <div className="flex justify-between font-medium">
                      <span>Total Amount</span>
                      <span>₹{totalAmount.toFixed(2)}</span>
                    </div>
                  ) : null;
                })()}
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
