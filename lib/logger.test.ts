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

    it('should generate IDs with timestamp and random suffix', () => {
      const id = generateCorrelationId();
      const parts = id.split('-');

      expect(parts.length).toBe(2);
      expect(parts[0]).toMatch(/^\d+$/); // timestamp
      expect(parts[1]).toMatch(/^[a-z0-9]+$/); // random suffix
    });
  });

  describe('redactSensitiveData', () => {
    it('should redact password fields', () => {
      const data = {
        username: 'john',
        password: 'secret123',
      };

      const redacted = redactSensitiveData(data);

      expect(redacted.username).toBe('john');
      expect(redacted.password).toBe('[REDACTED]');
    });

    it('should redact token fields', () => {
      const data = {
        access_token: 'abc123',
        refresh_token: 'xyz789',
      };

      const redacted = redactSensitiveData(data);

      expect(redacted.access_token).toBe('[REDACTED]');
      expect(redacted.refresh_token).toBe('[REDACTED]');
    });

    it('should redact authorization headers', () => {
      const data = {
        authorization: 'Bearer token123',
      };

      const redacted = redactSensitiveData(data);

      expect(redacted.authorization).toBe('[REDACTED]');
    });

    it('should recursively redact nested objects', () => {
      const data = {
        user: {
          name: 'john',
          credentials: {
            password: 'secret',
            api_key: 'key123',
          },
        },
      };

      const redacted = redactSensitiveData(data);

      expect(redacted.user.name).toBe('john');
      expect(redacted.user.credentials.password).toBe('[REDACTED]');
      expect(redacted.user.credentials.api_key).toBe('[REDACTED]');
    });

    it('should handle arrays', () => {
      const data = [
        { password: 'secret' },
        { api_key: 'key' },
      ];

      const redacted = redactSensitiveData(data);

      expect(redacted[0].password).toBe('[REDACTED]');
      expect(redacted[1].api_key).toBe('[REDACTED]');
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

      expect(serialized.headers.authorization).toBe('[REDACTED]');
      expect(serialized.headers['content-type']).toBe('application/json');
    });
  });

  describe('logger instance', () => {
    it('should have correct log levels', () => {
      expect(logger.level).toBeDefined();
      expect(typeof logger.info).toBe('function');
      expect(typeof logger.error).toBe('function');
      expect(typeof logger.warn).toBe('function');
      expect(typeof logger.debug).toBe('function');
    });
  });
});
