import Link from "next/link";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LucideProps, Package, ShoppingCart, Users } from "lucide-react";
import { ForwardRefExoticComponent, RefAttributes } from "react";

export function QuickActions() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <ActionCard
        title="Manage Products"
        description="Add, edit, or update product inventory"
        href="/admin/products"
        Icon={Package}
      />
      <ActionCard
        title="Process Orders"
        description="Review and approve pending dispatch orders"
        href="/admin/orders"
        Icon={ShoppingCart}
      />
      <ActionCard
        title="Client Management"
        description="Manage client accounts and permissions"
        href="/admin/clients"
        Icon={Users}
      />
    </div>
  );
}

function ActionCard({
  title,
  description,
  href,
  Icon,
}: {
  title: string;
  description: string;
  href: string;
  Icon: ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
  >;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <Button asChild className="w-full">
          <Link href={href}>
            <Icon className="h-4 w-4 mr-2" />
            {title}
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}