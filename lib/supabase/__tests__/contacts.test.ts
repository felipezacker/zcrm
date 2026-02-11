import { describe, it, expect, vi, beforeEach } from 'vitest';

const { mockFrom, mockRpc, mockAuth } = vi.hoisted(() => ({
  mockFrom: vi.fn(),
  mockRpc: vi.fn(),
  mockAuth: { getUser: vi.fn() },
}));

vi.mock('../client', () => ({
  supabase: {
    from: (...args: unknown[]) => mockFrom(...args),
    rpc: (...args: unknown[]) => mockRpc(...args),
    auth: mockAuth,
  },
}));

import { contactsService, companiesService } from '../contacts';

function createChain(result: { data?: unknown; error?: unknown; count?: number }) {
  const handler: ProxyHandler<object> = {
    get(_target, prop) {
      if (prop === 'then') {
        return (resolve: (v: unknown) => void) => resolve(result);
      }
      // .single() also resolves to result
      if (prop === 'single') {
        return () => Promise.resolve(result);
      }
      // Any other method call returns the same proxy (chainable)
      return () => new Proxy({}, handler);
    },
  };
  return new Proxy({}, handler);
}

describe('contactsService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getAll', () => {
    it('should fetch all contacts', async () => {
      mockFrom.mockReturnValue(
        createChain({
          data: [
            {
              id: 'c-1',
              organization_id: 'org-1',
              name: 'João Silva',
              email: 'joao@test.com',
              phone: '+5511999999999',
              stage: 'LEAD',
              status: 'active',
              tags: ['vip'],
              custom_fields: {},
              created_at: '2026-01-01T00:00:00Z',
              updated_at: '2026-01-01T00:00:00Z',
            },
          ],
          error: null,
        })
      );

      const result = await contactsService.getAll();

      expect(result.error).toBeNull();
      expect(result.data).toHaveLength(1);
      expect(result.data![0].name).toBe('João Silva');
    });

    it('should return error on failure', async () => {
      mockFrom.mockReturnValue(createChain({ data: null, error: new Error('DB error') }));

      const result = await contactsService.getAll();

      expect(result.error).toBeTruthy();
      expect(result.data).toBeNull();
    });
  });

  describe('getStageCounts', () => {
    it('should call RPC for stage counts', async () => {
      mockRpc.mockResolvedValue({
        data: [
          { stage: 'LEAD', count: 10 },
          { stage: 'MQL', count: 5 },
          { stage: 'CUSTOMER', count: 3 },
        ],
        error: null,
      });

      const result = await contactsService.getStageCounts();

      expect(result.error).toBeNull();
      expect(mockRpc).toHaveBeenCalled();
    });
  });

  describe('delete', () => {
    it('should delete contact and orphaned activities', async () => {
      const deletedTables: string[] = [];
      mockFrom.mockImplementation((table: string) => {
        deletedTables.push(table);
        return createChain({ data: null, error: null });
      });

      const result = await contactsService.delete('c-1');

      expect(result.error).toBeNull();
      // Should delete from activities first, then contacts
      expect(deletedTables).toContain('activities');
      expect(deletedTables).toContain('contacts');
    });
  });

  describe('hasDeals', () => {
    it('should return true when contact has deals', async () => {
      mockFrom.mockReturnValue(
        createChain({ data: [{ id: 'deal-1', title: 'Deal 1' }], error: null, count: 1 })
      );

      const result = await contactsService.hasDeals('c-1');

      expect(result.error).toBeNull();
      expect(result.hasDeals).toBe(true);
      expect(result.dealCount).toBe(1);
    });

    it('should return false when contact has no deals', async () => {
      mockFrom.mockReturnValue(createChain({ data: [], error: null, count: 0 }));

      const result = await contactsService.hasDeals('c-1');

      expect(result.error).toBeNull();
      expect(result.hasDeals).toBe(false);
      expect(result.dealCount).toBe(0);
    });
  });
});

describe('companiesService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getAll', () => {
    it('should fetch all companies', async () => {
      mockFrom.mockReturnValue(
        createChain({
          data: [
            {
              id: 'comp-1',
              organization_id: 'org-1',
              name: 'Empresa XYZ',
              created_at: '2026-01-01T00:00:00Z',
              updated_at: '2026-01-01T00:00:00Z',
            },
          ],
          error: null,
        })
      );

      const result = await companiesService.getAll();

      expect(result.error).toBeNull();
      expect(result.data).toHaveLength(1);
    });
  });

  describe('delete', () => {
    it('should unlink contacts and deals before deleting company', async () => {
      const operations: string[] = [];
      mockFrom.mockImplementation((table: string) => {
        operations.push(table);
        return createChain({ data: null, error: null });
      });

      const result = await companiesService.delete('comp-1');

      expect(result.error).toBeNull();
      // Should unlink contacts and deals, then delete company
      expect(operations.some(t => t === 'contacts' || t === 'deals')).toBe(true);
      expect(operations).toContain('crm_companies');
    });
  });
});
