import AdminDashboard from "@/components/pages/admin-dashboard";
import { getProducts } from "@/lib/actions";

export default async function Page() {
  const products = await getProducts();

  return <AdminDashboard products={products} />;
}

export const revalidate = 0;
