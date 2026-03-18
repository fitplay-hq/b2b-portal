import Layout from "@/components/layout";
import { ReactNode } from "react";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <Layout isClient={false}>
      {children}
    </Layout>
  );
}
