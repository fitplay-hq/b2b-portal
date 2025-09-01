import ClientProducts from "@/components/pages/client-products";
import { getProducts } from "@/lib/actions";

export default async function Page() {
  const products = await getProducts();

  return <ClientProducts products={products} />;
}
