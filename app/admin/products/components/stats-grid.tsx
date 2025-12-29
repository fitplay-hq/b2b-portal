import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Product } from "@/lib/generated/prisma";
import { Package, AlertTriangle } from "lucide-react";
import { useMemo } from "react";

interface StatsGridProps {
  products: Product[];
}

export function StatsGrid({ products }: StatsGridProps) {
  const stats = useMemo(() => {
    const lowStock = products.filter(
      (p) => p.availableStock < 50 && p.availableStock > 0
    ).length;
    const outOfStock = products.filter((p) => p.availableStock === 0).length;
    return { lowStock, outOfStock, total: products.length };
  }, [products]);

  return (
    <div className="w-full overflow-x-hidden">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
      <StatCard
        title="Total Products"
        value={stats.total}
        icon={Package}
        description="In catalog"
      />
      <StatCard
        title="Low Stock"
        value={stats.lowStock}
        icon={AlertTriangle}
        description="Below 50 units"
        iconColor="text-yellow-600"
      />
      <StatCard
        title="Out of Stock"
        value={stats.outOfStock}
        icon={AlertTriangle}
        description="Need restocking"
        iconColor="text-red-600"
      />
    </div>
    </div>
  );
}

// A smaller, reusable card component for the grid
function StatCard({
  title,
  value,
  icon: Icon,
  description,
  iconColor = "text-muted-foreground",
}: {
  title: string;
  value: number;
  icon: React.ElementType;
  description: string;
  iconColor?: string;
}) {
  return (
    <Card>
      <CardHeader>
        <CardDescription>{title}</CardDescription>
        <CardTitle className="text-2xl font-bold">{value}</CardTitle>
        <CardAction>
          <Icon className={`h-6 w-6 ${iconColor}`} />
        </CardAction>
      </CardHeader>
      <CardFooter>
        <p className="text-sm text-muted-foreground font-medium">
          {description}
        </p>
      </CardFooter>
    </Card>
  );
}
