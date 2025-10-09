import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string | number;
  description: string;
  Icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  color?: string;
  iconColor?: string;
  borderColor?: string;
}

export function MetricCard({
  title,
  value,
  description,
  Icon,
  trend,
  color = "bg-blue-50",
  iconColor = "text-blue-600",
  borderColor = "border-blue-100",
}: MetricCardProps) {
  return (
    <Card className={`border-2 ${borderColor} shadow-sm hover:shadow-lg transition-all duration-300 bg-white hover:scale-[1.02]`}>
      <CardContent className="p-4">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className={`p-2 rounded-lg ${color} border border-white/80 shadow-sm`}>
              <Icon className={`h-5 w-5 ${iconColor}`} />
            </div>
            {trend && trend.value > 0 && (
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold ${
                trend.isPositive 
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                  : 'bg-red-50 text-red-700 border border-red-200'
              }`}>
                {trend.isPositive ? '↗' : '↘'} {Math.abs(trend.value).toFixed(1)}%
              </span>
            )}
          </div>
          <div className="space-y-1">
            <p className="text-2xl font-bold text-gray-900 tracking-tight">
              {typeof value === 'number' ? value.toLocaleString() : value}
            </p>
            <p className="text-sm font-semibold text-gray-700">{title}</p>
            <p className="text-xs text-gray-500">{description}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}