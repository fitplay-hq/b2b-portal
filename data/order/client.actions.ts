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
