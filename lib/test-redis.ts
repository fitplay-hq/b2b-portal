import { redisPermissionCache } from '@/lib/redis-cache';

// Test Redis connection
export async function testRedisConnection() {
  try {
    console.log('Testing Redis connection...');
    
    // Test basic operations
    await redisPermissionCache.set('test-key', { message: 'Hello Redis!' }, 10);
    const result = await redisPermissionCache.get('test-key');
    
    console.log('✅ Redis test successful:', result);
    console.log('Cache stats:', redisPermissionCache.getCacheStats());
    
    // Clean up
    await redisPermissionCache.delete('test-key');
    
    return true;
  } catch (error) {
    console.error('❌ Redis test failed:', error);
    return false;
  }
}

// Call this in your app to test
if (typeof window === 'undefined') {
  testRedisConnection();
}