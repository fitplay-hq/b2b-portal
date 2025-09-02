import { MOCK_ORDERS } from "@/lib/mockData";

export async function getOrders(url: string) {
  return MOCK_ORDERS
  // const response = await fetch(url);
  // if (!response.ok) {
  //   throw new Error("Failed to update order");
  // }
  // return await response.json();
}
