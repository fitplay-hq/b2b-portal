import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, Package } from "lucide-react";
import Link from "next/link";
import { usePermissions } from "@/hooks/use-permissions";

interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  companyID: string | null;
  companyName: string | null;
  company?: {
    id: string;
    name: string;
    address: string;
  } | null;
  createdAt: string;
  _count?: {
    products: number;
  };
}

interface ClientsTableProps {
  clients: Client[];
  onDeleteClient?: (clientId: string) => void;
}

export function ClientsTable({ clients, onDeleteClient }: ClientsTableProps) {
  const { actions } = usePermissions();

  const handleDelete = (clientId: string) => {
    if (onDeleteClient) {
      onDeleteClient(clientId);
    }
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Client Name</TableHead>
            <TableHead>Company</TableHead>
            <TableHead>Products</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Address</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {clients.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                No clients found
              </TableCell>
            </TableRow>
          ) : (
            clients.map((client) => (
              <TableRow key={client.id}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div>
                      <div className="font-medium">{client.name}</div>
                      <div className="text-sm text-muted-foreground">{client.email}</div>
                    </div>
                    <Badge className="bg-green-100 text-green-800 hover:bg-green-100/80 text-xs ml-2">
                      Active
                    </Badge>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-sm">
                    {client.company?.name || client.companyName || "No Company"}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Package className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">
                      {client._count?.products || 0}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-sm">{client.phone}</div>
                </TableCell>
                <TableCell>
                  <div className="text-sm max-w-32 truncate" title={client.address}>
                    {client.address}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    {actions.clients.edit && (
                      <Link href={`/admin/clients/${client.id}`}>
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </Link>
                    )}
                    {actions.clients.delete && onDeleteClient && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(client.id)}
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}