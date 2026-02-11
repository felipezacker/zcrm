import { describe, it, expect, vi } from 'vitest';

vi.mock('@ai-sdk/google', () => ({
  createGoogleGenerativeAI: vi.fn(() => vi.fn((model: string) => ({ provider: 'google', model }))),
}));
vi.mock('@ai-sdk/openai', () => ({
  createOpenAI: vi.fn(() => vi.fn((model: string) => ({ provider: 'openai', model }))),
}));
vi.mock('@ai-sdk/anthropic', () => ({
  createAnthropic: vi.fn(() => vi.fn((model: string) => ({ provider: 'anthropic', model }))),
}));

import { getModel } from '../config';

describe('getModel', () => {
  it('should create Google model', () => {
    const model = getModel('google', 'test-key', 'gemini-3-flash-preview');
    expect(model).toEqual({ provider: 'google', model: 'gemini-3-flash-preview' });
  });

  it('should create OpenAI model', () => {
    const model = getModel('openai', 'test-key', 'gpt-4o');
    expect(model).toEqual({ provider: 'openai', model: 'gpt-4o' });
  });

  it('should create Anthropic model', () => {
    const model = getModel('anthropic', 'test-key', 'claude-sonnet-4-5');
    expect(model).toEqual({ provider: 'anthropic', model: 'claude-sonnet-4-5' });
  });

  it('should use default model when modelId is empty', () => {
    const model = getModel('google', 'test-key', '');
    expect(model).toEqual({ provider: 'google', model: 'gemini-3-flash-preview' });
  });

  it('should throw when API key is missing', () => {
    expect(() => getModel('google', '', 'test')).toThrow('API Key is missing');
  });

  it('should throw for unsupported provider', () => {
    expect(() => getModel('invalid' as any, 'key', 'model')).toThrow('not supported');
  });
});
