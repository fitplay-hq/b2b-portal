"use client";

import { createContext, useContext, useState, useEffect, ReactNode, useMemo, useCallback } from 'react';
import { useSession } from 'next-auth/react';

interface FastPermissionState {
  isAdmin: boolean;
  isLoading: boolean;
  pageAccess: Record<string, boolean>;
  actions: Record<string, Record<string, boolean>>;
  isInitialized: boolean;
  userInfo: {
    id: string;
    name: string;
    email: string;
    role: string;
    systemRole?: string;
  } | null;
}

interface FastPermissionContextType extends FastPermissionState {
  refresh: () => void;
}

const FastPermissionContext = createContext<FastPermissionContextType | null>(null);

// Instant defaults - SECURE defaults, not permissive
const INSTANT_DEFAULTS: FastPermissionState = {
  isAdmin: false,
  isLoading: false, // Never show loading - always show something
  pageAccess: { 
    dashboard: true, // Only dashboard is always accessible
    products: false,
    orders: false,
    clients: false,
    companies: false,
    inventory: false,
    analytics: false,
    users: false,
    roles: false,
  },
  actions: {
    products: { view: false, create: false, edit: false, delete: false },
    orders: { view: false, create: false, edit: false, email: false },
    clients: { view: false, create: false, edit: false, delete: false },
    companies: { view: false, create: false, edit: false, delete: false },
    inventory: { view: false, create: false, edit: false },
    analytics: { read: false, export: false },
    users: { view: false, create: false, edit: false, delete: false },
    roles: { view: false, create: false, edit: false, delete: false },
  },
  isInitialized: true, // Always initialized
  userInfo: null,
};

// Lightning-fast cache key
const CACHE_KEY = 'fast_permissions_v3';
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export function FastPermissionProvider({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession();
  
  // Initialize with intelligent defaults from cache or fallback
  const [permissionState, setPermissionState] = useState<FastPermissionState>(() => {
    if (typeof window === 'undefined') return INSTANT_DEFAULTS;
    
    try {
      const cached = sessionStorage.getItem(CACHE_KEY);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (parsed.timestamp && Date.now() - parsed.timestamp < CACHE_DURATION) {
          return { ...parsed.data, isLoading: false };
        }
      }
    } catch (e) {
      // Ignore cache errors
    }
    
    return INSTANT_DEFAULTS;
  });

  // Immediate permission calculation - no delays
  useEffect(() => {
    if (!session?.user) {
      // Not logged in - keep safe defaults
      const guestState: FastPermissionState = {
        ...INSTANT_DEFAULTS,
        userInfo: null,
        pageAccess: { dashboard: true },
        actions: {},
      };
      setPermissionState(guestState);
      return;
    }

    const { user } = session;
    
    // Instant admin detection
    const isAdmin = user.role === 'ADMIN';
    const isSystemAdmin = user.role === 'SYSTEM_USER' && 
                         user.systemRole?.toLowerCase().includes('admin');
    
    const userInfo = {
      id: user.id || '',
      name: user.name || '',
      email: user.email || '',
      role: user.role || '',
      systemRole: user.systemRole,
    };

    // Admin gets everything instantly
    if (isAdmin || isSystemAdmin) {
      const adminState: FastPermissionState = {
        isAdmin: true,
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
          orders: { view: true, create: true, edit: true, email: true },
          clients: { view: true, create: true, edit: true, delete: true },
          companies: { view: true, create: true, edit: true, delete: true },
          inventory: { view: true, create: true, edit: true },
          analytics: { read: true, export: true },
          users: { view: true, create: true, edit: true, delete: true },
          roles: { view: true, create: true, edit: true, delete: true },
        },
        isInitialized: true,
        userInfo,
      };
      
      setPermissionState(adminState);
      
      // Cache admin permissions
      try {
        sessionStorage.setItem(CACHE_KEY, JSON.stringify({
          data: adminState,
          timestamp: Date.now(),
        }));
      } catch (e) {
        // Ignore storage errors
      }
      return;
    }

    // System users - calculate permissions instantly
    const permissions = user.permissions || [];
    
    const systemUserState: FastPermissionState = {
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
        users: false, // System users can't access users
        roles: false, // System users can't access roles
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
          email: hasAction(permissions, 'orders', 'email'),
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
        users: { view: false, create: false, edit: false, delete: false },
        roles: { view: false, create: false, edit: false, delete: false },
      },
      isInitialized: true,
      userInfo,
    };

    setPermissionState(systemUserState);
    
    // Cache system user permissions
    try {
      sessionStorage.setItem(CACHE_KEY, JSON.stringify({
        data: systemUserState,
        timestamp: Date.now(),
      }));
    } catch (e) {
      // Ignore storage errors
    }
  }, [session]);

  const refresh = useCallback(() => {
    // Clear cache and force refresh
    try {
      sessionStorage.removeItem(CACHE_KEY);
    } catch (e) {
      // Ignore storage errors
    }
    
    // Force re-evaluation on next render
    setPermissionState(prev => ({ ...prev, isInitialized: false }));
  }, []);

  const contextValue: FastPermissionContextType = useMemo(() => ({
    ...permissionState,
    refresh,
  }), [permissionState, refresh]);

  return (
    <FastPermissionContext.Provider value={contextValue}>
      {children}
    </FastPermissionContext.Provider>
  );
}

export function useFastPermissions() {
  const context = useContext(FastPermissionContext);
  if (!context) {
    // Return safe defaults instead of throwing
    return {
      ...INSTANT_DEFAULTS,
      refresh: () => {},
    };
  }
  return context;
}

// Utility functions - optimized for speed but SECURE
function hasPageAccess(permissions: unknown[], resource: string): boolean {
  if (!Array.isArray(permissions)) return false; // Fail CLOSED for security
  
  return permissions.some((p: unknown) => {
    const permission = p as { resource?: string; action?: string };
    return permission.resource?.toLowerCase() === resource.toLowerCase() && 
      ['view', 'read', 'access'].includes(permission.action?.toLowerCase() || '');
  });
}

function hasAction(permissions: unknown[], resource: string, action: string): boolean {
  if (!Array.isArray(permissions)) return false; // Fail CLOSED for security
  
  return permissions.some((p: unknown) => {
    const permission = p as { resource?: string; action?: string };
    return permission.resource?.toLowerCase() === resource.toLowerCase() && 
      permission.action?.toLowerCase() === action.toLowerCase();
  });
}