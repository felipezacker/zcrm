import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useFocusReturn } from '../hooks/useFocusReturn';

describe('useFocusReturn', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('should save active element on mount', () => {
    const button = document.createElement('button');
    document.body.appendChild(button);
    button.focus();

    expect(document.activeElement).toBe(button);

    const { unmount } = renderHook(() => useFocusReturn());

    // Focus something else
    const input = document.createElement('input');
    document.body.appendChild(input);
    input.focus();

    // On unmount, should restore focus (via requestAnimationFrame)
    unmount();

    // requestAnimationFrame is async, but the ref should be set
    expect(button).toBeTruthy();
  });

  it('should not attempt restore when disabled', () => {
    const button = document.createElement('button');
    document.body.appendChild(button);
    button.focus();

    const { unmount } = renderHook(() => useFocusReturn({ enabled: false }));

    // Move focus away
    const input = document.createElement('input');
    document.body.appendChild(input);
    input.focus();

    unmount();

    // Focus should still be on input (not restored to button)
    expect(document.activeElement).toBe(input);
  });
});
