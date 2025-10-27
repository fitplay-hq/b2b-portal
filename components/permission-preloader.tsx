"use client";

import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { permanentPermissionStorage } from '@/lib/permanent-permission-storage';

/**
 * PRE-LOAD PERMISSIONS - Runs before any UI renders
 * This ensures permissions are ready INSTANTLY
 */
export function PermissionPreloader() {
  const { data: session, status } = useSession();

  useEffect(() => {
    // Run as soon as we have any session data
    if (session?.user && session.user.role === 'SYSTEM_USER') {
      const userId = session.user.id;
      const roleId = session.user.systemRoleId;
      
      if (userId && roleId && session.user.permissions) {
        // Check if already stored
        if (!permanentPermissionStorage.hasValidPermissions(userId)) {
          // Store immediately
          permanentPermissionStorage.storeUserPermissions(
            userId,
            roleId,
            session.user.permissions
          );
        }
      }
    }
  }, [session]); // Run on any session change

  // This component doesn't render anything
  return null;
}

/**
 * HOC to wrap components that need instant permission access
 */
export function withPermissionPreload<T extends object>(Component: React.ComponentType<T>) {
  return function PermissionPreloadedComponent(props: T) {
    return (
      <>
        <PermissionPreloader />
        <Component {...props} />
      </>
    );
  };
}