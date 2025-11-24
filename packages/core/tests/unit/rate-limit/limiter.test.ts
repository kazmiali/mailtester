/**
 * Tests for Rate Limiter
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { RateLimiter } from '../../../src/rate-limit/limiter';
import { ErrorCode } from '../../../src/types';

describe('RateLimiter', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('constructor', () => {
    it('should create rate limiter with default enabled state', () => {
      const limiter = new RateLimiter();
      expect(limiter.getStats().enabled).toBe(true);
    });

    it('should create rate limiter with disabled state', () => {
      const limiter = new RateLimiter({ enabled: false });
      expect(limiter.getStats().enabled).toBe(false);
    });

    it('should create rate limiter with global rate limit', () => {
      const limiter = new RateLimiter({
        global: { requests: 10, window: 60 },
      });
      const stats = limiter.getStats();
      expect(stats.globalBucket).toBeDefined();
      expect(stats.globalBucket?.capacity).toBe(10);
    });

    it('should create rate limiter with per-domain rate limit', () => {
      const limiter = new RateLimiter({
        perDomain: { requests: 5, window: 60 },
      });
      const stats = limiter.getStats();
      expect(stats.domainBuckets).toBe(0); // No domains checked yet
    });

    it('should create rate limiter with both global and per-domain limits', () => {
      const limiter = new RateLimiter({
        global: { requests: 100, window: 60 },
        perDomain: { requests: 10, window: 60 },
      });
      const stats = limiter.getStats();
      expect(stats.globalBucket).toBeDefined();
      expect(stats.domainBuckets).toBe(0);
    });
  });

  describe('check()', () => {
    it('should allow requests when rate limiting is disabled', async () => {
      const limiter = new RateLimiter({ enabled: false });
      const result = await limiter.check('user@example.com');
      expect(result.allowed).toBe(true);
      expect(result.waitTime).toBeUndefined();
    });

    it('should allow requests when no rate limits are configured', async () => {
      const limiter = new RateLimiter({ enabled: true });
      const result = await limiter.check('user@example.com');
      expect(result.allowed).toBe(true);
    });

    it('should allow requests within global rate limit', async () => {
      const limiter = new RateLimiter({
        global: { requests: 10, window: 60 },
      });

      // Make 10 requests (should all pass)
      for (let i = 0; i < 10; i++) {
        const result = await limiter.check(`user${i}@example.com`);
        expect(result.allowed).toBe(true);
      }
    });

    it('should reject requests exceeding global rate limit', async () => {
      const limiter = new RateLimiter({
        global: { requests: 5, window: 60 },
      });

      // Make 5 requests (should all pass)
      for (let i = 0; i < 5; i++) {
        const result = await limiter.check(`user${i}@example.com`);
        expect(result.allowed).toBe(true);
      }

      // 6th request should be rejected
      const result = await limiter.check('user6@example.com');
      expect(result.allowed).toBe(false);
      expect(result.waitTime).toBeGreaterThan(0);
      expect(result.error?.code).toBe(ErrorCode.RATE_LIMIT_EXCEEDED);
    });

    it('should allow requests within per-domain rate limit', async () => {
      const limiter = new RateLimiter({
        perDomain: { requests: 5, window: 60 },
      });

      // Make 5 requests to same domain (should all pass)
      for (let i = 0; i < 5; i++) {
        const result = await limiter.check(`user${i}@example.com`);
        expect(result.allowed).toBe(true);
      }
    });

    it('should reject requests exceeding per-domain rate limit', async () => {
      const limiter = new RateLimiter({
        perDomain: { requests: 3, window: 60 },
      });

      // Make 3 requests to same domain (should all pass)
      for (let i = 0; i < 3; i++) {
        const result = await limiter.check(`user${i}@example.com`);
        expect(result.allowed).toBe(true);
      }

      // 4th request to same domain should be rejected
      const result = await limiter.check('user4@example.com');
      expect(result.allowed).toBe(false);
      expect(result.waitTime).toBeGreaterThan(0);
      expect(result.error?.code).toBe(ErrorCode.RATE_LIMIT_EXCEEDED);
    });

    it('should track rate limits per domain independently', async () => {
      const limiter = new RateLimiter({
        perDomain: { requests: 3, window: 60 },
      });

      // Make 3 requests to domain1.com (should all pass)
      for (let i = 0; i < 3; i++) {
        const result = await limiter.check(`user${i}@domain1.com`);
        expect(result.allowed).toBe(true);
      }

      // 4th request to domain1.com should be rejected
      const result1 = await limiter.check('user4@domain1.com');
      expect(result1.allowed).toBe(false);

      // But requests to domain2.com should still be allowed
      const result2 = await limiter.check('user1@domain2.com');
      expect(result2.allowed).toBe(true);
    });

    it('should check global limit before per-domain limit', async () => {
      const limiter = new RateLimiter({
        global: { requests: 2, window: 60 },
        perDomain: { requests: 10, window: 60 },
      });

      // Make 2 requests (should all pass)
      await limiter.check('user1@example.com');
      await limiter.check('user2@example.com');

      // 3rd request should be rejected by global limit
      const result = await limiter.check('user3@example.com');
      expect(result.allowed).toBe(false);
      expect(result.error?.details).toMatchObject({ type: 'global' });
    });

    it('should refill tokens over time', async () => {
      const limiter = new RateLimiter({
        global: { requests: 2, window: 1 }, // 2 requests per second
      });

      // Make 2 requests (should all pass)
      await limiter.check('user1@example.com');
      await limiter.check('user2@example.com');

      // 3rd request should be rejected
      let result = await limiter.check('user3@example.com');
      expect(result.allowed).toBe(false);

      // Advance time by 1 second (full refill)
      vi.advanceTimersByTime(1000);

      // Now request should be allowed
      result = await limiter.check('user3@example.com');
      expect(result.allowed).toBe(true);
    });

    it('should handle invalid email format gracefully', async () => {
      const limiter = new RateLimiter({
        global: { requests: 1, window: 60 },
      });

      // Invalid email should be allowed (will be caught by regex validator)
      const result = await limiter.check('invalid-email');
      expect(result.allowed).toBe(true);
    });

    it('should extract domain correctly (case-insensitive)', async () => {
      const limiter = new RateLimiter({
        perDomain: { requests: 1, window: 60 },
      });

      // First request should pass
      await limiter.check('user@EXAMPLE.COM');

      // Second request with different case should be rejected (same domain)
      const result = await limiter.check('user2@example.com');
      expect(result.allowed).toBe(false);
    });

    it('should calculate wait time correctly', async () => {
      const limiter = new RateLimiter({
        global: { requests: 1, window: 10 }, // 1 request per 10 seconds
      });

      // First request should pass
      await limiter.check('user1@example.com');

      // Second request should be rejected with wait time
      const result = await limiter.check('user2@example.com');
      expect(result.allowed).toBe(false);
      expect(result.waitTime).toBeGreaterThan(0);
      expect(result.waitTime).toBeLessThanOrEqual(10);
    });
  });

  describe('reset()', () => {
    it('should reset global bucket', async () => {
      const limiter = new RateLimiter({
        global: { requests: 2, window: 60 },
      });

      // Exhaust global limit
      await limiter.check('user1@example.com');
      await limiter.check('user2@example.com');

      // Verify limit is exhausted
      let result = await limiter.check('user3@example.com');
      expect(result.allowed).toBe(false);

      // Reset
      limiter.reset();

      // Now requests should be allowed again
      result = await limiter.check('user3@example.com');
      expect(result.allowed).toBe(true);
    });

    it('should reset per-domain buckets', async () => {
      const limiter = new RateLimiter({
        perDomain: { requests: 2, window: 60 },
      });

      // Exhaust per-domain limit
      await limiter.check('user1@example.com');
      await limiter.check('user2@example.com');

      // Verify limit is exhausted
      let result = await limiter.check('user3@example.com');
      expect(result.allowed).toBe(false);

      // Reset
      limiter.reset();

      // Now requests should be allowed again
      result = await limiter.check('user3@example.com');
      expect(result.allowed).toBe(true);
    });
  });

  describe('getStats()', () => {
    it('should return correct statistics', () => {
      const limiter = new RateLimiter({
        global: { requests: 10, window: 60 },
        perDomain: { requests: 5, window: 60 },
        enabled: true,
      });

      const stats = limiter.getStats();
      expect(stats.enabled).toBe(true);
      expect(stats.globalBucket).toBeDefined();
      expect(stats.globalBucket?.capacity).toBe(10);
      expect(stats.domainBuckets).toBe(0);
    });

    it('should track domain buckets after checking', async () => {
      const limiter = new RateLimiter({
        perDomain: { requests: 5, window: 60 },
      });

      expect(limiter.getStats().domainBuckets).toBe(0);

      await limiter.check('user@example.com');
      expect(limiter.getStats().domainBuckets).toBe(1);

      await limiter.check('user@domain2.com');
      expect(limiter.getStats().domainBuckets).toBe(2);
    });

    it('should show correct token count after consumption', async () => {
      const limiter = new RateLimiter({
        global: { requests: 10, window: 60 },
      });

      const statsBefore = limiter.getStats();
      expect(statsBefore.globalBucket?.tokens).toBe(10);

      await limiter.check('user@example.com');

      const statsAfter = limiter.getStats();
      expect(statsAfter.globalBucket?.tokens).toBe(9);
    });
  });

  describe('edge cases', () => {
    it('should handle empty email string', async () => {
      const limiter = new RateLimiter({
        global: { requests: 1, window: 60 },
      });

      const result = await limiter.check('');
      expect(result.allowed).toBe(true); // Invalid email allowed (caught by regex)
    });

    it('should handle email without @ symbol', async () => {
      const limiter = new RateLimiter({
        global: { requests: 1, window: 60 },
      });

      const result = await limiter.check('invalid-email');
      expect(result.allowed).toBe(true); // Invalid email allowed (caught by regex)
    });

    it('should handle email with multiple @ symbols', async () => {
      const limiter = new RateLimiter({
        global: { requests: 1, window: 60 },
      });

      const result = await limiter.check('user@@example.com');
      expect(result.allowed).toBe(true); // Invalid email allowed (caught by regex)
    });

    it('should handle very high rate limits', async () => {
      const limiter = new RateLimiter({
        global: { requests: 10000, window: 60 },
      });

      // Should handle high limits without issues
      for (let i = 0; i < 100; i++) {
        const result = await limiter.check(`user${i}@example.com`);
        expect(result.allowed).toBe(true);
      }
    });

    it('should handle very small time windows', async () => {
      const limiter = new RateLimiter({
        global: { requests: 1, window: 1 }, // 1 request per second
      });

      await limiter.check('user1@example.com');

      // Should be rejected immediately
      const result = await limiter.check('user2@example.com');
      expect(result.allowed).toBe(false);

      // Advance time by 1 second
      vi.advanceTimersByTime(1000);

      // Should be allowed now
      const result2 = await limiter.check('user2@example.com');
      expect(result2.allowed).toBe(true);
    });
  });
});
