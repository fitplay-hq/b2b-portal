import React from "react";
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
import { Building, LogIn, LogOut, User, Key } from "lucide-react";
import { signIn, signOut, useSession } from "next-auth/react";

interface AccountInfoProps {
  isCollapsed?: boolean;
}

// Custom hook for stable user session data
const useStableUser = () => {
  const { data, status } = useSession();
  const [stableUser, setStableUser] = React.useState<{
    id?: string;
    name?: string | null;
    email?: string | null;
    role?: string;
    systemRole?: string;
    companyName?: string;
  } | null>(null);

  React.useEffect(() => {
    if (status === 'authenticated' && data?.user) {
      const currentUserStr = JSON.stringify(data.user);
      const stableUserStr = JSON.stringify(stableUser);
      
      if (currentUserStr !== stableUserStr) {
        setStableUser(data.user);
      }
    } else if (status === 'unauthenticated') {
      setStableUser(null);
    }
  }, [data?.user, status, stableUser]);

  return { 
    userData: stableUser, 
    sessionData: data,
    sessionStatus: status,
    isInitialLoading: status === 'loading' && !stableUser 
  };
};

const AccountInfo = React.memo(({ isCollapsed = false }: AccountInfoProps) => {
  const { userData, sessionData, isInitialLoading } = useStableUser();

  // Memoize user initials and role text to prevent recalculation
  const userInitials = React.useMemo(() => {
    return userData?.name
      ?.split(" ")
      .map((n: string) => n[0])
      .join("") || "U";
  }, [userData?.name]);

  const roleDisplayText = React.useMemo(() => {
    if (!userData) return "";
    if (userData.role === "ADMIN") return "Admin";
    if (userData.role === "SYSTEM_USER") return userData.systemRole || "System User";
    if (userData.role === "CLIENT") return "Client";
    return userData.role;
  }, [userData]);

  // Only show skeleton on initial loading, not on navigation
  if (isInitialLoading) {
    return <Skeleton className="w-28 h-10" />;
  }

  if (!sessionData) {
    return <Skeleton className="w-28 h-10" />;
  }

  if (!sessionData.user) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className={`flex items-center ${isCollapsed ? 'p-2 justify-center' : 'gap-2'}`}>
            <Avatar className="h-8 w-8"></Avatar>
            {!isCollapsed && "My Account"}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-72">
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

  // Use stable user data instead of session data
  const currentUser = userData || sessionData?.user;

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
            <p className="text-sm font-medium text-gray-900 truncate">{currentUser?.name}</p>
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
                {currentUser?.name}
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
                <AvatarFallback className="bg-gray-100 border border-gray-200 text-gray-700 font-semibold shadow-sm">
                  {userInitials}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium text-gray-900">{currentUser?.name}</p>
                <p className="text-xs text-gray-500">{currentUser?.email}</p>
                {currentUser?.role === 'CLIENT' && (
                  <p className="text-xs text-gray-400 mt-1">{currentUser?.companyName || 'No Company'}</p>
                )}
              </div>
            </div>
          </div>

          <DropdownMenuSeparator />

          <DropdownMenuItem>
            <User className="h-4 w-4 mr-2" />
            Profile Settings
          </DropdownMenuItem>

          <DropdownMenuItem onClick={() => window.location.href = '/forgot-password'}>
            <Key className="h-4 w-4 mr-2" />
            Change Password
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
}, (prevProps, nextProps) => {
  // Only re-render if isCollapsed prop changes
  // This prevents re-renders when session data updates but props haven't changed
  return prevProps.isCollapsed === nextProps.isCollapsed;
});

AccountInfo.displayName = 'AccountInfo';

export default AccountInfo;