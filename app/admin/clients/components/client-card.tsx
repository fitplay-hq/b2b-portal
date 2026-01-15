import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Client } from "@/lib/generated/prisma";
import { Building2, Calendar, Edit, Mail, Trash2 } from "lucide-react";
import Link from "next/link";
import { usePermissions } from "@/hooks/use-permissions";

interface ClientCardProps {
  client: Client;
  stats: {
    totalOrders: number;
    totalSpent: number;
    pendingOrders: number;
  };
  onDelete: () => void;
}

export function ClientCard({ client, stats, onDelete }: ClientCardProps) {
  const { actions } = usePermissions();
  
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
    <div className="flex flex-col gap-3 sm:gap-4 rounded-lg border p-3 sm:p-4 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex items-start sm:items-center gap-3 sm:gap-4 min-w-0 flex-1">
        <Avatar className="h-10 w-10 sm:h-12 sm:w-12 flex-shrink-0">
          <AvatarFallback className="text-xs sm:text-sm">{initials}</AvatarFallback>
        </Avatar>
        <div className="space-y-1 min-w-0 flex-1">
          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
            <h3 className="font-medium text-sm sm:text-base truncate">{client.name}</h3>
            <Badge className={`${statusBadgeClass} text-xs`}>Active</Badge>
          </div>
          <div className="flex flex-col sm:flex-row sm:flex-wrap items-start sm:items-center gap-1 sm:gap-x-4 sm:gap-y-1 text-xs sm:text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5 min-w-0">
              <Mail className="h-3 w-3 flex-shrink-0" />
              <span className="truncate">{client.email}</span>
            </span>
            <span className="flex items-center gap-1.5 min-w-0">
              <Building2 className="h-3 w-3 flex-shrink-0" />
              <span className="truncate">{client.company?.name || client.companyName || "—"}</span>
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar className="h-3 w-3 flex-shrink-0" />
              <span className="whitespace-nowrap">Joined {new Date(client.createdAt).toLocaleDateString('en-GB')}</span>
            </span>
          </div>
          <div className="flex items-center gap-3 sm:gap-4 pt-1 text-xs sm:text-sm">
            <span className="text-muted-foreground whitespace-nowrap">
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
      <div className="flex w-full shrink-0 gap-2 sm:w-auto lg:w-auto">
        {actions.clients.edit && (
          <Link href={`/admin/clients/${client.id}`} className="flex-1">
            <Button variant="outline" size="sm" className="w-full">
              <Edit className="mr-2 h-4 w-4" /> Edit
            </Button>
          </Link>
        )}
        {actions.clients.delete && (
          <Button
            variant="outline"
            size="sm"
            onClick={onDelete}
            className="flex-1 text-destructive hover:text-destructive"
          >
            <Trash2 className="mr-2 h-4 w-4" /> Delete
          </Button>
        )}
      </div>
    </div>
  );
}
