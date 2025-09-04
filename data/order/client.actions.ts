import { Order } from "@/lib/generated/prisma";

export async function getOrders(url: string) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Failed to update order");
  }
  return await response.json() as Order[];
}
