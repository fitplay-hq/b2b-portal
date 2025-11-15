import { Prisma, Product } from "@/lib/generated/prisma";

export async function getProducts(url: string) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Failed to update product");
  }
  return await response.json() as Product[];
}

export async function createProducts(url: string, productsData: Prisma.ProductCreateInput[]) {
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(productsData),
  });
  if (!response.ok) {
    throw new Error("Failed to create products");
  }
  return await response.json();
}

export async function createProduct(url: string, productData: Prisma.ProductCreateInput) {
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(productData),
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    // console.error("Product creation error response:", errorData); // Debug log
    // console.error("Product data being sent:", productData); // Debug log
    
    let errorMessage = `Failed to create product (${response.status})`;
    if (errorData.error) {
      if (typeof errorData.error === 'string') {
        errorMessage = errorData.error;
      } else {
        errorMessage = JSON.stringify(errorData.error, null, 2);
      }
    }
    throw new Error(errorMessage);
  }
  return await response.json();
}

export async function updateProduct(url: string, productData: Prisma.ProductUpdateInput) {
  const response = await fetch(url, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(productData),
  });
  if (!response.ok) {
    throw new Error("Failed to update product");
  }
  return await response.json();
}

export async function deleteProduct(url: string, productId: string) {
  const response = await fetch(`${url}?id=${productId}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    throw new Error("Failed to delete product");
  }
  return await response.json();
}

type InventoryUpdate = {
  productId: string;
  quantity: number;
  direction: "incr" | "dec";
  inventoryUpdateReason: "NEW_PURCHASE" | "PHYSICAL_STOCK_CHECK" | "RETURN_FROM_PREVIOUS_DISPATCH";
};

export async function updateBulkInventory(url: string, inventoryUpdates: InventoryUpdate[]) {
  const response = await fetch(url, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(inventoryUpdates),
  });
  if (!response.ok) {
    throw new Error("Failed to update bulk inventory");
  }
  return await response.json();
}

export async function updateInventory(url: string, inventoryData: {
  productId: string;
  quantity: number;
  reason: string;
  direction: 1 | -1;
}) {
  const response = await fetch(url, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(inventoryData),
  });
  if (!response.ok) {
    throw new Error("Failed to update inventory");
  }
  return await response.json();
}