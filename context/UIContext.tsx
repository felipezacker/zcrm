'use client';

import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import { usePersistedState } from '../hooks/usePersistedState';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';

// ============ TYPES ============

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface UIContextType {
  // Theme
  darkMode: boolean;
  toggleDarkMode: () => void;
  // Toast
  addToast: (message: string, type?: ToastType) => void;
  removeToast: (id: string) => void;
}

// ============ CONTEXT ============

const UIContext = createContext<UIContextType | undefined>(undefined);

// ============ PROVIDER ============

export const UIProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Theme
  const [darkMode, setDarkMode] = usePersistedState<boolean>('crm_dark_mode', true);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode(!darkMode);

  // Toast
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((message: string, type: ToastType = 'info') => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 3000);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const getToastRole = (type: ToastType): 'alert' | 'status' => {
    return type === 'error' ? 'alert' : 'status';
  };

  const getAriaLive = (type: ToastType): 'assertive' | 'polite' => {
    return type === 'error' ? 'assertive' : 'polite';
  };

  return (
    <UIContext.Provider value={{ darkMode, toggleDarkMode, addToast, removeToast }}>
      {children}
      <div
        className="fixed bottom-4 right-4 z-50 flex flex-col gap-2"
        role="region"
        aria-label="Notificações"
      >
        {toasts.map((toast) => (
          <div
            key={toast.id}
            role={getToastRole(toast.type)}
            aria-live={getAriaLive(toast.type)}
            aria-atomic="true"
            className={`flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg border transition-all animate-in slide-in-from-right-full duration-300 ${toast.type === 'success' ? 'bg-white dark:bg-slate-800 border-green-500 text-green-600 dark:text-green-400' :
              toast.type === 'error' ? 'bg-white dark:bg-slate-800 border-red-500 text-red-600 dark:text-red-400' :
                toast.type === 'warning' ? 'bg-white dark:bg-slate-800 border-yellow-500 text-yellow-600 dark:text-yellow-400' :
                  'bg-white dark:bg-slate-800 border-blue-500 text-blue-600 dark:text-blue-400'
              }`}
          >
            {toast.type === 'success' && <CheckCircle size={18} aria-hidden="true" />}
            {toast.type === 'error' && <AlertCircle size={18} aria-hidden="true" />}
            {toast.type === 'warning' && <AlertCircle size={18} aria-hidden="true" />}
            {toast.type === 'info' && <Info size={18} aria-hidden="true" />}
            <span className="text-sm font-medium text-slate-900 dark:text-white">{toast.message}</span>
            <button
              type="button"
              onClick={() => removeToast(toast.id)}
              aria-label={`Fechar notificação: ${toast.message}`}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 focus-visible-ring rounded p-0.5"
            >
              <X size={14} aria-hidden="true" />
            </button>
          </div>
        ))}
      </div>
    </UIContext.Provider>
  );
};

// ============ HOOKS ============

export const useUI = () => {
  const context = useContext(UIContext);
  if (context === undefined) {
    throw new Error('useUI must be used within a UIProvider');
  }
  return context;
};

// Backward-compatible hooks
export const useTheme = () => {
  const { darkMode, toggleDarkMode } = useUI();
  return { darkMode, toggleDarkMode };
};

export const useToast = () => {
  const { addToast, removeToast } = useUI();
  return { addToast, removeToast, showToast: addToast };
};

export const useOptionalToast = () => {
  const context = useContext(UIContext);
  const noop = () => { /* no-op */ };
  return {
    addToast: context?.addToast ?? noop,
    removeToast: context?.removeToast ?? noop,
    showToast: context?.addToast ?? noop,
  };
};
