import ClientProducts from "@/components/pages/client-products";
import { Product } from "@/lib/generated/prisma";
import { getServerSession } from "next-auth";

export default async function Page() {
  const response = await fetch("http://localhost:3000/api/admin/products");
  const products = (await response.json()) as any as Product[];

  return <ClientProducts products={products} />;
}
