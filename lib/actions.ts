import { revalidatePath } from "next/cache";
import { Prisma, Product } from "./generated/prisma/index";
import { baseUrl } from '@/lib/constants'
import prisma from "./prisma";

export async function getProducts() {
  const products = await prisma.product.findMany();
  
  return products
}

export async function updateProduct(data: Prisma.ProductCreateInput) {
  await fetch(`${baseUrl}/api/admin/products/product`, {
    method: "POST",
    body: JSON.stringify(data)
  })
  revalidatePath("/admin/products")
}
