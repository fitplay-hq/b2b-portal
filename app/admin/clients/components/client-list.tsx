import { Client } from "@/lib/generated/prisma";
import { ClientCard } from "./client-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ClientListProps {
  clients: Client[];
  getClientStats: (clientId: string) => {
    totalOrders: number;
    totalSpent: number;
    pendingOrders: number;
  };
  onEdit: (client: Client) => void;
  onDelete: (clientId: string) => void;
}

export function ClientList({
  clients,
  getClientStats,
  onEdit,
  onDelete,
}: ClientListProps) {
  if (clients.length === 0) {
    return (
      <p className="text-center text-muted-foreground py-8">
        No clients found.
      </p>
    );
  }
  return (
    <Card>
      <CardHeader>
        <CardTitle>Clients ({clients.length})</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {clients.map((client) => (
          <ClientCard
            key={client.id}
            client={client}
            stats={getClientStats(client.id)}
            onEdit={() => onEdit(client)}
            onDelete={() => onDelete(client.id)}
          />
        ))}
      </CardContent>
    </Card>
  );
}
