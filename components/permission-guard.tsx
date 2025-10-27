import React from 'react';
import { usePermissions } from '@/hooks/use-permissions';

interface PermissionGuardProps {
  resource?: string;
  action?: string;
  children: React.ReactNode;
  fallback?: React.ReactNode;
  adminOnly?: boolean;
}

/**
 * Component to conditionally render content based on permissions
 */
export function PermissionGuard({
  resource,
  action,
  children,
  fallback = null,
  adminOnly = false,
}: PermissionGuardProps) {
  const { canPerformAction, canAccessAdminOnly } = usePermissions();

  // Admin-only check
  if (adminOnly && !canAccessAdminOnly()) {
    return <>{fallback}</>;
  }

  // Permission-based check
  if (resource && action && !canPerformAction(resource, action)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}