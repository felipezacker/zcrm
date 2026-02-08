import { Metric, onCLS, onFCP, onLCP, onTTFB, onINP } from 'web-vitals';
import { logger } from './logger';

export const PERFORMANCE_BASELINES = {
  FCP: 1800,
  LCP: 2500,
  CLS: 0.1,
  TTFB: 600,
  INP: 200,
} as const;

export type PerformanceRating = 'good' | 'needs-improvement' | 'poor';

export const getPerformanceRating = (metric: Metric): PerformanceRating => {
  switch (metric.name) {
    case 'FCP':
      return metric.value <= 1800 ? 'good' : metric.value <= 3000 ? 'needs-improvement' : 'poor';
    case 'LCP':
      return metric.value <= 2500 ? 'good' : metric.value <= 4000 ? 'needs-improvement' : 'poor';
    case 'CLS':
      return metric.value <= 0.1 ? 'good' : metric.value <= 0.25 ? 'needs-improvement' : 'poor';
    case 'TTFB':
      return metric.value <= 600 ? 'good' : metric.value <= 1800 ? 'needs-improvement' : 'poor';
    case 'INP':
      return metric.value <= 200 ? 'good' : metric.value <= 500 ? 'needs-improvement' : 'poor';
    default:
      return 'poor';
  }
};

export const reportWebVitals = (metric: Metric) => {
  const rating = getPerformanceRating(metric);
  const baseline = PERFORMANCE_BASELINES[metric.name as keyof typeof PERFORMANCE_BASELINES];
  const exceeds = baseline && metric.value > baseline;

  const logData = {
    metric: metric.name,
    value: metric.value,
    unit: metric.name === 'CLS' ? 'score' : 'ms',
    rating,
    exceeds,
    baseline,
    id: metric.id,
    navigation: metric.navigationType,
  };

  if (exceeds && rating !== 'good') {
    logger.warn(logData, `Performance degradation: ${metric.name}`);
  } else {
    logger.info(logData, `Web Vital: ${metric.name}`);
  }

  const analyticsEndpoint = process.env.NEXT_PUBLIC_ANALYTICS_ENDPOINT;
  if (analyticsEndpoint) {
    sendMetricToAnalytics(analyticsEndpoint, metric, rating);
  }
};

const sendMetricToAnalytics = async (endpoint: string, metric: Metric, rating: PerformanceRating) => {
  try {
    await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: metric.name,
        value: metric.value,
        unit: metric.name === 'CLS' ? 'score' : 'ms',
        rating,
        timestamp: new Date().toISOString(),
        url: typeof window !== 'undefined' ? window.location.pathname : '',
      }),
    });
  } catch (error) {
    logger.error({ error }, 'Failed to send metric to analytics');
  }
};

export const initializeAnalytics = () => {
  onCLS(reportWebVitals);
  onFCP(reportWebVitals);
  onLCP(reportWebVitals);
  onTTFB(reportWebVitals);
  onINP(reportWebVitals);
};

export const measurePerformance = async <T>(
  name: string,
  fn: () => Promise<T>
): Promise<T> => {
  const startTime = performance.now();

  try {
    const result = await fn();
    const duration = performance.now() - startTime;

    logger.info(
      { name, duration, status: 'success' },
      'Performance measurement'
    );

    return result;
  } catch (error) {
    const duration = performance.now() - startTime;

    logger.error(
      { name, duration, error: error instanceof Error ? error.message : String(error) },
      'Performance measurement failed'
    );

    throw error;
  }
};

export const mark = (name: string) => {
  if (typeof window !== 'undefined' && window.performance) {
    performance.mark(name);
  }
};

export const measure = (name: string, startMark: string, endMark: string) => {
  if (typeof window !== 'undefined' && window.performance) {
    try {
      performance.measure(name, startMark, endMark);
      const entry = performance.getEntriesByName(name)[0];
      if (entry) {
        logger.info(
          { name, duration: entry.duration },
          'Performance measurement'
        );
      }
    } catch (error) {
      logger.error({ error }, `Failed to measure ${name}`);
    }
  }
};
