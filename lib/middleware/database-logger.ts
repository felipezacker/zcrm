import { logger } from '../logger';

/**
 * Database query logger for Supabase
 * Logs slow queries (> 500ms) and tracks performance metrics
 */

interface QueryMetrics {
  query: string;
  duration: number;
  rowCount?: number;
  error?: string;
  correlationId?: string;
}

const SLOW_QUERY_THRESHOLD = 500; // milliseconds

/**
 * Log database query with metrics
 */
export const logDatabaseQuery = (metrics: QueryMetrics): void => {
  const { query, duration, rowCount, error, correlationId } = metrics;

  const isSlow = duration > SLOW_QUERY_THRESHOLD;

  const logLevel = error ? 'error' : isSlow ? 'warn' : 'debug';
  const logMessage = error
    ? 'Database query failed'
    : isSlow
      ? 'Slow database query detected'
      : 'Database query executed';

  const logData = {
    correlationId,
    query: sanitizeQuery(query),
    duration,
    rowCount,
    isSlow,
    threshold: SLOW_QUERY_THRESHOLD,
    ...(error && { error }),
  };

  if (logLevel === 'error') {
    logger.error(logData, logMessage);
  } else if (logLevel === 'warn') {
    logger.warn(logData, logMessage);
  } else {
    logger.debug(logData, logMessage);
  }
};

/**
 * Sanitize query to remove sensitive data
 */
function sanitizeQuery(query: string): string {
  // Remove common sensitive patterns
  return query
    .replace(/password\s*=\s*'[^']*'/gi, "password='***'")
    .replace(/token\s*=\s*'[^']*'/gi, "token='***'")
    .replace(/api[_-]?key\s*=\s*'[^']*'/gi, "api_key='***'")
    .replace(/secret\s*=\s*'[^']*'/gi, "secret='***'")
    .replace(/auth[_-]?header\s*[=:]\s*'[^']*'/gi, "auth_header='***'");
}

/**
 * Create a Supabase query interceptor
 * Usage: Wrap database calls with this function
 */
export const createQueryInterceptor = (correlationId?: string) => {
  return async <T>(
    queryFn: () => Promise<T>,
    queryDescription: string
  ): Promise<T> => {
    const startTime = Date.now();

    try {
      const result = await queryFn();
      const duration = Date.now() - startTime;

      logDatabaseQuery({
        query: queryDescription,
        duration,
        correlationId,
      });

      return result;
    } catch (error) {
      const duration = Date.now() - startTime;

      logDatabaseQuery({
        query: queryDescription,
        duration,
        error: error instanceof Error ? error.message : String(error),
        correlationId,
      });

      throw error;
    }
  };
};

/**
 * Performance statistics
 */
export interface QueryStats {
  totalQueries: number;
  slowQueries: number;
  failedQueries: number;
  avgDuration: number;
  maxDuration: number;
  minDuration: number;
}

/**
 * Collect query performance statistics
 */
export class QueryPerformanceCollector {
  private stats: QueryStats = {
    totalQueries: 0,
    slowQueries: 0,
    failedQueries: 0,
    avgDuration: 0,
    maxDuration: 0,
    minDuration: Infinity,
  };

  private durations: number[] = [];

  recordQuery(metrics: QueryMetrics): void {
    this.stats.totalQueries++;

    if (metrics.error) {
      this.stats.failedQueries++;
    }

    if (metrics.duration > SLOW_QUERY_THRESHOLD) {
      this.stats.slowQueries++;
    }

    this.durations.push(metrics.duration);
    this.stats.maxDuration = Math.max(this.stats.maxDuration, metrics.duration);
    this.stats.minDuration = Math.min(this.stats.minDuration, metrics.duration);

    // Calculate average
    this.stats.avgDuration =
      this.durations.reduce((a, b) => a + b, 0) / this.durations.length;
  }

  getStats(): QueryStats {
    return { ...this.stats };
  }

  reset(): void {
    this.stats = {
      totalQueries: 0,
      slowQueries: 0,
      failedQueries: 0,
      avgDuration: 0,
      maxDuration: 0,
      minDuration: Infinity,
    };
    this.durations = [];
  }

  logStats(correlationId?: string): void {
    logger.info(
      { ...this.stats, correlationId },
      'Database performance statistics'
    );
  }
}

// Global collector instance
export const queryCollector = new QueryPerformanceCollector();
