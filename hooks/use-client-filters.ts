import { useState, useMemo } from 'react';
import { Client } from '@/lib/mockData';

export function useClientFilters(clients: Client[] = []) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredClients = useMemo(() => {
    let filtered = clients;
    const term = searchTerm.toLowerCase();

    if (term) {
      filtered = filtered.filter(client =>
        client.name.toLowerCase().includes(term) ||
        client.email.toLowerCase().includes(term) ||
        client.company.toLowerCase().includes(term)
      );
    }
    if (statusFilter !== 'all') {
      filtered = filtered.filter(client => client.status === statusFilter);
    }
    return filtered;
  }, [clients, searchTerm, statusFilter]);

  return { searchTerm, setSearchTerm, statusFilter, setStatusFilter, filteredClients };
}
