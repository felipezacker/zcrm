import { describe, it, expect } from 'vitest';
import { formatPriorityPtBr, priorityAriaLabelPtBr } from '../priority';

describe('formatPriorityPtBr', () => {
  it('should map English priorities to PT-BR', () => {
    expect(formatPriorityPtBr('high')).toBe('Alta');
    expect(formatPriorityPtBr('medium')).toBe('Média');
    expect(formatPriorityPtBr('low')).toBe('Baixa');
    expect(formatPriorityPtBr('critical')).toBe('Crítica');
  });

  it('should handle PT-BR input (case-insensitive)', () => {
    expect(formatPriorityPtBr('Alta')).toBe('Alta');
    expect(formatPriorityPtBr('MÉDIA')).toBe('Média');
    expect(formatPriorityPtBr('baixa')).toBe('Baixa');
    expect(formatPriorityPtBr('Crítica')).toBe('Crítica');
  });

  it('should handle alternate PT-BR forms', () => {
    expect(formatPriorityPtBr('alto')).toBe('Alta');
    expect(formatPriorityPtBr('media')).toBe('Média');
    expect(formatPriorityPtBr('baixo')).toBe('Baixa');
    expect(formatPriorityPtBr('critica')).toBe('Crítica');
  });

  it('should handle case-insensitive English', () => {
    expect(formatPriorityPtBr('HIGH')).toBe('Alta');
    expect(formatPriorityPtBr('Medium')).toBe('Média');
    expect(formatPriorityPtBr('Low')).toBe('Baixa');
  });

  it('should return original string for unknown values', () => {
    expect(formatPriorityPtBr('unknown')).toBe('unknown');
    expect(formatPriorityPtBr('custom-priority')).toBe('custom-priority');
  });

  it('should handle null/undefined', () => {
    expect(formatPriorityPtBr(null)).toBe('');
    expect(formatPriorityPtBr(undefined)).toBe('');
  });

  it('should trim whitespace', () => {
    expect(formatPriorityPtBr('  high  ')).toBe('Alta');
  });
});

describe('priorityAriaLabelPtBr', () => {
  it('should return aria label for known priorities', () => {
    expect(priorityAriaLabelPtBr('high')).toBe('prioridade alta');
    expect(priorityAriaLabelPtBr('medium')).toBe('prioridade média');
    expect(priorityAriaLabelPtBr('low')).toBe('prioridade baixa');
  });

  it('should return empty for null/undefined', () => {
    expect(priorityAriaLabelPtBr(null)).toBe('');
    expect(priorityAriaLabelPtBr(undefined)).toBe('');
  });
});
