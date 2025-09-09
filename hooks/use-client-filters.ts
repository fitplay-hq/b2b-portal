import { Client } from '@/lib/generated/prisma';
import { useState, useMemo } from 'react';

export function useClientFilters(clients: Client[] = []) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredClients = useMemo(() => {
    let filtered = clients;
    const term = searchTerm.toLowerCase();

    if (term) {
      filtered = filtered.filter(client =>
        client.name.toLowerCase().includes(term) ||
        client.email.toLowerCase().includes(term) ||
        client.companyName.toLowerCase().includes(term)
      );
    }
    return filtered;
  }, [clients, searchTerm]);

  return { searchTerm, setSearchTerm, filteredClients };
}
