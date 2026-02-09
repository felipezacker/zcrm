import { describe, it, expect } from 'vitest';
import { redactSensitiveData, redactHeaders, redactUrl } from './redact';

describe('Redact Utilities', () => {
  describe('redactSensitiveData', () => {
    it('should redact email fields', () => {
      const data = { email: 'user@example.com', name: 'John' };
      const result = redactSensitiveData(data) as Record<string, unknown>;

      expect(result.email).toBe('[REDACTED]');
      expect(result.name).toBe('John');
    });

    it('should redact phone fields', () => {
      const data = { phone: '555-1234' };
      const result = redactSensitiveData(data) as Record<string, unknown>;

      expect(result.phone).toBe('[REDACTED]');
    });

    it('should use Object.keys to prevent prototype pollution', () => {
      const proto = { inherited: 'value' };
      const obj = Object.create(proto);
      obj.password = 'secret';
      obj.name = 'test';

      const result = redactSensitiveData(obj) as Record<string, unknown>;

      expect(result.password).toBe('[REDACTED]');
      expect(result.name).toBe('test');
      expect(result.inherited).toBeUndefined();
    });
  });

  describe('redactHeaders', () => {
    it('should redact authorization header', () => {
      const headers = { authorization: 'Bearer token', 'content-type': 'application/json' };
      const result = redactHeaders(headers);

      expect(result.authorization).toBe('[REDACTED]');
      expect(result['content-type']).toBe('application/json');
    });

    it('should redact cookie header', () => {
      const headers = { cookie: 'session=abc123' };
      const result = redactHeaders(headers);

      expect(result.cookie).toBe('[REDACTED]');
    });

    it('should redact x-api-key header', () => {
      const headers = { 'x-api-key': 'key123' };
      const result = redactHeaders(headers);

      expect(result['x-api-key']).toBe('[REDACTED]');
    });

    it('should be case-insensitive', () => {
      const headers = { Authorization: 'Bearer token', COOKIE: 'session=abc' };
      const result = redactHeaders(headers);

      expect(result.Authorization).toBe('[REDACTED]');
      expect(result.COOKIE).toBe('[REDACTED]');
    });
  });

  describe('redactUrl', () => {
    it('should redact token parameter', () => {
      const url = 'https://example.com/api?token=secret123&name=john';
      const result = redactUrl(url);

      expect(result).toContain('token=%5BREDACTED%5D');
      expect(result).toContain('name=john');
    });

    it('should redact api_key parameter', () => {
      const url = 'https://example.com/api?api_key=key123';
      const result = redactUrl(url);

      expect(result).toContain('api_key=%5BREDACTED%5D');
    });

    it('should redact password parameter', () => {
      const url = 'https://example.com/login?password=secret';
      const result = redactUrl(url);

      expect(result).toContain('password=%5BREDACTED%5D');
    });

    it('should handle invalid URLs gracefully', () => {
      const result = redactUrl('not-a-url');

      expect(result).toBeDefined();
    });

    it('should handle URLs without sensitive params', () => {
      const url = 'https://example.com/api?page=1&limit=10';
      const result = redactUrl(url);

      expect(result).toContain('page=1');
      expect(result).toContain('limit=10');
    });
  });
});
