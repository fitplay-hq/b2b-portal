import { useState, useMemo } from "react";
import { toast } from "sonner";
import { PurchaseOrder } from "@/lib/mockData";
import { useUpdateOrder } from "@/data/order/admin.hooks";
import { KeyedMutator } from "swr";

export function useOrderManagement(orders: PurchaseOrder[] = [], mutate: KeyedMutator<any>) {
  const [expandedOrders, setExpandedOrders] = useState<Set<string>>(new Set());
  const [dialogState, setDialogState] = useState({
    isOpen: false,
    order: null as PurchaseOrder | null,
    newStatus: "",
    notes: "",
  });
  const { updateOrder } = useUpdateOrder()

  const toggleOrderExpansion = (orderId: string) => {
    const newExpanded = new Set(expandedOrders);
    newExpanded.has(orderId) ? newExpanded.delete(orderId) : newExpanded.add(orderId);
    setExpandedOrders(newExpanded);
  };

  const openStatusDialog = (order: PurchaseOrder) => {
    setDialogState({ isOpen: true, order, newStatus: order.status, notes: "" });
  };

  const closeStatusDialog = () => {
    setDialogState({ isOpen: false, order: null, newStatus: "", notes: "" });
  };

  const handleStatusUpdate = async () => {
    if (!dialogState.order) return;
    try {
      await updateOrder({
        orderId: dialogState.order.id,
        status: dialogState.newStatus as PurchaseOrder['status'],
        notes: dialogState.notes,
      });
      toast.success(`Order ${dialogState.order.id} status updated.`);
      closeStatusDialog();
    } catch (error) {
      toast.error("Failed to update status.");
    }
  };

  const metrics = useMemo(() => ({
    totalOrders: orders.length,
    pendingOrders: orders.filter((o) => o.status === "pending").length,
    completedOrders: orders.filter((o) => o.status === "completed").length,
    totalRevenue: orders
      .filter((o) => o.status !== "cancelled")
      .reduce((sum, order) => sum + order.total, 0),
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
