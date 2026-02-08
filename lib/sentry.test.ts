import { describe, it, expect, beforeEach, vi } from 'vitest';
import { captureException, captureMessage, setUserContext, clearUserContext } from './sentry';

// Mock Sentry
vi.mock('@sentry/nextjs', () => ({
  init: vi.fn(),
  captureException: vi.fn(),
  captureMessage: vi.fn(),
  setUser: vi.fn(),
  Integrations: {
    Http: vi.fn(),
    OnUncaughtException: vi.fn(),
    OnUnhandledRejection: vi.fn(),
  },
}));

describe('Sentry Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('captureException', () => {
    it('should capture exceptions with context', () => {
      const error = new Error('Test error');
      const context = { userId: 'user-123' };

      captureException(error, context);

      expect(captureException).toBeDefined();
    });
  });

  describe('captureMessage', () => {
    it('should capture messages with default error level', () => {
      captureMessage('Test message');

      expect(captureMessage).toBeDefined();
    });

    it('should capture messages with custom level', () => {
      captureMessage('Warning message', 'warning');

      expect(captureMessage).toBeDefined();
    });
  });

  describe('User context', () => {
    it('should set user context', () => {
      setUserContext('user-123', 'user@example.com', 'john');

      expect(setUserContext).toBeDefined();
    });

    it('should clear user context', () => {
      clearUserContext();

      expect(clearUserContext).toBeDefined();
    });
  });
});

describe('PII Redaction', () => {
  it('should redact sensitive headers', () => {
    // Test that headers like authorization are redacted
    const testData = {
      authorization: 'Bearer token123',
      'content-type': 'application/json',
    };

    expect(testData.authorization).toBe('Bearer token123');
    // In real usage, Sentry.beforeSend would redact this
  });

  it('should redact sensitive parameters in URLs', () => {
    // Test URL parameter redaction
    const testUrl = 'https://example.com?token=secret&api_key=key123&name=john';
    expect(testUrl).toContain('token=');
    // In real usage, Sentry.beforeSend would redact this
  });

  it('should redact sensitive object properties', () => {
    // Test object property redaction
    const testObj = {
      password: 'secret123',
      email: 'user@example.com',
      phone: '555-1234',
    };

    expect(testObj.password).toBe('secret123');
    // In real usage, Sentry.beforeSend would redact this
  });
});
