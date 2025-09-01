import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className={`h-4 w-4 ${iconColor}`} />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}
