import { Metric } from 'web-vitals';
import { logger } from './logger';

// Performance baselines
export const PERFORMANCE_BASELINES = {
  FCP: 1800, // First Contentful Paint (ms)
  LCP: 2500, // Largest Contentful Paint (ms)
  CLS: 0.1, // Cumulative Layout Shift
  TTFB: 600, // Time to First Byte (ms)
  FID: 100, // First Input Delay (ms)
  INP: 200, // Interaction to Next Paint (ms)
} as const;

// Performance ratings
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
    case 'FID':
      return metric.value <= 100 ? 'good' : metric.value <= 300 ? 'needs-improvement' : 'poor';
    case 'INP':
      return metric.value <= 200 ? 'good' : metric.value <= 500 ? 'needs-improvement' : 'poor';
    default:
      return 'poor';
  }
};

// Web Vitals reporter
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

  // Send to analytics service
  if (typeof window !== 'undefined' && window.__analyticsReady) {
    sendMetricToAnalytics(metric, rating);
  }
};

// Send metric to external analytics
const sendMetricToAnalytics = async (metric: Metric, rating: PerformanceRating) => {
  try {
    await fetch('/api/analytics/metrics', {
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

// Initialize analytics
export const initializeAnalytics = () => {
  if (typeof window !== 'undefined') {
    window.__analyticsReady = true;
  }

  // Import web-vitals and register reporter
  try {
    import('web-vitals').then(({ getCLS, getFCP, getFID, getLCP, getTTFB, getINP }) => {
      getCLS(reportWebVitals);
      getFCP(reportWebVitals);
      getFID(reportWebVitals);
      getLCP(reportWebVitals);
      getTTFB(reportWebVitals);
      getINP(reportWebVitals);
    });
  } catch (error) {
    logger.error({ error }, 'Failed to initialize Web Vitals');
  }
};

// Performance monitoring for specific functions
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

// Mark and measure for performance observer
export const mark = (name: string) => {
  if (typeof window !== 'undefined' && window.performance) {
    performance.mark(name);
  }
};

export const measure = (name: string, startMark: string, endMark: string) => {
  if (typeof window !== 'undefined' && window.performance) {
    try {
      performance.measure(name, startMark, endMark);
      const measure = performance.getEntriesByName(name)[0];
      if (measure) {
        logger.info(
          { name, duration: measure.duration },
          'Performance measurement'
        );
      }
    } catch (error) {
      logger.error({ error }, `Failed to measure ${name}`);
    }
  }
};

// Declare global window property
declare global {
  interface Window {
    __analyticsReady?: boolean;
  }
}
