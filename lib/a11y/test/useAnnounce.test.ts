import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useAnnounce } from '../hooks/useAnnounce';

describe('useAnnounce', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should create a live region on first announce', () => {
    const { result } = renderHook(() => useAnnounce());

    act(() => {
      result.current('Test message');
    });

    const region = document.getElementById('live-region-polite');
    expect(region).toBeTruthy();
    expect(region?.getAttribute('aria-live')).toBe('polite');
    expect(region?.getAttribute('role')).toBe('status');
  });

  it('should create assertive region when mode is assertive', () => {
    const { result } = renderHook(() => useAnnounce({ mode: 'assertive' }));

    act(() => {
      result.current('Alert!');
    });

    const region = document.getElementById('live-region-assertive');
    expect(region).toBeTruthy();
    expect(region?.getAttribute('aria-live')).toBe('assertive');
    expect(region?.getAttribute('role')).toBe('alert');
  });

  it('should reuse existing live region', () => {
    const { result } = renderHook(() => useAnnounce());

    act(() => {
      result.current('First');
    });
    act(() => {
      result.current('Second');
    });

    const regions = document.querySelectorAll('#live-region-polite');
    expect(regions).toHaveLength(1);
  });
});
