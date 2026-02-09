/**
 * Performance Monitoring and Alerting
 * Tracks application performance metrics and triggers alerts on degradation
 */

import { logger } from '../logger';
import { queryCollector } from '../middleware/database-logger';

export interface PerformanceThreshold {
  metric: string;
  goodThreshold: number;
  degradedThreshold: number;
  unit: string;
}

export interface PerformanceDegradation {
  metric: string;
  currentValue: number;
  previousValue: number;
  degradationPercent: number;
  exceededThreshold: boolean;
  timestamp: Date;
}

/**
 * Performance thresholds for alerting
 * Alert triggers when value exceeds degradedThreshold
 */
export const PERFORMANCE_THRESHOLDS: Record<string, PerformanceThreshold> = {
  FCP: {
    metric: 'FCP',
    goodThreshold: 1800, // ms
    degradedThreshold: 1980, // 10% above good
    unit: 'ms',
  },
  LCP: {
    metric: 'LCP',
    goodThreshold: 2500, // ms
    degradedThreshold: 2750, // 10% above good
    unit: 'ms',
  },
  CLS: {
    metric: 'CLS',
    goodThreshold: 0.1,
    degradedThreshold: 0.11, // 10% above good
    unit: 'score',
  },
  TTFB: {
    metric: 'TTFB',
    goodThreshold: 600, // ms
    degradedThreshold: 660, // 10% above good
    unit: 'ms',
  },
  INP: {
    metric: 'INP',
    goodThreshold: 200, // ms
    degradedThreshold: 220, // 10% above good
    unit: 'ms',
  },
  DB_QUERY_AVG: {
    metric: 'DB_QUERY_AVG',
    goodThreshold: 100, // ms
    degradedThreshold: 110, // 10% above good
    unit: 'ms',
  },
  ERROR_RATE: {
    metric: 'ERROR_RATE',
    goodThreshold: 0.01, // 1%
    degradedThreshold: 0.011, // 10% above good
    unit: 'percent',
  },
};

/**
 * Alert configuration for different severity levels
 */
export const ALERT_CONFIG = {
  // Web Vitals alerts
  FCP_DEGRADATION: {
    name: 'FCP Degradation',
    metric: 'FCP',
    severity: 'warning',
    degradationThreshold: 0.1, // 10%
    description: 'First Contentful Paint has degraded by more than 10%',
  },
  LCP_DEGRADATION: {
    name: 'LCP Degradation',
    metric: 'LCP',
    severity: 'warning',
    degradationThreshold: 0.1,
    description: 'Largest Contentful Paint has degraded by more than 10%',
  },
  CLS_DEGRADATION: {
    name: 'CLS Degradation',
    metric: 'CLS',
    severity: 'warning',
    degradationThreshold: 0.1,
    description: 'Cumulative Layout Shift has degraded by more than 10%',
  },
  TTFB_DEGRADATION: {
    name: 'TTFB Degradation',
    metric: 'TTFB',
    severity: 'warning',
    degradationThreshold: 0.1,
    description: 'Time to First Byte has degraded by more than 10%',
  },
  INP_DEGRADATION: {
    name: 'INP Degradation',
    metric: 'INP',
    severity: 'warning',
    degradationThreshold: 0.1,
    description: 'Interaction to Next Paint has degraded by more than 10%',
  },

  // Database alerts
  DB_SLOW_QUERIES: {
    name: 'High Slow Query Rate',
    metric: 'DB_SLOW_QUERIES',
    severity: 'warning',
    degradationThreshold: 0.1,
    description: 'Slow query rate (>500ms) has increased by more than 10%',
  },
  DB_QUERY_PERF: {
    name: 'Database Query Performance Degradation',
    metric: 'DB_QUERY_AVG',
    severity: 'warning',
    degradationThreshold: 0.1,
    description: 'Average database query duration has degraded by more than 10%',
  },
  DB_ERROR_RATE: {
    name: 'High Database Error Rate',
    metric: 'DB_ERROR_RATE',
    severity: 'critical',
    degradationThreshold: 0.05, // 5% (more sensitive)
    description: 'Database error rate has increased by more than 5%',
  },

  // Application alerts
  ERROR_RATE_ALERT: {
    name: 'High Application Error Rate',
    metric: 'ERROR_RATE',
    severity: 'critical',
    degradationThreshold: 0.05,
    description: 'Application error rate exceeds 1%',
  },
};

/**
 * Track performance metrics over time
 */
export class PerformanceMonitor {
  private metrics: Map<string, number[]> = new Map();
  private maxHistoryLength = 100; // Keep last 100 samples
  private degradations: PerformanceDegradation[] = [];

  /**
   * Record a metric value
   */
  recordMetric(metricName: string, value: number): void {
    if (!this.metrics.has(metricName)) {
      this.metrics.set(metricName, []);
    }

    const history = this.metrics.get(metricName)!;
    history.push(value);

    // Keep only last N samples
    if (history.length > this.maxHistoryLength) {
      history.shift();
    }

    // Check for degradation
    this.checkDegradation(metricName, value);
  }

