import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { permanentPermissionStorage } from '@/lib/permanent-permission-storage';

/**
 * Next.js Prefetching Strategy for Permissions
 * Prefetches user permissions and navigation pages
 */
export class NextJSPermissionPrefetcher {
  private static instance: NextJSPermissionPrefetcher;
  private router: any;

  static getInstance(): NextJSPermissionPrefetcher {
    if (!NextJSPermissionPrefetcher.instance) {
      NextJSPermissionPrefetcher.instance = new NextJSPermissionPrefetcher();
    }
    return NextJSPermissionPrefetcher.instance;
  }

  setRouter(router: any) {
    this.router = router;
  }

  /**
   * Prefetch all accessible pages based on user permissions
   */
  async prefetchUserPages(session: any) {
    if (!this.router || !session?.user) return;

    try {
      const stored = permanentPermissionStorage.getStoredPermissions(session.user.id);
      
      if (stored) {
        const pagesToPrefetch = this.getAccessiblePages(stored.pageAccess, session.user.role);
        
        // Prefetch pages in parallel for instant navigation
        await Promise.allSettled(
          pagesToPrefetch.map(async (page) => {
            try {
              await this.router.prefetch(page.path);
              console.log(`[Prefetch] Prefetched: ${page.path}`);
            } catch (error) {
              console.warn(`[Prefetch] Failed to prefetch ${page.path}:`, error);
            }
          })
        );
      }
    } catch (error) {
      console.error('[Prefetch] Error prefetching pages:', error);
    }
  }

  /**
   * Prefetch API endpoints for permissions
   */
  async prefetchPermissionAPI(userId: string, roleId: string) {
    if (!this.router) return;

    try {
      // Prefetch permission-related API calls
      const apiEndpoints = [
        `/api/admin/permissions`,
        `/api/admin/users/${userId}`,
        `/api/admin/roles/${roleId}`,
      ];

      // Use fetch with cache for API prefetching
      await Promise.allSettled(
        apiEndpoints.map(async (endpoint) => {
          try {
            await fetch(endpoint, {
              method: 'GET',
              headers: { 'Content-Type': 'application/json' },
              // Use cache to speed up subsequent requests
              cache: 'force-cache',
            });
          } catch (error) {
            // Ignore prefetch errors
          }
        })
      );
    } catch (error) {
      console.error('[Prefetch] API prefetch error:', error);
    }
  }

  /**
   * Get pages user can access based on permissions
   */
  private getAccessiblePages(pageAccess: Record<string, boolean>, role: string) {
    const allPages = [
      { path: '/admin', permission: 'dashboard' },
      { path: '/admin/products', permission: 'products' },
      { path: '/admin/orders', permission: 'orders' },
      { path: '/admin/clients', permission: 'clients' },
      { path: '/admin/companies', permission: 'companies' },
      { path: '/admin/users', permission: 'users', adminOnly: true },
      { path: '/admin/roles', permission: 'roles', adminOnly: true },
    ];

    return allPages.filter(page => {
      if (page.adminOnly && role !== 'ADMIN') return false;
      if (role === 'ADMIN') return true;
      return pageAccess[page.permission];
    });
  }

  /**
   * Prefetch critical resources for first paint
   */
  async prefetchCriticalResources() {
    if (!this.router) return;

    try {
      // Prefetch critical pages that are always needed
      const criticalPages = ['/admin', '/login'];
      
      await Promise.allSettled(
        criticalPages.map(page => this.router.prefetch(page))
      );
    } catch (error) {
      console.error('[Prefetch] Critical resource prefetch error:', error);
    }
  }
}

/**
 * React Hook for Next.js Permission Prefetching
 */
export function usePermissionPrefetch() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const prefetcher = NextJSPermissionPrefetcher.getInstance();

  useEffect(() => {
    prefetcher.setRouter(router);
  }, [router, prefetcher]);

  useEffect(() => {
    if (status === 'authenticated' && session?.user) {
      // Prefetch user's accessible pages immediately
      prefetcher.prefetchUserPages(session);
      
      // Prefetch API endpoints if system user
      if (session.user.role === 'SYSTEM_USER' && session.user.systemRoleId) {
        prefetcher.prefetchPermissionAPI(session.user.id, session.user.systemRoleId);
      }
    }
  }, [session, status, prefetcher]);

  useEffect(() => {
    // Prefetch critical resources on app load
    prefetcher.prefetchCriticalResources();
  }, [prefetcher]);

  return {
    prefetchUserPages: () => prefetcher.prefetchUserPages(session),
    prefetchAPI: () => {
      if (session?.user.systemRoleId) {
        prefetcher.prefetchPermissionAPI(session.user.id, session.user.systemRoleId);
      }
    },
  };
}