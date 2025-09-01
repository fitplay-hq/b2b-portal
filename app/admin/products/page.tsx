import AdminProducts from "@/components/pages/admin-products";
import { getProducts } from "@/lib/actions";

export default async function Page() {
  const products = await getProducts();

  return <AdminProducts products={products} />;
}

export const revalidate = 0; // ISR off, always dynamic
