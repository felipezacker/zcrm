import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useKeyboardShortcut } from '../hooks/useKeyboardShortcut';

function fireKey(key: string, modifiers: Partial<KeyboardEventInit> = {}) {
  const event = new KeyboardEvent('keydown', {
    key,
    code: key,
    bubbles: true,
    ...modifiers,
  });
  document.dispatchEvent(event);
  return event;
}

describe('useKeyboardShortcut', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('should call handler on matching key press', () => {
    const handler = vi.fn();
    renderHook(() => useKeyboardShortcut({ key: 'Escape' }, handler));

    fireKey('Escape');

    expect(handler).toHaveBeenCalledOnce();
  });

  it('should not call handler for non-matching key', () => {
    const handler = vi.fn();
    renderHook(() => useKeyboardShortcut({ key: 'Escape' }, handler));

    fireKey('Enter');

    expect(handler).not.toHaveBeenCalled();
  });

  it('should handle ctrl modifier', () => {
    const handler = vi.fn();
    renderHook(() => useKeyboardShortcut({ key: 'k', ctrl: true }, handler));

    // Without ctrl - should not fire
    fireKey('k');
    expect(handler).not.toHaveBeenCalled();

    // With ctrl - should fire
    fireKey('k', { ctrlKey: true });
    expect(handler).toHaveBeenCalledOnce();
  });

  it('should not call handler when disabled', () => {
    const handler = vi.fn();
    renderHook(() =>
      useKeyboardShortcut({ key: 'Escape' }, handler, { enabled: false })
    );

    fireKey('Escape');

    expect(handler).not.toHaveBeenCalled();
  });

  it('should cleanup listener on unmount', () => {
    const handler = vi.fn();
    const { unmount } = renderHook(() =>
      useKeyboardShortcut({ key: 'Escape' }, handler)
    );

    unmount();
    fireKey('Escape');

    expect(handler).not.toHaveBeenCalled();
  });
});
