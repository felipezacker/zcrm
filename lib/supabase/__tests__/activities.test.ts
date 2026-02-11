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

vi.mock('@/lib/utils/activitySort', () => ({
  sortActivitiesSmart: (activities: unknown[]) => activities,
}));

import { activitiesService } from '../activities';

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

describe('activitiesService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getAll', () => {
    it('should fetch and transform activities', async () => {
      mockFrom.mockReturnValue(
        createChain({
          data: [
            {
              id: 'act-1',
              organization_id: 'org-1',
              title: 'Ligar para cliente',
              description: null,
              type: 'CALL',
              date: '2026-02-10T14:00:00Z',
              completed: false,
              deal_id: 'deal-1',
              contact_id: null,
              created_at: '2026-01-01T00:00:00Z',
              owner_id: null,
              deals: { title: 'Deal Teste' },
            },
          ],
          error: null,
        })
      );

      const result = await activitiesService.getAll();

      expect(result.error).toBeNull();
      expect(result.data).toHaveLength(1);
      expect(result.data![0].title).toBe('Ligar para cliente');
      expect(result.data![0].type).toBe('CALL');
      expect(result.data![0].dealTitle).toBe('Deal Teste');
    });

    it('should return error on failure', async () => {
      mockFrom.mockReturnValue(
        createChain({ data: null, error: new Error('DB error') })
      );

      const result = await activitiesService.getAll();

      expect(result.error).toBeTruthy();
      expect(result.data).toBeNull();
    });
  });

  describe('delete', () => {
    it('should delete activity by id', async () => {
      let capturedId = '';
      const chain = {
        delete: () => ({
          eq: (_field: string, id: string) => {
            capturedId = id;
            return Promise.resolve({ error: null });
          },
        }),
      };
      mockFrom.mockReturnValue(chain);

      const result = await activitiesService.delete('act-1');

      expect(result.error).toBeNull();
      expect(capturedId).toBe('act-1');
    });
  });

  describe('update', () => {
    it('should update activity fields', async () => {
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

      const result = await activitiesService.update('act-1', {
        title: 'Updated Title',
        completed: true,
      });

      expect(result.error).toBeNull();
      expect(capturedUpdates.title).toBe('Updated Title');
      expect(capturedUpdates.completed).toBe(true);
    });
  });

  describe('toggleCompletion', () => {
    it('should toggle from false to true', async () => {
      // First call: select to get current state
      // Second call: update with new state
      let callCount = 0;
      mockFrom.mockImplementation(() => {
        callCount++;
        if (callCount === 1) {
          // select().eq().single() → { completed: false }
          return {
            select: () => ({
              eq: () => ({
                single: () => Promise.resolve({ data: { completed: false }, error: null }),
              }),
            }),
          };
        }
        // update().eq()
        return {
          update: () => ({
            eq: () => Promise.resolve({ error: null }),
          }),
        };
      });

      const result = await activitiesService.toggleCompletion('act-1');

      expect(result.error).toBeNull();
      expect(result.data).toBe(true);
    });

    it('should toggle from true to false', async () => {
      let callCount = 0;
      mockFrom.mockImplementation(() => {
        callCount++;
        if (callCount === 1) {
          return {
            select: () => ({
              eq: () => ({
                single: () => Promise.resolve({ data: { completed: true }, error: null }),
              }),
            }),
          };
        }
        return {
          update: () => ({
            eq: () => Promise.resolve({ error: null }),
          }),
        };
      });

      const result = await activitiesService.toggleCompletion('act-1');

      expect(result.error).toBeNull();
      expect(result.data).toBe(false);
    });
  });
});
