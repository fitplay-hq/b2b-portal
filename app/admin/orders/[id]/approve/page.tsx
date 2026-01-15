"use client";

import React from "react";
import { useOrder, useUpdateOrderStatus } from "@/data/order/admin.hooks";
import { useParams, useRouter } from "next/navigation";
import Layout from "@/components/layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowLeft, Check } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import { formatStatus } from "@/lib/utils";

const ApproveOrderPage = () => {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const { order, error, isLoading } = useOrder(id);
  const { updateOrderStatus, isUpdating, updateError } = useUpdateOrderStatus();

  const handleApprove = async () => {
    try {
      await updateOrderStatus({
        orderId: id,
        status: "APPROVED",
      });
      toast.success("Order approved successfully.");
      router.push("/admin/orders");
    } catch (error) {
      toast.error("Failed to approve order.");
    }
  };

  if (error) {
    return (
      <Layout title="Approve Order" isClient={false}>
        <div className="text-center text-destructive">
          Failed to load order details. Please try again later.
        </div>
      </Layout>
    );
  }

  if (isLoading || !order) {
    return (
      <Layout title="Approve Order" isClient={false}>
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Approve Order" isClient={false}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-4 mb-2">
              <Link href="/admin/orders">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Orders
                </Button>
              </Link>
            </div>
            <h1 className="text-2xl font-bold">Approve Order</h1>
            <p className="text-muted-foreground">
              Review order #{order.id} before approval
            </p>
          </div>
          <Link href={`/admin/orders/${order.id}`}>
            <Button variant="outline">View Details</Button>
          </Link>
        </div>
        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle>Approve Order #{order.id}</CardTitle>
                <p className="text-sm text-muted-foreground">
                  {new Date(order.createdAt).toLocaleDateString('en-GB')}
                </p>
              </div>
              <Badge>{formatStatus(order.status)}</Badge>
            </div>
          </CardHeader>
          <CardContent className="grid gap-6">
            <div>
              <h3 className="font-semibold mb-2">Order Items</h3>
              <div className="space-y-2">
                {order.orderItems.map((item) => (
                  <div key={item.id} className="flex items-center">
                    <span className="font-medium">{item.product.name}</span>
                    <span className="text-sm text-muted-foreground ml-2">
                      (Qty: {item.quantity})
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <div className="border-t pt-4">
              <h3 className="font-semibold mb-2">Summary</h3>
              <p>
                <strong>Delivery Address:</strong> {order.deliveryAddress}
              </p>
              {order.note && (
                <p>
                  <strong>Note:</strong> {order.note}
                </p>
              )}
            </div>
            <div className="flex justify-end gap-2">
              <Button
                onClick={handleApprove}
                disabled={order.status === "APPROVED" || isUpdating}
              >
                {isUpdating ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Approving...
                  </>
                ) : order.status === "APPROVED" ? (
                  <>
                    <Check className="h-4 w-4 mr-2" />
                    Approved
                  </>
                ) : (
                  <>
                    <Check className="h-4 w-4 mr-2" />
                    Approve Order
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default ApproveOrderPage;
