import * as Sentry from '@sentry/nextjs';
import { redactSensitiveData, redactHeaders, redactUrl } from './utils/redact';

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
    beforeSend(event) {
      if (event.request) {
        event.request.headers = redactHeaders(event.request.headers || {}) as Record<string, string>;
        event.request.url = redactUrl(event.request.url || '');
      }

      if (event.extra) {
        event.extra = redactSensitiveData(event.extra) as Record<string, unknown>;
      }

      if (event.contexts?.app?.user_id) {
        event.contexts.app.user_id = '[REDACTED]';
      }

      return event;
    },
  });
};

export const captureException = (error: Error, context?: Record<string, unknown>) => {
  Sentry.captureException(error, {
    extra: context,
  });
};

export const captureMessage = (message: string, level: 'fatal' | 'error' | 'warning' | 'info' | 'debug' = 'error') => {
  Sentry.captureMessage(message, level);
};

export const setUserContext = (userId: string) => {
  Sentry.setUser({ id: userId });
};

export const clearUserContext = () => {
  Sentry.setUser(null);
};
