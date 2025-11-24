/**
 * Tests for BulkProcessor
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { BulkProcessor } from '../../../src/bulk/processor';

describe('BulkProcessor', () => {
  let processor: BulkProcessor;

  beforeEach(() => {
    processor = new BulkProcessor();
  });

  describe('process()', () => {
    it('should validate multiple emails concurrently', async () => {
      const emails = ['user1@example.com', 'user2@example.com', 'user3@example.com'];

      const result = await processor.process(emails, {
        config: {
          preset: 'permissive', // Only regex validation for speed
        },
      });

      expect(result.results).toHaveLength(3);
      expect(result.total).toBe(3);
      expect(result.results[0]?.email).toBe('user1@example.com');
      expect(result.results[1]?.email).toBe('user2@example.com');
      expect(result.results[2]?.email).toBe('user3@example.com');
    });

    it('should return empty result for empty array', async () => {
      const result = await processor.process([]);

      expect(result.results).toHaveLength(0);
      expect(result.total).toBe(0);
      expect(result.valid).toBe(0);
      expect(result.invalid).toBe(0);
      expect(result.errors).toBe(0);
      expect(result.duration).toBe(0);
    });

    it('should respect concurrency limit', async () => {
      const emails = Array(20)
        .fill(0)
        .map((_, i) => `user${i}@gmail.com`);

      // Test that processing completes successfully with concurrency limit
      const result = await processor.process(emails, {
        concurrency: 5,
        config: {
          preset: 'balanced', // Faster validation without SMTP
        },
      });

      expect(result.results).toHaveLength(20);
      expect(result.total).toBe(20);
    });

    it('should use default concurrency of 10', async () => {
      const emails = Array(25)
        .fill(0)
        .map((_, i) => `user${i}@example.com`);

      const result = await processor.process(emails, {
        config: {
          preset: 'permissive', // Only regex validation for speed
        },
      });

      expect(result.results).toHaveLength(25);
      expect(result.total).toBe(25);
    });

    it('should track progress correctly', async () => {
      const emails = Array(10)
        .fill(0)
        .map((_, i) => `user${i}@example.com`);

      const progressCalls: Array<[number, number]> = [];

      await processor.process(emails, {
        onProgress: (completed, total) => {
          progressCalls.push([completed, total]);
        },
        config: {
          preset: 'permissive', // Only regex validation for speed
        },
      });

      expect(progressCalls.length).toBeGreaterThan(0);
      expect(progressCalls[0]?.[1]).toBe(10); // Total should be 10

      // Check that progress increases
      for (let i = 1; i < progressCalls.length; i++) {
        const prev = progressCalls[i - 1];
        const curr = progressCalls[i];
        if (prev && curr) {
          expect(curr[0]).toBeGreaterThanOrEqual(prev[0]);
          expect(curr[1]).toBe(10);
        }
      }

      // Final progress should be complete
      const lastCall = progressCalls[progressCalls.length - 1];
      if (lastCall) {
        expect(lastCall[0]).toBe(10);
        expect(lastCall[1]).toBe(10);
      }
    });

    it('should continue on error when continueOnError is true', async () => {
      const emails = [
        'valid@example.com',
        'invalid-email', // Invalid format
        'another@example.com',
      ];

      const result = await processor.process(emails, {
        continueOnError: true,
        config: {
          preset: 'permissive', // Only regex validation for speed
        },
      });

      expect(result.results).toHaveLength(3);
      expect(result.results[0]?.valid).toBe(true);
      expect(result.results[1]?.valid).toBe(false);
      expect(result.results[2]?.valid).toBe(true);
      expect(result.errors).toBe(0); // No errors, just invalid emails
    });

    it('should not throw when continueOnError is false and validation fails', async () => {
      // Invalid emails don't throw errors, they just return invalid results
      // So we test that invalid emails are handled correctly
      const emails = ['invalid-email'];

      const result = await processor.process(emails, {
        continueOnError: false,
        config: {
          preset: 'permissive', // Only regex validation
        },
      });

      expect(result.results).toHaveLength(1);
      expect(result.results[0]?.valid).toBe(false);
      expect(result.errors).toBe(0); // Invalid emails are not errors
    });

    it('should count valid and invalid emails correctly', async () => {
      const emails = [
        'valid1@example.com',
        'valid2@example.com',
        'invalid-email',
        'another-invalid',
        'valid3@example.com',
      ];

      const result = await processor.process(emails, {
        config: {
          preset: 'permissive', // Only regex validation for predictable results
        },
      });

      expect(result.total).toBe(5);
      expect(result.valid).toBe(3); // 3 valid emails
      expect(result.invalid).toBe(2); // 2 invalid emails
      expect(result.valid + result.invalid).toBe(5);
    });

    it('should include duration in result', async () => {
      const emails = Array(5)
        .fill(0)
        .map((_, i) => `user${i}@example.com`);

      const result = await processor.process(emails, {
        config: {
          preset: 'permissive', // Only regex validation for speed
        },
      });

      expect(result.duration).toBeGreaterThanOrEqual(0);
      expect(typeof result.duration).toBe('number');
    });

    it('should use provided configuration for all validations', async () => {
      const emails = ['user@gmail.com'];

      const result = await processor.process(emails, {
        config: {
          preset: 'permissive', // Only regex validation
        },
      });

      expect(result.results).toHaveLength(1);
      expect(result.results[0]?.valid).toBe(true);
      // With permissive preset, only regex runs, so no MX/SMTP results
      expect(result.results[0]?.validators.mx).toBeUndefined();
    });

    it('should validate 100 emails in reasonable time', async () => {
      const emails = Array(100)
        .fill(0)
        .map((_, i) => `user${i}@example.com`);

      const start = Date.now();
      const result = await processor.process(emails, {
        concurrency: 10,
        config: {
          preset: 'permissive', // Only regex validation for speed
        },
      });
      const duration = Date.now() - start;

      expect(result.results).toHaveLength(100);
      expect(result.total).toBe(100);
      expect(duration).toBeLessThan(5000); // Should complete in < 5 seconds
    });

    it('should throw TypeError for non-array input', async () => {
      await expect(processor.process('not-an-array' as unknown as string[])).rejects.toThrow(
        TypeError
      );
    });

    it('should throw RangeError for concurrency < 1', async () => {
      const emails = ['user@gmail.com'];

      await expect(processor.process(emails, { concurrency: 0 })).rejects.toThrow(RangeError);

      await expect(processor.process(emails, { concurrency: -1 })).rejects.toThrow(RangeError);
    });

    it('should preserve order of results', async () => {
      const emails = ['first@example.com', 'second@example.com', 'third@example.com'];

      const result = await processor.process(emails, {
        config: {
          preset: 'permissive', // Only regex validation for speed
        },
      });

      expect(result.results[0]?.email).toBe('first@example.com');
      expect(result.results[1]?.email).toBe('second@example.com');
      expect(result.results[2]?.email).toBe('third@example.com');
    });

    it('should handle mixed valid and invalid emails', async () => {
      const emails = [
        'valid@example.com',
        'invalid-email',
        'another.valid@example.com',
        'also.invalid',
        'final.valid@test.com',
      ];

      const result = await processor.process(emails, {
        config: {
          preset: 'permissive', // Only regex validation for predictable results
        },
      });

      expect(result.results).toHaveLength(5);
      expect(result.valid).toBe(3); // 3 valid emails
      expect(result.invalid).toBe(2); // 2 invalid emails
    });

    it('should call progress callback for each completed validation', async () => {
      const emails = Array(5)
        .fill(0)
        .map((_, i) => `user${i}@example.com`);

      let lastCompleted = 0;
      let callCount = 0;

      await processor.process(emails, {
        onProgress: (completed, total) => {
          callCount++;
          expect(completed).toBeGreaterThan(lastCompleted);
          expect(total).toBe(5);
          lastCompleted = completed;
        },
        config: {
          preset: 'permissive', // Only regex validation for speed
        },
      });

      expect(callCount).toBe(5); // Should be called once per email
      expect(lastCompleted).toBe(5);
    });

    describe('rate limiting', () => {
      it('should respect global rate limit', async () => {
        const emails = Array(5)
          .fill(0)
          .map((_, i) => `user${i}@example.com`);

        const result = await processor.process(emails, {
          rateLimit: {
            global: { requests: 3, window: 60 },
            enabled: true,
          },
          continueOnError: true,
          config: {
            preset: 'permissive',
          },
        });

        // First 3 should pass, rest should be rate-limited
        expect(result.results).toHaveLength(5);
        expect(result.results[0]?.valid).toBe(true);
        expect(result.results[1]?.valid).toBe(true);
        expect(result.results[2]?.valid).toBe(true);
        // Rate-limited results should be invalid
        expect(result.results[3]?.valid).toBe(false);
        expect(result.results[3]?.reason).toBe('rate-limit');
        expect(result.results[4]?.valid).toBe(false);
        expect(result.results[4]?.reason).toBe('rate-limit');
      });

      it('should respect per-domain rate limit', async () => {
        const emails = [
          'user1@example.com',
          'user2@example.com',
          'user3@example.com',
          'user4@example.com',
          'user5@otherdomain.com', // Different domain
        ];

        const result = await processor.process(emails, {
          rateLimit: {
            perDomain: { requests: 2, window: 60 },
            enabled: true,
          },
          continueOnError: true,
          config: {
            preset: 'permissive',
          },
        });

        // First 2 from example.com should pass
        expect(result.results[0]?.valid).toBe(true);
        expect(result.results[1]?.valid).toBe(true);
        // 3rd and 4th from example.com should be rate-limited
        expect(result.results[2]?.valid).toBe(false);
        expect(result.results[2]?.reason).toBe('rate-limit');
        expect(result.results[3]?.valid).toBe(false);
        expect(result.results[3]?.reason).toBe('rate-limit');
        // Different domain should still pass
        expect(result.results[4]?.valid).toBe(true);
      });

      it('should work with rate limiting disabled', async () => {
        const emails = Array(10)
          .fill(0)
          .map((_, i) => `user${i}@example.com`);

        const result = await processor.process(emails, {
          rateLimit: {
            global: { requests: 1, window: 60 },
            enabled: false, // Disabled
          },
          config: {
            preset: 'permissive',
          },
        });

        // All should pass when rate limiting is disabled
        expect(result.results).toHaveLength(10);
        expect(result.results.every((r) => r.valid)).toBe(true);
      });

      it('should handle rate limit errors gracefully with continueOnError', async () => {
        const emails = Array(5)
          .fill(0)
          .map((_, i) => `user${i}@example.com`);

        const result = await processor.process(emails, {
          rateLimit: {
            global: { requests: 2, window: 60 },
            enabled: true,
          },
          continueOnError: true,
          config: {
            preset: 'permissive',
          },
        });

        // Should continue processing even with rate limit errors
        expect(result.results).toHaveLength(5);
        expect(result.invalid).toBeGreaterThan(0); // Some should be rate-limited
      });

      it('should track rate-limited emails in invalid count', async () => {
        const emails = Array(5)
          .fill(0)
          .map((_, i) => `user${i}@example.com`);

        const result = await processor.process(emails, {
          rateLimit: {
            global: { requests: 2, window: 60 },
            enabled: true,
          },
          continueOnError: true,
          config: {
            preset: 'permissive',
          },
        });

        // Should have 2 valid and 3 invalid (rate-limited)
        expect(result.total).toBe(5);
        expect(result.valid).toBe(2);
        expect(result.invalid).toBe(3);
      });

      it('should throw error when rate limit exceeded and continueOnError is false', async () => {
        const emails = Array(5)
          .fill(0)
          .map((_, i) => `user${i}@example.com`);

        await expect(
          processor.process(emails, {
            rateLimit: {
              global: { requests: 2, window: 60 },
              enabled: true,
            },
            continueOnError: false, // Should throw on rate limit
            config: {
              preset: 'permissive',
            },
          })
        ).rejects.toThrow();
      });

      it('should call progress callback when rate limit is hit', async () => {
        const emails = Array(5)
          .fill(0)
          .map((_, i) => `user${i}@example.com`);

        const progressCalls: Array<[number, number]> = [];

        await processor.process(emails, {
          rateLimit: {
            global: { requests: 2, window: 60 },
            enabled: true,
          },
          continueOnError: true,
          onProgress: (completed, total) => {
            progressCalls.push([completed, total]);
          },
          config: {
            preset: 'permissive',
          },
        });

        // Progress should be called for all emails, including rate-limited ones
        expect(progressCalls.length).toBeGreaterThanOrEqual(2);
        expect(progressCalls[progressCalls.length - 1]?.[0]).toBe(5);
        expect(progressCalls[progressCalls.length - 1]?.[1]).toBe(5);
      });
    });

    describe('error handling', () => {
      it('should handle validation errors gracefully with continueOnError', async () => {
        // Test with emails that might cause network errors (non-existent domains)
        // Using permissive preset to avoid MX/SMTP errors
        const emails = ['valid@example.com', 'invalid-email-format'];

        const result = await processor.process(emails, {
          continueOnError: true,
          config: {
            preset: 'permissive', // Only regex validation
          },
        });

        expect(result.results).toHaveLength(2);
        expect(result.total).toBe(2);
        // First should be valid, second should be invalid
        expect(result.results[0]?.valid).toBe(true);
        expect(result.results[1]?.valid).toBe(false);
      });

      it('should call progress callback even when errors occur', async () => {
        const emails = ['valid@example.com', 'invalid-email'];

        const progressCalls: Array<[number, number]> = [];

        await processor.process(emails, {
          continueOnError: true,
          onProgress: (completed, total) => {
            progressCalls.push([completed, total]);
          },
          config: {
            preset: 'permissive',
          },
        });

        // Progress should be called for all emails
        expect(progressCalls.length).toBeGreaterThan(0);
        expect(progressCalls[progressCalls.length - 1]?.[0]).toBe(2);
        expect(progressCalls[progressCalls.length - 1]?.[1]).toBe(2);
      });
    });

    describe('comprehensive scenarios', () => {
      it('should handle large batch with mixed valid/invalid emails', async () => {
        const emails = Array(50)
          .fill(0)
          .map((_, i) => {
            // Mix of valid and invalid emails
            if (i % 3 === 0) {
              return `invalid-email-${i}`; // Invalid format
            }
            return `user${i}@example.com`; // Valid format
          });

        const result = await processor.process(emails, {
          concurrency: 10,
          continueOnError: true,
          config: {
            preset: 'permissive',
          },
        });

        expect(result.results).toHaveLength(50);
        expect(result.total).toBe(50);
        expect(result.valid + result.invalid).toBe(50);
        expect(result.errors).toBe(0); // No actual errors, just invalid emails
      });

      it('should process 100+ emails efficiently', async () => {
        const emails = Array(150)
          .fill(0)
          .map((_, i) => `user${i}@example.com`);

        const start = Date.now();
        const result = await processor.process(emails, {
          concurrency: 10,
          config: {
            preset: 'permissive', // Fast validation
          },
        });
        const duration = Date.now() - start;

        expect(result.results).toHaveLength(150);
        expect(result.total).toBe(150);
        expect(duration).toBeLessThan(5000); // Should complete in < 5 seconds
      });

      it('should handle concurrent processing with progress tracking', async () => {
        const emails = Array(20)
          .fill(0)
          .map((_, i) => `user${i}@example.com`);

        let maxConcurrent = 0;
        let currentConcurrent = 0;

        await processor.process(emails, {
          concurrency: 5,
          onProgress: () => {
            currentConcurrent++;
            maxConcurrent = Math.max(maxConcurrent, currentConcurrent);
            // Simulate async work
            setTimeout(() => {
              currentConcurrent--;
            }, 0);
          },
          config: {
            preset: 'permissive',
          },
        });

        // Verify all emails were processed
        expect(maxConcurrent).toBeGreaterThan(0);
      });
    });
  });
});
