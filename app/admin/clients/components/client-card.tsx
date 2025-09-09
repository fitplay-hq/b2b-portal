import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Client } from "@/lib/generated/prisma";
import { Building2, Calendar, Edit, Mail, Trash2 } from "lucide-react";

interface ClientCardProps {
  client: Client;
  stats: {
    totalOrders: number;
    totalSpent: number;
    pendingOrders: number;
  };
  onEdit: () => void;
  onDelete: () => void;
}

export function ClientCard({
  client,
  stats,
  onEdit,
  onDelete,
}: ClientCardProps) {
  // Logic to get initials for the avatar fallback
  const initials = client.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  // Logic for styling the status badge based on client status
  // const statusBadgeClass =
  // client.status === "active"
  // ? "border-transparent bg-green-100 text-green-800 hover:bg-green-100/80"
  // : "border-transparent bg-red-100 text-red-800 hover:bg-red-100/80";
  const statusBadgeClass =
    "border-transparent bg-green-100 text-green-800 hover:bg-green-100/80";

  return (
    <div className="flex flex-col items-start justify-between gap-4 rounded-lg border p-4 sm:flex-row sm:items-center">
      <div className="flex items-center gap-4">
        <Avatar className="h-12 w-12">
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h3 className="font-medium">{client.name}</h3>
            <Badge className={statusBadgeClass}>Active</Badge>
          </div>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <Mail className="h-3 w-3" />
              {client.email}
            </span>
            <span className="flex items-center gap-1.5">
              <Building2 className="h-3 w-3" />
              {client.companyName}
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar className="h-3 w-3" />
              Joined {new Date(client.createdAt).toLocaleDateString()}
            </span>
          </div>
          <div className="flex items-center gap-4 pt-1 text-sm">
            <span className="text-muted-foreground">
              {stats.totalOrders} orders
            </span>
            {stats.pendingOrders > 0 && (
              <Badge variant="outline" className="text-xs">
                {stats.pendingOrders} pending
              </Badge>
            )}
          </div>
        </div>
      </div>
      <div className="flex w-full shrink-0 gap-2 sm:w-auto">
        <Button variant="outline" size="sm" onClick={onEdit} className="flex-1">
          <Edit className="mr-2 h-4 w-4" /> Edit
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={onDelete}
          className="flex-1 text-destructive hover:text-destructive"
        >
          <Trash2 className="mr-2 h-4 w-4" /> Delete
        </Button>
      </div>
    </div>
  );
}
