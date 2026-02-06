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
    bundleOrderItems?: {
      id: string;
      quantity: number;
      price: number;
      bundleId: string;
      orderId: string;
      
  product: {                     // ✅ ADD THIS
    id: string;
    name: string;
    images: string[];
    sku: string;
    price: number;
  };
      bundle?: {
        id: string;
        price: number;
        items: {
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
        }[];
      };
    }[]
    numberOfBundles?: number;
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
    shippingLabelUrl: string | null;
    status: $Enums.Status;
    consignmentNumber: string | null;
    deliveryService: string | null;
    isMailSent: boolean;
    clientId: string;
    createdAt: Date;
    updatedAt: Date;
    emails: {
        id: string;
        purpose: $Enums.Status;
        isSent: boolean;
        sentAt: Date | null;
        createdAt: Date;
    }[];
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

export async function updateOrderStatus(url: string, data: { orderId: string; status: $Enums.Status; consignmentNumber?: string; deliveryService?: string }) {
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

export async function sendOrderEmail(url: string, data: { orderId: string; clientEmail: string }) {
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error("Failed to send email");
  }
  return await response.json();
}

export async function sendStatusEmail(url: string, data: { orderId: string; status: $Enums.Status }) {
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error("Failed to send status email");
  }
  return await response.json();
}
