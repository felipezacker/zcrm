import { describe, it, expect, beforeEach, vi } from 'vitest';
import * as SentryMock from '@sentry/nextjs';
import { captureException, captureMessage, setUserContext, clearUserContext } from './sentry';

vi.mock('@sentry/nextjs', () => ({
  init: vi.fn(),
  captureException: vi.fn(),
  captureMessage: vi.fn(),
  setUser: vi.fn(),
}));

describe('Sentry Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('captureException', () => {
    it('should call Sentry.captureException with error and context', () => {
      const error = new Error('Test error');
      const context = { userId: 'user-123' };

      captureException(error, context);

      expect(SentryMock.captureException).toHaveBeenCalledWith(error, {
        extra: context,
      });
    });

    it('should call Sentry.captureException without context', () => {
      const error = new Error('No context error');

      captureException(error);

      expect(SentryMock.captureException).toHaveBeenCalledWith(error, {
        extra: undefined,
      });
    });
  });

  describe('captureMessage', () => {
    it('should call Sentry.captureMessage with default error level', () => {
      captureMessage('Test message');

      expect(SentryMock.captureMessage).toHaveBeenCalledWith('Test message', 'error');
    });

    it('should call Sentry.captureMessage with custom level', () => {
      captureMessage('Warning message', 'warning');

      expect(SentryMock.captureMessage).toHaveBeenCalledWith('Warning message', 'warning');
    });
  });

  describe('User context', () => {
    it('should set user context with only userId', () => {
      setUserContext('user-123');

      expect(SentryMock.setUser).toHaveBeenCalledWith({ id: 'user-123' });
    });

    it('should clear user context', () => {
      clearUserContext();

      expect(SentryMock.setUser).toHaveBeenCalledWith(null);
    });
  });
});
