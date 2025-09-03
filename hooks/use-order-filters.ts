import { useState, useMemo } from "react";
import { PurchaseOrder } from "@/lib/mockData";

export function useOrderFilters(orders: PurchaseOrder[] = []) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredOrders = useMemo(() => {
    let filtered = orders;
    const lowercasedTerm = searchTerm.toLowerCase();

    if (lowercasedTerm) {
      filtered = filtered.filter(order =>
        order.clientName.toLowerCase().includes(lowercasedTerm) ||
        order.company.toLowerCase().includes(lowercasedTerm) ||
        order.items.some(item =>
          item.product.name.toLowerCase().includes(lowercasedTerm) ||
          item.product.sku.toLowerCase().includes(lowercasedTerm)
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
