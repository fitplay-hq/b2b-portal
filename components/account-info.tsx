import React, { useMemo } from "react";
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
import { Building, LogOut, User, Key } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { useFastPermissions } from "@/contexts/fast-permission-context";

interface AccountInfoProps {
  isCollapsed?: boolean;
}

// Persistent user cache to prevent twitching on navigation
const USER_CACHE_KEY = 'account_user_cache';

const AccountInfo = React.memo(({ isCollapsed = false }: AccountInfoProps) => {
  const { data: session } = useSession();
  const { userInfo } = useFastPermissions();

  // ANTI-TWITCH FIX: Use cached user data to prevent "Guest" flash during navigation
  const currentUser = useMemo(() => {
    const liveUser = userInfo || session?.user;
    
    if (liveUser) {
      // Cache the user data
      if (typeof window !== 'undefined') {
        localStorage.setItem(USER_CACHE_KEY, JSON.stringify(liveUser));
      }
      return liveUser;
    }
    
    // If no live user, try to get from cache to prevent "Guest" flash
    if (typeof window !== 'undefined') {
      try {
        const cached = localStorage.getItem(USER_CACHE_KEY);
        if (cached) {
          return JSON.parse(cached);
        }
      } catch (e) {
        // Ignore cache errors
      }
    }
    
    return null;
  }, [userInfo, session?.user]);

  // Only show guest state if we're certain there's no user (not just during loading)
  const isActualGuest = !currentUser && session !== undefined;

  // Instant user initials - no complex memoization needed
  const userInitials = currentUser?.name
    ?.split(" ")
    .map((n: string) => n[0])
    .join("") || "U";

  // Instant role display
  const roleDisplayText = (() => {
    if (!currentUser) return "Guest";
    if (currentUser.role === "ADMIN") return "Admin";
    if (currentUser.role === "SYSTEM_USER") return currentUser.systemRole || "System User";
    if (currentUser.role === "CLIENT") return "Client";
    return currentUser.role;
  })();

  // CRITICAL: Only show guest UI if session is loaded AND no user exists
  if (isActualGuest) {
    // This should rarely happen in an authenticated app
    // Just redirect to login instead of showing guest UI
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
    return null;
  }

  // Always show user UI if we have any user data (live or cached)
  if (!currentUser) {
    // Still loading session, show nothing to prevent flashing
    return null;
  }

  // Logged in user display
  return (
    <div className={`flex items-center rounded-lg bg-gray-50 border border-gray-200 ${
      isCollapsed ? 'p-2 justify-center' : 'gap-3 p-3'
    }`}>
      <Avatar className="h-8 w-8">
        <AvatarFallback className="bg-gray-100 border border-gray-200 text-gray-700 text-xs font-semibold shadow-sm">
          {userInitials}
        </AvatarFallback>
      </Avatar>
      
      {!isCollapsed && (
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="text-sm font-medium text-gray-900 truncate">{currentUser.name}</p>
            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
          </div>
          <p className="text-xs text-gray-500 truncate">
            {roleDisplayText}
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
                {currentUser.name}
              </div>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-72">
          <DropdownMenuLabel>Account</DropdownMenuLabel>
          <DropdownMenuSeparator />

          <div className="px-3 py-2">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarFallback className="bg-gray-100 text-gray-700 font-semibold">
                  {userInitials}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{currentUser.name}</p>
                <p className="text-xs text-gray-500 truncate">{currentUser.email}</p>
                <p className="text-xs text-blue-600 font-medium">{roleDisplayText}</p>
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
            onClick={() => {
              // Clear user cache to prevent showing cached data after logout
              if (typeof window !== 'undefined') {
                localStorage.removeItem(USER_CACHE_KEY);
              }
              signOut({ callbackUrl: '/login' });
            }}
            className="text-red-600 focus:text-red-600 focus:bg-red-50"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
});

AccountInfo.displayName = 'AccountInfo';

export default AccountInfo;
