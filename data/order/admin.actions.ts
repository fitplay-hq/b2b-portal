import { $Enums, Order, Prisma } from "@/lib/generated/prisma";

export interface AdminOrder {
    client: {
        name: string;
        id: string;
        email: string;
        companyName: string;
        company: {
            id: string;
            name: string;
            address: string;
        };
    };
    orderItems: {
      product: {
          name: string;
          id: string;
          images: string[];
          sku: string;
          price: number;
      };
      id: string;
      quantity: number;
      price: number;
      productId: string;
      orderId: string;
    }[]
    id: string;
    totalAmount: number;
    consigneeName: string;
    consigneePhone: string;
    consigneeEmail: string;
    deliveryAddress: string;
    city: string;
    state: string;
    pincode: string;
    modeOfDelivery: $Enums.Modes;
    deliveryReference: string | null;
    packagingInstructions: string | null;
    note: string | null;
    status: $Enums.Status;
    clientId: string;
    createdAt: Date;
    updatedAt: Date;
}

export async function getOrders(url: string) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Failed to get products");
  }
  return await response.json() as AdminOrder[]
}

export async function getOrder(url: string, id: string) {
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error("Failed to get product")
  }
  return await response.json() as AdminOrder
}

export async function createOrder(url: string, orderData: any) {
  console.log(orderData)
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(orderData),
  });
  if (!response.ok) {
    throw new Error("Failed to create product");
  }
  return await response.json();
}

export async function updateOrderStatus(url: string, data: { orderId: string; status: $Enums.Status }) {
  const response = await fetch(url, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error("Failed to create product");
  }
  return await response.json();
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
