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
    <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-white rounded-lg border border-gray-200 hover:shadow-sm transition-shadow">
      <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
        <Avatar className="h-9 w-9 sm:h-10 sm:w-10 flex-shrink-0">
          <AvatarFallback className="bg-green-100 text-green-700 text-xs sm:text-sm">
            {initials}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mb-1">
            <h4 className="font-medium text-gray-900 text-sm sm:text-base truncate">{client.name}</h4>
            <div className="flex flex-wrap gap-1 sm:gap-2">
              <Badge className="bg-green-100 text-green-800 hover:bg-green-100/80 text-xs">
                Active
              </Badge>
              {client._count?.products !== undefined && (
                <Badge variant="outline" className="text-xs">
                  <Package className="h-3 w-3 mr-1" />
                  {client._count.products} client products
                </Badge>
              )}
            </div>
          </div>
          <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-1 sm:gap-x-4 sm:gap-y-1 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5 min-w-0">
              <Mail className="h-3 w-3 flex-shrink-0" />
              <span className="truncate">{client.email}</span>
            </span>
            <span className="flex items-center gap-1.5 min-w-0">
              <Phone className="h-3 w-3 flex-shrink-0" />
              <span className="truncate">{client.phone}</span>
            </span>
            <span className="flex items-center gap-1.5 min-w-0">
              <MapPin className="h-3 w-3 flex-shrink-0" />
              <span className="truncate">{client.address}</span>
            </span>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2 w-full sm:w-auto">
        {actions.clients.edit && (
          <Link href={`/admin/clients/${client.id}`} className="flex-1 sm:flex-initial">
            <Button variant="outline" size="sm" className="w-full sm:w-auto text-xs sm:text-sm">
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
            className="flex-1 sm:flex-initial text-destructive hover:text-destructive hover:bg-destructive/10 text-xs sm:text-sm"
          >
            <Trash2 className="h-3 w-3 mr-1" />
            Delete
          </Button>
        )}
      </div>
    </div>
  );
}

