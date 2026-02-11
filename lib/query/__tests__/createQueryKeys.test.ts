import { describe, it, expect } from 'vitest';
import { createQueryKeys, createExtendedQueryKeys } from '../createQueryKeys';

describe('createQueryKeys', () => {
  const keys = createQueryKeys('deals');

  it('should create all key', () => {
    expect(keys.all).toEqual(['deals']);
  });

  it('should create lists key', () => {
    expect(keys.lists()).toEqual(['deals', 'list']);
  });

  it('should create list key with filters', () => {
    const filters = { status: 'open', boardId: '123' };
    expect(keys.list(filters)).toEqual(['deals', 'list', filters]);
  });

  it('should create details key', () => {
    expect(keys.details()).toEqual(['deals', 'detail']);
  });

  it('should create detail key with id', () => {
    expect(keys.detail('deal-123')).toEqual(['deals', 'detail', 'deal-123']);
  });
});

describe('createExtendedQueryKeys', () => {
  const keys = createExtendedQueryKeys('activities', (base) => ({
    byDeal: (dealId: string) => [...base.all, 'byDeal', dealId] as const,
    pending: () => [...base.all, 'pending'] as const,
  }));

  it('should include base keys', () => {
    expect(keys.all).toEqual(['activities']);
    expect(keys.lists()).toEqual(['activities', 'list']);
  });

  it('should include extended keys', () => {
    expect(keys.byDeal('deal-1')).toEqual(['activities', 'byDeal', 'deal-1']);
    expect(keys.pending()).toEqual(['activities', 'pending']);
  });
});
