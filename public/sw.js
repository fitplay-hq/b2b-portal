// Service Worker for Aggressive Permission Caching
// This runs in the background and caches permissions/API responses

const CACHE_NAME = 'permission-cache-v1';
const PERMISSION_CACHE = 'user-permissions-v1';
const API_CACHE = 'api-responses-v1';

// Cache durations
const PERMISSION_CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours
const API_CACHE_DURATION = 10 * 60 * 1000; // 10 minutes

// Install event - cache critical resources
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll([
        '/',
        '/admin',
        '/login',
        '/globals.css',
        // Add other critical resources
      ]);
    })
  );
});

// Fetch event - intercept network requests
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Handle permission-related API requests
  if (url.pathname.includes('/api/admin/permissions') || 
      url.pathname.includes('/api/admin/users') ||
      url.pathname.includes('/api/admin/roles')) {
    
    event.respondWith(handlePermissionAPI(request));
  }
  // Handle navigation requests
  else if (request.mode === 'navigate') {
    event.respondWith(handleNavigation(request));
  }
  // Handle static assets
  else if (request.destination === 'style' || 
           request.destination === 'script' || 
           request.destination === 'image') {
    event.respondWith(handleStaticAssets(request));
  }
});

// Handle permission API requests with aggressive caching
async function handlePermissionAPI(request) {
  const cache = await caches.open(API_CACHE);
  const cachedResponse = await cache.match(request);
  
  // Check if cached response is still valid
  if (cachedResponse) {
    const cachedTime = cachedResponse.headers.get('sw-cached-time');
    if (cachedTime && (Date.now() - parseInt(cachedTime)) < API_CACHE_DURATION) {
      return cachedResponse;
    }
  }
  
  try {
    // Fetch fresh data
    const response = await fetch(request);
    
    if (response.ok) {
      // Clone response and add cache timestamp
      const responseToCache = response.clone();
      responseToCache.headers.set('sw-cached-time', Date.now().toString());
      
      // Cache the response
      await cache.put(request, responseToCache);
    }
    
    return response;
  } catch (error) {
    // If network fails, return cached response if available
    if (cachedResponse) {
      return cachedResponse;
    }
    throw error;
  }
}

// Handle navigation requests with cache-first strategy
async function handleNavigation(request) {
  const cache = await caches.open(CACHE_NAME);
  const cachedResponse = await cache.match(request);
  
  if (cachedResponse) {
    // Return cached page immediately, update in background
    fetchAndUpdateCache(request, cache);
    return cachedResponse;
  }
  
  // If not cached, fetch from network
  try {
    const response = await fetch(request);
    if (response.ok) {
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    // Return offline page or error
    return new Response('Offline', { status: 503 });
  }
}

// Handle static assets with cache-first strategy
async function handleStaticAssets(request) {
  const cache = await caches.open(CACHE_NAME);
  const cachedResponse = await cache.match(request);
  
  if (cachedResponse) {
    return cachedResponse;
  }
  
  try {
    const response = await fetch(request);
    if (response.ok) {
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    throw error;
  }
}

// Background fetch and update cache
async function fetchAndUpdateCache(request, cache) {
  try {
    const response = await fetch(request);
    if (response.ok) {
      await cache.put(request, response.clone());
    }
  } catch (error) {
    // Silent fail for background updates
  }
}

// Message handler for permission caching
self.addEventListener('message', (event) => {
  if (event.data.type === 'CACHE_PERMISSIONS') {
    cacheUserPermissions(event.data.data);
  } else if (event.data.type === 'CLEAR_CACHE') {
    clearAllCaches();
  }
});

// Cache user permissions in service worker
async function cacheUserPermissions(permissionData) {
  try {
    const cache = await caches.open(PERMISSION_CACHE);
    const response = new Response(JSON.stringify(permissionData), {
      headers: {
        'Content-Type': 'application/json',
        'sw-cached-time': Date.now().toString()
      }
    });
    
    await cache.put('user-permissions', response);
  } catch (error) {
    console.error('[SW] Failed to cache permissions:', error);
  }
}

// Clear all caches
async function clearAllCaches() {
  try {
    const cacheNames = await caches.keys();
    await Promise.all(
      cacheNames.map(cacheName => caches.delete(cacheName))
    );
  } catch (error) {
    console.error('[SW] Failed to clear caches:', error);
  }
}

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter(cacheName => cacheName !== CACHE_NAME && 
                              cacheName !== PERMISSION_CACHE && 
                              cacheName !== API_CACHE)
          .map(cacheName => caches.delete(cacheName))
      );
    })
  );
});

// Background sync for permission updates
self.addEventListener('sync', (event) => {
  if (event.tag === 'permission-sync') {
    event.waitUntil(syncPermissions());
  }
});

// Sync permissions in background
async function syncPermissions() {
  try {
    // Get cached permissions
    const cache = await caches.open(PERMISSION_CACHE);
    const cachedResponse = await cache.match('user-permissions');
    
    if (cachedResponse) {
      const permissionData = await cachedResponse.json();
      
      // Check if permissions need refresh
      const cachedTime = cachedResponse.headers.get('sw-cached-time');
      if (cachedTime && (Date.now() - parseInt(cachedTime)) > PERMISSION_CACHE_DURATION) {
        // Permissions are stale, could trigger refresh
        // Send message to main thread to refresh permissions
        self.clients.matchAll().then(clients => {
          clients.forEach(client => {
            client.postMessage({
              type: 'PERMISSIONS_STALE',
              data: permissionData
            });
          });
        });
      }
    }
  } catch (error) {
    console.error('[SW] Permission sync failed:', error);
  }
}