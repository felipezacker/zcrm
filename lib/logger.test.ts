import { describe, it, expect } from 'vitest';
import { logger, generateCorrelationId, redactSensitiveData, serializeRequest } from './logger';

describe('Logger', () => {
  describe('generateCorrelationId', () => {
    it('should generate unique correlation IDs', () => {
      const id1 = generateCorrelationId();
      const id2 = generateCorrelationId();

      expect(id1).toBeTruthy();
      expect(id2).toBeTruthy();
      expect(id1).not.toBe(id2);
    });

    it('should generate valid UUID format', () => {
      const id = generateCorrelationId();
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

      expect(id).toMatch(uuidRegex);
    });
  });

  describe('redactSensitiveData', () => {
    it('should redact password fields', () => {
      const data = { username: 'john', password: 'secret123' };
      const redacted = redactSensitiveData(data) as Record<string, unknown>;

      expect(redacted.username).toBe('john');
      expect(redacted.password).toBe('[REDACTED]');
    });

    it('should redact token fields', () => {
      const data = { access_token: 'abc123', refresh_token: 'xyz789' };
      const redacted = redactSensitiveData(data) as Record<string, unknown>;

      expect(redacted.access_token).toBe('[REDACTED]');
      expect(redacted.refresh_token).toBe('[REDACTED]');
    });

    it('should redact authorization headers', () => {
      const data = { authorization: 'Bearer token123' };
      const redacted = redactSensitiveData(data) as Record<string, unknown>;

      expect(redacted.authorization).toBe('[REDACTED]');
    });

    it('should recursively redact nested objects', () => {
      const data = {
        user: {
          name: 'john',
          credentials: { password: 'secret', api_key: 'key123' },
        },
      };
      const redacted = redactSensitiveData(data) as any;

      expect(redacted.user.name).toBe('john');
      expect(redacted.user.credentials.password).toBe('[REDACTED]');
      expect(redacted.user.credentials.api_key).toBe('[REDACTED]');
    });

    it('should handle arrays', () => {
      const data = [{ password: 'secret' }, { api_key: 'key' }];
      const redacted = redactSensitiveData(data) as any[];

      expect(redacted[0].password).toBe('[REDACTED]');
      expect(redacted[1].api_key).toBe('[REDACTED]');
    });

    it('should stop at max depth to prevent stack overflow', () => {
      const deep: any = { a: { b: { c: { d: { e: { f: { password: 'secret' } } } } } } };
      const redacted = redactSensitiveData(deep) as any;

      // Should not throw, depth limit prevents infinite recursion
      expect(redacted).toBeDefined();
    });

    it('should handle null and primitives safely', () => {
      expect(redactSensitiveData(null)).toBeNull();
      expect(redactSensitiveData(undefined)).toBeUndefined();
      expect(redactSensitiveData('string')).toBe('string');
      expect(redactSensitiveData(42)).toBe(42);
    });
  });

  describe('serializeRequest', () => {
    it('should serialize request with method and URL', () => {
      const req = {
        method: 'POST',
        url: '/api/users',
        headers: { 'content-type': 'application/json' },
      };

      const serialized = serializeRequest(req);

      expect(serialized.method).toBe('POST');
      expect(serialized.url).toBe('/api/users');
    });

    it('should redact sensitive headers', () => {
      const req = {
        method: 'GET',
        url: '/api/data',
        headers: {
          authorization: 'Bearer token',
          'content-type': 'application/json',
        },
      };

      const serialized = serializeRequest(req);

      expect((serialized.headers as any).authorization).toBe('[REDACTED]');
      expect((serialized.headers as any)['content-type']).toBe('application/json');
    });
  });

  describe('logger instance', () => {
    it('should have correct log level methods', () => {
      expect(logger.level).toBeDefined();
      expect(typeof logger.info).toBe('function');
      expect(typeof logger.error).toBe('function');
      expect(typeof logger.warn).toBe('function');
      expect(typeof logger.debug).toBe('function');
    });
  });
});
