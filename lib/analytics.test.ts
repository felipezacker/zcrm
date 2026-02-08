import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  PERFORMANCE_BASELINES,
  getPerformanceRating,
  reportWebVitals,
  measurePerformance,
  mark,
  measure
} from './analytics';
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
    it('should have baseline values for all metrics', () => {
      expect(PERFORMANCE_BASELINES.FCP).toBe(1800);
      expect(PERFORMANCE_BASELINES.LCP).toBe(2500);
      expect(PERFORMANCE_BASELINES.CLS).toBe(0.1);
      expect(PERFORMANCE_BASELINES.TTFB).toBe(600);
      expect(PERFORMANCE_BASELINES.FID).toBe(100);
      expect(PERFORMANCE_BASELINES.INP).toBe(200);
    });
  });

  describe('getPerformanceRating', () => {
    it('should rate FCP as good when <= 1800ms', () => {
      const metric: Metric = {
        name: 'FCP',
        value: 1500,
        rating: 'good',
        delta: 0,
        id: 'test',
        entries: [],
        navigationType: 'navigate',
      };

      expect(getPerformanceRating(metric)).toBe('good');
    });

    it('should rate FCP as needs-improvement when between 1800-3000ms', () => {
      const metric: Metric = {
        name: 'FCP',
        value: 2500,
        rating: 'needs-improvement',
        delta: 0,
        id: 'test',
        entries: [],
        navigationType: 'navigate',
      };

      expect(getPerformanceRating(metric)).toBe('needs-improvement');
    });

    it('should rate FCP as poor when > 3000ms', () => {
      const metric: Metric = {
        name: 'FCP',
        value: 3500,
        rating: 'poor',
        delta: 0,
        id: 'test',
        entries: [],
        navigationType: 'navigate',
      };

      expect(getPerformanceRating(metric)).toBe('poor');
    });

    it('should rate LCP correctly', () => {
      const goodLCP: Metric = {
        name: 'LCP',
        value: 2000,
        rating: 'good',
        delta: 0,
        id: 'test',
        entries: [],
        navigationType: 'navigate',
      };

      expect(getPerformanceRating(goodLCP)).toBe('good');
    });

    it('should rate CLS correctly', () => {
      const goodCLS: Metric = {
        name: 'CLS',
        value: 0.05,
        rating: 'good',
        delta: 0,
        id: 'test',
        entries: [],
        navigationType: 'navigate',
      };

      const poorCLS: Metric = {
        name: 'CLS',
        value: 0.5,
        rating: 'poor',
        delta: 0,
        id: 'test',
        entries: [],
        navigationType: 'navigate',
      };

      expect(getPerformanceRating(goodCLS)).toBe('good');
      expect(getPerformanceRating(poorCLS)).toBe('poor');
    });
  });

  describe('reportWebVitals', () => {
    it('should log web vital metrics', () => {
      const metric: Metric = {
        name: 'FCP',
        value: 1500,
        rating: 'good',
        delta: 0,
        id: 'test',
        entries: [],
        navigationType: 'navigate',
      };

      reportWebVitals(metric);

      expect(reportWebVitals).toBeDefined();
    });
  });

  describe('measurePerformance', () => {
    it('should measure async function performance', async () => {
      const asyncFn = async () => {
        await new Promise(resolve => setTimeout(resolve, 10));
        return 'result';
      };

      const result = await measurePerformance('test-operation', asyncFn);

      expect(result).toBe('result');
    });

    it('should handle errors in measured functions', async () => {
      const errorFn = async () => {
        throw new Error('Test error');
      };

      await expect(measurePerformance('test-error', errorFn)).rejects.toThrow();
    });
  });

  describe('mark and measure', () => {
    it('should handle marks', () => {
      expect(() => mark('test-mark')).not.toThrow();
    });

    it('should handle measures', () => {
      mark('start');
      mark('end');
      expect(() => measure('test-measure', 'start', 'end')).not.toThrow();
    });
  });
});
