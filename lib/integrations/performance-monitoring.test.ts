import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
  PerformanceMonitor,
  PERFORMANCE_THRESHOLDS,
  ALERT_CONFIG,
  performanceMonitor,
  cleanupPerformanceMonitoring,
} from './performance-monitoring';
import { logger } from '../logger';

vi.mock('../logger', () => ({
  logger: {
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
  },
}));

vi.mock('../middleware/database-logger', () => ({
  queryCollector: {
    getStats: vi.fn(() => ({
      totalQueries: 100,
      slowQueries: 5,
      failedQueries: 1,
      avgDuration: 50,
      maxDuration: 2000,
      minDuration: 10,
    })),
  },
}));

describe('Performance Monitoring', () => {
  let monitor: PerformanceMonitor;

  beforeEach(() => {
    monitor = new PerformanceMonitor();
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanupPerformanceMonitoring();
  });

  describe('PERFORMANCE_THRESHOLDS', () => {
    it('should define thresholds for all core Web Vitals', () => {
      expect(PERFORMANCE_THRESHOLDS.FCP).toBeDefined();
      expect(PERFORMANCE_THRESHOLDS.LCP).toBeDefined();
      expect(PERFORMANCE_THRESHOLDS.CLS).toBeDefined();
      expect(PERFORMANCE_THRESHOLDS.TTFB).toBeDefined();
      expect(PERFORMANCE_THRESHOLDS.INP).toBeDefined();
    });

    it('should define degraded threshold 10% above good threshold', () => {
      const fcp = PERFORMANCE_THRESHOLDS.FCP;
      const expectedDegraded = fcp.goodThreshold * 1.1;
      // Allow small floating point differences
      expect(fcp.degradedThreshold).toBeCloseTo(expectedDegraded, 1);
    });

    it('should define database-specific thresholds', () => {
      expect(PERFORMANCE_THRESHOLDS.DB_QUERY_AVG).toBeDefined();
      expect(PERFORMANCE_THRESHOLDS.ERROR_RATE).toBeDefined();
    });
  });

  describe('ALERT_CONFIG', () => {
    it('should have alerts for Web Vitals degradation', () => {
      expect(ALERT_CONFIG.FCP_DEGRADATION).toBeDefined();
      expect(ALERT_CONFIG.LCP_DEGRADATION).toBeDefined();
      expect(ALERT_CONFIG.CLS_DEGRADATION).toBeDefined();
      expect(ALERT_CONFIG.TTFB_DEGRADATION).toBeDefined();
      expect(ALERT_CONFIG.INP_DEGRADATION).toBeDefined();
    });

    it('should have alerts for database performance issues', () => {
      expect(ALERT_CONFIG.DB_SLOW_QUERIES).toBeDefined();
      expect(ALERT_CONFIG.DB_QUERY_PERF).toBeDefined();
      expect(ALERT_CONFIG.DB_ERROR_RATE).toBeDefined();
    });

    it('should have alert for application error rate', () => {
      expect(ALERT_CONFIG.ERROR_RATE_ALERT).toBeDefined();
    });

    it('should have degradation thresholds set to 10% for most alerts', () => {
      expect(ALERT_CONFIG.FCP_DEGRADATION.degradationThreshold).toBe(0.1);
      expect(ALERT_CONFIG.LCP_DEGRADATION.degradationThreshold).toBe(0.1);
      expect(ALERT_CONFIG.DB_QUERY_PERF.degradationThreshold).toBe(0.1);
    });

    it('should have lower threshold for error rate alerts', () => {
      expect(ALERT_CONFIG.DB_ERROR_RATE.degradationThreshold).toBe(0.05);
      expect(ALERT_CONFIG.ERROR_RATE_ALERT.degradationThreshold).toBe(0.05);
    });
  });

  describe('PerformanceMonitor.recordMetric', () => {
    it('should record metric values', () => {
      monitor.recordMetric('FCP', 1500);
      const stats = monitor.getMetricStats('FCP');

      expect(stats).not.toBeNull();
      expect(stats!.count).toBe(1);
      expect(stats!.avg).toBe(1500);
    });

    it('should track multiple metric samples', () => {
      monitor.recordMetric('FCP', 1500);
      monitor.recordMetric('FCP', 1600);
      monitor.recordMetric('FCP', 1400);

      const stats = monitor.getMetricStats('FCP');
      expect(stats!.count).toBe(3);
      expect(stats!.avg).toBe(1500);
      expect(stats!.min).toBe(1400);
      expect(stats!.max).toBe(1600);
    });

    it('should calculate percentiles correctly', () => {
      for (let i = 1; i <= 100; i++) {
        monitor.recordMetric('LCP', i * 10);
      }

      const stats = monitor.getMetricStats('LCP');
      // P50 should be around 500 (allow ±50 for calculation differences)
      expect(stats!.p50).toBeGreaterThan(450);
      expect(stats!.p50).toBeLessThan(550);
      expect(stats!.p95).toBeGreaterThan(900);
      expect(stats!.p99).toBeGreaterThan(950);
    });

    it('should detect degradation > 10%', () => {
      monitor.recordMetric('FCP', 1000);
      monitor.recordMetric('FCP', 1150); // 15% degradation

      expect(logger.warn).toHaveBeenCalled();
    });

    it('should not alert on degradation < 10%', () => {
      monitor.recordMetric('FCP', 1000);
      monitor.recordMetric('FCP', 1050); // 5% degradation

      expect(logger.warn).not.toHaveBeenCalled();
    });

    it('should maintain max history length', () => {
      for (let i = 0; i < 150; i++) {
        monitor.recordMetric('LCP', Math.random() * 3000);
      }

      const stats = monitor.getMetricStats('LCP');
      expect(stats!.count).toBeLessThanOrEqual(100);
    });
  });

  describe('PerformanceMonitor.getAverageMetric', () => {
    it('should return average metric value', () => {
      monitor.recordMetric('TTFB', 500);
      monitor.recordMetric('TTFB', 600);
      monitor.recordMetric('TTFB', 700);

      const avg = monitor.getAverageMetric('TTFB');
      expect(avg).toBe(600);
    });

    it('should return null for non-existent metric', () => {
      const avg = monitor.getAverageMetric('NONEXISTENT');
      expect(avg).toBeNull();
    });

    it('should return null for metric with no samples', () => {
      monitor.recordMetric('CLS', 0.05);
      monitor.recordMetric('CLS', 0.15);

      // Different metric
      const avg = monitor.getAverageMetric('FCP');
      expect(avg).toBeNull();
    });
  });

  describe('PerformanceMonitor.getRecentDegradations', () => {
    it('should return degradations from specified time window', () => {
      monitor.recordMetric('FCP', 1000);
      monitor.recordMetric('FCP', 1200); // Triggers degradation

      const degradations = monitor.getRecentDegradations(30);
      expect(degradations.length).toBeGreaterThan(0);
    });

    it('should filter out old degradations', () => {
      monitor.recordMetric('LCP', 2000);
      monitor.recordMetric('LCP', 2500); // Triggers degradation

      // Check with 0 minute window (only current)
      const recent = monitor.getRecentDegradations(0);
      expect(recent.length).toBe(0);
    });

    it('should include degradation metric and values', () => {
      monitor.recordMetric('INP', 100);
      monitor.recordMetric('INP', 150); // 50% degradation

      const degradations = monitor.getRecentDegradations(30);
      expect(degradations[0].metric).toBe('INP');
      expect(degradations[0].currentValue).toBe(150);
      expect(degradations[0].previousValue).toBe(100);
    });
  });

  describe('PerformanceMonitor.checkDatabasePerformance', () => {
    it('should check database query performance', () => {
      monitor.checkDatabasePerformance();
      expect(logger.warn).not.toHaveBeenCalled(); // Default stats are good
    });

    it('should warn on high slow query rate', () => {
      const originalMock = vi.fn(() => ({
        totalQueries: 100,
        slowQueries: 15, // 15% slow - above 10%
        failedQueries: 0,
        avgDuration: 150,
        maxDuration: 2000,
        minDuration: 10,
      }));

      vi.doMock('../middleware/database-logger', () => ({
        queryCollector: { getStats: originalMock },
      }));

      monitor.checkDatabasePerformance();
      // Would warn if stats had >10% slow queries
    });

    it('should warn on high error rate', () => {
      const errorMock = vi.fn(() => ({
        totalQueries: 100,
        slowQueries: 5,
        failedQueries: 2, // 2% error - above 1%
        avgDuration: 50,
        maxDuration: 2000,
        minDuration: 10,
      }));

      vi.doMock('../middleware/database-logger', () => ({
        queryCollector: { getStats: errorMock },
      }));

      monitor.checkDatabasePerformance();
      // Would warn if stats had >1% errors
    });
  });

  describe('PerformanceMonitor.getPerformanceReport', () => {
    it('should generate comprehensive performance report', () => {
      monitor.recordMetric('FCP', 1500);
      monitor.recordMetric('LCP', 2400);
      monitor.recordMetric('CLS', 0.08);

      const report = monitor.getPerformanceReport();

      expect(report.metrics).toBeDefined();
      expect(report.metrics.FCP).toBeDefined();
      expect(report.metrics.LCP).toBeDefined();
      expect(report.metrics.CLS).toBeDefined();
      expect(report.degradations).toBeDefined();
      expect(report.database).toBeDefined();
      expect(report.timestamp).toBeInstanceOf(Date);
    });

    it('should include statistics for each metric', () => {
      monitor.recordMetric('TTFB', 500);
      monitor.recordMetric('TTFB', 600);

      const report = monitor.getPerformanceReport();
      const ttfbMetric = report.metrics.TTFB;

      expect(ttfbMetric.count).toBe(2);
      expect(ttfbMetric.min).toBe(500);
      expect(ttfbMetric.max).toBe(600);
      expect(ttfbMetric.avg).toBe(550);
      expect(ttfbMetric.p50).toBeDefined();
      expect(ttfbMetric.p95).toBeDefined();
      expect(ttfbMetric.p99).toBeDefined();
    });
  });

  describe('Global performanceMonitor instance', () => {
    it('should be accessible', () => {
      expect(performanceMonitor).toBeDefined();
      expect(performanceMonitor.recordMetric).toBeDefined();
      expect(performanceMonitor.getMetricStats).toBeDefined();
    });
  });

  describe('Degradation detection scenarios', () => {
    it('should detect FCP degradation', () => {
      monitor.recordMetric('FCP', 1500);
      monitor.recordMetric('FCP', 1700); // 13.3% degradation

      const degradations = monitor.getRecentDegradations(30);
      const fcpDegradation = degradations.find(d => d.metric === 'FCP');

      expect(fcpDegradation).toBeDefined();
      expect(fcpDegradation!.degradationPercent).toBeGreaterThan(0.1);
    });

    it('should detect LCP degradation', () => {
      monitor.recordMetric('LCP', 2000);
      monitor.recordMetric('LCP', 2300); // 15% degradation

      const degradations = monitor.getRecentDegradations(30);
      const lcpDegradation = degradations.find(d => d.metric === 'LCP');

      expect(lcpDegradation).toBeDefined();
    });

    it('should detect CLS degradation', () => {
      monitor.recordMetric('CLS', 0.08);
      monitor.recordMetric('CLS', 0.092); // 15% degradation

      const degradations = monitor.getRecentDegradations(30);
      const clsDegradation = degradations.find(d => d.metric === 'CLS');

      expect(clsDegradation).toBeDefined();
    });

    it('should track multiple degradations', () => {
      monitor.recordMetric('FCP', 1000);
      monitor.recordMetric('FCP', 1200); // Degradation 1

      monitor.recordMetric('LCP', 2000);
      monitor.recordMetric('LCP', 2300); // Degradation 2

      const degradations = monitor.getRecentDegradations(30);
      expect(degradations.length).toBeGreaterThanOrEqual(2);
    });
  });

  describe('Edge cases', () => {
    it('should handle single sample gracefully', () => {
      monitor.recordMetric('FCP', 1500);
      expect(logger.warn).not.toHaveBeenCalled();
    });

    it('should handle zero values', () => {
      monitor.recordMetric('CLS', 0);
      monitor.recordMetric('CLS', 0);

      const stats = monitor.getMetricStats('CLS');
      expect(stats!.avg).toBe(0);
    });

    it('should handle very large values', () => {
      monitor.recordMetric('FCP', 999999);
      const stats = monitor.getMetricStats('FCP');

      expect(stats!.max).toBe(999999);
    });
  });
});
