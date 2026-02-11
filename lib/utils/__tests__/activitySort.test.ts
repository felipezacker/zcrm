import { describe, it, expect, vi, afterEach } from 'vitest';
import { sortActivitiesSmart } from '../activitySort';
import type { Activity } from '@/types';

function makeActivity(overrides: Partial<Activity> & { id: string; date: string }): Activity {
  return {
    organizationId: 'org-1',
    title: 'Test',
    type: 'TASK',
    completed: false,
    dealId: '',
    dealTitle: '',
    user: { name: 'Test', avatar: '' },
    ...overrides,
  } as Activity;
}

describe('sortActivitiesSmart', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it('should return empty array for empty input', () => {
    expect(sortActivitiesSmart([])).toEqual([]);
  });

  it('should sort overdue before today, today before future', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-02-10T12:00:00Z'));

    const overdue = makeActivity({ id: 'overdue', date: '2026-02-08T10:00:00Z' });
    const today = makeActivity({ id: 'today', date: '2026-02-10T14:00:00Z' });
    const future = makeActivity({ id: 'future', date: '2026-02-15T10:00:00Z' });

    const result = sortActivitiesSmart([future, today, overdue]);

    expect(result.map(a => a.id)).toEqual(['overdue', 'today', 'future']);
  });

  it('should sort overdue by oldest first (most urgent)', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-02-10T12:00:00Z'));

    const older = makeActivity({ id: 'old', date: '2026-02-05T10:00:00Z' });
    const recent = makeActivity({ id: 'recent', date: '2026-02-08T10:00:00Z' });

    const result = sortActivitiesSmart([recent, older]);

    expect(result.map(a => a.id)).toEqual(['old', 'recent']);
  });

  it('should sort today activities by time ascending', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-02-10T12:00:00Z'));

    const morning = makeActivity({ id: 'morning', date: '2026-02-10T09:00:00Z' });
    const afternoon = makeActivity({ id: 'afternoon', date: '2026-02-10T15:00:00Z' });
    const evening = makeActivity({ id: 'evening', date: '2026-02-10T20:00:00Z' });

    const result = sortActivitiesSmart([evening, morning, afternoon]);

    expect(result.map(a => a.id)).toEqual(['morning', 'afternoon', 'evening']);
  });

  it('should sort future activities by closest first', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-02-10T12:00:00Z'));

    const soon = makeActivity({ id: 'soon', date: '2026-02-11T10:00:00Z' });
    const later = makeActivity({ id: 'later', date: '2026-02-20T10:00:00Z' });
    const far = makeActivity({ id: 'far', date: '2026-03-01T10:00:00Z' });

    const result = sortActivitiesSmart([far, soon, later]);

    expect(result.map(a => a.id)).toEqual(['soon', 'later', 'far']);
  });

  it('should handle mixed activities correctly', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-02-10T12:00:00Z'));

    const activities = [
      makeActivity({ id: 'future-2', date: '2026-02-20T10:00:00Z' }),
      makeActivity({ id: 'overdue-1', date: '2026-02-05T10:00:00Z' }),
      makeActivity({ id: 'today-1', date: '2026-02-10T09:00:00Z' }),
      makeActivity({ id: 'future-1', date: '2026-02-12T10:00:00Z' }),
      makeActivity({ id: 'overdue-2', date: '2026-02-08T10:00:00Z' }),
      makeActivity({ id: 'today-2', date: '2026-02-10T16:00:00Z' }),
    ];

    const result = sortActivitiesSmart(activities);

    expect(result.map(a => a.id)).toEqual([
      'overdue-1', 'overdue-2',     // overdue: oldest first
      'today-1', 'today-2',         // today: earliest first
      'future-1', 'future-2',       // future: closest first
    ]);
  });
});