  /**
   * Check if metric has degraded more than threshold
   */
  private checkDegradation(metricName: string, currentValue: number): void {
    const history = this.metrics.get(metricName);
    if (!history || history.length < 2) {
      return; // Need at least 2 samples
    }

    const previousValue = history[history.length - 2];
    const degradationPercent = (currentValue - previousValue) / previousValue;

    if (degradationPercent > 0.1) {
      // More than 10% degradation
      const degradation: PerformanceDegradation = {
        metric: metricName,
        currentValue,
        previousValue,
        degradationPercent: Math.round(degradationPercent * 100) / 100,
        exceededThreshold: true,
        timestamp: new Date(),
      };

      this.degradations.push(degradation);
      this.triggerAlert(degradation);
    }
  }

  /**
   * Trigger alert for performance degradation
   */
  private triggerAlert(degradation: PerformanceDegradation): void {
    const alertConfig = ALERT_CONFIG[`${degradation.metric}_DEGRADATION` as keyof typeof ALERT_CONFIG];

    if (alertConfig) {
      logger.warn(
        {
          metric: degradation.metric,
          current: degradation.currentValue,
          previous: degradation.previousValue,
          degradationPercent: `${Math.round(degradation.degradationPercent * 100)}%`,
          severity: alertConfig.severity,
          timestamp: degradation.timestamp,
        },
        `Performance Alert: ${alertConfig.name} - ${alertConfig.description}`
      );

      // Send to alerting service if configured
      if (process.env.SENTRY_DSN) {
        this.sendToSentry(degradation, alertConfig);
      }
    }
  }

  /**
   * Send performance alert to Sentry
   */
  private sendToSentry(degradation: PerformanceDegradation, config: any): void {
    try {
      // Dynamically import Sentry only if available
      import('@sentry/nextjs').then(Sentry => {
        Sentry.captureMessage(`Performance degradation detected: ${degradation.metric}`, 'warning');
      }).catch(() => {
        // Sentry not available
      });
    } catch {
      // Silently fail if Sentry is not available
    }
  }

  /**
   * Get average metric value
   */
  getAverageMetric(metricName: string): number | null {
    const history = this.metrics.get(metricName);
    if (!history || history.length === 0) {
      return null;
    }

    const sum = history.reduce((a, b) => a + b, 0);
    return sum / history.length;
  }

  /**
   * Get metric statistics
   */
  getMetricStats(metricName: string) {
    const history = this.metrics.get(metricName);
    if (!history || history.length === 0) {
      return null;
    }

    const sorted = [...history].sort((a, b) => a - b);
    const sum = history.reduce((a, b) => a + b, 0);

    return {
      count: history.length,
      min: sorted[0],
      max: sorted[sorted.length - 1],
      avg: sum / history.length,
      p50: sorted[Math.floor(sorted.length * 0.5)],
      p95: sorted[Math.floor(sorted.length * 0.95)],
      p99: sorted[Math.floor(sorted.length * 0.99)],
    };
  }

  /**
   * Get recent degradations
   */
  getRecentDegradations(minutes: number = 30): PerformanceDegradation[] {
    const cutoff = new Date(Date.now() - minutes * 60 * 1000);
    return this.degradations.filter(d => d.timestamp > cutoff);
  }

  /**
   * Check database query performance
   */
  checkDatabasePerformance(): void {
    const stats = queryCollector.getStats();

    if (stats.totalQueries > 0) {
      // Record average query duration
      this.recordMetric('DB_QUERY_AVG', stats.avgDuration);

      // Calculate slow query rate
      const slowQueryRate = stats.slowQueries / stats.totalQueries;
      if (slowQueryRate > 0.1) {
        // More than 10% slow queries
        logger.warn(
          {
            slowQueries: stats.slowQueries,
            totalQueries: stats.totalQueries,
            slowQueryRate: `${Math.round(slowQueryRate * 100)}%`,
          },
          'High slow query rate detected'
        );
      }

      // Calculate error rate
      const errorRate = stats.failedQueries / stats.totalQueries;
      if (errorRate > 0.01) {
        // More than 1% errors
        logger.warn(
          {
            failedQueries: stats.failedQueries,
            totalQueries: stats.totalQueries,
            errorRate: `${Math.round(errorRate * 100)}%`,
          },
          'High database error rate detected'
        );
      }
    }
  }

  /**
   * Get performance report
   */
  getPerformanceReport() {
    const metrics: Record<string, any> = {};

    for (const [metricName, history] of this.metrics) {
      metrics[metricName] = this.getMetricStats(metricName);
    }

    return {
      metrics,
      degradations: this.getRecentDegradations(),
      database: queryCollector.getStats(),
      timestamp: new Date(),
    };
  }
}

/**
 * Global performance monitor instance
 */
export const performanceMonitor = new PerformanceMonitor();

/**
 * Initialize performance monitoring
 */
export function initializePerformanceMonitoring(): void {
  logger.info('[Performance Monitor] Initialized');

  // Check database performance every 5 minutes
  if (typeof setInterval !== 'undefined') {
    setInterval(() => {
      performanceMonitor.checkDatabasePerformance();
    }, 5 * 60 * 1000);
  }
}
