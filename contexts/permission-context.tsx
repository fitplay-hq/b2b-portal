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
      const isAdmin = session?.user?.role === 'ADMIN';
      const isSystemAdmin = session?.user?.role === 'SYSTEM_USER' && 
                           session?.user?.systemRole?.toLowerCase().includes('admin');
      
      // For admin users (either ADMIN or system admin), set permissions immediately and never show loading
      if (isAdmin || isSystemAdmin) {
        setPermissionState({
          isAdmin: true, // Set to true for both ADMIN and system admin users
          isLoading: false,
          pageAccess: {
            dashboard: true,
            products: true,
            orders: true,
            clients: true,
            companies: true,
            inventory: true,
            analytics: true,
            users: true,
            roles: true,
          },
          actions: {
            products: { view: true, create: true, edit: true, delete: true },
            orders: { view: true, create: true, edit: true },
            clients: { view: true, create: true, edit: true, delete: true },
            companies: { view: true, create: true, edit: true, delete: true },
            inventory: { view: true, create: true, edit: true },
            analytics: { read: true, export: true },
            users: { view: true, create: true, edit: true, delete: true },
            roles: { view: true, create: true, edit: true, delete: true },
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
            users: false,
            roles: false,
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