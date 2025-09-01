import { Prisma } from "@/lib/generated/prisma";

export async function getProducts(url: string) {
  const response = await fetch("/api/admin/products");
  if (!response.ok) {
    throw new Error("Failed to update product");
  }
  return await response.json();
}

export async function createProduct(url: string, productData: Prisma.ProductCreateInput) {
  const response = await fetch("/api/admin/products/product", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(productData),
  });
  if (!response.ok) {
    throw new Error("Failed to create product");
  }
  return await response.json();
}

export async function updateProduct(url: string, productData: Prisma.ProductUpdateInput) {
  const response = await fetch("/api/admin/products/product", {
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
  const response = await fetch(`/api/admin/products/product?id=${productId}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    throw new Error("Failed to delete product");
  }
  return await response.json();
}
