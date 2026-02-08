import * as Sentry from '@sentry/nextjs';

export const initSentry = () => {
  if (!process.env.SENTRY_DSN) {
    console.warn('SENTRY_DSN not configured, error tracking disabled');
    return;
  }

  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    environment: process.env.NODE_ENV,
    enabled: process.env.NODE_ENV === 'production',
    tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
    integrations: [
      new Sentry.Integrations.Http({ tracing: true }),
      new Sentry.Integrations.OnUncaughtException(),
      new Sentry.Integrations.OnUnhandledRejection(),
    ],
    beforeSend(event) {
      // Redact PII
      if (event.request) {
        event.request.headers = redactHeaders(event.request.headers || {});
        event.request.url = redactUrl(event.request.url || '');
      }

      if (event.extra) {
        event.extra = redactObject(event.extra);
      }

      if (event.contexts?.app?.user_id) {
        event.contexts.app.user_id = '[REDACTED]';
      }

      return event;
    },
  });
};

const SENSITIVE_HEADERS = [
  'authorization',
  'cookie',
  'x-api-key',
  'x-access-token',
];

const redactHeaders = (headers: any): any => {
  const redacted = { ...headers };

  for (const [key, value] of Object.entries(redacted)) {
    if (SENSITIVE_HEADERS.includes(key.toLowerCase())) {
      redacted[key] = '[REDACTED]';
    }
  }

  return redacted;
};

const redactUrl = (url: string): string => {
  try {
    const urlObj = new URL(url, 'http://localhost');
    const params = urlObj.searchParams;

    // Redact common sensitive parameters
    const sensitiveParams = [
      'token',
      'api_key',
      'password',
      'secret',
      'key',
    ];

    for (const param of sensitiveParams) {
      if (params.has(param)) {
        params.set(param, '[REDACTED]');
      }
    }

    return urlObj.toString();
  } catch {
    return url;
  }
};

const redactObject = (obj: any): any => {
  if (!obj || typeof obj !== 'object') return obj;

  const redacted = Array.isArray(obj) ? [...obj] : { ...obj };

  for (const key in redacted) {
    const lowerKey = key.toLowerCase();
    if (
      lowerKey.includes('password') ||
      lowerKey.includes('token') ||
      lowerKey.includes('secret') ||
      lowerKey.includes('api_key') ||
      lowerKey.includes('email') ||
      lowerKey.includes('phone') ||
      lowerKey.includes('ssn')
    ) {
      redacted[key] = '[REDACTED]';
    } else if (typeof redacted[key] === 'object') {
      redacted[key] = redactObject(redacted[key]);
    }
  }

  return redacted;
};

// Capture exceptions
export const captureException = (error: Error, context?: any) => {
  Sentry.captureException(error, {
    extra: context,
  });
};

// Capture messages
export const captureMessage = (message: string, level: 'fatal' | 'error' | 'warning' | 'info' | 'debug' = 'error') => {
  Sentry.captureMessage(message, level);
};

// Set user context
export const setUserContext = (userId: string, email?: string, username?: string) => {
  Sentry.setUser({
    id: userId,
    email,
    username,
  });
};

// Clear user context
export const clearUserContext = () => {
  Sentry.setUser(null);
};
