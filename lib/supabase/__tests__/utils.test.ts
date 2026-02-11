import { describe, it, expect, vi } from 'vitest';
import {
  isValidUUID,
  sanitizeUUID,
  sanitizeUUIDs,
  requireUUID,
  sanitizeText,
  sanitizeNumber,
} from '../utils';

describe('isValidUUID', () => {
  it('should accept valid UUIDs', () => {
    expect(isValidUUID('123e4567-e89b-12d3-a456-426614174000')).toBe(true);
    expect(isValidUUID('550e8400-e29b-41d4-a716-446655440000')).toBe(true);
  });

  it('should reject invalid values', () => {
    expect(isValidUUID('')).toBe(false);
    expect(isValidUUID('not-a-uuid')).toBe(false);
    expect(isValidUUID(null)).toBe(false);
    expect(isValidUUID(undefined)).toBe(false);
    expect(isValidUUID(123)).toBe(false);
    expect(isValidUUID('  ')).toBe(false);
  });
});

describe('sanitizeUUID', () => {
  it('should return valid UUID as-is', () => {
    const uuid = '123e4567-e89b-12d3-a456-426614174000';
    expect(sanitizeUUID(uuid)).toBe(uuid);
  });

  it('should return null for empty/invalid values', () => {
    expect(sanitizeUUID('')).toBeNull();
    expect(sanitizeUUID(null)).toBeNull();
    expect(sanitizeUUID(undefined)).toBeNull();
    expect(sanitizeUUID('  ')).toBeNull();
  });

  it('should warn and return null for invalid non-empty strings', () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    expect(sanitizeUUID('invalid-uuid')).toBeNull();
    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('UUID inválido'));
    warnSpy.mockRestore();
  });
});

describe('sanitizeUUIDs', () => {
  it('should sanitize specified UUID fields in object', () => {
    const obj = {
      contactId: '123e4567-e89b-12d3-a456-426614174000',
      boardId: '',
      name: 'Test',
    };
    const result = sanitizeUUIDs(obj, ['contactId', 'boardId']);
    expect(result.contactId).toBe('123e4567-e89b-12d3-a456-426614174000');
    expect(result.boardId).toBeNull();
    expect(result.name).toBe('Test');
  });
});

describe('requireUUID', () => {
  it('should return valid UUID', () => {
    const uuid = '123e4567-e89b-12d3-a456-426614174000';
    expect(requireUUID(uuid, 'Test')).toBe(uuid);
  });

  it('should throw for invalid UUID', () => {
    expect(() => requireUUID('', 'Board ID')).toThrow('Board ID é obrigatório');
    expect(() => requireUUID(null, 'Deal ID')).toThrow('Deal ID é obrigatório');
  });
});

describe('sanitizeText', () => {
  it('should trim and return text', () => {
    expect(sanitizeText('  hello  ')).toBe('hello');
  });

  it('should return null for empty/whitespace', () => {
    expect(sanitizeText('')).toBeNull();
    expect(sanitizeText('   ')).toBeNull();
    expect(sanitizeText(null)).toBeNull();
    expect(sanitizeText(undefined)).toBeNull();
  });
});

describe('sanitizeNumber', () => {
  it('should return valid numbers', () => {
    expect(sanitizeNumber(42)).toBe(42);
    expect(sanitizeNumber(0)).toBe(0);
    expect(sanitizeNumber(-5)).toBe(-5);
  });

  it('should parse string numbers', () => {
    expect(sanitizeNumber('42')).toBe(42);
    expect(sanitizeNumber('3.14')).toBe(3.14);
  });

  it('should return default for invalid values', () => {
    expect(sanitizeNumber('abc')).toBe(0);
    expect(sanitizeNumber(NaN)).toBe(0);
    expect(sanitizeNumber(null)).toBe(0);
    expect(sanitizeNumber(undefined, 100)).toBe(100);
  });
});
