import { Redis } from '@upstash/redis'

// Initialize Redis client for production caching
let redis: Redis | null = null;

const initializeRedis = () => {
  try {
    // Check for Upstash Redis first (recommended)
    if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
      redis = new Redis({
        url: process.env.UPSTASH_REDIS_REST_URL,
        token: process.env.UPSTASH_REDIS_REST_TOKEN,
      });
      console.log('✅ Upstash Redis connected successfully');
      return;
    }

    // Check for traditional Redis URL
    if (process.env.REDIS_URL) {
      redis = Redis.fromEnv();
      console.log('✅ Redis connected successfully');
      return;
    }

    // No Redis configured - use memory cache only
    console.log('ℹ️ No Redis configuration found, using memory cache only');
    redis = null;
  } catch (error) {
    console.warn('⚠️ Redis initialization failed, falling back to memory cache:', error);
    redis = null;
  }
};

// Initialize Redis
initializeRedis();

interface CacheItem {
  data: unknown;
  timestamp: number;
  ttl: number;
}

class RedisPermissionCache {
  private memoryCache = new Map<string, CacheItem>();
  private defaultTTL = 60 * 60 * 1000; // 1 hour in milliseconds

  // Generate cache keys
  getUserPermissionsKey(userId: string): string {
    return `permissions:user:${userId}`;
  }

  getRolePermissionsKey(roleId: string): string {
    return `permissions:role:${roleId}`;
  }

  getSidebarDataKey(userId: string): string {
    return `sidebar:${userId}`;
  }

  // Set data in cache
  async set(key: string, data: unknown, ttlSeconds: number = 3600): Promise<void> {
    const item: CacheItem = {
      data,
      timestamp: Date.now(),
      ttl: ttlSeconds * 1000,
    };

    // Always cache in memory for immediate access
    this.memoryCache.set(key, item);

    // Also cache in Redis if available
    if (redis) {
      try {
        await redis.setex(key, ttlSeconds, JSON.stringify(data));
      } catch (error) {
        console.warn('Redis set failed:', error);
      }
    }
  }

  // Get data from cache
  async get(key: string): Promise<unknown | null> {
    // First check memory cache (fastest)
    const memoryItem = this.memoryCache.get(key);
    if (memoryItem && Date.now() - memoryItem.timestamp < memoryItem.ttl) {
      return memoryItem.data;
    }

    // Then check Redis if available
    if (redis) {
      try {
        const redisData = await redis.get(key);
        if (redisData) {
          const data = typeof redisData === 'string' ? JSON.parse(redisData) : redisData;
          
          // Update memory cache
          this.memoryCache.set(key, {
            data,
            timestamp: Date.now(),
            ttl: this.defaultTTL,
          });
          
          return data;
        }
      } catch (error) {
        console.warn('Redis get failed:', error);
      }
    }

    return null;
  }

  // Get data synchronously from memory cache only
  getSync(key: string): unknown | null {
    const item = this.memoryCache.get(key);
    if (item && Date.now() - item.timestamp < item.ttl) {
      return item.data;
    }
    return null;
  }

  // Delete from cache
  async delete(key: string): Promise<void> {
    this.memoryCache.delete(key);
    
    if (redis) {
      try {
        await redis.del(key);
      } catch (error) {
        console.warn('Redis delete failed:', error);
      }
    }
  }

  // Cache user permissions with role fallback
  async cacheUserPermissions(userId: string, roleId: string, permissions: unknown[]): Promise<void> {
    const userKey = this.getUserPermissionsKey(userId);
    const roleKey = this.getRolePermissionsKey(roleId);
    
    await Promise.all([
      this.set(userKey, permissions, 3600), // 1 hour
      this.set(roleKey, permissions, 7200), // 2 hours (longer for role-based)
    ]);
  }

  // Get user permissions with role fallback
  async getUserPermissions(userId: string, roleId: string): Promise<unknown[] | null> {
    // Try user-specific first
    let permissions = await this.get(this.getUserPermissionsKey(userId));
    
    if (!permissions && roleId) {
      // Fallback to role-based permissions
      permissions = await this.get(this.getRolePermissionsKey(roleId));
    }
    
    return Array.isArray(permissions) ? permissions : null;
  }

  // Cache sidebar data for instant loading
  async cacheSidebarData(userId: string, sidebarData: unknown): Promise<void> {
    const key = this.getSidebarDataKey(userId);
    await this.set(key, sidebarData, 1800); // 30 minutes
  }

  // Get sidebar data instantly (sync)
  getSidebarDataInstantly(userId: string): unknown | null {
    const key = this.getSidebarDataKey(userId);
    return this.getSync(key);
  }

  // Clear all cached data for a user
  async clearUserCache(userId: string): Promise<void> {
    const keys = [
      this.getUserPermissionsKey(userId),
      this.getSidebarDataKey(userId),
    ];
    
    await Promise.all(keys.map(key => this.delete(key)));
  }

  // Preload permissions in background
  async preloadUserPermissions(userId: string, roleId: string): Promise<void> {
    try {
      // This could trigger a background API call to refresh permissions
      // For now, we'll just ensure the cache is warmed
      const permissions = await this.getUserPermissions(userId, roleId);
      if (!permissions) {
        // Could trigger an API call here to refresh permissions
        console.log('Permissions not in cache, may need refresh for user:', userId);
      }
    } catch (error) {
      console.warn('Preload failed:', error);
    }
  }

  // Get cache stats
  getCacheStats(): { memorySize: number; redisAvailable: boolean } {
    return {
      memorySize: this.memoryCache.size,
      redisAvailable: redis !== null,
    };
  }

  // Clean expired items from memory cache
  cleanExpiredItems(): void {
    const now = Date.now();
    for (const [key, item] of this.memoryCache.entries()) {
      if (now - item.timestamp >= item.ttl) {
        this.memoryCache.delete(key);
      }
    }
  }
}

export const redisPermissionCache = new RedisPermissionCache();

// Clean expired items every 5 minutes
if (typeof window === 'undefined') { // Server-side only
  setInterval(() => {
    redisPermissionCache.cleanExpiredItems();
  }, 5 * 60 * 1000);
}