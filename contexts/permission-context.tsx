"use client";

import { createContext, useContext, useState, useEffect, ReactNode, useMemo, useCallback } from 'react';
import { useSession } from 'next-auth/react';

interface PermissionState {
  isAdmin: boolean;
  isLoading: boolean;
  pageAccess: Record<string, boolean>;
  actions: Record<string, Record<string, boolean>>;
  isInitialized: boolean;
}

interface PermissionContextType extends PermissionState {
  refresh: () => void;
}

const PermissionContext = createContext<PermissionContextType | null>(null);

const INITIAL_STATE: PermissionState = {
  isAdmin: false,
  isLoading: true, // Start with loading true to prevent flashing
  pageAccess: { dashboard: true },
  actions: {},
  isInitialized: false,
};

export function PersistentPermissionProvider({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession();
  const [permissionState, setPermissionState] = useState<PermissionState>(() => {
    // Initialize with a more stable state to prevent flashing
    return {
      isAdmin: false,
      isLoading: true,
      pageAccess: { dashboard: true },
      actions: {},
      isInitialized: false,
    };
  });

  useEffect(() => {
    // Handle loading state - only for very brief moment
    if (status === 'loading') {
      setPermissionState(prev => ({
        ...prev,
        isLoading: true,
        isInitialized: false
      }));
      return;
    }

    // Small delay to prevent rapid state changes and flashing
    const timeoutId = setTimeout(() => {
      // Check if user has admin privileges (ADMIN role OR system admin role)
      const isAdmin = session?.user?.role === 'ADMIN' || session?.user?.role === 'SYSTEM_USER';
      const isSystemAdmin = session?.user?.role === 'SYSTEM_USER' && 
                           session?.user?.systemRole?.toLowerCase().includes('admin');
      
      // Get actual user permissions
      const permissions = session?.user?.permissions || [];
      
      // For admin users, only give automatic access to users/roles management
      // All other permissions should be based on their actual assigned permissions
      if (isAdmin || isSystemAdmin) {
        setPermissionState({
          isAdmin: true,
          isLoading: false,
          pageAccess: {
            dashboard: true,
            products: hasPageAccess(permissions, 'products'),
            orders: hasPageAccess(permissions, 'orders'),
            clients: hasPageAccess(permissions, 'clients'),
            companies: hasPageAccess(permissions, 'companies'),
            inventory: hasPageAccess(permissions, 'inventory'),
            analytics: hasPageAccess(permissions, 'analytics'),
            users: true, // Admin always has access to users
            roles: true, // Admin always has access to roles
          },
          actions: {
            products: { 
              view: hasAction(permissions, 'products', 'view') || hasAction(permissions, 'products', 'read'),
              create: hasAction(permissions, 'products', 'create'),
              edit: hasAction(permissions, 'products', 'edit') || hasAction(permissions, 'products', 'update'),
              delete: hasAction(permissions, 'products', 'delete')
            },
            orders: { 
              view: hasAction(permissions, 'orders', 'view') || hasAction(permissions, 'orders', 'read'),
              create: hasAction(permissions, 'orders', 'create'),
              edit: hasAction(permissions, 'orders', 'edit') || hasAction(permissions, 'orders', 'update'),
              export: hasAction(permissions, 'orders', 'export')
            },
            clients: { 
              view: hasAction(permissions, 'clients', 'view') || hasAction(permissions, 'clients', 'read'),
              create: hasAction(permissions, 'clients', 'create'),
              edit: hasAction(permissions, 'clients', 'edit') || hasAction(permissions, 'clients', 'update'),
              delete: hasAction(permissions, 'clients', 'delete')
            },
            companies: { 
              view: hasAction(permissions, 'companies', 'view') || hasAction(permissions, 'companies', 'read'),
              create: hasAction(permissions, 'companies', 'create'),
              edit: hasAction(permissions, 'companies', 'edit') || hasAction(permissions, 'companies', 'update'),
              delete: hasAction(permissions, 'companies', 'delete')
            },
            inventory: { 
              view: hasAction(permissions, 'inventory', 'view') || hasAction(permissions, 'inventory', 'read'),
              create: hasAction(permissions, 'inventory', 'create'),
              edit: hasAction(permissions, 'inventory', 'edit') || hasAction(permissions, 'inventory', 'update'),
              export: hasAction(permissions, 'inventory', 'export')
            },
            analytics: { 
              read: hasAction(permissions, 'analytics', 'read') || hasAction(permissions, 'analytics', 'view'),
              export: hasAction(permissions, 'analytics', 'export')
            },
            users: {
              view: hasAction(permissions, 'users', 'view') || hasAction(permissions, 'users', 'read'),
              create: hasAction(permissions, 'users', 'create'),
              edit: hasAction(permissions, 'users', 'edit') || hasAction(permissions, 'users', 'update'),
              delete: hasAction(permissions, 'users', 'delete'),
            },
            roles: {
              view: hasAction(permissions, 'roles', 'view') || hasAction(permissions, 'roles', 'read'),
              create: hasAction(permissions, 'roles', 'create'),
              edit: hasAction(permissions, 'roles', 'edit') || hasAction(permissions, 'roles', 'update'),
              delete: hasAction(permissions, 'roles', 'delete'),
            },
          },
          isInitialized: true,
        });
        return;
      }

      // For non-admin users, also set immediately to avoid loading states
      if (session?.user) {
        const permissions = session.user.permissions || [];
        
        setPermissionState({
          isAdmin: false,
          isLoading: false,
          pageAccess: {
            dashboard: true,
            products: hasPageAccess(permissions, 'products'),
            orders: hasPageAccess(permissions, 'orders'),
            clients: hasPageAccess(permissions, 'clients'),
            companies: hasPageAccess(permissions, 'companies'),
            inventory: hasPageAccess(permissions, 'inventory'),
            analytics: hasPageAccess(permissions, 'analytics'),
            users: hasPageAccess(permissions, 'users'),
            roles: hasPageAccess(permissions, 'roles'),
          },
          actions: {
            products: {
              view: hasAction(permissions, 'products', 'view'),
              create: hasAction(permissions, 'products', 'create'),
              edit: hasAction(permissions, 'products', 'edit'),
              delete: hasAction(permissions, 'products', 'delete'),
            },
            orders: {
              view: hasAction(permissions, 'orders', 'view'),
              create: hasAction(permissions, 'orders', 'create'),
              edit: hasAction(permissions, 'orders', 'edit'),
            },
            clients: {
              view: hasAction(permissions, 'clients', 'view'),
              create: hasAction(permissions, 'clients', 'create'),
              edit: hasAction(permissions, 'clients', 'edit'),
              delete: hasAction(permissions, 'clients', 'delete'),
            },
            companies: {
              view: hasAction(permissions, 'companies', 'view'),
              create: hasAction(permissions, 'companies', 'create'),
              edit: hasAction(permissions, 'companies', 'edit'),
              delete: hasAction(permissions, 'companies', 'delete'),
            },
            inventory: {
              view: hasAction(permissions, 'inventory', 'view'),
              create: hasAction(permissions, 'inventory', 'create'),
              edit: hasAction(permissions, 'inventory', 'edit'),
            },
            analytics: {
              read: hasAction(permissions, 'analytics', 'read'),
              export: hasAction(permissions, 'analytics', 'export'),
            },
            users: {
              view: hasAction(permissions, 'users', 'view') || hasAction(permissions, 'users', 'read'),
              create: hasAction(permissions, 'users', 'create'),
              edit: hasAction(permissions, 'users', 'edit') || hasAction(permissions, 'users', 'update'),
              delete: hasAction(permissions, 'users', 'delete'),
            },
            roles: {
              view: hasAction(permissions, 'roles', 'view') || hasAction(permissions, 'roles', 'read'),
              create: hasAction(permissions, 'roles', 'create'),
              edit: hasAction(permissions, 'roles', 'edit') || hasAction(permissions, 'roles', 'update'),
              delete: hasAction(permissions, 'roles', 'delete'),
            },
          },
          isInitialized: true,
        });
      } else if (status === 'unauthenticated') {
        setPermissionState({
          isAdmin: false,
          isLoading: false,
          pageAccess: { dashboard: true },
          actions: {},
          isInitialized: true,
        });
      }
    }, 50); // Small delay to prevent flashing

    return () => clearTimeout(timeoutId);
  }, [session, status]);

  const refresh = useCallback(() => {
    // Force re-evaluation of permissions
    setPermissionState(prev => ({ ...prev, isInitialized: false }));
  }, []);

  const contextValue: PermissionContextType = useMemo(() => ({
    ...permissionState,
    refresh,
  }), [permissionState, refresh]);

  return (
    <PermissionContext.Provider value={contextValue}>
      {children}
    </PermissionContext.Provider>
  );
}

export function usePersistentPermissions() {
  const context = useContext(PermissionContext);
  if (!context) {
    throw new Error('usePersistentPermissions must be used within PersistentPermissionProvider');
  }
  return context;
}

// Helper functions
function hasPageAccess(permissions: unknown[], resource: string): boolean {
  return permissions.some((p: unknown) => {
    const permission = p as { resource?: string; action?: string };
    return permission.resource?.toLowerCase() === resource.toLowerCase() && 
      ['view', 'read', 'access'].includes(permission.action?.toLowerCase() || '');
  });
}

function hasAction(permissions: unknown[], resource: string, action: string): boolean {
  return permissions.some((p: unknown) => {
    const permission = p as { resource?: string; action?: string };
    return permission.resource?.toLowerCase() === resource.toLowerCase() && 
      permission.action?.toLowerCase() === action.toLowerCase();
  });
}