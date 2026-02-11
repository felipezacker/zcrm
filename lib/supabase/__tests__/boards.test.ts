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

import { boardsService, boardStagesService } from '../boards';

function createChain(result: { data?: unknown; error?: unknown; count?: number }) {
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

const MOCK_DB_BOARD = {
  id: 'board-1',
  organization_id: 'org-1',
  name: 'Vendas B2B',
  description: 'Pipeline de vendas',
  is_default: true,
  template: null,
  linked_lifecycle_stage: null,
  next_board_id: null,
  won_stage_id: 'stage-won',
  lost_stage_id: 'stage-lost',
  won_stay_in_stage: false,
  lost_stay_in_stage: false,
  goal_description: null,
  goal_kpi: null,
  goal_target_value: null,
  goal_type: null,
  agent_name: null,
  agent_role: null,
  agent_behavior: null,
  entry_trigger: null,
  automation_suggestions: null,
  position: 0,
  created_at: '2026-01-01T00:00:00Z',
  updated_at: '2026-01-01T00:00:00Z',
  owner_id: null,
};

const MOCK_DB_STAGE = {
  id: 'stage-1',
  organization_id: 'org-1',
  board_id: 'board-1',
  name: 'Qualificação',
  label: 'Qualificação',
  color: 'bg-blue-500',
  order: 0,
  is_default: true,
  linked_lifecycle_stage: null,
  created_at: '2026-01-01T00:00:00Z',
};

describe('boardsService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getAll', () => {
    it('should fetch boards with stages and transform', async () => {
      // getAll does Promise.all([boards, stages])
      let callCount = 0;
      mockFrom.mockImplementation(() => {
        callCount++;
        if (callCount === 1) {
          return createChain({ data: [MOCK_DB_BOARD], error: null });
        }
        return createChain({ data: [MOCK_DB_STAGE], error: null });
      });

      const result = await boardsService.getAll();

      expect(result.error).toBeNull();
      expect(result.data).toHaveLength(1);
      expect(result.data![0].name).toBe('Vendas B2B');
      expect(result.data![0].isDefault).toBe(true);
      expect(result.data![0].stages).toHaveLength(1);
      expect(result.data![0].stages[0].label).toBe('Qualificação');
    });

    it('should return error when boards query fails', async () => {
      mockFrom.mockReturnValue(
        createChain({ data: null, error: new Error('DB error') })
      );

      const result = await boardsService.getAll();

      expect(result.error).toBeTruthy();
      expect(result.data).toBeNull();
    });
  });

  describe('canDelete', () => {
    it('should return canDelete=true when no deals', async () => {
      mockFrom.mockReturnValue(
        createChain({ data: null, error: null, count: 0 })
      );

      const result = await boardsService.canDelete('board-1');

      expect(result.error).toBeNull();
      expect(result.canDelete).toBe(true);
      expect(result.dealCount).toBe(0);
    });

    it('should return canDelete=false when deals exist', async () => {
      mockFrom.mockReturnValue(
        createChain({ data: null, error: null, count: 5 })
      );

      const result = await boardsService.canDelete('board-1');

      expect(result.error).toBeNull();
      expect(result.canDelete).toBe(false);
      expect(result.dealCount).toBe(5);
    });
  });

  describe('updateStage', () => {
    it('should update stage fields', async () => {
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

      const result = await boardsService.updateStage('stage-1', {
        label: 'Nova Label',
        color: 'bg-red-500',
      });

      expect(result.error).toBeNull();
      expect(capturedUpdates.label).toBe('Nova Label');
      expect(capturedUpdates.color).toBe('bg-red-500');
    });
  });

  describe('deleteStage', () => {
    it('should block deletion when deals exist in stage', async () => {
      mockFrom.mockReturnValue(
        createChain({ data: null, error: null, count: 3 })
      );

      const result = await boardsService.deleteStage('stage-1');

      expect(result.error).toBeTruthy();
      expect(result.error!.message).toContain('3 deal(s)');
    });

    it('should delete stage when no deals', async () => {
      let callCount = 0;
      mockFrom.mockImplementation(() => {
        callCount++;
        if (callCount === 1) {
          // count query
          return createChain({ data: null, error: null, count: 0 });
        }
        // delete query
        return {
          delete: () => ({
            eq: () => Promise.resolve({ error: null }),
          }),
        };
      });

      const result = await boardsService.deleteStage('stage-1');

      expect(result.error).toBeNull();
    });
  });
});

describe('boardStagesService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getAll', () => {
    it('should fetch all stages', async () => {
      mockFrom.mockReturnValue(
        createChain({ data: [MOCK_DB_STAGE], error: null })
      );

      const result = await boardStagesService.getAll();

      expect(result.error).toBeNull();
      expect(result.data).toHaveLength(1);
    });
  });

  describe('getByBoardId', () => {
    it('should return empty array for empty boardId', async () => {
      const result = await boardStagesService.getByBoardId('');

      expect(result.error).toBeNull();
      expect(result.data).toEqual([]);
    });

    it('should fetch stages for a specific board', async () => {
      mockFrom.mockReturnValue(
        createChain({ data: [MOCK_DB_STAGE], error: null })
      );

      const result = await boardStagesService.getByBoardId('board-1');

      expect(result.error).toBeNull();
      expect(result.data).toHaveLength(1);
    });
  });
});
