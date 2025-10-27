"use client";

import { SessionProvider as NextAuthSessionProvider } from 'next-auth/react';
import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { sessionPermissionPreloader } from '@/lib/session-permission-preloader';
import { permissionCache } from '@/lib/permission-cache';
import { permanentPermissionStorage } from '@/lib/permanent-permission-storage';
import { sidebarPrefetcher } from '@/lib/sidebar-prefetcher';
import type { UserSession, Permission } from '@/lib/utils';

interface SessionProviderProps {
  children: React.ReactNode;
  session?: unknown;
}

function SessionWarmupComponent() {
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === 'authenticated' && session?.user) {
      // CRITICAL: Immediately prefetch SIDEBAR data specifically
      sidebarPrefetcher.prefetchSidebarData(session);
      
      // For SYSTEM_USER, also store permissions permanently
      if (session.user.role === 'SYSTEM_USER' && session.user.permissions) {
        const userId = session.user.id;
        const roleId = session.user.systemRoleId;
        
        if (userId && roleId) {
          // URGENT: Store permissions permanently to avoid 25-second loading
          permanentPermissionStorage.storeUserPermissions(
            userId, 
            roleId, 
            session.user.permissions
          );
          
          // Also cache for immediate access
          const cacheKey = permissionCache.getUserCacheKey(userId, roleId);
          const permissionData = {
            permissions: session.user.permissions,
            pageAccess: computePageAccess(session.user.permissions),
            actions: computeActions(session.user.permissions),
            navItems: [],
            timestamp: Date.now()
          };
          
          permissionCache.set(cacheKey, permissionData);
        }
      }
      
      // Fallback warmup for any missing permissions
      sessionPermissionPreloader.warmupUserPermissions(session as UserSession);
    }
  }, [session, status]);

  return null;
}

// Helper functions for session provider
function computePageAccess(permissions: Permission[]) {
  return {
    dashboard: true,
    products: canAccessPage(permissions, 'products'),
    orders: canAccessPage(permissions, 'orders'),
    clients: canAccessPage(permissions, 'clients'),
    companies: canAccessPage(permissions, 'companies'),
    inventory: canAccessPage(permissions, 'inventory'),
    users: false,
    roles: false,
  };
}

function computeActions(permissions: Permission[]) {
  return {
    products: {
      view: canPerformAction(permissions, 'products', 'view'),
      create: canPerformAction(permissions, 'products', 'create'),
      edit: canPerformAction(permissions, 'products', 'edit'),
      delete: canPerformAction(permissions, 'products', 'delete'),
    },
    orders: {
      view: canPerformAction(permissions, 'orders', 'view'),
      create: canPerformAction(permissions, 'orders', 'create'),
      edit: canPerformAction(permissions, 'orders', 'edit'),
    },
    clients: {
      view: canPerformAction(permissions, 'clients', 'view'),
      create: canPerformAction(permissions, 'clients', 'create'),
      edit: canPerformAction(permissions, 'clients', 'edit'),
      delete: canPerformAction(permissions, 'clients', 'delete'),
    },
    companies: {
      view: canPerformAction(permissions, 'companies', 'view'),
      create: canPerformAction(permissions, 'companies', 'create'),
      edit: canPerformAction(permissions, 'companies', 'edit'),
      delete: canPerformAction(permissions, 'companies', 'delete'),
    },
    inventory: {
      view: canPerformAction(permissions, 'inventory', 'view'),
      create: canPerformAction(permissions, 'inventory', 'create'),
      edit: canPerformAction(permissions, 'inventory', 'edit'),
    },
  };
}

function canAccessPage(permissions: Permission[], resource: string): boolean {
  return permissions.some(p => 
    p.resource.toLowerCase() === resource.toLowerCase() && 
    ['view', 'read', 'access'].includes(p.action.toLowerCase())
  );
}

function canPerformAction(permissions: Permission[], resource: string, action: string): boolean {
  return permissions.some(p => 
    p.resource.toLowerCase() === resource.toLowerCase() && 
    p.action.toLowerCase() === action.toLowerCase()
  );
}

export function SessionProvider({ children, session }: SessionProviderProps) {
  return (
    <NextAuthSessionProvider session={session}>
      <SessionWarmupComponent />
      {children}
    </NextAuthSessionProvider>
  );
}