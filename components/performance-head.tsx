import Head from 'next/head';

interface PerformanceHeadProps {
  userRole?: string;
  hasPermissions?: boolean;
}

/**
 * Performance-optimized Head component with resource hints
 */
export function PerformanceHead({ userRole, hasPermissions }: PerformanceHeadProps) {
  return (
    <Head>
      {/* Critical resource hints */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link rel="dns-prefetch" href="https://api.uploadthing.com" />
      
      {/* Preload critical CSS */}
      <link
        rel="preload"
        href="/globals.css"
        as="style"
        onLoad="this.onload=null;this.rel='stylesheet'"
      />
      
      {/* Prefetch based on user role */}
      {userRole === 'ADMIN' && (
        <>
          <link rel="prefetch" href="/admin/users" />
          <link rel="prefetch" href="/admin/roles" />
          <link rel="prefetch" href="/api/admin/users" />
          <link rel="prefetch" href="/api/admin/roles" />
        </>
      )}
      
      {hasPermissions && (
        <>
          <link rel="prefetch" href="/admin/products" />
          <link rel="prefetch" href="/admin/orders" />
          <link rel="prefetch" href="/admin/clients" />
          <link rel="prefetch" href="/admin/companies" />
        </>
      )}
      
      {/* Service Worker registration */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
            if ('serviceWorker' in navigator) {
              window.addEventListener('load', function() {
                navigator.serviceWorker.register('/sw.js')
                  .then(function(registration) {
                    console.log('[SW] Registered for permission caching');
                  })
                  .catch(function(error) {
                    console.warn('[SW] Registration failed:', error);
                  });
              });
            }
          `
        }}
      />
      
      {/* Critical performance hints */}
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
      
      {/* Prefetch DNS for external resources */}
      <meta httpEquiv="x-dns-prefetch-control" content="on" />
      
      {/* Preload key fonts */}
      <link
        rel="preload"
        href="/fonts/inter-var.woff2"
        as="font"
        type="font/woff2"
        crossOrigin="anonymous"
      />
      
      {/* Performance timing API */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
            window.performance && window.performance.mark && window.performance.mark('layout-start');
          `
        }}
      />
    </Head>
  );
}

/**
 * Dynamic Head component that updates based on permissions
 */
export function DynamicPerformanceHead() {
  // This would be used in pages that need dynamic prefetching
  return (
    <Head>
      <link rel="prefetch" href="/api/auth/session" />
      <script
        dangerouslySetInnerHTML={{
          __html: `
            // Prefetch permissions immediately
            if (localStorage.getItem('user_permissions_v2')) {
              const stored = JSON.parse(localStorage.getItem('user_permissions_v2'));
              if (stored && stored.expiresAt > Date.now()) {
                // Permissions are cached, prefetch user pages
                const pages = ['/admin', '/admin/products', '/admin/orders'];
                if (window.__NEXT_ROUTER__) {
                  pages.forEach(page => {
                    window.__NEXT_ROUTER__.prefetch(page).catch(() => {});
                  });
                }
              }
            }
          `
        }}
      />
    </Head>
  );
}