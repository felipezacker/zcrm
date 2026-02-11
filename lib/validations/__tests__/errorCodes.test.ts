import { describe, it, expect, afterEach } from 'vitest';
import {
  ERROR_CODES,
  ERROR_DOMAINS,
  getErrorMessage,
  createError,
  setLocale,
  getLocale,
} from '../errorCodes';

describe('errorCodes', () => {
  afterEach(() => {
    setLocale('pt-BR'); // Reset to default
  });

  describe('ERROR_CODES', () => {
    it('should have all expected field codes', () => {
      expect(ERROR_CODES.FIELD_REQUIRED).toBe('FIELD_REQUIRED');
      expect(ERROR_CODES.FIELD_TOO_SHORT).toBe('FIELD_TOO_SHORT');
      expect(ERROR_CODES.FIELD_TOO_LONG).toBe('FIELD_TOO_LONG');
    });

    it('should have all expected email codes', () => {
      expect(ERROR_CODES.EMAIL_REQUIRED).toBe('EMAIL_REQUIRED');
      expect(ERROR_CODES.EMAIL_INVALID).toBe('EMAIL_INVALID');
    });
  });

  describe('ERROR_DOMAINS', () => {
    it('should have all domains', () => {
      expect(ERROR_DOMAINS.FIELD).toBe('FIELD');
      expect(ERROR_DOMAINS.EMAIL).toBe('EMAIL');
      expect(ERROR_DOMAINS.API).toBe('API');
    });
  });

  describe('getErrorMessage', () => {
    it('should return PT-BR message by default', () => {
      expect(getErrorMessage('EMAIL_INVALID')).toBe('Email inválido');
    });

    it('should interpolate params', () => {
      const msg = getErrorMessage('FIELD_REQUIRED', { field: 'Nome' });
      expect(msg).toBe('Nome é obrigatório');
    });

    it('should interpolate multiple params', () => {
      const msg = getErrorMessage('FIELD_TOO_SHORT', { field: 'Senha', min: 8 });
      expect(msg).toBe('Senha deve ter no mínimo 8 caracteres');
    });

    it('should keep placeholder if param not provided', () => {
      const msg = getErrorMessage('FIELD_REQUIRED');
      expect(msg).toBe('{field} é obrigatório');
    });

    it('should use EN-US when locale is set', () => {
      setLocale('en-US');
      expect(getErrorMessage('EMAIL_INVALID')).toBe('Invalid email');
    });

    it('should fallback to PT-BR for unknown locale', () => {
      setLocale('fr-FR'); // Not supported, should stay on pt-BR
      expect(getLocale()).toBe('pt-BR');
    });
  });

  describe('createError', () => {
    it('should create error object with code and message', () => {
      const error = createError('FIELD_REQUIRED', { field: 'Email' });
      expect(error.code).toBe('FIELD_REQUIRED');
      expect(error.message).toBe('Email é obrigatório');
      expect(error.params).toEqual({ field: 'Email' });
    });
  });

  describe('setLocale / getLocale', () => {
    it('should change locale', () => {
      expect(getLocale()).toBe('pt-BR');
      setLocale('en-US');
      expect(getLocale()).toBe('en-US');
    });

    it('should ignore unsupported locale', () => {
      setLocale('ja-JP');
      expect(getLocale()).toBe('pt-BR');
    });
  });
});
