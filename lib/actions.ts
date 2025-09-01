import { revalidatePath } from "next/cache";
import { Prisma, Product } from "./generated/prisma/index";

export async function getProducts() {
  const response = await fetch("http://localhost:3000/api/admin/products");
  const products = (await response.json()) as any as Product[];
  
  return products
}

export async function updateProduct(data: Prisma.ProductCreateInput) {
  await fetch("http://localhost:3000/api/admin/products/product", {
    method: "POST",
    body: JSON.stringify(data)
  })
  revalidatePath("/admin/products")
}
