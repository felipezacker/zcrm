import pino from 'pino';

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

// Request correlation ID tracking
export const generateCorrelationId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

// Sensitive data redaction
const SENSITIVE_PATTERNS = [
  'password',
  'token',
  'api_key',
  'secret',
  'authorization',
  'cookie',
  'session',
];

export const redactSensitiveData = (obj: any): any => {
  if (!obj || typeof obj !== 'object') return obj;

  const redacted = Array.isArray(obj) ? [...obj] : { ...obj };

  for (const key in redacted) {
    const lowerKey = key.toLowerCase();
    const isSensitive = SENSITIVE_PATTERNS.some(pattern => lowerKey.includes(pattern));

    if (isSensitive) {
      redacted[key] = '[REDACTED]';
    } else if (typeof redacted[key] === 'object') {
      redacted[key] = redactSensitiveData(redacted[key]);
    }
  }

  return redacted;
};

// Serialize request/response for logging
export const serializeRequest = (req: any) => ({
  method: req.method,
  url: req.url,
  headers: redactSensitiveData(req.headers),
});

export const serializeResponse = (res: any) => ({
  statusCode: res.statusCode,
  headers: redactSensitiveData(res.getHeaders?.() || {}),
});
