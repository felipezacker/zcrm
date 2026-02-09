import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  logDatabaseQuery,
  createQueryInterceptor,
  QueryPerformanceCollector,
  queryCollector,
} from './database-logger';

// Mock logger
vi.mock('../logger', () => ({
  logger: {
    error: vi.fn(),
    warn: vi.fn(),
    debug: vi.fn(),
    info: vi.fn(),
  },
}));

import { logger } from '../logger';

describe('Database Query Logger', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('logDatabaseQuery', () => {
    it('should log slow queries with warn level', () => {
      logDatabaseQuery({
        query: 'SELECT * FROM users WHERE age > 25',
        duration: 600, // > 500ms threshold
      });

      expect(logger.warn).toHaveBeenCalled();
      const call = (logger.warn as any).mock.calls[0];
      expect(call[0].isSlow).toBe(true);
      expect(call[0].duration).toBe(600);
    });

    it('should log fast queries with debug level', () => {
      logDatabaseQuery({
        query: 'SELECT * FROM users LIMIT 1',
        duration: 50, // < 500ms threshold
      });

      expect(logger.debug).toHaveBeenCalled();
      const call = (logger.debug as any).mock.calls[0];
      expect(call[0].isSlow).toBe(false);
      expect(call[0].duration).toBe(50);
    });

    it('should log errors with error level', () => {
      logDatabaseQuery({
        query: 'SELECT * FROM invalid_table',
        duration: 100,
        error: 'relation "invalid_table" does not exist',
      });

      expect(logger.error).toHaveBeenCalled();
      const call = (logger.error as any).mock.calls[0];
      expect(call[0].error).toBe('relation "invalid_table" does not exist');
    });

    it('should sanitize sensitive data in queries', () => {
      logDatabaseQuery({
        query: "SELECT * FROM users WHERE password = 'secret123'",
        duration: 100,
      });

      const call = (logger.debug as any).mock.calls[0];
      expect(call[0].query).not.toContain('secret123');
      expect(call[0].query).toContain("password='***'");
    });

    it('should include correlation ID if provided', () => {
      const correlationId = 'test-correlation-id';
      logDatabaseQuery({
        query: 'SELECT * FROM users',
        duration: 100,
        correlationId,
      });

      const call = (logger.debug as any).mock.calls[0];
      expect(call[0].correlationId).toBe(correlationId);
    });
  });

  describe('createQueryInterceptor', () => {
    it('should execute query and log successful execution', async () => {
      const interceptor = createQueryInterceptor('test-id');
      const result = await interceptor(
        async () => [{ id: 1, name: 'Test' }],
        'SELECT * FROM users'
      );

      expect(result).toEqual([{ id: 1, name: 'Test' }]);
      expect(logger.debug).toHaveBeenCalled();
    });

    it('should log query execution time', async () => {
      const interceptor = createQueryInterceptor();
      await interceptor(
        async () => {
          await new Promise((resolve) => setTimeout(resolve, 100));
          return [];
        },
        'SELECT * FROM users'
      );

      const call = (logger.debug as any).mock.calls[0];
      expect(call[0].duration).toBeGreaterThanOrEqual(100);
    });

    it('should catch and log query errors', async () => {
      const interceptor = createQueryInterceptor();
      const error = new Error('Query failed');

      await expect(
        interceptor(async () => {
          throw error;
        }, 'SELECT * FROM invalid')
      ).rejects.toThrow('Query failed');

      expect(logger.error).toHaveBeenCalled();
      const call = (logger.error as any).mock.calls[0];
      expect(call[0].error).toBe('Query failed');
    });
  });

  describe('QueryPerformanceCollector', () => {
    let collector: QueryPerformanceCollector;

    beforeEach(() => {
      collector = new QueryPerformanceCollector();
    });

    it('should track query statistics', () => {
      collector.recordQuery({ query: 'SELECT 1', duration: 100 });
      collector.recordQuery({ query: 'SELECT 2', duration: 200 });
      collector.recordQuery({ query: 'SELECT 3', duration: 300 });

      const stats = collector.getStats();
      expect(stats.totalQueries).toBe(3);
      expect(stats.avgDuration).toBe(200);
      expect(stats.maxDuration).toBe(300);
      expect(stats.minDuration).toBe(100);
    });

    it('should count slow queries', () => {
      collector.recordQuery({ query: 'SELECT 1', duration: 100 });
      collector.recordQuery({ query: 'SELECT 2', duration: 600 }); // slow
      collector.recordQuery({ query: 'SELECT 3', duration: 700 }); // slow

      const stats = collector.getStats();
      expect(stats.slowQueries).toBe(2);
    });

    it('should count failed queries', () => {
      collector.recordQuery({ query: 'SELECT 1', duration: 100 });
      collector.recordQuery({
        query: 'SELECT 2',
        duration: 100,
        error: 'Query failed',
      });

      const stats = collector.getStats();
      expect(stats.failedQueries).toBe(1);
    });

    it('should reset statistics', () => {
      collector.recordQuery({ query: 'SELECT 1', duration: 100 });
      collector.reset();

      const stats = collector.getStats();
      expect(stats.totalQueries).toBe(0);
      expect(stats.slowQueries).toBe(0);
      expect(stats.failedQueries).toBe(0);
    });

    it('should log statistics', () => {
      collector.recordQuery({ query: 'SELECT 1', duration: 100 });
      collector.logStats('test-correlation-id');

      expect(logger.info).toHaveBeenCalled();
      const call = (logger.info as any).mock.calls[0];
      expect(call[0].correlationId).toBe('test-correlation-id');
      expect(call[1]).toContain('Database performance statistics');
    });
  });
});
