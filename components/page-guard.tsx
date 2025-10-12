import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Shield, AlertTriangle } from 'lucide-react';
import Link from 'next/link';
import { hasPermission, type UserSession } from '@/lib/utils';

interface PageGuardProps {
  children: React.ReactNode;
  resource?: string;
  action?: string;
  adminOnly?: boolean;
  fallbackMessage?: string;
}

/**
 * Component to guard pages based on permissions
 */
export function PageGuard({ 
  children, 
  resource, 
  action = 'view', 
  adminOnly = false,
  fallbackMessage 
}: PageGuardProps) {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Show loading while session is being loaded
  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!session) {
    router.push('/login');
    return null;
  }

  const { user } = session;
  const isAdmin = user?.role === 'ADMIN';

  // Admin-only check
  if (adminOnly && !isAdmin) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center text-center p-8">
            <Shield className="h-16 w-16 text-red-500 mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Access Denied</h2>
            <p className="text-gray-600 mb-4">
              {fallbackMessage || "You do not have permission to access this page. This area is restricted to administrators only."}
            </p>
            <Button asChild variant="outline">
              <Link href="/admin">
                Return to Dashboard
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Permission-based check for SYSTEM_USER
  if (resource && !isAdmin) {
    const userPermissions = (session as UserSession)?.user?.permissions || [];
    const hasRequiredPermission = hasPermission(userPermissions, resource, action);

    if (!hasRequiredPermission) {
      return (
        <div className="flex items-center justify-center min-h-[60vh]">
          <Card className="w-full max-w-md">
            <CardContent className="flex flex-col items-center text-center p-8">
              <AlertTriangle className="h-16 w-16 text-orange-500 mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Insufficient Permissions</h2>
              <p className="text-gray-600 mb-4">
                {fallbackMessage || `You do not have permission to ${action} ${resource}. Please contact your administrator if you need access to this page.`}
              </p>
              <Button asChild variant="outline">
                <Link href="/admin">
                  Return to Dashboard
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      );
    }
  }

  // User has permission, render the page
  return <>{children}</>;
}

export default PageGuard;