"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis } from "recharts";
import { OMClientSummary } from "@/types/order-management";

interface DashboardChartsProps {
  statusBreakdown: { name: string; value: number; color: string }[];
  clientSummaryArray: OMClientSummary[];
}

export function DashboardCharts({ statusBreakdown, clientSummaryArray }: DashboardChartsProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {/* Status Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Status Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={statusBreakdown}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {statusBreakdown.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Top Clients by Value */}
      <Card>
        <CardHeader>
          <CardTitle>Client Order Value</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={clientSummaryArray}>
              <XAxis dataKey="clientName" tick={false} height={60} fontSize={12} />
              <YAxis />
              <Tooltip
                formatter={(value: any) =>
                  typeof value === "number" ? `₹${value.toLocaleString("en-IN")}` : value
                }
              />
              <Bar dataKey="value" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
