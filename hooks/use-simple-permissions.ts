import { useSession } from 'next-auth/react';
import { useState, useEffect, useMemo } from 'react';
import { 
  hasPermission, 
  canAccessPage, 
  canPerformAction, 
  getAccessibleNavItems,
  PERMISSIONS,
  RESOURCES,
  type UserSession,
  type Permission
} from '@/lib/utils';

/**
 * Simplified permissions hook - loads instantly from session
 */
export function useSimplePermissions() {
  const { data: session } = useSession();
  const [isHydrated, setIsHydrated] = useState(false);

  const isAdmin = session?.user?.role === 'ADMIN';
  const isSystemUser = session?.user?.role === 'SYSTEM_USER';

  // Never show loading - always instant
  const isLoading = false;

  // Hydration effect
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // Get permissions directly from session
  const permissions = useMemo(() => {
    return (session?.user?.permissions as Permission[]) || [];
  }, [session?.user?.permissions]);

  // Admin permissions (always instant)
  const adminPermissions = useMemo(() => {
    if (!isAdmin) return null;
    
    return {
      permissions: [],
      pageAccess: {
        dashboard: true,
        products: true,
        orders: true,
        clients: true,
        companies: true,
        inventory: true,
        users: true,
        roles: true,
      },
      actions: {
        products: { view: true, create: true, edit: true, delete: true },
        orders: { view: true, create: true, edit: true },
        clients: { view: true, create: true, edit: true, delete: true },
        companies: { view: true, create: true, edit: true, delete: true },
        inventory: { view: true, create: true, edit: true },
        users: { view: true, create: true, edit: true, delete: true },
        roles: { view: true, create: true, edit: true, delete: true },
      },
      navItems: getAccessibleNavItems(session as UserSession),
    };
  }, [isAdmin, session]);

  // System user permissions (computed from session permissions)
  const systemUserPermissions = useMemo(() => {
    if (isAdmin || !isSystemUser) return null;
    
    return {
      permissions,
      pageAccess: {
        dashboard: true,
        products: canAccessPage(permissions, RESOURCES.PRODUCTS),
        orders: canAccessPage(permissions, RESOURCES.ORDERS),
        clients: canAccessPage(permissions, RESOURCES.CLIENTS),
        companies: canAccessPage(permissions, RESOURCES.COMPANIES),
        inventory: canAccessPage(permissions, RESOURCES.INVENTORY),
        users: false,
        roles: false,
      },
      actions: {
        products: {
          view: canPerformAction(permissions, RESOURCES.PRODUCTS, PERMISSIONS.VIEW),
          create: canPerformAction(permissions, RESOURCES.PRODUCTS, PERMISSIONS.CREATE),
          edit: canPerformAction(permissions, RESOURCES.PRODUCTS, PERMISSIONS.EDIT),
          delete: canPerformAction(permissions, RESOURCES.PRODUCTS, PERMISSIONS.DELETE),
        },
        orders: {
          view: canPerformAction(permissions, RESOURCES.ORDERS, PERMISSIONS.VIEW),
          create: canPerformAction(permissions, RESOURCES.ORDERS, PERMISSIONS.CREATE),
          edit: canPerformAction(permissions, RESOURCES.ORDERS, PERMISSIONS.EDIT),
        },
        clients: {
          view: canPerformAction(permissions, RESOURCES.CLIENTS, PERMISSIONS.VIEW),
          create: canPerformAction(permissions, RESOURCES.CLIENTS, PERMISSIONS.CREATE),
          edit: canPerformAction(permissions, RESOURCES.CLIENTS, PERMISSIONS.EDIT),
          delete: canPerformAction(permissions, RESOURCES.CLIENTS, PERMISSIONS.DELETE),
        },
        companies: {
          view: canPerformAction(permissions, RESOURCES.COMPANIES, PERMISSIONS.VIEW),
          create: canPerformAction(permissions, RESOURCES.COMPANIES, PERMISSIONS.CREATE),
          edit: canPerformAction(permissions, RESOURCES.COMPANIES, PERMISSIONS.EDIT),
          delete: canPerformAction(permissions, RESOURCES.COMPANIES, PERMISSIONS.DELETE),
        },
        inventory: {
          view: canPerformAction(permissions, RESOURCES.INVENTORY, PERMISSIONS.VIEW),
          create: canPerformAction(permissions, RESOURCES.INVENTORY, PERMISSIONS.CREATE),
          edit: canPerformAction(permissions, RESOURCES.INVENTORY, PERMISSIONS.EDIT),
        },
      },
      navItems: getAccessibleNavItems(session as UserSession),
    };
  }, [permissions, isAdmin, isSystemUser, session]);

  // Current permissions
  const currentPermissions = isAdmin ? adminPermissions : systemUserPermissions;

  // Basic fallback for non-system users
  const fallbackPermissions = {
    permissions: [],
    pageAccess: { dashboard: true },
    actions: {},
    navItems: [],
  };

  const finalPermissions = currentPermissions || fallbackPermissions;

  // Permission check functions
  const hasUserPermission = useMemo(() => {
    return (resource: string, action: string): boolean => {
      if (isAdmin) return true;
      return hasPermission(permissions, resource, action);
    };
  }, [isAdmin, permissions]);

  const canUserAccessPage = useMemo(() => {
    return (resource: string): boolean => {
      if (isAdmin) return true;
      const resourceKey = resource.toLowerCase();
      return (finalPermissions.pageAccess as Record<string, boolean>)[resourceKey] || false;
    };
  }, [isAdmin, finalPermissions.pageAccess]);

  const canUserPerformAction = useMemo(() => {
    return (resource: string, action: string): boolean => {
      if (isAdmin) return true;
      const resourceKey = resource.toLowerCase();
      const actionKey = action.toLowerCase();
      const resourceActions = (finalPermissions.actions as Record<string, Record<string, boolean>>)[resourceKey];
      return resourceActions?.[actionKey] || false;
    };
  }, [isAdmin, finalPermissions.actions]);

  return {
    // Permission data
    permissions: finalPermissions.permissions,
    pageAccess: finalPermissions.pageAccess,
    actions: finalPermissions.actions,
    navItems: finalPermissions.navItems,
    
    // Permission check functions
    hasUserPermission,
    canUserAccessPage,
    canUserPerformAction,
    canAccessAdminOnly: () => isAdmin,
    
    // State
    isLoading,
    isAdmin,
    isSystemUser,
    isHydrated,
    
    // Constants
    RESOURCES,
    PERMISSIONS,
    
    // No-op cache management for compatibility
    invalidateCache: () => {},
  };
}