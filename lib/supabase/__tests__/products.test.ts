import { describe, it, expect, vi, beforeEach } from 'vitest';

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

import { productsService } from '../products';

function createChain(result: { data?: unknown; error?: unknown }) {
  const handler: ProxyHandler<object> = {
    get(_target, prop) {
      if (prop === 'then') {
        return (resolve: (v: unknown) => void) => resolve(result);
      }
      if (prop === 'single') {
        return () => Promise.resolve(result);
      }
      return () => new Proxy({}, handler);
    },
  };
  return new Proxy({}, handler);
}

const MOCK_DB_PRODUCT = {
  id: 'prod-1',
  organization_id: 'org-1',
  name: 'Licença Anual',
  description: 'Licença de uso por 12 meses',
  price: 1200,
  sku: 'LIC-001',
  active: true,
  created_at: '2026-01-01T00:00:00Z',
  updated_at: '2026-01-01T00:00:00Z',
  owner_id: null,
};

describe('productsService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getAll', () => {
    it('should fetch and transform all products', async () => {
      mockFrom.mockReturnValue(
        createChain({ data: [MOCK_DB_PRODUCT], error: null })
      );

      const result = await productsService.getAll();

      expect(result.error).toBeNull();
      expect(result.data).toHaveLength(1);
      expect(result.data[0].name).toBe('Licença Anual');
      expect(result.data[0].price).toBe(1200);
      expect(result.data[0].sku).toBe('LIC-001');
      expect(result.data[0].active).toBe(true);
    });

    it('should return empty array on error', async () => {
      mockFrom.mockReturnValue(
        createChain({ data: null, error: new Error('DB error') })
      );

      const result = await productsService.getAll();

      expect(result.error).toBeTruthy();
      expect(result.data).toEqual([]);
    });
  });

  describe('getActive', () => {
    it('should fetch only active products', async () => {
      mockFrom.mockReturnValue(
        createChain({ data: [MOCK_DB_PRODUCT], error: null })
      );

      const result = await productsService.getActive();

      expect(result.error).toBeNull();
      expect(result.data).toHaveLength(1);
    });
  });

  describe('update', () => {
    it('should update product fields', async () => {
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

      const result = await productsService.update('prod-1', {
        name: 'Novo Nome',
        price: 1500,
        active: false,
      });

      expect(result.error).toBeNull();
      expect(capturedUpdates.name).toBe('Novo Nome');
      expect(capturedUpdates.price).toBe(1500);
      expect(capturedUpdates.active).toBe(false);
      expect(capturedUpdates.updated_at).toBeTruthy();
    });
  });

  describe('delete', () => {
    it('should delete product by id', async () => {
      const chain = {
        delete: () => ({
          eq: () => Promise.resolve({ error: null }),
        }),
      };
      mockFrom.mockReturnValue(chain);

      const result = await productsService.delete('prod-1');

      expect(result.error).toBeNull();
    });
  });
});
