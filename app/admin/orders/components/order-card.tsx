import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ImageWithFallback } from "@/components/image";
import {
  ChevronDown,
  Clock,
  CheckCircle,
  Package,
  XCircle,
  Building2,
  Calendar,
  Download,
  ExternalLink,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { AdminOrder } from "@/data/order/admin.actions";
import { Order } from "@/lib/generated/prisma";
import Link from "next/link";

// --- Helper Function ---
// A utility to get style and icon based on order status
const getStatusVisuals = (
  status: Order["status"]
): { color: string; Icon: LucideIcon } => {
  switch (status) {
    case "PENDING":
      return {
        color: "border-transparent bg-yellow-100 text-yellow-800",
        Icon: Clock,
      };
    case "APPROVED":
      return {
        color: "border-transparent bg-blue-100 text-blue-800",
        Icon: CheckCircle,
      };
    case "CANCELLED":
      return {
        color: "border-transparent bg-red-100 text-red-800",
        Icon: XCircle,
      };
  }
};

// --- Sub-component for the Card's Visible Header ---
const OrderSummary = ({ order }: { order: AdminOrder }) => {
  const { color, Icon } = getStatusVisuals(order.status);
  const statusText =
    order.status.charAt(0).toUpperCase() +
    order.status.slice(1).replace("-", " ");

  return (
    <div className="flex w-full items-start justify-between gap-4">
      <div className="space-y-1">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <CardTitle className="text-lg">{order.id}</CardTitle>
          <Badge className={color}>
            <Icon className="mr-1.5 h-4 w-4" />
            {statusText}
          </Badge>
        </div>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <Building2 className="h-3 w-3" />
            {order.client.companyName}
          </span>
          <span className="flex items-center gap-1.5">
            <Calendar className="h-3 w-3" />
            {new Date(order.createdAt).toLocaleDateString()}
          </span>
          <span className="flex items-center gap-1.5">
            <Package className="h-3 w-3" />
            {order.orderItems.length} items
          </span>
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-2 text-muted-foreground">
        <span>Details</span>
        <ChevronDown className="h-4 w-4 transition-transform duration-200 group-data-[state=open]:rotate-180" />
      </div>
    </div>
  );
};

// --- Sub-component for the Expandable Details ---
const OrderDetails = ({
  order,
  onOpenStatusDialog,
}: {
  order: AdminOrder;
  onOpenStatusDialog: () => void;
}) => (
  <CardContent className="pt-0">
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-2 border-b pb-4">
        <Link href={`/admin/orders/${order.id}`}>
          <Button size="sm" variant="secondary">
            <ExternalLink className="mr-2 h-4 w-4" />
            View Details
          </Button>
        </Link>
        <Button size="sm" onClick={onOpenStatusDialog}>
          Update Status
        </Button>
        {order.status === "PENDING" && (
          <Link href={`/admin/orders/${order.id}/approve`}>
            <Button size="sm" variant="default">
              <CheckCircle className="mr-2 h-4 w-4" />
              Approve Order
            </Button>
          </Link>
        )}
        <Button size="sm" variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Export PDF
        </Button>
      </div>
      <div>
        <h4 className="mb-3 font-medium">Order Items</h4>
        <div className="space-y-3">
          {order.orderItems.map((item) => (
            <div
              key={item.product.id}
              className="flex gap-3 rounded-lg bg-muted/40 p-3"
            >
              <ImageWithFallback
                src={item.product.images[0]}
                alt={item.product.name}
                className="h-16 w-16 rounded object-cover"
              />
              <div>
                <p className="font-medium">{item.product.name}</p>
                <p className="text-sm text-muted-foreground">
                  SKU: {item.product.sku}
                </p>
                <p className="text-sm">Quantity: {item.quantity}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-x-4 gap-y-6 pt-4 border-t md:grid-cols-2">
        <div>
          <h4 className="font-medium mb-2">Delivery Address</h4>
          <p className="text-sm text-muted-foreground whitespace-pre-line">
            {order.deliveryAddress}
          </p>
        </div>
        <div>
          <h4 className="font-medium mb-2">Billing Contact</h4>
          <p className="text-sm text-muted-foreground">{order.client.email}</p>
        </div>
        {order.note && (
          <div className="md:col-span-2">
            <h4 className="font-medium mb-2">Notes from Client</h4>
            <p className="text-sm text-muted-foreground whitespace-pre-line">
              {order.note}
            </p>
          </div>
        )}
        <div className="md:col-span-2">
          <h4 className="font-medium mb-2">Order Timeline</h4>
          <div className="text-sm text-muted-foreground space-y-1">
            <p>
              <strong>Created:</strong>{" "}
              {new Date(order.createdAt).toLocaleString()}
            </p>
            <p>
              <strong>Last Updated:</strong>{" "}
              {new Date(order.updatedAt).toLocaleString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  </CardContent>
);

// --- Main Collapsible Container Component ---
interface OrderCardProps {
  order: AdminOrder;
  isExpanded: boolean;
  onToggleExpansion: () => void;
  onOpenStatusDialog: () => void;
}

export function OrderCard({
  order,
  isExpanded,
  onToggleExpansion,
  onOpenStatusDialog,
}: OrderCardProps) {
  return (
    <Card>
      <Collapsible open={isExpanded} onOpenChange={onToggleExpansion}>
        <CollapsibleTrigger asChild>
          <div className="group cursor-pointer transition-colors hover:bg-muted/50">
            <CardHeader>
              <OrderSummary order={order} />
            </CardHeader>
          </div>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <OrderDetails order={order} onOpenStatusDialog={onOpenStatusDialog} />
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}
