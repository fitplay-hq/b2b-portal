import { useState, useMemo } from "react";
import { toast } from "sonner";
import { PurchaseOrder } from "@/lib/mockData";
import { useUpdateOrderStatus } from "@/data/order/admin.hooks";
import { KeyedMutator } from "swr";
import { AdminOrder } from "@/data/order/admin.actions";

export function useOrderManagement(orders: AdminOrder[] = [], mutate: KeyedMutator<any>) {
  const [expandedOrders, setExpandedOrders] = useState<Set<string>>(new Set());
  const [dialogState, setDialogState] = useState({
    isOpen: false,
    order: null as AdminOrder | null,
    newStatus: "",
  });
  const { updateOrderStatus } = useUpdateOrderStatus()

  const toggleOrderExpansion = (orderId: string) => {
    const newExpanded = new Set(expandedOrders);
    newExpanded.has(orderId) ? newExpanded.delete(orderId) : newExpanded.add(orderId);
    setExpandedOrders(newExpanded);
  };

  const openStatusDialog = (order: AdminOrder) => {
    setDialogState({ isOpen: true, order, newStatus: order.status });
  };

  const closeStatusDialog = () => {
    setDialogState({ isOpen: false, order: null, newStatus: "" });
  };

  const handleStatusUpdate = async () => {
    if (!dialogState.order) return;
    try {
      await updateOrderStatus({
        orderId: dialogState.order.id,
        status: dialogState.newStatus as AdminOrder['status'],
      });
      toast.success(`Order ${dialogState.order.id} status updated.`);
      closeStatusDialog();
    } catch (error) {
      toast.error("Failed to update status.");
    }
  };

  const metrics = useMemo(() => ({
    totalOrders: orders.length,
    pendingOrders: orders.filter((o) => o.status === "PENDING").length,
    completedOrders: orders.filter((o) => o.status === "APPROVED").length,
    totalRevenue: orders
      .filter((o) => o.status !== "REJECTED")
      .reduce((sum, order) => sum + order.totalAmount, 0),
  }), [orders]);

  return {
    expandedOrders,
    dialogState,
    setDialogState,
    toggleOrderExpansion,
    openStatusDialog,
    closeStatusDialog,
    handleStatusUpdate,
    metrics,
  };
}
