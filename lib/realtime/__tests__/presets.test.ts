import { describe, it, expect } from 'vitest';

// Mock useRealtimeSync since it depends on Supabase channels
vi.mock('../useRealtimeSync', () => ({
  useRealtimeSync: vi.fn(),
}));

import { vi } from 'vitest';
import { getPresetTables, REALTIME_PRESETS } from '../presets';

describe('realtime presets', () => {
  describe('REALTIME_PRESETS', () => {
    it('should have all expected presets', () => {
      expect(REALTIME_PRESETS.contacts).toContain('contacts');
      expect(REALTIME_PRESETS.deals).toContain('deals');
      expect(REALTIME_PRESETS.kanban).toContain('deals');
      expect(REALTIME_PRESETS.activities).toContain('activities');
      expect(REALTIME_PRESETS.boards).toContain('boards');
      expect(REALTIME_PRESETS.all).toContain('deals');
    });
  });

  describe('getPresetTables', () => {
    it('should return contacts tables', () => {
      const tables = getPresetTables('contacts');
      expect(tables).toEqual(['contacts', 'crm_companies']);
    });

    it('should return kanban tables', () => {
      const tables = getPresetTables('kanban');
      expect(tables).toEqual(['deals', 'board_stages']);
    });

    it('should return all CRM tables', () => {
      const tables = getPresetTables('all');
      expect(tables).toHaveLength(5);
      expect(tables).toContain('deals');
      expect(tables).toContain('contacts');
      expect(tables).toContain('activities');
    });
  });
});
