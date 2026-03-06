"use client";

import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { permanentPermissionStorage } from '@/lib/permanent-permission-storage';

/**
 * Resource Hints and Preloading for Ultra-Fast Performance
 */
export function ResourcePreloader() {
  const { data: session, status } = useSession();

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Add resource hints to document head
    addResourceHints();
    
    // Preload critical assets
    preloadCriticalAssets();
    
    // Setup service worker for caching (if available)
    setupServiceWorkerCaching();
  }, []);

  useEffect(() => {
    if (status === 'authenticated' && session?.user) {
      // Preload user-specific resources
      preloadUserResources(session);
    }
  }, [session, status]);

  return null; // This component doesn't render anything
}

/**
 * Add resource hints to improve loading performance
 */
function addResourceHints() {
  const head = document.head;
  
  // DNS prefetch for external resources
  const dnsPrefetches = [
    'https://fonts.googleapis.com',
    'https://fonts.gstatic.com',
  ];

  dnsPrefetches.forEach(url => {
    if (!document.querySelector(`link[rel="dns-prefetch"][href="${url}"]`)) {
      const link = document.createElement('link');
      link.rel = 'dns-prefetch';
      link.href = url;
      head.appendChild(link);
    }
  });

  // Preconnect to critical domains
  const preconnects = [
    'https://api.uploadthing.com',
  ];

  preconnects.forEach(url => {
    if (!document.querySelector(`link[rel="preconnect"][href="${url}"]`)) {
      const link = document.createElement('link');
      link.rel = 'preconnect';
      link.href = url;
      link.crossOrigin = 'anonymous';
      head.appendChild(link);
    }
  });
}

/**
 * Preload critical assets for instant access
 */
function preloadCriticalAssets() {
  // Preload critical CSS and JS chunks
  const criticalAssets = [
    '/globals.css',
    // Add other critical assets
  ];

  criticalAssets.forEach(asset => {
    if (!document.querySelector(`link[rel="preload"][href="${asset}"]`)) {
      const link = document.createElement('link');
      link.rel = 'preload';
      
      if (asset.endsWith('.css')) {
        link.as = 'style';
      } else if (asset.endsWith('.js')) {
        link.as = 'script';
      }
      
      link.href = asset;
      document.head.appendChild(link);
    }
  });
}

/**
 * Preload user-specific resources based on permissions
 */
function preloadUserResources(session: any) {
  if (!session?.user) return;

  // Get stored permissions
  const stored = permanentPermissionStorage.getStoredPermissions(session.user.id);
  
  if (stored) {
    // Preload images and assets for accessible pages
    const userAssets = getAssetsForUserPages(stored.pageAccess, session.user.role);
    
    userAssets.forEach(asset => {
      preloadAsset(asset.url, asset.type);
    });
  }
}

/**
 * Get assets to preload based on user's accessible pages
 */
function getAssetsForUserPages(pageAccess: Record<string, boolean>, role: string) {
  const assets: Array<{url: string, type: string}> = [];
  
  // Dashboard assets (always accessible)
  assets.push(
    { url: '/icons/dashboard.svg', type: 'image' },
    { url: '/icons/chart.svg', type: 'image' }
  );
  
  // Page-specific assets
  if (pageAccess.products || role === 'ADMIN') {
    assets.push({ url: '/icons/package.svg', type: 'image' });
  }
  
  if (pageAccess.orders || role === 'ADMIN') {
    assets.push({ url: '/icons/shopping-cart.svg', type: 'image' });
  }
  
  if (pageAccess.clients || role === 'ADMIN') {
    assets.push({ url: '/icons/users.svg', type: 'image' });
  }
  
  if (pageAccess.companies || role === 'ADMIN') {
    assets.push({ url: '/icons/building.svg', type: 'image' });
  }
  
  return assets;
}

/**
 * Preload individual asset
 */
function preloadAsset(url: string, type: string) {
  if (document.querySelector(`link[rel="preload"][href="${url}"]`)) return;
  
  const link = document.createElement('link');
  link.rel = 'preload';
  link.href = url;
  link.as = type;
  
  if (type === 'image') {
    link.type = 'image/svg+xml';
  }
  
  document.head.appendChild(link);
}

/**
 * Setup Service Worker for aggressive caching
 */
function setupServiceWorkerCaching() {
  if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
    navigator.serviceWorker.register('/sw.js').then(registration => {
      console.log('[SW] Service Worker registered for permission caching');
      
      // Send user permissions to service worker for caching
      if (registration.active) {
        const stored = localStorage.getItem('user_permissions_v2');
        if (stored) {
          registration.active.postMessage({
            type: 'CACHE_PERMISSIONS',
            data: JSON.parse(stored)
          });
        }
      }
    }).catch(error => {
      console.warn('[SW] Service Worker registration failed:', error);
    });
  }
}

/**
 * Critical Resource Preloader - runs immediately on app start
 */
export function CriticalResourcePreloader() {
  useEffect(() => {
    // Immediate preload of absolutely critical resources
    const criticalResources = [
      { url: '/api/auth/session', type: 'fetch' },
      { url: '/admin', type: 'page' },
    ];

    criticalResources.forEach(resource => {
      if (resource.type === 'fetch') {
        // Prefetch API endpoint
        fetch(resource.url, { 
          method: 'GET',
          priority: 'high',
          cache: 'force-cache'
        } as any).catch(() => {});
      } else if (resource.type === 'page') {
        // Prefetch page (Next.js)
        if (window.__NEXT_DATA__) {
          const router = (window as any).__NEXT_ROUTER__;
          if (router) {
            router.prefetch(resource.url).catch(() => {});
          }
        }
      }
    });
  }, []);

  return null;
}