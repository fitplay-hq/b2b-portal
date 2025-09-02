import { Prisma, Product } from "@/lib/generated/prisma";
import { MOCK_ORDERS } from "@/lib/mockData";

export async function getOrders(url: string) {
  return MOCK_ORDERS
  // const response = await fetch(url);
  // if (!response.ok) {
  //   throw new Error("Failed to update product");
  // }
  // return await response.json()
}

export async function createOrder(url: string, orderData: any) {
  // const response = await fetch(url, {
  //   method: "POST",
  //   headers: { "Content-Type": "application/json" },
  //   body: JSON.stringify(orderData),
  // });
  // if (!response.ok) {
  //   throw new Error("Failed to create product");
  // }
  // return await response.json();
}

export async function updateOrder(url: string, orderData: Prisma.ProductUpdateInput) {
  // const response = await fetch(url, {
  //   method: "PATCH",
  //   headers: { "Content-Type": "application/json" },
  //   body: JSON.stringify(orderData),
  // });
  // if (!response.ok) {
  //   throw new Error("Failed to update product");
  // }
  // return await response.json();
}

export async function deleteOrder(url: string, orderId: string) {
  // const response = await fetch(`url?id=${orderId}`, {
  //   method: "DELETE",
  // });
  // if (!response.ok) {
  //   throw new Error("Failed to delete product");
  // }
  // return await response.json();
}
