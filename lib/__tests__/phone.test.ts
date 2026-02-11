import { describe, it, expect } from 'vitest';
import { normalizePhoneE164, isE164, toWhatsAppPhone } from '../phone';

describe('isE164', () => {
  it('should accept valid E.164 numbers', () => {
    expect(isE164('+5511999990000')).toBe(true);
    expect(isE164('+14155552671')).toBe(true);
    expect(isE164('+1234567890')).toBe(true);
  });

  it('should reject invalid formats', () => {
    expect(isE164('')).toBe(false);
    expect(isE164(null)).toBe(false);
    expect(isE164(undefined)).toBe(false);
    expect(isE164('5511999990000')).toBe(false); // missing +
    expect(isE164('+0111111111')).toBe(false); // starts with +0
    expect(isE164('abc')).toBe(false);
  });
});

describe('normalizePhoneE164', () => {
  it('should return empty string for empty input', () => {
    expect(normalizePhoneE164('')).toBe('');
    expect(normalizePhoneE164(null)).toBe('');
    expect(normalizePhoneE164(undefined)).toBe('');
  });

  it('should keep already valid E.164', () => {
    expect(normalizePhoneE164('+5511999990000')).toBe('+5511999990000');
  });

  it('should normalize Brazilian phone with formatting', () => {
    const result = normalizePhoneE164('(11) 99999-0000');
    expect(result).toBe('+5511999990000');
  });

  it('should handle E.164 with spaces/hyphens', () => {
    expect(normalizePhoneE164('+55 11 99999-0000')).toBe('+5511999990000');
  });

  it('should use BR as default country', () => {
    const result = normalizePhoneE164('11999990000');
    expect(result.startsWith('+55')).toBe(true);
  });

  it('should support custom default country', () => {
    const result = normalizePhoneE164('2025551234', { defaultCountry: 'US' });
    expect(result.startsWith('+1')).toBe(true);
  });
});

describe('toWhatsAppPhone', () => {
  it('should return digits without + prefix', () => {
    expect(toWhatsAppPhone('+5511999990000')).toBe('5511999990000');
  });

  it('should return empty string for empty input', () => {
    expect(toWhatsAppPhone('')).toBe('');
    expect(toWhatsAppPhone(null)).toBe('');
  });
});
