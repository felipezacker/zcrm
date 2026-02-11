import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { act } from '@testing-library/react';
import { useUIStore, useFormStore, useNotificationStore } from '../index';

describe('useUIStore', () => {
  beforeEach(() => {
    // Reset store to defaults
    useUIStore.setState({
      sidebarOpen: true,
      aiAssistantOpen: false,
      activeModal: null,
      modalData: {},
      globalSearchQuery: '',
      loadingStates: {},
    });
  });

  describe('sidebar', () => {
    it('should toggle sidebar', () => {
      expect(useUIStore.getState().sidebarOpen).toBe(true);

      act(() => useUIStore.getState().toggleSidebar());
      expect(useUIStore.getState().sidebarOpen).toBe(false);

      act(() => useUIStore.getState().toggleSidebar());
      expect(useUIStore.getState().sidebarOpen).toBe(true);
    });
  });

  describe('AI assistant', () => {
    it('should set AI assistant open state', () => {
      act(() => useUIStore.getState().setAIAssistantOpen(true));
      expect(useUIStore.getState().aiAssistantOpen).toBe(true);

      act(() => useUIStore.getState().setAIAssistantOpen(false));
      expect(useUIStore.getState().aiAssistantOpen).toBe(false);
    });

    it('should toggle AI assistant', () => {
      act(() => useUIStore.getState().toggleAIAssistant());
      expect(useUIStore.getState().aiAssistantOpen).toBe(true);

      act(() => useUIStore.getState().toggleAIAssistant());
      expect(useUIStore.getState().aiAssistantOpen).toBe(false);
    });
  });

  describe('modals', () => {
    it('should open and close modals', () => {
      act(() => useUIStore.getState().openModal('deal-form', { dealId: '123' }));

      expect(useUIStore.getState().activeModal).toBe('deal-form');
      expect(useUIStore.getState().modalData).toEqual({ dealId: '123' });

      act(() => useUIStore.getState().closeModal());

      expect(useUIStore.getState().activeModal).toBeNull();
      expect(useUIStore.getState().modalData).toEqual({});
    });

    it('should open modal without data', () => {
      act(() => useUIStore.getState().openModal('confirm-delete'));
      expect(useUIStore.getState().activeModal).toBe('confirm-delete');
      expect(useUIStore.getState().modalData).toEqual({});
    });
  });

  describe('search', () => {
    it('should set global search query', () => {
      act(() => useUIStore.getState().setGlobalSearchQuery('test query'));
      expect(useUIStore.getState().globalSearchQuery).toBe('test query');
    });
  });

  describe('loading states', () => {
    it('should set and check loading states', () => {
      act(() => useUIStore.getState().setLoading('deals', true));
      expect(useUIStore.getState().isLoading('deals')).toBe(true);
      expect(useUIStore.getState().isLoading('contacts')).toBe(false);

      act(() => useUIStore.getState().setLoading('deals', false));
      expect(useUIStore.getState().isLoading('deals')).toBe(false);
    });
  });
});

describe('useFormStore', () => {
  beforeEach(() => {
    useFormStore.setState({
      drafts: {},
      submitting: {},
    });
  });

  describe('drafts', () => {
    it('should save and retrieve draft', () => {
      const formData = { title: 'New Deal', value: 1000 };

      act(() => useFormStore.getState().saveDraft('deal-form', formData));

      const draft = useFormStore.getState().getDraft('deal-form');
      expect(draft).not.toBeNull();
      expect(draft!.data).toEqual(formData);
      expect(draft!.savedAt).toBeGreaterThan(0);
    });

    it('should return null for non-existent draft', () => {
      expect(useFormStore.getState().getDraft('nonexistent')).toBeNull();
    });

    it('should clear specific draft', () => {
      act(() => useFormStore.getState().saveDraft('form-1', { a: 1 }));
      act(() => useFormStore.getState().saveDraft('form-2', { b: 2 }));

      act(() => useFormStore.getState().clearDraft('form-1'));

      expect(useFormStore.getState().getDraft('form-1')).toBeNull();
      expect(useFormStore.getState().getDraft('form-2')).not.toBeNull();
    });

    it('should clear all drafts', () => {
      act(() => useFormStore.getState().saveDraft('form-1', { a: 1 }));
      act(() => useFormStore.getState().saveDraft('form-2', { b: 2 }));

      act(() => useFormStore.getState().clearAllDrafts());

      expect(useFormStore.getState().getDraft('form-1')).toBeNull();
      expect(useFormStore.getState().getDraft('form-2')).toBeNull();
    });
  });

  describe('submitting', () => {
    it('should track submission state', () => {
      expect(useFormStore.getState().isSubmitting('deal-form')).toBe(false);

      act(() => useFormStore.getState().setSubmitting('deal-form', true));
      expect(useFormStore.getState().isSubmitting('deal-form')).toBe(true);

      act(() => useFormStore.getState().setSubmitting('deal-form', false));
      expect(useFormStore.getState().isSubmitting('deal-form')).toBe(false);
    });
  });
});

describe('useNotificationStore', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    useNotificationStore.setState({ notifications: [] });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should add notification and return id', () => {
    let id: string;
    act(() => {
      id = useNotificationStore.getState().addNotification({
        type: 'success',
        title: 'Salvo!',
        duration: 0, // Persistent
      });
    });

    expect(id!).toBeTruthy();
    expect(useNotificationStore.getState().notifications).toHaveLength(1);
    expect(useNotificationStore.getState().notifications[0].title).toBe('Salvo!');
  });

  it('should remove notification by id', () => {
    let id: string;
    act(() => {
      id = useNotificationStore.getState().addNotification({
        type: 'info',
        title: 'Test',
        duration: 0,
      });
    });

    act(() => useNotificationStore.getState().removeNotification(id!));
    expect(useNotificationStore.getState().notifications).toHaveLength(0);
  });

  it('should clear all notifications', () => {
    act(() => {
      useNotificationStore.getState().addNotification({ type: 'info', title: 'A', duration: 0 });
      useNotificationStore.getState().addNotification({ type: 'error', title: 'B', duration: 0 });
    });

    act(() => useNotificationStore.getState().clearAll());
    expect(useNotificationStore.getState().notifications).toHaveLength(0);
  });

  it('should auto-remove after duration', () => {
    act(() => {
      useNotificationStore.getState().addNotification({
        type: 'success',
        title: 'Auto-remove',
        duration: 3000,
      });
    });

    expect(useNotificationStore.getState().notifications).toHaveLength(1);

    act(() => vi.advanceTimersByTime(3000));

    expect(useNotificationStore.getState().notifications).toHaveLength(0);
  });
});
