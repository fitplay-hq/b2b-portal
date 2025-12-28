import { Order, OrderItem, Product } from "@/lib/generated/prisma";

export type OrderWithItems = Order & {
  orderItems: (OrderItem & {
    product: Pick<Product, 'id' | 'name' | 'images' | 'price'>;
  })[];
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
    throw new Error("Failed to create order");
  }
  return await response.json();
}
