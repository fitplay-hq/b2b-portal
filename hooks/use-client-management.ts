import { useMemo } from 'react';
import { Client, PurchaseOrder } from '@/lib/mockData';

export function useClientManagement(clients: Client[] = [], orders: PurchaseOrder[] = []) {
  const stats = useMemo(() => {
    return {
      totalClients: clients.length,
      activeClients: clients.filter(c => c.status === 'active').length,
      inactiveClients: clients.filter(c => c.status === 'inactive').length,
    };
  }, [clients]);

  const getClientStats = (clientId: string) => {
    const clientOrders = orders.filter(o => o.clientId === clientId);
    const totalSpent = clientOrders
      .filter(o => o.status !== 'cancelled')
      .reduce((sum, order) => sum + order.total, 0);
    return {
      totalOrders: clientOrders.length,
      pendingOrders: clientOrders.filter(o => o.status === 'pending').length,
      totalSpent,
    };
  };

  return { stats, getClientStats };
}
