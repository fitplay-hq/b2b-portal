import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Mail, Phone, MapPin, Edit, Trash2, Package } from "lucide-react";
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
  createdAt: string;
  _count?: {
    products: number;
  };
}

interface ClientCardProps {
  client: Client;
  onDelete?: (clientId: string) => void;
}

export function ClientCard({ client, onDelete }: ClientCardProps) {
  const { actions, isAdmin, session } = usePermissions();

  const initials = client.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const handleDelete = () => {
    if (onDelete) {
      onDelete(client.id);
    }
  };

  return (
    <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200 hover:shadow-sm transition-shadow">
      <div className="flex items-center gap-4 flex-1">
        <Avatar className="h-10 w-10">
          <AvatarFallback className="bg-green-100 text-green-700">
            {initials}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="font-medium text-gray-900">{client.name}</h4>
            <Badge className="bg-green-100 text-green-800 hover:bg-green-100/80 text-xs">
              Active
            </Badge>
            {client._count?.products !== undefined && (
              <Badge variant="outline" className="text-xs">
                <Package className="h-3 w-3 mr-1" />
                {client._count.products} products
              </Badge>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <Mail className="h-3 w-3" />
              {client.email}
            </span>
            <span className="flex items-center gap-1.5">
              <Phone className="h-3 w-3" />
              {client.phone}
            </span>
            <span className="flex items-center gap-1.5">
              <MapPin className="h-3 w-3" />
              {client.address}
            </span>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        {actions.clients.edit && (
          <Link href={`/admin/clients/${client.id}`}>
            <Button variant="outline" size="sm">
              <Edit className="h-3 w-3 mr-1" />
              Edit
            </Button>
          </Link>
        )}
        {actions.clients.delete && onDelete && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleDelete}
            className="text-destructive hover:text-destructive hover:bg-destructive/10"
          >
            <Trash2 className="h-3 w-3 mr-1" />
            Delete
          </Button>
        )}
      </div>
    </div>
  );
}

