/**
 * High-performance cache service for permissions and navigation
 * Uses memory cache for immediate access and localStorage for persistence
 */

interface CacheItem<T> {
  data: T;
  expiry: number;
  key: string;
}

class PermissionCacheService {
  private memoryCache = new Map<string, CacheItem<any>>();
  private readonly CACHE_DURATION = 10 * 60 * 1000; // 10 minutes
  private readonly MEMORY_CACHE_SIZE = 100; // Max items in memory

  /**
   * Get cached data with memory-first fallback to localStorage
   */
  get<T>(key: string): T | null {
    // 1. Check memory cache first (fastest)
    const memoryCached = this.memoryCache.get(key);
    if (memoryCached && memoryCached.expiry > Date.now()) {
      return memoryCached.data;
    }

    // 2. Check localStorage (slower but persistent)
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(`perm_cache_${key}`);
        if (stored) {
          const parsed: CacheItem<T> = JSON.parse(stored);
          if (parsed.expiry > Date.now()) {
            // Move to memory cache for faster future access
            this.setMemoryCache(key, parsed.data);
            return parsed.data;
          } else {
            // Remove expired localStorage entry
            localStorage.removeItem(`perm_cache_${key}`);
          }
        }
      } catch (error) {
        console.warn('Cache read error:', error);
      }
    }

    return null;
  }

  /**
   * Set data in both memory and localStorage cache
   */
  set<T>(key: string, data: T): void {
    const expiry = Date.now() + this.CACHE_DURATION;
    const cacheItem: CacheItem<T> = { data, expiry, key };

    // Set in memory cache
    this.setMemoryCache(key, data);

    // Set in localStorage for persistence
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(`perm_cache_${key}`, JSON.stringify(cacheItem));
      } catch (error) {
        console.warn('Cache write error:', error);
      }
    }
  }

  /**
   * Set memory cache with size limit
   */
  private setMemoryCache<T>(key: string, data: T): void {
    // If at capacity, remove oldest item
    if (this.memoryCache.size >= this.MEMORY_CACHE_SIZE) {
      const firstKey = this.memoryCache.keys().next().value;
      this.memoryCache.delete(firstKey);
    }

    const expiry = Date.now() + this.CACHE_DURATION;
    this.memoryCache.set(key, { data, expiry, key });
  }

  /**
   * Invalidate specific cache key
   */
  invalidate(key: string): void {
    this.memoryCache.delete(key);
    if (typeof window !== 'undefined') {
      localStorage.removeItem(`perm_cache_${key}`);
    }
  }

  /**
   * Clear all permission caches
   */
  clearAll(): void {
    this.memoryCache.clear();
    if (typeof window !== 'undefined') {
      // Remove all permission cache keys
      const keysToRemove: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key?.startsWith('perm_cache_')) {
          keysToRemove.push(key);
        }
      }
      keysToRemove.forEach(key => localStorage.removeItem(key));
    }
  }

  /**
   * Get cache key for user permissions
   */
  getUserCacheKey(userId: string, roleId?: string): string {
    return `user_perms_${userId}_${roleId || 'no_role'}`;
  }

  /**
   * Get cache key for navigation items
   */
  getNavCacheKey(userId: string, role: string): string {
    return `nav_items_${userId}_${role}`;
  }

  /**
   * Get cache key for page access
   */
  getPageAccessCacheKey(userId: string, role: string): string {
    return `page_access_${userId}_${role}`;
  }
}

// Singleton instance
export const permissionCache = new PermissionCacheService();

/**
 * Background job simulation for permission preloading
 */
export class PermissionPreloader {
  private preloadQueue = new Set<string>();
  private isProcessing = false;

  /**
   * Queue user permissions for background preloading
   */
  queuePreload(userId: string, roleId?: string): void {
    const cacheKey = permissionCache.getUserCacheKey(userId, roleId);
    this.preloadQueue.add(cacheKey);
    this.processQueue();
  }

  /**
   * Process preload queue in background
   */
  private async processQueue(): Promise<void> {
    if (this.isProcessing || this.preloadQueue.size === 0) return;
    
    this.isProcessing = true;
    
    try {
      // Process one item at a time to avoid blocking
      for (const cacheKey of this.preloadQueue) {
        const cached = permissionCache.get(cacheKey);
        if (!cached) {
          // Simulate background permission loading
          await this.loadUserPermissions(cacheKey);
        }
        this.preloadQueue.delete(cacheKey);
        
        // Yield control to prevent blocking UI
        await new Promise(resolve => setTimeout(resolve, 10));
      }
    } finally {
      this.isProcessing = false;
    }
  }

  /**
   * Simulate loading user permissions in background
   */
  private async loadUserPermissions(cacheKey: string): Promise<void> {
    // This would normally make an API call
    // For now, we'll just simulate it
    console.log(`Background loading permissions for: ${cacheKey}`);
  }
}

export const permissionPreloader = new PermissionPreloader();