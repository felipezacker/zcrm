import { describe, it, expect } from 'vitest';
import {
  categorizeError,
  ErrorCategory,
  ALERT_THRESHOLDS,
} from './sentry-alerts';

describe('Sentry Alerts', () => {
  describe('categorizeError', () => {
    it('should categorize database errors', () => {
      const error = new Error('Database connection failed');
      expect(categorizeError(error)).toBe(ErrorCategory.DATABASE);
    });

    it('should categorize network errors', () => {
      const error = new Error('Network timeout');
      expect(categorizeError(error)).toBe(ErrorCategory.NETWORK);
    });

    it('should categorize authentication errors', () => {
      const error = new Error('Invalid token (401)');
      expect(categorizeError(error)).toBe(ErrorCategory.AUTHENTICATION);
    });

    it('should categorize authorization errors', () => {
      const error = new Error('Permission denied (403)');
      expect(categorizeError(error)).toBe(ErrorCategory.AUTHORIZATION);
    });

    it('should categorize validation errors', () => {
      const error = new Error('Validation failed: required field missing');
      expect(categorizeError(error)).toBe(ErrorCategory.VALIDATION);
    });

    it('should categorize business logic errors', () => {
      const error = new Error('Business rule violation');
      expect(categorizeError(error)).toBe(ErrorCategory.BUSINESS_LOGIC);
    });

    it('should default to unknown for uncategorized errors', () => {
      const error = new Error('Some random error');
      expect(categorizeError(error)).toBe(ErrorCategory.UNKNOWN);
    });

    it('should be case-insensitive', () => {
      const error = new Error('DATABASE ERROR');
      expect(categorizeError(error)).toBe(ErrorCategory.DATABASE);
    });
  });

  describe('Alert Thresholds', () => {
    it('should have configured error rate threshold', () => {
      expect(ALERT_THRESHOLDS.errorRatePercentage).toBe(5);
    });

    it('should have configured error count threshold', () => {
      expect(ALERT_THRESHOLDS.errorCountThreshold).toBe(10);
      expect(ALERT_THRESHOLDS.errorCountTimeWindow).toBe(5);
    });

    it('should have response time threshold', () => {
      expect(ALERT_THRESHOLDS.responseTimeThreshold).toBeGreaterThan(0);
    });

    it('should have critical error alert', () => {
      expect(ALERT_THRESHOLDS.criticalErrorThreshold).toBe(1);
    });
  });

});
