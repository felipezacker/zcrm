import pino from 'pino';
import { randomUUID } from 'crypto';
import { redactSensitiveData } from './utils/redact';

const isDev = process.env.NODE_ENV === 'development';

export const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  transport: isDev
    ? {
        target: 'pino-pretty',
        options: {
          colorize: true,
          singleLine: false,
        },
      }
    : undefined,
  base: {
    environment: process.env.NODE_ENV,
  },
});

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
