import { describe, it, expect, vi, beforeEach } from 'vitest';

// Must use vi.hoisted for variables referenced inside vi.mock factory
const { mockFrom, mockAuth } = vi.hoisted(() => ({
  mockFrom: vi.fn(),
  mockAuth: { getUser: vi.fn() },
}));

vi.mock('../client', () => ({
  supabase: {
    from: (...args: unknown[]) => mockFrom(...args),
    auth: mockAuth,
  },
}));

// Import AFTER mock setup
import { dealsService, DbDeal, DbDealItem } from '../deals';

// Helper: creates a chainable mock that resolves to `result` on await
function createChain(result: { data?: unknown; error?: unknown }) {
  const handler: ProxyHandler<object> = {
    get(_target, prop) {
      // Make it thenable so `await chain` resolves to result
      if (prop === 'then') {
        return (resolve: (v: unknown) => void) => resolve(result);
      }
      // Any method call returns the same proxy (chainable)
      return () => new Proxy({}, handler);
    },
  };
  return new Proxy({}, handler);
}

const MOCK_DB_DEAL: DbDeal = {
  id: '550e8400-e29b-41d4-a716-446655440000',
  organization_id: '660e8400-e29b-41d4-a716-446655440000',
  title: 'Test Deal',
  value: 10000,
  probability: 50,
  status: null,
  priority: 'medium',
  board_id: '770e8400-e29b-41d4-a716-446655440000',
  stage_id: '880e8400-e29b-41d4-a716-446655440000',
  contact_id: '990e8400-e29b-41d4-a716-446655440000',
  client_company_id: null,
  ai_summary: null,
  loss_reason: null,
  tags: ['crm'],
  last_stage_change_date: null,
  custom_fields: {},
  created_at: '2026-01-01T00:00:00Z',
  updated_at: '2026-01-01T00:00:00Z',
  owner_id: null,
  is_won: false,
  is_lost: false,
  closed_at: null,
};

const MOCK_DB_ITEM: DbDealItem = {
  id: 'item-001',
  organization_id: '660e8400-e29b-41d4-a716-446655440000',
  deal_id: '550e8400-e29b-41d4-a716-446655440000',
  product_id: null,
  name: 'Licença Anual',
  quantity: 2,
  price: 5000,
  created_at: '2026-01-01T00:00:00Z',
};

describe('dealsService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getAll', () => {
    it('should fetch all deals and transform them', async () => {
      mockFrom.mockReturnValue(
        createChain({
          data: [{ ...MOCK_DB_DEAL, deal_items: [MOCK_DB_ITEM] }],
          error: null,
        })
      );

      const result = await dealsService.getAll();

      expect(result.error).toBeNull();
      expect(result.data).toHaveLength(1);
      expect(result.data![0].title).toBe('Test Deal');
      expect(result.data![0].value).toBe(10000);
      expect(result.data![0].status).toBe('880e8400-e29b-41d4-a716-446655440000');
      expect(result.data![0].items).toHaveLength(1);
      expect(result.data![0].items[0].name).toBe('Licença Anual');
    });

    it('should return empty array when no deals', async () => {
      mockFrom.mockReturnValue(createChain({ data: [], error: null }));

      const result = await dealsService.getAll();

      expect(result.error).toBeNull();
      expect(result.data).toEqual([]);
    });

    it('should return error on supabase failure', async () => {
      mockFrom.mockReturnValue(
        createChain({ data: null, error: new Error('DB connection failed') })
      );

      const result = await dealsService.getAll();

      expect(result.data).toBeNull();
      expect(result.error).toBeTruthy();
    });
  });

  describe('markAsWon', () => {
    it('should set is_won=true, is_lost=false, and closed_at', async () => {
      let capturedUpdates: Record<string, unknown> = {};
      const chain = {
        update: (updates: Record<string, unknown>) => {
          capturedUpdates = updates;
          return {
            eq: () => Promise.resolve({ error: null }),
          };
        },
      };
      mockFrom.mockReturnValue(chain);

      const result = await dealsService.markAsWon('deal-123');

      expect(result.error).toBeNull();
      expect(capturedUpdates.is_won).toBe(true);
      expect(capturedUpdates.is_lost).toBe(false);
      expect(capturedUpdates.closed_at).toBeTruthy();
      expect(capturedUpdates.updated_at).toBeTruthy();
    });
  });

  describe('markAsLost', () => {
    it('should set is_lost=true, is_won=false, closed_at, and loss_reason', async () => {
      let capturedUpdates: Record<string, unknown> = {};
      const chain = {
        update: (updates: Record<string, unknown>) => {
          capturedUpdates = updates;
          return {
            eq: () => Promise.resolve({ error: null }),
          };
        },
      };
      mockFrom.mockReturnValue(chain);

      const result = await dealsService.markAsLost('deal-123', 'Preço alto');

      expect(result.error).toBeNull();
      expect(capturedUpdates.is_lost).toBe(true);
      expect(capturedUpdates.is_won).toBe(false);
      expect(capturedUpdates.loss_reason).toBe('Preço alto');
      expect(capturedUpdates.closed_at).toBeTruthy();
    });

    it('should not set loss_reason when not provided', async () => {
      let capturedUpdates: Record<string, unknown> = {};
      const chain = {
        update: (updates: Record<string, unknown>) => {
          capturedUpdates = updates;
          return {
            eq: () => Promise.resolve({ error: null }),
          };
        },
      };
      mockFrom.mockReturnValue(chain);

      await dealsService.markAsLost('deal-123');

      expect(capturedUpdates.loss_reason).toBeUndefined();
    });
  });

  describe('reopen', () => {
    it('should clear is_won, is_lost, and closed_at', async () => {
      let capturedUpdates: Record<string, unknown> = {};
      const chain = {
        update: (updates: Record<string, unknown>) => {
          capturedUpdates = updates;
          return {
            eq: () => Promise.resolve({ error: null }),
          };
        },
      };
      mockFrom.mockReturnValue(chain);

      const result = await dealsService.reopen('deal-123');

      expect(result.error).toBeNull();
      expect(capturedUpdates.is_won).toBe(false);
      expect(capturedUpdates.is_lost).toBe(false);
      expect(capturedUpdates.closed_at).toBeNull();
    });
  });

  describe('delete', () => {
    it('should delete deal by id', async () => {
      let capturedId: string = '';
      const chain = {
        delete: () => ({
          eq: (_field: string, id: string) => {
            capturedId = id;
            return Promise.resolve({ error: null });
          },
        }),
      };
      mockFrom.mockReturnValue(chain);

      const result = await dealsService.delete('deal-123');

      expect(result.error).toBeNull();
      expect(capturedId).toBe('deal-123');
    });
  });

  describe('update', () => {
    it('should handle duplicate title error', async () => {
      const chain = {
        update: () => ({
          eq: () =>
            Promise.resolve({
              error: { code: '23505', message: 'unique_violation' },
            }),
        }),
      };
      mockFrom.mockReturnValue(chain);

      const result = await dealsService.update('deal-123', { title: 'Duplicate Title' });

      expect(result.error).toBeTruthy();
      expect(result.error!.message).toContain('Já existe um negócio');
    });
  });
});
