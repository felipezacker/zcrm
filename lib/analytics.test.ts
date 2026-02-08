import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  PERFORMANCE_BASELINES,
  getPerformanceRating,
  reportWebVitals,
  measurePerformance,
  mark,
  measure
} from './analytics';
import { logger } from './logger';
import { Metric } from 'web-vitals';

vi.mock('./logger', () => ({
  logger: {
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
  },
}));

describe('Performance Monitoring', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('PERFORMANCE_BASELINES', () => {
    it('should have baseline values for all current metrics', () => {
      expect(PERFORMANCE_BASELINES.FCP).toBe(1800);
      expect(PERFORMANCE_BASELINES.LCP).toBe(2500);
      expect(PERFORMANCE_BASELINES.CLS).toBe(0.1);
      expect(PERFORMANCE_BASELINES.TTFB).toBe(600);
      expect(PERFORMANCE_BASELINES.INP).toBe(200);
    });

    it('should not include deprecated FID metric', () => {
      expect('FID' in PERFORMANCE_BASELINES).toBe(false);
    });
  });

  describe('getPerformanceRating', () => {
    it('should rate FCP as good when <= 1800ms', () => {
      const metric = { name: 'FCP', value: 1500, rating: 'good', delta: 0, id: 'test', entries: [], navigationType: 'navigate' } as Metric;
      expect(getPerformanceRating(metric)).toBe('good');
    });

    it('should rate FCP as needs-improvement when between 1800-3000ms', () => {
      const metric = { name: 'FCP', value: 2500, rating: 'needs-improvement', delta: 0, id: 'test', entries: [], navigationType: 'navigate' } as Metric;
      expect(getPerformanceRating(metric)).toBe('needs-improvement');
    });

    it('should rate FCP as poor when > 3000ms', () => {
      const metric = { name: 'FCP', value: 3500, rating: 'poor', delta: 0, id: 'test', entries: [], navigationType: 'navigate' } as Metric;
      expect(getPerformanceRating(metric)).toBe('poor');
    });

    it('should rate LCP correctly', () => {
      const good = { name: 'LCP', value: 2000, rating: 'good', delta: 0, id: 'test', entries: [], navigationType: 'navigate' } as Metric;
      expect(getPerformanceRating(good)).toBe('good');
    });

    it('should rate CLS correctly', () => {
      const good = { name: 'CLS', value: 0.05, rating: 'good', delta: 0, id: 'test', entries: [], navigationType: 'navigate' } as Metric;
      const poor = { name: 'CLS', value: 0.5, rating: 'poor', delta: 0, id: 'test', entries: [], navigationType: 'navigate' } as Metric;

      expect(getPerformanceRating(good)).toBe('good');
      expect(getPerformanceRating(poor)).toBe('poor');
    });

    it('should rate INP correctly', () => {
      const good = { name: 'INP', value: 150, rating: 'good', delta: 0, id: 'test', entries: [], navigationType: 'navigate' } as Metric;
      const poor = { name: 'INP', value: 600, rating: 'poor', delta: 0, id: 'test', entries: [], navigationType: 'navigate' } as Metric;

      expect(getPerformanceRating(good)).toBe('good');
      expect(getPerformanceRating(poor)).toBe('poor');
    });

    it('should return poor for unknown metric names', () => {
      const unknown = { name: 'UNKNOWN', value: 100, rating: 'good', delta: 0, id: 'test', entries: [], navigationType: 'navigate' } as Metric;
      expect(getPerformanceRating(unknown)).toBe('poor');
    });
  });

  describe('reportWebVitals', () => {
    it('should log web vital metrics', () => {
      const metric = { name: 'FCP', value: 1500, rating: 'good', delta: 0, id: 'test', entries: [], navigationType: 'navigate' } as Metric;

      reportWebVitals(metric);

      expect(logger.info).toHaveBeenCalled();
    });

    it('should warn on performance degradation', () => {
      const metric = { name: 'FCP', value: 3500, rating: 'poor', delta: 0, id: 'test', entries: [], navigationType: 'navigate' } as Metric;

      reportWebVitals(metric);

      expect(logger.warn).toHaveBeenCalled();
    });
  });

  describe('measurePerformance', () => {
    it('should measure async function performance and return result', async () => {
      const asyncFn = async () => {
        await new Promise(resolve => setTimeout(resolve, 10));
        return 'result';
      };

      const result = await measurePerformance('test-operation', asyncFn);
      expect(result).toBe('result');
    });

    it('should propagate errors from measured functions', async () => {
      const errorFn = async () => {
        throw new Error('Test error');
      };

      await expect(measurePerformance('test-error', errorFn)).rejects.toThrow('Test error');
    });
  });

  describe('mark and measure', () => {
    it('should handle marks without throwing', () => {
      expect(() => mark('test-mark')).not.toThrow();
    });

    it('should handle measures without throwing', () => {
      mark('start');
      mark('end');
      expect(() => measure('test-measure', 'start', 'end')).not.toThrow();
    });
  });
});
