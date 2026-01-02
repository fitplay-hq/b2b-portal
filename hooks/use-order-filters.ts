import { useState, useMemo } from "react";
import { AdminOrder } from "@/data/order/admin.actions";

export function useOrderFilters(orders: AdminOrder[] = []) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredOrders = useMemo(() => {
    let filtered = orders;
    const lowercasedTerm = searchTerm.toLowerCase();

    if (lowercasedTerm) {
      filtered = filtered.filter(order => {
        // Search by Order ID
        if (order.id.toLowerCase().includes(lowercasedTerm)) return true;
        
        // Search by Client name
        if (order.client.name.toLowerCase().includes(lowercasedTerm)) return true;
        
        // Search by Client email
        if (order.client.email.toLowerCase().includes(lowercasedTerm)) return true;
        
        // Search by Company name
        if (order.client.companyName?.toLowerCase().includes(lowercasedTerm)) return true;
        if (order.client.company?.name?.toLowerCase().includes(lowercasedTerm)) return true;
        
        // Search by Order Status
        if (order.status.toLowerCase().includes(lowercasedTerm)) return true;
        
        // Search by Consignment Number (AWB)
        if (order.consignmentNumber?.toLowerCase().includes(lowercasedTerm)) return true;
        
        // Search by Total Amount
        if (order.totalAmount.toString().includes(lowercasedTerm)) return true;
        
        // Search by Order notes
        if (order.note?.toLowerCase().includes(lowercasedTerm)) return true;
        
        // Search by Product names in regular order items
        if (order.orderItems?.some(item =>
          item.product?.name?.toLowerCase().includes(lowercasedTerm)
        )) return true;
        
        // Search by Product names in bundle order items
        if (order.bundleOrderItems?.some(bundleItem => {
          // Check bundle product name
          if (bundleItem.product?.name?.toLowerCase().includes(lowercasedTerm)) return true;
          
          // Check individual items within the bundle
          if (bundleItem.bundle?.items?.some(item =>
            item.product?.name?.toLowerCase().includes(lowercasedTerm)
          )) return true;
          
          return false;
        })) return true;
        
        return false;
      });
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
