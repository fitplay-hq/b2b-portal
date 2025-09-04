import { useState, useMemo } from "react";
import { AdminOrder } from "@/data/order/admin.actions";

export function useOrderFilters(orders: AdminOrder[] = []) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredOrders = useMemo(() => {
    let filtered = orders;
    const lowercasedTerm = searchTerm.toLowerCase();

    if (lowercasedTerm) {
      filtered = filtered.filter(order =>
        order.client.name.toLowerCase().includes(lowercasedTerm) ||
        order.note?.toLowerCase().includes(lowercasedTerm) ||
        order.orderItems.some(item =>
          item.product.name.toLowerCase().includes(lowercasedTerm)
        )
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((order) => order.status === statusFilter);
    }

    return filtered;
  }, [orders, searchTerm, statusFilter]);

  return {
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    filteredOrders,
  };
}
