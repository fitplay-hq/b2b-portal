import { Order, OrderItem, Product } from "@/lib/generated/prisma";

export type OrderWithItems = Order & {
  orderItems: (OrderItem & {
    product: Pick<Product, 'id' | 'name' | 'images' | 'price'>;
  })[];
  bundleOrderItems?: Array<{
    id: string;
    quantity: number;
    price: number;
    bundleId: string;
    orderId: string;
    bundle?: {
      id: string;
      price: number;
      items: Array<{
        id: string;
        productId: string;
        bundleProductQuantity: number;
        price: number;
        product: {
          id: string;
          name: string;
          images: string[];
          sku: string;
          price: number;
        };
      }>;
    };
  }>;
  numberOfBundles?: number;
};

export async function getOrders(url: string) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Failed to update order");
  }
  return await response.json() as OrderWithItems[];
}

export type CreateOrderData = {
  consigneeName: string;
  consigneePhone: string;
  consigneeEmail: string;
  city: string;
  state: string;
  pincode: string;
  requiredByDate: string;
  modeOfDelivery: string;
  deliveryAddress: string;
  deliveryReference?: string;
  packagingInstructions?: string;
  note?: string;
  items?: Array<{
    productId: string;
    quantity: number;
    price?: number;
  }>;
  bundleOrderItems?: Array<{
    productId: string;
    quantity: number;
    price?: number;
    bundleProductQuantity: number;
    bundleGroupId?: string;
    numberOfBundles?: number;
  }>;
  numberOfBundles?: number;
};

export async function createOrder(url: string, data: CreateOrderData) {
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    let errorMessage = "Failed to create order";
    try {
      const errorData = await response.json();
      if (errorData.error) {
        errorMessage = errorData.error;
      }
      if (errorData.details) {
        errorMessage += `: ${errorData.details}`;
      }
    } catch (e) {
      // If we can't parse the error response, use default message
      errorMessage = `Failed to create order (${response.status})`;
    }
    throw new Error(errorMessage);
  }
  return await response.json();
}
