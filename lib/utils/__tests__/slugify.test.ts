import { describe, it, expect } from 'vitest';
import { slugify } from '../slugify';

describe('slugify', () => {
  it('should lowercase and replace spaces with hyphens', () => {
    expect(slugify('Hello World')).toBe('hello-world');
  });

  it('should remove accents', () => {
    expect(slugify('Café com Leite')).toBe('cafe-com-leite');
    expect(slugify('São Paulo')).toBe('sao-paulo');
    expect(slugify('Negócios Rápidos')).toBe('negocios-rapidos');
  });

  it('should replace non-alphanumeric chars with hyphens', () => {
    expect(slugify('hello@world!')).toBe('hello-world');
    expect(slugify('test___value')).toBe('test-value');
  });

  it('should trim leading/trailing hyphens', () => {
    expect(slugify('--hello--')).toBe('hello');
    expect(slugify('  spaced  ')).toBe('spaced');
  });

  it('should collapse multiple hyphens', () => {
    expect(slugify('a   b   c')).toBe('a-b-c');
  });

  it('should handle null/undefined input', () => {
    expect(slugify(null as unknown as string)).toBe('');
    expect(slugify(undefined as unknown as string)).toBe('');
  });

  it('should handle empty string', () => {
    expect(slugify('')).toBe('');
  });
});
