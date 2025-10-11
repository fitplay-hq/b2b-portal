import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Skeleton } from "./ui/skeleton";
import { Building, LogIn, LogOut, User } from "lucide-react";
import { signIn, signOut, useSession } from "next-auth/react";

interface AccountInfoProps {
  isCollapsed?: boolean;
}

export default function AccountInfo({ isCollapsed = false }: AccountInfoProps) {
  const { data } = useSession();

  if (!data) {
    return <Skeleton className="w-28 h-10" />;
  }

  if (!data.user) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className={`flex items-center ${isCollapsed ? 'p-2 justify-center' : 'gap-2'}`}>
            <Avatar className="h-8 w-8"></Avatar>
            {!isCollapsed && "My Account"}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />

          <DropdownMenuSeparator />

          <DropdownMenuItem
            onClick={() => signIn()}
            className="text-destructive focus:text-destructive"
          >
            <LogIn className="h-4 w-4 mr-2" />
            Sign In
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  const { user } = data;

  return (
    <div className={`flex items-center rounded-lg bg-gray-50 border border-gray-200 ${
      isCollapsed ? 'p-2 justify-center' : 'gap-3 p-3'
    }`}>
      <Avatar className="h-8 w-8">
        <AvatarFallback className="bg-gray-100 border border-gray-200 text-gray-700 text-xs font-semibold shadow-sm">
          {user.name
            ?.split(" ")
            .map((n) => n[0])
            .join("") || "U"}
        </AvatarFallback>
      </Avatar>
      
      {!isCollapsed && (
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="text-sm font-medium text-gray-900 truncate">{user?.name}</p>
            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
          </div>
          <p className="text-xs text-gray-500 truncate">
            {user.role === "ADMIN" 
              ? "Administrator" 
              : user.role === "SYSTEM_USER" 
                ? user.systemRole || "System User"
                : user.role === "CLIENT"
                  ? "Client"
                  : user.role
            }
          </p>
        </div>
      )}
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className={`${isCollapsed ? 'p-1 h-8 w-8 relative group' : 'p-1 h-6 w-6'}`}>
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zM12 13a1 1 0 110-2 1 1 0 010 2zM12 20a1 1 0 110-2 1 1 0 010 2z" />
            </svg>
            {isCollapsed && (
              <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                {user?.name}
              </div>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>Account</DropdownMenuLabel>
          <DropdownMenuSeparator />

          <div className="px-3 py-2">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarFallback className="bg-gray-100 border border-gray-200 text-gray-700 font-semibold shadow-sm">
                  {user.name
                    ?.split(" ")
                    .map((n) => n[0])
                    .join("") || "U"}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium text-gray-900">{user?.name}</p>
                <p className="text-xs text-gray-500">{user?.email}</p>
                <p className="text-xs text-gray-400 mt-1">Fitplay Inc.</p>
              </div>
            </div>
          </div>

          <DropdownMenuSeparator />

          <DropdownMenuItem>
            <User className="h-4 w-4 mr-2" />
            Profile Settings
          </DropdownMenuItem>

          <DropdownMenuItem>
            <Building className="h-4 w-4 mr-2" />
            Organization
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            onClick={() => signOut({ callbackUrl: '/login' })}
            className="text-red-600 focus:text-red-600 focus:bg-red-50"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
