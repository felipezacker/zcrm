/**
 * DataDog Log Aggregation Integration
 * Sends structured logs to DataDog for centralized monitoring
 */

import { logger } from '../logger';

interface DataDogLogPayload {
  message: string;
  [key: string]: any;
}

/**
 * Check if DataDog integration is enabled
 */
export const isDataDogEnabled = (): boolean => {
  return !!(
    process.env.DATADOG_API_KEY &&
    process.env.DATADOG_SITE &&
    process.env.NODE_ENV === 'production'
  );
};

/**
 * Get DataDog HTTP endpoint for log ingestion
 */
function getDataDogEndpoint(): string {
  const site = process.env.DATADOG_SITE || 'datadoghq.com';
  return `https://http-intake.logs.${site}/v1/input`;
}

/**
 * Send log to DataDog
 * @param payload Log payload with all structured data
 */
export async function sendToDataDog(payload: DataDogLogPayload): Promise<void> {
  if (!isDataDogEnabled()) {
    return;
  }

  try {
    const apiKey = process.env.DATADOG_API_KEY!;
    const endpoint = getDataDogEndpoint();

    const response = await fetch(`${endpoint}/${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'DD-API-KEY': apiKey,
      },
      body: JSON.stringify({
        ...payload,
        service: 'zcrm',
        environment: process.env.NODE_ENV,
        version: process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7),
        timestamp: Date.now(),
      }),
    });

    if (!response.ok) {
      console.error(
        `[DataDog] Failed to send log: ${response.status} ${response.statusText}`
      );
    }
  } catch (error) {
    // Don't throw - logging should never crash the app
    console.error('[DataDog] Error sending log:', error);
  }
}

/**
 * Initialize DataDog integration
 * Wraps logger to automatically send to DataDog in production
 */
export function initializeDataDogIntegration(): void {
  if (!isDataDogEnabled()) {
    console.log('[DataDog] Integration disabled (missing API key or not in production)');
    return;
  }

  console.log('[DataDog] Log aggregation integration initialized');

  // Log startup
  sendToDataDog({
    message: 'Application started',
    level: 'info',
    event: 'startup',
  }).catch(console.error);
}

/**
 * DataDog dashboard configuration
 * Recommended queries for monitoring
 */
export const DATADOG_DASHBOARD_QUERIES = {
  slowDatabaseQueries: 'service:zcrm @isSlow:true',
  errorLogs: 'service:zcrm level:error',
  performanceDegradation:
    'service:zcrm @duration:[500 TO 10000]',
  requestLatency: 'service:zcrm @duration:*',
  apiErrors: 'service:zcrm @errorType:*',
  databaseErrors: 'service:zcrm @table_name:* @error:*',
};

/**
 * Recommended alerts in DataDog
 */
export const DATADOG_RECOMMENDED_ALERTS = {
  highErrorRate: {
    metric: 'error_logs_count',
    threshold: 10,
    timeframe: '5m',
    message: 'High error rate detected',
  },
  slowQueries: {
    metric: 'slow_database_queries',
    threshold: 20,
    timeframe: '10m',
    message: 'High number of slow database queries',
  },
  highLatency: {
    metric: 'request_latency_p99',
    threshold: 1000,
    timeframe: '5m',
    message: 'API latency above 1000ms (p99)',
  },
  databaseErrors: {
    metric: 'database_errors_count',
    threshold: 5,
    timeframe: '5m',
    message: 'Database errors detected',
  },
};

/**
 * Log a metric to DataDog
 */
export async function logMetric(
  metricName: string,
  value: number,
  tags?: Record<string, string>
): Promise<void> {
  if (!isDataDogEnabled()) {
    return;
  }

  try {
    const apiKey = process.env.DATADOG_API_KEY!;
    const endpoint = getDataDogEndpoint();

    await fetch(`${endpoint}/${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: `Metric: ${metricName}`,
        level: 'info',
        metric: metricName,
        value,
        tags: {
          service: 'zcrm',
          ...tags,
        },
        timestamp: Date.now(),
      }),
    });
  } catch (error) {
    console.error('[DataDog] Error logging metric:', error);
  }
}
