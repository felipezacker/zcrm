import pino from 'pino';
import { randomUUID } from 'crypto';
import { redactSensitiveData } from './utils/redact';
import { getLoggerConfig, getLogTransport, scheduleLogCleanup } from './logger-config';
import { initializeDataDogIntegration } from './integrations/datadog-logger';

const isDev = process.env.NODE_ENV === 'development';

// Initialize logger with configuration and transport
export const logger = pino(
  getLoggerConfig(),
  pino.transport(getLogTransport())
);

// Schedule log cleanup on initialization
if (typeof window === 'undefined') {
  // Only schedule in server environment (not in browser)
  try {
    scheduleLogCleanup();
    initializeDataDogIntegration();
  } catch (error) {
    console.error('Failed to initialize logging infrastructure:', error);
  }
}

export const generateCorrelationId = (): string => {
  return randomUUID();
};

export { redactSensitiveData };

export const serializeRequest = (req: { method?: string; url?: string; headers?: Record<string, unknown> }) => ({
  method: req.method,
  url: req.url,
  headers: redactSensitiveData(req.headers || {}),
});

export const serializeResponse = (res: { statusCode?: number; getHeaders?: () => Record<string, unknown> }) => ({
  statusCode: res.statusCode,
  headers: redactSensitiveData(res.getHeaders?.() || {}),
});
