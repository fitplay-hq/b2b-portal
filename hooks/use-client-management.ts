import { useMemo } from 'react';
import { Client, Order } from '@/lib/generated/prisma';
import { AdminOrder } from '@/data/order/admin.actions';

export function useClientManagement(clients: Client[] = [], orders: AdminOrder[] = []) {
  const stats = useMemo(() => {
    return {
      totalClients: clients.length,
      activeClients: clients.length,
      inactiveClients: 0,
    };
  }, [clients]);

  const getClientStats = (clientId: string) => {
    const clientOrders = orders.filter(o => o.clientId === clientId);
    const totalSpent = clientOrders
      .filter(o => o.status !== 'CANCELLED')
      .reduce((sum, order) => sum + order.totalAmount, 0);
    return {
      totalOrders: clientOrders.length,
      pendingOrders: clientOrders.filter(o => o.status === 'PENDING').length,
      totalSpent,
    };
  };

  return { stats, getClientStats };
}
