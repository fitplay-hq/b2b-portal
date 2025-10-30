import { useState, useMemo } from "react";
import { toast } from "sonner";
import { useUpdateOrderStatus } from "@/data/order/admin.hooks";
import { KeyedMutator } from "swr";
import { AdminOrder } from "@/data/order/admin.actions";

export function useOrderManagement(orders: AdminOrder[] = [], mutate: KeyedMutator<AdminOrder[]>) {
  const [expandedOrders, setExpandedOrders] = useState<Set<string>>(new Set());
  const [dialogState, setDialogState] = useState({
    isOpen: false,
    order: null as AdminOrder | null,
    newStatus: "",
    consignmentNumber: "",
    deliveryService: "",
  });
  const { updateOrderStatus } = useUpdateOrderStatus()

  const toggleOrderExpansion = (orderId: string) => {
    const newExpanded = new Set(expandedOrders);
    if (newExpanded.has(orderId)) {
      newExpanded.delete(orderId);
    } else {
      newExpanded.add(orderId);
    }
    setExpandedOrders(newExpanded);
  };

  const openStatusDialog = (order: AdminOrder) => {
    setDialogState({
      isOpen: true,
      order,
      newStatus: order.status,
      consignmentNumber: "",
      deliveryService: "",
    });
  };

  const closeStatusDialog = () => {
    setDialogState({
      isOpen: false,
      order: null,
      newStatus: "",
      consignmentNumber: "",
      deliveryService: "",
    });
  };

  const handleStatusUpdate = async () => {
    if (!dialogState.order) return;
    
    console.log("Updating order status:", {
      orderId: dialogState.order.id,
      currentStatus: dialogState.order.status,
      newStatus: dialogState.newStatus,
      consignmentNumber: dialogState.consignmentNumber,
      deliveryService: dialogState.deliveryService,
    });

    try {
      const result = await updateOrderStatus({
        orderId: dialogState.order.id,
        status: dialogState.newStatus as AdminOrder['status'],
        ...(dialogState.newStatus === "DISPATCHED" && {
          consignmentNumber: dialogState.consignmentNumber,
          deliveryService: dialogState.deliveryService,
        }),
      });
      
      console.log("Status update result:", result);
      toast.success(`Order ${dialogState.order.id} status updated.`);
      closeStatusDialog();
      mutate(); // Refresh the orders list
    } catch (error) {
      console.error("Status update error:", error);
      toast.error("Failed to update status.");
    }
  };

  const metrics = useMemo(() => ({
    totalOrders: orders.length,
    pendingOrders: orders.filter((o) => o.status != "DELIVERED").length,
    completedOrders: orders.filter((o) => (o.status == 'DELIVERED')).length,
    totalRevenue: orders
      .filter((o) => o.status !== "CANCELLED")
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
